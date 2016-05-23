try{
  var menuIddle = true;
  var count = 0;

  var domPath = (function(){
    var timeout;

    return function(pathList, clickable){
      if(timeout) clearTimeout(timeout);
      timeout = setTimeout(function(){
          if(pathList.length){
            setPaths(pathList);
            HideBusy(); // função vtex
          } else { // terminou de abrir url
            clickListener();
          }
      });
    }
  }());

  function setPaths(pathList) {
    var currentPath = pathList.shift(); // remove item e ja colocado no menu


    var clickable = $('.jqueryFileTree a').filter(function(){
                      return this.text === decodeURI(currentPath).replace(/slash/, '/');
                    });


    if(clickable.length === 1){
      setMenu(clickable[0]);
      clickable.parent().off('DOMNodeInserted').on('DOMNodeInserted', function(){
        domPath(pathList, clickable[0]);
      });

      clickable[0].click();// click nativo DOM. Click de jquery não funciona
    }
  }

  function followHash(){
    var pathList = window.location.hash.split('/'),
        clickable;

    pathList.shift(); // remove #
    if(pathList.length){
      setPaths(pathList);
    } else {
      clickListener();
    }
  }

  function appendHtmlMessage(){
    var html = [
      '<div class="ext-message-box">',
      '<span class="btn-close">X</span>',
      '<p></p>',
      '</div>'
    ].join('');

    $('body')
            .find('.ext-message-box')
            .remove()
            .end()
            .append(html);
  }

  function setMenu(that){
    $(that).attr('ext-path', '/' + that.text.replace(/^\/$/gi, 'slash'))
      .addClass('tree-name')
      .parents('.jqueryFileTree')
      .addClass('tree-holder');
  }

  var clickListener = function(){
    var timeout;

    return function(){
      if(timeout) clearTimeout(timeout);
      timeout = setTimeout(function(){
          var url;

          $('.vtex-portal-main a')
          .off('click.extension')
          .on('click.extension', function(e){
              var len = $(this).parents('ul').length,
                  urlTable = [];

              setMenu(this);

              urlTable.push($(this).attr('ext-path'));

              $(this).parents('.tree-holder').each(function(i,el){
                var text = $(this).prev('a');

                if(text.attr('ext-path')){
                  urlTable.push(text.attr('ext-path'));
                }
              });


              url = urlTable.reverse().join('');
              url = encodeURI(url);

              history.pushState({}, url,'#'+url);
        });

              $('.vtex-portal-main .jqueryFileTree').off('DOMNodeInserted').on('DOMNodeInserted', clickListener);
      },250);
    }
  }();

  var vtexOverwrite = {
    _lastMessage: '',

    _hideMessage: function(){
      $('.ext-message-box').animate({
        opacity: 0,
        bottom: '-100%'
      }, 400);
    },

    _showMessage: function(){
      $('.ext-message-box').animate({
        opacity: 1,
        bottom: '20px'
      }, 400);
    },

    ShowMessage: function(message){
      appendHtmlMessage();

      if(vtexOverwrite._lastMessage !== message){
        vtexOverwrite._hideMessage();

        $('.ext-message-box').find('p').text(message);

        vtexOverwrite._showMessage();

        setTimeout(vtexOverwrite._hideMessage, 10000);

        vtexOverwrite._lastMessage = message;
      }
    }
  };

  function replaceUpload(){
    console.log('replaceUpload');
    $('#fileInputFilePickerUploader').remove();

    $('#fileInputFilePicker').attr('multiple',true).show().fileupload({
        dataType: 'json',
        add: function (e, data) {
          console.log('e',e);
          console.log('data',data);
            // data.context = $('<button/>').text('Upload')
            //     .appendTo(document.body)
            //     .click(function () {
            //         data.context = $('<p/>').text('Uploading...').replaceAll($(this));
            //         data.submit();
            //     });
        },
        done: function (e, data) {
            data.context.text('Upload finished.');
        }
    });
  }


  function readyState (){
    var timeout;
    return function(){
      if($('.vtex-portal-main a').length === 0 || typeof ShowMessage === "undefined"){
        timeout = setTimeout(function(){
          readyState();
        },200);
      } else {
        ShowMessage = vtexOverwrite.ShowMessage; // esta função é originalmente definida no arquivo PortalManagementMain.js

        clearTimeout(timeout);
        followHash();
      }
    }()
  };

  readyState();

  $(window).on('hashchange', followHash); // isso só será disparado quando o usuario clicar no "back" button

  // $(document).on('click', function(e){
  //   var links = {"Adicionar": 1, "Alterar": 1},
  //       interval = null;
  //   if( $(e.target).text() in links){
  //     interval = setInterval(function () {
  //       if($('#fileInputFilePickerUploader').length > 0){
  //         clearInterval(interval);
  //         replaceUpload();
  //       }
  //     }, 100);
  //   }
  // });
} catch(e){
  console.error('Erro na extensão:', e);
}
