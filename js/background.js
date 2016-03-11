var APP = {
    addListeners: function(){
      $('.vtex-portal-main a').unbind('click.ext').on('click.ext', function(e){
        console.log('-----',this.text);
        setTimeout(function(){
          console.log('readded');
          APP.addListeners();
        },200);
      });
    },
    getCurrentUrl: function(){
      return location.href
    }
}

var counter = 0;
chrome.browserAction.onClicked.addListener(function (tab) {
    counter++;
    if (counter == 5) {
        alert("Hey !!! You have clicked five times");
    }
});
