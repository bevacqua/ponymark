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

## Usage

Just include the JavaScript and call the `ponymark` method on a `<div>`. You'll get a button bar, the editor, and a preview area just like the one in StackOverflow. Remember to include the CSS to get the button bar working correctly. You can include the Stylus sources directly. The syntax highlighting styles come bundled separately, so that you can pick any other you want.

[Test syntax highlighting themes here][2], then [download them here][3]. Just include the style files as is, and you'll be fine.

```js
var elem = document.querySelector('div');
ponymark(elem);
```

You can also pick individual containers for each of the three different parts of the editor. This is useful when you have multiple inputs and then want the preview to be placed somewhere else in the DOM.

```js
ponymark({
  buttons: document.querySelector('header'),
  input: document.querySelector('div'),
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

You can specify a method by passing an object instead. The default method used is `PUT`.

```js
ponymark.configure({
  imageUploads: {
    method: 'POST',
    url: '/api/v0/images'
  }
});
```

### Server-Side

Ponymark will send requests to the specified HTTP resource with the user image. The image is named `image` in the `FormData`. As for the server-side, a default implementation is provided, and you can access it as demonstrated below.

```js
var ponymark = require('ponymark');

app.put('/api/images', ponymark.images({
  imgur: process.env.IMGUR_API_KEY,
  local: path.resolve('./uploads'),
  localUrl: function (file) {
    return file.replace(local, '/img/uploads');
  }
}));
```

If an API key to [imgur][5] isn't provided, then the local file system will be used. That is super unreliable in production environments, so **either provide the API key, or implement your own endpoint**. The local file system functionality is entirely disabled when `process.env.NODE_ENV === 'production'`. The `local` option specifies the directory where files will be uploaded to, and the `localUrl` method is provided an absolute file path, and expects you to return the URL you'll be using to serve that file from. That url will only be used for the response.

The HTTP endpoint is expected to return a JSON response like the one below.

```json
{
  "url": "http://i.imgur.com/cC3fCEN.jpg",
  "alt": "doge.png"
}
```

### Markdown Engine

Ponymark uses [**ultramarked**][9] to render your Markdown content. If you are rendering Markdown anywhere else, make sure to use that package, for consistent output. Check out how [Ponymark configures `ultramarked` here][10].

```js
var ultramarked = require('ultramarked');

ultramarked.setOptions({
  smartLists: true,
  ultralight: true,
  ultrasanitize: true
});
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
