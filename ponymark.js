'use strict';

var util = require('./src/util');
var converter = require('./src/Converter');
var Editor = require('./src/Editor');
var nextId = 0;

function convertTabs () {
  util.addEventDelegate(document, 'pmk-input', 'keydown', ui.convertTabs);
}

function ponymark (container) {
  var id = nextId++;

  var converter = new converter();
  var editor = new Editor(converter);
  editor.run();
}

module.exports = ponymark;

ponymark.Editor = Editor;
ponymark.convertTabs = convertTabs;
