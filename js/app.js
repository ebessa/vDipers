var menuIddle = true;
var count = 0;
console.log('roooooodei');
function followHash(){
  var currentPath = window.location.hash.split('/');

  currentPath.shift(); // remove #

  currentPath.forEach(function(a, i){
      var clickInterval = setInterval(function () {
        if(menuIddle){

          var clickable = $('.jqueryFileTree a').filter(function(){
            return this.text === a.replace(/slash/, '/');
          });

          if(clickable.length === 1){
              menuIddle = false;
              clickable.parent().on('DOMNodeInserted', function(){
              menuIddle = true;
              clearInterval(clickInterval);
              // console.log('DOMNodeInserted');
              // console.warn('interValCleared');
            });

            clickable[0].click();// click nativo DOM. Click de jquery não funciona
            location.href="javascript:HideBusy(); void 0";//gambiarra pra executar função da vtex
          }
        }
      }, 100);
  });
}

function clickListener(){console.log('clickListener');
  var url,
      interval;

  interval = setInterval(function () {
    if($('.vtex-portal-main a').length === 0){
      clickListener();
      return;
    }
    console.log('cleared');
    clearInterval(interval);
  },100);

  $('.vtex-portal-main a')
  .unbind('click.extension')
  .on('click.extension', function(e){
    var len = $(this).parents('ul').length,
        urlTable = [];

    $(this).closest('.jqueryFileTree')
    .attr('ext-path', '/' + this.text.replace(/^\/$/gi, 'slash'))
    .addClass('tree-holder')
    .addClass('ext-level-' + (parseInt(len, 10)-1));

    $(this).parents('.tree-holder').each(function(i,el){
      console.log("$(el).attr('ext-path')", $(el).attr('ext-path'))
      urlTable.push($(el).attr('ext-path'));
    });

    url = urlTable.reverse().join('');
    history.pushState({}, url,'#'+url);
  });
}

$(function(){
  $('.vtex-portal-main .jqueryFileTree').on('DOMNodeInserted', clickListener);
  $('.vtex-portal-main .jqueryFileTree')
  .addClass('tree-holder')
  .addClass('ext-level-0');
  clickListener();
  followHash();
});

$(window).on('hashchange', followHash);// isso só será disparado quando o usuario clicar no "back" button
