'use strict';

/*
section#prompt-link-template.template
  article.dialog.markdown-prompt-dialog
    a.action.close(title='Close')='Close'
    header.dialog-title
      h1.underline='Insert Link'

    section.dialog-body
      p='http://example.com/ "optional title"'
      p
        input.prompt-input(type='text', placeholder='Type or paste the url to your link', data-focus)

    footer.dialog-buttons
      a.close(title='Cancel')='Cancel'
      button.button.small.ok-button='OK'
*/
function draw (cb) {
  init(cb);
}

function init (cb) {
  var dialog = ctx.elements;
  var input = dialog.find('.prompt-input');

  dialog.find('.ok-button').on('click', ok);
  input.on('keydown', function(e){
    if(e.which === 13){
      ok();
      return false;
    }
  });

  function ok(){
    dialog.trigger('container.close');
    var text = input.val();
    viewModel.complete(text);
  }
}

module.exports = {
  draw: draw,
  init: init
};
