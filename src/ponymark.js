'use strict';

var doc = global.document;
var ui = require('./ui');
var util = require('./util');
var configure = require('./configure');
var classes = require('./classes');
var Editor = require('./Editor');
var nextId = 0;

function ponymark (o) {
  var postfix = nextId++;
  var editor;

  if (Object.prototype.toString.call(o) !== '[object Object]') {
    o = { textarea: o, preview: o };
  }

  markup(o, postfix);

  editor = new Editor(postfix);
  editor.run();

  return editor.api;
}

function markup (o, postfix) {
  var buttonBar = doc.createElement('div');
  var preview = doc.createElement('div');
  var input;

  if (classes.contains(o.textarea, 'pmk-input')) {
    classes.add(o.textarea, 'pmk-input');
  }

  buttonBar.id = 'pmk-buttons-' + postfix;
  buttonBar.className = 'pmk-buttons';
  preview.id = 'pmk-preview-' + postfix;
  preview.className = 'pmk-preview';

  o.textarea.id = 'pmk-input-' + postfix;
  o.textarea.parentElement.insertBefore(buttonBar, o.textarea);
  o.preview.appendChild(preview);
}

module.exports = ponymark;

ponymark.Editor = Editor;
ponymark.configure = configure;
