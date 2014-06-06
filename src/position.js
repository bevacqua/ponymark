'use strict';

var doc = global.document;

function getTop (elem, isInner) {
  var result = elem.offsetTop;
  if (!isInner) {
    while (elem = elem.offsetParent) {
      result += elem.offsetTop;
    }
  }
  return result;
};

function getHeight (elem) {
  return elem.offsetHeight || elem.scrollHeight;
};

function getWidth (elem) {
  return elem.offsetWidth || elem.scrollWidth;
};

function getPageSize () {
  var scrollWidth, scrollHeight;
  var innerWidth, innerHeight;

  if (self.innerHeight && self.scrollMaxY) {
    scrollWidth = doc.body.scrollWidth;
    scrollHeight = self.innerHeight + self.scrollMaxY;
  } else if (doc.body.scrollHeight > doc.body.offsetHeight) {
    scrollWidth = doc.body.scrollWidth;
    scrollHeight = doc.body.scrollHeight;
  } else {
    scrollWidth = doc.body.offsetWidth;
    scrollHeight = doc.body.offsetHeight;
  }

  if (self.innerHeight) {
    innerWidth = self.innerWidth;
    innerHeight = self.innerHeight;
  } else if (doc.documentElement && doc.documentElement.clientHeight) {
    innerWidth = doc.documentElement.clientWidth;
    innerHeight = doc.documentElement.clientHeight;
  } else if (doc.body) {
    innerWidth = doc.body.clientWidth;
    innerHeight = doc.body.clientHeight;
  }

  var maxWidth = Math.max(scrollWidth, innerWidth);
  var maxHeight = Math.max(scrollHeight, innerHeight);
  return [maxWidth, maxHeight, innerWidth, innerHeight];
};

module.exports = {
  getTop: getTop,
  getHeight: getHeight,
  getWidth: getWidth,
  getPageSize: getPageSize
};
