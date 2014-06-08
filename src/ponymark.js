'use strict';

var doc = global.document;
var ui = require('./ui');
var util = require('./util');
var Editor = require('./Editor');
var nextId = 0;

function convertTabs () {
  util.addEventDelegate(doc, 'pmk-input', 'keydown', ui.convertTabs);
}

function ponymark (container) {
  var postfix = nextId++;
  markup(container, postfix);
  var editor = new Editor(postfix);
  editor.run();
}

function markup (container, postfix) {
  var buttonBar = doc.createElement('div');
  var preview = doc.createElement('div');
  var input = doc.createElement('textarea');

  buttonBar.id = 'pmk-buttons-' + postfix;
  buttonBar.className = 'pmk-buttons';
  preview.id = 'pmk-preview-' + postfix;
  preview.className = 'pmk-preview';
  input.id = 'pmk-input-' + postfix;
  input.className = 'pmk-input';

  container.appendChild(buttonBar);
  container.appendChild(input);
  container.appendChild(preview);
}

module.exports = ponymark;

ponymark.Editor = Editor;
ponymark.convertTabs = convertTabs;
