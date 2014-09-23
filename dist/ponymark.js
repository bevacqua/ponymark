/**
 * ponymark - Next-generation PageDown fork
 * @version v2.0.0
 * @link https://github.com/bevacqua/ponymark
 * @license MIT
 */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.ponymark=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],2:[function(_dereq_,module,exports){
module.exports = _dereq_('./src/contra.emitter.js');

},{"./src/contra.emitter.js":3}],3:[function(_dereq_,module,exports){
(function (process){
(function (root, undefined) {
  'use strict';

  var undef = '' + undefined;
  function atoa (a, n) { return Array.prototype.slice.call(a, n); }
  function debounce (fn, args, ctx) { if (!fn) { return; } tick(function run () { fn.apply(ctx || null, args || []); }); }

  // cross-platform ticker
  var si = typeof setImmediate === 'function', tick;
  if (si) {
    tick = function (fn) { setImmediate(fn); };
  } else if (typeof process !== undef && process.nextTick) {
    tick = process.nextTick;
  } else {
    tick = function (fn) { setTimeout(fn, 0); };
  }

  function _emitter (thing, options) {
    var opts = options || {};
    var evt = {};
    if (thing === undefined) { thing = {}; }
    thing.on = function (type, fn) {
      if (!evt[type]) {
        evt[type] = [fn];
      } else {
        evt[type].push(fn);
      }
      return thing;
    };
    thing.once = function (type, fn) {
      fn._once = true; // thing.off(fn) still works!
      thing.on(type, fn);
      return thing;
    };
    thing.off = function (type, fn) {
      var c = arguments.length;
      if (c === 1) {
        delete evt[type];
      } else if (c === 0) {
        evt = {};
      } else {
        var et = evt[type];
        if (!et) { return thing; }
        et.splice(et.indexOf(fn), 1);
      }
      return thing;
    };
    thing.emit = function () {
      var args = atoa(arguments);
      var type = args.shift();
      var et = evt[type];
      if (type === 'error' && opts.throws !== false && !et) { throw args.length === 1 ? args[0] : args; }
      if (!et) { return thing; }
      evt[type] = et.filter(function emitter (listen) {
        if (opts.async) { debounce(listen, args, thing); } else { listen.apply(thing, args); }
        return !listen._once;
      });
      return thing;
    };
    return thing;
  }

  // cross-platform export
  if (typeof module !== undef && module.exports) {
    module.exports = _emitter;
  } else {
    root.contra = root.contra || {};
    root.contra.emitter = _emitter;
  }
})(this);

}).call(this,_dereq_("FWaASH"))
},{"FWaASH":1}],4:[function(_dereq_,module,exports){
var now = _dereq_('performance-now')
  , global = typeof window === 'undefined' ? {} : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = global['request' + suffix]
  , caf = global['cancel' + suffix] || global['cancelRequest' + suffix]

for(var i = 0; i < vendors.length && !raf; i++) {
  raf = global[vendors[i] + 'Request' + suffix]
  caf = global[vendors[i] + 'Cancel' + suffix]
      || global[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now()
        , next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        var cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for (var i = 0; i < cp.length; i++) {
          if (!cp[i].cancelled) {
            try{
              cp[i].callback(last)
            } catch(e) {}
          }
        }
      }, next)
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

module.exports = function() {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.apply(global, arguments)
}
module.exports.cancel = function() {
  caf.apply(global, arguments)
}

},{"performance-now":5}],5:[function(_dereq_,module,exports){
(function (process){
// Generated by CoffeeScript 1.6.3
(function() {
  var getNanoSeconds, hrtime, loadTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - loadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    loadTime = getNanoSeconds();
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);

/*
//@ sourceMappingURL=performance-now.map
*/

}).call(this,_dereq_("FWaASH"))
},{"FWaASH":1}],6:[function(_dereq_,module,exports){
var window = _dereq_("global/window")
var once = _dereq_("once")

var messages = {
    "0": "Internal XMLHttpRequest Error",
    "4": "4xx Client Error",
    "5": "5xx Server Error"
}

var XHR = window.XMLHttpRequest || noop
var XDR = "withCredentials" in (new XHR()) ?
        window.XMLHttpRequest : window.XDomainRequest

module.exports = createXHR

function createXHR(options, callback) {
    if (typeof options === "string") {
        options = { uri: options }
    }

    options = options || {}
    callback = once(callback)

    var xhr = options.xhr || null

    if (!xhr && options.cors) {
        xhr = new XDR()
    } else if (!xhr) {
        xhr = new XHR()
    }

    var uri = xhr.url = options.uri || options.url;
    var method = xhr.method = options.method || "GET"
    var body = options.body || options.data
    var headers = xhr.headers = options.headers || {}
    var sync = !!options.sync
    var isJson = false
    var key

    if ("json" in options) {
        isJson = true
        headers["Accept"] = "application/json"
        if (method !== "GET" && method !== "HEAD") {
            headers["Content-Type"] = "application/json"
            body = JSON.stringify(options.json)
        }
    }

    xhr.onreadystatechange = readystatechange
    xhr.onload = load
    xhr.onerror = error
    // IE9 must have onprogress be set to a unique function.
    xhr.onprogress = function () {
        // IE must die
    }
    // hate IE
    xhr.ontimeout = noop
    xhr.open(method, uri, !sync)
    if (options.cors) {
        xhr.withCredentials = true
    }
    // Cannot set timeout with sync request
    if (!sync) {
        xhr.timeout = "timeout" in options ? options.timeout : 5000
    }

    if (xhr.setRequestHeader) {
        for(key in headers){
            if(headers.hasOwnProperty(key)){
                xhr.setRequestHeader(key, headers[key])
            }
        }
    }

    if ("responseType" in options) {
        xhr.responseType = options.responseType
    }

    xhr.send(body)

    return xhr

    function readystatechange() {
        if (xhr.readyState === 4) {
            load()
        }
    }

    function load() {
        var error = null
        var status = xhr.statusCode = xhr.status
        var body = xhr.body = xhr.response ||
            xhr.responseText || xhr.responseXML

        if (status === 1223) {
            status = 204
        }

        if (status === 0 || (status >= 400 && status < 600)) {
            var message = xhr.responseText ||
                messages[String(xhr.status).charAt(0)]
            error = new Error(message)

            error.statusCode = xhr.status
        }

        if (isJson) {
            try {
                body = xhr.body = JSON.parse(body)
            } catch (e) {}
        }

        callback(error, xhr, body)
    }

    function error(evt) {
        callback(evt, xhr)
    }
}


function noop() {}

},{"global/window":7,"once":8}],7:[function(_dereq_,module,exports){
(function (global){
if (typeof window !== "undefined") {
    module.exports = window
} else if (typeof global !== "undefined") {
    module.exports = global
} else {
    module.exports = {}
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],8:[function(_dereq_,module,exports){
module.exports = once

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })
})

function once (fn) {
  var called = false
  return function () {
    if (called) return
    called = true
    return fn.apply(this, arguments)
  }
}

},{}],9:[function(_dereq_,module,exports){
'use strict';

var ua = _dereq_('./ua');
var util = _dereq_('./util');
var re = RegExp;

function Chunks () {
}

Chunks.prototype.findTags = function (startRegex, endRegex) {
  var self = this;
  var regex;

  if (startRegex) {
    regex = util.extendRegExp(startRegex, '', '$');
    this.before = this.before.replace(regex, start_replacer);
    regex = util.extendRegExp(startRegex, '^', '');
    this.selection = this.selection.replace(regex, start_replacer);
  }

  if (endRegex) {
    regex = util.extendRegExp(endRegex, '', '$');
    this.selection = this.selection.replace(regex, end_replacer);
    regex = util.extendRegExp(endRegex, '^', '');
    this.after = this.after.replace(regex, end_replacer);
  }

  function start_replacer (match) {
    self.startTag = self.startTag + match;
    return '';
  }
  function end_replacer (match) {
    self.endTag = match + self.endTag;
    return '';
  }
};

Chunks.prototype.trimWhitespace = function (remove) {
  var beforeReplacer, afterReplacer, self = this;
  if (remove) {
    beforeReplacer = afterReplacer = '';
  } else {
    beforeReplacer = function (s) { self.before += s; return ''; }
    afterReplacer = function (s) { self.after = s + self.after; return ''; }
  }

  this.selection = this.selection.replace(/^(\s*)/, beforeReplacer).replace(/(\s*)$/, afterReplacer);
};

Chunks.prototype.skipLines = function (nLinesBefore, nLinesAfter, findExtraNewlines) {
  if (nLinesBefore === void 0) {
    nLinesBefore = 1;
  }

  if (nLinesAfter === void 0) {
    nLinesAfter = 1;
  }

  nLinesBefore++;
  nLinesAfter++;

  var regexText;
  var replacementText;

  if (ua.isChrome) {
    'X'.match(/()./);
  }

  this.selection = this.selection.replace(/(^\n*)/, '');
  this.startTag = this.startTag + re.$1;
  this.selection = this.selection.replace(/(\n*$)/, '');
  this.endTag = this.endTag + re.$1;
  this.startTag = this.startTag.replace(/(^\n*)/, '');
  this.before = this.before + re.$1;
  this.endTag = this.endTag.replace(/(\n*$)/, '');
  this.after = this.after + re.$1;

  if (this.before) {
    regexText = replacementText = '';

    while (nLinesBefore--) {
      regexText += '\\n?';
      replacementText += '\n';
    }

    if (findExtraNewlines) {
      regexText = '\\n*';
    }
    this.before = this.before.replace(new re(regexText + '$', ''), replacementText);
  }

  if (this.after) {
    regexText = replacementText = '';

    while (nLinesAfter--) {
      regexText += '\\n?';
      replacementText += '\n';
    }
    if (findExtraNewlines) {
      regexText = '\\n*';
    }

    this.after = this.after.replace(new re(regexText, ''), replacementText);
  }
};

module.exports = Chunks;

},{"./ua":25,"./util":27}],10:[function(_dereq_,module,exports){
'use strict';

var ui = _dereq_('./ui')
var settings = { lineLength: 72 };
var re = RegExp;

function CommandManager (getString) {
  this.getString = getString;
}

var $ = CommandManager.prototype;

$.prefixes = '(?:\\s{4,}|\\s*>|\\s*-\\s+|\\s*\\d+\\.|=|\\+|-|_|\\*|#|\\s*\\[[^\n]]+\\]:)';

$.unwrap = function (chunk) {
  var txt = new re('([^\\n])\\n(?!(\\n|' + this.prefixes + '))', 'g');
  chunk.selection = chunk.selection.replace(txt, '$1 $2');
};

$.wrap = function (chunk, len) {
  this.unwrap(chunk);
  var regex = new re('(.{1,' + len + '})( +|$\\n?)', 'gm'),
    that = this;

  chunk.selection = chunk.selection.replace(regex, function (line, marked) {
    if (new re('^' + that.prefixes, '').test(line)) {
      return line;
    }
    return marked + '\n';
  });

  chunk.selection = chunk.selection.replace(/\s+$/, '');
};

$.doBold = function (chunk, postProcessing) {
  return this.doBorI(chunk, postProcessing, 2, this.getString('boldexample'));
};

$.doItalic = function (chunk, postProcessing) {
  return this.doBorI(chunk, postProcessing, 1, this.getString('italicexample'));
};

$.doBorI = function (chunk, postProcessing, nStars, insertText) {
  chunk.trimWhitespace();
  chunk.selection = chunk.selection.replace(/\n{2,}/g, '\n');

  var starsBefore = /(\**$)/.exec(chunk.before)[0];
  var starsAfter = /(^\**)/.exec(chunk.after)[0];
  var prevStars = Math.min(starsBefore.length, starsAfter.length);

  if ((prevStars >= nStars) && (prevStars != 2 || nStars != 1)) {
    chunk.before = chunk.before.replace(re('[*]{' + nStars + '}$', ''), '');
    chunk.after = chunk.after.replace(re('^[*]{' + nStars + '}', ''), '');
  } else if (!chunk.selection && starsAfter) {
    chunk.after = chunk.after.replace(/^([*_]*)/, '');
    chunk.before = chunk.before.replace(/(\s?)$/, '');
    var whitespace = re.$1;
    chunk.before = chunk.before + starsAfter + whitespace;
  } else {
    if (!chunk.selection && !starsAfter) {
      chunk.selection = insertText;
    }

    var markup = nStars <= 1 ? '*' : '**';
    chunk.before = chunk.before + markup;
    chunk.after = markup + chunk.after;
  }
};

$.stripLinkDefs = function (text, defsToAdd) {
  var regex = /^[ ]{0,3}\[(\d+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+|$)/gm;

  function replacer (all, id, link, newlines, title) {
    defsToAdd[id] = all.replace(/\s*$/, '');
    if (newlines) {
      defsToAdd[id] = all.replace(/["(](.+?)[")]$/, '');
      return newlines + title;
    }
    return '';
  }

  return text.replace(regex, replacer);
};

$.addLinkDef = function (chunk, linkDef) {
  var refNumber = 0;
  var defsToAdd = {};
  chunk.before = this.stripLinkDefs(chunk.before, defsToAdd);
  chunk.selection = this.stripLinkDefs(chunk.selection, defsToAdd);
  chunk.after = this.stripLinkDefs(chunk.after, defsToAdd);

  var defs = '';
  var regex = /(\[)((?:\[[^\]]*\]|[^\[\]])*)(\][ ]?(?:\n[ ]*)?\[)(\d+)(\])/g;

  function addDefNumber (def) {
    refNumber++;
    def = def.replace(/^[ ]{0,3}\[(\d+)\]:/, '  [' + refNumber + ']:');
    defs += '\n' + def;
  }

  function getLink (wholeMatch, before, inner, afterInner, id, end) {
    inner = inner.replace(regex, getLink);
    if (defsToAdd[id]) {
      addDefNumber(defsToAdd[id]);
      return before + inner + afterInner + refNumber + end;
    }
    return wholeMatch;
  }

  chunk.before = chunk.before.replace(regex, getLink);

  if (linkDef) {
    addDefNumber(linkDef);
  } else {
    chunk.selection = chunk.selection.replace(regex, getLink);
  }

  var refOut = refNumber;

  chunk.after = chunk.after.replace(regex, getLink);

  if (chunk.after) {
    chunk.after = chunk.after.replace(/\n*$/, '');
  }
  if (!chunk.after) {
    chunk.selection = chunk.selection.replace(/\n*$/, '');
  }

  chunk.after += '\n\n' + defs;

  return refOut;
};

function properlyEncoded (linkdef) {
  function replacer (wholematch, link, title) {
    link = link.replace(/\?.*$/, function (querypart) {
      return querypart.replace(/\+/g, ' '); // in the query string, a plus and a space are identical
    });
    link = decodeURIComponent(link); // unencode first, to prevent double encoding
    link = encodeURI(link).replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29');
    link = link.replace(/\?.*$/, function (querypart) {
      return querypart.replace(/\+/g, '%2b'); // since we replaced plus with spaces in the query part, all pluses that now appear where originally encoded
    });
    if (title) {
      title = title.trim ? title.trim() : title.replace(/^\s*/, '').replace(/\s*$/, '');
      title = title.replace(/"/g, 'quot;').replace(/\(/g, '&#40;').replace(/\)/g, '&#41;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    return title ? link + ' "' + title + '"' : link;
  }
  return linkdef.replace(/^\s*(.*?)(?:\s+"(.+)")?\s*$/, replacer);
}

$.doLinkOrImage = function (chunk, postProcessing, isImage) {
  var self = this;
  var background;

  chunk.trimWhitespace();
  chunk.findTags(/\s*!?\[/, /\][ ]?(?:\n[ ]*)?(\[.*?\])?/);

  if (chunk.endTag.length > 1 && chunk.startTag.length > 0) {
    chunk.startTag = chunk.startTag.replace(/!?\[/, '');
    chunk.endTag = '';
    this.addLinkDef(chunk, null);
  } else {
    chunk.selection = chunk.startTag + chunk.selection + chunk.endTag;
    chunk.startTag = chunk.endTag = '';

    if (/\n\n/.test(chunk.selection)) {
      this.addLinkDef(chunk, null);
      return;
    }
    if (isImage) {
      ui.prompt('image', linkEnteredCallback);
    } else {
      ui.prompt('link', linkEnteredCallback);
    }
    return true;
  }

  function linkEnteredCallback (link) {
    if (link !== null) {
      chunk.selection = (' ' + chunk.selection).replace(/([^\\](?:\\\\)*)(?=[[\]])/g, '$1\\').substr(1);

      var linkDef = ' [999]: ' + properlyEncoded(link);
      var num = self.addLinkDef(chunk, linkDef);
      chunk.startTag = isImage ? '![' : '[';
      chunk.endTag = '][' + num + ']';

      if (!chunk.selection) {
        if (isImage) {
          chunk.selection = self.getString('imagedescription');
        }
        else {
          chunk.selection = self.getString('linkdescription');
        }
      }
    }
    postProcessing();
  }
};

$.doAutoindent = function (chunk, postProcessing) {
  var commandMgr = this;
  var fakeSelection = false;

  chunk.before = chunk.before.replace(/(\n|^)[ ]{0,3}([*+-]|\d+[.])[ \t]*\n$/, '\n\n');
  chunk.before = chunk.before.replace(/(\n|^)[ ]{0,3}>[ \t]*\n$/, '\n\n');
  chunk.before = chunk.before.replace(/(\n|^)[ \t]+\n$/, '\n\n');

  if (!chunk.selection && !/^[ \t]*(?:\n|$)/.test(chunk.after)) {
    chunk.after = chunk.after.replace(/^[^\n]*/, function (wholeMatch) {
      chunk.selection = wholeMatch;
      return '';
    });
    fakeSelection = true;
  }

  if (/(\n|^)[ ]{0,3}([*+-]|\d+[.])[ \t]+.*\n$/.test(chunk.before)) {
    if (commandMgr.doList) {
      commandMgr.doList(chunk);
    }
  }
  if (/(\n|^)[ ]{0,3}>[ \t]+.*\n$/.test(chunk.before)) {
    if (commandMgr.doBlockquote) {
      commandMgr.doBlockquote(chunk);
    }
  }
  if (/(\n|^)(\t|[ ]{4,}).*\n$/.test(chunk.before)) {
    if (commandMgr.doCode) {
      commandMgr.doCode(chunk);
    }
  }

  if (fakeSelection) {
    chunk.after = chunk.selection + chunk.after;
    chunk.selection = '';
  }
};

$.doBlockquote = function (chunk, postProcessing) {
  chunk.selection = chunk.selection.replace(/^(\n*)([^\r]+?)(\n*)$/,
    function (totalMatch, newlinesBefore, text, newlinesAfter) {
      chunk.before += newlinesBefore;
      chunk.after = newlinesAfter + chunk.after;
      return text;
    });

  chunk.before = chunk.before.replace(/(>[ \t]*)$/,
    function (totalMatch, blankLine) {
      chunk.selection = blankLine + chunk.selection;
      return '';
    });

  chunk.selection = chunk.selection.replace(/^(\s|>)+$/, '');
  chunk.selection = chunk.selection || this.getString('quoteexample');

  var match = '';
  var leftOver = '';
  var line;

  if (chunk.before) {
    var lines = chunk.before.replace(/\n$/, '').split('\n');
    var inChain = false;
    for (var i = 0; i < lines.length; i++) {
      var good = false;
      line = lines[i];
      inChain = inChain && line.length > 0;
      if (/^>/.test(line)) {
        good = true;
        if (!inChain && line.length > 1)
          inChain = true;
      } else if (/^[ \t]*$/.test(line)) {
        good = true;
      } else {
        good = inChain;
      }
      if (good) {
        match += line + '\n';
      } else {
        leftOver += match + line;
        match = '\n';
      }
    }
    if (!/(^|\n)>/.test(match)) {
      leftOver += match;
      match = '';
    }
  }

  chunk.startTag = match;
  chunk.before = leftOver;

  // end of change

  if (chunk.after) {
    chunk.after = chunk.after.replace(/^\n?/, '\n');
  }

  chunk.after = chunk.after.replace(/^(((\n|^)(\n[ \t]*)*>(.+\n)*.*)+(\n[ \t]*)*)/,
    function (totalMatch) {
      chunk.endTag = totalMatch;
      return '';
    }
  );

  var replaceBlanksInTags = function (useBracket) {

    var replacement = useBracket ? '> ' : '';

    if (chunk.startTag) {
      chunk.startTag = chunk.startTag.replace(/\n((>|\s)*)\n$/,
        function (totalMatch, markdown) {
          return '\n' + markdown.replace(/^[ ]{0,3}>?[ \t]*$/gm, replacement) + '\n';
        });
    }
    if (chunk.endTag) {
      chunk.endTag = chunk.endTag.replace(/^\n((>|\s)*)\n/,
        function (totalMatch, markdown) {
          return '\n' + markdown.replace(/^[ ]{0,3}>?[ \t]*$/gm, replacement) + '\n';
        });
    }
  };

  if (/^(?![ ]{0,3}>)/m.test(chunk.selection)) {
    this.wrap(chunk, settings.lineLength - 2);
    chunk.selection = chunk.selection.replace(/^/gm, '> ');
    replaceBlanksInTags(true);
    chunk.skipLines();
  } else {
    chunk.selection = chunk.selection.replace(/^[ ]{0,3}> ?/gm, '');
    this.unwrap(chunk);
    replaceBlanksInTags(false);

    if (!/^(\n|^)[ ]{0,3}>/.test(chunk.selection) && chunk.startTag) {
      chunk.startTag = chunk.startTag.replace(/\n{0,2}$/, '\n\n');
    }

    if (!/(\n|^)[ ]{0,3}>.*$/.test(chunk.selection) && chunk.endTag) {
      chunk.endTag = chunk.endTag.replace(/^\n{0,2}/, '\n\n');
    }
  }

  if (!/\n/.test(chunk.selection)) {
    chunk.selection = chunk.selection.replace(/^(> *)/, function (wholeMatch, blanks) {
      chunk.startTag += blanks;
      return '';
    });
  }
};

$.doCode = function (chunk, postProcessing) {

  var hasTextBefore = /\S[ ]*$/.test(chunk.before);
  var hasTextAfter = /^[ ]*\S/.test(chunk.after);

  // Use 'four space' markdown if the selection is on its own
  // line or is multiline.
  if ((!hasTextAfter && !hasTextBefore) || /\n/.test(chunk.selection)) {

    chunk.before = chunk.before.replace(/[ ]{4}$/,
      function (totalMatch) {
        chunk.selection = totalMatch + chunk.selection;
        return '';
      });

    var nLinesBack = 1;
    var nLinesForward = 1;

    if (/(\n|^)(\t|[ ]{4,}).*\n$/.test(chunk.before)) {
      nLinesBack = 0;
    }
    if (/^\n(\t|[ ]{4,})/.test(chunk.after)) {
      nLinesForward = 0;
    }

    chunk.skipLines(nLinesBack, nLinesForward);

    if (!chunk.selection) {
      chunk.startTag = '    ';
      chunk.selection = this.getString('codeexample');
    }
    else {
      if (/^[ ]{0,3}\S/m.test(chunk.selection)) {
        if (/\n/.test(chunk.selection))
          chunk.selection = chunk.selection.replace(/^/gm, '    ');
        else // if it's not multiline, do not select the four added spaces; this is more consistent with the doList behavior
          chunk.before += '    ';
      }
      else {
        chunk.selection = chunk.selection.replace(/^(?:[ ]{4}|[ ]{0,3}\t)/gm, '');
      }
    }
  }
  else {
    // Use backticks (`) to delimit the code block.

    chunk.trimWhitespace();
    chunk.findTags(/`/, /`/);

    if (!chunk.startTag && !chunk.endTag) {
      chunk.startTag = chunk.endTag = '`';
      if (!chunk.selection) {
        chunk.selection = this.getString('codeexample');
      }
    }
    else if (chunk.endTag && !chunk.startTag) {
      chunk.before += chunk.endTag;
      chunk.endTag = '';
    }
    else {
      chunk.startTag = chunk.endTag = '';
    }
  }
};

$.doList = function (chunk, postProcessing, isNumberedList) {
  var previousItemsRegex = /(\n|^)(([ ]{0,3}([*+-]|\d+[.])[ \t]+.*)(\n.+|\n{2,}([*+-].*|\d+[.])[ \t]+.*|\n{2,}[ \t]+\S.*)*)\n*$/;
  var nextItemsRegex = /^\n*(([ ]{0,3}([*+-]|\d+[.])[ \t]+.*)(\n.+|\n{2,}([*+-].*|\d+[.])[ \t]+.*|\n{2,}[ \t]+\S.*)*)\n*/;
  var bullet = '-';
  var num = 1;

  function getItemPrefix () {
    var prefix;
    if (isNumberedList) {
      prefix = ' ' + num + '. ';
      num++;
    }
    else {
      prefix = ' ' + bullet + ' ';
    }
    return prefix;
  };

  function getPrefixedItem (itemText) {
    if (isNumberedList === void 0) {
      isNumberedList = /^\s*\d/.test(itemText);
    }

    itemText = itemText.replace(/^[ ]{0,3}([*+-]|\d+[.])\s/gm, function () {
      return getItemPrefix();
    });

    return itemText;
  };

  chunk.findTags(/(\n|^)*[ ]{0,3}([*+-]|\d+[.])\s+/, null);

  if (chunk.before && !/\n$/.test(chunk.before) && !/^\n/.test(chunk.startTag)) {
    chunk.before += chunk.startTag;
    chunk.startTag = '';
  }

  if (chunk.startTag) {

    var hasDigits = /\d+[.]/.test(chunk.startTag);
    chunk.startTag = '';
    chunk.selection = chunk.selection.replace(/\n[ ]{4}/g, '\n');
    this.unwrap(chunk);
    chunk.skipLines();

    if (hasDigits) {
      chunk.after = chunk.after.replace(nextItemsRegex, getPrefixedItem);
    }
    if (isNumberedList == hasDigits) {
      return;
    }
  }

  var nLinesUp = 1;

  chunk.before = chunk.before.replace(previousItemsRegex,
    function (itemText) {
      if (/^\s*([*+-])/.test(itemText)) {
        bullet = re.$1;
      }
      nLinesUp = /[^\n]\n\n[^\n]/.test(itemText) ? 1 : 0;
      return getPrefixedItem(itemText);
    });

  if (!chunk.selection) {
    chunk.selection = this.getString('litem');
  }

  var prefix = getItemPrefix();
  var nLinesDown = 1;

  chunk.after = chunk.after.replace(nextItemsRegex, function (itemText) {
    nLinesDown = /[^\n]\n\n[^\n]/.test(itemText) ? 1 : 0;
    return getPrefixedItem(itemText);
  });
  chunk.trimWhitespace(true);
  chunk.skipLines(nLinesUp, nLinesDown, true);
  chunk.startTag = prefix;
  var spaces = prefix.replace(/./g, ' ');
  this.wrap(chunk, settings.lineLength - spaces.length);
  chunk.selection = chunk.selection.replace(/\n/g, '\n' + spaces);

};

$.doHeading = function (chunk, postProcessing) {
  chunk.selection = chunk.selection.replace(/\s+/g, ' ');
  chunk.selection = chunk.selection.replace(/(^\s+|\s+$)/g, '');

  if (!chunk.selection) {
    chunk.startTag = '## ';
    chunk.selection = this.getString('headingexample');
    chunk.endTag = '';
    return;
  }

  var headerLevel = 0;

  chunk.findTags(/#+[ ]*/, /[ ]*#+/);
  if (/#+/.test(chunk.startTag)) {
    headerLevel = re.lastMatch.length;
  }
  chunk.startTag = chunk.endTag = '';
  chunk.findTags(null, /\s?(-+|=+)/);
  if (/=+/.test(chunk.endTag)) {
    headerLevel = 1;
  }
  if (/-+/.test(chunk.endTag)) {
    headerLevel = 2;
  }

  chunk.startTag = chunk.endTag = '';
  chunk.skipLines(1, 1);

  var headerLevelToCreate = headerLevel == 1 ? 2 : headerLevel - 1;
  if (headerLevelToCreate > 0) {
    chunk.endTag = '\n';
    while (headerLevelToCreate--) {
      chunk.startTag += '#';
    }
    chunk.startTag += ' ';
  }
};

$.doHorizontalRule = function (chunk, postProcessing) {
  chunk.startTag = '----------\n';
  chunk.selection = '';
  chunk.skipLines(2, 1, true);
}

module.exports = CommandManager;

},{"./ui":26}],11:[function(_dereq_,module,exports){
'use strict';

var emitter = _dereq_('contra.emitter');
var ui = _dereq_('./ui');
var util = _dereq_('./util');
var position = _dereq_('./position');
var PanelCollection = _dereq_('./PanelCollection');
var UndoManager = _dereq_('./UndoManager');
var UIManager = _dereq_('./UIManager');
var CommandManager = _dereq_('./CommandManager');
var PreviewManager = _dereq_('./PreviewManager');

var defaultsStrings = {
  bold: 'Strong <strong> Ctrl+B',
  boldexample: 'strong text',
  code: 'Code Sample <pre><code> Ctrl+K',
  codeexample: 'enter code here',
  heading: 'Heading <h1>/<h2> Ctrl+H',
  headingexample: 'Heading',
  help: 'Markdown Editing Help',
  hr: 'Horizontal Rule <hr> Ctrl+R',
  image: 'Image <img> Ctrl+G',
  imagedescription: 'enter image description here',
  italic: 'Emphasis <em> Ctrl+I',
  italicexample: 'emphasized text',
  link: 'Hyperlink <a> Ctrl+L',
  linkdescription: 'enter link description here',
  litem: 'List item',
  olist: 'Numbered List <ol> Ctrl+O',
  quote: 'Blockquote <blockquote> Ctrl+Q',
  quoteexample: 'Blockquote',
  redo: 'Redo - Ctrl+Y',
  redomac: 'Redo - Ctrl+Shift+Z',
  ulist: 'Bulleted List <ul> Ctrl+U',
  undo: 'Undo - Ctrl+Z'
};

function Editor (postfix, opts) {
  var options = opts || {};

  if (typeof options.handler === 'function') { //backwards compatible behavior
    options = { helpButton: options };
  }
  options.strings = options.strings || {};
  if (options.helpButton) {
    options.strings.help = options.strings.help || options.helpButton.title;
  }
  function getString (identifier) {
    return options.strings[identifier] || defaultsStrings[identifier];
  }

  var api = emitter();
  var self = this;
  var panels;

  self.run = function () {
    if (panels) {
      return; // already initialized
    }

    panels = new PanelCollection(postfix);

    var commandManager = new CommandManager(getString);
    var previewManager = new PreviewManager(panels, function () {
      api.emit('refresh');
    });
    var uiManager;

    var undoManager = new UndoManager(function () {
      previewManager.refresh();
      if (uiManager) { // not available on the first call
        uiManager.setUndoRedoButtonStates();
      }
    }, panels);

    uiManager = new UIManager(postfix, panels, undoManager, previewManager, commandManager, options.helpButton, getString);
    uiManager.setUndoRedoButtonStates();

    api.refresh = function () {
      previewManager.refresh(true);
    };
    api.refresh();
  };

  self.api = api;
}

module.exports = Editor;

},{"./CommandManager":10,"./PanelCollection":12,"./PreviewManager":13,"./UIManager":15,"./UndoManager":16,"./position":21,"./ui":26,"./util":27,"contra.emitter":2}],12:[function(_dereq_,module,exports){
'use strict';

function PanelCollection (postfix) {
  this.buttonBar = document.getElementById('pmk-buttons-' + postfix);
  this.preview = document.getElementById('pmk-preview-' + postfix);
  this.input = document.getElementById('pmk-input-' + postfix);
}

module.exports = PanelCollection;

},{}],13:[function(_dereq_,module,exports){
(function (global){
'use strict';

var doc = global.document;
var ua = _dereq_('./ua');
var util = _dereq_('./util');
var parse = _dereq_('./parse');
var position = _dereq_('./position');

function PreviewManager (panels, previewRefreshCallback) {
  var managerObj = this;
  var timeout;
  var elapsedTime;
  var oldInputText;
  var maxDelay = 3000;
  var startType = 'delayed'; // The other legal value is 'manual'

  // Adds event listeners to elements
  var setupEvents = function (inputElem, listener) {

    util.addEvent(inputElem, 'input', listener);
    inputElem.onpaste = listener;
    inputElem.ondrop = listener;

    util.addEvent(inputElem, 'keypress', listener);
    util.addEvent(inputElem, 'keydown', listener);
  };

  var getDocScrollTop = function () {

    var result = 0;

    if (window.innerHeight) {
      result = window.pageYOffset;
    } else if (doc.documentElement && doc.documentElement.scrollTop) {
      result = doc.documentElement.scrollTop;
    } else if (doc.body) {
      result = doc.body.scrollTop;
    }

    return result;
  };

  var makePreviewHtml = function () {

    // If there is no registered preview panel
    // there is nothing to do.
    if (!panels.preview) {
      return;
    }

    var text = panels.input.value;
    if (text && text == oldInputText) {
      return; // Input text hasn't changed.
    } else {
      oldInputText = text;
    }

    var prevTime = new Date().getTime();

    text = parse(text);

    // Calculate the processing time of the HTML creation.
    // It's used as the delay time in the event listener.
    var currTime = new Date().getTime();
    elapsedTime = currTime - prevTime;

    pushPreviewHtml(text);
  };

  // setTimeout is already used.  Used as an event listener.
  var applyTimeout = function () {

    if (timeout) {
      clearTimeout(timeout);
      timeout = void 0;
    }

    if (startType !== 'manual') {

      var delay = 0;

      if (startType === 'delayed') {
        delay = elapsedTime;
      }

      if (delay > maxDelay) {
        delay = maxDelay;
      }
      timeout = setTimeout(makePreviewHtml, delay);
    }
  };

  var getScaleFactor = function (panel) {
    if (panel.scrollHeight <= panel.clientHeight) {
      return 1;
    }
    return panel.scrollTop / (panel.scrollHeight - panel.clientHeight);
  };

  var setPanelScrollTops = function () {
    if (panels.preview) {
      panels.preview.scrollTop = (panels.preview.scrollHeight - panels.preview.clientHeight) * getScaleFactor(panels.preview);
    }
  };

  this.refresh = function (requiresRefresh) {

    if (requiresRefresh) {
      oldInputText = '';
      makePreviewHtml();
    }
    else {
      applyTimeout();
    }
  };

  this.processingTime = function () {
    return elapsedTime;
  };

  var isFirstTimeFilled = true;

  // IE doesn't let you use innerHTML if the element is contained somewhere in a table
  // (which is the case for inline editing) -- in that case, detach the element, set the
  // value, and reattach. Yes, that *is* ridiculous.
  var ieSafePreviewSet = function (text) {
    var preview = panels.preview;
    var parent = preview.parentNode;
    var sibling = preview.nextSibling;
    parent.removeChild(preview);
    preview.innerHTML = text;
    if (!sibling)
      parent.appendChild(preview);
    else
      parent.insertBefore(preview, sibling);
  }

  var nonSuckyBrowserPreviewSet = function (text) {
    panels.preview.innerHTML = text;
  }

  var previewSetter;

  var previewSet = function (text) {
    if (previewSetter)
      return previewSetter(text);

    try {
      nonSuckyBrowserPreviewSet(text);
      previewSetter = nonSuckyBrowserPreviewSet;
    } catch (e) {
      previewSetter = ieSafePreviewSet;
      previewSetter(text);
    }
  };

  var pushPreviewHtml = function (text) {

    var emptyTop = position.getTop(panels.input) - getDocScrollTop();

    if (panels.preview) {
      previewSet(text);
      previewRefreshCallback();
    }

    setPanelScrollTops();

    if (isFirstTimeFilled) {
      isFirstTimeFilled = false;
      return;
    }

    var fullTop = position.getTop(panels.input) - getDocScrollTop();

    if (ua.isIE) {
      setTimeout(function () {
        window.scrollBy(0, fullTop - emptyTop);
      }, 0);
    }
    else {
      window.scrollBy(0, fullTop - emptyTop);
    }
  };

  var init = function () {

    setupEvents(panels.input, applyTimeout);
    makePreviewHtml();

    if (panels.preview) {
      panels.preview.scrollTop = 0;
    }
  };

  init();
};

module.exports = PreviewManager;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./parse":19,"./position":21,"./ua":25,"./util":27}],14:[function(_dereq_,module,exports){
(function (global){
'use strict';

var doc = global.document;
var Chunks = _dereq_('./Chunks');
var ua = _dereq_('./ua');
var util = _dereq_('./util');

function TextareaState (panels, isInitialState) {
  var self = this;
  var input = panels.input;

  self.init = function () {
    if (!util.isVisible(input)) {
      return;
    }
    if (!isInitialState && doc.activeElement && doc.activeElement !== input) {
      return;
    }

    self.setInputSelectionStartEnd();
    self.scrollTop = input.scrollTop;
    if (!self.text && input.selectionStart || input.selectionStart === 0) {
      self.text = input.value;
    }
  }

  self.setInputSelection = function () {
    if (!util.isVisible(input)) {
      return;
    }

    if (input.selectionStart !== void 0 && !ua.isOpera) {
      input.focus();
      input.selectionStart = self.start;
      input.selectionEnd = self.end;
      input.scrollTop = self.scrollTop;
    } else if (doc.selection) {
      if (doc.activeElement && doc.activeElement !== input) {
        return;
      }

      input.focus();
      var range = input.createTextRange();
      range.moveStart('character', -input.value.length);
      range.moveEnd('character', -input.value.length);
      range.moveEnd('character', self.end);
      range.moveStart('character', self.start);
      range.select();
    }
  };

  self.setInputSelectionStartEnd = function () {
    if (!panels.ieCachedRange && (input.selectionStart || input.selectionStart === 0)) {
      self.start = input.selectionStart;
      self.end = input.selectionEnd;
    } else if (doc.selection) {
      self.text = util.fixEolChars(input.value);

      var range = panels.ieCachedRange || doc.selection.createRange();
      var fixedRange = util.fixEolChars(range.text);
      var marker = '\x07';
      var markedRange = marker + fixedRange + marker;
      range.text = markedRange;
      var inputText = util.fixEolChars(input.value);

      range.moveStart('character', -markedRange.length);
      range.text = fixedRange;

      self.start = inputText.indexOf(marker);
      self.end = inputText.lastIndexOf(marker) - marker.length;

      var len = self.text.length - util.fixEolChars(input.value).length;
      if (len) {
        range.moveStart('character', -fixedRange.length);
        while (len--) {
          fixedRange += '\n';
          self.end += 1;
        }
        range.text = fixedRange;
      }

      if (panels.ieCachedRange) {
        self.scrollTop = panels.ieCachedScrollTop;
      }
      panels.ieCachedRange = null;
      self.setInputSelection();
    }
  };

 self.restore = function () {
    if (self.text != void 0 && self.text != input.value) {
      input.value = self.text;
    }
    self.setInputSelection();
    input.scrollTop = self.scrollTop;
  };

  self.getChunks = function () {
    var chunk = new Chunks();
    chunk.before = util.fixEolChars(self.text.substring(0, self.start));
    chunk.startTag = '';
    chunk.selection = util.fixEolChars(self.text.substring(self.start, self.end));
    chunk.endTag = '';
    chunk.after = util.fixEolChars(self.text.substring(self.end));
    chunk.scrollTop = self.scrollTop;
    return chunk;
  };

  self.setChunks = function (chunk) {
    chunk.before = chunk.before + chunk.startTag;
    chunk.after = chunk.endTag + chunk.after;
    self.start = chunk.before.length;
    self.end = chunk.before.length + chunk.selection.length;
    self.text = chunk.before + chunk.selection + chunk.after;
    self.scrollTop = chunk.scrollTop;
  };

  self.init();
};

module.exports = TextareaState;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Chunks":9,"./ua":25,"./util":27}],15:[function(_dereq_,module,exports){
(function (global){
'use strict';

var doc = global.document;
var c = doc.createElement.bind(doc);
var ua = _dereq_('./ua');
var util = _dereq_('./util');
var TextareaState = _dereq_('./TextareaState');

function UIManager (postfix, panels, undoManager, previewManager, commandManager, helpOptions, getString) {
  var inputBox = panels.input;
  var buttons = {};

  makeSpritedButtonRow();

  var keyEvent = 'keydown';
  if (ua.isOpera) {
    keyEvent = 'keypress';
  }

  util.addEvent(inputBox, keyEvent, function (key) {
    if ((!key.ctrlKey && !key.metaKey) || key.altKey || key.shiftKey) {
      return;
    }

    var keyCode = key.charCode || key.keyCode;
    var keyCodeStr = String.fromCharCode(keyCode).toLowerCase();

    switch (keyCodeStr) {
      case 'b': doClick(buttons.bold); break;
      case 'i': doClick(buttons.italic); break;
      case 'l': doClick(buttons.link); break;
      case 'q': doClick(buttons.quote); break;
      case 'k': doClick(buttons.code); break;
      case 'g': doClick(buttons.image); break;
      case 'o': doClick(buttons.olist); break;
      case 'u': doClick(buttons.ulist); break;
      case 'h': doClick(buttons.heading); break;
      case 'r': doClick(buttons.hr); break;
      case 'y': doClick(buttons.redo); break;
      case 'z':
        if (key.shiftKey) {
          doClick(buttons.redo);
        }
        else {
          doClick(buttons.undo);
        }
        break;
      default:
        return;
    }

    if (key.preventDefault) {
      key.preventDefault();
    }
    if (window.event) {
      window.event.returnValue = false;
    }
  });

  util.addEvent(inputBox, 'keyup', function (key) {
    if (key.shiftKey && !key.ctrlKey && !key.metaKey) {
      var keyCode = key.charCode || key.keyCode;

      if (keyCode === 13) {
        var fakeButton = {};
        fakeButton.textOp = bindCommand('doAutoindent');
        doClick(fakeButton);
      }
    }
  });

  if (ua.isIE) {
    util.addEvent(inputBox, 'keydown', function (key) {
      var code = key.keyCode;
      if (code === 27) {
        return false;
      }
    });
  }


  function doClick (button) {
    inputBox.focus();

    if (button.textOp) {
      if (undoManager) {
        undoManager.setCommandMode();
      }

      var state = new TextareaState(panels);

      if (!state) {
        return;
      }

      var chunks = state.getChunks();
      var noCleanup = button.textOp(chunks, fixupInputArea);

      if (!noCleanup) {
        fixupInputArea();
      }
    }
    if (button.execute) {
      button.execute(undoManager);
    }

    function fixupInputArea () {
      inputBox.focus();

      if (chunks) {
        state.setChunks(chunks);
      }
      state.restore();
      previewManager.refresh();
    }
  };

  function setupButton (button, isEnabled) {
    var normalYShift = '0px';
    var disabledYShift = '-20px';
    var highlightYShift = '-40px';
    var image = button.getElementsByTagName('span')[0];
    if (isEnabled) {
      button.onmouseover = function () {
        image.style.backgroundPosition = this.XShift + ' ' + highlightYShift;
      };
      button.onmouseout = function () {
        image.style.backgroundPosition = this.XShift + ' ' + normalYShift;
      };
      button.onmouseout();

      if (ua.isIE) {
        button.onmousedown = function () {
          if (doc.activeElement && doc.activeElement !== panels.input) {
            return;
          }
          panels.ieCachedRange = document.selection.createRange();
          panels.ieCachedScrollTop = panels.input.scrollTop;
        };
      }

      if (!button.isHelp) {
        button.onclick = function () {
          if (this.onmouseout) {
            this.onmouseout();
          }
          doClick(this);
          return false;
        }
      }
    } else {
      image.style.backgroundPosition = button.XShift + ' ' + disabledYShift;
      button.onmouseover = button.onmouseout = button.onclick = function () { };
    }
  }

  function bindCommand (method) {
    if (typeof method === 'string') {
      method = commandManager[method];
    }
    return function () {
      method.apply(commandManager, arguments);
    };
  }

  function makeSpritedButtonRow () {
    var buttonBar = panels.buttonBar;
    var normalYShift = '0px';
    var disabledYShift = '-20px';
    var highlightYShift = '-40px';

    var buttonRow = c('ul');
    buttonRow.id = 'pmk-button-row-' + postfix;
    buttonRow.className = 'pmk-button-row';
    buttonRow = buttonBar.appendChild(buttonRow);

    function makeButton (id, title, XShift, textOp) {
      var button = c('li');
      button.className = 'pmk-button ' + id;
      var buttonImage = c('span');
      button.id = id + '-' + postfix;
      button.appendChild(buttonImage);
      button.title = title;
      button.XShift = XShift;
      if (textOp) {
        button.textOp = textOp;
      }
      setupButton(button, true);
      buttonRow.appendChild(button);
      return button;
    }

    function makeSpacer (num) {
      var spacer = c('li');
      spacer.className = 'pmk-spacer pmk-spacer-' + num;
      spacer.id = 'pmk-spacer-' + postfix + '-' + num;
      buttonRow.appendChild(spacer);
    }

    buttons.bold = makeButton('pmk-bold-button', getString('bold'), '0px', bindCommand('doBold'));
    buttons.italic = makeButton('pmk-italic-button', getString('italic'), '-20px', bindCommand('doItalic'));
    makeSpacer(1);
    buttons.link = makeButton('pmk-link-button', getString('link'), '-40px', bindCommand(function (chunk, postProcessing) {
      return this.doLinkOrImage(chunk, postProcessing, false);
    }));
    buttons.quote = makeButton('pmk-quote-button', getString('quote'), '-60px', bindCommand('doBlockquote'));
    buttons.code = makeButton('pmk-code-button', getString('code'), '-80px', bindCommand('doCode'));
    buttons.image = makeButton('pmk-image-button', getString('image'), '-100px', bindCommand(function (chunk, postProcessing) {
      return this.doLinkOrImage(chunk, postProcessing, true);
    }));
    makeSpacer(2);
    buttons.olist = makeButton('pmk-olist-button', getString('olist'), '-120px', bindCommand(function (chunk, postProcessing) {
      this.doList(chunk, postProcessing, true);
    }));
    buttons.ulist = makeButton('pmk-ulist-button', getString('ulist'), '-140px', bindCommand(function (chunk, postProcessing) {
      this.doList(chunk, postProcessing, false);
    }));
    buttons.heading = makeButton('pmk-heading-button', getString('heading'), '-160px', bindCommand('doHeading'));
    buttons.hr = makeButton('pmk-hr-button', getString('hr'), '-180px', bindCommand('doHorizontalRule'));
    makeSpacer(3);
    buttons.undo = makeButton('pmk-undo-button', getString('undo'), '-200px', null);
    buttons.undo.execute = function (manager) {
      if (manager) {
        manager.undo();
      }
    };

    var redoTitle = getString(ua.isWidnows ? 'redo' : 'redomac');

    buttons.redo = makeButton('pmk-redo-button', redoTitle, '-220px', null);
    buttons.redo.execute = function (manager) {
      if (manager) {
        manager.redo();
      }
    };

    if (helpOptions) {
      var helpButton = c('li');
      var helpButtonImage = c('span');
      helpButton.appendChild(helpButtonImage);
      helpButton.className = 'pmk-button pmk-help-button';
      helpButton.id = 'pmk-help-button-' + postfix;
      helpButton.XShift = '-240px';
      helpButton.isHelp = true;
      helpButton.style.right = '0px';
      helpButton.title = getString('help');
      helpButton.onclick = helpOptions.handler;

      setupButton(helpButton, true);
      buttonRow.appendChild(helpButton);
      buttons.help = helpButton;
    }

    setUndoRedoButtonStates();
  }

  function setUndoRedoButtonStates () {
    if (undoManager) {
      setupButton(buttons.undo, undoManager.canUndo());
      setupButton(buttons.redo, undoManager.canRedo());
    }
  };

  this.setUndoRedoButtonStates = setUndoRedoButtonStates;
}

module.exports = UIManager;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./TextareaState":14,"./ua":25,"./util":27}],16:[function(_dereq_,module,exports){
'use strict';

var ua = _dereq_('./ua');
var util = _dereq_('./util');
var TextareaState = _dereq_('./TextareaState');

function UndoManager (callback, panels) {
  var self = this;
  var undoStack = [];
  var stackPtr = 0;
  var mode = 'none';
  var lastState;
  var timer;
  var inputState;

  function setMode (newMode, noSave) {
    if (mode != newMode) {
      mode = newMode;
      if (!noSave) {
        saveState();
      }
    }

    if (!ua.isIE || mode != 'moving') {
      timer = setTimeout(refreshState, 1);
    } else {
      inputState = null;
    }
  };

  function refreshState (isInitialState) {
    inputState = new TextareaState(panels, isInitialState);
    timer = void 0;
  }

  self.setCommandMode = function () {
    mode = 'command';
    saveState();
    timer = setTimeout(refreshState, 0);
  };

  self.canUndo = function () {
    return stackPtr > 1;
  };

  self.canRedo = function () {
    return undoStack[stackPtr + 1];
  };

  self.undo = function () {
    if (self.canUndo()) {
      if (lastState) {
        lastState.restore();
        lastState = null;
      } else {
        undoStack[stackPtr] = new TextareaState(panels);
        undoStack[--stackPtr].restore();

        if (callback) {
          callback();
        }
      }
    }
    mode = 'none';
    panels.input.focus();
    refreshState();
  };

  self.redo = function () {
    if (self.canRedo()) {
      undoStack[++stackPtr].restore();

      if (callback) {
        callback();
      }
    }

    mode = 'none';
    panels.input.focus();
    refreshState();
  };

  function saveState () {
    var currState = inputState || new TextareaState(panels);

    if (!currState) {
      return false;
    }
    if (mode == 'moving') {
      if (!lastState) {
        lastState = currState;
      }
      return;
    }
    if (lastState) {
      if (undoStack[stackPtr - 1].text != lastState.text) {
        undoStack[stackPtr++] = lastState;
      }
      lastState = null;
    }
    undoStack[stackPtr++] = currState;
    undoStack[stackPtr + 1] = null;
    if (callback) {
      callback();
    }
  }

  function preventCtrlYZ (event) {
    var keyCode = event.charCode || event.keyCode;
    var yz = keyCode == 89 || keyCode == 90;
    var ctrl = event.ctrlKey || event.metaKey;
    if (ctrl && yz) {
      event.preventDefault();
    }
  }
  function handleCtrlYZ (event) {
    var handled = false;
    var keyCode = event.charCode || event.keyCode;
    var keyCodeChar = String.fromCharCode(keyCode);

    if (event.ctrlKey || event.metaKey) {
      switch (keyCodeChar.toLowerCase()) {
        case 'y':
          self.redo();
          handled = true;
          break;

        case 'z':
          if (!event.shiftKey) {
            self.undo();
          }
          else {
            self.redo();
          }
          handled = true;
          break;
      }
    }

    if (handled) {
      if (event.preventDefault) {
        event.preventDefault();
      }
      if (window.event) {
        window.event.returnValue = false;
      }
    }
  }

  function handleModeChange (event) {
    if (event.ctrlKey || event.metaKey) {
      return;
    }

    var keyCode = event.keyCode;

    if ((keyCode >= 33 && keyCode <= 40) || (keyCode >= 63232 && keyCode <= 63235)) {
      setMode('moving');
    } else if (keyCode == 8 || keyCode == 46 || keyCode == 127) {
      setMode('deleting');
    } else if (keyCode == 13) {
      setMode('newlines');
    } else if (keyCode == 27) {
      setMode('escape');
    } else if ((keyCode < 16 || keyCode > 20) && keyCode != 91) {
      setMode('typing');
    }
  };

  function setEventHandlers () {
    util.addEvent(panels.input, 'keypress', preventCtrlYZ);
    util.addEvent(panels.input, 'keydown', handleCtrlYZ);
    util.addEvent(panels.input, 'keydown', handleModeChange);
    util.addEvent(panels.input, 'mousedown', function () {
      setMode('moving');
    });

    panels.input.onpaste = handlePaste;
    panels.input.ondrop = handlePaste;
  }

  function handlePaste () {
    if (ua.isIE || (inputState && inputState.text != panels.input.value)) {
      if (timer == void 0) {
        mode = 'paste';
        saveState();
        refreshState();
      }
    }
  }

  function init () {
    setEventHandlers();
    refreshState(true);
    saveState();
  };

  init();
}

module.exports = UndoManager;

},{"./TextareaState":14,"./ua":25,"./util":27}],17:[function(_dereq_,module,exports){
'use strict';

function configure (opts) {
  var o = opts || {};
  if (o.imageUploads) {
    if (typeof o.imageUploads === 'string') {
      configure.imageUploads = {
        method: 'PUT',
        url: o.imageUploads
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

},{}],18:[function(_dereq_,module,exports){
(function (global){
'use strict';

var doc = global.document;

module.exports = function (elem, type) {
  var e;

  if (doc.createEvent) {
    e = doc.createEvent('HTMLEvents');
    e.initEvent(type, true, true);
  } else {
    e = doc.createEventObject();
    e.eventType = type;
  }
  e.eventName = type;

  if (doc.createEvent) {
    element.dispatchEvent(e);
  } else {
    element.fireEvent('on' + e.eventType, e);
  }
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],19:[function(_dereq_,module,exports){
'use strict';

var configure = _dereq_('./configure');

module.exports = function (text) {
  return configure.markdown(text);
};

},{"./configure":17}],20:[function(_dereq_,module,exports){
(function (global){
'use strict';

var doc = global.document;
var ui = _dereq_('./ui');
var util = _dereq_('./util');
var configure = _dereq_('./configure');
var Editor = _dereq_('./Editor');
var nextId = 0;

function convertTabs () {
  util.addEventDelegate(doc, 'pmk-input', 'keydown', ui.convertTabs);
}

function ponymark (o) {
  var postfix = nextId++;
  var editor;

  if (Object.prototype.toString.call(o) !== '[object Object]') {
    o = {
      buttons: o,
      input: o,
      preview: o
    };
  }

  markup(o, postfix);

  editor = new Editor(postfix);
  editor.run();

  return editor.api;
}

function markup (o, postfix) {
  var buttonBar = doc.createElement('div');
  var preview = doc.createElement('div');
  var existing = o.input && /textarea/i.test(o.input.tagName);
  var input;

  if (!existing) {
    input = doc.createElement('textarea');
    input.className = 'pmk-input';
    input.placeholder = o.placeholder || o.input.getAttribute('placeholder') || '';
  } else {
    input = o.input;
  }
  input.id = 'pmk-input-' + postfix;

  buttonBar.id = 'pmk-buttons-' + postfix;
  buttonBar.className = 'pmk-buttons';
  preview.id = 'pmk-preview-' + postfix;
  preview.className = 'pmk-preview';

  o.buttons.appendChild(buttonBar);

  if (!existing) {
    o.input.appendChild(input);
  }

  o.preview.appendChild(preview);
}

module.exports = ponymark;

ponymark.Editor = Editor;
ponymark.convertTabs = convertTabs;
ponymark.configure = configure;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Editor":11,"./configure":17,"./ui":26,"./util":27}],21:[function(_dereq_,module,exports){
(function (global){
'use strict';

var doc = global.document;

function getTop (elem, isInner) {
  var result = elem.offsetTop;
  if (!isInner) {
    while (elem = elem.offsetParent) {
      result += elem.offsetTop;
    }
  }
  return result;
};

function getHeight (elem) {
  return elem.offsetHeight || elem.scrollHeight;
};

function getWidth (elem) {
  return elem.offsetWidth || elem.scrollWidth;
};

function getPageSize () {
  var scrollWidth, scrollHeight;
  var innerWidth, innerHeight;

  if (self.innerHeight && self.scrollMaxY) {
    scrollWidth = doc.body.scrollWidth;
    scrollHeight = self.innerHeight + self.scrollMaxY;
  } else if (doc.body.scrollHeight > doc.body.offsetHeight) {
    scrollWidth = doc.body.scrollWidth;
    scrollHeight = doc.body.scrollHeight;
  } else {
    scrollWidth = doc.body.offsetWidth;
    scrollHeight = doc.body.offsetHeight;
  }

  if (self.innerHeight) {
    innerWidth = self.innerWidth;
    innerHeight = self.innerHeight;
  } else if (doc.documentElement && doc.documentElement.clientHeight) {
    innerWidth = doc.documentElement.clientWidth;
    innerHeight = doc.documentElement.clientHeight;
  } else if (doc.body) {
    innerWidth = doc.body.clientWidth;
    innerHeight = doc.body.clientHeight;
  }

  var maxWidth = Math.max(scrollWidth, innerWidth);
  var maxHeight = Math.max(scrollHeight, innerHeight);
  return [maxWidth, maxHeight, innerWidth, innerHeight];
};

module.exports = {
  getTop: getTop,
  getHeight: getHeight,
  getWidth: getWidth,
  getPageSize: getPageSize
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],22:[function(_dereq_,module,exports){
'use strict';

var xhr = _dereq_('xhr');
var raf = _dereq_('raf');
var configure = _dereq_('./configure');
var promptLink = _dereq_('./promptLink');
var promptRender = _dereq_('./promptRender');
var fireEvent = _dereq_('./fireEvent');
var cache;

function draw (cb) {
  if (!cache) {
    cache = promptRender({
      id: 'pmk-image-prompt',
      title: 'Insert Image',
      description: 'Type or paste the url to your image',
      placeholder: 'http://example.com/public/doge.png "optional title"'
    });
    init(cache, cb);
  }
  if (cache.up) {
    cache.up.warning.classList.remove('pmk-prompt-error-show');
    cache.up.failed.classList.remove('pmk-prompt-error-show');
  }
  cache.input.value = '';
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

  function handleFileSelect(e) {
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
    form.append('image', file, file.name);
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

},{"./configure":17,"./fireEvent":18,"./promptLink":23,"./promptRender":24,"raf":4,"xhr":6}],23:[function(_dereq_,module,exports){
'use strict';

var raf = _dereq_('raf');
var promptRender = _dereq_('./promptRender');
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
  cache.input.value = '';
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

},{"./promptRender":24,"raf":4}],24:[function(_dereq_,module,exports){
(function (global){
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
  var fup = 'pmk-prompt-fileupload';
  var up = {
    area: e('section', 'pmk-prompt-upload-area'),
    warning: e('p', 'pmk-prompt-error pmk-warning', 'Only GIF, JPEG and PNG images are allowed'),
    failed: e('p', 'pmk-prompt-error pmk-failed', 'Upload failed'),
    upload: e('button', 'pmk-prompt-upload'),
    uploading: e('span', 'pmk-prompt-progress', 'Uploading file...'),
    drop: e('span', 'pmk-prompt-drop', 'Drop here to begin upload'),
    browse: e('span', 'pmk-prompt-browse', 'Browse...'),
    dragdrop: e('span', 'pmk-prompt-dragdrop', 'You can also drop files here'),
    input: e('input', fup)
  };
  up.area[ac](up.warning);
  up.area[ac](up.failed);
  up.area[ac](up.upload);
  up.upload[ac](up.drop);
  up.upload[ac](up.uploading);
  up.upload[ac](up.browse);
  up.upload[ac](up.dragdrop);
  up.upload[ac](up.input);
  up.input.id = fup;
  up.input.type = 'file';
  dom.section[ac](up.area);
  dom.up = up;
  return up;
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],25:[function(_dereq_,module,exports){
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

},{}],26:[function(_dereq_,module,exports){
'use strict';

var promptLink = _dereq_('./promptLink');
var promptImage = _dereq_('./promptImage');
var links;
var images;

function prompt (type, cb) {
  if (links) {
    links.classList.remove('pmk-prompt-open');
  }
  if (images) {
    images.classList.remove('pmk-prompt-open');
  }
  if (type === 'link') {
    links = promptLink.draw(preprocess);
  } else if (type === 'image') {
    images = promptImage.draw(preprocess);
  }

  function preprocess (text) {
    if (text !== null){ // Fixes common pasting errors.
      text = text.replace(/^http:\/\/(https?|ftp):\/\//, '$1://');
      if (text[0] !== '/' && !/^(?:https?|ftp):\/\//.test(text)){
        text = 'http://' + text;
      }
    }
    cb(text);
  }
}

function convertTabs (e) {
  var ta = e.target;
  var keyCode = e.charCode || e.keyCode;
  if (keyCode !== 9) {
    return;
  }
  e.preventDefault();

  var start = ta.selectionStart;
  var end = ta.selectionEnd;
  var val = ta.value;
  var left = val.substring(0, start);
  var right = val.substring(end);

  ta.value = left + '    ' + right;
  ta.selectionStart = ta.selectionEnd = start + 4;
}

module.exports = {
  prompt: prompt,
  convertTabs: convertTabs
};

},{"./promptImage":22,"./promptLink":23}],27:[function(_dereq_,module,exports){
'use strict';

function isVisible (elem) {
  if (window.getComputedStyle) {
    return window.getComputedStyle(elem, null).getPropertyValue('display') !== 'none';
  } else if (elem.currentStyle) {
    return elem.currentStyle.display !== 'none';
  }
}

function addEvent (elem, type, listener) {
  if (elem.attachEvent) {
    elem.attachEvent('on' + type, listener);
  } else {
    elem.addEventListener(type, listener, false);
  }
}

function addEventDelegate (elem, className, type, listener) {
  var regex = new RegExp('\b' + className + '\b');

  if (elem.attachEvent) {
    elem.attachEvent('on' + type, delegator);
  } else {
    elem.addEventListener(type, delegator, false);
  }
  function delegator (e) {
    var self = this;
    var args = arguments;
    var elem = e.target;
    if (elem.classList) {
      if (elem.classList.contains(className)) {
        fire();
      }
    } else {
      if (elem.className.match(regex)) {
        fire();
      }
    }

    function fire () {
      listener.apply(self, args);
    }
  }
}

function removeEvent (elem, event, listener) {
  if (elem.detachEvent) {
    elem.detachEvent('on' + event, listener);
  } else {
    elem.removeEventListener(event, listener, false);
  }
}

function fixEolChars (text) {
  text = text.replace(/\r\n/g, '\n');
  text = text.replace(/\r/g, '\n');
  return text;
}

function extendRegExp (regex, pre, post) {
  if (pre === null || pre === void 0) {
    pre = '';
  }
  if (post === null || post === void 0) {
    post = '';
  }

  var pattern = regex.toString();
  var flags;

  pattern = pattern.replace(/\/([gim]*)$/, function (wholeMatch, flagsPart) {
    flags = flagsPart;
    return '';
  });
  pattern = pattern.replace(/(^\/|\/$)/g, '');
  pattern = pre + pattern + post;
  return new RegExp(pattern, flags);
}

module.exports = {
  isVisible: isVisible,
  addEvent: addEvent,
  addEventDelegate: addEventDelegate,
  removeEvent: removeEvent,
  fixEolChars: fixEolChars,
  extendRegExp: extendRegExp
};

},{}]},{},[20])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL25vZGVfbW9kdWxlcy9jb250cmEuZW1pdHRlci9pbmRleC5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL25vZGVfbW9kdWxlcy9jb250cmEuZW1pdHRlci9zcmMvY29udHJhLmVtaXR0ZXIuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMvcmFmL2luZGV4LmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3JhZi9ub2RlX21vZHVsZXMvcGVyZm9ybWFuY2Utbm93L2xpYi9wZXJmb3JtYW5jZS1ub3cuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMveGhyL2luZGV4LmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMvZ2xvYmFsL3dpbmRvdy5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL25vZGVfbW9kdWxlcy94aHIvbm9kZV9tb2R1bGVzL29uY2Uvb25jZS5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy9DaHVua3MuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9zcmMvQ29tbWFuZE1hbmFnZXIuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9zcmMvRWRpdG9yLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvc3JjL1BhbmVsQ29sbGVjdGlvbi5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy9QcmV2aWV3TWFuYWdlci5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy9UZXh0YXJlYVN0YXRlLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvc3JjL1VJTWFuYWdlci5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy9VbmRvTWFuYWdlci5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy9jb25maWd1cmUuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9zcmMvZmlyZUV2ZW50LmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvc3JjL3BhcnNlLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvc3JjL3BvbnltYXJrLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvc3JjL3Bvc2l0aW9uLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvc3JjL3Byb21wdEltYWdlLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvc3JjL3Byb21wdExpbmsuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9zcmMvcHJvbXB0UmVuZGVyLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvc3JjL3VhLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvc3JjL3VpLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvc3JjL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqaUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDek1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGV2LnNvdXJjZTtcbiAgICAgICAgICAgIGlmICgoc291cmNlID09PSB3aW5kb3cgfHwgc291cmNlID09PSBudWxsKSAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9zcmMvY29udHJhLmVtaXR0ZXIuanMnKTtcbiIsIihmdW5jdGlvbiAocHJvY2Vzcyl7XG4oZnVuY3Rpb24gKHJvb3QsIHVuZGVmaW5lZCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIHVuZGVmID0gJycgKyB1bmRlZmluZWQ7XG4gIGZ1bmN0aW9uIGF0b2EgKGEsIG4pIHsgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGEsIG4pOyB9XG4gIGZ1bmN0aW9uIGRlYm91bmNlIChmbiwgYXJncywgY3R4KSB7IGlmICghZm4pIHsgcmV0dXJuOyB9IHRpY2soZnVuY3Rpb24gcnVuICgpIHsgZm4uYXBwbHkoY3R4IHx8IG51bGwsIGFyZ3MgfHwgW10pOyB9KTsgfVxuXG4gIC8vIGNyb3NzLXBsYXRmb3JtIHRpY2tlclxuICB2YXIgc2kgPSB0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSAnZnVuY3Rpb24nLCB0aWNrO1xuICBpZiAoc2kpIHtcbiAgICB0aWNrID0gZnVuY3Rpb24gKGZuKSB7IHNldEltbWVkaWF0ZShmbik7IH07XG4gIH0gZWxzZSBpZiAodHlwZW9mIHByb2Nlc3MgIT09IHVuZGVmICYmIHByb2Nlc3MubmV4dFRpY2spIHtcbiAgICB0aWNrID0gcHJvY2Vzcy5uZXh0VGljaztcbiAgfSBlbHNlIHtcbiAgICB0aWNrID0gZnVuY3Rpb24gKGZuKSB7IHNldFRpbWVvdXQoZm4sIDApOyB9O1xuICB9XG5cbiAgZnVuY3Rpb24gX2VtaXR0ZXIgKHRoaW5nLCBvcHRpb25zKSB7XG4gICAgdmFyIG9wdHMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHZhciBldnQgPSB7fTtcbiAgICBpZiAodGhpbmcgPT09IHVuZGVmaW5lZCkgeyB0aGluZyA9IHt9OyB9XG4gICAgdGhpbmcub24gPSBmdW5jdGlvbiAodHlwZSwgZm4pIHtcbiAgICAgIGlmICghZXZ0W3R5cGVdKSB7XG4gICAgICAgIGV2dFt0eXBlXSA9IFtmbl07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBldnRbdHlwZV0ucHVzaChmbik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpbmc7XG4gICAgfTtcbiAgICB0aGluZy5vbmNlID0gZnVuY3Rpb24gKHR5cGUsIGZuKSB7XG4gICAgICBmbi5fb25jZSA9IHRydWU7IC8vIHRoaW5nLm9mZihmbikgc3RpbGwgd29ya3MhXG4gICAgICB0aGluZy5vbih0eXBlLCBmbik7XG4gICAgICByZXR1cm4gdGhpbmc7XG4gICAgfTtcbiAgICB0aGluZy5vZmYgPSBmdW5jdGlvbiAodHlwZSwgZm4pIHtcbiAgICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgIGlmIChjID09PSAxKSB7XG4gICAgICAgIGRlbGV0ZSBldnRbdHlwZV07XG4gICAgICB9IGVsc2UgaWYgKGMgPT09IDApIHtcbiAgICAgICAgZXZ0ID0ge307XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZXQgPSBldnRbdHlwZV07XG4gICAgICAgIGlmICghZXQpIHsgcmV0dXJuIHRoaW5nOyB9XG4gICAgICAgIGV0LnNwbGljZShldC5pbmRleE9mKGZuKSwgMSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpbmc7XG4gICAgfTtcbiAgICB0aGluZy5lbWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGFyZ3MgPSBhdG9hKGFyZ3VtZW50cyk7XG4gICAgICB2YXIgdHlwZSA9IGFyZ3Muc2hpZnQoKTtcbiAgICAgIHZhciBldCA9IGV2dFt0eXBlXTtcbiAgICAgIGlmICh0eXBlID09PSAnZXJyb3InICYmIG9wdHMudGhyb3dzICE9PSBmYWxzZSAmJiAhZXQpIHsgdGhyb3cgYXJncy5sZW5ndGggPT09IDEgPyBhcmdzWzBdIDogYXJnczsgfVxuICAgICAgaWYgKCFldCkgeyByZXR1cm4gdGhpbmc7IH1cbiAgICAgIGV2dFt0eXBlXSA9IGV0LmZpbHRlcihmdW5jdGlvbiBlbWl0dGVyIChsaXN0ZW4pIHtcbiAgICAgICAgaWYgKG9wdHMuYXN5bmMpIHsgZGVib3VuY2UobGlzdGVuLCBhcmdzLCB0aGluZyk7IH0gZWxzZSB7IGxpc3Rlbi5hcHBseSh0aGluZywgYXJncyk7IH1cbiAgICAgICAgcmV0dXJuICFsaXN0ZW4uX29uY2U7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGluZztcbiAgICB9O1xuICAgIHJldHVybiB0aGluZztcbiAgfVxuXG4gIC8vIGNyb3NzLXBsYXRmb3JtIGV4cG9ydFxuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gdW5kZWYgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IF9lbWl0dGVyO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuY29udHJhID0gcm9vdC5jb250cmEgfHwge307XG4gICAgcm9vdC5jb250cmEuZW1pdHRlciA9IF9lbWl0dGVyO1xuICB9XG59KSh0aGlzKTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJGV2FBU0hcIikpIiwidmFyIG5vdyA9IHJlcXVpcmUoJ3BlcmZvcm1hbmNlLW5vdycpXG4gICwgZ2xvYmFsID0gdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgPyB7fSA6IHdpbmRvd1xuICAsIHZlbmRvcnMgPSBbJ21veicsICd3ZWJraXQnXVxuICAsIHN1ZmZpeCA9ICdBbmltYXRpb25GcmFtZSdcbiAgLCByYWYgPSBnbG9iYWxbJ3JlcXVlc3QnICsgc3VmZml4XVxuICAsIGNhZiA9IGdsb2JhbFsnY2FuY2VsJyArIHN1ZmZpeF0gfHwgZ2xvYmFsWydjYW5jZWxSZXF1ZXN0JyArIHN1ZmZpeF1cblxuZm9yKHZhciBpID0gMDsgaSA8IHZlbmRvcnMubGVuZ3RoICYmICFyYWY7IGkrKykge1xuICByYWYgPSBnbG9iYWxbdmVuZG9yc1tpXSArICdSZXF1ZXN0JyArIHN1ZmZpeF1cbiAgY2FmID0gZ2xvYmFsW3ZlbmRvcnNbaV0gKyAnQ2FuY2VsJyArIHN1ZmZpeF1cbiAgICAgIHx8IGdsb2JhbFt2ZW5kb3JzW2ldICsgJ0NhbmNlbFJlcXVlc3QnICsgc3VmZml4XVxufVxuXG4vLyBTb21lIHZlcnNpb25zIG9mIEZGIGhhdmUgckFGIGJ1dCBub3QgY0FGXG5pZighcmFmIHx8ICFjYWYpIHtcbiAgdmFyIGxhc3QgPSAwXG4gICAgLCBpZCA9IDBcbiAgICAsIHF1ZXVlID0gW11cbiAgICAsIGZyYW1lRHVyYXRpb24gPSAxMDAwIC8gNjBcblxuICByYWYgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIGlmKHF1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdmFyIF9ub3cgPSBub3coKVxuICAgICAgICAsIG5leHQgPSBNYXRoLm1heCgwLCBmcmFtZUR1cmF0aW9uIC0gKF9ub3cgLSBsYXN0KSlcbiAgICAgIGxhc3QgPSBuZXh0ICsgX25vd1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNwID0gcXVldWUuc2xpY2UoMClcbiAgICAgICAgLy8gQ2xlYXIgcXVldWUgaGVyZSB0byBwcmV2ZW50XG4gICAgICAgIC8vIGNhbGxiYWNrcyBmcm9tIGFwcGVuZGluZyBsaXN0ZW5lcnNcbiAgICAgICAgLy8gdG8gdGhlIGN1cnJlbnQgZnJhbWUncyBxdWV1ZVxuICAgICAgICBxdWV1ZS5sZW5ndGggPSAwXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3AubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoIWNwW2ldLmNhbmNlbGxlZCkge1xuICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICBjcFtpXS5jYWxsYmFjayhsYXN0KVxuICAgICAgICAgICAgfSBjYXRjaChlKSB7fVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgbmV4dClcbiAgICB9XG4gICAgcXVldWUucHVzaCh7XG4gICAgICBoYW5kbGU6ICsraWQsXG4gICAgICBjYWxsYmFjazogY2FsbGJhY2ssXG4gICAgICBjYW5jZWxsZWQ6IGZhbHNlXG4gICAgfSlcbiAgICByZXR1cm4gaWRcbiAgfVxuXG4gIGNhZiA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYocXVldWVbaV0uaGFuZGxlID09PSBoYW5kbGUpIHtcbiAgICAgICAgcXVldWVbaV0uY2FuY2VsbGVkID0gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAvLyBXcmFwIGluIGEgbmV3IGZ1bmN0aW9uIHRvIHByZXZlbnRcbiAgLy8gYGNhbmNlbGAgcG90ZW50aWFsbHkgYmVpbmcgYXNzaWduZWRcbiAgLy8gdG8gdGhlIG5hdGl2ZSByQUYgZnVuY3Rpb25cbiAgcmV0dXJuIHJhZi5hcHBseShnbG9iYWwsIGFyZ3VtZW50cylcbn1cbm1vZHVsZS5leHBvcnRzLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuICBjYWYuYXBwbHkoZ2xvYmFsLCBhcmd1bWVudHMpXG59XG4iLCIoZnVuY3Rpb24gKHByb2Nlc3Mpe1xuLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjYuM1xuKGZ1bmN0aW9uKCkge1xuICB2YXIgZ2V0TmFub1NlY29uZHMsIGhydGltZSwgbG9hZFRpbWU7XG5cbiAgaWYgKCh0eXBlb2YgcGVyZm9ybWFuY2UgIT09IFwidW5kZWZpbmVkXCIgJiYgcGVyZm9ybWFuY2UgIT09IG51bGwpICYmIHBlcmZvcm1hbmNlLm5vdykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgfTtcbiAgfSBlbHNlIGlmICgodHlwZW9mIHByb2Nlc3MgIT09IFwidW5kZWZpbmVkXCIgJiYgcHJvY2VzcyAhPT0gbnVsbCkgJiYgcHJvY2Vzcy5ocnRpbWUpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIChnZXROYW5vU2Vjb25kcygpIC0gbG9hZFRpbWUpIC8gMWU2O1xuICAgIH07XG4gICAgaHJ0aW1lID0gcHJvY2Vzcy5ocnRpbWU7XG4gICAgZ2V0TmFub1NlY29uZHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBocjtcbiAgICAgIGhyID0gaHJ0aW1lKCk7XG4gICAgICByZXR1cm4gaHJbMF0gKiAxZTkgKyBoclsxXTtcbiAgICB9O1xuICAgIGxvYWRUaW1lID0gZ2V0TmFub1NlY29uZHMoKTtcbiAgfSBlbHNlIGlmIChEYXRlLm5vdykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gRGF0ZS5ub3coKSAtIGxvYWRUaW1lO1xuICAgIH07XG4gICAgbG9hZFRpbWUgPSBEYXRlLm5vdygpO1xuICB9IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBsb2FkVGltZTtcbiAgICB9O1xuICAgIGxvYWRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIH1cblxufSkuY2FsbCh0aGlzKTtcblxuLypcbi8vQCBzb3VyY2VNYXBwaW5nVVJMPXBlcmZvcm1hbmNlLW5vdy5tYXBcbiovXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiRldhQVNIXCIpKSIsInZhciB3aW5kb3cgPSByZXF1aXJlKFwiZ2xvYmFsL3dpbmRvd1wiKVxudmFyIG9uY2UgPSByZXF1aXJlKFwib25jZVwiKVxuXG52YXIgbWVzc2FnZXMgPSB7XG4gICAgXCIwXCI6IFwiSW50ZXJuYWwgWE1MSHR0cFJlcXVlc3QgRXJyb3JcIixcbiAgICBcIjRcIjogXCI0eHggQ2xpZW50IEVycm9yXCIsXG4gICAgXCI1XCI6IFwiNXh4IFNlcnZlciBFcnJvclwiXG59XG5cbnZhciBYSFIgPSB3aW5kb3cuWE1MSHR0cFJlcXVlc3QgfHwgbm9vcFxudmFyIFhEUiA9IFwid2l0aENyZWRlbnRpYWxzXCIgaW4gKG5ldyBYSFIoKSkgP1xuICAgICAgICB3aW5kb3cuWE1MSHR0cFJlcXVlc3QgOiB3aW5kb3cuWERvbWFpblJlcXVlc3RcblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVYSFJcblxuZnVuY3Rpb24gY3JlYXRlWEhSKG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7IHVyaTogb3B0aW9ucyB9XG4gICAgfVxuXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICBjYWxsYmFjayA9IG9uY2UoY2FsbGJhY2spXG5cbiAgICB2YXIgeGhyID0gb3B0aW9ucy54aHIgfHwgbnVsbFxuXG4gICAgaWYgKCF4aHIgJiYgb3B0aW9ucy5jb3JzKSB7XG4gICAgICAgIHhociA9IG5ldyBYRFIoKVxuICAgIH0gZWxzZSBpZiAoIXhocikge1xuICAgICAgICB4aHIgPSBuZXcgWEhSKClcbiAgICB9XG5cbiAgICB2YXIgdXJpID0geGhyLnVybCA9IG9wdGlvbnMudXJpIHx8IG9wdGlvbnMudXJsO1xuICAgIHZhciBtZXRob2QgPSB4aHIubWV0aG9kID0gb3B0aW9ucy5tZXRob2QgfHwgXCJHRVRcIlxuICAgIHZhciBib2R5ID0gb3B0aW9ucy5ib2R5IHx8IG9wdGlvbnMuZGF0YVxuICAgIHZhciBoZWFkZXJzID0geGhyLmhlYWRlcnMgPSBvcHRpb25zLmhlYWRlcnMgfHwge31cbiAgICB2YXIgc3luYyA9ICEhb3B0aW9ucy5zeW5jXG4gICAgdmFyIGlzSnNvbiA9IGZhbHNlXG4gICAgdmFyIGtleVxuXG4gICAgaWYgKFwianNvblwiIGluIG9wdGlvbnMpIHtcbiAgICAgICAgaXNKc29uID0gdHJ1ZVxuICAgICAgICBoZWFkZXJzW1wiQWNjZXB0XCJdID0gXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgICAgICAgaWYgKG1ldGhvZCAhPT0gXCJHRVRcIiAmJiBtZXRob2QgIT09IFwiSEVBRFwiKSB7XG4gICAgICAgICAgICBoZWFkZXJzW1wiQ29udGVudC1UeXBlXCJdID0gXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgICAgICAgICAgIGJvZHkgPSBKU09OLnN0cmluZ2lmeShvcHRpb25zLmpzb24pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gcmVhZHlzdGF0ZWNoYW5nZVxuICAgIHhoci5vbmxvYWQgPSBsb2FkXG4gICAgeGhyLm9uZXJyb3IgPSBlcnJvclxuICAgIC8vIElFOSBtdXN0IGhhdmUgb25wcm9ncmVzcyBiZSBzZXQgdG8gYSB1bmlxdWUgZnVuY3Rpb24uXG4gICAgeGhyLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIElFIG11c3QgZGllXG4gICAgfVxuICAgIC8vIGhhdGUgSUVcbiAgICB4aHIub250aW1lb3V0ID0gbm9vcFxuICAgIHhoci5vcGVuKG1ldGhvZCwgdXJpLCAhc3luYylcbiAgICBpZiAob3B0aW9ucy5jb3JzKSB7XG4gICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlXG4gICAgfVxuICAgIC8vIENhbm5vdCBzZXQgdGltZW91dCB3aXRoIHN5bmMgcmVxdWVzdFxuICAgIGlmICghc3luYykge1xuICAgICAgICB4aHIudGltZW91dCA9IFwidGltZW91dFwiIGluIG9wdGlvbnMgPyBvcHRpb25zLnRpbWVvdXQgOiA1MDAwXG4gICAgfVxuXG4gICAgaWYgKHhoci5zZXRSZXF1ZXN0SGVhZGVyKSB7XG4gICAgICAgIGZvcihrZXkgaW4gaGVhZGVycyl7XG4gICAgICAgICAgICBpZihoZWFkZXJzLmhhc093blByb3BlcnR5KGtleSkpe1xuICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgaGVhZGVyc1trZXldKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKFwicmVzcG9uc2VUeXBlXCIgaW4gb3B0aW9ucykge1xuICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gb3B0aW9ucy5yZXNwb25zZVR5cGVcbiAgICB9XG5cbiAgICB4aHIuc2VuZChib2R5KVxuXG4gICAgcmV0dXJuIHhoclxuXG4gICAgZnVuY3Rpb24gcmVhZHlzdGF0ZWNoYW5nZSgpIHtcbiAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgICBsb2FkKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvYWQoKSB7XG4gICAgICAgIHZhciBlcnJvciA9IG51bGxcbiAgICAgICAgdmFyIHN0YXR1cyA9IHhoci5zdGF0dXNDb2RlID0geGhyLnN0YXR1c1xuICAgICAgICB2YXIgYm9keSA9IHhoci5ib2R5ID0geGhyLnJlc3BvbnNlIHx8XG4gICAgICAgICAgICB4aHIucmVzcG9uc2VUZXh0IHx8IHhoci5yZXNwb25zZVhNTFxuXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDEyMjMpIHtcbiAgICAgICAgICAgIHN0YXR1cyA9IDIwNFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMCB8fCAoc3RhdHVzID49IDQwMCAmJiBzdGF0dXMgPCA2MDApKSB7XG4gICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHhoci5yZXNwb25zZVRleHQgfHxcbiAgICAgICAgICAgICAgICBtZXNzYWdlc1tTdHJpbmcoeGhyLnN0YXR1cykuY2hhckF0KDApXVxuICAgICAgICAgICAgZXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSlcblxuICAgICAgICAgICAgZXJyb3Iuc3RhdHVzQ29kZSA9IHhoci5zdGF0dXNcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0pzb24pIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYm9keSA9IHhoci5ib2R5ID0gSlNPTi5wYXJzZShib2R5KVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgICAgfVxuXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCB4aHIsIGJvZHkpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXJyb3IoZXZ0KSB7XG4gICAgICAgIGNhbGxiYWNrKGV2dCwgeGhyKVxuICAgIH1cbn1cblxuXG5mdW5jdGlvbiBub29wKCkge31cbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbmlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSB3aW5kb3dcbn0gZWxzZSBpZiAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZ2xvYmFsXG59IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0ge31cbn1cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJtb2R1bGUuZXhwb3J0cyA9IG9uY2Vcblxub25jZS5wcm90byA9IG9uY2UoZnVuY3Rpb24gKCkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRnVuY3Rpb24ucHJvdG90eXBlLCAnb25jZScsIHtcbiAgICB2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG9uY2UodGhpcylcbiAgICB9LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KVxufSlcblxuZnVuY3Rpb24gb25jZSAoZm4pIHtcbiAgdmFyIGNhbGxlZCA9IGZhbHNlXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGNhbGxlZCkgcmV0dXJuXG4gICAgY2FsbGVkID0gdHJ1ZVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHVhID0gcmVxdWlyZSgnLi91YScpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciByZSA9IFJlZ0V4cDtcblxuZnVuY3Rpb24gQ2h1bmtzICgpIHtcbn1cblxuQ2h1bmtzLnByb3RvdHlwZS5maW5kVGFncyA9IGZ1bmN0aW9uIChzdGFydFJlZ2V4LCBlbmRSZWdleCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciByZWdleDtcblxuICBpZiAoc3RhcnRSZWdleCkge1xuICAgIHJlZ2V4ID0gdXRpbC5leHRlbmRSZWdFeHAoc3RhcnRSZWdleCwgJycsICckJyk7XG4gICAgdGhpcy5iZWZvcmUgPSB0aGlzLmJlZm9yZS5yZXBsYWNlKHJlZ2V4LCBzdGFydF9yZXBsYWNlcik7XG4gICAgcmVnZXggPSB1dGlsLmV4dGVuZFJlZ0V4cChzdGFydFJlZ2V4LCAnXicsICcnKTtcbiAgICB0aGlzLnNlbGVjdGlvbiA9IHRoaXMuc2VsZWN0aW9uLnJlcGxhY2UocmVnZXgsIHN0YXJ0X3JlcGxhY2VyKTtcbiAgfVxuXG4gIGlmIChlbmRSZWdleCkge1xuICAgIHJlZ2V4ID0gdXRpbC5leHRlbmRSZWdFeHAoZW5kUmVnZXgsICcnLCAnJCcpO1xuICAgIHRoaXMuc2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb24ucmVwbGFjZShyZWdleCwgZW5kX3JlcGxhY2VyKTtcbiAgICByZWdleCA9IHV0aWwuZXh0ZW5kUmVnRXhwKGVuZFJlZ2V4LCAnXicsICcnKTtcbiAgICB0aGlzLmFmdGVyID0gdGhpcy5hZnRlci5yZXBsYWNlKHJlZ2V4LCBlbmRfcmVwbGFjZXIpO1xuICB9XG5cbiAgZnVuY3Rpb24gc3RhcnRfcmVwbGFjZXIgKG1hdGNoKSB7XG4gICAgc2VsZi5zdGFydFRhZyA9IHNlbGYuc3RhcnRUYWcgKyBtYXRjaDtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgZnVuY3Rpb24gZW5kX3JlcGxhY2VyIChtYXRjaCkge1xuICAgIHNlbGYuZW5kVGFnID0gbWF0Y2ggKyBzZWxmLmVuZFRhZztcbiAgICByZXR1cm4gJyc7XG4gIH1cbn07XG5cbkNodW5rcy5wcm90b3R5cGUudHJpbVdoaXRlc3BhY2UgPSBmdW5jdGlvbiAocmVtb3ZlKSB7XG4gIHZhciBiZWZvcmVSZXBsYWNlciwgYWZ0ZXJSZXBsYWNlciwgc2VsZiA9IHRoaXM7XG4gIGlmIChyZW1vdmUpIHtcbiAgICBiZWZvcmVSZXBsYWNlciA9IGFmdGVyUmVwbGFjZXIgPSAnJztcbiAgfSBlbHNlIHtcbiAgICBiZWZvcmVSZXBsYWNlciA9IGZ1bmN0aW9uIChzKSB7IHNlbGYuYmVmb3JlICs9IHM7IHJldHVybiAnJzsgfVxuICAgIGFmdGVyUmVwbGFjZXIgPSBmdW5jdGlvbiAocykgeyBzZWxmLmFmdGVyID0gcyArIHNlbGYuYWZ0ZXI7IHJldHVybiAnJzsgfVxuICB9XG5cbiAgdGhpcy5zZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvbi5yZXBsYWNlKC9eKFxccyopLywgYmVmb3JlUmVwbGFjZXIpLnJlcGxhY2UoLyhcXHMqKSQvLCBhZnRlclJlcGxhY2VyKTtcbn07XG5cbkNodW5rcy5wcm90b3R5cGUuc2tpcExpbmVzID0gZnVuY3Rpb24gKG5MaW5lc0JlZm9yZSwgbkxpbmVzQWZ0ZXIsIGZpbmRFeHRyYU5ld2xpbmVzKSB7XG4gIGlmIChuTGluZXNCZWZvcmUgPT09IHZvaWQgMCkge1xuICAgIG5MaW5lc0JlZm9yZSA9IDE7XG4gIH1cblxuICBpZiAobkxpbmVzQWZ0ZXIgPT09IHZvaWQgMCkge1xuICAgIG5MaW5lc0FmdGVyID0gMTtcbiAgfVxuXG4gIG5MaW5lc0JlZm9yZSsrO1xuICBuTGluZXNBZnRlcisrO1xuXG4gIHZhciByZWdleFRleHQ7XG4gIHZhciByZXBsYWNlbWVudFRleHQ7XG5cbiAgaWYgKHVhLmlzQ2hyb21lKSB7XG4gICAgJ1gnLm1hdGNoKC8oKS4vKTtcbiAgfVxuXG4gIHRoaXMuc2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb24ucmVwbGFjZSgvKF5cXG4qKS8sICcnKTtcbiAgdGhpcy5zdGFydFRhZyA9IHRoaXMuc3RhcnRUYWcgKyByZS4kMTtcbiAgdGhpcy5zZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvbi5yZXBsYWNlKC8oXFxuKiQpLywgJycpO1xuICB0aGlzLmVuZFRhZyA9IHRoaXMuZW5kVGFnICsgcmUuJDE7XG4gIHRoaXMuc3RhcnRUYWcgPSB0aGlzLnN0YXJ0VGFnLnJlcGxhY2UoLyheXFxuKikvLCAnJyk7XG4gIHRoaXMuYmVmb3JlID0gdGhpcy5iZWZvcmUgKyByZS4kMTtcbiAgdGhpcy5lbmRUYWcgPSB0aGlzLmVuZFRhZy5yZXBsYWNlKC8oXFxuKiQpLywgJycpO1xuICB0aGlzLmFmdGVyID0gdGhpcy5hZnRlciArIHJlLiQxO1xuXG4gIGlmICh0aGlzLmJlZm9yZSkge1xuICAgIHJlZ2V4VGV4dCA9IHJlcGxhY2VtZW50VGV4dCA9ICcnO1xuXG4gICAgd2hpbGUgKG5MaW5lc0JlZm9yZS0tKSB7XG4gICAgICByZWdleFRleHQgKz0gJ1xcXFxuPyc7XG4gICAgICByZXBsYWNlbWVudFRleHQgKz0gJ1xcbic7XG4gICAgfVxuXG4gICAgaWYgKGZpbmRFeHRyYU5ld2xpbmVzKSB7XG4gICAgICByZWdleFRleHQgPSAnXFxcXG4qJztcbiAgICB9XG4gICAgdGhpcy5iZWZvcmUgPSB0aGlzLmJlZm9yZS5yZXBsYWNlKG5ldyByZShyZWdleFRleHQgKyAnJCcsICcnKSwgcmVwbGFjZW1lbnRUZXh0KTtcbiAgfVxuXG4gIGlmICh0aGlzLmFmdGVyKSB7XG4gICAgcmVnZXhUZXh0ID0gcmVwbGFjZW1lbnRUZXh0ID0gJyc7XG5cbiAgICB3aGlsZSAobkxpbmVzQWZ0ZXItLSkge1xuICAgICAgcmVnZXhUZXh0ICs9ICdcXFxcbj8nO1xuICAgICAgcmVwbGFjZW1lbnRUZXh0ICs9ICdcXG4nO1xuICAgIH1cbiAgICBpZiAoZmluZEV4dHJhTmV3bGluZXMpIHtcbiAgICAgIHJlZ2V4VGV4dCA9ICdcXFxcbionO1xuICAgIH1cblxuICAgIHRoaXMuYWZ0ZXIgPSB0aGlzLmFmdGVyLnJlcGxhY2UobmV3IHJlKHJlZ2V4VGV4dCwgJycpLCByZXBsYWNlbWVudFRleHQpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENodW5rcztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHVpID0gcmVxdWlyZSgnLi91aScpXG52YXIgc2V0dGluZ3MgPSB7IGxpbmVMZW5ndGg6IDcyIH07XG52YXIgcmUgPSBSZWdFeHA7XG5cbmZ1bmN0aW9uIENvbW1hbmRNYW5hZ2VyIChnZXRTdHJpbmcpIHtcbiAgdGhpcy5nZXRTdHJpbmcgPSBnZXRTdHJpbmc7XG59XG5cbnZhciAkID0gQ29tbWFuZE1hbmFnZXIucHJvdG90eXBlO1xuXG4kLnByZWZpeGVzID0gJyg/OlxcXFxzezQsfXxcXFxccyo+fFxcXFxzKi1cXFxccyt8XFxcXHMqXFxcXGQrXFxcXC58PXxcXFxcK3wtfF98XFxcXCp8I3xcXFxccypcXFxcW1teXFxuXV0rXFxcXF06KSc7XG5cbiQudW53cmFwID0gZnVuY3Rpb24gKGNodW5rKSB7XG4gIHZhciB0eHQgPSBuZXcgcmUoJyhbXlxcXFxuXSlcXFxcbig/IShcXFxcbnwnICsgdGhpcy5wcmVmaXhlcyArICcpKScsICdnJyk7XG4gIGNodW5rLnNlbGVjdGlvbiA9IGNodW5rLnNlbGVjdGlvbi5yZXBsYWNlKHR4dCwgJyQxICQyJyk7XG59O1xuXG4kLndyYXAgPSBmdW5jdGlvbiAoY2h1bmssIGxlbikge1xuICB0aGlzLnVud3JhcChjaHVuayk7XG4gIHZhciByZWdleCA9IG5ldyByZSgnKC57MSwnICsgbGVuICsgJ30pKCArfCRcXFxcbj8pJywgJ2dtJyksXG4gICAgdGhhdCA9IHRoaXM7XG5cbiAgY2h1bmsuc2VsZWN0aW9uID0gY2h1bmsuc2VsZWN0aW9uLnJlcGxhY2UocmVnZXgsIGZ1bmN0aW9uIChsaW5lLCBtYXJrZWQpIHtcbiAgICBpZiAobmV3IHJlKCdeJyArIHRoYXQucHJlZml4ZXMsICcnKS50ZXN0KGxpbmUpKSB7XG4gICAgICByZXR1cm4gbGluZTtcbiAgICB9XG4gICAgcmV0dXJuIG1hcmtlZCArICdcXG4nO1xuICB9KTtcblxuICBjaHVuay5zZWxlY3Rpb24gPSBjaHVuay5zZWxlY3Rpb24ucmVwbGFjZSgvXFxzKyQvLCAnJyk7XG59O1xuXG4kLmRvQm9sZCA9IGZ1bmN0aW9uIChjaHVuaywgcG9zdFByb2Nlc3NpbmcpIHtcbiAgcmV0dXJuIHRoaXMuZG9Cb3JJKGNodW5rLCBwb3N0UHJvY2Vzc2luZywgMiwgdGhpcy5nZXRTdHJpbmcoJ2JvbGRleGFtcGxlJykpO1xufTtcblxuJC5kb0l0YWxpYyA9IGZ1bmN0aW9uIChjaHVuaywgcG9zdFByb2Nlc3NpbmcpIHtcbiAgcmV0dXJuIHRoaXMuZG9Cb3JJKGNodW5rLCBwb3N0UHJvY2Vzc2luZywgMSwgdGhpcy5nZXRTdHJpbmcoJ2l0YWxpY2V4YW1wbGUnKSk7XG59O1xuXG4kLmRvQm9ySSA9IGZ1bmN0aW9uIChjaHVuaywgcG9zdFByb2Nlc3NpbmcsIG5TdGFycywgaW5zZXJ0VGV4dCkge1xuICBjaHVuay50cmltV2hpdGVzcGFjZSgpO1xuICBjaHVuay5zZWxlY3Rpb24gPSBjaHVuay5zZWxlY3Rpb24ucmVwbGFjZSgvXFxuezIsfS9nLCAnXFxuJyk7XG5cbiAgdmFyIHN0YXJzQmVmb3JlID0gLyhcXCoqJCkvLmV4ZWMoY2h1bmsuYmVmb3JlKVswXTtcbiAgdmFyIHN0YXJzQWZ0ZXIgPSAvKF5cXCoqKS8uZXhlYyhjaHVuay5hZnRlcilbMF07XG4gIHZhciBwcmV2U3RhcnMgPSBNYXRoLm1pbihzdGFyc0JlZm9yZS5sZW5ndGgsIHN0YXJzQWZ0ZXIubGVuZ3RoKTtcblxuICBpZiAoKHByZXZTdGFycyA+PSBuU3RhcnMpICYmIChwcmV2U3RhcnMgIT0gMiB8fCBuU3RhcnMgIT0gMSkpIHtcbiAgICBjaHVuay5iZWZvcmUgPSBjaHVuay5iZWZvcmUucmVwbGFjZShyZSgnWypdeycgKyBuU3RhcnMgKyAnfSQnLCAnJyksICcnKTtcbiAgICBjaHVuay5hZnRlciA9IGNodW5rLmFmdGVyLnJlcGxhY2UocmUoJ15bKl17JyArIG5TdGFycyArICd9JywgJycpLCAnJyk7XG4gIH0gZWxzZSBpZiAoIWNodW5rLnNlbGVjdGlvbiAmJiBzdGFyc0FmdGVyKSB7XG4gICAgY2h1bmsuYWZ0ZXIgPSBjaHVuay5hZnRlci5yZXBsYWNlKC9eKFsqX10qKS8sICcnKTtcbiAgICBjaHVuay5iZWZvcmUgPSBjaHVuay5iZWZvcmUucmVwbGFjZSgvKFxccz8pJC8sICcnKTtcbiAgICB2YXIgd2hpdGVzcGFjZSA9IHJlLiQxO1xuICAgIGNodW5rLmJlZm9yZSA9IGNodW5rLmJlZm9yZSArIHN0YXJzQWZ0ZXIgKyB3aGl0ZXNwYWNlO1xuICB9IGVsc2Uge1xuICAgIGlmICghY2h1bmsuc2VsZWN0aW9uICYmICFzdGFyc0FmdGVyKSB7XG4gICAgICBjaHVuay5zZWxlY3Rpb24gPSBpbnNlcnRUZXh0O1xuICAgIH1cblxuICAgIHZhciBtYXJrdXAgPSBuU3RhcnMgPD0gMSA/ICcqJyA6ICcqKic7XG4gICAgY2h1bmsuYmVmb3JlID0gY2h1bmsuYmVmb3JlICsgbWFya3VwO1xuICAgIGNodW5rLmFmdGVyID0gbWFya3VwICsgY2h1bmsuYWZ0ZXI7XG4gIH1cbn07XG5cbiQuc3RyaXBMaW5rRGVmcyA9IGZ1bmN0aW9uICh0ZXh0LCBkZWZzVG9BZGQpIHtcbiAgdmFyIHJlZ2V4ID0gL15bIF17MCwzfVxcWyhcXGQrKVxcXTpbIFxcdF0qXFxuP1sgXFx0XSo8PyhcXFMrPyk+P1sgXFx0XSpcXG4/WyBcXHRdKig/OihcXG4qKVtcIihdKC4rPylbXCIpXVsgXFx0XSopPyg/Olxcbit8JCkvZ207XG5cbiAgZnVuY3Rpb24gcmVwbGFjZXIgKGFsbCwgaWQsIGxpbmssIG5ld2xpbmVzLCB0aXRsZSkge1xuICAgIGRlZnNUb0FkZFtpZF0gPSBhbGwucmVwbGFjZSgvXFxzKiQvLCAnJyk7XG4gICAgaWYgKG5ld2xpbmVzKSB7XG4gICAgICBkZWZzVG9BZGRbaWRdID0gYWxsLnJlcGxhY2UoL1tcIihdKC4rPylbXCIpXSQvLCAnJyk7XG4gICAgICByZXR1cm4gbmV3bGluZXMgKyB0aXRsZTtcbiAgICB9XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgcmV0dXJuIHRleHQucmVwbGFjZShyZWdleCwgcmVwbGFjZXIpO1xufTtcblxuJC5hZGRMaW5rRGVmID0gZnVuY3Rpb24gKGNodW5rLCBsaW5rRGVmKSB7XG4gIHZhciByZWZOdW1iZXIgPSAwO1xuICB2YXIgZGVmc1RvQWRkID0ge307XG4gIGNodW5rLmJlZm9yZSA9IHRoaXMuc3RyaXBMaW5rRGVmcyhjaHVuay5iZWZvcmUsIGRlZnNUb0FkZCk7XG4gIGNodW5rLnNlbGVjdGlvbiA9IHRoaXMuc3RyaXBMaW5rRGVmcyhjaHVuay5zZWxlY3Rpb24sIGRlZnNUb0FkZCk7XG4gIGNodW5rLmFmdGVyID0gdGhpcy5zdHJpcExpbmtEZWZzKGNodW5rLmFmdGVyLCBkZWZzVG9BZGQpO1xuXG4gIHZhciBkZWZzID0gJyc7XG4gIHZhciByZWdleCA9IC8oXFxbKSgoPzpcXFtbXlxcXV0qXFxdfFteXFxbXFxdXSkqKShcXF1bIF0/KD86XFxuWyBdKik/XFxbKShcXGQrKShcXF0pL2c7XG5cbiAgZnVuY3Rpb24gYWRkRGVmTnVtYmVyIChkZWYpIHtcbiAgICByZWZOdW1iZXIrKztcbiAgICBkZWYgPSBkZWYucmVwbGFjZSgvXlsgXXswLDN9XFxbKFxcZCspXFxdOi8sICcgIFsnICsgcmVmTnVtYmVyICsgJ106Jyk7XG4gICAgZGVmcyArPSAnXFxuJyArIGRlZjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldExpbmsgKHdob2xlTWF0Y2gsIGJlZm9yZSwgaW5uZXIsIGFmdGVySW5uZXIsIGlkLCBlbmQpIHtcbiAgICBpbm5lciA9IGlubmVyLnJlcGxhY2UocmVnZXgsIGdldExpbmspO1xuICAgIGlmIChkZWZzVG9BZGRbaWRdKSB7XG4gICAgICBhZGREZWZOdW1iZXIoZGVmc1RvQWRkW2lkXSk7XG4gICAgICByZXR1cm4gYmVmb3JlICsgaW5uZXIgKyBhZnRlcklubmVyICsgcmVmTnVtYmVyICsgZW5kO1xuICAgIH1cbiAgICByZXR1cm4gd2hvbGVNYXRjaDtcbiAgfVxuXG4gIGNodW5rLmJlZm9yZSA9IGNodW5rLmJlZm9yZS5yZXBsYWNlKHJlZ2V4LCBnZXRMaW5rKTtcblxuICBpZiAobGlua0RlZikge1xuICAgIGFkZERlZk51bWJlcihsaW5rRGVmKTtcbiAgfSBlbHNlIHtcbiAgICBjaHVuay5zZWxlY3Rpb24gPSBjaHVuay5zZWxlY3Rpb24ucmVwbGFjZShyZWdleCwgZ2V0TGluayk7XG4gIH1cblxuICB2YXIgcmVmT3V0ID0gcmVmTnVtYmVyO1xuXG4gIGNodW5rLmFmdGVyID0gY2h1bmsuYWZ0ZXIucmVwbGFjZShyZWdleCwgZ2V0TGluayk7XG5cbiAgaWYgKGNodW5rLmFmdGVyKSB7XG4gICAgY2h1bmsuYWZ0ZXIgPSBjaHVuay5hZnRlci5yZXBsYWNlKC9cXG4qJC8sICcnKTtcbiAgfVxuICBpZiAoIWNodW5rLmFmdGVyKSB7XG4gICAgY2h1bmsuc2VsZWN0aW9uID0gY2h1bmsuc2VsZWN0aW9uLnJlcGxhY2UoL1xcbiokLywgJycpO1xuICB9XG5cbiAgY2h1bmsuYWZ0ZXIgKz0gJ1xcblxcbicgKyBkZWZzO1xuXG4gIHJldHVybiByZWZPdXQ7XG59O1xuXG5mdW5jdGlvbiBwcm9wZXJseUVuY29kZWQgKGxpbmtkZWYpIHtcbiAgZnVuY3Rpb24gcmVwbGFjZXIgKHdob2xlbWF0Y2gsIGxpbmssIHRpdGxlKSB7XG4gICAgbGluayA9IGxpbmsucmVwbGFjZSgvXFw/LiokLywgZnVuY3Rpb24gKHF1ZXJ5cGFydCkge1xuICAgICAgcmV0dXJuIHF1ZXJ5cGFydC5yZXBsYWNlKC9cXCsvZywgJyAnKTsgLy8gaW4gdGhlIHF1ZXJ5IHN0cmluZywgYSBwbHVzIGFuZCBhIHNwYWNlIGFyZSBpZGVudGljYWxcbiAgICB9KTtcbiAgICBsaW5rID0gZGVjb2RlVVJJQ29tcG9uZW50KGxpbmspOyAvLyB1bmVuY29kZSBmaXJzdCwgdG8gcHJldmVudCBkb3VibGUgZW5jb2RpbmdcbiAgICBsaW5rID0gZW5jb2RlVVJJKGxpbmspLnJlcGxhY2UoLycvZywgJyUyNycpLnJlcGxhY2UoL1xcKC9nLCAnJTI4JykucmVwbGFjZSgvXFwpL2csICclMjknKTtcbiAgICBsaW5rID0gbGluay5yZXBsYWNlKC9cXD8uKiQvLCBmdW5jdGlvbiAocXVlcnlwYXJ0KSB7XG4gICAgICByZXR1cm4gcXVlcnlwYXJ0LnJlcGxhY2UoL1xcKy9nLCAnJTJiJyk7IC8vIHNpbmNlIHdlIHJlcGxhY2VkIHBsdXMgd2l0aCBzcGFjZXMgaW4gdGhlIHF1ZXJ5IHBhcnQsIGFsbCBwbHVzZXMgdGhhdCBub3cgYXBwZWFyIHdoZXJlIG9yaWdpbmFsbHkgZW5jb2RlZFxuICAgIH0pO1xuICAgIGlmICh0aXRsZSkge1xuICAgICAgdGl0bGUgPSB0aXRsZS50cmltID8gdGl0bGUudHJpbSgpIDogdGl0bGUucmVwbGFjZSgvXlxccyovLCAnJykucmVwbGFjZSgvXFxzKiQvLCAnJyk7XG4gICAgICB0aXRsZSA9IHRpdGxlLnJlcGxhY2UoL1wiL2csICdxdW90OycpLnJlcGxhY2UoL1xcKC9nLCAnJiM0MDsnKS5yZXBsYWNlKC9cXCkvZywgJyYjNDE7JykucmVwbGFjZSgvPC9nLCAnJmx0OycpLnJlcGxhY2UoLz4vZywgJyZndDsnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRpdGxlID8gbGluayArICcgXCInICsgdGl0bGUgKyAnXCInIDogbGluaztcbiAgfVxuICByZXR1cm4gbGlua2RlZi5yZXBsYWNlKC9eXFxzKiguKj8pKD86XFxzK1wiKC4rKVwiKT9cXHMqJC8sIHJlcGxhY2VyKTtcbn1cblxuJC5kb0xpbmtPckltYWdlID0gZnVuY3Rpb24gKGNodW5rLCBwb3N0UHJvY2Vzc2luZywgaXNJbWFnZSkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBiYWNrZ3JvdW5kO1xuXG4gIGNodW5rLnRyaW1XaGl0ZXNwYWNlKCk7XG4gIGNodW5rLmZpbmRUYWdzKC9cXHMqIT9cXFsvLCAvXFxdWyBdPyg/OlxcblsgXSopPyhcXFsuKj9cXF0pPy8pO1xuXG4gIGlmIChjaHVuay5lbmRUYWcubGVuZ3RoID4gMSAmJiBjaHVuay5zdGFydFRhZy5sZW5ndGggPiAwKSB7XG4gICAgY2h1bmsuc3RhcnRUYWcgPSBjaHVuay5zdGFydFRhZy5yZXBsYWNlKC8hP1xcWy8sICcnKTtcbiAgICBjaHVuay5lbmRUYWcgPSAnJztcbiAgICB0aGlzLmFkZExpbmtEZWYoY2h1bmssIG51bGwpO1xuICB9IGVsc2Uge1xuICAgIGNodW5rLnNlbGVjdGlvbiA9IGNodW5rLnN0YXJ0VGFnICsgY2h1bmsuc2VsZWN0aW9uICsgY2h1bmsuZW5kVGFnO1xuICAgIGNodW5rLnN0YXJ0VGFnID0gY2h1bmsuZW5kVGFnID0gJyc7XG5cbiAgICBpZiAoL1xcblxcbi8udGVzdChjaHVuay5zZWxlY3Rpb24pKSB7XG4gICAgICB0aGlzLmFkZExpbmtEZWYoY2h1bmssIG51bGwpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoaXNJbWFnZSkge1xuICAgICAgdWkucHJvbXB0KCdpbWFnZScsIGxpbmtFbnRlcmVkQ2FsbGJhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICB1aS5wcm9tcHQoJ2xpbmsnLCBsaW5rRW50ZXJlZENhbGxiYWNrKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBsaW5rRW50ZXJlZENhbGxiYWNrIChsaW5rKSB7XG4gICAgaWYgKGxpbmsgIT09IG51bGwpIHtcbiAgICAgIGNodW5rLnNlbGVjdGlvbiA9ICgnICcgKyBjaHVuay5zZWxlY3Rpb24pLnJlcGxhY2UoLyhbXlxcXFxdKD86XFxcXFxcXFwpKikoPz1bW1xcXV0pL2csICckMVxcXFwnKS5zdWJzdHIoMSk7XG5cbiAgICAgIHZhciBsaW5rRGVmID0gJyBbOTk5XTogJyArIHByb3Blcmx5RW5jb2RlZChsaW5rKTtcbiAgICAgIHZhciBudW0gPSBzZWxmLmFkZExpbmtEZWYoY2h1bmssIGxpbmtEZWYpO1xuICAgICAgY2h1bmsuc3RhcnRUYWcgPSBpc0ltYWdlID8gJyFbJyA6ICdbJztcbiAgICAgIGNodW5rLmVuZFRhZyA9ICddWycgKyBudW0gKyAnXSc7XG5cbiAgICAgIGlmICghY2h1bmsuc2VsZWN0aW9uKSB7XG4gICAgICAgIGlmIChpc0ltYWdlKSB7XG4gICAgICAgICAgY2h1bmsuc2VsZWN0aW9uID0gc2VsZi5nZXRTdHJpbmcoJ2ltYWdlZGVzY3JpcHRpb24nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBjaHVuay5zZWxlY3Rpb24gPSBzZWxmLmdldFN0cmluZygnbGlua2Rlc2NyaXB0aW9uJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcG9zdFByb2Nlc3NpbmcoKTtcbiAgfVxufTtcblxuJC5kb0F1dG9pbmRlbnQgPSBmdW5jdGlvbiAoY2h1bmssIHBvc3RQcm9jZXNzaW5nKSB7XG4gIHZhciBjb21tYW5kTWdyID0gdGhpcztcbiAgdmFyIGZha2VTZWxlY3Rpb24gPSBmYWxzZTtcblxuICBjaHVuay5iZWZvcmUgPSBjaHVuay5iZWZvcmUucmVwbGFjZSgvKFxcbnxeKVsgXXswLDN9KFsqKy1dfFxcZCtbLl0pWyBcXHRdKlxcbiQvLCAnXFxuXFxuJyk7XG4gIGNodW5rLmJlZm9yZSA9IGNodW5rLmJlZm9yZS5yZXBsYWNlKC8oXFxufF4pWyBdezAsM30+WyBcXHRdKlxcbiQvLCAnXFxuXFxuJyk7XG4gIGNodW5rLmJlZm9yZSA9IGNodW5rLmJlZm9yZS5yZXBsYWNlKC8oXFxufF4pWyBcXHRdK1xcbiQvLCAnXFxuXFxuJyk7XG5cbiAgaWYgKCFjaHVuay5zZWxlY3Rpb24gJiYgIS9eWyBcXHRdKig/OlxcbnwkKS8udGVzdChjaHVuay5hZnRlcikpIHtcbiAgICBjaHVuay5hZnRlciA9IGNodW5rLmFmdGVyLnJlcGxhY2UoL15bXlxcbl0qLywgZnVuY3Rpb24gKHdob2xlTWF0Y2gpIHtcbiAgICAgIGNodW5rLnNlbGVjdGlvbiA9IHdob2xlTWF0Y2g7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfSk7XG4gICAgZmFrZVNlbGVjdGlvbiA9IHRydWU7XG4gIH1cblxuICBpZiAoLyhcXG58XilbIF17MCwzfShbKistXXxcXGQrWy5dKVsgXFx0XSsuKlxcbiQvLnRlc3QoY2h1bmsuYmVmb3JlKSkge1xuICAgIGlmIChjb21tYW5kTWdyLmRvTGlzdCkge1xuICAgICAgY29tbWFuZE1nci5kb0xpc3QoY2h1bmspO1xuICAgIH1cbiAgfVxuICBpZiAoLyhcXG58XilbIF17MCwzfT5bIFxcdF0rLipcXG4kLy50ZXN0KGNodW5rLmJlZm9yZSkpIHtcbiAgICBpZiAoY29tbWFuZE1nci5kb0Jsb2NrcXVvdGUpIHtcbiAgICAgIGNvbW1hbmRNZ3IuZG9CbG9ja3F1b3RlKGNodW5rKTtcbiAgICB9XG4gIH1cbiAgaWYgKC8oXFxufF4pKFxcdHxbIF17NCx9KS4qXFxuJC8udGVzdChjaHVuay5iZWZvcmUpKSB7XG4gICAgaWYgKGNvbW1hbmRNZ3IuZG9Db2RlKSB7XG4gICAgICBjb21tYW5kTWdyLmRvQ29kZShjaHVuayk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGZha2VTZWxlY3Rpb24pIHtcbiAgICBjaHVuay5hZnRlciA9IGNodW5rLnNlbGVjdGlvbiArIGNodW5rLmFmdGVyO1xuICAgIGNodW5rLnNlbGVjdGlvbiA9ICcnO1xuICB9XG59O1xuXG4kLmRvQmxvY2txdW90ZSA9IGZ1bmN0aW9uIChjaHVuaywgcG9zdFByb2Nlc3NpbmcpIHtcbiAgY2h1bmsuc2VsZWN0aW9uID0gY2h1bmsuc2VsZWN0aW9uLnJlcGxhY2UoL14oXFxuKikoW15cXHJdKz8pKFxcbiopJC8sXG4gICAgZnVuY3Rpb24gKHRvdGFsTWF0Y2gsIG5ld2xpbmVzQmVmb3JlLCB0ZXh0LCBuZXdsaW5lc0FmdGVyKSB7XG4gICAgICBjaHVuay5iZWZvcmUgKz0gbmV3bGluZXNCZWZvcmU7XG4gICAgICBjaHVuay5hZnRlciA9IG5ld2xpbmVzQWZ0ZXIgKyBjaHVuay5hZnRlcjtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH0pO1xuXG4gIGNodW5rLmJlZm9yZSA9IGNodW5rLmJlZm9yZS5yZXBsYWNlKC8oPlsgXFx0XSopJC8sXG4gICAgZnVuY3Rpb24gKHRvdGFsTWF0Y2gsIGJsYW5rTGluZSkge1xuICAgICAgY2h1bmsuc2VsZWN0aW9uID0gYmxhbmtMaW5lICsgY2h1bmsuc2VsZWN0aW9uO1xuICAgICAgcmV0dXJuICcnO1xuICAgIH0pO1xuXG4gIGNodW5rLnNlbGVjdGlvbiA9IGNodW5rLnNlbGVjdGlvbi5yZXBsYWNlKC9eKFxcc3w+KSskLywgJycpO1xuICBjaHVuay5zZWxlY3Rpb24gPSBjaHVuay5zZWxlY3Rpb24gfHwgdGhpcy5nZXRTdHJpbmcoJ3F1b3RlZXhhbXBsZScpO1xuXG4gIHZhciBtYXRjaCA9ICcnO1xuICB2YXIgbGVmdE92ZXIgPSAnJztcbiAgdmFyIGxpbmU7XG5cbiAgaWYgKGNodW5rLmJlZm9yZSkge1xuICAgIHZhciBsaW5lcyA9IGNodW5rLmJlZm9yZS5yZXBsYWNlKC9cXG4kLywgJycpLnNwbGl0KCdcXG4nKTtcbiAgICB2YXIgaW5DaGFpbiA9IGZhbHNlO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBnb29kID0gZmFsc2U7XG4gICAgICBsaW5lID0gbGluZXNbaV07XG4gICAgICBpbkNoYWluID0gaW5DaGFpbiAmJiBsaW5lLmxlbmd0aCA+IDA7XG4gICAgICBpZiAoL14+Ly50ZXN0KGxpbmUpKSB7XG4gICAgICAgIGdvb2QgPSB0cnVlO1xuICAgICAgICBpZiAoIWluQ2hhaW4gJiYgbGluZS5sZW5ndGggPiAxKVxuICAgICAgICAgIGluQ2hhaW4gPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmICgvXlsgXFx0XSokLy50ZXN0KGxpbmUpKSB7XG4gICAgICAgIGdvb2QgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZ29vZCA9IGluQ2hhaW47XG4gICAgICB9XG4gICAgICBpZiAoZ29vZCkge1xuICAgICAgICBtYXRjaCArPSBsaW5lICsgJ1xcbic7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZWZ0T3ZlciArPSBtYXRjaCArIGxpbmU7XG4gICAgICAgIG1hdGNoID0gJ1xcbic7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghLyhefFxcbik+Ly50ZXN0KG1hdGNoKSkge1xuICAgICAgbGVmdE92ZXIgKz0gbWF0Y2g7XG4gICAgICBtYXRjaCA9ICcnO1xuICAgIH1cbiAgfVxuXG4gIGNodW5rLnN0YXJ0VGFnID0gbWF0Y2g7XG4gIGNodW5rLmJlZm9yZSA9IGxlZnRPdmVyO1xuXG4gIC8vIGVuZCBvZiBjaGFuZ2VcblxuICBpZiAoY2h1bmsuYWZ0ZXIpIHtcbiAgICBjaHVuay5hZnRlciA9IGNodW5rLmFmdGVyLnJlcGxhY2UoL15cXG4/LywgJ1xcbicpO1xuICB9XG5cbiAgY2h1bmsuYWZ0ZXIgPSBjaHVuay5hZnRlci5yZXBsYWNlKC9eKCgoXFxufF4pKFxcblsgXFx0XSopKj4oLitcXG4pKi4qKSsoXFxuWyBcXHRdKikqKS8sXG4gICAgZnVuY3Rpb24gKHRvdGFsTWF0Y2gpIHtcbiAgICAgIGNodW5rLmVuZFRhZyA9IHRvdGFsTWF0Y2g7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICApO1xuXG4gIHZhciByZXBsYWNlQmxhbmtzSW5UYWdzID0gZnVuY3Rpb24gKHVzZUJyYWNrZXQpIHtcblxuICAgIHZhciByZXBsYWNlbWVudCA9IHVzZUJyYWNrZXQgPyAnPiAnIDogJyc7XG5cbiAgICBpZiAoY2h1bmsuc3RhcnRUYWcpIHtcbiAgICAgIGNodW5rLnN0YXJ0VGFnID0gY2h1bmsuc3RhcnRUYWcucmVwbGFjZSgvXFxuKCg+fFxccykqKVxcbiQvLFxuICAgICAgICBmdW5jdGlvbiAodG90YWxNYXRjaCwgbWFya2Rvd24pIHtcbiAgICAgICAgICByZXR1cm4gJ1xcbicgKyBtYXJrZG93bi5yZXBsYWNlKC9eWyBdezAsM30+P1sgXFx0XSokL2dtLCByZXBsYWNlbWVudCkgKyAnXFxuJztcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChjaHVuay5lbmRUYWcpIHtcbiAgICAgIGNodW5rLmVuZFRhZyA9IGNodW5rLmVuZFRhZy5yZXBsYWNlKC9eXFxuKCg+fFxccykqKVxcbi8sXG4gICAgICAgIGZ1bmN0aW9uICh0b3RhbE1hdGNoLCBtYXJrZG93bikge1xuICAgICAgICAgIHJldHVybiAnXFxuJyArIG1hcmtkb3duLnJlcGxhY2UoL15bIF17MCwzfT4/WyBcXHRdKiQvZ20sIHJlcGxhY2VtZW50KSArICdcXG4nO1xuICAgICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKC9eKD8hWyBdezAsM30+KS9tLnRlc3QoY2h1bmsuc2VsZWN0aW9uKSkge1xuICAgIHRoaXMud3JhcChjaHVuaywgc2V0dGluZ3MubGluZUxlbmd0aCAtIDIpO1xuICAgIGNodW5rLnNlbGVjdGlvbiA9IGNodW5rLnNlbGVjdGlvbi5yZXBsYWNlKC9eL2dtLCAnPiAnKTtcbiAgICByZXBsYWNlQmxhbmtzSW5UYWdzKHRydWUpO1xuICAgIGNodW5rLnNraXBMaW5lcygpO1xuICB9IGVsc2Uge1xuICAgIGNodW5rLnNlbGVjdGlvbiA9IGNodW5rLnNlbGVjdGlvbi5yZXBsYWNlKC9eWyBdezAsM30+ID8vZ20sICcnKTtcbiAgICB0aGlzLnVud3JhcChjaHVuayk7XG4gICAgcmVwbGFjZUJsYW5rc0luVGFncyhmYWxzZSk7XG5cbiAgICBpZiAoIS9eKFxcbnxeKVsgXXswLDN9Pi8udGVzdChjaHVuay5zZWxlY3Rpb24pICYmIGNodW5rLnN0YXJ0VGFnKSB7XG4gICAgICBjaHVuay5zdGFydFRhZyA9IGNodW5rLnN0YXJ0VGFnLnJlcGxhY2UoL1xcbnswLDJ9JC8sICdcXG5cXG4nKTtcbiAgICB9XG5cbiAgICBpZiAoIS8oXFxufF4pWyBdezAsM30+LiokLy50ZXN0KGNodW5rLnNlbGVjdGlvbikgJiYgY2h1bmsuZW5kVGFnKSB7XG4gICAgICBjaHVuay5lbmRUYWcgPSBjaHVuay5lbmRUYWcucmVwbGFjZSgvXlxcbnswLDJ9LywgJ1xcblxcbicpO1xuICAgIH1cbiAgfVxuXG4gIGlmICghL1xcbi8udGVzdChjaHVuay5zZWxlY3Rpb24pKSB7XG4gICAgY2h1bmsuc2VsZWN0aW9uID0gY2h1bmsuc2VsZWN0aW9uLnJlcGxhY2UoL14oPiAqKS8sIGZ1bmN0aW9uICh3aG9sZU1hdGNoLCBibGFua3MpIHtcbiAgICAgIGNodW5rLnN0YXJ0VGFnICs9IGJsYW5rcztcbiAgICAgIHJldHVybiAnJztcbiAgICB9KTtcbiAgfVxufTtcblxuJC5kb0NvZGUgPSBmdW5jdGlvbiAoY2h1bmssIHBvc3RQcm9jZXNzaW5nKSB7XG5cbiAgdmFyIGhhc1RleHRCZWZvcmUgPSAvXFxTWyBdKiQvLnRlc3QoY2h1bmsuYmVmb3JlKTtcbiAgdmFyIGhhc1RleHRBZnRlciA9IC9eWyBdKlxcUy8udGVzdChjaHVuay5hZnRlcik7XG5cbiAgLy8gVXNlICdmb3VyIHNwYWNlJyBtYXJrZG93biBpZiB0aGUgc2VsZWN0aW9uIGlzIG9uIGl0cyBvd25cbiAgLy8gbGluZSBvciBpcyBtdWx0aWxpbmUuXG4gIGlmICgoIWhhc1RleHRBZnRlciAmJiAhaGFzVGV4dEJlZm9yZSkgfHwgL1xcbi8udGVzdChjaHVuay5zZWxlY3Rpb24pKSB7XG5cbiAgICBjaHVuay5iZWZvcmUgPSBjaHVuay5iZWZvcmUucmVwbGFjZSgvWyBdezR9JC8sXG4gICAgICBmdW5jdGlvbiAodG90YWxNYXRjaCkge1xuICAgICAgICBjaHVuay5zZWxlY3Rpb24gPSB0b3RhbE1hdGNoICsgY2h1bmsuc2VsZWN0aW9uO1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9KTtcblxuICAgIHZhciBuTGluZXNCYWNrID0gMTtcbiAgICB2YXIgbkxpbmVzRm9yd2FyZCA9IDE7XG5cbiAgICBpZiAoLyhcXG58XikoXFx0fFsgXXs0LH0pLipcXG4kLy50ZXN0KGNodW5rLmJlZm9yZSkpIHtcbiAgICAgIG5MaW5lc0JhY2sgPSAwO1xuICAgIH1cbiAgICBpZiAoL15cXG4oXFx0fFsgXXs0LH0pLy50ZXN0KGNodW5rLmFmdGVyKSkge1xuICAgICAgbkxpbmVzRm9yd2FyZCA9IDA7XG4gICAgfVxuXG4gICAgY2h1bmsuc2tpcExpbmVzKG5MaW5lc0JhY2ssIG5MaW5lc0ZvcndhcmQpO1xuXG4gICAgaWYgKCFjaHVuay5zZWxlY3Rpb24pIHtcbiAgICAgIGNodW5rLnN0YXJ0VGFnID0gJyAgICAnO1xuICAgICAgY2h1bmsuc2VsZWN0aW9uID0gdGhpcy5nZXRTdHJpbmcoJ2NvZGVleGFtcGxlJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaWYgKC9eWyBdezAsM31cXFMvbS50ZXN0KGNodW5rLnNlbGVjdGlvbikpIHtcbiAgICAgICAgaWYgKC9cXG4vLnRlc3QoY2h1bmsuc2VsZWN0aW9uKSlcbiAgICAgICAgICBjaHVuay5zZWxlY3Rpb24gPSBjaHVuay5zZWxlY3Rpb24ucmVwbGFjZSgvXi9nbSwgJyAgICAnKTtcbiAgICAgICAgZWxzZSAvLyBpZiBpdCdzIG5vdCBtdWx0aWxpbmUsIGRvIG5vdCBzZWxlY3QgdGhlIGZvdXIgYWRkZWQgc3BhY2VzOyB0aGlzIGlzIG1vcmUgY29uc2lzdGVudCB3aXRoIHRoZSBkb0xpc3QgYmVoYXZpb3JcbiAgICAgICAgICBjaHVuay5iZWZvcmUgKz0gJyAgICAnO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGNodW5rLnNlbGVjdGlvbiA9IGNodW5rLnNlbGVjdGlvbi5yZXBsYWNlKC9eKD86WyBdezR9fFsgXXswLDN9XFx0KS9nbSwgJycpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICAvLyBVc2UgYmFja3RpY2tzIChgKSB0byBkZWxpbWl0IHRoZSBjb2RlIGJsb2NrLlxuXG4gICAgY2h1bmsudHJpbVdoaXRlc3BhY2UoKTtcbiAgICBjaHVuay5maW5kVGFncygvYC8sIC9gLyk7XG5cbiAgICBpZiAoIWNodW5rLnN0YXJ0VGFnICYmICFjaHVuay5lbmRUYWcpIHtcbiAgICAgIGNodW5rLnN0YXJ0VGFnID0gY2h1bmsuZW5kVGFnID0gJ2AnO1xuICAgICAgaWYgKCFjaHVuay5zZWxlY3Rpb24pIHtcbiAgICAgICAgY2h1bmsuc2VsZWN0aW9uID0gdGhpcy5nZXRTdHJpbmcoJ2NvZGVleGFtcGxlJyk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKGNodW5rLmVuZFRhZyAmJiAhY2h1bmsuc3RhcnRUYWcpIHtcbiAgICAgIGNodW5rLmJlZm9yZSArPSBjaHVuay5lbmRUYWc7XG4gICAgICBjaHVuay5lbmRUYWcgPSAnJztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBjaHVuay5zdGFydFRhZyA9IGNodW5rLmVuZFRhZyA9ICcnO1xuICAgIH1cbiAgfVxufTtcblxuJC5kb0xpc3QgPSBmdW5jdGlvbiAoY2h1bmssIHBvc3RQcm9jZXNzaW5nLCBpc051bWJlcmVkTGlzdCkge1xuICB2YXIgcHJldmlvdXNJdGVtc1JlZ2V4ID0gLyhcXG58XikoKFsgXXswLDN9KFsqKy1dfFxcZCtbLl0pWyBcXHRdKy4qKShcXG4uK3xcXG57Mix9KFsqKy1dLip8XFxkK1suXSlbIFxcdF0rLip8XFxuezIsfVsgXFx0XStcXFMuKikqKVxcbiokLztcbiAgdmFyIG5leHRJdGVtc1JlZ2V4ID0gL15cXG4qKChbIF17MCwzfShbKistXXxcXGQrWy5dKVsgXFx0XSsuKikoXFxuLit8XFxuezIsfShbKistXS4qfFxcZCtbLl0pWyBcXHRdKy4qfFxcbnsyLH1bIFxcdF0rXFxTLiopKilcXG4qLztcbiAgdmFyIGJ1bGxldCA9ICctJztcbiAgdmFyIG51bSA9IDE7XG5cbiAgZnVuY3Rpb24gZ2V0SXRlbVByZWZpeCAoKSB7XG4gICAgdmFyIHByZWZpeDtcbiAgICBpZiAoaXNOdW1iZXJlZExpc3QpIHtcbiAgICAgIHByZWZpeCA9ICcgJyArIG51bSArICcuICc7XG4gICAgICBudW0rKztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBwcmVmaXggPSAnICcgKyBidWxsZXQgKyAnICc7XG4gICAgfVxuICAgIHJldHVybiBwcmVmaXg7XG4gIH07XG5cbiAgZnVuY3Rpb24gZ2V0UHJlZml4ZWRJdGVtIChpdGVtVGV4dCkge1xuICAgIGlmIChpc051bWJlcmVkTGlzdCA9PT0gdm9pZCAwKSB7XG4gICAgICBpc051bWJlcmVkTGlzdCA9IC9eXFxzKlxcZC8udGVzdChpdGVtVGV4dCk7XG4gICAgfVxuXG4gICAgaXRlbVRleHQgPSBpdGVtVGV4dC5yZXBsYWNlKC9eWyBdezAsM30oWyorLV18XFxkK1suXSlcXHMvZ20sIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBnZXRJdGVtUHJlZml4KCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaXRlbVRleHQ7XG4gIH07XG5cbiAgY2h1bmsuZmluZFRhZ3MoLyhcXG58XikqWyBdezAsM30oWyorLV18XFxkK1suXSlcXHMrLywgbnVsbCk7XG5cbiAgaWYgKGNodW5rLmJlZm9yZSAmJiAhL1xcbiQvLnRlc3QoY2h1bmsuYmVmb3JlKSAmJiAhL15cXG4vLnRlc3QoY2h1bmsuc3RhcnRUYWcpKSB7XG4gICAgY2h1bmsuYmVmb3JlICs9IGNodW5rLnN0YXJ0VGFnO1xuICAgIGNodW5rLnN0YXJ0VGFnID0gJyc7XG4gIH1cblxuICBpZiAoY2h1bmsuc3RhcnRUYWcpIHtcblxuICAgIHZhciBoYXNEaWdpdHMgPSAvXFxkK1suXS8udGVzdChjaHVuay5zdGFydFRhZyk7XG4gICAgY2h1bmsuc3RhcnRUYWcgPSAnJztcbiAgICBjaHVuay5zZWxlY3Rpb24gPSBjaHVuay5zZWxlY3Rpb24ucmVwbGFjZSgvXFxuWyBdezR9L2csICdcXG4nKTtcbiAgICB0aGlzLnVud3JhcChjaHVuayk7XG4gICAgY2h1bmsuc2tpcExpbmVzKCk7XG5cbiAgICBpZiAoaGFzRGlnaXRzKSB7XG4gICAgICBjaHVuay5hZnRlciA9IGNodW5rLmFmdGVyLnJlcGxhY2UobmV4dEl0ZW1zUmVnZXgsIGdldFByZWZpeGVkSXRlbSk7XG4gICAgfVxuICAgIGlmIChpc051bWJlcmVkTGlzdCA9PSBoYXNEaWdpdHMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICB2YXIgbkxpbmVzVXAgPSAxO1xuXG4gIGNodW5rLmJlZm9yZSA9IGNodW5rLmJlZm9yZS5yZXBsYWNlKHByZXZpb3VzSXRlbXNSZWdleCxcbiAgICBmdW5jdGlvbiAoaXRlbVRleHQpIHtcbiAgICAgIGlmICgvXlxccyooWyorLV0pLy50ZXN0KGl0ZW1UZXh0KSkge1xuICAgICAgICBidWxsZXQgPSByZS4kMTtcbiAgICAgIH1cbiAgICAgIG5MaW5lc1VwID0gL1teXFxuXVxcblxcblteXFxuXS8udGVzdChpdGVtVGV4dCkgPyAxIDogMDtcbiAgICAgIHJldHVybiBnZXRQcmVmaXhlZEl0ZW0oaXRlbVRleHQpO1xuICAgIH0pO1xuXG4gIGlmICghY2h1bmsuc2VsZWN0aW9uKSB7XG4gICAgY2h1bmsuc2VsZWN0aW9uID0gdGhpcy5nZXRTdHJpbmcoJ2xpdGVtJyk7XG4gIH1cblxuICB2YXIgcHJlZml4ID0gZ2V0SXRlbVByZWZpeCgpO1xuICB2YXIgbkxpbmVzRG93biA9IDE7XG5cbiAgY2h1bmsuYWZ0ZXIgPSBjaHVuay5hZnRlci5yZXBsYWNlKG5leHRJdGVtc1JlZ2V4LCBmdW5jdGlvbiAoaXRlbVRleHQpIHtcbiAgICBuTGluZXNEb3duID0gL1teXFxuXVxcblxcblteXFxuXS8udGVzdChpdGVtVGV4dCkgPyAxIDogMDtcbiAgICByZXR1cm4gZ2V0UHJlZml4ZWRJdGVtKGl0ZW1UZXh0KTtcbiAgfSk7XG4gIGNodW5rLnRyaW1XaGl0ZXNwYWNlKHRydWUpO1xuICBjaHVuay5za2lwTGluZXMobkxpbmVzVXAsIG5MaW5lc0Rvd24sIHRydWUpO1xuICBjaHVuay5zdGFydFRhZyA9IHByZWZpeDtcbiAgdmFyIHNwYWNlcyA9IHByZWZpeC5yZXBsYWNlKC8uL2csICcgJyk7XG4gIHRoaXMud3JhcChjaHVuaywgc2V0dGluZ3MubGluZUxlbmd0aCAtIHNwYWNlcy5sZW5ndGgpO1xuICBjaHVuay5zZWxlY3Rpb24gPSBjaHVuay5zZWxlY3Rpb24ucmVwbGFjZSgvXFxuL2csICdcXG4nICsgc3BhY2VzKTtcblxufTtcblxuJC5kb0hlYWRpbmcgPSBmdW5jdGlvbiAoY2h1bmssIHBvc3RQcm9jZXNzaW5nKSB7XG4gIGNodW5rLnNlbGVjdGlvbiA9IGNodW5rLnNlbGVjdGlvbi5yZXBsYWNlKC9cXHMrL2csICcgJyk7XG4gIGNodW5rLnNlbGVjdGlvbiA9IGNodW5rLnNlbGVjdGlvbi5yZXBsYWNlKC8oXlxccyt8XFxzKyQpL2csICcnKTtcblxuICBpZiAoIWNodW5rLnNlbGVjdGlvbikge1xuICAgIGNodW5rLnN0YXJ0VGFnID0gJyMjICc7XG4gICAgY2h1bmsuc2VsZWN0aW9uID0gdGhpcy5nZXRTdHJpbmcoJ2hlYWRpbmdleGFtcGxlJyk7XG4gICAgY2h1bmsuZW5kVGFnID0gJyc7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGhlYWRlckxldmVsID0gMDtcblxuICBjaHVuay5maW5kVGFncygvIytbIF0qLywgL1sgXSojKy8pO1xuICBpZiAoLyMrLy50ZXN0KGNodW5rLnN0YXJ0VGFnKSkge1xuICAgIGhlYWRlckxldmVsID0gcmUubGFzdE1hdGNoLmxlbmd0aDtcbiAgfVxuICBjaHVuay5zdGFydFRhZyA9IGNodW5rLmVuZFRhZyA9ICcnO1xuICBjaHVuay5maW5kVGFncyhudWxsLCAvXFxzPygtK3w9KykvKTtcbiAgaWYgKC89Ky8udGVzdChjaHVuay5lbmRUYWcpKSB7XG4gICAgaGVhZGVyTGV2ZWwgPSAxO1xuICB9XG4gIGlmICgvLSsvLnRlc3QoY2h1bmsuZW5kVGFnKSkge1xuICAgIGhlYWRlckxldmVsID0gMjtcbiAgfVxuXG4gIGNodW5rLnN0YXJ0VGFnID0gY2h1bmsuZW5kVGFnID0gJyc7XG4gIGNodW5rLnNraXBMaW5lcygxLCAxKTtcblxuICB2YXIgaGVhZGVyTGV2ZWxUb0NyZWF0ZSA9IGhlYWRlckxldmVsID09IDEgPyAyIDogaGVhZGVyTGV2ZWwgLSAxO1xuICBpZiAoaGVhZGVyTGV2ZWxUb0NyZWF0ZSA+IDApIHtcbiAgICBjaHVuay5lbmRUYWcgPSAnXFxuJztcbiAgICB3aGlsZSAoaGVhZGVyTGV2ZWxUb0NyZWF0ZS0tKSB7XG4gICAgICBjaHVuay5zdGFydFRhZyArPSAnIyc7XG4gICAgfVxuICAgIGNodW5rLnN0YXJ0VGFnICs9ICcgJztcbiAgfVxufTtcblxuJC5kb0hvcml6b250YWxSdWxlID0gZnVuY3Rpb24gKGNodW5rLCBwb3N0UHJvY2Vzc2luZykge1xuICBjaHVuay5zdGFydFRhZyA9ICctLS0tLS0tLS0tXFxuJztcbiAgY2h1bmsuc2VsZWN0aW9uID0gJyc7XG4gIGNodW5rLnNraXBMaW5lcygyLCAxLCB0cnVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb21tYW5kTWFuYWdlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGVtaXR0ZXIgPSByZXF1aXJlKCdjb250cmEuZW1pdHRlcicpO1xudmFyIHVpID0gcmVxdWlyZSgnLi91aScpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciBwb3NpdGlvbiA9IHJlcXVpcmUoJy4vcG9zaXRpb24nKTtcbnZhciBQYW5lbENvbGxlY3Rpb24gPSByZXF1aXJlKCcuL1BhbmVsQ29sbGVjdGlvbicpO1xudmFyIFVuZG9NYW5hZ2VyID0gcmVxdWlyZSgnLi9VbmRvTWFuYWdlcicpO1xudmFyIFVJTWFuYWdlciA9IHJlcXVpcmUoJy4vVUlNYW5hZ2VyJyk7XG52YXIgQ29tbWFuZE1hbmFnZXIgPSByZXF1aXJlKCcuL0NvbW1hbmRNYW5hZ2VyJyk7XG52YXIgUHJldmlld01hbmFnZXIgPSByZXF1aXJlKCcuL1ByZXZpZXdNYW5hZ2VyJyk7XG5cbnZhciBkZWZhdWx0c1N0cmluZ3MgPSB7XG4gIGJvbGQ6ICdTdHJvbmcgPHN0cm9uZz4gQ3RybCtCJyxcbiAgYm9sZGV4YW1wbGU6ICdzdHJvbmcgdGV4dCcsXG4gIGNvZGU6ICdDb2RlIFNhbXBsZSA8cHJlPjxjb2RlPiBDdHJsK0snLFxuICBjb2RlZXhhbXBsZTogJ2VudGVyIGNvZGUgaGVyZScsXG4gIGhlYWRpbmc6ICdIZWFkaW5nIDxoMT4vPGgyPiBDdHJsK0gnLFxuICBoZWFkaW5nZXhhbXBsZTogJ0hlYWRpbmcnLFxuICBoZWxwOiAnTWFya2Rvd24gRWRpdGluZyBIZWxwJyxcbiAgaHI6ICdIb3Jpem9udGFsIFJ1bGUgPGhyPiBDdHJsK1InLFxuICBpbWFnZTogJ0ltYWdlIDxpbWc+IEN0cmwrRycsXG4gIGltYWdlZGVzY3JpcHRpb246ICdlbnRlciBpbWFnZSBkZXNjcmlwdGlvbiBoZXJlJyxcbiAgaXRhbGljOiAnRW1waGFzaXMgPGVtPiBDdHJsK0knLFxuICBpdGFsaWNleGFtcGxlOiAnZW1waGFzaXplZCB0ZXh0JyxcbiAgbGluazogJ0h5cGVybGluayA8YT4gQ3RybCtMJyxcbiAgbGlua2Rlc2NyaXB0aW9uOiAnZW50ZXIgbGluayBkZXNjcmlwdGlvbiBoZXJlJyxcbiAgbGl0ZW06ICdMaXN0IGl0ZW0nLFxuICBvbGlzdDogJ051bWJlcmVkIExpc3QgPG9sPiBDdHJsK08nLFxuICBxdW90ZTogJ0Jsb2NrcXVvdGUgPGJsb2NrcXVvdGU+IEN0cmwrUScsXG4gIHF1b3RlZXhhbXBsZTogJ0Jsb2NrcXVvdGUnLFxuICByZWRvOiAnUmVkbyAtIEN0cmwrWScsXG4gIHJlZG9tYWM6ICdSZWRvIC0gQ3RybCtTaGlmdCtaJyxcbiAgdWxpc3Q6ICdCdWxsZXRlZCBMaXN0IDx1bD4gQ3RybCtVJyxcbiAgdW5kbzogJ1VuZG8gLSBDdHJsK1onXG59O1xuXG5mdW5jdGlvbiBFZGl0b3IgKHBvc3RmaXgsIG9wdHMpIHtcbiAgdmFyIG9wdGlvbnMgPSBvcHRzIHx8IHt9O1xuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5oYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7IC8vYmFja3dhcmRzIGNvbXBhdGlibGUgYmVoYXZpb3JcbiAgICBvcHRpb25zID0geyBoZWxwQnV0dG9uOiBvcHRpb25zIH07XG4gIH1cbiAgb3B0aW9ucy5zdHJpbmdzID0gb3B0aW9ucy5zdHJpbmdzIHx8IHt9O1xuICBpZiAob3B0aW9ucy5oZWxwQnV0dG9uKSB7XG4gICAgb3B0aW9ucy5zdHJpbmdzLmhlbHAgPSBvcHRpb25zLnN0cmluZ3MuaGVscCB8fCBvcHRpb25zLmhlbHBCdXR0b24udGl0bGU7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0U3RyaW5nIChpZGVudGlmaWVyKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMuc3RyaW5nc1tpZGVudGlmaWVyXSB8fCBkZWZhdWx0c1N0cmluZ3NbaWRlbnRpZmllcl07XG4gIH1cblxuICB2YXIgYXBpID0gZW1pdHRlcigpO1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBwYW5lbHM7XG5cbiAgc2VsZi5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHBhbmVscykge1xuICAgICAgcmV0dXJuOyAvLyBhbHJlYWR5IGluaXRpYWxpemVkXG4gICAgfVxuXG4gICAgcGFuZWxzID0gbmV3IFBhbmVsQ29sbGVjdGlvbihwb3N0Zml4KTtcblxuICAgIHZhciBjb21tYW5kTWFuYWdlciA9IG5ldyBDb21tYW5kTWFuYWdlcihnZXRTdHJpbmcpO1xuICAgIHZhciBwcmV2aWV3TWFuYWdlciA9IG5ldyBQcmV2aWV3TWFuYWdlcihwYW5lbHMsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGFwaS5lbWl0KCdyZWZyZXNoJyk7XG4gICAgfSk7XG4gICAgdmFyIHVpTWFuYWdlcjtcblxuICAgIHZhciB1bmRvTWFuYWdlciA9IG5ldyBVbmRvTWFuYWdlcihmdW5jdGlvbiAoKSB7XG4gICAgICBwcmV2aWV3TWFuYWdlci5yZWZyZXNoKCk7XG4gICAgICBpZiAodWlNYW5hZ2VyKSB7IC8vIG5vdCBhdmFpbGFibGUgb24gdGhlIGZpcnN0IGNhbGxcbiAgICAgICAgdWlNYW5hZ2VyLnNldFVuZG9SZWRvQnV0dG9uU3RhdGVzKCk7XG4gICAgICB9XG4gICAgfSwgcGFuZWxzKTtcblxuICAgIHVpTWFuYWdlciA9IG5ldyBVSU1hbmFnZXIocG9zdGZpeCwgcGFuZWxzLCB1bmRvTWFuYWdlciwgcHJldmlld01hbmFnZXIsIGNvbW1hbmRNYW5hZ2VyLCBvcHRpb25zLmhlbHBCdXR0b24sIGdldFN0cmluZyk7XG4gICAgdWlNYW5hZ2VyLnNldFVuZG9SZWRvQnV0dG9uU3RhdGVzKCk7XG5cbiAgICBhcGkucmVmcmVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHByZXZpZXdNYW5hZ2VyLnJlZnJlc2godHJ1ZSk7XG4gICAgfTtcbiAgICBhcGkucmVmcmVzaCgpO1xuICB9O1xuXG4gIHNlbGYuYXBpID0gYXBpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEVkaXRvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gUGFuZWxDb2xsZWN0aW9uIChwb3N0Zml4KSB7XG4gIHRoaXMuYnV0dG9uQmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Btay1idXR0b25zLScgKyBwb3N0Zml4KTtcbiAgdGhpcy5wcmV2aWV3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Btay1wcmV2aWV3LScgKyBwb3N0Zml4KTtcbiAgdGhpcy5pbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbWstaW5wdXQtJyArIHBvc3RmaXgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBhbmVsQ29sbGVjdGlvbjtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIGRvYyA9IGdsb2JhbC5kb2N1bWVudDtcbnZhciB1YSA9IHJlcXVpcmUoJy4vdWEnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgcGFyc2UgPSByZXF1aXJlKCcuL3BhcnNlJyk7XG52YXIgcG9zaXRpb24gPSByZXF1aXJlKCcuL3Bvc2l0aW9uJyk7XG5cbmZ1bmN0aW9uIFByZXZpZXdNYW5hZ2VyIChwYW5lbHMsIHByZXZpZXdSZWZyZXNoQ2FsbGJhY2spIHtcbiAgdmFyIG1hbmFnZXJPYmogPSB0aGlzO1xuICB2YXIgdGltZW91dDtcbiAgdmFyIGVsYXBzZWRUaW1lO1xuICB2YXIgb2xkSW5wdXRUZXh0O1xuICB2YXIgbWF4RGVsYXkgPSAzMDAwO1xuICB2YXIgc3RhcnRUeXBlID0gJ2RlbGF5ZWQnOyAvLyBUaGUgb3RoZXIgbGVnYWwgdmFsdWUgaXMgJ21hbnVhbCdcblxuICAvLyBBZGRzIGV2ZW50IGxpc3RlbmVycyB0byBlbGVtZW50c1xuICB2YXIgc2V0dXBFdmVudHMgPSBmdW5jdGlvbiAoaW5wdXRFbGVtLCBsaXN0ZW5lcikge1xuXG4gICAgdXRpbC5hZGRFdmVudChpbnB1dEVsZW0sICdpbnB1dCcsIGxpc3RlbmVyKTtcbiAgICBpbnB1dEVsZW0ub25wYXN0ZSA9IGxpc3RlbmVyO1xuICAgIGlucHV0RWxlbS5vbmRyb3AgPSBsaXN0ZW5lcjtcblxuICAgIHV0aWwuYWRkRXZlbnQoaW5wdXRFbGVtLCAna2V5cHJlc3MnLCBsaXN0ZW5lcik7XG4gICAgdXRpbC5hZGRFdmVudChpbnB1dEVsZW0sICdrZXlkb3duJywgbGlzdGVuZXIpO1xuICB9O1xuXG4gIHZhciBnZXREb2NTY3JvbGxUb3AgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgcmVzdWx0ID0gMDtcblxuICAgIGlmICh3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgIHJlc3VsdCA9IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICB9IGVsc2UgaWYgKGRvYy5kb2N1bWVudEVsZW1lbnQgJiYgZG9jLmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3ApIHtcbiAgICAgIHJlc3VsdCA9IGRvYy5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wO1xuICAgIH0gZWxzZSBpZiAoZG9jLmJvZHkpIHtcbiAgICAgIHJlc3VsdCA9IGRvYy5ib2R5LnNjcm9sbFRvcDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIHZhciBtYWtlUHJldmlld0h0bWwgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAvLyBJZiB0aGVyZSBpcyBubyByZWdpc3RlcmVkIHByZXZpZXcgcGFuZWxcbiAgICAvLyB0aGVyZSBpcyBub3RoaW5nIHRvIGRvLlxuICAgIGlmICghcGFuZWxzLnByZXZpZXcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgdGV4dCA9IHBhbmVscy5pbnB1dC52YWx1ZTtcbiAgICBpZiAodGV4dCAmJiB0ZXh0ID09IG9sZElucHV0VGV4dCkge1xuICAgICAgcmV0dXJuOyAvLyBJbnB1dCB0ZXh0IGhhc24ndCBjaGFuZ2VkLlxuICAgIH0gZWxzZSB7XG4gICAgICBvbGRJbnB1dFRleHQgPSB0ZXh0O1xuICAgIH1cblxuICAgIHZhciBwcmV2VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG4gICAgdGV4dCA9IHBhcnNlKHRleHQpO1xuXG4gICAgLy8gQ2FsY3VsYXRlIHRoZSBwcm9jZXNzaW5nIHRpbWUgb2YgdGhlIEhUTUwgY3JlYXRpb24uXG4gICAgLy8gSXQncyB1c2VkIGFzIHRoZSBkZWxheSB0aW1lIGluIHRoZSBldmVudCBsaXN0ZW5lci5cbiAgICB2YXIgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICBlbGFwc2VkVGltZSA9IGN1cnJUaW1lIC0gcHJldlRpbWU7XG5cbiAgICBwdXNoUHJldmlld0h0bWwodGV4dCk7XG4gIH07XG5cbiAgLy8gc2V0VGltZW91dCBpcyBhbHJlYWR5IHVzZWQuICBVc2VkIGFzIGFuIGV2ZW50IGxpc3RlbmVyLlxuICB2YXIgYXBwbHlUaW1lb3V0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgIHRpbWVvdXQgPSB2b2lkIDA7XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0VHlwZSAhPT0gJ21hbnVhbCcpIHtcblxuICAgICAgdmFyIGRlbGF5ID0gMDtcblxuICAgICAgaWYgKHN0YXJ0VHlwZSA9PT0gJ2RlbGF5ZWQnKSB7XG4gICAgICAgIGRlbGF5ID0gZWxhcHNlZFRpbWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChkZWxheSA+IG1heERlbGF5KSB7XG4gICAgICAgIGRlbGF5ID0gbWF4RGVsYXk7XG4gICAgICB9XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChtYWtlUHJldmlld0h0bWwsIGRlbGF5KTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGdldFNjYWxlRmFjdG9yID0gZnVuY3Rpb24gKHBhbmVsKSB7XG4gICAgaWYgKHBhbmVsLnNjcm9sbEhlaWdodCA8PSBwYW5lbC5jbGllbnRIZWlnaHQpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH1cbiAgICByZXR1cm4gcGFuZWwuc2Nyb2xsVG9wIC8gKHBhbmVsLnNjcm9sbEhlaWdodCAtIHBhbmVsLmNsaWVudEhlaWdodCk7XG4gIH07XG5cbiAgdmFyIHNldFBhbmVsU2Nyb2xsVG9wcyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAocGFuZWxzLnByZXZpZXcpIHtcbiAgICAgIHBhbmVscy5wcmV2aWV3LnNjcm9sbFRvcCA9IChwYW5lbHMucHJldmlldy5zY3JvbGxIZWlnaHQgLSBwYW5lbHMucHJldmlldy5jbGllbnRIZWlnaHQpICogZ2V0U2NhbGVGYWN0b3IocGFuZWxzLnByZXZpZXcpO1xuICAgIH1cbiAgfTtcblxuICB0aGlzLnJlZnJlc2ggPSBmdW5jdGlvbiAocmVxdWlyZXNSZWZyZXNoKSB7XG5cbiAgICBpZiAocmVxdWlyZXNSZWZyZXNoKSB7XG4gICAgICBvbGRJbnB1dFRleHQgPSAnJztcbiAgICAgIG1ha2VQcmV2aWV3SHRtbCgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGFwcGx5VGltZW91dCgpO1xuICAgIH1cbiAgfTtcblxuICB0aGlzLnByb2Nlc3NpbmdUaW1lID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBlbGFwc2VkVGltZTtcbiAgfTtcblxuICB2YXIgaXNGaXJzdFRpbWVGaWxsZWQgPSB0cnVlO1xuXG4gIC8vIElFIGRvZXNuJ3QgbGV0IHlvdSB1c2UgaW5uZXJIVE1MIGlmIHRoZSBlbGVtZW50IGlzIGNvbnRhaW5lZCBzb21ld2hlcmUgaW4gYSB0YWJsZVxuICAvLyAod2hpY2ggaXMgdGhlIGNhc2UgZm9yIGlubGluZSBlZGl0aW5nKSAtLSBpbiB0aGF0IGNhc2UsIGRldGFjaCB0aGUgZWxlbWVudCwgc2V0IHRoZVxuICAvLyB2YWx1ZSwgYW5kIHJlYXR0YWNoLiBZZXMsIHRoYXQgKmlzKiByaWRpY3Vsb3VzLlxuICB2YXIgaWVTYWZlUHJldmlld1NldCA9IGZ1bmN0aW9uICh0ZXh0KSB7XG4gICAgdmFyIHByZXZpZXcgPSBwYW5lbHMucHJldmlldztcbiAgICB2YXIgcGFyZW50ID0gcHJldmlldy5wYXJlbnROb2RlO1xuICAgIHZhciBzaWJsaW5nID0gcHJldmlldy5uZXh0U2libGluZztcbiAgICBwYXJlbnQucmVtb3ZlQ2hpbGQocHJldmlldyk7XG4gICAgcHJldmlldy5pbm5lckhUTUwgPSB0ZXh0O1xuICAgIGlmICghc2libGluZylcbiAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChwcmV2aWV3KTtcbiAgICBlbHNlXG4gICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKHByZXZpZXcsIHNpYmxpbmcpO1xuICB9XG5cbiAgdmFyIG5vblN1Y2t5QnJvd3NlclByZXZpZXdTZXQgPSBmdW5jdGlvbiAodGV4dCkge1xuICAgIHBhbmVscy5wcmV2aWV3LmlubmVySFRNTCA9IHRleHQ7XG4gIH1cblxuICB2YXIgcHJldmlld1NldHRlcjtcblxuICB2YXIgcHJldmlld1NldCA9IGZ1bmN0aW9uICh0ZXh0KSB7XG4gICAgaWYgKHByZXZpZXdTZXR0ZXIpXG4gICAgICByZXR1cm4gcHJldmlld1NldHRlcih0ZXh0KTtcblxuICAgIHRyeSB7XG4gICAgICBub25TdWNreUJyb3dzZXJQcmV2aWV3U2V0KHRleHQpO1xuICAgICAgcHJldmlld1NldHRlciA9IG5vblN1Y2t5QnJvd3NlclByZXZpZXdTZXQ7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcHJldmlld1NldHRlciA9IGllU2FmZVByZXZpZXdTZXQ7XG4gICAgICBwcmV2aWV3U2V0dGVyKHRleHQpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgcHVzaFByZXZpZXdIdG1sID0gZnVuY3Rpb24gKHRleHQpIHtcblxuICAgIHZhciBlbXB0eVRvcCA9IHBvc2l0aW9uLmdldFRvcChwYW5lbHMuaW5wdXQpIC0gZ2V0RG9jU2Nyb2xsVG9wKCk7XG5cbiAgICBpZiAocGFuZWxzLnByZXZpZXcpIHtcbiAgICAgIHByZXZpZXdTZXQodGV4dCk7XG4gICAgICBwcmV2aWV3UmVmcmVzaENhbGxiYWNrKCk7XG4gICAgfVxuXG4gICAgc2V0UGFuZWxTY3JvbGxUb3BzKCk7XG5cbiAgICBpZiAoaXNGaXJzdFRpbWVGaWxsZWQpIHtcbiAgICAgIGlzRmlyc3RUaW1lRmlsbGVkID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGZ1bGxUb3AgPSBwb3NpdGlvbi5nZXRUb3AocGFuZWxzLmlucHV0KSAtIGdldERvY1Njcm9sbFRvcCgpO1xuXG4gICAgaWYgKHVhLmlzSUUpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW5kb3cuc2Nyb2xsQnkoMCwgZnVsbFRvcCAtIGVtcHR5VG9wKTtcbiAgICAgIH0sIDApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHdpbmRvdy5zY3JvbGxCeSgwLCBmdWxsVG9wIC0gZW1wdHlUb3ApO1xuICAgIH1cbiAgfTtcblxuICB2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcblxuICAgIHNldHVwRXZlbnRzKHBhbmVscy5pbnB1dCwgYXBwbHlUaW1lb3V0KTtcbiAgICBtYWtlUHJldmlld0h0bWwoKTtcblxuICAgIGlmIChwYW5lbHMucHJldmlldykge1xuICAgICAgcGFuZWxzLnByZXZpZXcuc2Nyb2xsVG9wID0gMDtcbiAgICB9XG4gIH07XG5cbiAgaW5pdCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcmV2aWV3TWFuYWdlcjtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQ7XG52YXIgQ2h1bmtzID0gcmVxdWlyZSgnLi9DaHVua3MnKTtcbnZhciB1YSA9IHJlcXVpcmUoJy4vdWEnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbmZ1bmN0aW9uIFRleHRhcmVhU3RhdGUgKHBhbmVscywgaXNJbml0aWFsU3RhdGUpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgaW5wdXQgPSBwYW5lbHMuaW5wdXQ7XG5cbiAgc2VsZi5pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdXRpbC5pc1Zpc2libGUoaW5wdXQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghaXNJbml0aWFsU3RhdGUgJiYgZG9jLmFjdGl2ZUVsZW1lbnQgJiYgZG9jLmFjdGl2ZUVsZW1lbnQgIT09IGlucHV0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2VsZi5zZXRJbnB1dFNlbGVjdGlvblN0YXJ0RW5kKCk7XG4gICAgc2VsZi5zY3JvbGxUb3AgPSBpbnB1dC5zY3JvbGxUb3A7XG4gICAgaWYgKCFzZWxmLnRleHQgJiYgaW5wdXQuc2VsZWN0aW9uU3RhcnQgfHwgaW5wdXQuc2VsZWN0aW9uU3RhcnQgPT09IDApIHtcbiAgICAgIHNlbGYudGV4dCA9IGlucHV0LnZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHNlbGYuc2V0SW5wdXRTZWxlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF1dGlsLmlzVmlzaWJsZShpbnB1dCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoaW5wdXQuc2VsZWN0aW9uU3RhcnQgIT09IHZvaWQgMCAmJiAhdWEuaXNPcGVyYSkge1xuICAgICAgaW5wdXQuZm9jdXMoKTtcbiAgICAgIGlucHV0LnNlbGVjdGlvblN0YXJ0ID0gc2VsZi5zdGFydDtcbiAgICAgIGlucHV0LnNlbGVjdGlvbkVuZCA9IHNlbGYuZW5kO1xuICAgICAgaW5wdXQuc2Nyb2xsVG9wID0gc2VsZi5zY3JvbGxUb3A7XG4gICAgfSBlbHNlIGlmIChkb2Muc2VsZWN0aW9uKSB7XG4gICAgICBpZiAoZG9jLmFjdGl2ZUVsZW1lbnQgJiYgZG9jLmFjdGl2ZUVsZW1lbnQgIT09IGlucHV0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaW5wdXQuZm9jdXMoKTtcbiAgICAgIHZhciByYW5nZSA9IGlucHV0LmNyZWF0ZVRleHRSYW5nZSgpO1xuICAgICAgcmFuZ2UubW92ZVN0YXJ0KCdjaGFyYWN0ZXInLCAtaW5wdXQudmFsdWUubGVuZ3RoKTtcbiAgICAgIHJhbmdlLm1vdmVFbmQoJ2NoYXJhY3RlcicsIC1pbnB1dC52YWx1ZS5sZW5ndGgpO1xuICAgICAgcmFuZ2UubW92ZUVuZCgnY2hhcmFjdGVyJywgc2VsZi5lbmQpO1xuICAgICAgcmFuZ2UubW92ZVN0YXJ0KCdjaGFyYWN0ZXInLCBzZWxmLnN0YXJ0KTtcbiAgICAgIHJhbmdlLnNlbGVjdCgpO1xuICAgIH1cbiAgfTtcblxuICBzZWxmLnNldElucHV0U2VsZWN0aW9uU3RhcnRFbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFwYW5lbHMuaWVDYWNoZWRSYW5nZSAmJiAoaW5wdXQuc2VsZWN0aW9uU3RhcnQgfHwgaW5wdXQuc2VsZWN0aW9uU3RhcnQgPT09IDApKSB7XG4gICAgICBzZWxmLnN0YXJ0ID0gaW5wdXQuc2VsZWN0aW9uU3RhcnQ7XG4gICAgICBzZWxmLmVuZCA9IGlucHV0LnNlbGVjdGlvbkVuZDtcbiAgICB9IGVsc2UgaWYgKGRvYy5zZWxlY3Rpb24pIHtcbiAgICAgIHNlbGYudGV4dCA9IHV0aWwuZml4RW9sQ2hhcnMoaW5wdXQudmFsdWUpO1xuXG4gICAgICB2YXIgcmFuZ2UgPSBwYW5lbHMuaWVDYWNoZWRSYW5nZSB8fCBkb2Muc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKCk7XG4gICAgICB2YXIgZml4ZWRSYW5nZSA9IHV0aWwuZml4RW9sQ2hhcnMocmFuZ2UudGV4dCk7XG4gICAgICB2YXIgbWFya2VyID0gJ1xceDA3JztcbiAgICAgIHZhciBtYXJrZWRSYW5nZSA9IG1hcmtlciArIGZpeGVkUmFuZ2UgKyBtYXJrZXI7XG4gICAgICByYW5nZS50ZXh0ID0gbWFya2VkUmFuZ2U7XG4gICAgICB2YXIgaW5wdXRUZXh0ID0gdXRpbC5maXhFb2xDaGFycyhpbnB1dC52YWx1ZSk7XG5cbiAgICAgIHJhbmdlLm1vdmVTdGFydCgnY2hhcmFjdGVyJywgLW1hcmtlZFJhbmdlLmxlbmd0aCk7XG4gICAgICByYW5nZS50ZXh0ID0gZml4ZWRSYW5nZTtcblxuICAgICAgc2VsZi5zdGFydCA9IGlucHV0VGV4dC5pbmRleE9mKG1hcmtlcik7XG4gICAgICBzZWxmLmVuZCA9IGlucHV0VGV4dC5sYXN0SW5kZXhPZihtYXJrZXIpIC0gbWFya2VyLmxlbmd0aDtcblxuICAgICAgdmFyIGxlbiA9IHNlbGYudGV4dC5sZW5ndGggLSB1dGlsLmZpeEVvbENoYXJzKGlucHV0LnZhbHVlKS5sZW5ndGg7XG4gICAgICBpZiAobGVuKSB7XG4gICAgICAgIHJhbmdlLm1vdmVTdGFydCgnY2hhcmFjdGVyJywgLWZpeGVkUmFuZ2UubGVuZ3RoKTtcbiAgICAgICAgd2hpbGUgKGxlbi0tKSB7XG4gICAgICAgICAgZml4ZWRSYW5nZSArPSAnXFxuJztcbiAgICAgICAgICBzZWxmLmVuZCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJhbmdlLnRleHQgPSBmaXhlZFJhbmdlO1xuICAgICAgfVxuXG4gICAgICBpZiAocGFuZWxzLmllQ2FjaGVkUmFuZ2UpIHtcbiAgICAgICAgc2VsZi5zY3JvbGxUb3AgPSBwYW5lbHMuaWVDYWNoZWRTY3JvbGxUb3A7XG4gICAgICB9XG4gICAgICBwYW5lbHMuaWVDYWNoZWRSYW5nZSA9IG51bGw7XG4gICAgICBzZWxmLnNldElucHV0U2VsZWN0aW9uKCk7XG4gICAgfVxuICB9O1xuXG4gc2VsZi5yZXN0b3JlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChzZWxmLnRleHQgIT0gdm9pZCAwICYmIHNlbGYudGV4dCAhPSBpbnB1dC52YWx1ZSkge1xuICAgICAgaW5wdXQudmFsdWUgPSBzZWxmLnRleHQ7XG4gICAgfVxuICAgIHNlbGYuc2V0SW5wdXRTZWxlY3Rpb24oKTtcbiAgICBpbnB1dC5zY3JvbGxUb3AgPSBzZWxmLnNjcm9sbFRvcDtcbiAgfTtcblxuICBzZWxmLmdldENodW5rcyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2h1bmsgPSBuZXcgQ2h1bmtzKCk7XG4gICAgY2h1bmsuYmVmb3JlID0gdXRpbC5maXhFb2xDaGFycyhzZWxmLnRleHQuc3Vic3RyaW5nKDAsIHNlbGYuc3RhcnQpKTtcbiAgICBjaHVuay5zdGFydFRhZyA9ICcnO1xuICAgIGNodW5rLnNlbGVjdGlvbiA9IHV0aWwuZml4RW9sQ2hhcnMoc2VsZi50ZXh0LnN1YnN0cmluZyhzZWxmLnN0YXJ0LCBzZWxmLmVuZCkpO1xuICAgIGNodW5rLmVuZFRhZyA9ICcnO1xuICAgIGNodW5rLmFmdGVyID0gdXRpbC5maXhFb2xDaGFycyhzZWxmLnRleHQuc3Vic3RyaW5nKHNlbGYuZW5kKSk7XG4gICAgY2h1bmsuc2Nyb2xsVG9wID0gc2VsZi5zY3JvbGxUb3A7XG4gICAgcmV0dXJuIGNodW5rO1xuICB9O1xuXG4gIHNlbGYuc2V0Q2h1bmtzID0gZnVuY3Rpb24gKGNodW5rKSB7XG4gICAgY2h1bmsuYmVmb3JlID0gY2h1bmsuYmVmb3JlICsgY2h1bmsuc3RhcnRUYWc7XG4gICAgY2h1bmsuYWZ0ZXIgPSBjaHVuay5lbmRUYWcgKyBjaHVuay5hZnRlcjtcbiAgICBzZWxmLnN0YXJ0ID0gY2h1bmsuYmVmb3JlLmxlbmd0aDtcbiAgICBzZWxmLmVuZCA9IGNodW5rLmJlZm9yZS5sZW5ndGggKyBjaHVuay5zZWxlY3Rpb24ubGVuZ3RoO1xuICAgIHNlbGYudGV4dCA9IGNodW5rLmJlZm9yZSArIGNodW5rLnNlbGVjdGlvbiArIGNodW5rLmFmdGVyO1xuICAgIHNlbGYuc2Nyb2xsVG9wID0gY2h1bmsuc2Nyb2xsVG9wO1xuICB9O1xuXG4gIHNlbGYuaW5pdCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0YXJlYVN0YXRlO1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIGRvYyA9IGdsb2JhbC5kb2N1bWVudDtcbnZhciBjID0gZG9jLmNyZWF0ZUVsZW1lbnQuYmluZChkb2MpO1xudmFyIHVhID0gcmVxdWlyZSgnLi91YScpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciBUZXh0YXJlYVN0YXRlID0gcmVxdWlyZSgnLi9UZXh0YXJlYVN0YXRlJyk7XG5cbmZ1bmN0aW9uIFVJTWFuYWdlciAocG9zdGZpeCwgcGFuZWxzLCB1bmRvTWFuYWdlciwgcHJldmlld01hbmFnZXIsIGNvbW1hbmRNYW5hZ2VyLCBoZWxwT3B0aW9ucywgZ2V0U3RyaW5nKSB7XG4gIHZhciBpbnB1dEJveCA9IHBhbmVscy5pbnB1dDtcbiAgdmFyIGJ1dHRvbnMgPSB7fTtcblxuICBtYWtlU3ByaXRlZEJ1dHRvblJvdygpO1xuXG4gIHZhciBrZXlFdmVudCA9ICdrZXlkb3duJztcbiAgaWYgKHVhLmlzT3BlcmEpIHtcbiAgICBrZXlFdmVudCA9ICdrZXlwcmVzcyc7XG4gIH1cblxuICB1dGlsLmFkZEV2ZW50KGlucHV0Qm94LCBrZXlFdmVudCwgZnVuY3Rpb24gKGtleSkge1xuICAgIGlmICgoIWtleS5jdHJsS2V5ICYmICFrZXkubWV0YUtleSkgfHwga2V5LmFsdEtleSB8fCBrZXkuc2hpZnRLZXkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIga2V5Q29kZSA9IGtleS5jaGFyQ29kZSB8fCBrZXkua2V5Q29kZTtcbiAgICB2YXIga2V5Q29kZVN0ciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoa2V5Q29kZSkudG9Mb3dlckNhc2UoKTtcblxuICAgIHN3aXRjaCAoa2V5Q29kZVN0cikge1xuICAgICAgY2FzZSAnYic6IGRvQ2xpY2soYnV0dG9ucy5ib2xkKTsgYnJlYWs7XG4gICAgICBjYXNlICdpJzogZG9DbGljayhidXR0b25zLml0YWxpYyk7IGJyZWFrO1xuICAgICAgY2FzZSAnbCc6IGRvQ2xpY2soYnV0dG9ucy5saW5rKTsgYnJlYWs7XG4gICAgICBjYXNlICdxJzogZG9DbGljayhidXR0b25zLnF1b3RlKTsgYnJlYWs7XG4gICAgICBjYXNlICdrJzogZG9DbGljayhidXR0b25zLmNvZGUpOyBicmVhaztcbiAgICAgIGNhc2UgJ2cnOiBkb0NsaWNrKGJ1dHRvbnMuaW1hZ2UpOyBicmVhaztcbiAgICAgIGNhc2UgJ28nOiBkb0NsaWNrKGJ1dHRvbnMub2xpc3QpOyBicmVhaztcbiAgICAgIGNhc2UgJ3UnOiBkb0NsaWNrKGJ1dHRvbnMudWxpc3QpOyBicmVhaztcbiAgICAgIGNhc2UgJ2gnOiBkb0NsaWNrKGJ1dHRvbnMuaGVhZGluZyk7IGJyZWFrO1xuICAgICAgY2FzZSAncic6IGRvQ2xpY2soYnV0dG9ucy5ocik7IGJyZWFrO1xuICAgICAgY2FzZSAneSc6IGRvQ2xpY2soYnV0dG9ucy5yZWRvKTsgYnJlYWs7XG4gICAgICBjYXNlICd6JzpcbiAgICAgICAgaWYgKGtleS5zaGlmdEtleSkge1xuICAgICAgICAgIGRvQ2xpY2soYnV0dG9ucy5yZWRvKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBkb0NsaWNrKGJ1dHRvbnMudW5kbyk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGtleS5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAga2V5LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICAgIGlmICh3aW5kb3cuZXZlbnQpIHtcbiAgICAgIHdpbmRvdy5ldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgIH1cbiAgfSk7XG5cbiAgdXRpbC5hZGRFdmVudChpbnB1dEJveCwgJ2tleXVwJywgZnVuY3Rpb24gKGtleSkge1xuICAgIGlmIChrZXkuc2hpZnRLZXkgJiYgIWtleS5jdHJsS2V5ICYmICFrZXkubWV0YUtleSkge1xuICAgICAgdmFyIGtleUNvZGUgPSBrZXkuY2hhckNvZGUgfHwga2V5LmtleUNvZGU7XG5cbiAgICAgIGlmIChrZXlDb2RlID09PSAxMykge1xuICAgICAgICB2YXIgZmFrZUJ1dHRvbiA9IHt9O1xuICAgICAgICBmYWtlQnV0dG9uLnRleHRPcCA9IGJpbmRDb21tYW5kKCdkb0F1dG9pbmRlbnQnKTtcbiAgICAgICAgZG9DbGljayhmYWtlQnV0dG9uKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIGlmICh1YS5pc0lFKSB7XG4gICAgdXRpbC5hZGRFdmVudChpbnB1dEJveCwgJ2tleWRvd24nLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICB2YXIgY29kZSA9IGtleS5rZXlDb2RlO1xuICAgICAgaWYgKGNvZGUgPT09IDI3KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gZG9DbGljayAoYnV0dG9uKSB7XG4gICAgaW5wdXRCb3guZm9jdXMoKTtcblxuICAgIGlmIChidXR0b24udGV4dE9wKSB7XG4gICAgICBpZiAodW5kb01hbmFnZXIpIHtcbiAgICAgICAgdW5kb01hbmFnZXIuc2V0Q29tbWFuZE1vZGUoKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHN0YXRlID0gbmV3IFRleHRhcmVhU3RhdGUocGFuZWxzKTtcblxuICAgICAgaWYgKCFzdGF0ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBjaHVua3MgPSBzdGF0ZS5nZXRDaHVua3MoKTtcbiAgICAgIHZhciBub0NsZWFudXAgPSBidXR0b24udGV4dE9wKGNodW5rcywgZml4dXBJbnB1dEFyZWEpO1xuXG4gICAgICBpZiAoIW5vQ2xlYW51cCkge1xuICAgICAgICBmaXh1cElucHV0QXJlYSgpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoYnV0dG9uLmV4ZWN1dGUpIHtcbiAgICAgIGJ1dHRvbi5leGVjdXRlKHVuZG9NYW5hZ2VyKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaXh1cElucHV0QXJlYSAoKSB7XG4gICAgICBpbnB1dEJveC5mb2N1cygpO1xuXG4gICAgICBpZiAoY2h1bmtzKSB7XG4gICAgICAgIHN0YXRlLnNldENodW5rcyhjaHVua3MpO1xuICAgICAgfVxuICAgICAgc3RhdGUucmVzdG9yZSgpO1xuICAgICAgcHJldmlld01hbmFnZXIucmVmcmVzaCgpO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBzZXR1cEJ1dHRvbiAoYnV0dG9uLCBpc0VuYWJsZWQpIHtcbiAgICB2YXIgbm9ybWFsWVNoaWZ0ID0gJzBweCc7XG4gICAgdmFyIGRpc2FibGVkWVNoaWZ0ID0gJy0yMHB4JztcbiAgICB2YXIgaGlnaGxpZ2h0WVNoaWZ0ID0gJy00MHB4JztcbiAgICB2YXIgaW1hZ2UgPSBidXR0b24uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NwYW4nKVswXTtcbiAgICBpZiAoaXNFbmFibGVkKSB7XG4gICAgICBidXR0b24ub25tb3VzZW92ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGltYWdlLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9IHRoaXMuWFNoaWZ0ICsgJyAnICsgaGlnaGxpZ2h0WVNoaWZ0O1xuICAgICAgfTtcbiAgICAgIGJ1dHRvbi5vbm1vdXNlb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpbWFnZS5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSB0aGlzLlhTaGlmdCArICcgJyArIG5vcm1hbFlTaGlmdDtcbiAgICAgIH07XG4gICAgICBidXR0b24ub25tb3VzZW91dCgpO1xuXG4gICAgICBpZiAodWEuaXNJRSkge1xuICAgICAgICBidXR0b24ub25tb3VzZWRvd24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKGRvYy5hY3RpdmVFbGVtZW50ICYmIGRvYy5hY3RpdmVFbGVtZW50ICE9PSBwYW5lbHMuaW5wdXQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgcGFuZWxzLmllQ2FjaGVkUmFuZ2UgPSBkb2N1bWVudC5zZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKTtcbiAgICAgICAgICBwYW5lbHMuaWVDYWNoZWRTY3JvbGxUb3AgPSBwYW5lbHMuaW5wdXQuc2Nyb2xsVG9wO1xuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoIWJ1dHRvbi5pc0hlbHApIHtcbiAgICAgICAgYnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKHRoaXMub25tb3VzZW91dCkge1xuICAgICAgICAgICAgdGhpcy5vbm1vdXNlb3V0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRvQ2xpY2sodGhpcyk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGltYWdlLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9IGJ1dHRvbi5YU2hpZnQgKyAnICcgKyBkaXNhYmxlZFlTaGlmdDtcbiAgICAgIGJ1dHRvbi5vbm1vdXNlb3ZlciA9IGJ1dHRvbi5vbm1vdXNlb3V0ID0gYnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7IH07XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYmluZENvbW1hbmQgKG1ldGhvZCkge1xuICAgIGlmICh0eXBlb2YgbWV0aG9kID09PSAnc3RyaW5nJykge1xuICAgICAgbWV0aG9kID0gY29tbWFuZE1hbmFnZXJbbWV0aG9kXTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIG1ldGhvZC5hcHBseShjb21tYW5kTWFuYWdlciwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gbWFrZVNwcml0ZWRCdXR0b25Sb3cgKCkge1xuICAgIHZhciBidXR0b25CYXIgPSBwYW5lbHMuYnV0dG9uQmFyO1xuICAgIHZhciBub3JtYWxZU2hpZnQgPSAnMHB4JztcbiAgICB2YXIgZGlzYWJsZWRZU2hpZnQgPSAnLTIwcHgnO1xuICAgIHZhciBoaWdobGlnaHRZU2hpZnQgPSAnLTQwcHgnO1xuXG4gICAgdmFyIGJ1dHRvblJvdyA9IGMoJ3VsJyk7XG4gICAgYnV0dG9uUm93LmlkID0gJ3Btay1idXR0b24tcm93LScgKyBwb3N0Zml4O1xuICAgIGJ1dHRvblJvdy5jbGFzc05hbWUgPSAncG1rLWJ1dHRvbi1yb3cnO1xuICAgIGJ1dHRvblJvdyA9IGJ1dHRvbkJhci5hcHBlbmRDaGlsZChidXR0b25Sb3cpO1xuXG4gICAgZnVuY3Rpb24gbWFrZUJ1dHRvbiAoaWQsIHRpdGxlLCBYU2hpZnQsIHRleHRPcCkge1xuICAgICAgdmFyIGJ1dHRvbiA9IGMoJ2xpJyk7XG4gICAgICBidXR0b24uY2xhc3NOYW1lID0gJ3Btay1idXR0b24gJyArIGlkO1xuICAgICAgdmFyIGJ1dHRvbkltYWdlID0gYygnc3BhbicpO1xuICAgICAgYnV0dG9uLmlkID0gaWQgKyAnLScgKyBwb3N0Zml4O1xuICAgICAgYnV0dG9uLmFwcGVuZENoaWxkKGJ1dHRvbkltYWdlKTtcbiAgICAgIGJ1dHRvbi50aXRsZSA9IHRpdGxlO1xuICAgICAgYnV0dG9uLlhTaGlmdCA9IFhTaGlmdDtcbiAgICAgIGlmICh0ZXh0T3ApIHtcbiAgICAgICAgYnV0dG9uLnRleHRPcCA9IHRleHRPcDtcbiAgICAgIH1cbiAgICAgIHNldHVwQnV0dG9uKGJ1dHRvbiwgdHJ1ZSk7XG4gICAgICBidXR0b25Sb3cuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgICAgIHJldHVybiBidXR0b247XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZVNwYWNlciAobnVtKSB7XG4gICAgICB2YXIgc3BhY2VyID0gYygnbGknKTtcbiAgICAgIHNwYWNlci5jbGFzc05hbWUgPSAncG1rLXNwYWNlciBwbWstc3BhY2VyLScgKyBudW07XG4gICAgICBzcGFjZXIuaWQgPSAncG1rLXNwYWNlci0nICsgcG9zdGZpeCArICctJyArIG51bTtcbiAgICAgIGJ1dHRvblJvdy5hcHBlbmRDaGlsZChzcGFjZXIpO1xuICAgIH1cblxuICAgIGJ1dHRvbnMuYm9sZCA9IG1ha2VCdXR0b24oJ3Btay1ib2xkLWJ1dHRvbicsIGdldFN0cmluZygnYm9sZCcpLCAnMHB4JywgYmluZENvbW1hbmQoJ2RvQm9sZCcpKTtcbiAgICBidXR0b25zLml0YWxpYyA9IG1ha2VCdXR0b24oJ3Btay1pdGFsaWMtYnV0dG9uJywgZ2V0U3RyaW5nKCdpdGFsaWMnKSwgJy0yMHB4JywgYmluZENvbW1hbmQoJ2RvSXRhbGljJykpO1xuICAgIG1ha2VTcGFjZXIoMSk7XG4gICAgYnV0dG9ucy5saW5rID0gbWFrZUJ1dHRvbigncG1rLWxpbmstYnV0dG9uJywgZ2V0U3RyaW5nKCdsaW5rJyksICctNDBweCcsIGJpbmRDb21tYW5kKGZ1bmN0aW9uIChjaHVuaywgcG9zdFByb2Nlc3NpbmcpIHtcbiAgICAgIHJldHVybiB0aGlzLmRvTGlua09ySW1hZ2UoY2h1bmssIHBvc3RQcm9jZXNzaW5nLCBmYWxzZSk7XG4gICAgfSkpO1xuICAgIGJ1dHRvbnMucXVvdGUgPSBtYWtlQnV0dG9uKCdwbWstcXVvdGUtYnV0dG9uJywgZ2V0U3RyaW5nKCdxdW90ZScpLCAnLTYwcHgnLCBiaW5kQ29tbWFuZCgnZG9CbG9ja3F1b3RlJykpO1xuICAgIGJ1dHRvbnMuY29kZSA9IG1ha2VCdXR0b24oJ3Btay1jb2RlLWJ1dHRvbicsIGdldFN0cmluZygnY29kZScpLCAnLTgwcHgnLCBiaW5kQ29tbWFuZCgnZG9Db2RlJykpO1xuICAgIGJ1dHRvbnMuaW1hZ2UgPSBtYWtlQnV0dG9uKCdwbWstaW1hZ2UtYnV0dG9uJywgZ2V0U3RyaW5nKCdpbWFnZScpLCAnLTEwMHB4JywgYmluZENvbW1hbmQoZnVuY3Rpb24gKGNodW5rLCBwb3N0UHJvY2Vzc2luZykge1xuICAgICAgcmV0dXJuIHRoaXMuZG9MaW5rT3JJbWFnZShjaHVuaywgcG9zdFByb2Nlc3NpbmcsIHRydWUpO1xuICAgIH0pKTtcbiAgICBtYWtlU3BhY2VyKDIpO1xuICAgIGJ1dHRvbnMub2xpc3QgPSBtYWtlQnV0dG9uKCdwbWstb2xpc3QtYnV0dG9uJywgZ2V0U3RyaW5nKCdvbGlzdCcpLCAnLTEyMHB4JywgYmluZENvbW1hbmQoZnVuY3Rpb24gKGNodW5rLCBwb3N0UHJvY2Vzc2luZykge1xuICAgICAgdGhpcy5kb0xpc3QoY2h1bmssIHBvc3RQcm9jZXNzaW5nLCB0cnVlKTtcbiAgICB9KSk7XG4gICAgYnV0dG9ucy51bGlzdCA9IG1ha2VCdXR0b24oJ3Btay11bGlzdC1idXR0b24nLCBnZXRTdHJpbmcoJ3VsaXN0JyksICctMTQwcHgnLCBiaW5kQ29tbWFuZChmdW5jdGlvbiAoY2h1bmssIHBvc3RQcm9jZXNzaW5nKSB7XG4gICAgICB0aGlzLmRvTGlzdChjaHVuaywgcG9zdFByb2Nlc3NpbmcsIGZhbHNlKTtcbiAgICB9KSk7XG4gICAgYnV0dG9ucy5oZWFkaW5nID0gbWFrZUJ1dHRvbigncG1rLWhlYWRpbmctYnV0dG9uJywgZ2V0U3RyaW5nKCdoZWFkaW5nJyksICctMTYwcHgnLCBiaW5kQ29tbWFuZCgnZG9IZWFkaW5nJykpO1xuICAgIGJ1dHRvbnMuaHIgPSBtYWtlQnV0dG9uKCdwbWstaHItYnV0dG9uJywgZ2V0U3RyaW5nKCdocicpLCAnLTE4MHB4JywgYmluZENvbW1hbmQoJ2RvSG9yaXpvbnRhbFJ1bGUnKSk7XG4gICAgbWFrZVNwYWNlcigzKTtcbiAgICBidXR0b25zLnVuZG8gPSBtYWtlQnV0dG9uKCdwbWstdW5kby1idXR0b24nLCBnZXRTdHJpbmcoJ3VuZG8nKSwgJy0yMDBweCcsIG51bGwpO1xuICAgIGJ1dHRvbnMudW5kby5leGVjdXRlID0gZnVuY3Rpb24gKG1hbmFnZXIpIHtcbiAgICAgIGlmIChtYW5hZ2VyKSB7XG4gICAgICAgIG1hbmFnZXIudW5kbygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgcmVkb1RpdGxlID0gZ2V0U3RyaW5nKHVhLmlzV2lkbm93cyA/ICdyZWRvJyA6ICdyZWRvbWFjJyk7XG5cbiAgICBidXR0b25zLnJlZG8gPSBtYWtlQnV0dG9uKCdwbWstcmVkby1idXR0b24nLCByZWRvVGl0bGUsICctMjIwcHgnLCBudWxsKTtcbiAgICBidXR0b25zLnJlZG8uZXhlY3V0ZSA9IGZ1bmN0aW9uIChtYW5hZ2VyKSB7XG4gICAgICBpZiAobWFuYWdlcikge1xuICAgICAgICBtYW5hZ2VyLnJlZG8oKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKGhlbHBPcHRpb25zKSB7XG4gICAgICB2YXIgaGVscEJ1dHRvbiA9IGMoJ2xpJyk7XG4gICAgICB2YXIgaGVscEJ1dHRvbkltYWdlID0gYygnc3BhbicpO1xuICAgICAgaGVscEJ1dHRvbi5hcHBlbmRDaGlsZChoZWxwQnV0dG9uSW1hZ2UpO1xuICAgICAgaGVscEJ1dHRvbi5jbGFzc05hbWUgPSAncG1rLWJ1dHRvbiBwbWstaGVscC1idXR0b24nO1xuICAgICAgaGVscEJ1dHRvbi5pZCA9ICdwbWstaGVscC1idXR0b24tJyArIHBvc3RmaXg7XG4gICAgICBoZWxwQnV0dG9uLlhTaGlmdCA9ICctMjQwcHgnO1xuICAgICAgaGVscEJ1dHRvbi5pc0hlbHAgPSB0cnVlO1xuICAgICAgaGVscEJ1dHRvbi5zdHlsZS5yaWdodCA9ICcwcHgnO1xuICAgICAgaGVscEJ1dHRvbi50aXRsZSA9IGdldFN0cmluZygnaGVscCcpO1xuICAgICAgaGVscEJ1dHRvbi5vbmNsaWNrID0gaGVscE9wdGlvbnMuaGFuZGxlcjtcblxuICAgICAgc2V0dXBCdXR0b24oaGVscEJ1dHRvbiwgdHJ1ZSk7XG4gICAgICBidXR0b25Sb3cuYXBwZW5kQ2hpbGQoaGVscEJ1dHRvbik7XG4gICAgICBidXR0b25zLmhlbHAgPSBoZWxwQnV0dG9uO1xuICAgIH1cblxuICAgIHNldFVuZG9SZWRvQnV0dG9uU3RhdGVzKCk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRVbmRvUmVkb0J1dHRvblN0YXRlcyAoKSB7XG4gICAgaWYgKHVuZG9NYW5hZ2VyKSB7XG4gICAgICBzZXR1cEJ1dHRvbihidXR0b25zLnVuZG8sIHVuZG9NYW5hZ2VyLmNhblVuZG8oKSk7XG4gICAgICBzZXR1cEJ1dHRvbihidXR0b25zLnJlZG8sIHVuZG9NYW5hZ2VyLmNhblJlZG8oKSk7XG4gICAgfVxuICB9O1xuXG4gIHRoaXMuc2V0VW5kb1JlZG9CdXR0b25TdGF0ZXMgPSBzZXRVbmRvUmVkb0J1dHRvblN0YXRlcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBVSU1hbmFnZXI7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdWEgPSByZXF1aXJlKCcuL3VhJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIFRleHRhcmVhU3RhdGUgPSByZXF1aXJlKCcuL1RleHRhcmVhU3RhdGUnKTtcblxuZnVuY3Rpb24gVW5kb01hbmFnZXIgKGNhbGxiYWNrLCBwYW5lbHMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgdW5kb1N0YWNrID0gW107XG4gIHZhciBzdGFja1B0ciA9IDA7XG4gIHZhciBtb2RlID0gJ25vbmUnO1xuICB2YXIgbGFzdFN0YXRlO1xuICB2YXIgdGltZXI7XG4gIHZhciBpbnB1dFN0YXRlO1xuXG4gIGZ1bmN0aW9uIHNldE1vZGUgKG5ld01vZGUsIG5vU2F2ZSkge1xuICAgIGlmIChtb2RlICE9IG5ld01vZGUpIHtcbiAgICAgIG1vZGUgPSBuZXdNb2RlO1xuICAgICAgaWYgKCFub1NhdmUpIHtcbiAgICAgICAgc2F2ZVN0YXRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCF1YS5pc0lFIHx8IG1vZGUgIT0gJ21vdmluZycpIHtcbiAgICAgIHRpbWVyID0gc2V0VGltZW91dChyZWZyZXNoU3RhdGUsIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbnB1dFN0YXRlID0gbnVsbDtcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gcmVmcmVzaFN0YXRlIChpc0luaXRpYWxTdGF0ZSkge1xuICAgIGlucHV0U3RhdGUgPSBuZXcgVGV4dGFyZWFTdGF0ZShwYW5lbHMsIGlzSW5pdGlhbFN0YXRlKTtcbiAgICB0aW1lciA9IHZvaWQgMDtcbiAgfVxuXG4gIHNlbGYuc2V0Q29tbWFuZE1vZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgbW9kZSA9ICdjb21tYW5kJztcbiAgICBzYXZlU3RhdGUoKTtcbiAgICB0aW1lciA9IHNldFRpbWVvdXQocmVmcmVzaFN0YXRlLCAwKTtcbiAgfTtcblxuICBzZWxmLmNhblVuZG8gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHN0YWNrUHRyID4gMTtcbiAgfTtcblxuICBzZWxmLmNhblJlZG8gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHVuZG9TdGFja1tzdGFja1B0ciArIDFdO1xuICB9O1xuXG4gIHNlbGYudW5kbyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoc2VsZi5jYW5VbmRvKCkpIHtcbiAgICAgIGlmIChsYXN0U3RhdGUpIHtcbiAgICAgICAgbGFzdFN0YXRlLnJlc3RvcmUoKTtcbiAgICAgICAgbGFzdFN0YXRlID0gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHVuZG9TdGFja1tzdGFja1B0cl0gPSBuZXcgVGV4dGFyZWFTdGF0ZShwYW5lbHMpO1xuICAgICAgICB1bmRvU3RhY2tbLS1zdGFja1B0cl0ucmVzdG9yZSgpO1xuXG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgbW9kZSA9ICdub25lJztcbiAgICBwYW5lbHMuaW5wdXQuZm9jdXMoKTtcbiAgICByZWZyZXNoU3RhdGUoKTtcbiAgfTtcblxuICBzZWxmLnJlZG8gPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHNlbGYuY2FuUmVkbygpKSB7XG4gICAgICB1bmRvU3RhY2tbKytzdGFja1B0cl0ucmVzdG9yZSgpO1xuXG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBtb2RlID0gJ25vbmUnO1xuICAgIHBhbmVscy5pbnB1dC5mb2N1cygpO1xuICAgIHJlZnJlc2hTdGF0ZSgpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHNhdmVTdGF0ZSAoKSB7XG4gICAgdmFyIGN1cnJTdGF0ZSA9IGlucHV0U3RhdGUgfHwgbmV3IFRleHRhcmVhU3RhdGUocGFuZWxzKTtcblxuICAgIGlmICghY3VyclN0YXRlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChtb2RlID09ICdtb3ZpbmcnKSB7XG4gICAgICBpZiAoIWxhc3RTdGF0ZSkge1xuICAgICAgICBsYXN0U3RhdGUgPSBjdXJyU3RhdGU7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChsYXN0U3RhdGUpIHtcbiAgICAgIGlmICh1bmRvU3RhY2tbc3RhY2tQdHIgLSAxXS50ZXh0ICE9IGxhc3RTdGF0ZS50ZXh0KSB7XG4gICAgICAgIHVuZG9TdGFja1tzdGFja1B0cisrXSA9IGxhc3RTdGF0ZTtcbiAgICAgIH1cbiAgICAgIGxhc3RTdGF0ZSA9IG51bGw7XG4gICAgfVxuICAgIHVuZG9TdGFja1tzdGFja1B0cisrXSA9IGN1cnJTdGF0ZTtcbiAgICB1bmRvU3RhY2tbc3RhY2tQdHIgKyAxXSA9IG51bGw7XG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHByZXZlbnRDdHJsWVogKGV2ZW50KSB7XG4gICAgdmFyIGtleUNvZGUgPSBldmVudC5jaGFyQ29kZSB8fCBldmVudC5rZXlDb2RlO1xuICAgIHZhciB5eiA9IGtleUNvZGUgPT0gODkgfHwga2V5Q29kZSA9PSA5MDtcbiAgICB2YXIgY3RybCA9IGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQubWV0YUtleTtcbiAgICBpZiAoY3RybCAmJiB5eikge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gaGFuZGxlQ3RybFlaIChldmVudCkge1xuICAgIHZhciBoYW5kbGVkID0gZmFsc2U7XG4gICAgdmFyIGtleUNvZGUgPSBldmVudC5jaGFyQ29kZSB8fCBldmVudC5rZXlDb2RlO1xuICAgIHZhciBrZXlDb2RlQ2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoa2V5Q29kZSk7XG5cbiAgICBpZiAoZXZlbnQuY3RybEtleSB8fCBldmVudC5tZXRhS2V5KSB7XG4gICAgICBzd2l0Y2ggKGtleUNvZGVDaGFyLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgY2FzZSAneSc6XG4gICAgICAgICAgc2VsZi5yZWRvKCk7XG4gICAgICAgICAgaGFuZGxlZCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAneic6XG4gICAgICAgICAgaWYgKCFldmVudC5zaGlmdEtleSkge1xuICAgICAgICAgICAgc2VsZi51bmRvKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc2VsZi5yZWRvKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGhhbmRsZWQgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChoYW5kbGVkKSB7XG4gICAgICBpZiAoZXZlbnQucHJldmVudERlZmF1bHQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICAgIGlmICh3aW5kb3cuZXZlbnQpIHtcbiAgICAgICAgd2luZG93LmV2ZW50LnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlTW9kZUNoYW5nZSAoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQuY3RybEtleSB8fCBldmVudC5tZXRhS2V5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGtleUNvZGUgPSBldmVudC5rZXlDb2RlO1xuXG4gICAgaWYgKChrZXlDb2RlID49IDMzICYmIGtleUNvZGUgPD0gNDApIHx8IChrZXlDb2RlID49IDYzMjMyICYmIGtleUNvZGUgPD0gNjMyMzUpKSB7XG4gICAgICBzZXRNb2RlKCdtb3ZpbmcnKTtcbiAgICB9IGVsc2UgaWYgKGtleUNvZGUgPT0gOCB8fCBrZXlDb2RlID09IDQ2IHx8IGtleUNvZGUgPT0gMTI3KSB7XG4gICAgICBzZXRNb2RlKCdkZWxldGluZycpO1xuICAgIH0gZWxzZSBpZiAoa2V5Q29kZSA9PSAxMykge1xuICAgICAgc2V0TW9kZSgnbmV3bGluZXMnKTtcbiAgICB9IGVsc2UgaWYgKGtleUNvZGUgPT0gMjcpIHtcbiAgICAgIHNldE1vZGUoJ2VzY2FwZScpO1xuICAgIH0gZWxzZSBpZiAoKGtleUNvZGUgPCAxNiB8fCBrZXlDb2RlID4gMjApICYmIGtleUNvZGUgIT0gOTEpIHtcbiAgICAgIHNldE1vZGUoJ3R5cGluZycpO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBzZXRFdmVudEhhbmRsZXJzICgpIHtcbiAgICB1dGlsLmFkZEV2ZW50KHBhbmVscy5pbnB1dCwgJ2tleXByZXNzJywgcHJldmVudEN0cmxZWik7XG4gICAgdXRpbC5hZGRFdmVudChwYW5lbHMuaW5wdXQsICdrZXlkb3duJywgaGFuZGxlQ3RybFlaKTtcbiAgICB1dGlsLmFkZEV2ZW50KHBhbmVscy5pbnB1dCwgJ2tleWRvd24nLCBoYW5kbGVNb2RlQ2hhbmdlKTtcbiAgICB1dGlsLmFkZEV2ZW50KHBhbmVscy5pbnB1dCwgJ21vdXNlZG93bicsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNldE1vZGUoJ21vdmluZycpO1xuICAgIH0pO1xuXG4gICAgcGFuZWxzLmlucHV0Lm9ucGFzdGUgPSBoYW5kbGVQYXN0ZTtcbiAgICBwYW5lbHMuaW5wdXQub25kcm9wID0gaGFuZGxlUGFzdGU7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVQYXN0ZSAoKSB7XG4gICAgaWYgKHVhLmlzSUUgfHwgKGlucHV0U3RhdGUgJiYgaW5wdXRTdGF0ZS50ZXh0ICE9IHBhbmVscy5pbnB1dC52YWx1ZSkpIHtcbiAgICAgIGlmICh0aW1lciA9PSB2b2lkIDApIHtcbiAgICAgICAgbW9kZSA9ICdwYXN0ZSc7XG4gICAgICAgIHNhdmVTdGF0ZSgpO1xuICAgICAgICByZWZyZXNoU3RhdGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpbml0ICgpIHtcbiAgICBzZXRFdmVudEhhbmRsZXJzKCk7XG4gICAgcmVmcmVzaFN0YXRlKHRydWUpO1xuICAgIHNhdmVTdGF0ZSgpO1xuICB9O1xuXG4gIGluaXQoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBVbmRvTWFuYWdlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gY29uZmlndXJlIChvcHRzKSB7XG4gIHZhciBvID0gb3B0cyB8fCB7fTtcbiAgaWYgKG8uaW1hZ2VVcGxvYWRzKSB7XG4gICAgaWYgKHR5cGVvZiBvLmltYWdlVXBsb2FkcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbmZpZ3VyZS5pbWFnZVVwbG9hZHMgPSB7XG4gICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgIHVybDogby5pbWFnZVVwbG9hZHNcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbmZpZ3VyZS5pbWFnZVVwbG9hZHMgPSBvLmltYWdlVXBsb2FkcztcbiAgICB9XG4gIH1cbiAgaWYgKG8ubWFya2Rvd24pIHtcbiAgICBjb25maWd1cmUubWFya2Rvd24gPSBvLm1hcmtkb3duO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29uZmlndXJlO1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZG9jID0gZ2xvYmFsLmRvY3VtZW50O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChlbGVtLCB0eXBlKSB7XG4gIHZhciBlO1xuXG4gIGlmIChkb2MuY3JlYXRlRXZlbnQpIHtcbiAgICBlID0gZG9jLmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJyk7XG4gICAgZS5pbml0RXZlbnQodHlwZSwgdHJ1ZSwgdHJ1ZSk7XG4gIH0gZWxzZSB7XG4gICAgZSA9IGRvYy5jcmVhdGVFdmVudE9iamVjdCgpO1xuICAgIGUuZXZlbnRUeXBlID0gdHlwZTtcbiAgfVxuICBlLmV2ZW50TmFtZSA9IHR5cGU7XG5cbiAgaWYgKGRvYy5jcmVhdGVFdmVudCkge1xuICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChlKTtcbiAgfSBlbHNlIHtcbiAgICBlbGVtZW50LmZpcmVFdmVudCgnb24nICsgZS5ldmVudFR5cGUsIGUpO1xuICB9XG59O1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNvbmZpZ3VyZSA9IHJlcXVpcmUoJy4vY29uZmlndXJlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRleHQpIHtcbiAgcmV0dXJuIGNvbmZpZ3VyZS5tYXJrZG93bih0ZXh0KTtcbn07XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQ7XG52YXIgdWkgPSByZXF1aXJlKCcuL3VpJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIGNvbmZpZ3VyZSA9IHJlcXVpcmUoJy4vY29uZmlndXJlJyk7XG52YXIgRWRpdG9yID0gcmVxdWlyZSgnLi9FZGl0b3InKTtcbnZhciBuZXh0SWQgPSAwO1xuXG5mdW5jdGlvbiBjb252ZXJ0VGFicyAoKSB7XG4gIHV0aWwuYWRkRXZlbnREZWxlZ2F0ZShkb2MsICdwbWstaW5wdXQnLCAna2V5ZG93bicsIHVpLmNvbnZlcnRUYWJzKTtcbn1cblxuZnVuY3Rpb24gcG9ueW1hcmsgKG8pIHtcbiAgdmFyIHBvc3RmaXggPSBuZXh0SWQrKztcbiAgdmFyIGVkaXRvcjtcblxuICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pICE9PSAnW29iamVjdCBPYmplY3RdJykge1xuICAgIG8gPSB7XG4gICAgICBidXR0b25zOiBvLFxuICAgICAgaW5wdXQ6IG8sXG4gICAgICBwcmV2aWV3OiBvXG4gICAgfTtcbiAgfVxuXG4gIG1hcmt1cChvLCBwb3N0Zml4KTtcblxuICBlZGl0b3IgPSBuZXcgRWRpdG9yKHBvc3RmaXgpO1xuICBlZGl0b3IucnVuKCk7XG5cbiAgcmV0dXJuIGVkaXRvci5hcGk7XG59XG5cbmZ1bmN0aW9uIG1hcmt1cCAobywgcG9zdGZpeCkge1xuICB2YXIgYnV0dG9uQmFyID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB2YXIgcHJldmlldyA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdmFyIGV4aXN0aW5nID0gby5pbnB1dCAmJiAvdGV4dGFyZWEvaS50ZXN0KG8uaW5wdXQudGFnTmFtZSk7XG4gIHZhciBpbnB1dDtcblxuICBpZiAoIWV4aXN0aW5nKSB7XG4gICAgaW5wdXQgPSBkb2MuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcbiAgICBpbnB1dC5jbGFzc05hbWUgPSAncG1rLWlucHV0JztcbiAgICBpbnB1dC5wbGFjZWhvbGRlciA9IG8ucGxhY2Vob2xkZXIgfHwgby5pbnB1dC5nZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJykgfHwgJyc7XG4gIH0gZWxzZSB7XG4gICAgaW5wdXQgPSBvLmlucHV0O1xuICB9XG4gIGlucHV0LmlkID0gJ3Btay1pbnB1dC0nICsgcG9zdGZpeDtcblxuICBidXR0b25CYXIuaWQgPSAncG1rLWJ1dHRvbnMtJyArIHBvc3RmaXg7XG4gIGJ1dHRvbkJhci5jbGFzc05hbWUgPSAncG1rLWJ1dHRvbnMnO1xuICBwcmV2aWV3LmlkID0gJ3Btay1wcmV2aWV3LScgKyBwb3N0Zml4O1xuICBwcmV2aWV3LmNsYXNzTmFtZSA9ICdwbWstcHJldmlldyc7XG5cbiAgby5idXR0b25zLmFwcGVuZENoaWxkKGJ1dHRvbkJhcik7XG5cbiAgaWYgKCFleGlzdGluZykge1xuICAgIG8uaW5wdXQuYXBwZW5kQ2hpbGQoaW5wdXQpO1xuICB9XG5cbiAgby5wcmV2aWV3LmFwcGVuZENoaWxkKHByZXZpZXcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBvbnltYXJrO1xuXG5wb255bWFyay5FZGl0b3IgPSBFZGl0b3I7XG5wb255bWFyay5jb252ZXJ0VGFicyA9IGNvbnZlcnRUYWJzO1xucG9ueW1hcmsuY29uZmlndXJlID0gY29uZmlndXJlO1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIGRvYyA9IGdsb2JhbC5kb2N1bWVudDtcblxuZnVuY3Rpb24gZ2V0VG9wIChlbGVtLCBpc0lubmVyKSB7XG4gIHZhciByZXN1bHQgPSBlbGVtLm9mZnNldFRvcDtcbiAgaWYgKCFpc0lubmVyKSB7XG4gICAgd2hpbGUgKGVsZW0gPSBlbGVtLm9mZnNldFBhcmVudCkge1xuICAgICAgcmVzdWx0ICs9IGVsZW0ub2Zmc2V0VG9wO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuZnVuY3Rpb24gZ2V0SGVpZ2h0IChlbGVtKSB7XG4gIHJldHVybiBlbGVtLm9mZnNldEhlaWdodCB8fCBlbGVtLnNjcm9sbEhlaWdodDtcbn07XG5cbmZ1bmN0aW9uIGdldFdpZHRoIChlbGVtKSB7XG4gIHJldHVybiBlbGVtLm9mZnNldFdpZHRoIHx8IGVsZW0uc2Nyb2xsV2lkdGg7XG59O1xuXG5mdW5jdGlvbiBnZXRQYWdlU2l6ZSAoKSB7XG4gIHZhciBzY3JvbGxXaWR0aCwgc2Nyb2xsSGVpZ2h0O1xuICB2YXIgaW5uZXJXaWR0aCwgaW5uZXJIZWlnaHQ7XG5cbiAgaWYgKHNlbGYuaW5uZXJIZWlnaHQgJiYgc2VsZi5zY3JvbGxNYXhZKSB7XG4gICAgc2Nyb2xsV2lkdGggPSBkb2MuYm9keS5zY3JvbGxXaWR0aDtcbiAgICBzY3JvbGxIZWlnaHQgPSBzZWxmLmlubmVySGVpZ2h0ICsgc2VsZi5zY3JvbGxNYXhZO1xuICB9IGVsc2UgaWYgKGRvYy5ib2R5LnNjcm9sbEhlaWdodCA+IGRvYy5ib2R5Lm9mZnNldEhlaWdodCkge1xuICAgIHNjcm9sbFdpZHRoID0gZG9jLmJvZHkuc2Nyb2xsV2lkdGg7XG4gICAgc2Nyb2xsSGVpZ2h0ID0gZG9jLmJvZHkuc2Nyb2xsSGVpZ2h0O1xuICB9IGVsc2Uge1xuICAgIHNjcm9sbFdpZHRoID0gZG9jLmJvZHkub2Zmc2V0V2lkdGg7XG4gICAgc2Nyb2xsSGVpZ2h0ID0gZG9jLmJvZHkub2Zmc2V0SGVpZ2h0O1xuICB9XG5cbiAgaWYgKHNlbGYuaW5uZXJIZWlnaHQpIHtcbiAgICBpbm5lcldpZHRoID0gc2VsZi5pbm5lcldpZHRoO1xuICAgIGlubmVySGVpZ2h0ID0gc2VsZi5pbm5lckhlaWdodDtcbiAgfSBlbHNlIGlmIChkb2MuZG9jdW1lbnRFbGVtZW50ICYmIGRvYy5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0KSB7XG4gICAgaW5uZXJXaWR0aCA9IGRvYy5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgaW5uZXJIZWlnaHQgPSBkb2MuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDtcbiAgfSBlbHNlIGlmIChkb2MuYm9keSkge1xuICAgIGlubmVyV2lkdGggPSBkb2MuYm9keS5jbGllbnRXaWR0aDtcbiAgICBpbm5lckhlaWdodCA9IGRvYy5ib2R5LmNsaWVudEhlaWdodDtcbiAgfVxuXG4gIHZhciBtYXhXaWR0aCA9IE1hdGgubWF4KHNjcm9sbFdpZHRoLCBpbm5lcldpZHRoKTtcbiAgdmFyIG1heEhlaWdodCA9IE1hdGgubWF4KHNjcm9sbEhlaWdodCwgaW5uZXJIZWlnaHQpO1xuICByZXR1cm4gW21heFdpZHRoLCBtYXhIZWlnaHQsIGlubmVyV2lkdGgsIGlubmVySGVpZ2h0XTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRUb3A6IGdldFRvcCxcbiAgZ2V0SGVpZ2h0OiBnZXRIZWlnaHQsXG4gIGdldFdpZHRoOiBnZXRXaWR0aCxcbiAgZ2V0UGFnZVNpemU6IGdldFBhZ2VTaXplXG59O1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHhociA9IHJlcXVpcmUoJ3hocicpO1xudmFyIHJhZiA9IHJlcXVpcmUoJ3JhZicpO1xudmFyIGNvbmZpZ3VyZSA9IHJlcXVpcmUoJy4vY29uZmlndXJlJyk7XG52YXIgcHJvbXB0TGluayA9IHJlcXVpcmUoJy4vcHJvbXB0TGluaycpO1xudmFyIHByb21wdFJlbmRlciA9IHJlcXVpcmUoJy4vcHJvbXB0UmVuZGVyJyk7XG52YXIgZmlyZUV2ZW50ID0gcmVxdWlyZSgnLi9maXJlRXZlbnQnKTtcbnZhciBjYWNoZTtcblxuZnVuY3Rpb24gZHJhdyAoY2IpIHtcbiAgaWYgKCFjYWNoZSkge1xuICAgIGNhY2hlID0gcHJvbXB0UmVuZGVyKHtcbiAgICAgIGlkOiAncG1rLWltYWdlLXByb21wdCcsXG4gICAgICB0aXRsZTogJ0luc2VydCBJbWFnZScsXG4gICAgICBkZXNjcmlwdGlvbjogJ1R5cGUgb3IgcGFzdGUgdGhlIHVybCB0byB5b3VyIGltYWdlJyxcbiAgICAgIHBsYWNlaG9sZGVyOiAnaHR0cDovL2V4YW1wbGUuY29tL3B1YmxpYy9kb2dlLnBuZyBcIm9wdGlvbmFsIHRpdGxlXCInXG4gICAgfSk7XG4gICAgaW5pdChjYWNoZSwgY2IpO1xuICB9XG4gIGlmIChjYWNoZS51cCkge1xuICAgIGNhY2hlLnVwLndhcm5pbmcuY2xhc3NMaXN0LnJlbW92ZSgncG1rLXByb21wdC1lcnJvci1zaG93Jyk7XG4gICAgY2FjaGUudXAuZmFpbGVkLmNsYXNzTGlzdC5yZW1vdmUoJ3Btay1wcm9tcHQtZXJyb3Itc2hvdycpO1xuICB9XG4gIGNhY2hlLmlucHV0LnZhbHVlID0gJyc7XG4gIGNhY2hlLmRpYWxvZy5jbGFzc0xpc3QuYWRkKCdwbWstcHJvbXB0LW9wZW4nKTtcbiAgcmFmKGZvY3VzKTtcbiAgcmV0dXJuIGNhY2hlLmRpYWxvZztcbn1cblxuZnVuY3Rpb24gZm9jdXMgKCkge1xuICBjYWNoZS5pbnB1dC5mb2N1cygpO1xufVxuXG5mdW5jdGlvbiBpbml0IChkb20sIGNiKSB7XG4gIHByb21wdExpbmsuaW5pdChkb20sIGNiKTtcblxuICBpZiAoY29uZmlndXJlLmltYWdlVXBsb2Fkcykge1xuICAgIGFycmFuZ2VJbWFnZVVwbG9hZChkb20sIGNiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhcnJhbmdlSW1hZ2VVcGxvYWQgKGRvbSwgY2IpIHtcbiAgdmFyIHVwID0gcHJvbXB0UmVuZGVyLnVwbG9hZHMoZG9tKTtcbiAgdmFyIGRyYWdDbGFzcyA9ICdwbWstcHJvbXB0LXVwbG9hZC1kcmFnZ2luZyc7XG5cbiAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW50ZXInLCBkcmFnZ2luZyk7XG4gIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VuZCcsIGRyYWdzdG9wKTtcblxuICB1cC5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBoYW5kbGVDaGFuZ2UsIGZhbHNlKTtcbiAgdXAudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgaGFuZGxlRHJhZ092ZXIsIGZhbHNlKTtcbiAgdXAudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBoYW5kbGVGaWxlU2VsZWN0LCBmYWxzZSk7XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2hhbmdlIChlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZ28oZS50YXJnZXQuZmlsZXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlRHJhZ092ZXIgKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gJ2NvcHknO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlRmlsZVNlbGVjdChlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZ28oZS5kYXRhVHJhbnNmZXIuZmlsZXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gdmFsaWQgKGZpbGVzKSB7XG4gICAgdmFyIG1pbWUgPSAvXmltYWdlXFwvL2ksIGksIGZpbGU7XG5cbiAgICB1cC53YXJuaW5nLmNsYXNzTGlzdC5yZW1vdmUoJ3Btay1wcm9tcHQtZXJyb3Itc2hvdycpO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBmaWxlID0gZmlsZXNbaV07XG5cbiAgICAgIGlmIChtaW1lLnRlc3QoZmlsZS50eXBlKSkge1xuICAgICAgICByZXR1cm4gZmlsZTtcbiAgICAgIH1cbiAgICB9XG4gICAgd2FybigpO1xuICB9XG5cbiAgZnVuY3Rpb24gd2FybiAobWVzc2FnZSkge1xuICAgIHVwLndhcm5pbmcuY2xhc3NMaXN0LmFkZCgncG1rLXByb21wdC1lcnJvci1zaG93Jyk7XG4gIH1cblxuICBmdW5jdGlvbiBkcmFnZ2luZyAoKSB7XG4gICAgdXAudXBsb2FkLmNsYXNzTGlzdC5hZGQoZHJhZ0NsYXNzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRyYWdzdG9wICgpIHtcbiAgICB1cC51cGxvYWQuY2xhc3NMaXN0LnJlbW92ZShkcmFnQ2xhc3MpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xvc2UgKCkge1xuICAgIGNhY2hlLmRpYWxvZy5jbGFzc0xpc3QucmVtb3ZlKCdwbWstcHJvbXB0LW9wZW4nKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdvIChmaWxlcykge1xuICAgIHZhciBmaWxlID0gdmFsaWQoZmlsZXMpO1xuICAgIGlmICghZmlsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgZm9ybSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdtdWx0aXBhcnQvZm9ybS1kYXRhJyxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgIH0sXG4gICAgICBtZXRob2Q6IGNvbmZpZ3VyZS5pbWFnZVVwbG9hZHMubWV0aG9kLFxuICAgICAgdXJsOiBjb25maWd1cmUuaW1hZ2VVcGxvYWRzLnVybCxcbiAgICAgIGJvZHk6IGZvcm1cbiAgICB9O1xuICAgIGZvcm0uYXBwZW5kKCdpbWFnZScsIGZpbGUsIGZpbGUubmFtZSk7XG4gICAgdXAudXBsb2FkLmNsYXNzTGlzdC5hZGQoJ3Btay1wcm9tcHQtdXBsb2FkaW5nJyk7XG4gICAgeGhyKG9wdGlvbnMsIGRvbmUpO1xuXG4gICAgZnVuY3Rpb24gZG9uZSAoZXJyLCB4aHIsIGJvZHkpIHtcbiAgICAgIHVwLnVwbG9hZC5jbGFzc0xpc3QucmVtb3ZlKCdwbWstcHJvbXB0LXVwbG9hZGluZycpO1xuICAgICAgaWYgKGVycikge1xuICAgICAgICB1cC5mYWlsZWQuY2xhc3NMaXN0LmFkZCgncG1rLXByb21wdC1lcnJvci1zaG93Jyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBqc29uID0gSlNPTi5wYXJzZShib2R5KTtcbiAgICAgIGRvbS5pbnB1dC52YWx1ZSA9IGpzb24udXJsICsgJyBcIicgKyBqc29uLmFsdCArICdcIic7XG4gICAgICBjbG9zZSgpO1xuICAgICAgY2IoZG9tLmlucHV0LnZhbHVlKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGRyYXc6IGRyYXdcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciByYWYgPSByZXF1aXJlKCdyYWYnKTtcbnZhciBwcm9tcHRSZW5kZXIgPSByZXF1aXJlKCcuL3Byb21wdFJlbmRlcicpO1xudmFyIGNhY2hlO1xuXG5mdW5jdGlvbiBkcmF3IChjYikge1xuICBpZiAoIWNhY2hlKSB7XG4gICAgY2FjaGUgPSBwcm9tcHRSZW5kZXIoe1xuICAgICAgaWQ6ICdwbWstbGluay1wcm9tcHQnLFxuICAgICAgdGl0bGU6ICdJbnNlcnQgTGluaycsXG4gICAgICBkZXNjcmlwdGlvbjogJ1R5cGUgb3IgcGFzdGUgdGhlIHVybCB0byB5b3VyIGxpbmsnLFxuICAgICAgcGxhY2Vob2xkZXI6ICdodHRwOi8vZXhhbXBsZS5jb20vIFwib3B0aW9uYWwgdGl0bGVcIidcbiAgICB9KTtcbiAgICBpbml0KGNhY2hlLCBjYik7XG4gIH1cbiAgY2FjaGUuaW5wdXQudmFsdWUgPSAnJztcbiAgY2FjaGUuZGlhbG9nLmNsYXNzTGlzdC5hZGQoJ3Btay1wcm9tcHQtb3BlbicpO1xuICByYWYoZm9jdXMpO1xuICByZXR1cm4gY2FjaGUuZGlhbG9nO1xufVxuXG5mdW5jdGlvbiBmb2N1cyAoKSB7XG4gIGNhY2hlLmlucHV0LmZvY3VzKCk7XG59XG5cbmZ1bmN0aW9uIGluaXQgKGRvbSwgY2IpIHtcbiAgZG9tLmNhbmNlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlKTtcbiAgZG9tLmNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2UpO1xuICBkb20ub2suYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvayk7XG5cbiAgZG9tLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIga2V5ID0gZS53aGljaCB8fCBlLmtleUNvZGU7XG4gICAgaWYgKGtleSA9PT0gMTMpIHtcbiAgICAgIG9rKCk7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9KTtcblxuICBmdW5jdGlvbiBvayAoKSB7XG4gICAgY2xvc2UoKTtcbiAgICBjYihkb20uaW5wdXQudmFsdWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xvc2UgKCkge1xuICAgIGRvbS5kaWFsb2cuY2xhc3NMaXN0LnJlbW92ZSgncG1rLXByb21wdC1vcGVuJyk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGRyYXc6IGRyYXcsXG4gIGluaXQ6IGluaXRcbn07XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQ7XG52YXIgYWMgPSAnYXBwZW5kQ2hpbGQnO1xuXG5mdW5jdGlvbiBlICh0eXBlLCBjbHMsIHRleHQpIHtcbiAgdmFyIGVsZW0gPSBkb2MuY3JlYXRlRWxlbWVudCh0eXBlKTtcbiAgZWxlbS5jbGFzc05hbWUgPSBjbHM7XG4gIGlmICh0ZXh0KSB7XG4gICAgZWxlbS5pbm5lclRleHQgPSB0ZXh0O1xuICB9XG4gIHJldHVybiBlbGVtO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gIHZhciBkb20gPSB7XG4gICAgZGlhbG9nOiBlKCdhcnRpY2xlJywgJ3Btay1wcm9tcHQgJyArIG9wdHMuaWQpLFxuICAgIGNsb3NlOiBlKCdhJywgJ3Btay1wcm9tcHQtY2xvc2UnKSxcbiAgICBoZWFkZXI6IGUoJ2hlYWRlcicsICdwbWstcHJvbXB0LWhlYWRlcicpLFxuICAgIGgxOiBlKCdoMScsICdwbWstcHJvbXB0LXRpdGxlJywgb3B0cy50aXRsZSksXG4gICAgc2VjdGlvbjogZSgnc2VjdGlvbicsICdwbWstcHJvbXB0LWJvZHknKSxcbiAgICBkZXNjOiBlKCdwJywgJ3Btay1wcm9tcHQtZGVzY3JpcHRpb24nLCBvcHRzLmRlc2NyaXB0aW9uKSxcbiAgICBpbnB1dDogZSgnaW5wdXQnLCAncG1rLXByb21wdC1pbnB1dCcpLFxuICAgIGNhbmNlbDogZSgnYScsICdwbWstcHJvbXB0LWNhbmNlbCcsICdDYW5jZWwnKSxcbiAgICBvazogZSgnYnV0dG9uJywgJ3Btay1wcm9tcHQtb2snLCAnT2snKSxcbiAgICBmb290ZXI6IGUoJ2Zvb3RlcicsICdwbWstcHJvbXB0LWJ1dHRvbnMnKVxuICB9O1xuICBkb20uaGVhZGVyW2FjXShkb20uaDEpO1xuICBkb20uc2VjdGlvblthY10oZG9tLmRlc2MpO1xuICBkb20uc2VjdGlvblthY10oZG9tLmlucHV0KTtcbiAgZG9tLmlucHV0LnBsYWNlaG9sZGVyID0gb3B0cy5wbGFjZWhvbGRlcjtcbiAgZG9tLmZvb3RlclthY10oZG9tLmNhbmNlbCk7XG4gIGRvbS5mb290ZXJbYWNdKGRvbS5vayk7XG4gIGRvbS5kaWFsb2dbYWNdKGRvbS5jbG9zZSk7XG4gIGRvbS5kaWFsb2dbYWNdKGRvbS5oZWFkZXIpO1xuICBkb20uZGlhbG9nW2FjXShkb20uc2VjdGlvbik7XG4gIGRvbS5kaWFsb2dbYWNdKGRvbS5mb290ZXIpO1xuICBkb2MuYm9keVthY10oZG9tLmRpYWxvZyk7XG4gIHJldHVybiBkb207XG59O1xuXG5tb2R1bGUuZXhwb3J0cy51cGxvYWRzID0gZnVuY3Rpb24gKGRvbSkge1xuICB2YXIgZnVwID0gJ3Btay1wcm9tcHQtZmlsZXVwbG9hZCc7XG4gIHZhciB1cCA9IHtcbiAgICBhcmVhOiBlKCdzZWN0aW9uJywgJ3Btay1wcm9tcHQtdXBsb2FkLWFyZWEnKSxcbiAgICB3YXJuaW5nOiBlKCdwJywgJ3Btay1wcm9tcHQtZXJyb3IgcG1rLXdhcm5pbmcnLCAnT25seSBHSUYsIEpQRUcgYW5kIFBORyBpbWFnZXMgYXJlIGFsbG93ZWQnKSxcbiAgICBmYWlsZWQ6IGUoJ3AnLCAncG1rLXByb21wdC1lcnJvciBwbWstZmFpbGVkJywgJ1VwbG9hZCBmYWlsZWQnKSxcbiAgICB1cGxvYWQ6IGUoJ2J1dHRvbicsICdwbWstcHJvbXB0LXVwbG9hZCcpLFxuICAgIHVwbG9hZGluZzogZSgnc3BhbicsICdwbWstcHJvbXB0LXByb2dyZXNzJywgJ1VwbG9hZGluZyBmaWxlLi4uJyksXG4gICAgZHJvcDogZSgnc3BhbicsICdwbWstcHJvbXB0LWRyb3AnLCAnRHJvcCBoZXJlIHRvIGJlZ2luIHVwbG9hZCcpLFxuICAgIGJyb3dzZTogZSgnc3BhbicsICdwbWstcHJvbXB0LWJyb3dzZScsICdCcm93c2UuLi4nKSxcbiAgICBkcmFnZHJvcDogZSgnc3BhbicsICdwbWstcHJvbXB0LWRyYWdkcm9wJywgJ1lvdSBjYW4gYWxzbyBkcm9wIGZpbGVzIGhlcmUnKSxcbiAgICBpbnB1dDogZSgnaW5wdXQnLCBmdXApXG4gIH07XG4gIHVwLmFyZWFbYWNdKHVwLndhcm5pbmcpO1xuICB1cC5hcmVhW2FjXSh1cC5mYWlsZWQpO1xuICB1cC5hcmVhW2FjXSh1cC51cGxvYWQpO1xuICB1cC51cGxvYWRbYWNdKHVwLmRyb3ApO1xuICB1cC51cGxvYWRbYWNdKHVwLnVwbG9hZGluZyk7XG4gIHVwLnVwbG9hZFthY10odXAuYnJvd3NlKTtcbiAgdXAudXBsb2FkW2FjXSh1cC5kcmFnZHJvcCk7XG4gIHVwLnVwbG9hZFthY10odXAuaW5wdXQpO1xuICB1cC5pbnB1dC5pZCA9IGZ1cDtcbiAgdXAuaW5wdXQudHlwZSA9ICdmaWxlJztcbiAgZG9tLnNlY3Rpb25bYWNdKHVwLmFyZWEpO1xuICBkb20udXAgPSB1cDtcbiAgcmV0dXJuIHVwO1xufTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBuYXYgPSB3aW5kb3cubmF2aWdhdG9yO1xudmFyIHVhID0gbmF2LnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpO1xudmFyIHVhU25pZmZlciA9IHtcbiAgaXNJRTogL21zaWUvLnRlc3QodWEpLFxuICBpc0lFXzVvcjY6IC9tc2llIFs1Nl0vLnRlc3QodWEpLFxuICBpc09wZXJhOiAvb3BlcmEvLnRlc3QodWEpLFxuICBpc0Nocm9tZTogL2Nocm9tZS8udGVzdCh1YSksXG4gIGlzV2luZG93czogL3dpbi9pLnRlc3QobmF2LnBsYXRmb3JtKVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB1YVNuaWZmZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBwcm9tcHRMaW5rID0gcmVxdWlyZSgnLi9wcm9tcHRMaW5rJyk7XG52YXIgcHJvbXB0SW1hZ2UgPSByZXF1aXJlKCcuL3Byb21wdEltYWdlJyk7XG52YXIgbGlua3M7XG52YXIgaW1hZ2VzO1xuXG5mdW5jdGlvbiBwcm9tcHQgKHR5cGUsIGNiKSB7XG4gIGlmIChsaW5rcykge1xuICAgIGxpbmtzLmNsYXNzTGlzdC5yZW1vdmUoJ3Btay1wcm9tcHQtb3BlbicpO1xuICB9XG4gIGlmIChpbWFnZXMpIHtcbiAgICBpbWFnZXMuY2xhc3NMaXN0LnJlbW92ZSgncG1rLXByb21wdC1vcGVuJyk7XG4gIH1cbiAgaWYgKHR5cGUgPT09ICdsaW5rJykge1xuICAgIGxpbmtzID0gcHJvbXB0TGluay5kcmF3KHByZXByb2Nlc3MpO1xuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdpbWFnZScpIHtcbiAgICBpbWFnZXMgPSBwcm9tcHRJbWFnZS5kcmF3KHByZXByb2Nlc3MpO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJlcHJvY2VzcyAodGV4dCkge1xuICAgIGlmICh0ZXh0ICE9PSBudWxsKXsgLy8gRml4ZXMgY29tbW9uIHBhc3RpbmcgZXJyb3JzLlxuICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSgvXmh0dHA6XFwvXFwvKGh0dHBzP3xmdHApOlxcL1xcLy8sICckMTovLycpO1xuICAgICAgaWYgKHRleHRbMF0gIT09ICcvJyAmJiAhL14oPzpodHRwcz98ZnRwKTpcXC9cXC8vLnRlc3QodGV4dCkpe1xuICAgICAgICB0ZXh0ID0gJ2h0dHA6Ly8nICsgdGV4dDtcbiAgICAgIH1cbiAgICB9XG4gICAgY2IodGV4dCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY29udmVydFRhYnMgKGUpIHtcbiAgdmFyIHRhID0gZS50YXJnZXQ7XG4gIHZhciBrZXlDb2RlID0gZS5jaGFyQ29kZSB8fCBlLmtleUNvZGU7XG4gIGlmIChrZXlDb2RlICE9PSA5KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGUucHJldmVudERlZmF1bHQoKTtcblxuICB2YXIgc3RhcnQgPSB0YS5zZWxlY3Rpb25TdGFydDtcbiAgdmFyIGVuZCA9IHRhLnNlbGVjdGlvbkVuZDtcbiAgdmFyIHZhbCA9IHRhLnZhbHVlO1xuICB2YXIgbGVmdCA9IHZhbC5zdWJzdHJpbmcoMCwgc3RhcnQpO1xuICB2YXIgcmlnaHQgPSB2YWwuc3Vic3RyaW5nKGVuZCk7XG5cbiAgdGEudmFsdWUgPSBsZWZ0ICsgJyAgICAnICsgcmlnaHQ7XG4gIHRhLnNlbGVjdGlvblN0YXJ0ID0gdGEuc2VsZWN0aW9uRW5kID0gc3RhcnQgKyA0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcHJvbXB0OiBwcm9tcHQsXG4gIGNvbnZlcnRUYWJzOiBjb252ZXJ0VGFic1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gaXNWaXNpYmxlIChlbGVtKSB7XG4gIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkge1xuICAgIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKCdkaXNwbGF5JykgIT09ICdub25lJztcbiAgfSBlbHNlIGlmIChlbGVtLmN1cnJlbnRTdHlsZSkge1xuICAgIHJldHVybiBlbGVtLmN1cnJlbnRTdHlsZS5kaXNwbGF5ICE9PSAnbm9uZSc7XG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkRXZlbnQgKGVsZW0sIHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmIChlbGVtLmF0dGFjaEV2ZW50KSB7XG4gICAgZWxlbS5hdHRhY2hFdmVudCgnb24nICsgdHlwZSwgbGlzdGVuZXIpO1xuICB9IGVsc2Uge1xuICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgZmFsc2UpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFkZEV2ZW50RGVsZWdhdGUgKGVsZW0sIGNsYXNzTmFtZSwgdHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cCgnXFxiJyArIGNsYXNzTmFtZSArICdcXGInKTtcblxuICBpZiAoZWxlbS5hdHRhY2hFdmVudCkge1xuICAgIGVsZW0uYXR0YWNoRXZlbnQoJ29uJyArIHR5cGUsIGRlbGVnYXRvcik7XG4gIH0gZWxzZSB7XG4gICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGRlbGVnYXRvciwgZmFsc2UpO1xuICB9XG4gIGZ1bmN0aW9uIGRlbGVnYXRvciAoZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICB2YXIgZWxlbSA9IGUudGFyZ2V0O1xuICAgIGlmIChlbGVtLmNsYXNzTGlzdCkge1xuICAgICAgaWYgKGVsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkpIHtcbiAgICAgICAgZmlyZSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZWxlbS5jbGFzc05hbWUubWF0Y2gocmVnZXgpKSB7XG4gICAgICAgIGZpcmUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaXJlICgpIHtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmVFdmVudCAoZWxlbSwgZXZlbnQsIGxpc3RlbmVyKSB7XG4gIGlmIChlbGVtLmRldGFjaEV2ZW50KSB7XG4gICAgZWxlbS5kZXRhY2hFdmVudCgnb24nICsgZXZlbnQsIGxpc3RlbmVyKTtcbiAgfSBlbHNlIHtcbiAgICBlbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyLCBmYWxzZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZml4RW9sQ2hhcnMgKHRleHQpIHtcbiAgdGV4dCA9IHRleHQucmVwbGFjZSgvXFxyXFxuL2csICdcXG4nKTtcbiAgdGV4dCA9IHRleHQucmVwbGFjZSgvXFxyL2csICdcXG4nKTtcbiAgcmV0dXJuIHRleHQ7XG59XG5cbmZ1bmN0aW9uIGV4dGVuZFJlZ0V4cCAocmVnZXgsIHByZSwgcG9zdCkge1xuICBpZiAocHJlID09PSBudWxsIHx8IHByZSA9PT0gdm9pZCAwKSB7XG4gICAgcHJlID0gJyc7XG4gIH1cbiAgaWYgKHBvc3QgPT09IG51bGwgfHwgcG9zdCA9PT0gdm9pZCAwKSB7XG4gICAgcG9zdCA9ICcnO1xuICB9XG5cbiAgdmFyIHBhdHRlcm4gPSByZWdleC50b1N0cmluZygpO1xuICB2YXIgZmxhZ3M7XG5cbiAgcGF0dGVybiA9IHBhdHRlcm4ucmVwbGFjZSgvXFwvKFtnaW1dKikkLywgZnVuY3Rpb24gKHdob2xlTWF0Y2gsIGZsYWdzUGFydCkge1xuICAgIGZsYWdzID0gZmxhZ3NQYXJ0O1xuICAgIHJldHVybiAnJztcbiAgfSk7XG4gIHBhdHRlcm4gPSBwYXR0ZXJuLnJlcGxhY2UoLyheXFwvfFxcLyQpL2csICcnKTtcbiAgcGF0dGVybiA9IHByZSArIHBhdHRlcm4gKyBwb3N0O1xuICByZXR1cm4gbmV3IFJlZ0V4cChwYXR0ZXJuLCBmbGFncyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc1Zpc2libGU6IGlzVmlzaWJsZSxcbiAgYWRkRXZlbnQ6IGFkZEV2ZW50LFxuICBhZGRFdmVudERlbGVnYXRlOiBhZGRFdmVudERlbGVnYXRlLFxuICByZW1vdmVFdmVudDogcmVtb3ZlRXZlbnQsXG4gIGZpeEVvbENoYXJzOiBmaXhFb2xDaGFycyxcbiAgZXh0ZW5kUmVnRXhwOiBleHRlbmRSZWdFeHBcbn07XG4iXX0=
(20)
});
