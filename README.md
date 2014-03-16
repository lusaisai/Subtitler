Subtitler
=======
This is a simple standalone javascript library to parse and show srt subtitle in a web page.

Usage
-----
Include the js and css file in your page.
```html
    <script type="text/javascript" src="subtitler-1.0.0.js"></script>
    <link rel="stylesheet" href="subtitler-1.0.0.css">
```

In your js code, you can create a Subtitler object, options can be provided, or leave it empty, then set the subtitle text.
```javascript
    var sub = new Subtitler({offset: -10, divId: 'myid'});
    var sub = new Subtitler();
    sub.setSubtitle(text);
```

In your page, you need to create an empty div with the default id 'subtitler'. The id can be changed through options. This div is to place the html subtitle.
```html
    <div id="subtitler"></div>
```

The main method is to move to a specific time in seconds.
```javascript
    sub.move(100);
```

Usually, you can create a function object around the move method and bind it to the timeupdate event of a video, for example,
```javascript
    var video = document.getElementById('video');
    video.addEventListener( "timeupdate", function() {
        sub.move(video.currentTime);
    } );
```
