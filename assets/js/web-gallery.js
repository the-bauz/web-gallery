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
      this.selector = selector;
      this.setOptions(options);
    } else {
      this.selector = selector;
    }
    return this;
  },
  setOptions: function(options){
    this.options = options;
    return this;
  }
};
