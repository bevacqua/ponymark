'use strict';

var contra = require('contra');
var path = require('path');
var fs = require('fs-extra');
var mkdirp = require('mkdirp');
var tmp = require('tmp');
var imgur = require('imgur');
var defaultLocal = path.resolve('./uploads');
var production = process.env.NODE_ENV === 'production';

function defaultLocalUrl (local, file) {
  return file.replace(local, '/img/uploads');
}

function images (options) {
  var opts = {
    imgur: options.imgur,
    local: options.local || defaultLocal,
    localUrl: options.localUrl || defaultLocalUrl
  };
  if (opts.imgur) {
    imgur.setKey(opts.imgur);
  }
  if (!production) {
    mkdirp.sync(opts.local);
  }

  return function imageUploads (req, res, fallthrough) {
    var image = req.files ? req.files.image : null;
    if (!image) {
      res.json(400, { error: 'No image received on the back-end' });
    } else if (opts.imgur) {
      imgurUpload(req, res, fallthrough, image);
    } else if (!production) {
      fileUpload(req, res, fallthrough, image, opts);
    } else {
      fallthrough();
    }
  };
}

function imgurUpload (req, res, fallthrough, image) {
  imgur.upload(image.path, function (data) {
    if (data.error) {
      fallthrough(data.error); return;
    }

    res.end(200, {
      alt: image.name,
      url: data.links.original
    });
  });
}

function fileUpload (req, res, fallthrough, image, opts) {
  contra.waterfall([
    function (next) {
      tmp.tmpName({
        template: path.join(opts.local, 'XXXXXX'),
        postfix: path.extname(image.name)
      }, next);
    },
    function (temp, next) {
      fs.move(image.path, temp, function (err) {
        next(err, temp);
      });
    }
  ], function (err, temp) {
    if (err) {
      fallthrough(err); return;
    }
    res.json(200, {
      alt: image.name,
      url: opts.localUrl(opts.local, temp)
    });
  });
}

module.exports = {
  images: images
};
