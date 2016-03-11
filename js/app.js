var menuIddle = true;
var intvl = 1;

function followHash(){
  var currentPath = window.location.hash.split('/');

  currentPath.shift();

  currentPath.forEach(function(a, i){console.log('test');
      var clickInterval = setInterval(function () {console.log('interval', i, intvl);intvl++;
        if(menuIddle){
          menuIddle = false;

          var clickable = $('.jqueryFileTree a').filter(function(){
            console.log('this.text', this.text);
            console.log("a.replace(/slash/, '/')", a.replace(/slash/, '/'));
            return this.text === a.replace(/slash/, '/');
          });

          clickable.parent().on('DOMNodeInserted', function(){
            menuIddle = true;
            console.log('DOMNodeInserted');
            clearInterval(clickInterval);
          });

          clickable[0].click();// click nativo DOM. Click de jquery não funciona
          HideBusy();//função da vtex

          intvl--;
        }
      }, 100);
  });
}

function clickListener(){console.log('clickListener');
  var url;
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
  followHash();
});

$(window).on('hashchange', followHash);// isso só será disparado quando o usuario clicar no "back" button

clickListener();
