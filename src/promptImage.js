'use strict';

/*
section#prompt-image-template.template
  article.dialog.markdown-prompt-dialog
    a.action.close(title='Close')='Close'
    header.dialog-title
      h1.underline='Insert Image'

    section.dialog-body
      p='http://example.com/images/diagram.jpg "optional title"'
      p
        input.prompt-input(type='text', placeholder='Type or paste the url to your image', data-focus)

    footer.dialog-buttons
      a.close(title='Cancel')='Cancel'
      button.button.small.ok-button='OK'
*/
var promptLink = require('promptLink');

function draw (cb) {
  init(cb);
}

function init (cb) {
  promptLink.init(cb);
  arrangeImageUpload(ctx);
}

function arrangeImageUpload (ctx) {
  var dialog = ctx.elements;
  var dialogBody = dialog.find('.dialog-body');
  var upload = nbrut.tt.partial('file-upload', nbrut.ui.uploadExtend({
    done: function (e, data) {
      var input = dialog.find('.prompt-input');
      var ok = dialog.find('.ok-button');
      var response = data.result;
      var link = '{0} "{1}"'.format(response.url, response.alt);

      input.val(link);
      ok.trigger('click');
    }
  }));

  upload.appendTo(dialogBody);
}

module.exports = {
  draw: draw
};
