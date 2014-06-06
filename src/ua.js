'use strict';

var nav = window.navigator;
var ua = nav.userAgent.toLowerCase();
var uaSniffer = {
  isIE: /msie/.test(ua),
  isIE_5or6: /msie [56]/.test(ua),
  isOpera: /opera/.test(ua),
  isChrome: /chrome/.test(ua),
  isWindows: /win/i.test(nav.platform)
};

module.exports = uaSniffer;
