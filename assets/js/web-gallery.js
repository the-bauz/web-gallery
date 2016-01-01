var tbwg = {
  selector: false,
  galleryContent: false,
  options: {
    arrows: true,
    closeOnOverlayClick: true,
    captureKeyboard: true,
    cssTransitions: true, //If false Javascript animation will be used
    gridSize: 3, //default gridSize will be defined as biggest breakpoint if user sets custom breakpoints
    breakpoints: {
      420: 1,
      640: 2,
      960: 3
    }
  },
  callbacks:{
    openItem: false,
    closeItem: false,
    nextItem: false,
    prevItem: false,
    gridResize: false
  },
  lastResize: -1,
  childs: false,
  overlayId: false,
  init: function(selector, options){
    if(typeof selector == 'undefined'){
      console.info('To use the Web Gallery from the-bauz you need to pass a CSS Selector');
      return this;
    } else if(typeof jQuery == 'undefined'){
      console.info('To use the Web Gallery from the-bauz you need implement the jQuery Libary');
      return this;
    } else if(typeof options != 'undefined' && typeof options != 'object'){
      console.info('The Options for the Web Gallery from the-bauz need to be an Javascript object');
      return this;
    } else if(typeof options != 'undefined'){
      this.setSelector.call(this, selector);
      this.setOptions.call(this, options);
    } else {
      this.setSelector.call(this, selector);
    }
    //SET GRID SIZE VIA CSS
    if(typeof this.options.gridSize == 'number'){
      this.setGridSize.call(this, this.options.gridSize);
    } else {
      //GridSize was not set but the default was overwritten or the type of the gridsize set by the user is not a numer -> invalid
      this.setGridSize.call(this, 3);
    }

    this.setChilds.apply(this);
    this.setUp.overlay.apply(this);
    this.events.openItem.setEvt.apply(this);
    this.events.prevItem.setEvt.apply(this);
    this.events.nextItem.setEvt.apply(this);
    this.events.gridResize.setEvt.apply(this);

    this.events.gridResize.func(this, jQuery(window).width());
    return this;
  },
  on:{
    openItem:function(callback){
      if(typeof callback == 'function'){
        this.callbacks.openItem = callback;
      }
      return this;
    },
    closeItem: function(callback){
      if(typeof callback == 'function'){
        this.callbacks.closeItem = callback;
      }
      return this;
    },
    nextItem: function(callback){
      if(typeof callback == 'function'){
        this.callbacks.nextItem = callback;
      }
      return this;
    },
    prevItem: function(callback){
      if(typeof callback == 'function'){
        this.callbacks.prevItem = callback;
      }
      return this;
    },
    gridResize:function(callback){
      if(typeof callback == 'function'){
        this.callbacks.gridResize = callback;
      }
      return this;
    }
  },
  events:{
    openItem:{
      setEvt: function(){
        this.selector.on('click.tbwg.openItem','.tb-web-gallery-item', { currentInstance: this },function(event){
          var me = event.data.currentInstance; //The Object in which the event was triggert
          me.events.openItem.func(me, this);
        });
      },
      func: function(me, clicked){
        if(me.options.arrows){
          jQuery('body').addClass('tbwg-open');
        } else {
          jQuery('body').addClass('tbwg-open no-arrows');
        }
        if(me.options.closeOnOverlayClick){
          jQuery('#tbwg-overlay').on('click.currentClose', '.tbwg-dimmer', { currentInstance: me }, function(event){
            var me = event.data.currentInstance;
            me.events.closeItem.func(me);
          });
        }
        if(me.options.captureKeyboard){
          jQuery(document).on('keydown.tbwg', null, { currentInstance: me }, function(event) {
            var me = event.data.currentInstance;
            switch(event.which) {
                case 37: // left
                  me.events.prevItem.func(me);
                break;

                case 39: // right
                  me.events.nextItem.func(me);
                break;
              }
            });
        }
        me.events.closeItem.setEvt.apply(me);
        jQuery('.'+me.overlayId).attr('style', '').css({left: '-'+(me.childs.index(jQuery(clicked))*100)+'vw', transition: 'left 0.8s ease-out'}).removeClass('inactive').addClass('active').siblings().addClass('inactive').removeClass('active');

        if(me.callbacks.openItem){
          me.callbacks.openItem();
        }
      }
    },
    closeItem: {
      setEvt: function(){
        jQuery('#tbwg-overlay').on('click.tbwg.'+this.overlayId.substr(this.overlayId.length - 8)+'.closeItem', '#tbwgClose', { currentInstance: this }, function(event){
          var me = event.data.currentInstance; //The Object in which the event was triggert
          me.events.closeItem.func(me);
        });
      },
      rmvEvt: function(){
        if(jQuery._data( jQuery("#tbwg-overlay")[0], "events" )){
          if(typeof this.helper.searchArrayForObj(jQuery._data( jQuery("#tbwg-overlay")[0], "events" ).click, "namespace", this.overlayId.substr(this.overlayId.length - 8)) != 'undefined'){
            jQuery('#tbwg-overlay').off('click.tbwg.'+this.overlayId.substr(this.overlayId.length - 8)+'.closeItem', '#tbwgClose');
          }
        }
      },
      func: function(me){
        me.events.closeItem.rmvEvt.apply(me);
        jQuery('body').removeClass('tbwg-open no-arrows');
        jQuery('#tbwg-overlay').off('click.currentClose', '.tbwg-dimmer');
        jQuery(document).off('keydown.tbwg');
        if(me.callbacks.closeItem){
          me.callbacks.closeItem();
        }
      }
    },
    nextItem: {
      setEvt: function(){
        jQuery('#tbwg-overlay').on('click.tbwg.nextItem', '#tbwgNext', { currentInstance: this }, function(event){
          var me = event.data.currentInstance; //The Object in which the event was triggert
          me.events.nextItem.func(me);
        });
      },
      func: function(me){
        jQelem = jQuery('.'+me.overlayId);
        if(jQelem.hasClass('active')){
          if(!me.options.cssTransitions){
            var JSelem = document.getElementsByClassName(me.overlayId)[0],
                windowWidth = jQuery(window).width();
            var currentIndex = Math.round(Math.abs(parseInt(JSelem.offsetLeft))/windowWidth);
            if(me.childs.length > currentIndex+1){
              var duration = 120, // = 600 ms
                  currentFrame = 0;
              jQelem.attr('style', '');
              var animationInterval = setInterval(function(){
                JSelem.style.left = '-'+((currentIndex+(currentFrame/duration))*windowWidth)+'px';
                if(currentFrame >=  duration){
                  clearInterval(animationInterval);
                  jQelem.attr('style', 'left:-'+(currentIndex+1)*100+'vw');
                }
                currentFrame++;
              }, 5);
            }
          } else {
            jQelem.css('left',function(index, value){
              var currentIndex = Math.round(Math.abs(parseInt(value))/jQuery(window).width());
              if(me.childs.length > currentIndex+1){
                return '-'+((currentIndex+1)*100)+'vw';
              } else {
                return value;
              }
            });
          }
          if(me.callbacks.nextItem){
            me.callbacks.nextItem();
          }
        }
      }
    },
    prevItem: {
      setEvt: function(){
        jQuery('#tbwg-overlay').on('click.tbwg.prevItem', '#tbwgPrev', { currentInstance: this }, function(event){
          var me = event.data.currentInstance; //The Object in which the event was triggert
          me.events.prevItem.func(me);
        });
      },
      func: function(me){
        jQelem = jQuery('.'+me.overlayId);
        if(jQelem.hasClass('active')){
          if(!me.options.cssTransitions){
            var JSelem = document.getElementsByClassName(me.overlayId)[0],
                windowWidth = jQuery(window).width();
            var currentIndex = Math.round(Math.abs(parseInt(JSelem.offsetLeft))/windowWidth);
            if(currentIndex != 0){
              var duration = 120, // = 600 ms
                  currentFrame = 0;
              jQelem.attr('style', '');
              var animationInterval = setInterval(function(){
                JSelem.style.left = '-'+((currentIndex-(currentFrame/duration))*windowWidth)+'px';
                if(currentFrame >=  duration){
                  clearInterval(animationInterval);
                  jQelem.attr('style', 'left:-'+(currentIndex-1)*100+'vw');
                }
                currentFrame++;
              }, 5);
            }
          } else {
            jQelem.css('left',function(index, value){
              var currentIndex = Math.round(Math.abs(parseInt(value))/jQuery(window).width());
              if(currentIndex != 0){
                return '-'+((currentIndex-1)*100)+'vw';
              }
            });
          }
          if(me.callbacks.prevItem){
            me.callbacks.prevItem();
          }
        }
      }
    },
    gridResize: {
      setEvt: function(){
        if(this.helper.countObj(this.options.breakpoints) > 0){
          jQuery(window).resize({ currentInstance: this },function(event){
            var me = event.data.currentInstance, //The Object in which the event was triggert
                newWidth = jQuery(this).width();

            me.events.gridResize.func(me, newWidth);
          });
        }
      },
      func: function(me, newWidth){
        var keys = [],
            k;

        for (k in me.options.breakpoints) {
          if (me.options.breakpoints.hasOwnProperty(k)) {
            keys.push(k);
          }
        }

        keys.sort();

        var sBP = keys; //sorted Breakpoints
        for(var i = 0; i < sBP.length; i++){
          if(i == 0){
            if(newWidth <= sBP[0] && me.lastResize > sBP[0] || newWidth <= sBP[0] && me.lastResize == -1){
              me.setGridSize.call(me, me.options.breakpoints[sBP[0]]);
              if(me.callbacks.gridResize){
                me.callbacks.gridResize();
              }
            }
          } else {
            if (newWidth <= sBP[i] && me.lastResize > sBP[i] || newWidth > sBP[i-1] && me.lastResize <= sBP[i-1]) {
              me.setGridSize.call(me, me.options.breakpoints[sBP[i]]);
              if(me.callbacks.gridResize){
                me.callbacks.gridResize();
              }
            }
          }
        }
        me.lastResize = newWidth;
      }
    }
  },
  setUp:{
    overlay:function(){
      if(document.getElementById('tbwg-overlay')){
        var waitFunc = function(context){
          if(context.childs){
            var randomString = tbwg.helper.randomStr(8);
            var allContent = '';
            context.childs.each(function(){
              allContent += jQuery(this).html();
            });
            this.galleryContent = jQuery('<div class="tbwg-id-'+randomString+'">'+allContent+'</div>');
            jQuery('#tbwg-overlay .tbwg-content').append(this.galleryContent);
            context.overlayId = 'tbwg-id-'+randomString;
          } else {
            setTimeout(context.setUp.overlay(), 100);
          }
        };
        waitFunc(this);
      } else {
        var waitFunc = function(context){
          if(context.childs){
            var randomString = tbwg.helper.randomStr(8);
            var allContent = '';
            context.childs.each(function(){
              allContent += jQuery(this).html();
            });
            this.galleryContent = jQuery('<div id="tbwg-overlay"><div class="tbwg-dimmer"></div><div class="tbwg-content"><span id="tbwgClose">x</span><span id="tbwgNext">&#10095;</span><span id="tbwgPrev">&#10094;</span><div class="tbwg-id-'+randomString+'">'+allContent+'</div></div></div>');
            jQuery('body').append(this.galleryContent);
            context.overlayId = 'tbwg-id-'+randomString;
          } else {
            setTimeout(context.setUp.overlay(), 100);
          }
        };
        waitFunc(this);
      }
    }
  },
  helper:{
    randomStr:function(stringlength){
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for( var i=0; i < stringlength; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    },
    countObj: function(obj){
      var size = 0, key;
      for (key in obj) {
          if (obj.hasOwnProperty(key)) size++;
      }
      return size;
    },
    searchArrayForObj: function(arr, objKey, objVal){
      return arr.filter(function (obj) {
        if(obj[objKey] === objVal || obj[objKey].indexOf(objVal) > -1){
          return true;
        } else {
          return false;
        }
      })[0];
    }
  },
  setOptions: function(options){
    for (var key in options) {
      if (options.hasOwnProperty(key) && typeof this.options[key] != 'undefined') {
        if(key == 'breakpoints'){ //catch breakpoint issue
          var keys = [],
              k;

          for (k in options.breakpoints) {
            if (options.breakpoints.hasOwnProperty(k)) {
              keys.push(k);
            }
          }

          keys.sort();

          keys.push(parseInt(keys[keys.length-1])+1);
          if(typeof options.gridSize == 'undefined'){
            options.breakpoints[keys[keys.length-1]] = this.options.gridSize;
          } else {
            options.breakpoints[keys[keys.length-1]] = options.gridSize;
          }
        }
        this.options[key] = options[key];
      }
    }
    return this;
  },
  setSelector: function(selector){
    var jQselect = jQuery(selector);
    if(jQselect.length != 1){
      console.info('The Selector for the Web Gallery from the-bauz needs to be uniqe');
      return this;
    } else if(this.selector){
      this.selector.removeClass('tb-web-gallery');
    }
    jQselect.addClass('tb-web-gallery');
    this.selector = jQselect;
    return this;
  },
  setGridSize: function(newGridSize){
    this.selector[0].className = this.selector[0].className.replace(/\btbwb-grid-[0-9].*?\b/g, '');
    this.options.gridSize = newGridSize;
    this.selector.addClass('tbwb-grid-'+this.options.gridSize);
  },
  setChilds: function(){
    if(this.childs){ //Will only be executed if tbwg was called again on same elem
      this.selector.off('click.tbwg','.tb-web-gallery-item');
      this.childs.find('.tb-web-gallery-inner-wrap > *').unwrap();
      this.childs.removeClass('tb-web-gallery-item');
    }

    var childs = this.selector.children();
    childs.each(function(index){
      var chilchild = jQuery(this).children(),
          jQthis = jQuery(this);
      if(chilchild.length < 1){
        childs = childs.not(this);
      } else {
        if(jQthis.has('img').length != 0){
          chilchild.wrap( "<div class='tb-web-gallery-inner-wrap image-type'></div>" );
        } else if(jQthis.has('p').length != 0 || jQthis.has('span.txt').length != 0) {
          chilchild.wrap( "<div class='tb-web-gallery-inner-wrap text-type'></div>" );
        }

      }
    });
    childs.addClass('tb-web-gallery-item');
    this.childs = childs;
  }
};
