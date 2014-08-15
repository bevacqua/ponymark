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

function ponymark (containers) {
  var postfix = nextId++;
  var editor;

  if (Object.prototype.toString.call(containers) !== '[object Object]') {
    containers = {
      buttons: containers,
      input: containers,
      preview: containers
    };
  }

  markup(containers, postfix);

  editor = new Editor(postfix);
  editor.run();

  return editor.api;
}

function markup (containers, postfix) {
  var buttonBar = doc.createElement('div');
  var preview = doc.createElement('div');
  var input = doc.createElement('textarea');

  buttonBar.id = 'pmk-buttons-' + postfix;
  buttonBar.className = 'pmk-buttons';
  preview.id = 'pmk-preview-' + postfix;
  preview.className = 'pmk-preview';
  input.id = 'pmk-input-' + postfix;
  input.className = 'pmk-input';
  input.placeholder = containers.input.getAttribute('placeholder') || '';

  containers.buttons.appendChild(buttonBar);
  containers.input.appendChild(input);
  containers.preview.appendChild(preview);
}

module.exports = ponymark;

ponymark.Editor = Editor;
ponymark.convertTabs = convertTabs;
ponymark.configure = configure;
