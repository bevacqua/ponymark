'use strict';

var doc = global.document;

module.exports = function (elem, type) {
  var e;

  if (doc.createEvent) {
    e = doc.createEvent('HTMLEvents');
    e.initEvent(type, true, true);
  } else {
    e = doc.createEventObject();
    e.eventType = type;
  }
  e.eventName = type;

  if (doc.createEvent) {
    element.dispatchEvent(e);
  } else {
    element.fireEvent('on' + e.eventType, e);
  }
};
