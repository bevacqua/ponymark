'use strict';

var util = require('./src/util');
var Editor = require('./src/Editor');

function convertTabs () {
  util.addEventDelegate(document, 'pmk-input', 'keydown', ui.convertTabs);
}

module.exports = {
  Editor: Editor,
  convertTabs: convertTabs
};
