'use strict';

var doc = global.document;
var ui = require('./ui');
var util = require('./util');
var configure = require('./configure');
var Editor = require('./Editor');
var nextId = 0;

function convertTabs () {
  util.addEventDelegate(doc, 'pmk-input', 'keydown', ui.convertTabs);
}

function ponymark (o) {
  var postfix = nextId++;
  var editor;

  if (Object.prototype.toString.call(o) !== '[object Object]') {
    o = {
      buttons: o,
      input: o,
      preview: o
    };
  }

  markup(o, postfix);

  editor = new Editor(postfix);
  editor.run();

  return editor.api;
}

function markup (o, postfix) {
  var buttonBar = doc.createElement('div');
  var preview = doc.createElement('div');
  var existing = o.input && /textarea/i.test(o.input.tagName);
  var input;

  if (!existing) {
    input = doc.createElement('textarea');
    input.className = 'pmk-input';
    input.placeholder = o.placeholder || o.input.getAttribute('placeholder') || '';
  } else {
    input = o.input;
  }
  input.id = 'pmk-input-' + postfix;

  buttonBar.id = 'pmk-buttons-' + postfix;
  buttonBar.className = 'pmk-buttons';
  preview.id = 'pmk-preview-' + postfix;
  preview.className = 'pmk-preview';

  o.buttons.appendChild(buttonBar);

  if (!existing) {
    o.input.appendChild(input);
  }

  o.preview.appendChild(preview);
}

module.exports = ponymark;

ponymark.Editor = Editor;
ponymark.convertTabs = convertTabs;
ponymark.configure = configure;
