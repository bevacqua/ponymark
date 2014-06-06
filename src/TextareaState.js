'use strict';

var doc = global.document;
var ua = require('./ua');
var util = require('./util');

function TextareaState (panels, isInitialState) {
  var self = this;
  var input = panels.input;

  self.init = function () {
    if (!util.isVisible(input)) {
      return;
    }
    if (!isInitialState && doc.activeElement && doc.activeElement !== input) {
      return;
    }

    self.setInputSelectionStartEnd();
    self.scrollTop = input.scrollTop;
    if (!self.text && input.selectionStart || input.selectionStart === 0) {
      self.text = input.value;
    }
  }

  self.setInputSelection = function () {
    if (!util.isVisible(input)) {
      return;
    }

    if (input.selectionStart !== void 0 && !ua.isOpera) {
      input.focus();
      input.selectionStart = self.start;
      input.selectionEnd = self.end;
      input.scrollTop = self.scrollTop;
    } else if (doc.selection) {
      if (doc.activeElement && doc.activeElement !== input) {
        return;
      }

      input.focus();
      var range = input.createTextRange();
      range.moveStart('character', -input.value.length);
      range.moveEnd('character', -input.value.length);
      range.moveEnd('character', self.end);
      range.moveStart('character', self.start);
      range.select();
    }
  };

  self.setInputSelectionStartEnd = function () {
    if (!panels.ieCachedRange && (input.selectionStart || input.selectionStart === 0)) {
      self.start = input.selectionStart;
      self.end = input.selectionEnd;
    } else if (doc.selection) {
      self.text = util.fixEolChars(input.value);

      var range = panels.ieCachedRange || doc.selection.createRange();
      var fixedRange = util.fixEolChars(range.text);
      var marker = '\x07';
      var markedRange = marker + fixedRange + marker;
      range.text = markedRange;
      var inputText = util.fixEolChars(input.value);

      range.moveStart('character', -markedRange.length);
      range.text = fixedRange;

      self.start = inputText.indexOf(marker);
      self.end = inputText.lastIndexOf(marker) - marker.length;

      var len = self.text.length - util.fixEolChars(input.value).length;
      if (len) {
        range.moveStart('character', -fixedRange.length);
        while (len--) {
          fixedRange += '\n';
          self.end += 1;
        }
        range.text = fixedRange;
      }

      if (panels.ieCachedRange) {
        self.scrollTop = panels.ieCachedScrollTop;
      }
      panels.ieCachedRange = null;
      self.setInputSelection();
    }
  };

 self.restore = function () {
    if (self.text != void 0 && self.text != input.value) {
      input.value = self.text;
    }
    self.setInputSelection();
    input.scrollTop = self.scrollTop;
  };

  self.getChunks = function () {
    var chunk = new Chunks();
    chunk.before = util.fixEolChars(self.text.substring(0, self.start));
    chunk.startTag = '';
    chunk.selection = util.fixEolChars(self.text.substring(self.start, self.end));
    chunk.endTag = '';
    chunk.after = util.fixEolChars(self.text.substring(self.end));
    chunk.scrollTop = self.scrollTop;
    return chunk;
  };

  self.setChunks = function (chunk) {
    chunk.before = chunk.before + chunk.startTag;
    chunk.after = chunk.endTag + chunk.after;
    self.start = chunk.before.length;
    self.end = chunk.before.length + chunk.selection.length;
    self.text = chunk.before + chunk.selection + chunk.after;
    self.scrollTop = chunk.scrollTop;
  };

  self.init();
};

module.exports = TextareaState;
