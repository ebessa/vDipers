try{
  var menuIddle = true;
  var count = 0;

  function followHash(){console.log('followHash');
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
                });

              clickable[0].click();// click nativo DOM. Click de jquery não funciona
              HideBusy(); // função vtex
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
      $('.vtex-portal-main .jqueryFileTree')
        .on('DOMNodeInserted', clickListener);

      followHash();
      clickListener();
    }
  }

  var vtexOverwrite = {
    init: function(){
      this._msgBox = $('.ext-message-box');
      this._msgBox.find('span').on('click', this._hideMessage);
    },

    _lastMessage: '',

    _hideMessage: function(){
      this._msgBox.animate({
        opacity: 0,
        bottom: '-100%'
      }, 400);
    },

    _showMessage: function(){
      this._msgBox.animate({
        opacity: 1,
        bottom: '20px'
      }, 400);
    },

    ShowMessage: function(message){ console.info('new message');

      if(this._lastMessage !== message){
        this._hideMessage();

        this._msgBox.find('p').text(message);

        this._showMessage();

        setTimeout(this._hideMessage, 10000);

        this._lastMessage = message;
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

    var hasMessage = setInterval(function(){
      console.info('hasMessage interval');
      if(!ShowMessage){
        clearInterval(hasMessage);
        console.warn('\n\n\nnão tem ShowMessage\n\n\n');
      }
    },3000);
  }

  appendHtmlMessage();
  readyScript();
  readyState();

  $(window).on('hashchange', function(){
    console.log('hashchange');
    followHash()
  }); // isso só será disparado quando o usuario clicar no "back" button
} catch(e){
  console.error('Erro na extensão:', e);
}
