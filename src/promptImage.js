'use strict';

var xhr = require('xhr');
var raf = require('raf');
var configure = require('./configure');
var promptLink = require('./promptLink');
var promptRender = require('./promptRender');
var fireEvent = require('./fireEvent');
var cache;

function draw (cb) {
  if (cache) {
    cache.dialog.parentElement.removeChild(cache.dialog);
  }
  cache = promptRender({
    id: 'pmk-image-prompt',
    title: 'Insert Image',
    description: 'Type or paste the url to your image',
    placeholder: 'http://example.com/public/doge.png "optional title"'
  });
  init(cache, cb);
  cache.dialog.classList.add('pmk-prompt-open');
  raf(focus);
  return cache.dialog;
}

function focus () {
  cache.input.focus();
}

function init (dom, cb) {
  promptLink.init(dom, cb);

  if (configure.imageUploads) {
    arrangeImageUpload(dom, cb);
  }
}

function arrangeImageUpload (dom, cb) {
  var up = promptRender.uploads(dom);
  var dragClass = 'pmk-prompt-upload-dragging';

  document.body.addEventListener('dragenter', dragging);
  document.body.addEventListener('dragend', dragstop);

  up.input.addEventListener('change', handleChange, false);
  up.upload.addEventListener('dragover', handleDragOver, false);
  up.upload.addEventListener('drop', handleFileSelect, false);

  function handleChange (e) {
    e.stopPropagation();
    e.preventDefault();
    go(e.target.files);
  }

  function handleDragOver (e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }

  function handleFileSelect (e) {
    e.stopPropagation();
    e.preventDefault();
    go(e.dataTransfer.files);
  }

  function valid (files) {
    var mime = /^image\//i, i, file;

    up.warning.classList.remove('pmk-prompt-error-show');

    for (i = 0; i < files.length; i++) {
      file = files[i];

      if (mime.test(file.type)) {
        return file;
      }
    }
    warn();
  }

  function warn (message) {
    up.warning.classList.add('pmk-prompt-error-show');
  }

  function dragging () {
    up.upload.classList.add(dragClass);
  }

  function dragstop () {
    up.upload.classList.remove(dragClass);
  }

  function close () {
    cache.dialog.classList.remove('pmk-prompt-open');
  }

  function go (files) {
    var file = valid(files);
    if (!file) {
      return;
    }
    var form = new FormData();
    var options = {
      'Content-Type': 'multipart/form-data',
      headers: {
        Accept: 'application/json'
      },
      method: configure.imageUploads.method,
      url: configure.imageUploads.url,
      body: form
    };
    form.append(configure.imageUploads.key, file, file.name);
    up.upload.classList.add('pmk-prompt-uploading');
    xhr(options, done);

    function done (err, xhr, body) {
      up.upload.classList.remove('pmk-prompt-uploading');
      if (err) {
        up.failed.classList.add('pmk-prompt-error-show');
        return;
      }
      var json = JSON.parse(body);
      dom.input.value = json.url + ' "' + json.alt + '"';
      close();
      cb(dom.input.value);
    }
  }
}

module.exports = {
  draw: draw
};
