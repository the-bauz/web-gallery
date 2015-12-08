var tbwg = {
  selector: false,
  options: false,
  init: function(selector){
    if(typeof selector == 'undefined'){
      console.info('To use the Web Gallery from the-bauz you need to pass a CSS Selector');
    } else if(typeof jQuery == 'undefined'){
      console.info('To use the Web Gallery from the-bauz you need implement the jQuery Libary');
    } else if(typeof options != 'undefined' && typeof options != 'object'){
      console.info('The Options for the Web Gallery from the-bauz need to be an Javascript object');
    } else if(typeof options != 'undefined'){
      this.setSelector(selector);
      this.setOptions(options);
    } else {
      this.setSelector(selector);
    }
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
  }
};
