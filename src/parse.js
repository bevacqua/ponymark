'use strict';

var configure = require('./configure');

module.exports = function (text) {
  return configure.markdown(text);
};
