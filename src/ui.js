'use strict';

var promptLink = require('./promptLink');
var promptImage = require('./promptImage');

function prompt (type, cb) {
  if (type === 'link') {
    promptLink.draw(preprocess);
  } else if (type === 'image') {
    promptImage.draw(preprocess);
  }

  function preprocess (text) {
    if (text !== null){ // Fixes common pasting errors.
      text = text.replace(/^http:\/\/(https?|ftp):\/\//, '$1://');
      if (text[0] !== '/' && !/^(?:https?|ftp):\/\//.test(text)){
        text = 'http://' + text;
      }
    }
    cb(text);
  }
}

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
