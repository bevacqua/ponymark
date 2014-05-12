'use strict'

var util = require('./util');
var re = RegExp;

function Chunks () {
}

Chunks.prototype.findTags = function (startRegex, endRegex) {
  var self = this;
  var regex;

  if (startRegex) {
    regex = util.extendRegExp(startRegex, '', '$');
    this.before = this.before.replace(regex, start_replacer);
    regex = util.extendRegExp(startRegex, '^', '');
    this.selection = this.selection.replace(regex, start_replacer);
  }

  if (endRegex) {
    regex = util.extendRegExp(endRegex, '', '$');
    this.selection = this.selection.replace(regex, end_replacer);
    regex = util.extendRegExp(endRegex, '^', '');
    this.after = this.after.replace(regex, end_replacer);
  }

  function start_replacer (match) {
    self.startTag = self.startTag + match;
    return '';
  }
  function end_replacer (match) {
    self.endTag = match + self.endTag;
    return '';
  }
};

Chunks.prototype.trimWhitespace = function (remove) {
  var beforeReplacer, afterReplacer, self = this;
  if (remove) {
    beforeReplacer = afterReplacer = '';
  } else {
    beforeReplacer = function (s) { self.before += s; return ''; }
    afterReplacer = function (s) { self.after = s + self.after; return ''; }
  }

  this.selection = this.selection.replace(/^(\s*)/, beforeReplacer).replace(/(\s*)$/, afterReplacer);
};

Chunks.prototype.skipLines = function (nLinesBefore, nLinesAfter, findExtraNewlines) {
  if (nLinesBefore === void 0) {
    nLinesBefore = 1;
  }

  if (nLinesAfter === void 0) {
    nLinesAfter = 1;
  }

  nLinesBefore++;
  nLinesAfter++;

  var regexText;
  var replacementText;

  if (uaSniffed.isChrome) {
    'X'.match(/()./);
  }

  this.selection = this.selection.replace(/(^\n*)/, '');
  this.startTag = this.startTag + re.$1;
  this.selection = this.selection.replace(/(\n*$)/, '');
  this.endTag = this.endTag + re.$1;
  this.startTag = this.startTag.replace(/(^\n*)/, '');
  this.before = this.before + re.$1;
  this.endTag = this.endTag.replace(/(\n*$)/, '');
  this.after = this.after + re.$1;

  if (this.before) {
    regexText = replacementText = "";

    while (nLinesBefore--) {
      regexText += "\\n?";
      replacementText += "\n";
    }

    if (findExtraNewlines) {
      regexText = "\\n*";
    }
    this.before = this.before.replace(new re(regexText + '$', ''), replacementText);
  }

  if (this.after) {
    regexText = replacementText = '';

    while (nLinesAfter--) {
      regexText += '\\n?';
      replacementText += '\n';
    }
    if (findExtraNewlines) {
      regexText = '\\n*';
    }

    this.after = this.after.replace(new re(regexText, ''), replacementText);
  }
};

module.exports = Chunks;
