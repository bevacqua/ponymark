'use strict';

function configure (opts) {
  var o = opts || {};
  if (o.imageUploads) {
    if (typeof o.imageUploads === 'string') {
      configure.imageUploads = {
        method: 'PUT',
        url: o.imageUploads,
        key: 'image'
      };
    } else {
      configure.imageUploads = o.imageUploads;
    }
  }
  if (o.markdown) {
    configure.markdown = o.markdown;
  }
}

module.exports = configure;
