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

You can specify a verb by passing an object instead. The default verb used is `PUT`.

```js
ponymark.configure({
  imageUploads: {
    verb: 'POST',
    url: '/api/v0/images'
  }
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
