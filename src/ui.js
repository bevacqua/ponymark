'use strict';

function prompt (partialName, cb) {
  var body = $('body');
  var partial = nbrut.tt.partial(partialName, { complete: complete });

  partial.appendTo(body);

  function complete (text){
    if (text !== null){ // Fixes common pasting errors.
      text = text.replace(/^http:\/\/(https?|ftp):\/\//, '$1://');
      if (text[0] !== '/' && !/^(?:https?|ftp):\/\//.test(text)){
        text = 'http://' + text;
      }
    }

    cb(text);
  }
};

function convertTabs (e) {
  var ta = e.target;
  var keyCode = e.charCode || e.keyCode;
  if (keyCode !== 9) {
    return;
  }
  e.preventDefault();

  var start = ta.selectionStart;
  var end = ta.selectionEnd;
  var val = ta.value;
  var left = val.substring(0, start);
  var right = val.substring(end);

  ta.value = left + '    ' + right;
  ta.selectionStart = ta.selectionEnd = start + 4;
}

module.exports = {
  prompt: prompt,
  convertTabs: convertTabs
};
