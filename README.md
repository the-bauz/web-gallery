# the-bauz web gallery (BETA)
A free small javascript library to implement a simple web gallery!   
made for you by [the-bauz](http://the-bauz.com)

This example can be found on [the-bauz.com/web-gallery](http://the-bauz.com/web-gallery). Check it out and if you find any bugs feel free to resolve them or open an issue here on GitHub.

You can use this gallery in your personal projects as well as extending this project.


## How to use
In the assets folder you will find all the dependencies needed by the index.html, were a ready-to-use instance of the web gallery already is in place, but generlly the web gallery is just a javascript extension making unordered lists to galleries with a Pop-Up effect.  
```javascript
tbwg.init(selector);
```
or optionally a function call with options
```javascript
tbwg.init(selector, {
  option1: 'option1',
  option2: 'option2'
});
```


## Set Up
First you need to check your HTML strukture because it needs to fit in the two defined types avalible in this plug in.

### Text type
```html
<ul id="tbwgItem">
  <li>
    <p>YOUR TEXT</p>
  </li>
</ul>
<script>
tbwg.init('#tbwgItem');
</script>
```  
or some variation of that pattern.  
_Important is that the text is wrapped in the paragraph-tag_


### Image type
```html
<ul id="tbwgItem">
  <li>
    <img src="assets/img/350x350.png" alt="SOME IMAGE" />
  </li>
</ul>
<script>
tbwg.init('#tbwgItem');
</script>
```  
or some variation of that pattern.  
_Important is that the image you want to display is the first image in an image-tag_
