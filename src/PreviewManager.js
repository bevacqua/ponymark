'use strict';

var doc = global.document;
var ua = require('./ua');
var util = require('./util');
var parse = require('./parse');
var position = require('./position');

function PreviewManager (panels, previewRefreshCallback) {
  var managerObj = this;
  var timeout;
  var elapsedTime;
  var oldInputText;
  var maxDelay = 3000;
  var startType = 'delayed'; // The other legal value is 'manual'

  // Adds event listeners to elements
  var setupEvents = function (inputElem, listener) {

    util.addEvent(inputElem, 'input', listener);
    inputElem.onpaste = listener;
    inputElem.ondrop = listener;

    util.addEvent(inputElem, 'keypress', listener);
    util.addEvent(inputElem, 'keydown', listener);
  };

  var getDocScrollTop = function () {

    var result = 0;

    if (window.innerHeight) {
      result = window.pageYOffset;
    } else if (doc.documentElement && doc.documentElement.scrollTop) {
      result = doc.documentElement.scrollTop;
    } else if (doc.body) {
      result = doc.body.scrollTop;
    }

    return result;
  };

  var makePreviewHtml = function () {

    // If there is no registered preview panel
    // there is nothing to do.
    if (!panels.preview) {
      return;
    }

    var text = panels.input.value;
    if (text && text == oldInputText) {
      return; // Input text hasn't changed.
    } else {
      oldInputText = text;
    }

    var prevTime = new Date().getTime();

    text = parse(text);

    // Calculate the processing time of the HTML creation.
    // It's used as the delay time in the event listener.
    var currTime = new Date().getTime();
    elapsedTime = currTime - prevTime;

    pushPreviewHtml(text);
  };

  // setTimeout is already used.  Used as an event listener.
  var applyTimeout = function () {

    if (timeout) {
      clearTimeout(timeout);
      timeout = void 0;
    }

    if (startType !== 'manual') {

      var delay = 0;

      if (startType === 'delayed') {
        delay = elapsedTime;
      }

      if (delay > maxDelay) {
        delay = maxDelay;
      }
      timeout = setTimeout(makePreviewHtml, delay);
    }
  };

  var getScaleFactor = function (panel) {
    if (panel.scrollHeight <= panel.clientHeight) {
      return 1;
    }
    return panel.scrollTop / (panel.scrollHeight - panel.clientHeight);
  };

  var setPanelScrollTops = function () {
    if (panels.preview) {
      panels.preview.scrollTop = (panels.preview.scrollHeight - panels.preview.clientHeight) * getScaleFactor(panels.preview);
    }
  };

  this.refresh = function (requiresRefresh) {

    if (requiresRefresh) {
      oldInputText = '';
      makePreviewHtml();
    }
    else {
      applyTimeout();
    }
  };

  this.processingTime = function () {
    return elapsedTime;
  };

  var isFirstTimeFilled = true;

  // IE doesn't let you use innerHTML if the element is contained somewhere in a table
  // (which is the case for inline editing) -- in that case, detach the element, set the
  // value, and reattach. Yes, that *is* ridiculous.
  var ieSafePreviewSet = function (text) {
    var preview = panels.preview;
    var parent = preview.parentNode;
    var sibling = preview.nextSibling;
    parent.removeChild(preview);
    preview.innerHTML = text;
    if (!sibling)
      parent.appendChild(preview);
    else
      parent.insertBefore(preview, sibling);
  }

  var nonSuckyBrowserPreviewSet = function (text) {
    panels.preview.innerHTML = text;
  }

  var previewSetter;

  var previewSet = function (text) {
    if (previewSetter)
      return previewSetter(text);

    try {
      nonSuckyBrowserPreviewSet(text);
      previewSetter = nonSuckyBrowserPreviewSet;
    } catch (e) {
      previewSetter = ieSafePreviewSet;
      previewSetter(text);
    }
  };

  var pushPreviewHtml = function (text) {

    var emptyTop = position.getTop(panels.input) - getDocScrollTop();

    if (panels.preview) {
      previewSet(text);
      previewRefreshCallback();
    }

    setPanelScrollTops();

    if (isFirstTimeFilled) {
      isFirstTimeFilled = false;
      return;
    }

    var fullTop = position.getTop(panels.input) - getDocScrollTop();

    if (ua.isIE) {
      setTimeout(function () {
        window.scrollBy(0, fullTop - emptyTop);
      }, 0);
    }
    else {
      window.scrollBy(0, fullTop - emptyTop);
    }
  };

  var init = function () {

    setupEvents(panels.input, applyTimeout);
    makePreviewHtml();

    if (panels.preview) {
      panels.preview.scrollTop = 0;
    }
  };

  init();
};

module.exports = PreviewManager;
