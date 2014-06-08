'use strict';

var raf = require('raf');
var promptRender = require('./promptRender');
var cache;

function draw (cb) {
  if (!cache) {
    cache = promptRender({
      id: 'pmk-link-prompt',
      title: 'Insert Link',
      description: 'Type or paste the url to your link',
      placeholder: 'http://example.com/ "optional title"'
    });
    init(cache, cb);
  }
  cache.dialog.classList.add('pmk-prompt-open');
  raf(focus);
  return cache.dialog;
}

function focus () {
  cache.input.focus();
}

function init (dom, cb) {
  dom.cancel.addEventListener('click', close);
  dom.close.addEventListener('click', close);
  dom.ok.addEventListener('click', ok);

  dom.input.addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) {
      ok();
      e.preventDefault();
    }
  });

  function ok () {
    close();
    cb(dom.input.value);
  }

  function close () {
    dom.dialog.classList.remove('pmk-prompt-open');
  }
}

module.exports = {
  draw: draw,
  init: init
};
