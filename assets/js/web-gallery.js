var tbwg = {
  selector: false,
  galleryContent: false,
  options: {
    gridSize: 3,
    breakpoints: {
      420: 1,
      640: 2,
      900: 3
    }
  },
  callbacks:{
    openItem: false,
    closeItem: false,
    gridResize: false
  },
  lastResize: -1,
  childs: false,
  init: function(selector){
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
    this.setGridSize.call(this, 3); //JUST FOR TESTING TODO MAKE DYNAMIC

    this.setChilds.apply(this);
    this.setUp.overlay.apply(this);
    this.events.openItem.apply(this);
    this.events.closeItem.apply(this);
    this.events.gridResize.apply(this);
    return this;
  },
  on:{
    openItem:function(callback){
      if(typeof callback != 'function'){
        this.callbacks.openItem = callback;
      }
    },
    closeItem: function(callback){
      if(typeof callback != 'function'){
        this.callbacks.closeItem = callback;
      }
    },
    gridResize:function(callback){
      if(typeof callback != 'function'){
        this.callbacks.gridResize = callback;
      }
    }
  },
  events:{
    openItem:function(){
      this.selector.on('click','.tb-web-gallery-item', { currentInstance: this },function(event){
        var me = event.data.currentInstance; //The Object in wich the event was triggert

        jQuery('body').addClass('tbwg-open');

        if(me.callbacks.openItem){
          me.callbacks.openItem();
        }
      });
    },
    closeItem: function(){
      jQuery('#tbwg-overlay').on('click', '#tbwgClose', { currentInstance: this }, function(event){
        var me = event.data.currentInstance; //The Object in wich the event was triggert
        jQuery('body').removeClass('tbwg-open');

        if(me.callbacks.closeItem){
          me.callbacks.closeItem();
        }
      });
    },
    gridResize: function(){
      if(this.helper.countObj(this.options.breakpoints) > 0){
        var keys = [],
            k, len;

        for (k in this.options.breakpoints) {
          if (this.options.breakpoints.hasOwnProperty(k)) {
            keys.push(k);
          }
        }

        keys.sort();

        len = keys.length;
        jQuery(window).resize({ currentInstance: this, sortedBP: keys },function(event){
          var me = event.data.currentInstance, //The Object in wich the event was triggert
              sBP = event.data.sortedBP, //sorted Break Points
              newWidth = jQuery(this).width();

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
        });
      }
    }
  },
  setUp:{
    overlay:function(){
      if(document.getElementById('tbwg-overlay')){
        //TODO
        /*
         *  If the tbwg overlay already exists we can "reuse" it and integrate the content of this Object inside it in a div with a specified class
         */
      } else {
        var waitFunc = function(context){
          if(context.childs){
            var randomString = tbwg.helper.randomStr(8);
            var allContent = '';
            context.childs.each(function(){
              allContent += jQuery(this).html();
            });
            this.galleryContent = jQuery('<div id="tbwg-overlay"><div class="tbwg-dimmer"></div><div class="tbwg-content"><span id="tbwgClose">x</span><div class="tbwg-id-'+randomString+'">'+allContent+'</div></div></div>');
            jQuery('body').append(this.galleryContent);
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
    }
  },
  setOptions: function(options){
    this.options = options;
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
    console.log('NEW');
    this.selector[0].className = this.selector[0].className.replace(/\btbwb-grid-[0-9].*?\b/g, '');
    this.options.gridSize = newGridSize;
    this.selector.addClass('tbwb-grid-'+this.options.gridSize);
  },
  setChilds: function(){
    var childs = this.selector.children();
    childs.each(function(index){
      var chilchild = jQuery(this).children();
      if(chilchild.length < 1){
        childs = childs.not(this);
      } else {
        chilchild.wrap( "<div class='tb-web-gallery-inner-wrap'></div>" );
      }
    });
    if(this.childs){
      this.childs.removeClass('tb-web-gallery-item');
      //TODO
      /*
       *  Detach possible events
       */
    }
    childs.addClass('tb-web-gallery-item');
    this.childs = childs;
  }
};
