var tbwg = {
  selector: false,
  options: {
    gridSize: 3,
    breakpoints: {
      420: 1
    }
  },
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
      this.setSelector(selector);
      this.setOptions(options);
    } else {
      this.setSelector(selector);
    }
    //SET GRID SIZE VIA CSS
    this.setGridSize();

    this.setChilds();
    return this;
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
  setGridSize: function(){
    this.selector[0].className = this.selector[0].className.replace(/\btbwb-grid-.*?\b/g, '');
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
    childs.addClass('tb-web-gallery-item');
  }
};
