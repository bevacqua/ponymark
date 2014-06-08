'use strict';

var doc = global.document;
var ac = 'appendChild';

function e (type, cls, text) {
  var elem = doc.createElement(type);
  elem.className = cls;
  if (text) {
    elem.innerText = text;
  }
  return elem;
}

module.exports = function (opts) {
  var dom = {
    dialog: e('article', 'pmk-prompt ' + opts.id),
    close: e('a', 'pmk-prompt-close'),
    header: e('header', 'pmk-prompt-header'),
    h1: e('h1', 'pmk-prompt-title', opts.title),
    section: e('section', 'pmk-prompt-body'),
    desc: e('p', 'pmk-prompt-description', opts.description),
    input: e('input', 'pmk-prompt-input'),
    cancel: e('a', 'pmk-prompt-cancel', 'Cancel'),
    ok: e('button', 'pmk-prompt-ok', 'Ok'),
    footer: e('footer', 'pmk-prompt-buttons')
  };
  dom.header[ac](dom.h1);
  dom.section[ac](dom.desc);
  dom.section[ac](dom.input);
  dom.input.placeholder = opts.placeholder;
  dom.footer[ac](dom.cancel);
  dom.footer[ac](dom.ok);
  dom.dialog[ac](dom.close);
  dom.dialog[ac](dom.header);
  dom.dialog[ac](dom.section);
  dom.dialog[ac](dom.footer);
  doc.body[ac](dom.dialog);
  return dom;
};

module.exports.uploads = function (dom) {
  var up = {
    area: e('section', 'pmk-prompt-upload-area'),
    desc: e('div', 'pmk-prompt-description'),
    drop: e('div', 'pmk-prompt-drop', 'Drop here to begin upload'),
    uploading: e('div', 'pmk-prompt-uploading', 'Uploading file...'),
    upload: e('button', 'pmk-prompt-upload'),
    browse: e('span', 'pmk-prompt-browse', 'Browse...'),
    dragdrop: e('span', 'pmk-prompt-dragdrop', 'You can also drop files here'),
    input: e('input', 'pmk-prompt-fileupload')
  };
  up.area[ac](up.drop);
  up.area[ac](up.uploading);
  up.area[ac](up.upload);
  up.upload[ac](up.browse);
  up.upload[ac](up.dragdrop);
  up.upload[ac](up.input);
  up.input.type = 'file';
  dom.section[ac](up.area);
  return up;
};
