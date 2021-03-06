# ponymark

> Next-generation [`PageDown`][1] fork

[**Click here for a demo**][11]

# Features

- Super Modular!
- _No libraries or frameworks_
- Clean [CSS styling using prefixes][8]
- [GitHub Flavored Markdown][7]
- Syntax Highlighting through [highlight.js][6]
- Image drag and drop
- Default image uploading endpoint for the server-side
- Support for [imgur][5] and local file uploads
- MIT licensed

## Install

```shell
npm i -S ponymark
```

```shell
bower i -S ponymark
```

Then you have to provide it with a function that can parse Markdown. This can be a function you wrote by yourself or a reference to a module such as a [ultramarked][9].

```js
ponymark.configure({
  markdown: function (text) {
    return parse(text);
  }
});
```

```js
ponymark.configure({
  markdown: require('ultramarked')
});
```

## Usage

Just include the JavaScript and call the `ponymark` method on a `<textarea>` element. You'll get a button bar, the editor, and a preview area just like the one in StackOverflow. Remember to include the CSS to get the button bar working correctly. You can include the Stylus sources directly. The syntax highlighting styles come bundled separately, so that you can pick any other you want.

[Test syntax highlighting themes here][2], then [download them here][3]. Just include the style files as is, and you'll be fine.

```js
var elem = document.querySelector('textarea');
ponymark(elem);
```

You can also specify different containers for the editor and the HTML preview. This is useful when you have multiple inputs and then want the preview to be placed somewhere else in the DOM.

```js
ponymark({
  textarea: document.querySelector('textarea'),
  preview: document.querySelector('footer')
});
```

## Image Uploads

Ponymark supports image uploading through your site. Simply configure it before invoking `ponymark`.

```js
ponymark.configure({
  imageUploads: '/api/v1/images'
});
```

You can specify a method by passing an object instead. The default method used is `PUT`, and the default `FormData` key used to upload the image is `'image'`.

```js
ponymark.configure({
  imageUploads: {
    method: 'POST',
    url: '/api/v0/images',
    key: 'imgur'
  }
});
```

### Server-Side

Ponymark will send requests to the specified HTTP resource with the user image. As for the server-side, a helper is provided, and you can use it as demonstrated below with your favorite web back-end of choice. Here's an example using `express@^4.1.2`.

```js
'use strict';

var path = require('path');
var ponymark = require('ponymark');
var dir = path.resolve('./temp/images');

module.exports = function (req, res, next) {
  var options = {
    // note that the key should match imageUploads.key, see above
    image: req.files && req.files.image,
    imgur: process.env.IMGUR_API_KEY,
    local: dir
  };

  ponymark.imageUpload(options, uploaded);

  function uploaded (err, result) {
    if (err) {
      errored(err.message); return;
    }
    res.status(200).json(result);
  }

  function errored (message) {
    res.status(400).json({ messages: [message] });
  }
};

```

If an API key to [imgur][5] isn't provided, then the local file system will be used. That is super unreliable in production environments, so **either provide the API key, or implement your own endpoint**. The local file system functionality is entirely disabled when `process.env.NODE_ENV === 'production'`. The `local` option specifies the directory where files will be uploaded to, and the `localUrl` method is provided an absolute file path, and expects you to return the URL you'll be using to serve that file from. That url will only be used for the response.

The HTTP endpoint is expected to return a JSON response like the one below. This is the type of response returned in `result` if the upload doesn't fail.

```json
{
  "url": "http://i.imgur.com/cC3fCEN.jpg",
  "alt": "doge.png"
}
```

## Screenshot

![screenshot.png][4]

## License

MIT

[1]: https://code.google.com/p/pagedown/ "PageDown: A JavaScript Markdown converter and editor"
[2]: http://highlightjs.org/static/test.html
[3]: https://github.com/isagalaev/highlight.js/tree/master/src/styles
[4]: http://i.imgur.com/BTmLVPR.png
[5]: http://imgur.com
[6]: https://github.com/isagalaev/highlight.js
[7]: http://github.github.com/github-flavored-markdown/
[8]: http://blog.ponyfoo.com/2014/05/17/css-the-good-parts "CSS: The Good Parts"
[9]: https://github.com/bevacqua/ultramarked
[10]: https://github.com/bevacqua/ponymark/blob/master/src/parse.js
[11]: http://codepen.io/bevacqua/full/AlFhD/
