# web-gallery
A Free Web-Based Gallery made for you by [the-bauz](http://the-bauz.com).


You can use this Gallery in your personal Projects as well as extending this Project.


## How to use
In the assets Folder you will find all the dependencies needed by the index.html were an ready-to-use instance of the Web Gallery already is in Place, but generlly the Web Gallery is just a javascript Extension making unordered lists to galleries with a Pop-Up Effect.  
```javascript
tbwg.init(selector);
```
or optionally a function call with Options
```javascript
tbwg.init(selector, {
  option1: option1,
  option2: option2
});
```


## Set Up
First you need to check your HTML Strukture because it need to fit in the Two defined Types avalible in this Plug in.

### Text type
```html
<ul>
  <li>
    <p>YOUR TEXT</p>
  </li>
</ul>
```  
or some Variation of that pattern.
_Important is that the Text is wrapped in the paragraph-tag_


### Image type
```html
<ul>
  <li>
    <img src="assets/img/350x350.png" alt="IMAGE" />
  </li>
</ul>
```  
or some Variation of that pattern.
_Important is that the Image you want to display is the first image in an Image-tag_
