try{
  var menuIddle = true;
  var count = 0;

  function followHash(){
    var currentPath = window.location.hash.split('/');

    currentPath.shift(); // remove #

    currentPath.forEach(function(a, i){
        var clickInterval = setInterval(function () {
          if(menuIddle){

            var clickable = $('.jqueryFileTree a').filter(function(){
              return this.text === a.replace(/slash/, '/')
                                    .replace(/lt/, '<')
                                    .replace(/%20/g, ' ')
                                    .replace(/gt/, '>')
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

  function appendHtmlMessage(){
    var html = [
      '<div class="ext-message-box">',
      '<span class="btn-close">X</span>',
      '<p></p>',
      '</div>'
    ].join('');

    $('body').append(html);
  }

  function clickListener(){
    var url;

    $('.vtex-portal-main a')
    .unbind('click.extension')
    .on('click.extension', function(e){
      var len = $(this).parents('ul').length,
          urlTable = [];

      $(this).attr('ext-path', '/' + this.text.replace(/^\/$/gi, 'slash'))
        .addClass('tree-name')
        .parents('.jqueryFileTree')
        .addClass('tree-holder');

      urlTable.push($(this).attr('ext-path'));

      $(this).parents('.tree-holder').each(function(i,el){
        var text = $(this).prev('a');


        if(text.attr('ext-path')){
          urlTable.push(text.attr('ext-path'));
        }
      });

      url = urlTable.reverse().join('');
      url = url.replace(/</, 'lt')
              .replace(/\s/g, '%20')
              .replace(/>/, 'gt');
      history.pushState({}, url,'#'+url);
    });
  }


  function readyState(){
    var timeout;
    if($('.vtex-portal-main a').length === 0){
      timeout = setTimeout(function(){
        readyState();
      },200);
      return;
    } else {
      clearTimeout(timeout);

      $('.vtex-portal-main .jqueryFileTree')
        .on('DOMNodeInserted', clickListener);

      followHash();
      clickListener();
    }
  }

  var vtexOverwrite = {
    init: function(){
      vtexOverwrite._msgBox = $('.ext-message-box');
      vtexOverwrite._msgBox.find('span').on('click', vtexOverwrite._hideMessage);
    },

    _lastMessage: '',

    _hideMessage: function(){
      vtexOverwrite._msgBox.animate({
        opacity: 0,
        bottom: '-100%'
      }, 400);
    },

    _showMessage: function(){
      vtexOverwrite._msgBox.animate({
        opacity: 1,
        bottom: '20px'
      }, 400);
    },

    ShowMessage: function(message){

      if(vtexOverwrite._lastMessage !== message){
        vtexOverwrite._hideMessage();

        vtexOverwrite._msgBox.find('p').text(message);

        vtexOverwrite._showMessage();

        setTimeout(vtexOverwrite._hideMessage, 10000);

        vtexOverwrite._lastMessage = message;
      }
    }
  };

  function readyScript(e){
    if(typeof ShowMessage === "undefined"){
      setTimeout(readyScript, 200);
      return true;
    }

    vtexOverwrite.init();
    ShowMessage = vtexOverwrite.ShowMessage; // esta função é originalmente definida no arquivo PortalManagementMain.js
  }

  appendHtmlMessage();
  readyScript();
  readyState();

  $(window).on('hashchange', followHash); // isso só será disparado quando o usuario clicar no "back" button
} catch(e){
  console.error('Erro na extensão:', e);
}
