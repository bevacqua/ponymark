# ponymark

> Next-generation [`PageDown`][1] fork

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

## Screenshot

![screenshot.png][4]

## License

MIT

[1]: https://code.google.com/p/pagedown/ "PageDown: A JavaScript Markdown converter and editor"
[2]: http://highlightjs.org/static/test.html
[3]: https://github.com/isagalaev/highlight.js/tree/master/src/styles
[4]: http://i.imgur.com/BTmLVPR.png
[5]: http://imgur.com
