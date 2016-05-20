(function(){
  var scripts = [
    "js/jquery.fileupload.js",
    "js/jquery.fileupload-process.js",
    "js/jquery.fileupload-image.js",
    "js/jquery.fileupload-audio.js",
    "js/jquery.fileupload-validate.js",
    "js/app.js"
  ];

  var appendNext = function (scripts) {
    var s = document.createElement('script');
    var scr = scripts.shift();
    s.src = chrome.extension.getURL(scr);
    s.onload = function() {
      this.parentNode.removeChild(this);
      if(scripts.length > 0){
        appendNext(scripts);
      }
    };
    (document.head || document.documentElement).appendChild(s);
  };

  appendNext(scripts);
}());
