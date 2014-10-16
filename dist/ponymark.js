/**
 * ponymark - Next-generation PageDown fork
 * @version v3.1.2
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
      var ctx = this;
      var args = atoa(arguments);
      var type = args.shift();
      var et = evt[type];
      if (type === 'error' && opts.throws !== false && !et) { throw args.length === 1 ? args[0] : args; }
      if (!et) { return thing; }
      evt[type] = et.filter(function emitter (listen) {
        if (opts.async) { debounce(listen, args, ctx); } else { listen.apply(ctx, args); }
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
  , isNative = true

for(var i = 0; i < vendors.length && !raf; i++) {
  raf = global[vendors[i] + 'Request' + suffix]
  caf = global[vendors[i] + 'Cancel' + suffix]
      || global[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  isNative = false

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
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last)
            } catch(e) {
              setTimeout(function() { throw e }, 0)
            }
          }
        }
      }, Math.round(next))
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

module.exports = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  if(!isNative) {
    return raf.call(global, fn)
  }
  return raf.call(global, function() {
    try{
      fn.apply(this, arguments)
    } catch(e) {
      setTimeout(function() { throw e }, 0)
    }
  })
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
var parseHeaders = _dereq_('parse-headers')

var messages = {
    "0": "Internal XMLHttpRequest Error",
    "4": "4xx Client Error",
    "5": "5xx Server Error"
}

var XHR = window.XMLHttpRequest || noop
var XDR = "withCredentials" in (new XHR()) ? XHR : window.XDomainRequest

module.exports = createXHR

function createXHR(options, callback) {
    if (typeof options === "string") {
        options = { uri: options }
    }

    options = options || {}
    callback = once(callback)

    var xhr = options.xhr || null

    if (!xhr) {
        if (options.cors || options.useXDR) {
            xhr = new XDR()
        }else{
            xhr = new XHR()
        }
    }

    var uri = xhr.url = options.uri || options.url
    var method = xhr.method = options.method || "GET"
    var body = options.body || options.data
    var headers = xhr.headers = options.headers || {}
    var sync = !!options.sync
    var isJson = false
    var key
    var load = options.response ? loadResponse : loadXhr

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
                                    //backward compatibility
    if (options.withCredentials || (options.cors && options.withCredentials !== false)) {
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
    } else if (options.headers) {
        throw new Error("Headers cannot be set on an XDomainRequest object")
    }

    if ("responseType" in options) {
        xhr.responseType = options.responseType
    }
    
    if ("beforeSend" in options && 
        typeof options.beforeSend === "function"
    ) {
        options.beforeSend(xhr)
    }

    xhr.send(body)

    return xhr

    function readystatechange() {
        if (xhr.readyState === 4) {
            load()
        }
    }

    function getBody() {
        // Chrome with requestType=blob throws errors arround when even testing access to responseText
        var body = null

        if (xhr.response) {
            body = xhr.response
        } else if (xhr.responseType === 'text' || !xhr.responseType) {
            body = xhr.responseText || xhr.responseXML
        }

        if (isJson) {
            try {
                body = JSON.parse(body)
            } catch (e) {}
        }

        return body
    }

    function getStatusCode() {
        return xhr.status === 1223 ? 204 : xhr.status
    }

    // if we're getting a none-ok statusCode, build & return an error
    function errorFromStatusCode(status) {
        var error = null
        if (status === 0 || (status >= 400 && status < 600)) {
            var message = (typeof body === "string" ? body : false) ||
                messages[String(status).charAt(0)]
            error = new Error(message)
            error.statusCode = status
        }

        return error
    }

    // will load the data & process the response in a special response object
    function loadResponse() {
        var status = getStatusCode()
        var error = errorFromStatusCode(status)
        var response = {
            body: getBody(),
            statusCode: status,
            statusText: xhr.statusText,
            raw: xhr
        }
        if(xhr.getAllResponseHeaders){ //remember xhr can in fact be XDR for CORS in IE
            response.headers = parseHeaders(xhr.getAllResponseHeaders())
        } else {
            response.headers = {}
        }

        callback(error, response, response.body)
    }

    // will load the data and add some response properties to the source xhr
    // and then respond with that
    function loadXhr() {
        var status = getStatusCode()
        var error = errorFromStatusCode(status)

        xhr.status = xhr.statusCode = status
        xhr.body = getBody()
        xhr.headers = parseHeaders(xhr.getAllResponseHeaders())

        callback(error, xhr, xhr.body)
    }

    function error(evt) {
        callback(evt, xhr)
    }
}


function noop() {}

},{"global/window":7,"once":8,"parse-headers":12}],7:[function(_dereq_,module,exports){
(function (global){
if (typeof window !== "undefined") {
    module.exports = window;
} else if (typeof global !== "undefined") {
    module.exports = global;
} else if (typeof self !== "undefined"){
    module.exports = self;
} else {
    module.exports = {};
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
var isFunction = _dereq_('is-function')

module.exports = forEach

var toString = Object.prototype.toString
var hasOwnProperty = Object.prototype.hasOwnProperty

function forEach(list, iterator, context) {
    if (!isFunction(iterator)) {
        throw new TypeError('iterator must be a function')
    }

    if (arguments.length < 3) {
        context = this
    }
    
    if (toString.call(list) === '[object Array]')
        forEachArray(list, iterator, context)
    else if (typeof list === 'string')
        forEachString(list, iterator, context)
    else
        forEachObject(list, iterator, context)
}

function forEachArray(array, iterator, context) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (hasOwnProperty.call(array, i)) {
            iterator.call(context, array[i], i, array)
        }
    }
}

function forEachString(string, iterator, context) {
    for (var i = 0, len = string.length; i < len; i++) {
        // no such thing as a sparse string.
        iterator.call(context, string.charAt(i), i, string)
    }
}

function forEachObject(object, iterator, context) {
    for (var k in object) {
        if (hasOwnProperty.call(object, k)) {
            iterator.call(context, object[k], k, object)
        }
    }
}

},{"is-function":10}],10:[function(_dereq_,module,exports){
module.exports = isFunction

var toString = Object.prototype.toString

function isFunction (fn) {
  var string = toString.call(fn)
  return string === '[object Function]' ||
    (typeof fn === 'function' && string !== '[object RegExp]') ||
    (typeof window !== 'undefined' &&
     // IE8 and below
     (fn === window.setTimeout ||
      fn === window.alert ||
      fn === window.confirm ||
      fn === window.prompt))
};

},{}],11:[function(_dereq_,module,exports){

exports = module.exports = trim;

function trim(str){
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  return str.replace(/\s*$/, '');
};

},{}],12:[function(_dereq_,module,exports){
var trim = _dereq_('trim')
  , forEach = _dereq_('for-each')
  , isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    }

module.exports = function (headers) {
  if (!headers)
    return {}

  var result = {}

  forEach(
      trim(headers).split('\n')
    , function (row) {
        var index = row.indexOf(':')
          , key = trim(row.slice(0, index)).toLowerCase()
          , value = trim(row.slice(index + 1))

        if (typeof(result[key]) === 'undefined') {
          result[key] = value
        } else if (isArray(result[key])) {
          result[key].push(value)
        } else {
          result[key] = [ result[key], value ]
        }
      }
  )

  return result
}
},{"for-each":9,"trim":11}],13:[function(_dereq_,module,exports){
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

},{"./ua":30,"./util":32}],14:[function(_dereq_,module,exports){
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
        } else {
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

},{"./ui":31}],15:[function(_dereq_,module,exports){
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

},{"./CommandManager":14,"./PanelCollection":16,"./PreviewManager":17,"./UIManager":19,"./UndoManager":20,"./position":26,"./ui":31,"./util":32,"contra.emitter":2}],16:[function(_dereq_,module,exports){
'use strict';

function PanelCollection (postfix) {
  this.buttonBar = document.getElementById('pmk-buttons-' + postfix);
  this.preview = document.getElementById('pmk-preview-' + postfix);
  this.input = document.getElementById('pmk-input-' + postfix);
}

module.exports = PanelCollection;

},{}],17:[function(_dereq_,module,exports){
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
},{"./parse":24,"./position":26,"./ua":30,"./util":32}],18:[function(_dereq_,module,exports){
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
},{"./Chunks":13,"./ua":30,"./util":32}],19:[function(_dereq_,module,exports){
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
},{"./TextareaState":18,"./ua":30,"./util":32}],20:[function(_dereq_,module,exports){
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

},{"./TextareaState":18,"./ua":30,"./util":32}],21:[function(_dereq_,module,exports){
'use strict';

var trim = /^\s+|\s+$/g;
var whitespace = /\s+/g;

function interpret (input) {
  return typeof input === 'string' ? input.replace(trim, '').split(whitespace) : input;
}

function classes (node) {
  return node.className.replace(trim, '').split(whitespace);
}

function set (node, input) {
  node.className = input.join(' ');
}

function add (node, input) {
  var current = remove(node, input);
  var values = interpret(input);
  current.push.apply(current, values);
  set(node, current);
  return current;
}

function remove (node, input) {
  var current = classes(node);
  var values = interpret(input);
  values.forEach(function (value) {
    var i = current.indexOf(value);
    if (i !== -1) {
      current.splice(i, 1);
    }
  });
  set(node, current);
  return current;
}

function contains (node, input) {
  var current = classes(node);
  var values = interpret(input);

  return values.every(function (value) {
    return current.indexOf(value) !== -1;
  });
}

module.exports = {
  add: add,
  remove: remove,
  contains: contains,
  set: set,
  get: classes
};

},{}],22:[function(_dereq_,module,exports){
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

},{}],23:[function(_dereq_,module,exports){
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
},{}],24:[function(_dereq_,module,exports){
'use strict';

var configure = _dereq_('./configure');

module.exports = function (text) {
  return configure.markdown(text);
};

},{"./configure":22}],25:[function(_dereq_,module,exports){
(function (global){
'use strict';

var doc = global.document;
var ui = _dereq_('./ui');
var util = _dereq_('./util');
var configure = _dereq_('./configure');
var classes = _dereq_('./classes');
var Editor = _dereq_('./Editor');
var nextId = 0;

function ponymark (o) {
  var postfix = nextId++;
  var editor;

  if (Object.prototype.toString.call(o) !== '[object Object]') {
    o = { textarea: o, preview: o };
  }

  markup(o, postfix);

  editor = new Editor(postfix);
  editor.run();

  return editor.api;
}

function markup (o, postfix) {
  var buttonBar = doc.createElement('div');
  var preview = doc.createElement('div');
  var input;

  if (classes.contains(o.textarea, 'pmk-input')) {
    classes.add(o.textarea, 'pmk-input');
  }

  buttonBar.id = 'pmk-buttons-' + postfix;
  buttonBar.className = 'pmk-buttons';
  preview.id = 'pmk-preview-' + postfix;
  preview.className = 'pmk-preview';

  o.textarea.id = 'pmk-input-' + postfix;
  o.textarea.parentElement.insertBefore(buttonBar, o.textarea);
  o.preview.appendChild(preview);
}

module.exports = ponymark;

ponymark.Editor = Editor;
ponymark.configure = configure;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Editor":15,"./classes":21,"./configure":22,"./ui":31,"./util":32}],26:[function(_dereq_,module,exports){
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
},{}],27:[function(_dereq_,module,exports){
'use strict';

var xhr = _dereq_('xhr');
var raf = _dereq_('raf');
var configure = _dereq_('./configure');
var promptLink = _dereq_('./promptLink');
var promptRender = _dereq_('./promptRender');
var fireEvent = _dereq_('./fireEvent');
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
      body: form,
      timeout: 15000
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

},{"./configure":22,"./fireEvent":23,"./promptLink":28,"./promptRender":29,"raf":4,"xhr":6}],28:[function(_dereq_,module,exports){
'use strict';

var raf = _dereq_('raf');
var promptRender = _dereq_('./promptRender');
var cache;
var ENTER_KEY = 13;
var ESCAPE_KEY = 27;

function draw (cb) {
  if (cache) {
    cache.dialog.parentElement.removeChild(cache.dialog);
  }
  cache = promptRender({
    id: 'pmk-link-prompt',
    title: 'Insert Link',
    description: 'Type or paste the url to your link',
    placeholder: 'http://example.com/ "optional title"'
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
  dom.cancel.addEventListener('click', close);
  dom.close.addEventListener('click', close);
  dom.ok.addEventListener('click', ok);

  dom.input.addEventListener('keypress', enter);
  dom.input.addEventListener('keydown', esc);

  function enter (e) {
    var key = e.which || e.keyCode;
    if (key === ENTER_KEY) {
      ok();
      e.preventDefault();
    }
  }

  function esc (e) {
    var key = e.which || e.keyCode;
    if (key === ESCAPE_KEY) {
      close();
      e.preventDefault();
    }
  }

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

},{"./promptRender":29,"raf":4}],29:[function(_dereq_,module,exports){
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
},{}],30:[function(_dereq_,module,exports){
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

},{}],31:[function(_dereq_,module,exports){
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
    if (text !== null){ // fixes common paste errors
      text = text.replace(/^http:\/\/(https?|ftp):\/\//, '$1://');
      if (text[0] !== '/' && !/^(?:https?|ftp):\/\//.test(text)){
        text = 'http://' + text;
      }
    }
    cb(text);
  }
}

module.exports = {
  prompt: prompt
};

},{"./promptImage":27,"./promptLink":28}],32:[function(_dereq_,module,exports){
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

},{}]},{},[25])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL2NvbnRyYS5lbWl0dGVyL2luZGV4LmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL2NvbnRyYS5lbWl0dGVyL3NyYy9jb250cmEuZW1pdHRlci5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL25vZGVfbW9kdWxlcy9yYWYvaW5kZXguanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMvcmFmL25vZGVfbW9kdWxlcy9wZXJmb3JtYW5jZS1ub3cvbGliL3BlcmZvcm1hbmNlLW5vdy5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL25vZGVfbW9kdWxlcy94aHIvaW5kZXguanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMveGhyL25vZGVfbW9kdWxlcy9nbG9iYWwvd2luZG93LmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMvb25jZS9vbmNlLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMvcGFyc2UtaGVhZGVycy9ub2RlX21vZHVsZXMvZm9yLWVhY2gvaW5kZXguanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMveGhyL25vZGVfbW9kdWxlcy9wYXJzZS1oZWFkZXJzL25vZGVfbW9kdWxlcy9mb3ItZWFjaC9ub2RlX21vZHVsZXMvaXMtZnVuY3Rpb24vaW5kZXguanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMveGhyL25vZGVfbW9kdWxlcy9wYXJzZS1oZWFkZXJzL25vZGVfbW9kdWxlcy90cmltL2luZGV4LmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMvcGFyc2UtaGVhZGVycy9wYXJzZS1oZWFkZXJzLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvc3JjL0NodW5rcy5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy9Db21tYW5kTWFuYWdlci5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy9FZGl0b3IuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9zcmMvUGFuZWxDb2xsZWN0aW9uLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvc3JjL1ByZXZpZXdNYW5hZ2VyLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvc3JjL1RleHRhcmVhU3RhdGUuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9zcmMvVUlNYW5hZ2VyLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvc3JjL1VuZG9NYW5hZ2VyLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvc3JjL2NsYXNzZXMuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9zcmMvY29uZmlndXJlLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvc3JjL2ZpcmVFdmVudC5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy9wYXJzZS5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy9wb255bWFyay5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy9wb3NpdGlvbi5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy9wcm9tcHRJbWFnZS5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy9wcm9tcHRMaW5rLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvc3JjL3Byb21wdFJlbmRlci5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy91YS5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy91aS5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hpQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBldi5zb3VyY2U7XG4gICAgICAgICAgICBpZiAoKHNvdXJjZSA9PT0gd2luZG93IHx8IHNvdXJjZSA9PT0gbnVsbCkgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vc3JjL2NvbnRyYS5lbWl0dGVyLmpzJyk7XG4iLCIoZnVuY3Rpb24gKHByb2Nlc3Mpe1xuKGZ1bmN0aW9uIChyb290LCB1bmRlZmluZWQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciB1bmRlZiA9ICcnICsgdW5kZWZpbmVkO1xuICBmdW5jdGlvbiBhdG9hIChhLCBuKSB7IHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhLCBuKTsgfVxuICBmdW5jdGlvbiBkZWJvdW5jZSAoZm4sIGFyZ3MsIGN0eCkgeyBpZiAoIWZuKSB7IHJldHVybjsgfSB0aWNrKGZ1bmN0aW9uIHJ1biAoKSB7IGZuLmFwcGx5KGN0eCB8fCBudWxsLCBhcmdzIHx8IFtdKTsgfSk7IH1cblxuICAvLyBjcm9zcy1wbGF0Zm9ybSB0aWNrZXJcbiAgdmFyIHNpID0gdHlwZW9mIHNldEltbWVkaWF0ZSA9PT0gJ2Z1bmN0aW9uJywgdGljaztcbiAgaWYgKHNpKSB7XG4gICAgdGljayA9IGZ1bmN0aW9uIChmbikgeyBzZXRJbW1lZGlhdGUoZm4pOyB9O1xuICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSB1bmRlZiAmJiBwcm9jZXNzLm5leHRUaWNrKSB7XG4gICAgdGljayA9IHByb2Nlc3MubmV4dFRpY2s7XG4gIH0gZWxzZSB7XG4gICAgdGljayA9IGZ1bmN0aW9uIChmbikgeyBzZXRUaW1lb3V0KGZuLCAwKTsgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9lbWl0dGVyICh0aGluZywgb3B0aW9ucykge1xuICAgIHZhciBvcHRzID0gb3B0aW9ucyB8fCB7fTtcbiAgICB2YXIgZXZ0ID0ge307XG4gICAgaWYgKHRoaW5nID09PSB1bmRlZmluZWQpIHsgdGhpbmcgPSB7fTsgfVxuICAgIHRoaW5nLm9uID0gZnVuY3Rpb24gKHR5cGUsIGZuKSB7XG4gICAgICBpZiAoIWV2dFt0eXBlXSkge1xuICAgICAgICBldnRbdHlwZV0gPSBbZm5dO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXZ0W3R5cGVdLnB1c2goZm4pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaW5nO1xuICAgIH07XG4gICAgdGhpbmcub25jZSA9IGZ1bmN0aW9uICh0eXBlLCBmbikge1xuICAgICAgZm4uX29uY2UgPSB0cnVlOyAvLyB0aGluZy5vZmYoZm4pIHN0aWxsIHdvcmtzIVxuICAgICAgdGhpbmcub24odHlwZSwgZm4pO1xuICAgICAgcmV0dXJuIHRoaW5nO1xuICAgIH07XG4gICAgdGhpbmcub2ZmID0gZnVuY3Rpb24gKHR5cGUsIGZuKSB7XG4gICAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICBpZiAoYyA9PT0gMSkge1xuICAgICAgICBkZWxldGUgZXZ0W3R5cGVdO1xuICAgICAgfSBlbHNlIGlmIChjID09PSAwKSB7XG4gICAgICAgIGV2dCA9IHt9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGV0ID0gZXZ0W3R5cGVdO1xuICAgICAgICBpZiAoIWV0KSB7IHJldHVybiB0aGluZzsgfVxuICAgICAgICBldC5zcGxpY2UoZXQuaW5kZXhPZihmbiksIDEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaW5nO1xuICAgIH07XG4gICAgdGhpbmcuZW1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjdHggPSB0aGlzO1xuICAgICAgdmFyIGFyZ3MgPSBhdG9hKGFyZ3VtZW50cyk7XG4gICAgICB2YXIgdHlwZSA9IGFyZ3Muc2hpZnQoKTtcbiAgICAgIHZhciBldCA9IGV2dFt0eXBlXTtcbiAgICAgIGlmICh0eXBlID09PSAnZXJyb3InICYmIG9wdHMudGhyb3dzICE9PSBmYWxzZSAmJiAhZXQpIHsgdGhyb3cgYXJncy5sZW5ndGggPT09IDEgPyBhcmdzWzBdIDogYXJnczsgfVxuICAgICAgaWYgKCFldCkgeyByZXR1cm4gdGhpbmc7IH1cbiAgICAgIGV2dFt0eXBlXSA9IGV0LmZpbHRlcihmdW5jdGlvbiBlbWl0dGVyIChsaXN0ZW4pIHtcbiAgICAgICAgaWYgKG9wdHMuYXN5bmMpIHsgZGVib3VuY2UobGlzdGVuLCBhcmdzLCBjdHgpOyB9IGVsc2UgeyBsaXN0ZW4uYXBwbHkoY3R4LCBhcmdzKTsgfVxuICAgICAgICByZXR1cm4gIWxpc3Rlbi5fb25jZTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaW5nO1xuICAgIH07XG4gICAgcmV0dXJuIHRoaW5nO1xuICB9XG5cbiAgLy8gY3Jvc3MtcGxhdGZvcm0gZXhwb3J0XG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSB1bmRlZiAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gX2VtaXR0ZXI7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5jb250cmEgPSByb290LmNvbnRyYSB8fCB7fTtcbiAgICByb290LmNvbnRyYS5lbWl0dGVyID0gX2VtaXR0ZXI7XG4gIH1cbn0pKHRoaXMpO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIkZXYUFTSFwiKSkiLCJ2YXIgbm93ID0gcmVxdWlyZSgncGVyZm9ybWFuY2Utbm93JylcbiAgLCBnbG9iYWwgPSB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/IHt9IDogd2luZG93XG4gICwgdmVuZG9ycyA9IFsnbW96JywgJ3dlYmtpdCddXG4gICwgc3VmZml4ID0gJ0FuaW1hdGlvbkZyYW1lJ1xuICAsIHJhZiA9IGdsb2JhbFsncmVxdWVzdCcgKyBzdWZmaXhdXG4gICwgY2FmID0gZ2xvYmFsWydjYW5jZWwnICsgc3VmZml4XSB8fCBnbG9iYWxbJ2NhbmNlbFJlcXVlc3QnICsgc3VmZml4XVxuICAsIGlzTmF0aXZlID0gdHJ1ZVxuXG5mb3IodmFyIGkgPSAwOyBpIDwgdmVuZG9ycy5sZW5ndGggJiYgIXJhZjsgaSsrKSB7XG4gIHJhZiA9IGdsb2JhbFt2ZW5kb3JzW2ldICsgJ1JlcXVlc3QnICsgc3VmZml4XVxuICBjYWYgPSBnbG9iYWxbdmVuZG9yc1tpXSArICdDYW5jZWwnICsgc3VmZml4XVxuICAgICAgfHwgZ2xvYmFsW3ZlbmRvcnNbaV0gKyAnQ2FuY2VsUmVxdWVzdCcgKyBzdWZmaXhdXG59XG5cbi8vIFNvbWUgdmVyc2lvbnMgb2YgRkYgaGF2ZSByQUYgYnV0IG5vdCBjQUZcbmlmKCFyYWYgfHwgIWNhZikge1xuICBpc05hdGl2ZSA9IGZhbHNlXG5cbiAgdmFyIGxhc3QgPSAwXG4gICAgLCBpZCA9IDBcbiAgICAsIHF1ZXVlID0gW11cbiAgICAsIGZyYW1lRHVyYXRpb24gPSAxMDAwIC8gNjBcblxuICByYWYgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIGlmKHF1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdmFyIF9ub3cgPSBub3coKVxuICAgICAgICAsIG5leHQgPSBNYXRoLm1heCgwLCBmcmFtZUR1cmF0aW9uIC0gKF9ub3cgLSBsYXN0KSlcbiAgICAgIGxhc3QgPSBuZXh0ICsgX25vd1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNwID0gcXVldWUuc2xpY2UoMClcbiAgICAgICAgLy8gQ2xlYXIgcXVldWUgaGVyZSB0byBwcmV2ZW50XG4gICAgICAgIC8vIGNhbGxiYWNrcyBmcm9tIGFwcGVuZGluZyBsaXN0ZW5lcnNcbiAgICAgICAgLy8gdG8gdGhlIGN1cnJlbnQgZnJhbWUncyBxdWV1ZVxuICAgICAgICBxdWV1ZS5sZW5ndGggPSAwXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBjcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmKCFjcFtpXS5jYW5jZWxsZWQpIHtcbiAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgY3BbaV0uY2FsbGJhY2sobGFzdClcbiAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyB0aHJvdyBlIH0sIDApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCBNYXRoLnJvdW5kKG5leHQpKVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKHtcbiAgICAgIGhhbmRsZTogKytpZCxcbiAgICAgIGNhbGxiYWNrOiBjYWxsYmFjayxcbiAgICAgIGNhbmNlbGxlZDogZmFsc2VcbiAgICB9KVxuICAgIHJldHVybiBpZFxuICB9XG5cbiAgY2FmID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZihxdWV1ZVtpXS5oYW5kbGUgPT09IGhhbmRsZSkge1xuICAgICAgICBxdWV1ZVtpXS5jYW5jZWxsZWQgPSB0cnVlXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4pIHtcbiAgLy8gV3JhcCBpbiBhIG5ldyBmdW5jdGlvbiB0byBwcmV2ZW50XG4gIC8vIGBjYW5jZWxgIHBvdGVudGlhbGx5IGJlaW5nIGFzc2lnbmVkXG4gIC8vIHRvIHRoZSBuYXRpdmUgckFGIGZ1bmN0aW9uXG4gIGlmKCFpc05hdGl2ZSkge1xuICAgIHJldHVybiByYWYuY2FsbChnbG9iYWwsIGZuKVxuICB9XG4gIHJldHVybiByYWYuY2FsbChnbG9iYWwsIGZ1bmN0aW9uKCkge1xuICAgIHRyeXtcbiAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHRocm93IGUgfSwgMClcbiAgICB9XG4gIH0pXG59XG5tb2R1bGUuZXhwb3J0cy5jYW5jZWwgPSBmdW5jdGlvbigpIHtcbiAgY2FmLmFwcGx5KGdsb2JhbCwgYXJndW1lbnRzKVxufVxuIiwiKGZ1bmN0aW9uIChwcm9jZXNzKXtcbi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS42LjNcbihmdW5jdGlvbigpIHtcbiAgdmFyIGdldE5hbm9TZWNvbmRzLCBocnRpbWUsIGxvYWRUaW1lO1xuXG4gIGlmICgodHlwZW9mIHBlcmZvcm1hbmNlICE9PSBcInVuZGVmaW5lZFwiICYmIHBlcmZvcm1hbmNlICE9PSBudWxsKSAmJiBwZXJmb3JtYW5jZS5ub3cpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIH07XG4gIH0gZWxzZSBpZiAoKHR5cGVvZiBwcm9jZXNzICE9PSBcInVuZGVmaW5lZFwiICYmIHByb2Nlc3MgIT09IG51bGwpICYmIHByb2Nlc3MuaHJ0aW1lKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAoZ2V0TmFub1NlY29uZHMoKSAtIGxvYWRUaW1lKSAvIDFlNjtcbiAgICB9O1xuICAgIGhydGltZSA9IHByb2Nlc3MuaHJ0aW1lO1xuICAgIGdldE5hbm9TZWNvbmRzID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaHI7XG4gICAgICBociA9IGhydGltZSgpO1xuICAgICAgcmV0dXJuIGhyWzBdICogMWU5ICsgaHJbMV07XG4gICAgfTtcbiAgICBsb2FkVGltZSA9IGdldE5hbm9TZWNvbmRzKCk7XG4gIH0gZWxzZSBpZiAoRGF0ZS5ub3cpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIERhdGUubm93KCkgLSBsb2FkVGltZTtcbiAgICB9O1xuICAgIGxvYWRUaW1lID0gRGF0ZS5ub3coKTtcbiAgfSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gbG9hZFRpbWU7XG4gICAgfTtcbiAgICBsb2FkVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB9XG5cbn0pLmNhbGwodGhpcyk7XG5cbi8qXG4vL0Agc291cmNlTWFwcGluZ1VSTD1wZXJmb3JtYW5jZS1ub3cubWFwXG4qL1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIkZXYUFTSFwiKSkiLCJ2YXIgd2luZG93ID0gcmVxdWlyZShcImdsb2JhbC93aW5kb3dcIilcbnZhciBvbmNlID0gcmVxdWlyZShcIm9uY2VcIilcbnZhciBwYXJzZUhlYWRlcnMgPSByZXF1aXJlKCdwYXJzZS1oZWFkZXJzJylcblxudmFyIG1lc3NhZ2VzID0ge1xuICAgIFwiMFwiOiBcIkludGVybmFsIFhNTEh0dHBSZXF1ZXN0IEVycm9yXCIsXG4gICAgXCI0XCI6IFwiNHh4IENsaWVudCBFcnJvclwiLFxuICAgIFwiNVwiOiBcIjV4eCBTZXJ2ZXIgRXJyb3JcIlxufVxuXG52YXIgWEhSID0gd2luZG93LlhNTEh0dHBSZXF1ZXN0IHx8IG5vb3BcbnZhciBYRFIgPSBcIndpdGhDcmVkZW50aWFsc1wiIGluIChuZXcgWEhSKCkpID8gWEhSIDogd2luZG93LlhEb21haW5SZXF1ZXN0XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlWEhSXG5cbmZ1bmN0aW9uIGNyZWF0ZVhIUihvcHRpb25zLCBjYWxsYmFjaykge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICBvcHRpb25zID0geyB1cmk6IG9wdGlvbnMgfVxuICAgIH1cblxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgY2FsbGJhY2sgPSBvbmNlKGNhbGxiYWNrKVxuXG4gICAgdmFyIHhociA9IG9wdGlvbnMueGhyIHx8IG51bGxcblxuICAgIGlmICgheGhyKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmNvcnMgfHwgb3B0aW9ucy51c2VYRFIpIHtcbiAgICAgICAgICAgIHhociA9IG5ldyBYRFIoKVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHhociA9IG5ldyBYSFIoKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHVyaSA9IHhoci51cmwgPSBvcHRpb25zLnVyaSB8fCBvcHRpb25zLnVybFxuICAgIHZhciBtZXRob2QgPSB4aHIubWV0aG9kID0gb3B0aW9ucy5tZXRob2QgfHwgXCJHRVRcIlxuICAgIHZhciBib2R5ID0gb3B0aW9ucy5ib2R5IHx8IG9wdGlvbnMuZGF0YVxuICAgIHZhciBoZWFkZXJzID0geGhyLmhlYWRlcnMgPSBvcHRpb25zLmhlYWRlcnMgfHwge31cbiAgICB2YXIgc3luYyA9ICEhb3B0aW9ucy5zeW5jXG4gICAgdmFyIGlzSnNvbiA9IGZhbHNlXG4gICAgdmFyIGtleVxuICAgIHZhciBsb2FkID0gb3B0aW9ucy5yZXNwb25zZSA/IGxvYWRSZXNwb25zZSA6IGxvYWRYaHJcblxuICAgIGlmIChcImpzb25cIiBpbiBvcHRpb25zKSB7XG4gICAgICAgIGlzSnNvbiA9IHRydWVcbiAgICAgICAgaGVhZGVyc1tcIkFjY2VwdFwiXSA9IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICAgIGlmIChtZXRob2QgIT09IFwiR0VUXCIgJiYgbWV0aG9kICE9PSBcIkhFQURcIikge1xuICAgICAgICAgICAgaGVhZGVyc1tcIkNvbnRlbnQtVHlwZVwiXSA9IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkob3B0aW9ucy5qc29uKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IHJlYWR5c3RhdGVjaGFuZ2VcbiAgICB4aHIub25sb2FkID0gbG9hZFxuICAgIHhoci5vbmVycm9yID0gZXJyb3JcbiAgICAvLyBJRTkgbXVzdCBoYXZlIG9ucHJvZ3Jlc3MgYmUgc2V0IHRvIGEgdW5pcXVlIGZ1bmN0aW9uLlxuICAgIHhoci5vbnByb2dyZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBJRSBtdXN0IGRpZVxuICAgIH1cbiAgICAvLyBoYXRlIElFXG4gICAgeGhyLm9udGltZW91dCA9IG5vb3BcbiAgICB4aHIub3BlbihtZXRob2QsIHVyaSwgIXN5bmMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2JhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAgICBpZiAob3B0aW9ucy53aXRoQ3JlZGVudGlhbHMgfHwgKG9wdGlvbnMuY29ycyAmJiBvcHRpb25zLndpdGhDcmVkZW50aWFscyAhPT0gZmFsc2UpKSB7XG4gICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlXG4gICAgfVxuXG4gICAgLy8gQ2Fubm90IHNldCB0aW1lb3V0IHdpdGggc3luYyByZXF1ZXN0XG4gICAgaWYgKCFzeW5jKSB7XG4gICAgICAgIHhoci50aW1lb3V0ID0gXCJ0aW1lb3V0XCIgaW4gb3B0aW9ucyA/IG9wdGlvbnMudGltZW91dCA6IDUwMDBcbiAgICB9XG5cbiAgICBpZiAoeGhyLnNldFJlcXVlc3RIZWFkZXIpIHtcbiAgICAgICAgZm9yKGtleSBpbiBoZWFkZXJzKXtcbiAgICAgICAgICAgIGlmKGhlYWRlcnMuaGFzT3duUHJvcGVydHkoa2V5KSl7XG4gICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoa2V5LCBoZWFkZXJzW2tleV0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9wdGlvbnMuaGVhZGVycykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJIZWFkZXJzIGNhbm5vdCBiZSBzZXQgb24gYW4gWERvbWFpblJlcXVlc3Qgb2JqZWN0XCIpXG4gICAgfVxuXG4gICAgaWYgKFwicmVzcG9uc2VUeXBlXCIgaW4gb3B0aW9ucykge1xuICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gb3B0aW9ucy5yZXNwb25zZVR5cGVcbiAgICB9XG4gICAgXG4gICAgaWYgKFwiYmVmb3JlU2VuZFwiIGluIG9wdGlvbnMgJiYgXG4gICAgICAgIHR5cGVvZiBvcHRpb25zLmJlZm9yZVNlbmQgPT09IFwiZnVuY3Rpb25cIlxuICAgICkge1xuICAgICAgICBvcHRpb25zLmJlZm9yZVNlbmQoeGhyKVxuICAgIH1cblxuICAgIHhoci5zZW5kKGJvZHkpXG5cbiAgICByZXR1cm4geGhyXG5cbiAgICBmdW5jdGlvbiByZWFkeXN0YXRlY2hhbmdlKCkge1xuICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICAgIGxvYWQoKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Qm9keSgpIHtcbiAgICAgICAgLy8gQ2hyb21lIHdpdGggcmVxdWVzdFR5cGU9YmxvYiB0aHJvd3MgZXJyb3JzIGFycm91bmQgd2hlbiBldmVuIHRlc3RpbmcgYWNjZXNzIHRvIHJlc3BvbnNlVGV4dFxuICAgICAgICB2YXIgYm9keSA9IG51bGxcblxuICAgICAgICBpZiAoeGhyLnJlc3BvbnNlKSB7XG4gICAgICAgICAgICBib2R5ID0geGhyLnJlc3BvbnNlXG4gICAgICAgIH0gZWxzZSBpZiAoeGhyLnJlc3BvbnNlVHlwZSA9PT0gJ3RleHQnIHx8ICF4aHIucmVzcG9uc2VUeXBlKSB7XG4gICAgICAgICAgICBib2R5ID0geGhyLnJlc3BvbnNlVGV4dCB8fCB4aHIucmVzcG9uc2VYTUxcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0pzb24pIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYm9keSA9IEpTT04ucGFyc2UoYm9keSlcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYm9keVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFN0YXR1c0NvZGUoKSB7XG4gICAgICAgIHJldHVybiB4aHIuc3RhdHVzID09PSAxMjIzID8gMjA0IDogeGhyLnN0YXR1c1xuICAgIH1cblxuICAgIC8vIGlmIHdlJ3JlIGdldHRpbmcgYSBub25lLW9rIHN0YXR1c0NvZGUsIGJ1aWxkICYgcmV0dXJuIGFuIGVycm9yXG4gICAgZnVuY3Rpb24gZXJyb3JGcm9tU3RhdHVzQ29kZShzdGF0dXMpIHtcbiAgICAgICAgdmFyIGVycm9yID0gbnVsbFxuICAgICAgICBpZiAoc3RhdHVzID09PSAwIHx8IChzdGF0dXMgPj0gNDAwICYmIHN0YXR1cyA8IDYwMCkpIHtcbiAgICAgICAgICAgIHZhciBtZXNzYWdlID0gKHR5cGVvZiBib2R5ID09PSBcInN0cmluZ1wiID8gYm9keSA6IGZhbHNlKSB8fFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VzW1N0cmluZyhzdGF0dXMpLmNoYXJBdCgwKV1cbiAgICAgICAgICAgIGVycm9yID0gbmV3IEVycm9yKG1lc3NhZ2UpXG4gICAgICAgICAgICBlcnJvci5zdGF0dXNDb2RlID0gc3RhdHVzXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZXJyb3JcbiAgICB9XG5cbiAgICAvLyB3aWxsIGxvYWQgdGhlIGRhdGEgJiBwcm9jZXNzIHRoZSByZXNwb25zZSBpbiBhIHNwZWNpYWwgcmVzcG9uc2Ugb2JqZWN0XG4gICAgZnVuY3Rpb24gbG9hZFJlc3BvbnNlKCkge1xuICAgICAgICB2YXIgc3RhdHVzID0gZ2V0U3RhdHVzQ29kZSgpXG4gICAgICAgIHZhciBlcnJvciA9IGVycm9yRnJvbVN0YXR1c0NvZGUoc3RhdHVzKVxuICAgICAgICB2YXIgcmVzcG9uc2UgPSB7XG4gICAgICAgICAgICBib2R5OiBnZXRCb2R5KCksXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiBzdGF0dXMsXG4gICAgICAgICAgICBzdGF0dXNUZXh0OiB4aHIuc3RhdHVzVGV4dCxcbiAgICAgICAgICAgIHJhdzogeGhyXG4gICAgICAgIH1cbiAgICAgICAgaWYoeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycyl7IC8vcmVtZW1iZXIgeGhyIGNhbiBpbiBmYWN0IGJlIFhEUiBmb3IgQ09SUyBpbiBJRVxuICAgICAgICAgICAgcmVzcG9uc2UuaGVhZGVycyA9IHBhcnNlSGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXNwb25zZS5oZWFkZXJzID0ge31cbiAgICAgICAgfVxuXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCByZXNwb25zZSwgcmVzcG9uc2UuYm9keSlcbiAgICB9XG5cbiAgICAvLyB3aWxsIGxvYWQgdGhlIGRhdGEgYW5kIGFkZCBzb21lIHJlc3BvbnNlIHByb3BlcnRpZXMgdG8gdGhlIHNvdXJjZSB4aHJcbiAgICAvLyBhbmQgdGhlbiByZXNwb25kIHdpdGggdGhhdFxuICAgIGZ1bmN0aW9uIGxvYWRYaHIoKSB7XG4gICAgICAgIHZhciBzdGF0dXMgPSBnZXRTdGF0dXNDb2RlKClcbiAgICAgICAgdmFyIGVycm9yID0gZXJyb3JGcm9tU3RhdHVzQ29kZShzdGF0dXMpXG5cbiAgICAgICAgeGhyLnN0YXR1cyA9IHhoci5zdGF0dXNDb2RlID0gc3RhdHVzXG4gICAgICAgIHhoci5ib2R5ID0gZ2V0Qm9keSgpXG4gICAgICAgIHhoci5oZWFkZXJzID0gcGFyc2VIZWFkZXJzKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSlcblxuICAgICAgICBjYWxsYmFjayhlcnJvciwgeGhyLCB4aHIuYm9keSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlcnJvcihldnQpIHtcbiAgICAgICAgY2FsbGJhY2soZXZ0LCB4aHIpXG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHdpbmRvdztcbn0gZWxzZSBpZiAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZ2xvYmFsO1xufSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBzZWxmO1xufSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHt9O1xufVxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIm1vZHVsZS5leHBvcnRzID0gb25jZVxuXG5vbmNlLnByb3RvID0gb25jZShmdW5jdGlvbiAoKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGdW5jdGlvbi5wcm90b3R5cGUsICdvbmNlJywge1xuICAgIHZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gb25jZSh0aGlzKVxuICAgIH0sXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pXG59KVxuXG5mdW5jdGlvbiBvbmNlIChmbikge1xuICB2YXIgY2FsbGVkID0gZmFsc2VcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoY2FsbGVkKSByZXR1cm5cbiAgICBjYWxsZWQgPSB0cnVlXG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgfVxufVxuIiwidmFyIGlzRnVuY3Rpb24gPSByZXF1aXJlKCdpcy1mdW5jdGlvbicpXG5cbm1vZHVsZS5leHBvcnRzID0gZm9yRWFjaFxuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5XG5cbmZ1bmN0aW9uIGZvckVhY2gobGlzdCwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpZiAoIWlzRnVuY3Rpb24oaXRlcmF0b3IpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2l0ZXJhdG9yIG11c3QgYmUgYSBmdW5jdGlvbicpXG4gICAgfVxuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSB7XG4gICAgICAgIGNvbnRleHQgPSB0aGlzXG4gICAgfVxuICAgIFxuICAgIGlmICh0b1N0cmluZy5jYWxsKGxpc3QpID09PSAnW29iamVjdCBBcnJheV0nKVxuICAgICAgICBmb3JFYWNoQXJyYXkobGlzdCwgaXRlcmF0b3IsIGNvbnRleHQpXG4gICAgZWxzZSBpZiAodHlwZW9mIGxpc3QgPT09ICdzdHJpbmcnKVxuICAgICAgICBmb3JFYWNoU3RyaW5nKGxpc3QsIGl0ZXJhdG9yLCBjb250ZXh0KVxuICAgIGVsc2VcbiAgICAgICAgZm9yRWFjaE9iamVjdChsaXN0LCBpdGVyYXRvciwgY29udGV4dClcbn1cblxuZnVuY3Rpb24gZm9yRWFjaEFycmF5KGFycmF5LCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnJheS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChhcnJheSwgaSkpIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgYXJyYXlbaV0sIGksIGFycmF5KVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmb3JFYWNoU3RyaW5nKHN0cmluZywgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gc3RyaW5nLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIC8vIG5vIHN1Y2ggdGhpbmcgYXMgYSBzcGFyc2Ugc3RyaW5nLlxuICAgICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHN0cmluZy5jaGFyQXQoaSksIGksIHN0cmluZylcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZvckVhY2hPYmplY3Qob2JqZWN0LCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGZvciAodmFyIGsgaW4gb2JqZWN0KSB7XG4gICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgaykpIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqZWN0W2tdLCBrLCBvYmplY3QpXG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGlzRnVuY3Rpb25cblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uIChmbikge1xuICB2YXIgc3RyaW5nID0gdG9TdHJpbmcuY2FsbChmbilcbiAgcmV0dXJuIHN0cmluZyA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJyB8fFxuICAgICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicgJiYgc3RyaW5nICE9PSAnW29iamVjdCBSZWdFeHBdJykgfHxcbiAgICAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgLy8gSUU4IGFuZCBiZWxvd1xuICAgICAoZm4gPT09IHdpbmRvdy5zZXRUaW1lb3V0IHx8XG4gICAgICBmbiA9PT0gd2luZG93LmFsZXJ0IHx8XG4gICAgICBmbiA9PT0gd2luZG93LmNvbmZpcm0gfHxcbiAgICAgIGZuID09PSB3aW5kb3cucHJvbXB0KSlcbn07XG4iLCJcbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHRyaW07XG5cbmZ1bmN0aW9uIHRyaW0oc3RyKXtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzKnxcXHMqJC9nLCAnJyk7XG59XG5cbmV4cG9ydHMubGVmdCA9IGZ1bmN0aW9uKHN0cil7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyovLCAnJyk7XG59O1xuXG5leHBvcnRzLnJpZ2h0ID0gZnVuY3Rpb24oc3RyKXtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXHMqJC8sICcnKTtcbn07XG4iLCJ2YXIgdHJpbSA9IHJlcXVpcmUoJ3RyaW0nKVxuICAsIGZvckVhY2ggPSByZXF1aXJlKCdmb3ItZWFjaCcpXG4gICwgaXNBcnJheSA9IGZ1bmN0aW9uKGFyZykge1xuICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcmcpID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaGVhZGVycykge1xuICBpZiAoIWhlYWRlcnMpXG4gICAgcmV0dXJuIHt9XG5cbiAgdmFyIHJlc3VsdCA9IHt9XG5cbiAgZm9yRWFjaChcbiAgICAgIHRyaW0oaGVhZGVycykuc3BsaXQoJ1xcbicpXG4gICAgLCBmdW5jdGlvbiAocm93KSB7XG4gICAgICAgIHZhciBpbmRleCA9IHJvdy5pbmRleE9mKCc6JylcbiAgICAgICAgICAsIGtleSA9IHRyaW0ocm93LnNsaWNlKDAsIGluZGV4KSkudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICwgdmFsdWUgPSB0cmltKHJvdy5zbGljZShpbmRleCArIDEpKVxuXG4gICAgICAgIGlmICh0eXBlb2YocmVzdWx0W2tleV0pID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHJlc3VsdFtrZXldID0gdmFsdWVcbiAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5KHJlc3VsdFtrZXldKSkge1xuICAgICAgICAgIHJlc3VsdFtrZXldLnB1c2godmFsdWUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0W2tleV0gPSBbIHJlc3VsdFtrZXldLCB2YWx1ZSBdXG4gICAgICAgIH1cbiAgICAgIH1cbiAgKVxuXG4gIHJldHVybiByZXN1bHRcbn0iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1YSA9IHJlcXVpcmUoJy4vdWEnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgcmUgPSBSZWdFeHA7XG5cbmZ1bmN0aW9uIENodW5rcyAoKSB7XG59XG5cbkNodW5rcy5wcm90b3R5cGUuZmluZFRhZ3MgPSBmdW5jdGlvbiAoc3RhcnRSZWdleCwgZW5kUmVnZXgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgcmVnZXg7XG5cbiAgaWYgKHN0YXJ0UmVnZXgpIHtcbiAgICByZWdleCA9IHV0aWwuZXh0ZW5kUmVnRXhwKHN0YXJ0UmVnZXgsICcnLCAnJCcpO1xuICAgIHRoaXMuYmVmb3JlID0gdGhpcy5iZWZvcmUucmVwbGFjZShyZWdleCwgc3RhcnRfcmVwbGFjZXIpO1xuICAgIHJlZ2V4ID0gdXRpbC5leHRlbmRSZWdFeHAoc3RhcnRSZWdleCwgJ14nLCAnJyk7XG4gICAgdGhpcy5zZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvbi5yZXBsYWNlKHJlZ2V4LCBzdGFydF9yZXBsYWNlcik7XG4gIH1cblxuICBpZiAoZW5kUmVnZXgpIHtcbiAgICByZWdleCA9IHV0aWwuZXh0ZW5kUmVnRXhwKGVuZFJlZ2V4LCAnJywgJyQnKTtcbiAgICB0aGlzLnNlbGVjdGlvbiA9IHRoaXMuc2VsZWN0aW9uLnJlcGxhY2UocmVnZXgsIGVuZF9yZXBsYWNlcik7XG4gICAgcmVnZXggPSB1dGlsLmV4dGVuZFJlZ0V4cChlbmRSZWdleCwgJ14nLCAnJyk7XG4gICAgdGhpcy5hZnRlciA9IHRoaXMuYWZ0ZXIucmVwbGFjZShyZWdleCwgZW5kX3JlcGxhY2VyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YXJ0X3JlcGxhY2VyIChtYXRjaCkge1xuICAgIHNlbGYuc3RhcnRUYWcgPSBzZWxmLnN0YXJ0VGFnICsgbWF0Y2g7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIGZ1bmN0aW9uIGVuZF9yZXBsYWNlciAobWF0Y2gpIHtcbiAgICBzZWxmLmVuZFRhZyA9IG1hdGNoICsgc2VsZi5lbmRUYWc7XG4gICAgcmV0dXJuICcnO1xuICB9XG59O1xuXG5DaHVua3MucHJvdG90eXBlLnRyaW1XaGl0ZXNwYWNlID0gZnVuY3Rpb24gKHJlbW92ZSkge1xuICB2YXIgYmVmb3JlUmVwbGFjZXIsIGFmdGVyUmVwbGFjZXIsIHNlbGYgPSB0aGlzO1xuICBpZiAocmVtb3ZlKSB7XG4gICAgYmVmb3JlUmVwbGFjZXIgPSBhZnRlclJlcGxhY2VyID0gJyc7XG4gIH0gZWxzZSB7XG4gICAgYmVmb3JlUmVwbGFjZXIgPSBmdW5jdGlvbiAocykgeyBzZWxmLmJlZm9yZSArPSBzOyByZXR1cm4gJyc7IH1cbiAgICBhZnRlclJlcGxhY2VyID0gZnVuY3Rpb24gKHMpIHsgc2VsZi5hZnRlciA9IHMgKyBzZWxmLmFmdGVyOyByZXR1cm4gJyc7IH1cbiAgfVxuXG4gIHRoaXMuc2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb24ucmVwbGFjZSgvXihcXHMqKS8sIGJlZm9yZVJlcGxhY2VyKS5yZXBsYWNlKC8oXFxzKikkLywgYWZ0ZXJSZXBsYWNlcik7XG59O1xuXG5DaHVua3MucHJvdG90eXBlLnNraXBMaW5lcyA9IGZ1bmN0aW9uIChuTGluZXNCZWZvcmUsIG5MaW5lc0FmdGVyLCBmaW5kRXh0cmFOZXdsaW5lcykge1xuICBpZiAobkxpbmVzQmVmb3JlID09PSB2b2lkIDApIHtcbiAgICBuTGluZXNCZWZvcmUgPSAxO1xuICB9XG5cbiAgaWYgKG5MaW5lc0FmdGVyID09PSB2b2lkIDApIHtcbiAgICBuTGluZXNBZnRlciA9IDE7XG4gIH1cblxuICBuTGluZXNCZWZvcmUrKztcbiAgbkxpbmVzQWZ0ZXIrKztcblxuICB2YXIgcmVnZXhUZXh0O1xuICB2YXIgcmVwbGFjZW1lbnRUZXh0O1xuXG4gIGlmICh1YS5pc0Nocm9tZSkge1xuICAgICdYJy5tYXRjaCgvKCkuLyk7XG4gIH1cblxuICB0aGlzLnNlbGVjdGlvbiA9IHRoaXMuc2VsZWN0aW9uLnJlcGxhY2UoLyheXFxuKikvLCAnJyk7XG4gIHRoaXMuc3RhcnRUYWcgPSB0aGlzLnN0YXJ0VGFnICsgcmUuJDE7XG4gIHRoaXMuc2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb24ucmVwbGFjZSgvKFxcbiokKS8sICcnKTtcbiAgdGhpcy5lbmRUYWcgPSB0aGlzLmVuZFRhZyArIHJlLiQxO1xuICB0aGlzLnN0YXJ0VGFnID0gdGhpcy5zdGFydFRhZy5yZXBsYWNlKC8oXlxcbiopLywgJycpO1xuICB0aGlzLmJlZm9yZSA9IHRoaXMuYmVmb3JlICsgcmUuJDE7XG4gIHRoaXMuZW5kVGFnID0gdGhpcy5lbmRUYWcucmVwbGFjZSgvKFxcbiokKS8sICcnKTtcbiAgdGhpcy5hZnRlciA9IHRoaXMuYWZ0ZXIgKyByZS4kMTtcblxuICBpZiAodGhpcy5iZWZvcmUpIHtcbiAgICByZWdleFRleHQgPSByZXBsYWNlbWVudFRleHQgPSAnJztcblxuICAgIHdoaWxlIChuTGluZXNCZWZvcmUtLSkge1xuICAgICAgcmVnZXhUZXh0ICs9ICdcXFxcbj8nO1xuICAgICAgcmVwbGFjZW1lbnRUZXh0ICs9ICdcXG4nO1xuICAgIH1cblxuICAgIGlmIChmaW5kRXh0cmFOZXdsaW5lcykge1xuICAgICAgcmVnZXhUZXh0ID0gJ1xcXFxuKic7XG4gICAgfVxuICAgIHRoaXMuYmVmb3JlID0gdGhpcy5iZWZvcmUucmVwbGFjZShuZXcgcmUocmVnZXhUZXh0ICsgJyQnLCAnJyksIHJlcGxhY2VtZW50VGV4dCk7XG4gIH1cblxuICBpZiAodGhpcy5hZnRlcikge1xuICAgIHJlZ2V4VGV4dCA9IHJlcGxhY2VtZW50VGV4dCA9ICcnO1xuXG4gICAgd2hpbGUgKG5MaW5lc0FmdGVyLS0pIHtcbiAgICAgIHJlZ2V4VGV4dCArPSAnXFxcXG4/JztcbiAgICAgIHJlcGxhY2VtZW50VGV4dCArPSAnXFxuJztcbiAgICB9XG4gICAgaWYgKGZpbmRFeHRyYU5ld2xpbmVzKSB7XG4gICAgICByZWdleFRleHQgPSAnXFxcXG4qJztcbiAgICB9XG5cbiAgICB0aGlzLmFmdGVyID0gdGhpcy5hZnRlci5yZXBsYWNlKG5ldyByZShyZWdleFRleHQsICcnKSwgcmVwbGFjZW1lbnRUZXh0KTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDaHVua3M7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1aSA9IHJlcXVpcmUoJy4vdWknKVxudmFyIHNldHRpbmdzID0geyBsaW5lTGVuZ3RoOiA3MiB9O1xudmFyIHJlID0gUmVnRXhwO1xuXG5mdW5jdGlvbiBDb21tYW5kTWFuYWdlciAoZ2V0U3RyaW5nKSB7XG4gIHRoaXMuZ2V0U3RyaW5nID0gZ2V0U3RyaW5nO1xufVxuXG52YXIgJCA9IENvbW1hbmRNYW5hZ2VyLnByb3RvdHlwZTtcblxuJC5wcmVmaXhlcyA9ICcoPzpcXFxcc3s0LH18XFxcXHMqPnxcXFxccyotXFxcXHMrfFxcXFxzKlxcXFxkK1xcXFwufD18XFxcXCt8LXxffFxcXFwqfCN8XFxcXHMqXFxcXFtbXlxcbl1dK1xcXFxdOiknO1xuXG4kLnVud3JhcCA9IGZ1bmN0aW9uIChjaHVuaykge1xuICB2YXIgdHh0ID0gbmV3IHJlKCcoW15cXFxcbl0pXFxcXG4oPyEoXFxcXG58JyArIHRoaXMucHJlZml4ZXMgKyAnKSknLCAnZycpO1xuICBjaHVuay5zZWxlY3Rpb24gPSBjaHVuay5zZWxlY3Rpb24ucmVwbGFjZSh0eHQsICckMSAkMicpO1xufTtcblxuJC53cmFwID0gZnVuY3Rpb24gKGNodW5rLCBsZW4pIHtcbiAgdGhpcy51bndyYXAoY2h1bmspO1xuICB2YXIgcmVnZXggPSBuZXcgcmUoJyguezEsJyArIGxlbiArICd9KSggK3wkXFxcXG4/KScsICdnbScpLFxuICAgIHRoYXQgPSB0aGlzO1xuXG4gIGNodW5rLnNlbGVjdGlvbiA9IGNodW5rLnNlbGVjdGlvbi5yZXBsYWNlKHJlZ2V4LCBmdW5jdGlvbiAobGluZSwgbWFya2VkKSB7XG4gICAgaWYgKG5ldyByZSgnXicgKyB0aGF0LnByZWZpeGVzLCAnJykudGVzdChsaW5lKSkge1xuICAgICAgcmV0dXJuIGxpbmU7XG4gICAgfVxuICAgIHJldHVybiBtYXJrZWQgKyAnXFxuJztcbiAgfSk7XG5cbiAgY2h1bmsuc2VsZWN0aW9uID0gY2h1bmsuc2VsZWN0aW9uLnJlcGxhY2UoL1xccyskLywgJycpO1xufTtcblxuJC5kb0JvbGQgPSBmdW5jdGlvbiAoY2h1bmssIHBvc3RQcm9jZXNzaW5nKSB7XG4gIHJldHVybiB0aGlzLmRvQm9ySShjaHVuaywgcG9zdFByb2Nlc3NpbmcsIDIsIHRoaXMuZ2V0U3RyaW5nKCdib2xkZXhhbXBsZScpKTtcbn07XG5cbiQuZG9JdGFsaWMgPSBmdW5jdGlvbiAoY2h1bmssIHBvc3RQcm9jZXNzaW5nKSB7XG4gIHJldHVybiB0aGlzLmRvQm9ySShjaHVuaywgcG9zdFByb2Nlc3NpbmcsIDEsIHRoaXMuZ2V0U3RyaW5nKCdpdGFsaWNleGFtcGxlJykpO1xufTtcblxuJC5kb0JvckkgPSBmdW5jdGlvbiAoY2h1bmssIHBvc3RQcm9jZXNzaW5nLCBuU3RhcnMsIGluc2VydFRleHQpIHtcbiAgY2h1bmsudHJpbVdoaXRlc3BhY2UoKTtcbiAgY2h1bmsuc2VsZWN0aW9uID0gY2h1bmsuc2VsZWN0aW9uLnJlcGxhY2UoL1xcbnsyLH0vZywgJ1xcbicpO1xuXG4gIHZhciBzdGFyc0JlZm9yZSA9IC8oXFwqKiQpLy5leGVjKGNodW5rLmJlZm9yZSlbMF07XG4gIHZhciBzdGFyc0FmdGVyID0gLyheXFwqKikvLmV4ZWMoY2h1bmsuYWZ0ZXIpWzBdO1xuICB2YXIgcHJldlN0YXJzID0gTWF0aC5taW4oc3RhcnNCZWZvcmUubGVuZ3RoLCBzdGFyc0FmdGVyLmxlbmd0aCk7XG5cbiAgaWYgKChwcmV2U3RhcnMgPj0gblN0YXJzKSAmJiAocHJldlN0YXJzICE9IDIgfHwgblN0YXJzICE9IDEpKSB7XG4gICAgY2h1bmsuYmVmb3JlID0gY2h1bmsuYmVmb3JlLnJlcGxhY2UocmUoJ1sqXXsnICsgblN0YXJzICsgJ30kJywgJycpLCAnJyk7XG4gICAgY2h1bmsuYWZ0ZXIgPSBjaHVuay5hZnRlci5yZXBsYWNlKHJlKCdeWypdeycgKyBuU3RhcnMgKyAnfScsICcnKSwgJycpO1xuICB9IGVsc2UgaWYgKCFjaHVuay5zZWxlY3Rpb24gJiYgc3RhcnNBZnRlcikge1xuICAgIGNodW5rLmFmdGVyID0gY2h1bmsuYWZ0ZXIucmVwbGFjZSgvXihbKl9dKikvLCAnJyk7XG4gICAgY2h1bmsuYmVmb3JlID0gY2h1bmsuYmVmb3JlLnJlcGxhY2UoLyhcXHM/KSQvLCAnJyk7XG4gICAgdmFyIHdoaXRlc3BhY2UgPSByZS4kMTtcbiAgICBjaHVuay5iZWZvcmUgPSBjaHVuay5iZWZvcmUgKyBzdGFyc0FmdGVyICsgd2hpdGVzcGFjZTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoIWNodW5rLnNlbGVjdGlvbiAmJiAhc3RhcnNBZnRlcikge1xuICAgICAgY2h1bmsuc2VsZWN0aW9uID0gaW5zZXJ0VGV4dDtcbiAgICB9XG5cbiAgICB2YXIgbWFya3VwID0gblN0YXJzIDw9IDEgPyAnKicgOiAnKionO1xuICAgIGNodW5rLmJlZm9yZSA9IGNodW5rLmJlZm9yZSArIG1hcmt1cDtcbiAgICBjaHVuay5hZnRlciA9IG1hcmt1cCArIGNodW5rLmFmdGVyO1xuICB9XG59O1xuXG4kLnN0cmlwTGlua0RlZnMgPSBmdW5jdGlvbiAodGV4dCwgZGVmc1RvQWRkKSB7XG4gIHZhciByZWdleCA9IC9eWyBdezAsM31cXFsoXFxkKylcXF06WyBcXHRdKlxcbj9bIFxcdF0qPD8oXFxTKz8pPj9bIFxcdF0qXFxuP1sgXFx0XSooPzooXFxuKilbXCIoXSguKz8pW1wiKV1bIFxcdF0qKT8oPzpcXG4rfCQpL2dtO1xuXG4gIGZ1bmN0aW9uIHJlcGxhY2VyIChhbGwsIGlkLCBsaW5rLCBuZXdsaW5lcywgdGl0bGUpIHtcbiAgICBkZWZzVG9BZGRbaWRdID0gYWxsLnJlcGxhY2UoL1xccyokLywgJycpO1xuICAgIGlmIChuZXdsaW5lcykge1xuICAgICAgZGVmc1RvQWRkW2lkXSA9IGFsbC5yZXBsYWNlKC9bXCIoXSguKz8pW1wiKV0kLywgJycpO1xuICAgICAgcmV0dXJuIG5ld2xpbmVzICsgdGl0bGU7XG4gICAgfVxuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIHJldHVybiB0ZXh0LnJlcGxhY2UocmVnZXgsIHJlcGxhY2VyKTtcbn07XG5cbiQuYWRkTGlua0RlZiA9IGZ1bmN0aW9uIChjaHVuaywgbGlua0RlZikge1xuICB2YXIgcmVmTnVtYmVyID0gMDtcbiAgdmFyIGRlZnNUb0FkZCA9IHt9O1xuICBjaHVuay5iZWZvcmUgPSB0aGlzLnN0cmlwTGlua0RlZnMoY2h1bmsuYmVmb3JlLCBkZWZzVG9BZGQpO1xuICBjaHVuay5zZWxlY3Rpb24gPSB0aGlzLnN0cmlwTGlua0RlZnMoY2h1bmsuc2VsZWN0aW9uLCBkZWZzVG9BZGQpO1xuICBjaHVuay5hZnRlciA9IHRoaXMuc3RyaXBMaW5rRGVmcyhjaHVuay5hZnRlciwgZGVmc1RvQWRkKTtcblxuICB2YXIgZGVmcyA9ICcnO1xuICB2YXIgcmVnZXggPSAvKFxcWykoKD86XFxbW15cXF1dKlxcXXxbXlxcW1xcXV0pKikoXFxdWyBdPyg/OlxcblsgXSopP1xcWykoXFxkKykoXFxdKS9nO1xuXG4gIGZ1bmN0aW9uIGFkZERlZk51bWJlciAoZGVmKSB7XG4gICAgcmVmTnVtYmVyKys7XG4gICAgZGVmID0gZGVmLnJlcGxhY2UoL15bIF17MCwzfVxcWyhcXGQrKVxcXTovLCAnICBbJyArIHJlZk51bWJlciArICddOicpO1xuICAgIGRlZnMgKz0gJ1xcbicgKyBkZWY7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRMaW5rICh3aG9sZU1hdGNoLCBiZWZvcmUsIGlubmVyLCBhZnRlcklubmVyLCBpZCwgZW5kKSB7XG4gICAgaW5uZXIgPSBpbm5lci5yZXBsYWNlKHJlZ2V4LCBnZXRMaW5rKTtcbiAgICBpZiAoZGVmc1RvQWRkW2lkXSkge1xuICAgICAgYWRkRGVmTnVtYmVyKGRlZnNUb0FkZFtpZF0pO1xuICAgICAgcmV0dXJuIGJlZm9yZSArIGlubmVyICsgYWZ0ZXJJbm5lciArIHJlZk51bWJlciArIGVuZDtcbiAgICB9XG4gICAgcmV0dXJuIHdob2xlTWF0Y2g7XG4gIH1cblxuICBjaHVuay5iZWZvcmUgPSBjaHVuay5iZWZvcmUucmVwbGFjZShyZWdleCwgZ2V0TGluayk7XG5cbiAgaWYgKGxpbmtEZWYpIHtcbiAgICBhZGREZWZOdW1iZXIobGlua0RlZik7XG4gIH0gZWxzZSB7XG4gICAgY2h1bmsuc2VsZWN0aW9uID0gY2h1bmsuc2VsZWN0aW9uLnJlcGxhY2UocmVnZXgsIGdldExpbmspO1xuICB9XG5cbiAgdmFyIHJlZk91dCA9IHJlZk51bWJlcjtcblxuICBjaHVuay5hZnRlciA9IGNodW5rLmFmdGVyLnJlcGxhY2UocmVnZXgsIGdldExpbmspO1xuXG4gIGlmIChjaHVuay5hZnRlcikge1xuICAgIGNodW5rLmFmdGVyID0gY2h1bmsuYWZ0ZXIucmVwbGFjZSgvXFxuKiQvLCAnJyk7XG4gIH1cbiAgaWYgKCFjaHVuay5hZnRlcikge1xuICAgIGNodW5rLnNlbGVjdGlvbiA9IGNodW5rLnNlbGVjdGlvbi5yZXBsYWNlKC9cXG4qJC8sICcnKTtcbiAgfVxuXG4gIGNodW5rLmFmdGVyICs9ICdcXG5cXG4nICsgZGVmcztcblxuICByZXR1cm4gcmVmT3V0O1xufTtcblxuZnVuY3Rpb24gcHJvcGVybHlFbmNvZGVkIChsaW5rZGVmKSB7XG4gIGZ1bmN0aW9uIHJlcGxhY2VyICh3aG9sZW1hdGNoLCBsaW5rLCB0aXRsZSkge1xuICAgIGxpbmsgPSBsaW5rLnJlcGxhY2UoL1xcPy4qJC8sIGZ1bmN0aW9uIChxdWVyeXBhcnQpIHtcbiAgICAgIHJldHVybiBxdWVyeXBhcnQucmVwbGFjZSgvXFwrL2csICcgJyk7IC8vIGluIHRoZSBxdWVyeSBzdHJpbmcsIGEgcGx1cyBhbmQgYSBzcGFjZSBhcmUgaWRlbnRpY2FsXG4gICAgfSk7XG4gICAgbGluayA9IGRlY29kZVVSSUNvbXBvbmVudChsaW5rKTsgLy8gdW5lbmNvZGUgZmlyc3QsIHRvIHByZXZlbnQgZG91YmxlIGVuY29kaW5nXG4gICAgbGluayA9IGVuY29kZVVSSShsaW5rKS5yZXBsYWNlKC8nL2csICclMjcnKS5yZXBsYWNlKC9cXCgvZywgJyUyOCcpLnJlcGxhY2UoL1xcKS9nLCAnJTI5Jyk7XG4gICAgbGluayA9IGxpbmsucmVwbGFjZSgvXFw/LiokLywgZnVuY3Rpb24gKHF1ZXJ5cGFydCkge1xuICAgICAgcmV0dXJuIHF1ZXJ5cGFydC5yZXBsYWNlKC9cXCsvZywgJyUyYicpOyAvLyBzaW5jZSB3ZSByZXBsYWNlZCBwbHVzIHdpdGggc3BhY2VzIGluIHRoZSBxdWVyeSBwYXJ0LCBhbGwgcGx1c2VzIHRoYXQgbm93IGFwcGVhciB3aGVyZSBvcmlnaW5hbGx5IGVuY29kZWRcbiAgICB9KTtcbiAgICBpZiAodGl0bGUpIHtcbiAgICAgIHRpdGxlID0gdGl0bGUudHJpbSA/IHRpdGxlLnRyaW0oKSA6IHRpdGxlLnJlcGxhY2UoL15cXHMqLywgJycpLnJlcGxhY2UoL1xccyokLywgJycpO1xuICAgICAgdGl0bGUgPSB0aXRsZS5yZXBsYWNlKC9cIi9nLCAncXVvdDsnKS5yZXBsYWNlKC9cXCgvZywgJyYjNDA7JykucmVwbGFjZSgvXFwpL2csICcmIzQxOycpLnJlcGxhY2UoLzwvZywgJyZsdDsnKS5yZXBsYWNlKC8+L2csICcmZ3Q7Jyk7XG4gICAgfVxuICAgIHJldHVybiB0aXRsZSA/IGxpbmsgKyAnIFwiJyArIHRpdGxlICsgJ1wiJyA6IGxpbms7XG4gIH1cbiAgcmV0dXJuIGxpbmtkZWYucmVwbGFjZSgvXlxccyooLio/KSg/OlxccytcIiguKylcIik/XFxzKiQvLCByZXBsYWNlcik7XG59XG5cbiQuZG9MaW5rT3JJbWFnZSA9IGZ1bmN0aW9uIChjaHVuaywgcG9zdFByb2Nlc3NpbmcsIGlzSW1hZ2UpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgYmFja2dyb3VuZDtcblxuICBjaHVuay50cmltV2hpdGVzcGFjZSgpO1xuICBjaHVuay5maW5kVGFncygvXFxzKiE/XFxbLywgL1xcXVsgXT8oPzpcXG5bIF0qKT8oXFxbLio/XFxdKT8vKTtcblxuICBpZiAoY2h1bmsuZW5kVGFnLmxlbmd0aCA+IDEgJiYgY2h1bmsuc3RhcnRUYWcubGVuZ3RoID4gMCkge1xuICAgIGNodW5rLnN0YXJ0VGFnID0gY2h1bmsuc3RhcnRUYWcucmVwbGFjZSgvIT9cXFsvLCAnJyk7XG4gICAgY2h1bmsuZW5kVGFnID0gJyc7XG4gICAgdGhpcy5hZGRMaW5rRGVmKGNodW5rLCBudWxsKTtcbiAgfSBlbHNlIHtcbiAgICBjaHVuay5zZWxlY3Rpb24gPSBjaHVuay5zdGFydFRhZyArIGNodW5rLnNlbGVjdGlvbiArIGNodW5rLmVuZFRhZztcbiAgICBjaHVuay5zdGFydFRhZyA9IGNodW5rLmVuZFRhZyA9ICcnO1xuXG4gICAgaWYgKC9cXG5cXG4vLnRlc3QoY2h1bmsuc2VsZWN0aW9uKSkge1xuICAgICAgdGhpcy5hZGRMaW5rRGVmKGNodW5rLCBudWxsKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGlzSW1hZ2UpIHtcbiAgICAgIHVpLnByb21wdCgnaW1hZ2UnLCBsaW5rRW50ZXJlZENhbGxiYWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdWkucHJvbXB0KCdsaW5rJywgbGlua0VudGVyZWRDYWxsYmFjayk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gbGlua0VudGVyZWRDYWxsYmFjayAobGluaykge1xuICAgIGlmIChsaW5rICE9PSBudWxsKSB7XG4gICAgICBjaHVuay5zZWxlY3Rpb24gPSAoJyAnICsgY2h1bmsuc2VsZWN0aW9uKS5yZXBsYWNlKC8oW15cXFxcXSg/OlxcXFxcXFxcKSopKD89W1tcXF1dKS9nLCAnJDFcXFxcJykuc3Vic3RyKDEpO1xuXG4gICAgICB2YXIgbGlua0RlZiA9ICcgWzk5OV06ICcgKyBwcm9wZXJseUVuY29kZWQobGluayk7XG4gICAgICB2YXIgbnVtID0gc2VsZi5hZGRMaW5rRGVmKGNodW5rLCBsaW5rRGVmKTtcbiAgICAgIGNodW5rLnN0YXJ0VGFnID0gaXNJbWFnZSA/ICchWycgOiAnWyc7XG4gICAgICBjaHVuay5lbmRUYWcgPSAnXVsnICsgbnVtICsgJ10nO1xuXG4gICAgICBpZiAoIWNodW5rLnNlbGVjdGlvbikge1xuICAgICAgICBpZiAoaXNJbWFnZSkge1xuICAgICAgICAgIGNodW5rLnNlbGVjdGlvbiA9IHNlbGYuZ2V0U3RyaW5nKCdpbWFnZWRlc2NyaXB0aW9uJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2h1bmsuc2VsZWN0aW9uID0gc2VsZi5nZXRTdHJpbmcoJ2xpbmtkZXNjcmlwdGlvbicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHBvc3RQcm9jZXNzaW5nKCk7XG4gIH1cbn07XG5cbiQuZG9BdXRvaW5kZW50ID0gZnVuY3Rpb24gKGNodW5rLCBwb3N0UHJvY2Vzc2luZykge1xuICB2YXIgY29tbWFuZE1nciA9IHRoaXM7XG4gIHZhciBmYWtlU2VsZWN0aW9uID0gZmFsc2U7XG5cbiAgY2h1bmsuYmVmb3JlID0gY2h1bmsuYmVmb3JlLnJlcGxhY2UoLyhcXG58XilbIF17MCwzfShbKistXXxcXGQrWy5dKVsgXFx0XSpcXG4kLywgJ1xcblxcbicpO1xuICBjaHVuay5iZWZvcmUgPSBjaHVuay5iZWZvcmUucmVwbGFjZSgvKFxcbnxeKVsgXXswLDN9PlsgXFx0XSpcXG4kLywgJ1xcblxcbicpO1xuICBjaHVuay5iZWZvcmUgPSBjaHVuay5iZWZvcmUucmVwbGFjZSgvKFxcbnxeKVsgXFx0XStcXG4kLywgJ1xcblxcbicpO1xuXG4gIGlmICghY2h1bmsuc2VsZWN0aW9uICYmICEvXlsgXFx0XSooPzpcXG58JCkvLnRlc3QoY2h1bmsuYWZ0ZXIpKSB7XG4gICAgY2h1bmsuYWZ0ZXIgPSBjaHVuay5hZnRlci5yZXBsYWNlKC9eW15cXG5dKi8sIGZ1bmN0aW9uICh3aG9sZU1hdGNoKSB7XG4gICAgICBjaHVuay5zZWxlY3Rpb24gPSB3aG9sZU1hdGNoO1xuICAgICAgcmV0dXJuICcnO1xuICAgIH0pO1xuICAgIGZha2VTZWxlY3Rpb24gPSB0cnVlO1xuICB9XG5cbiAgaWYgKC8oXFxufF4pWyBdezAsM30oWyorLV18XFxkK1suXSlbIFxcdF0rLipcXG4kLy50ZXN0KGNodW5rLmJlZm9yZSkpIHtcbiAgICBpZiAoY29tbWFuZE1nci5kb0xpc3QpIHtcbiAgICAgIGNvbW1hbmRNZ3IuZG9MaXN0KGNodW5rKTtcbiAgICB9XG4gIH1cbiAgaWYgKC8oXFxufF4pWyBdezAsM30+WyBcXHRdKy4qXFxuJC8udGVzdChjaHVuay5iZWZvcmUpKSB7XG4gICAgaWYgKGNvbW1hbmRNZ3IuZG9CbG9ja3F1b3RlKSB7XG4gICAgICBjb21tYW5kTWdyLmRvQmxvY2txdW90ZShjaHVuayk7XG4gICAgfVxuICB9XG4gIGlmICgvKFxcbnxeKShcXHR8WyBdezQsfSkuKlxcbiQvLnRlc3QoY2h1bmsuYmVmb3JlKSkge1xuICAgIGlmIChjb21tYW5kTWdyLmRvQ29kZSkge1xuICAgICAgY29tbWFuZE1nci5kb0NvZGUoY2h1bmspO1xuICAgIH1cbiAgfVxuXG4gIGlmIChmYWtlU2VsZWN0aW9uKSB7XG4gICAgY2h1bmsuYWZ0ZXIgPSBjaHVuay5zZWxlY3Rpb24gKyBjaHVuay5hZnRlcjtcbiAgICBjaHVuay5zZWxlY3Rpb24gPSAnJztcbiAgfVxufTtcblxuJC5kb0Jsb2NrcXVvdGUgPSBmdW5jdGlvbiAoY2h1bmssIHBvc3RQcm9jZXNzaW5nKSB7XG4gIGNodW5rLnNlbGVjdGlvbiA9IGNodW5rLnNlbGVjdGlvbi5yZXBsYWNlKC9eKFxcbiopKFteXFxyXSs/KShcXG4qKSQvLFxuICAgIGZ1bmN0aW9uICh0b3RhbE1hdGNoLCBuZXdsaW5lc0JlZm9yZSwgdGV4dCwgbmV3bGluZXNBZnRlcikge1xuICAgICAgY2h1bmsuYmVmb3JlICs9IG5ld2xpbmVzQmVmb3JlO1xuICAgICAgY2h1bmsuYWZ0ZXIgPSBuZXdsaW5lc0FmdGVyICsgY2h1bmsuYWZ0ZXI7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9KTtcblxuICBjaHVuay5iZWZvcmUgPSBjaHVuay5iZWZvcmUucmVwbGFjZSgvKD5bIFxcdF0qKSQvLFxuICAgIGZ1bmN0aW9uICh0b3RhbE1hdGNoLCBibGFua0xpbmUpIHtcbiAgICAgIGNodW5rLnNlbGVjdGlvbiA9IGJsYW5rTGluZSArIGNodW5rLnNlbGVjdGlvbjtcbiAgICAgIHJldHVybiAnJztcbiAgICB9KTtcblxuICBjaHVuay5zZWxlY3Rpb24gPSBjaHVuay5zZWxlY3Rpb24ucmVwbGFjZSgvXihcXHN8PikrJC8sICcnKTtcbiAgY2h1bmsuc2VsZWN0aW9uID0gY2h1bmsuc2VsZWN0aW9uIHx8IHRoaXMuZ2V0U3RyaW5nKCdxdW90ZWV4YW1wbGUnKTtcblxuICB2YXIgbWF0Y2ggPSAnJztcbiAgdmFyIGxlZnRPdmVyID0gJyc7XG4gIHZhciBsaW5lO1xuXG4gIGlmIChjaHVuay5iZWZvcmUpIHtcbiAgICB2YXIgbGluZXMgPSBjaHVuay5iZWZvcmUucmVwbGFjZSgvXFxuJC8sICcnKS5zcGxpdCgnXFxuJyk7XG4gICAgdmFyIGluQ2hhaW4gPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZ29vZCA9IGZhbHNlO1xuICAgICAgbGluZSA9IGxpbmVzW2ldO1xuICAgICAgaW5DaGFpbiA9IGluQ2hhaW4gJiYgbGluZS5sZW5ndGggPiAwO1xuICAgICAgaWYgKC9ePi8udGVzdChsaW5lKSkge1xuICAgICAgICBnb29kID0gdHJ1ZTtcbiAgICAgICAgaWYgKCFpbkNoYWluICYmIGxpbmUubGVuZ3RoID4gMSlcbiAgICAgICAgICBpbkNoYWluID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoL15bIFxcdF0qJC8udGVzdChsaW5lKSkge1xuICAgICAgICBnb29kID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdvb2QgPSBpbkNoYWluO1xuICAgICAgfVxuICAgICAgaWYgKGdvb2QpIHtcbiAgICAgICAgbWF0Y2ggKz0gbGluZSArICdcXG4nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGVmdE92ZXIgKz0gbWF0Y2ggKyBsaW5lO1xuICAgICAgICBtYXRjaCA9ICdcXG4nO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIS8oXnxcXG4pPi8udGVzdChtYXRjaCkpIHtcbiAgICAgIGxlZnRPdmVyICs9IG1hdGNoO1xuICAgICAgbWF0Y2ggPSAnJztcbiAgICB9XG4gIH1cblxuICBjaHVuay5zdGFydFRhZyA9IG1hdGNoO1xuICBjaHVuay5iZWZvcmUgPSBsZWZ0T3ZlcjtcblxuICAvLyBlbmQgb2YgY2hhbmdlXG5cbiAgaWYgKGNodW5rLmFmdGVyKSB7XG4gICAgY2h1bmsuYWZ0ZXIgPSBjaHVuay5hZnRlci5yZXBsYWNlKC9eXFxuPy8sICdcXG4nKTtcbiAgfVxuXG4gIGNodW5rLmFmdGVyID0gY2h1bmsuYWZ0ZXIucmVwbGFjZSgvXigoKFxcbnxeKShcXG5bIFxcdF0qKSo+KC4rXFxuKSouKikrKFxcblsgXFx0XSopKikvLFxuICAgIGZ1bmN0aW9uICh0b3RhbE1hdGNoKSB7XG4gICAgICBjaHVuay5lbmRUYWcgPSB0b3RhbE1hdGNoO1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgKTtcblxuICB2YXIgcmVwbGFjZUJsYW5rc0luVGFncyA9IGZ1bmN0aW9uICh1c2VCcmFja2V0KSB7XG5cbiAgICB2YXIgcmVwbGFjZW1lbnQgPSB1c2VCcmFja2V0ID8gJz4gJyA6ICcnO1xuXG4gICAgaWYgKGNodW5rLnN0YXJ0VGFnKSB7XG4gICAgICBjaHVuay5zdGFydFRhZyA9IGNodW5rLnN0YXJ0VGFnLnJlcGxhY2UoL1xcbigoPnxcXHMpKilcXG4kLyxcbiAgICAgICAgZnVuY3Rpb24gKHRvdGFsTWF0Y2gsIG1hcmtkb3duKSB7XG4gICAgICAgICAgcmV0dXJuICdcXG4nICsgbWFya2Rvd24ucmVwbGFjZSgvXlsgXXswLDN9Pj9bIFxcdF0qJC9nbSwgcmVwbGFjZW1lbnQpICsgJ1xcbic7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoY2h1bmsuZW5kVGFnKSB7XG4gICAgICBjaHVuay5lbmRUYWcgPSBjaHVuay5lbmRUYWcucmVwbGFjZSgvXlxcbigoPnxcXHMpKilcXG4vLFxuICAgICAgICBmdW5jdGlvbiAodG90YWxNYXRjaCwgbWFya2Rvd24pIHtcbiAgICAgICAgICByZXR1cm4gJ1xcbicgKyBtYXJrZG93bi5yZXBsYWNlKC9eWyBdezAsM30+P1sgXFx0XSokL2dtLCByZXBsYWNlbWVudCkgKyAnXFxuJztcbiAgICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIGlmICgvXig/IVsgXXswLDN9PikvbS50ZXN0KGNodW5rLnNlbGVjdGlvbikpIHtcbiAgICB0aGlzLndyYXAoY2h1bmssIHNldHRpbmdzLmxpbmVMZW5ndGggLSAyKTtcbiAgICBjaHVuay5zZWxlY3Rpb24gPSBjaHVuay5zZWxlY3Rpb24ucmVwbGFjZSgvXi9nbSwgJz4gJyk7XG4gICAgcmVwbGFjZUJsYW5rc0luVGFncyh0cnVlKTtcbiAgICBjaHVuay5za2lwTGluZXMoKTtcbiAgfSBlbHNlIHtcbiAgICBjaHVuay5zZWxlY3Rpb24gPSBjaHVuay5zZWxlY3Rpb24ucmVwbGFjZSgvXlsgXXswLDN9PiA/L2dtLCAnJyk7XG4gICAgdGhpcy51bndyYXAoY2h1bmspO1xuICAgIHJlcGxhY2VCbGFua3NJblRhZ3MoZmFsc2UpO1xuXG4gICAgaWYgKCEvXihcXG58XilbIF17MCwzfT4vLnRlc3QoY2h1bmsuc2VsZWN0aW9uKSAmJiBjaHVuay5zdGFydFRhZykge1xuICAgICAgY2h1bmsuc3RhcnRUYWcgPSBjaHVuay5zdGFydFRhZy5yZXBsYWNlKC9cXG57MCwyfSQvLCAnXFxuXFxuJyk7XG4gICAgfVxuXG4gICAgaWYgKCEvKFxcbnxeKVsgXXswLDN9Pi4qJC8udGVzdChjaHVuay5zZWxlY3Rpb24pICYmIGNodW5rLmVuZFRhZykge1xuICAgICAgY2h1bmsuZW5kVGFnID0gY2h1bmsuZW5kVGFnLnJlcGxhY2UoL15cXG57MCwyfS8sICdcXG5cXG4nKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIS9cXG4vLnRlc3QoY2h1bmsuc2VsZWN0aW9uKSkge1xuICAgIGNodW5rLnNlbGVjdGlvbiA9IGNodW5rLnNlbGVjdGlvbi5yZXBsYWNlKC9eKD4gKikvLCBmdW5jdGlvbiAod2hvbGVNYXRjaCwgYmxhbmtzKSB7XG4gICAgICBjaHVuay5zdGFydFRhZyArPSBibGFua3M7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfSk7XG4gIH1cbn07XG5cbiQuZG9Db2RlID0gZnVuY3Rpb24gKGNodW5rLCBwb3N0UHJvY2Vzc2luZykge1xuXG4gIHZhciBoYXNUZXh0QmVmb3JlID0gL1xcU1sgXSokLy50ZXN0KGNodW5rLmJlZm9yZSk7XG4gIHZhciBoYXNUZXh0QWZ0ZXIgPSAvXlsgXSpcXFMvLnRlc3QoY2h1bmsuYWZ0ZXIpO1xuXG4gIC8vIFVzZSAnZm91ciBzcGFjZScgbWFya2Rvd24gaWYgdGhlIHNlbGVjdGlvbiBpcyBvbiBpdHMgb3duXG4gIC8vIGxpbmUgb3IgaXMgbXVsdGlsaW5lLlxuICBpZiAoKCFoYXNUZXh0QWZ0ZXIgJiYgIWhhc1RleHRCZWZvcmUpIHx8IC9cXG4vLnRlc3QoY2h1bmsuc2VsZWN0aW9uKSkge1xuXG4gICAgY2h1bmsuYmVmb3JlID0gY2h1bmsuYmVmb3JlLnJlcGxhY2UoL1sgXXs0fSQvLFxuICAgICAgZnVuY3Rpb24gKHRvdGFsTWF0Y2gpIHtcbiAgICAgICAgY2h1bmsuc2VsZWN0aW9uID0gdG90YWxNYXRjaCArIGNodW5rLnNlbGVjdGlvbjtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfSk7XG5cbiAgICB2YXIgbkxpbmVzQmFjayA9IDE7XG4gICAgdmFyIG5MaW5lc0ZvcndhcmQgPSAxO1xuXG4gICAgaWYgKC8oXFxufF4pKFxcdHxbIF17NCx9KS4qXFxuJC8udGVzdChjaHVuay5iZWZvcmUpKSB7XG4gICAgICBuTGluZXNCYWNrID0gMDtcbiAgICB9XG4gICAgaWYgKC9eXFxuKFxcdHxbIF17NCx9KS8udGVzdChjaHVuay5hZnRlcikpIHtcbiAgICAgIG5MaW5lc0ZvcndhcmQgPSAwO1xuICAgIH1cblxuICAgIGNodW5rLnNraXBMaW5lcyhuTGluZXNCYWNrLCBuTGluZXNGb3J3YXJkKTtcblxuICAgIGlmICghY2h1bmsuc2VsZWN0aW9uKSB7XG4gICAgICBjaHVuay5zdGFydFRhZyA9ICcgICAgJztcbiAgICAgIGNodW5rLnNlbGVjdGlvbiA9IHRoaXMuZ2V0U3RyaW5nKCdjb2RlZXhhbXBsZScpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGlmICgvXlsgXXswLDN9XFxTL20udGVzdChjaHVuay5zZWxlY3Rpb24pKSB7XG4gICAgICAgIGlmICgvXFxuLy50ZXN0KGNodW5rLnNlbGVjdGlvbikpXG4gICAgICAgICAgY2h1bmsuc2VsZWN0aW9uID0gY2h1bmsuc2VsZWN0aW9uLnJlcGxhY2UoL14vZ20sICcgICAgJyk7XG4gICAgICAgIGVsc2UgLy8gaWYgaXQncyBub3QgbXVsdGlsaW5lLCBkbyBub3Qgc2VsZWN0IHRoZSBmb3VyIGFkZGVkIHNwYWNlczsgdGhpcyBpcyBtb3JlIGNvbnNpc3RlbnQgd2l0aCB0aGUgZG9MaXN0IGJlaGF2aW9yXG4gICAgICAgICAgY2h1bmsuYmVmb3JlICs9ICcgICAgJztcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBjaHVuay5zZWxlY3Rpb24gPSBjaHVuay5zZWxlY3Rpb24ucmVwbGFjZSgvXig/OlsgXXs0fXxbIF17MCwzfVxcdCkvZ20sICcnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZWxzZSB7XG4gICAgLy8gVXNlIGJhY2t0aWNrcyAoYCkgdG8gZGVsaW1pdCB0aGUgY29kZSBibG9jay5cblxuICAgIGNodW5rLnRyaW1XaGl0ZXNwYWNlKCk7XG4gICAgY2h1bmsuZmluZFRhZ3MoL2AvLCAvYC8pO1xuXG4gICAgaWYgKCFjaHVuay5zdGFydFRhZyAmJiAhY2h1bmsuZW5kVGFnKSB7XG4gICAgICBjaHVuay5zdGFydFRhZyA9IGNodW5rLmVuZFRhZyA9ICdgJztcbiAgICAgIGlmICghY2h1bmsuc2VsZWN0aW9uKSB7XG4gICAgICAgIGNodW5rLnNlbGVjdGlvbiA9IHRoaXMuZ2V0U3RyaW5nKCdjb2RlZXhhbXBsZScpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChjaHVuay5lbmRUYWcgJiYgIWNodW5rLnN0YXJ0VGFnKSB7XG4gICAgICBjaHVuay5iZWZvcmUgKz0gY2h1bmsuZW5kVGFnO1xuICAgICAgY2h1bmsuZW5kVGFnID0gJyc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgY2h1bmsuc3RhcnRUYWcgPSBjaHVuay5lbmRUYWcgPSAnJztcbiAgICB9XG4gIH1cbn07XG5cbiQuZG9MaXN0ID0gZnVuY3Rpb24gKGNodW5rLCBwb3N0UHJvY2Vzc2luZywgaXNOdW1iZXJlZExpc3QpIHtcbiAgdmFyIHByZXZpb3VzSXRlbXNSZWdleCA9IC8oXFxufF4pKChbIF17MCwzfShbKistXXxcXGQrWy5dKVsgXFx0XSsuKikoXFxuLit8XFxuezIsfShbKistXS4qfFxcZCtbLl0pWyBcXHRdKy4qfFxcbnsyLH1bIFxcdF0rXFxTLiopKilcXG4qJC87XG4gIHZhciBuZXh0SXRlbXNSZWdleCA9IC9eXFxuKigoWyBdezAsM30oWyorLV18XFxkK1suXSlbIFxcdF0rLiopKFxcbi4rfFxcbnsyLH0oWyorLV0uKnxcXGQrWy5dKVsgXFx0XSsuKnxcXG57Mix9WyBcXHRdK1xcUy4qKSopXFxuKi87XG4gIHZhciBidWxsZXQgPSAnLSc7XG4gIHZhciBudW0gPSAxO1xuXG4gIGZ1bmN0aW9uIGdldEl0ZW1QcmVmaXggKCkge1xuICAgIHZhciBwcmVmaXg7XG4gICAgaWYgKGlzTnVtYmVyZWRMaXN0KSB7XG4gICAgICBwcmVmaXggPSAnICcgKyBudW0gKyAnLiAnO1xuICAgICAgbnVtKys7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcHJlZml4ID0gJyAnICsgYnVsbGV0ICsgJyAnO1xuICAgIH1cbiAgICByZXR1cm4gcHJlZml4O1xuICB9O1xuXG4gIGZ1bmN0aW9uIGdldFByZWZpeGVkSXRlbSAoaXRlbVRleHQpIHtcbiAgICBpZiAoaXNOdW1iZXJlZExpc3QgPT09IHZvaWQgMCkge1xuICAgICAgaXNOdW1iZXJlZExpc3QgPSAvXlxccypcXGQvLnRlc3QoaXRlbVRleHQpO1xuICAgIH1cblxuICAgIGl0ZW1UZXh0ID0gaXRlbVRleHQucmVwbGFjZSgvXlsgXXswLDN9KFsqKy1dfFxcZCtbLl0pXFxzL2dtLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZ2V0SXRlbVByZWZpeCgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGl0ZW1UZXh0O1xuICB9O1xuXG4gIGNodW5rLmZpbmRUYWdzKC8oXFxufF4pKlsgXXswLDN9KFsqKy1dfFxcZCtbLl0pXFxzKy8sIG51bGwpO1xuXG4gIGlmIChjaHVuay5iZWZvcmUgJiYgIS9cXG4kLy50ZXN0KGNodW5rLmJlZm9yZSkgJiYgIS9eXFxuLy50ZXN0KGNodW5rLnN0YXJ0VGFnKSkge1xuICAgIGNodW5rLmJlZm9yZSArPSBjaHVuay5zdGFydFRhZztcbiAgICBjaHVuay5zdGFydFRhZyA9ICcnO1xuICB9XG5cbiAgaWYgKGNodW5rLnN0YXJ0VGFnKSB7XG5cbiAgICB2YXIgaGFzRGlnaXRzID0gL1xcZCtbLl0vLnRlc3QoY2h1bmsuc3RhcnRUYWcpO1xuICAgIGNodW5rLnN0YXJ0VGFnID0gJyc7XG4gICAgY2h1bmsuc2VsZWN0aW9uID0gY2h1bmsuc2VsZWN0aW9uLnJlcGxhY2UoL1xcblsgXXs0fS9nLCAnXFxuJyk7XG4gICAgdGhpcy51bndyYXAoY2h1bmspO1xuICAgIGNodW5rLnNraXBMaW5lcygpO1xuXG4gICAgaWYgKGhhc0RpZ2l0cykge1xuICAgICAgY2h1bmsuYWZ0ZXIgPSBjaHVuay5hZnRlci5yZXBsYWNlKG5leHRJdGVtc1JlZ2V4LCBnZXRQcmVmaXhlZEl0ZW0pO1xuICAgIH1cbiAgICBpZiAoaXNOdW1iZXJlZExpc3QgPT0gaGFzRGlnaXRzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgdmFyIG5MaW5lc1VwID0gMTtcblxuICBjaHVuay5iZWZvcmUgPSBjaHVuay5iZWZvcmUucmVwbGFjZShwcmV2aW91c0l0ZW1zUmVnZXgsXG4gICAgZnVuY3Rpb24gKGl0ZW1UZXh0KSB7XG4gICAgICBpZiAoL15cXHMqKFsqKy1dKS8udGVzdChpdGVtVGV4dCkpIHtcbiAgICAgICAgYnVsbGV0ID0gcmUuJDE7XG4gICAgICB9XG4gICAgICBuTGluZXNVcCA9IC9bXlxcbl1cXG5cXG5bXlxcbl0vLnRlc3QoaXRlbVRleHQpID8gMSA6IDA7XG4gICAgICByZXR1cm4gZ2V0UHJlZml4ZWRJdGVtKGl0ZW1UZXh0KTtcbiAgICB9KTtcblxuICBpZiAoIWNodW5rLnNlbGVjdGlvbikge1xuICAgIGNodW5rLnNlbGVjdGlvbiA9IHRoaXMuZ2V0U3RyaW5nKCdsaXRlbScpO1xuICB9XG5cbiAgdmFyIHByZWZpeCA9IGdldEl0ZW1QcmVmaXgoKTtcbiAgdmFyIG5MaW5lc0Rvd24gPSAxO1xuXG4gIGNodW5rLmFmdGVyID0gY2h1bmsuYWZ0ZXIucmVwbGFjZShuZXh0SXRlbXNSZWdleCwgZnVuY3Rpb24gKGl0ZW1UZXh0KSB7XG4gICAgbkxpbmVzRG93biA9IC9bXlxcbl1cXG5cXG5bXlxcbl0vLnRlc3QoaXRlbVRleHQpID8gMSA6IDA7XG4gICAgcmV0dXJuIGdldFByZWZpeGVkSXRlbShpdGVtVGV4dCk7XG4gIH0pO1xuICBjaHVuay50cmltV2hpdGVzcGFjZSh0cnVlKTtcbiAgY2h1bmsuc2tpcExpbmVzKG5MaW5lc1VwLCBuTGluZXNEb3duLCB0cnVlKTtcbiAgY2h1bmsuc3RhcnRUYWcgPSBwcmVmaXg7XG4gIHZhciBzcGFjZXMgPSBwcmVmaXgucmVwbGFjZSgvLi9nLCAnICcpO1xuICB0aGlzLndyYXAoY2h1bmssIHNldHRpbmdzLmxpbmVMZW5ndGggLSBzcGFjZXMubGVuZ3RoKTtcbiAgY2h1bmsuc2VsZWN0aW9uID0gY2h1bmsuc2VsZWN0aW9uLnJlcGxhY2UoL1xcbi9nLCAnXFxuJyArIHNwYWNlcyk7XG5cbn07XG5cbiQuZG9IZWFkaW5nID0gZnVuY3Rpb24gKGNodW5rLCBwb3N0UHJvY2Vzc2luZykge1xuICBjaHVuay5zZWxlY3Rpb24gPSBjaHVuay5zZWxlY3Rpb24ucmVwbGFjZSgvXFxzKy9nLCAnICcpO1xuICBjaHVuay5zZWxlY3Rpb24gPSBjaHVuay5zZWxlY3Rpb24ucmVwbGFjZSgvKF5cXHMrfFxccyskKS9nLCAnJyk7XG5cbiAgaWYgKCFjaHVuay5zZWxlY3Rpb24pIHtcbiAgICBjaHVuay5zdGFydFRhZyA9ICcjIyAnO1xuICAgIGNodW5rLnNlbGVjdGlvbiA9IHRoaXMuZ2V0U3RyaW5nKCdoZWFkaW5nZXhhbXBsZScpO1xuICAgIGNodW5rLmVuZFRhZyA9ICcnO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBoZWFkZXJMZXZlbCA9IDA7XG5cbiAgY2h1bmsuZmluZFRhZ3MoLyMrWyBdKi8sIC9bIF0qIysvKTtcbiAgaWYgKC8jKy8udGVzdChjaHVuay5zdGFydFRhZykpIHtcbiAgICBoZWFkZXJMZXZlbCA9IHJlLmxhc3RNYXRjaC5sZW5ndGg7XG4gIH1cbiAgY2h1bmsuc3RhcnRUYWcgPSBjaHVuay5lbmRUYWcgPSAnJztcbiAgY2h1bmsuZmluZFRhZ3MobnVsbCwgL1xccz8oLSt8PSspLyk7XG4gIGlmICgvPSsvLnRlc3QoY2h1bmsuZW5kVGFnKSkge1xuICAgIGhlYWRlckxldmVsID0gMTtcbiAgfVxuICBpZiAoLy0rLy50ZXN0KGNodW5rLmVuZFRhZykpIHtcbiAgICBoZWFkZXJMZXZlbCA9IDI7XG4gIH1cblxuICBjaHVuay5zdGFydFRhZyA9IGNodW5rLmVuZFRhZyA9ICcnO1xuICBjaHVuay5za2lwTGluZXMoMSwgMSk7XG5cbiAgdmFyIGhlYWRlckxldmVsVG9DcmVhdGUgPSBoZWFkZXJMZXZlbCA9PSAxID8gMiA6IGhlYWRlckxldmVsIC0gMTtcbiAgaWYgKGhlYWRlckxldmVsVG9DcmVhdGUgPiAwKSB7XG4gICAgY2h1bmsuZW5kVGFnID0gJ1xcbic7XG4gICAgd2hpbGUgKGhlYWRlckxldmVsVG9DcmVhdGUtLSkge1xuICAgICAgY2h1bmsuc3RhcnRUYWcgKz0gJyMnO1xuICAgIH1cbiAgICBjaHVuay5zdGFydFRhZyArPSAnICc7XG4gIH1cbn07XG5cbiQuZG9Ib3Jpem9udGFsUnVsZSA9IGZ1bmN0aW9uIChjaHVuaywgcG9zdFByb2Nlc3NpbmcpIHtcbiAgY2h1bmsuc3RhcnRUYWcgPSAnLS0tLS0tLS0tLVxcbic7XG4gIGNodW5rLnNlbGVjdGlvbiA9ICcnO1xuICBjaHVuay5za2lwTGluZXMoMiwgMSwgdHJ1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tbWFuZE1hbmFnZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBlbWl0dGVyID0gcmVxdWlyZSgnY29udHJhLmVtaXR0ZXInKTtcbnZhciB1aSA9IHJlcXVpcmUoJy4vdWknKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgcG9zaXRpb24gPSByZXF1aXJlKCcuL3Bvc2l0aW9uJyk7XG52YXIgUGFuZWxDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi9QYW5lbENvbGxlY3Rpb24nKTtcbnZhciBVbmRvTWFuYWdlciA9IHJlcXVpcmUoJy4vVW5kb01hbmFnZXInKTtcbnZhciBVSU1hbmFnZXIgPSByZXF1aXJlKCcuL1VJTWFuYWdlcicpO1xudmFyIENvbW1hbmRNYW5hZ2VyID0gcmVxdWlyZSgnLi9Db21tYW5kTWFuYWdlcicpO1xudmFyIFByZXZpZXdNYW5hZ2VyID0gcmVxdWlyZSgnLi9QcmV2aWV3TWFuYWdlcicpO1xuXG52YXIgZGVmYXVsdHNTdHJpbmdzID0ge1xuICBib2xkOiAnU3Ryb25nIDxzdHJvbmc+IEN0cmwrQicsXG4gIGJvbGRleGFtcGxlOiAnc3Ryb25nIHRleHQnLFxuICBjb2RlOiAnQ29kZSBTYW1wbGUgPHByZT48Y29kZT4gQ3RybCtLJyxcbiAgY29kZWV4YW1wbGU6ICdlbnRlciBjb2RlIGhlcmUnLFxuICBoZWFkaW5nOiAnSGVhZGluZyA8aDE+LzxoMj4gQ3RybCtIJyxcbiAgaGVhZGluZ2V4YW1wbGU6ICdIZWFkaW5nJyxcbiAgaGVscDogJ01hcmtkb3duIEVkaXRpbmcgSGVscCcsXG4gIGhyOiAnSG9yaXpvbnRhbCBSdWxlIDxocj4gQ3RybCtSJyxcbiAgaW1hZ2U6ICdJbWFnZSA8aW1nPiBDdHJsK0cnLFxuICBpbWFnZWRlc2NyaXB0aW9uOiAnZW50ZXIgaW1hZ2UgZGVzY3JpcHRpb24gaGVyZScsXG4gIGl0YWxpYzogJ0VtcGhhc2lzIDxlbT4gQ3RybCtJJyxcbiAgaXRhbGljZXhhbXBsZTogJ2VtcGhhc2l6ZWQgdGV4dCcsXG4gIGxpbms6ICdIeXBlcmxpbmsgPGE+IEN0cmwrTCcsXG4gIGxpbmtkZXNjcmlwdGlvbjogJ2VudGVyIGxpbmsgZGVzY3JpcHRpb24gaGVyZScsXG4gIGxpdGVtOiAnTGlzdCBpdGVtJyxcbiAgb2xpc3Q6ICdOdW1iZXJlZCBMaXN0IDxvbD4gQ3RybCtPJyxcbiAgcXVvdGU6ICdCbG9ja3F1b3RlIDxibG9ja3F1b3RlPiBDdHJsK1EnLFxuICBxdW90ZWV4YW1wbGU6ICdCbG9ja3F1b3RlJyxcbiAgcmVkbzogJ1JlZG8gLSBDdHJsK1knLFxuICByZWRvbWFjOiAnUmVkbyAtIEN0cmwrU2hpZnQrWicsXG4gIHVsaXN0OiAnQnVsbGV0ZWQgTGlzdCA8dWw+IEN0cmwrVScsXG4gIHVuZG86ICdVbmRvIC0gQ3RybCtaJ1xufTtcblxuZnVuY3Rpb24gRWRpdG9yIChwb3N0Zml4LCBvcHRzKSB7XG4gIHZhciBvcHRpb25zID0gb3B0cyB8fCB7fTtcblxuICBpZiAodHlwZW9mIG9wdGlvbnMuaGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykgeyAvL2JhY2t3YXJkcyBjb21wYXRpYmxlIGJlaGF2aW9yXG4gICAgb3B0aW9ucyA9IHsgaGVscEJ1dHRvbjogb3B0aW9ucyB9O1xuICB9XG4gIG9wdGlvbnMuc3RyaW5ncyA9IG9wdGlvbnMuc3RyaW5ncyB8fCB7fTtcbiAgaWYgKG9wdGlvbnMuaGVscEJ1dHRvbikge1xuICAgIG9wdGlvbnMuc3RyaW5ncy5oZWxwID0gb3B0aW9ucy5zdHJpbmdzLmhlbHAgfHwgb3B0aW9ucy5oZWxwQnV0dG9uLnRpdGxlO1xuICB9XG4gIGZ1bmN0aW9uIGdldFN0cmluZyAoaWRlbnRpZmllcikge1xuICAgIHJldHVybiBvcHRpb25zLnN0cmluZ3NbaWRlbnRpZmllcl0gfHwgZGVmYXVsdHNTdHJpbmdzW2lkZW50aWZpZXJdO1xuICB9XG5cbiAgdmFyIGFwaSA9IGVtaXR0ZXIoKTtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgcGFuZWxzO1xuXG4gIHNlbGYucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChwYW5lbHMpIHtcbiAgICAgIHJldHVybjsgLy8gYWxyZWFkeSBpbml0aWFsaXplZFxuICAgIH1cblxuICAgIHBhbmVscyA9IG5ldyBQYW5lbENvbGxlY3Rpb24ocG9zdGZpeCk7XG5cbiAgICB2YXIgY29tbWFuZE1hbmFnZXIgPSBuZXcgQ29tbWFuZE1hbmFnZXIoZ2V0U3RyaW5nKTtcbiAgICB2YXIgcHJldmlld01hbmFnZXIgPSBuZXcgUHJldmlld01hbmFnZXIocGFuZWxzLCBmdW5jdGlvbiAoKSB7XG4gICAgICBhcGkuZW1pdCgncmVmcmVzaCcpO1xuICAgIH0pO1xuICAgIHZhciB1aU1hbmFnZXI7XG5cbiAgICB2YXIgdW5kb01hbmFnZXIgPSBuZXcgVW5kb01hbmFnZXIoZnVuY3Rpb24gKCkge1xuICAgICAgcHJldmlld01hbmFnZXIucmVmcmVzaCgpO1xuICAgICAgaWYgKHVpTWFuYWdlcikgeyAvLyBub3QgYXZhaWxhYmxlIG9uIHRoZSBmaXJzdCBjYWxsXG4gICAgICAgIHVpTWFuYWdlci5zZXRVbmRvUmVkb0J1dHRvblN0YXRlcygpO1xuICAgICAgfVxuICAgIH0sIHBhbmVscyk7XG5cbiAgICB1aU1hbmFnZXIgPSBuZXcgVUlNYW5hZ2VyKHBvc3RmaXgsIHBhbmVscywgdW5kb01hbmFnZXIsIHByZXZpZXdNYW5hZ2VyLCBjb21tYW5kTWFuYWdlciwgb3B0aW9ucy5oZWxwQnV0dG9uLCBnZXRTdHJpbmcpO1xuICAgIHVpTWFuYWdlci5zZXRVbmRvUmVkb0J1dHRvblN0YXRlcygpO1xuXG4gICAgYXBpLnJlZnJlc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICBwcmV2aWV3TWFuYWdlci5yZWZyZXNoKHRydWUpO1xuICAgIH07XG4gICAgYXBpLnJlZnJlc2goKTtcbiAgfTtcblxuICBzZWxmLmFwaSA9IGFwaTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFZGl0b3I7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIFBhbmVsQ29sbGVjdGlvbiAocG9zdGZpeCkge1xuICB0aGlzLmJ1dHRvbkJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbWstYnV0dG9ucy0nICsgcG9zdGZpeCk7XG4gIHRoaXMucHJldmlldyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbWstcHJldmlldy0nICsgcG9zdGZpeCk7XG4gIHRoaXMuaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG1rLWlucHV0LScgKyBwb3N0Zml4KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQYW5lbENvbGxlY3Rpb247XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQ7XG52YXIgdWEgPSByZXF1aXJlKCcuL3VhJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIHBhcnNlID0gcmVxdWlyZSgnLi9wYXJzZScpO1xudmFyIHBvc2l0aW9uID0gcmVxdWlyZSgnLi9wb3NpdGlvbicpO1xuXG5mdW5jdGlvbiBQcmV2aWV3TWFuYWdlciAocGFuZWxzLCBwcmV2aWV3UmVmcmVzaENhbGxiYWNrKSB7XG4gIHZhciBtYW5hZ2VyT2JqID0gdGhpcztcbiAgdmFyIHRpbWVvdXQ7XG4gIHZhciBlbGFwc2VkVGltZTtcbiAgdmFyIG9sZElucHV0VGV4dDtcbiAgdmFyIG1heERlbGF5ID0gMzAwMDtcbiAgdmFyIHN0YXJ0VHlwZSA9ICdkZWxheWVkJzsgLy8gVGhlIG90aGVyIGxlZ2FsIHZhbHVlIGlzICdtYW51YWwnXG5cbiAgLy8gQWRkcyBldmVudCBsaXN0ZW5lcnMgdG8gZWxlbWVudHNcbiAgdmFyIHNldHVwRXZlbnRzID0gZnVuY3Rpb24gKGlucHV0RWxlbSwgbGlzdGVuZXIpIHtcblxuICAgIHV0aWwuYWRkRXZlbnQoaW5wdXRFbGVtLCAnaW5wdXQnLCBsaXN0ZW5lcik7XG4gICAgaW5wdXRFbGVtLm9ucGFzdGUgPSBsaXN0ZW5lcjtcbiAgICBpbnB1dEVsZW0ub25kcm9wID0gbGlzdGVuZXI7XG5cbiAgICB1dGlsLmFkZEV2ZW50KGlucHV0RWxlbSwgJ2tleXByZXNzJywgbGlzdGVuZXIpO1xuICAgIHV0aWwuYWRkRXZlbnQoaW5wdXRFbGVtLCAna2V5ZG93bicsIGxpc3RlbmVyKTtcbiAgfTtcblxuICB2YXIgZ2V0RG9jU2Nyb2xsVG9wID0gZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIHJlc3VsdCA9IDA7XG5cbiAgICBpZiAod2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICByZXN1bHQgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgfSBlbHNlIGlmIChkb2MuZG9jdW1lbnRFbGVtZW50ICYmIGRvYy5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wKSB7XG4gICAgICByZXN1bHQgPSBkb2MuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcbiAgICB9IGVsc2UgaWYgKGRvYy5ib2R5KSB7XG4gICAgICByZXN1bHQgPSBkb2MuYm9keS5zY3JvbGxUb3A7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICB2YXIgbWFrZVByZXZpZXdIdG1sID0gZnVuY3Rpb24gKCkge1xuXG4gICAgLy8gSWYgdGhlcmUgaXMgbm8gcmVnaXN0ZXJlZCBwcmV2aWV3IHBhbmVsXG4gICAgLy8gdGhlcmUgaXMgbm90aGluZyB0byBkby5cbiAgICBpZiAoIXBhbmVscy5wcmV2aWV3KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHRleHQgPSBwYW5lbHMuaW5wdXQudmFsdWU7XG4gICAgaWYgKHRleHQgJiYgdGV4dCA9PSBvbGRJbnB1dFRleHQpIHtcbiAgICAgIHJldHVybjsgLy8gSW5wdXQgdGV4dCBoYXNuJ3QgY2hhbmdlZC5cbiAgICB9IGVsc2Uge1xuICAgICAgb2xkSW5wdXRUZXh0ID0gdGV4dDtcbiAgICB9XG5cbiAgICB2YXIgcHJldlRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAgIHRleHQgPSBwYXJzZSh0ZXh0KTtcblxuICAgIC8vIENhbGN1bGF0ZSB0aGUgcHJvY2Vzc2luZyB0aW1lIG9mIHRoZSBIVE1MIGNyZWF0aW9uLlxuICAgIC8vIEl0J3MgdXNlZCBhcyB0aGUgZGVsYXkgdGltZSBpbiB0aGUgZXZlbnQgbGlzdGVuZXIuXG4gICAgdmFyIGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgZWxhcHNlZFRpbWUgPSBjdXJyVGltZSAtIHByZXZUaW1lO1xuXG4gICAgcHVzaFByZXZpZXdIdG1sKHRleHQpO1xuICB9O1xuXG4gIC8vIHNldFRpbWVvdXQgaXMgYWxyZWFkeSB1c2VkLiAgVXNlZCBhcyBhbiBldmVudCBsaXN0ZW5lci5cbiAgdmFyIGFwcGx5VGltZW91dCA9IGZ1bmN0aW9uICgpIHtcblxuICAgIGlmICh0aW1lb3V0KSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICB0aW1lb3V0ID0gdm9pZCAwO1xuICAgIH1cblxuICAgIGlmIChzdGFydFR5cGUgIT09ICdtYW51YWwnKSB7XG5cbiAgICAgIHZhciBkZWxheSA9IDA7XG5cbiAgICAgIGlmIChzdGFydFR5cGUgPT09ICdkZWxheWVkJykge1xuICAgICAgICBkZWxheSA9IGVsYXBzZWRUaW1lO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGVsYXkgPiBtYXhEZWxheSkge1xuICAgICAgICBkZWxheSA9IG1heERlbGF5O1xuICAgICAgfVxuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobWFrZVByZXZpZXdIdG1sLCBkZWxheSk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBnZXRTY2FsZUZhY3RvciA9IGZ1bmN0aW9uIChwYW5lbCkge1xuICAgIGlmIChwYW5lbC5zY3JvbGxIZWlnaHQgPD0gcGFuZWwuY2xpZW50SGVpZ2h0KSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9XG4gICAgcmV0dXJuIHBhbmVsLnNjcm9sbFRvcCAvIChwYW5lbC5zY3JvbGxIZWlnaHQgLSBwYW5lbC5jbGllbnRIZWlnaHQpO1xuICB9O1xuXG4gIHZhciBzZXRQYW5lbFNjcm9sbFRvcHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHBhbmVscy5wcmV2aWV3KSB7XG4gICAgICBwYW5lbHMucHJldmlldy5zY3JvbGxUb3AgPSAocGFuZWxzLnByZXZpZXcuc2Nyb2xsSGVpZ2h0IC0gcGFuZWxzLnByZXZpZXcuY2xpZW50SGVpZ2h0KSAqIGdldFNjYWxlRmFjdG9yKHBhbmVscy5wcmV2aWV3KTtcbiAgICB9XG4gIH07XG5cbiAgdGhpcy5yZWZyZXNoID0gZnVuY3Rpb24gKHJlcXVpcmVzUmVmcmVzaCkge1xuXG4gICAgaWYgKHJlcXVpcmVzUmVmcmVzaCkge1xuICAgICAgb2xkSW5wdXRUZXh0ID0gJyc7XG4gICAgICBtYWtlUHJldmlld0h0bWwoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBhcHBseVRpbWVvdXQoKTtcbiAgICB9XG4gIH07XG5cbiAgdGhpcy5wcm9jZXNzaW5nVGltZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZWxhcHNlZFRpbWU7XG4gIH07XG5cbiAgdmFyIGlzRmlyc3RUaW1lRmlsbGVkID0gdHJ1ZTtcblxuICAvLyBJRSBkb2Vzbid0IGxldCB5b3UgdXNlIGlubmVySFRNTCBpZiB0aGUgZWxlbWVudCBpcyBjb250YWluZWQgc29tZXdoZXJlIGluIGEgdGFibGVcbiAgLy8gKHdoaWNoIGlzIHRoZSBjYXNlIGZvciBpbmxpbmUgZWRpdGluZykgLS0gaW4gdGhhdCBjYXNlLCBkZXRhY2ggdGhlIGVsZW1lbnQsIHNldCB0aGVcbiAgLy8gdmFsdWUsIGFuZCByZWF0dGFjaC4gWWVzLCB0aGF0ICppcyogcmlkaWN1bG91cy5cbiAgdmFyIGllU2FmZVByZXZpZXdTZXQgPSBmdW5jdGlvbiAodGV4dCkge1xuICAgIHZhciBwcmV2aWV3ID0gcGFuZWxzLnByZXZpZXc7XG4gICAgdmFyIHBhcmVudCA9IHByZXZpZXcucGFyZW50Tm9kZTtcbiAgICB2YXIgc2libGluZyA9IHByZXZpZXcubmV4dFNpYmxpbmc7XG4gICAgcGFyZW50LnJlbW92ZUNoaWxkKHByZXZpZXcpO1xuICAgIHByZXZpZXcuaW5uZXJIVE1MID0gdGV4dDtcbiAgICBpZiAoIXNpYmxpbmcpXG4gICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQocHJldmlldyk7XG4gICAgZWxzZVxuICAgICAgcGFyZW50Lmluc2VydEJlZm9yZShwcmV2aWV3LCBzaWJsaW5nKTtcbiAgfVxuXG4gIHZhciBub25TdWNreUJyb3dzZXJQcmV2aWV3U2V0ID0gZnVuY3Rpb24gKHRleHQpIHtcbiAgICBwYW5lbHMucHJldmlldy5pbm5lckhUTUwgPSB0ZXh0O1xuICB9XG5cbiAgdmFyIHByZXZpZXdTZXR0ZXI7XG5cbiAgdmFyIHByZXZpZXdTZXQgPSBmdW5jdGlvbiAodGV4dCkge1xuICAgIGlmIChwcmV2aWV3U2V0dGVyKVxuICAgICAgcmV0dXJuIHByZXZpZXdTZXR0ZXIodGV4dCk7XG5cbiAgICB0cnkge1xuICAgICAgbm9uU3Vja3lCcm93c2VyUHJldmlld1NldCh0ZXh0KTtcbiAgICAgIHByZXZpZXdTZXR0ZXIgPSBub25TdWNreUJyb3dzZXJQcmV2aWV3U2V0O1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHByZXZpZXdTZXR0ZXIgPSBpZVNhZmVQcmV2aWV3U2V0O1xuICAgICAgcHJldmlld1NldHRlcih0ZXh0KTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIHB1c2hQcmV2aWV3SHRtbCA9IGZ1bmN0aW9uICh0ZXh0KSB7XG5cbiAgICB2YXIgZW1wdHlUb3AgPSBwb3NpdGlvbi5nZXRUb3AocGFuZWxzLmlucHV0KSAtIGdldERvY1Njcm9sbFRvcCgpO1xuXG4gICAgaWYgKHBhbmVscy5wcmV2aWV3KSB7XG4gICAgICBwcmV2aWV3U2V0KHRleHQpO1xuICAgICAgcHJldmlld1JlZnJlc2hDYWxsYmFjaygpO1xuICAgIH1cblxuICAgIHNldFBhbmVsU2Nyb2xsVG9wcygpO1xuXG4gICAgaWYgKGlzRmlyc3RUaW1lRmlsbGVkKSB7XG4gICAgICBpc0ZpcnN0VGltZUZpbGxlZCA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBmdWxsVG9wID0gcG9zaXRpb24uZ2V0VG9wKHBhbmVscy5pbnB1dCkgLSBnZXREb2NTY3JvbGxUb3AoKTtcblxuICAgIGlmICh1YS5pc0lFKSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2luZG93LnNjcm9sbEJ5KDAsIGZ1bGxUb3AgLSBlbXB0eVRvcCk7XG4gICAgICB9LCAwKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB3aW5kb3cuc2Nyb2xsQnkoMCwgZnVsbFRvcCAtIGVtcHR5VG9wKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICBzZXR1cEV2ZW50cyhwYW5lbHMuaW5wdXQsIGFwcGx5VGltZW91dCk7XG4gICAgbWFrZVByZXZpZXdIdG1sKCk7XG5cbiAgICBpZiAocGFuZWxzLnByZXZpZXcpIHtcbiAgICAgIHBhbmVscy5wcmV2aWV3LnNjcm9sbFRvcCA9IDA7XG4gICAgfVxuICB9O1xuXG4gIGluaXQoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUHJldmlld01hbmFnZXI7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZG9jID0gZ2xvYmFsLmRvY3VtZW50O1xudmFyIENodW5rcyA9IHJlcXVpcmUoJy4vQ2h1bmtzJyk7XG52YXIgdWEgPSByZXF1aXJlKCcuL3VhJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG5mdW5jdGlvbiBUZXh0YXJlYVN0YXRlIChwYW5lbHMsIGlzSW5pdGlhbFN0YXRlKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGlucHV0ID0gcGFuZWxzLmlucHV0O1xuXG4gIHNlbGYuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXV0aWwuaXNWaXNpYmxlKGlucHV0KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWlzSW5pdGlhbFN0YXRlICYmIGRvYy5hY3RpdmVFbGVtZW50ICYmIGRvYy5hY3RpdmVFbGVtZW50ICE9PSBpbnB1dCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHNlbGYuc2V0SW5wdXRTZWxlY3Rpb25TdGFydEVuZCgpO1xuICAgIHNlbGYuc2Nyb2xsVG9wID0gaW5wdXQuc2Nyb2xsVG9wO1xuICAgIGlmICghc2VsZi50ZXh0ICYmIGlucHV0LnNlbGVjdGlvblN0YXJ0IHx8IGlucHV0LnNlbGVjdGlvblN0YXJ0ID09PSAwKSB7XG4gICAgICBzZWxmLnRleHQgPSBpbnB1dC52YWx1ZTtcbiAgICB9XG4gIH1cblxuICBzZWxmLnNldElucHV0U2VsZWN0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdXRpbC5pc1Zpc2libGUoaW5wdXQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGlucHV0LnNlbGVjdGlvblN0YXJ0ICE9PSB2b2lkIDAgJiYgIXVhLmlzT3BlcmEpIHtcbiAgICAgIGlucHV0LmZvY3VzKCk7XG4gICAgICBpbnB1dC5zZWxlY3Rpb25TdGFydCA9IHNlbGYuc3RhcnQ7XG4gICAgICBpbnB1dC5zZWxlY3Rpb25FbmQgPSBzZWxmLmVuZDtcbiAgICAgIGlucHV0LnNjcm9sbFRvcCA9IHNlbGYuc2Nyb2xsVG9wO1xuICAgIH0gZWxzZSBpZiAoZG9jLnNlbGVjdGlvbikge1xuICAgICAgaWYgKGRvYy5hY3RpdmVFbGVtZW50ICYmIGRvYy5hY3RpdmVFbGVtZW50ICE9PSBpbnB1dCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlucHV0LmZvY3VzKCk7XG4gICAgICB2YXIgcmFuZ2UgPSBpbnB1dC5jcmVhdGVUZXh0UmFuZ2UoKTtcbiAgICAgIHJhbmdlLm1vdmVTdGFydCgnY2hhcmFjdGVyJywgLWlucHV0LnZhbHVlLmxlbmd0aCk7XG4gICAgICByYW5nZS5tb3ZlRW5kKCdjaGFyYWN0ZXInLCAtaW5wdXQudmFsdWUubGVuZ3RoKTtcbiAgICAgIHJhbmdlLm1vdmVFbmQoJ2NoYXJhY3RlcicsIHNlbGYuZW5kKTtcbiAgICAgIHJhbmdlLm1vdmVTdGFydCgnY2hhcmFjdGVyJywgc2VsZi5zdGFydCk7XG4gICAgICByYW5nZS5zZWxlY3QoKTtcbiAgICB9XG4gIH07XG5cbiAgc2VsZi5zZXRJbnB1dFNlbGVjdGlvblN0YXJ0RW5kID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghcGFuZWxzLmllQ2FjaGVkUmFuZ2UgJiYgKGlucHV0LnNlbGVjdGlvblN0YXJ0IHx8IGlucHV0LnNlbGVjdGlvblN0YXJ0ID09PSAwKSkge1xuICAgICAgc2VsZi5zdGFydCA9IGlucHV0LnNlbGVjdGlvblN0YXJ0O1xuICAgICAgc2VsZi5lbmQgPSBpbnB1dC5zZWxlY3Rpb25FbmQ7XG4gICAgfSBlbHNlIGlmIChkb2Muc2VsZWN0aW9uKSB7XG4gICAgICBzZWxmLnRleHQgPSB1dGlsLmZpeEVvbENoYXJzKGlucHV0LnZhbHVlKTtcblxuICAgICAgdmFyIHJhbmdlID0gcGFuZWxzLmllQ2FjaGVkUmFuZ2UgfHwgZG9jLnNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpO1xuICAgICAgdmFyIGZpeGVkUmFuZ2UgPSB1dGlsLmZpeEVvbENoYXJzKHJhbmdlLnRleHQpO1xuICAgICAgdmFyIG1hcmtlciA9ICdcXHgwNyc7XG4gICAgICB2YXIgbWFya2VkUmFuZ2UgPSBtYXJrZXIgKyBmaXhlZFJhbmdlICsgbWFya2VyO1xuICAgICAgcmFuZ2UudGV4dCA9IG1hcmtlZFJhbmdlO1xuICAgICAgdmFyIGlucHV0VGV4dCA9IHV0aWwuZml4RW9sQ2hhcnMoaW5wdXQudmFsdWUpO1xuXG4gICAgICByYW5nZS5tb3ZlU3RhcnQoJ2NoYXJhY3RlcicsIC1tYXJrZWRSYW5nZS5sZW5ndGgpO1xuICAgICAgcmFuZ2UudGV4dCA9IGZpeGVkUmFuZ2U7XG5cbiAgICAgIHNlbGYuc3RhcnQgPSBpbnB1dFRleHQuaW5kZXhPZihtYXJrZXIpO1xuICAgICAgc2VsZi5lbmQgPSBpbnB1dFRleHQubGFzdEluZGV4T2YobWFya2VyKSAtIG1hcmtlci5sZW5ndGg7XG5cbiAgICAgIHZhciBsZW4gPSBzZWxmLnRleHQubGVuZ3RoIC0gdXRpbC5maXhFb2xDaGFycyhpbnB1dC52YWx1ZSkubGVuZ3RoO1xuICAgICAgaWYgKGxlbikge1xuICAgICAgICByYW5nZS5tb3ZlU3RhcnQoJ2NoYXJhY3RlcicsIC1maXhlZFJhbmdlLmxlbmd0aCk7XG4gICAgICAgIHdoaWxlIChsZW4tLSkge1xuICAgICAgICAgIGZpeGVkUmFuZ2UgKz0gJ1xcbic7XG4gICAgICAgICAgc2VsZi5lbmQgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByYW5nZS50ZXh0ID0gZml4ZWRSYW5nZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBhbmVscy5pZUNhY2hlZFJhbmdlKSB7XG4gICAgICAgIHNlbGYuc2Nyb2xsVG9wID0gcGFuZWxzLmllQ2FjaGVkU2Nyb2xsVG9wO1xuICAgICAgfVxuICAgICAgcGFuZWxzLmllQ2FjaGVkUmFuZ2UgPSBudWxsO1xuICAgICAgc2VsZi5zZXRJbnB1dFNlbGVjdGlvbigpO1xuICAgIH1cbiAgfTtcblxuIHNlbGYucmVzdG9yZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoc2VsZi50ZXh0ICE9IHZvaWQgMCAmJiBzZWxmLnRleHQgIT0gaW5wdXQudmFsdWUpIHtcbiAgICAgIGlucHV0LnZhbHVlID0gc2VsZi50ZXh0O1xuICAgIH1cbiAgICBzZWxmLnNldElucHV0U2VsZWN0aW9uKCk7XG4gICAgaW5wdXQuc2Nyb2xsVG9wID0gc2VsZi5zY3JvbGxUb3A7XG4gIH07XG5cbiAgc2VsZi5nZXRDaHVua3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNodW5rID0gbmV3IENodW5rcygpO1xuICAgIGNodW5rLmJlZm9yZSA9IHV0aWwuZml4RW9sQ2hhcnMoc2VsZi50ZXh0LnN1YnN0cmluZygwLCBzZWxmLnN0YXJ0KSk7XG4gICAgY2h1bmsuc3RhcnRUYWcgPSAnJztcbiAgICBjaHVuay5zZWxlY3Rpb24gPSB1dGlsLmZpeEVvbENoYXJzKHNlbGYudGV4dC5zdWJzdHJpbmcoc2VsZi5zdGFydCwgc2VsZi5lbmQpKTtcbiAgICBjaHVuay5lbmRUYWcgPSAnJztcbiAgICBjaHVuay5hZnRlciA9IHV0aWwuZml4RW9sQ2hhcnMoc2VsZi50ZXh0LnN1YnN0cmluZyhzZWxmLmVuZCkpO1xuICAgIGNodW5rLnNjcm9sbFRvcCA9IHNlbGYuc2Nyb2xsVG9wO1xuICAgIHJldHVybiBjaHVuaztcbiAgfTtcblxuICBzZWxmLnNldENodW5rcyA9IGZ1bmN0aW9uIChjaHVuaykge1xuICAgIGNodW5rLmJlZm9yZSA9IGNodW5rLmJlZm9yZSArIGNodW5rLnN0YXJ0VGFnO1xuICAgIGNodW5rLmFmdGVyID0gY2h1bmsuZW5kVGFnICsgY2h1bmsuYWZ0ZXI7XG4gICAgc2VsZi5zdGFydCA9IGNodW5rLmJlZm9yZS5sZW5ndGg7XG4gICAgc2VsZi5lbmQgPSBjaHVuay5iZWZvcmUubGVuZ3RoICsgY2h1bmsuc2VsZWN0aW9uLmxlbmd0aDtcbiAgICBzZWxmLnRleHQgPSBjaHVuay5iZWZvcmUgKyBjaHVuay5zZWxlY3Rpb24gKyBjaHVuay5hZnRlcjtcbiAgICBzZWxmLnNjcm9sbFRvcCA9IGNodW5rLnNjcm9sbFRvcDtcbiAgfTtcblxuICBzZWxmLmluaXQoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVGV4dGFyZWFTdGF0ZTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQ7XG52YXIgYyA9IGRvYy5jcmVhdGVFbGVtZW50LmJpbmQoZG9jKTtcbnZhciB1YSA9IHJlcXVpcmUoJy4vdWEnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgVGV4dGFyZWFTdGF0ZSA9IHJlcXVpcmUoJy4vVGV4dGFyZWFTdGF0ZScpO1xuXG5mdW5jdGlvbiBVSU1hbmFnZXIgKHBvc3RmaXgsIHBhbmVscywgdW5kb01hbmFnZXIsIHByZXZpZXdNYW5hZ2VyLCBjb21tYW5kTWFuYWdlciwgaGVscE9wdGlvbnMsIGdldFN0cmluZykge1xuICB2YXIgaW5wdXRCb3ggPSBwYW5lbHMuaW5wdXQ7XG4gIHZhciBidXR0b25zID0ge307XG5cbiAgbWFrZVNwcml0ZWRCdXR0b25Sb3coKTtcblxuICB2YXIga2V5RXZlbnQgPSAna2V5ZG93bic7XG4gIGlmICh1YS5pc09wZXJhKSB7XG4gICAga2V5RXZlbnQgPSAna2V5cHJlc3MnO1xuICB9XG5cbiAgdXRpbC5hZGRFdmVudChpbnB1dEJveCwga2V5RXZlbnQsIGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAoKCFrZXkuY3RybEtleSAmJiAha2V5Lm1ldGFLZXkpIHx8IGtleS5hbHRLZXkgfHwga2V5LnNoaWZ0S2V5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGtleUNvZGUgPSBrZXkuY2hhckNvZGUgfHwga2V5LmtleUNvZGU7XG4gICAgdmFyIGtleUNvZGVTdHIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGtleUNvZGUpLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBzd2l0Y2ggKGtleUNvZGVTdHIpIHtcbiAgICAgIGNhc2UgJ2InOiBkb0NsaWNrKGJ1dHRvbnMuYm9sZCk7IGJyZWFrO1xuICAgICAgY2FzZSAnaSc6IGRvQ2xpY2soYnV0dG9ucy5pdGFsaWMpOyBicmVhaztcbiAgICAgIGNhc2UgJ2wnOiBkb0NsaWNrKGJ1dHRvbnMubGluayk7IGJyZWFrO1xuICAgICAgY2FzZSAncSc6IGRvQ2xpY2soYnV0dG9ucy5xdW90ZSk7IGJyZWFrO1xuICAgICAgY2FzZSAnayc6IGRvQ2xpY2soYnV0dG9ucy5jb2RlKTsgYnJlYWs7XG4gICAgICBjYXNlICdnJzogZG9DbGljayhidXR0b25zLmltYWdlKTsgYnJlYWs7XG4gICAgICBjYXNlICdvJzogZG9DbGljayhidXR0b25zLm9saXN0KTsgYnJlYWs7XG4gICAgICBjYXNlICd1JzogZG9DbGljayhidXR0b25zLnVsaXN0KTsgYnJlYWs7XG4gICAgICBjYXNlICdoJzogZG9DbGljayhidXR0b25zLmhlYWRpbmcpOyBicmVhaztcbiAgICAgIGNhc2UgJ3InOiBkb0NsaWNrKGJ1dHRvbnMuaHIpOyBicmVhaztcbiAgICAgIGNhc2UgJ3knOiBkb0NsaWNrKGJ1dHRvbnMucmVkbyk7IGJyZWFrO1xuICAgICAgY2FzZSAneic6XG4gICAgICAgIGlmIChrZXkuc2hpZnRLZXkpIHtcbiAgICAgICAgICBkb0NsaWNrKGJ1dHRvbnMucmVkbyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZG9DbGljayhidXR0b25zLnVuZG8pO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChrZXkucHJldmVudERlZmF1bHQpIHtcbiAgICAgIGtleS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgICBpZiAod2luZG93LmV2ZW50KSB7XG4gICAgICB3aW5kb3cuZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICB9XG4gIH0pO1xuXG4gIHV0aWwuYWRkRXZlbnQoaW5wdXRCb3gsICdrZXl1cCcsIGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAoa2V5LnNoaWZ0S2V5ICYmICFrZXkuY3RybEtleSAmJiAha2V5Lm1ldGFLZXkpIHtcbiAgICAgIHZhciBrZXlDb2RlID0ga2V5LmNoYXJDb2RlIHx8IGtleS5rZXlDb2RlO1xuXG4gICAgICBpZiAoa2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgdmFyIGZha2VCdXR0b24gPSB7fTtcbiAgICAgICAgZmFrZUJ1dHRvbi50ZXh0T3AgPSBiaW5kQ29tbWFuZCgnZG9BdXRvaW5kZW50Jyk7XG4gICAgICAgIGRvQ2xpY2soZmFrZUJ1dHRvbik7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBpZiAodWEuaXNJRSkge1xuICAgIHV0aWwuYWRkRXZlbnQoaW5wdXRCb3gsICdrZXlkb3duJywgZnVuY3Rpb24gKGtleSkge1xuICAgICAgdmFyIGNvZGUgPSBrZXkua2V5Q29kZTtcbiAgICAgIGlmIChjb2RlID09PSAyNykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIGRvQ2xpY2sgKGJ1dHRvbikge1xuICAgIGlucHV0Qm94LmZvY3VzKCk7XG5cbiAgICBpZiAoYnV0dG9uLnRleHRPcCkge1xuICAgICAgaWYgKHVuZG9NYW5hZ2VyKSB7XG4gICAgICAgIHVuZG9NYW5hZ2VyLnNldENvbW1hbmRNb2RlKCk7XG4gICAgICB9XG5cbiAgICAgIHZhciBzdGF0ZSA9IG5ldyBUZXh0YXJlYVN0YXRlKHBhbmVscyk7XG5cbiAgICAgIGlmICghc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgY2h1bmtzID0gc3RhdGUuZ2V0Q2h1bmtzKCk7XG4gICAgICB2YXIgbm9DbGVhbnVwID0gYnV0dG9uLnRleHRPcChjaHVua3MsIGZpeHVwSW5wdXRBcmVhKTtcblxuICAgICAgaWYgKCFub0NsZWFudXApIHtcbiAgICAgICAgZml4dXBJbnB1dEFyZWEoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGJ1dHRvbi5leGVjdXRlKSB7XG4gICAgICBidXR0b24uZXhlY3V0ZSh1bmRvTWFuYWdlcik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZml4dXBJbnB1dEFyZWEgKCkge1xuICAgICAgaW5wdXRCb3guZm9jdXMoKTtcblxuICAgICAgaWYgKGNodW5rcykge1xuICAgICAgICBzdGF0ZS5zZXRDaHVua3MoY2h1bmtzKTtcbiAgICAgIH1cbiAgICAgIHN0YXRlLnJlc3RvcmUoKTtcbiAgICAgIHByZXZpZXdNYW5hZ2VyLnJlZnJlc2goKTtcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gc2V0dXBCdXR0b24gKGJ1dHRvbiwgaXNFbmFibGVkKSB7XG4gICAgdmFyIG5vcm1hbFlTaGlmdCA9ICcwcHgnO1xuICAgIHZhciBkaXNhYmxlZFlTaGlmdCA9ICctMjBweCc7XG4gICAgdmFyIGhpZ2hsaWdodFlTaGlmdCA9ICctNDBweCc7XG4gICAgdmFyIGltYWdlID0gYnV0dG9uLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzcGFuJylbMF07XG4gICAgaWYgKGlzRW5hYmxlZCkge1xuICAgICAgYnV0dG9uLm9ubW91c2VvdmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpbWFnZS5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSB0aGlzLlhTaGlmdCArICcgJyArIGhpZ2hsaWdodFlTaGlmdDtcbiAgICAgIH07XG4gICAgICBidXR0b24ub25tb3VzZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaW1hZ2Uuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gdGhpcy5YU2hpZnQgKyAnICcgKyBub3JtYWxZU2hpZnQ7XG4gICAgICB9O1xuICAgICAgYnV0dG9uLm9ubW91c2VvdXQoKTtcblxuICAgICAgaWYgKHVhLmlzSUUpIHtcbiAgICAgICAgYnV0dG9uLm9ubW91c2Vkb3duID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmIChkb2MuYWN0aXZlRWxlbWVudCAmJiBkb2MuYWN0aXZlRWxlbWVudCAhPT0gcGFuZWxzLmlucHV0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHBhbmVscy5pZUNhY2hlZFJhbmdlID0gZG9jdW1lbnQuc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKCk7XG4gICAgICAgICAgcGFuZWxzLmllQ2FjaGVkU2Nyb2xsVG9wID0gcGFuZWxzLmlucHV0LnNjcm9sbFRvcDtcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFidXR0b24uaXNIZWxwKSB7XG4gICAgICAgIGJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICh0aGlzLm9ubW91c2VvdXQpIHtcbiAgICAgICAgICAgIHRoaXMub25tb3VzZW91dCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkb0NsaWNrKHRoaXMpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpbWFnZS5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSBidXR0b24uWFNoaWZ0ICsgJyAnICsgZGlzYWJsZWRZU2hpZnQ7XG4gICAgICBidXR0b24ub25tb3VzZW92ZXIgPSBidXR0b24ub25tb3VzZW91dCA9IGJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24gKCkgeyB9O1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGJpbmRDb21tYW5kIChtZXRob2QpIHtcbiAgICBpZiAodHlwZW9mIG1ldGhvZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIG1ldGhvZCA9IGNvbW1hbmRNYW5hZ2VyW21ldGhvZF07XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICBtZXRob2QuYXBwbHkoY29tbWFuZE1hbmFnZXIsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1ha2VTcHJpdGVkQnV0dG9uUm93ICgpIHtcbiAgICB2YXIgYnV0dG9uQmFyID0gcGFuZWxzLmJ1dHRvbkJhcjtcbiAgICB2YXIgbm9ybWFsWVNoaWZ0ID0gJzBweCc7XG4gICAgdmFyIGRpc2FibGVkWVNoaWZ0ID0gJy0yMHB4JztcbiAgICB2YXIgaGlnaGxpZ2h0WVNoaWZ0ID0gJy00MHB4JztcblxuICAgIHZhciBidXR0b25Sb3cgPSBjKCd1bCcpO1xuICAgIGJ1dHRvblJvdy5pZCA9ICdwbWstYnV0dG9uLXJvdy0nICsgcG9zdGZpeDtcbiAgICBidXR0b25Sb3cuY2xhc3NOYW1lID0gJ3Btay1idXR0b24tcm93JztcbiAgICBidXR0b25Sb3cgPSBidXR0b25CYXIuYXBwZW5kQ2hpbGQoYnV0dG9uUm93KTtcblxuICAgIGZ1bmN0aW9uIG1ha2VCdXR0b24gKGlkLCB0aXRsZSwgWFNoaWZ0LCB0ZXh0T3ApIHtcbiAgICAgIHZhciBidXR0b24gPSBjKCdsaScpO1xuICAgICAgYnV0dG9uLmNsYXNzTmFtZSA9ICdwbWstYnV0dG9uICcgKyBpZDtcbiAgICAgIHZhciBidXR0b25JbWFnZSA9IGMoJ3NwYW4nKTtcbiAgICAgIGJ1dHRvbi5pZCA9IGlkICsgJy0nICsgcG9zdGZpeDtcbiAgICAgIGJ1dHRvbi5hcHBlbmRDaGlsZChidXR0b25JbWFnZSk7XG4gICAgICBidXR0b24udGl0bGUgPSB0aXRsZTtcbiAgICAgIGJ1dHRvbi5YU2hpZnQgPSBYU2hpZnQ7XG4gICAgICBpZiAodGV4dE9wKSB7XG4gICAgICAgIGJ1dHRvbi50ZXh0T3AgPSB0ZXh0T3A7XG4gICAgICB9XG4gICAgICBzZXR1cEJ1dHRvbihidXR0b24sIHRydWUpO1xuICAgICAgYnV0dG9uUm93LmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gICAgICByZXR1cm4gYnV0dG9uO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VTcGFjZXIgKG51bSkge1xuICAgICAgdmFyIHNwYWNlciA9IGMoJ2xpJyk7XG4gICAgICBzcGFjZXIuY2xhc3NOYW1lID0gJ3Btay1zcGFjZXIgcG1rLXNwYWNlci0nICsgbnVtO1xuICAgICAgc3BhY2VyLmlkID0gJ3Btay1zcGFjZXItJyArIHBvc3RmaXggKyAnLScgKyBudW07XG4gICAgICBidXR0b25Sb3cuYXBwZW5kQ2hpbGQoc3BhY2VyKTtcbiAgICB9XG5cbiAgICBidXR0b25zLmJvbGQgPSBtYWtlQnV0dG9uKCdwbWstYm9sZC1idXR0b24nLCBnZXRTdHJpbmcoJ2JvbGQnKSwgJzBweCcsIGJpbmRDb21tYW5kKCdkb0JvbGQnKSk7XG4gICAgYnV0dG9ucy5pdGFsaWMgPSBtYWtlQnV0dG9uKCdwbWstaXRhbGljLWJ1dHRvbicsIGdldFN0cmluZygnaXRhbGljJyksICctMjBweCcsIGJpbmRDb21tYW5kKCdkb0l0YWxpYycpKTtcbiAgICBtYWtlU3BhY2VyKDEpO1xuICAgIGJ1dHRvbnMubGluayA9IG1ha2VCdXR0b24oJ3Btay1saW5rLWJ1dHRvbicsIGdldFN0cmluZygnbGluaycpLCAnLTQwcHgnLCBiaW5kQ29tbWFuZChmdW5jdGlvbiAoY2h1bmssIHBvc3RQcm9jZXNzaW5nKSB7XG4gICAgICByZXR1cm4gdGhpcy5kb0xpbmtPckltYWdlKGNodW5rLCBwb3N0UHJvY2Vzc2luZywgZmFsc2UpO1xuICAgIH0pKTtcbiAgICBidXR0b25zLnF1b3RlID0gbWFrZUJ1dHRvbigncG1rLXF1b3RlLWJ1dHRvbicsIGdldFN0cmluZygncXVvdGUnKSwgJy02MHB4JywgYmluZENvbW1hbmQoJ2RvQmxvY2txdW90ZScpKTtcbiAgICBidXR0b25zLmNvZGUgPSBtYWtlQnV0dG9uKCdwbWstY29kZS1idXR0b24nLCBnZXRTdHJpbmcoJ2NvZGUnKSwgJy04MHB4JywgYmluZENvbW1hbmQoJ2RvQ29kZScpKTtcbiAgICBidXR0b25zLmltYWdlID0gbWFrZUJ1dHRvbigncG1rLWltYWdlLWJ1dHRvbicsIGdldFN0cmluZygnaW1hZ2UnKSwgJy0xMDBweCcsIGJpbmRDb21tYW5kKGZ1bmN0aW9uIChjaHVuaywgcG9zdFByb2Nlc3NpbmcpIHtcbiAgICAgIHJldHVybiB0aGlzLmRvTGlua09ySW1hZ2UoY2h1bmssIHBvc3RQcm9jZXNzaW5nLCB0cnVlKTtcbiAgICB9KSk7XG4gICAgbWFrZVNwYWNlcigyKTtcbiAgICBidXR0b25zLm9saXN0ID0gbWFrZUJ1dHRvbigncG1rLW9saXN0LWJ1dHRvbicsIGdldFN0cmluZygnb2xpc3QnKSwgJy0xMjBweCcsIGJpbmRDb21tYW5kKGZ1bmN0aW9uIChjaHVuaywgcG9zdFByb2Nlc3NpbmcpIHtcbiAgICAgIHRoaXMuZG9MaXN0KGNodW5rLCBwb3N0UHJvY2Vzc2luZywgdHJ1ZSk7XG4gICAgfSkpO1xuICAgIGJ1dHRvbnMudWxpc3QgPSBtYWtlQnV0dG9uKCdwbWstdWxpc3QtYnV0dG9uJywgZ2V0U3RyaW5nKCd1bGlzdCcpLCAnLTE0MHB4JywgYmluZENvbW1hbmQoZnVuY3Rpb24gKGNodW5rLCBwb3N0UHJvY2Vzc2luZykge1xuICAgICAgdGhpcy5kb0xpc3QoY2h1bmssIHBvc3RQcm9jZXNzaW5nLCBmYWxzZSk7XG4gICAgfSkpO1xuICAgIGJ1dHRvbnMuaGVhZGluZyA9IG1ha2VCdXR0b24oJ3Btay1oZWFkaW5nLWJ1dHRvbicsIGdldFN0cmluZygnaGVhZGluZycpLCAnLTE2MHB4JywgYmluZENvbW1hbmQoJ2RvSGVhZGluZycpKTtcbiAgICBidXR0b25zLmhyID0gbWFrZUJ1dHRvbigncG1rLWhyLWJ1dHRvbicsIGdldFN0cmluZygnaHInKSwgJy0xODBweCcsIGJpbmRDb21tYW5kKCdkb0hvcml6b250YWxSdWxlJykpO1xuICAgIG1ha2VTcGFjZXIoMyk7XG4gICAgYnV0dG9ucy51bmRvID0gbWFrZUJ1dHRvbigncG1rLXVuZG8tYnV0dG9uJywgZ2V0U3RyaW5nKCd1bmRvJyksICctMjAwcHgnLCBudWxsKTtcbiAgICBidXR0b25zLnVuZG8uZXhlY3V0ZSA9IGZ1bmN0aW9uIChtYW5hZ2VyKSB7XG4gICAgICBpZiAobWFuYWdlcikge1xuICAgICAgICBtYW5hZ2VyLnVuZG8oKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIHJlZG9UaXRsZSA9IGdldFN0cmluZyh1YS5pc1dpZG5vd3MgPyAncmVkbycgOiAncmVkb21hYycpO1xuXG4gICAgYnV0dG9ucy5yZWRvID0gbWFrZUJ1dHRvbigncG1rLXJlZG8tYnV0dG9uJywgcmVkb1RpdGxlLCAnLTIyMHB4JywgbnVsbCk7XG4gICAgYnV0dG9ucy5yZWRvLmV4ZWN1dGUgPSBmdW5jdGlvbiAobWFuYWdlcikge1xuICAgICAgaWYgKG1hbmFnZXIpIHtcbiAgICAgICAgbWFuYWdlci5yZWRvKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmIChoZWxwT3B0aW9ucykge1xuICAgICAgdmFyIGhlbHBCdXR0b24gPSBjKCdsaScpO1xuICAgICAgdmFyIGhlbHBCdXR0b25JbWFnZSA9IGMoJ3NwYW4nKTtcbiAgICAgIGhlbHBCdXR0b24uYXBwZW5kQ2hpbGQoaGVscEJ1dHRvbkltYWdlKTtcbiAgICAgIGhlbHBCdXR0b24uY2xhc3NOYW1lID0gJ3Btay1idXR0b24gcG1rLWhlbHAtYnV0dG9uJztcbiAgICAgIGhlbHBCdXR0b24uaWQgPSAncG1rLWhlbHAtYnV0dG9uLScgKyBwb3N0Zml4O1xuICAgICAgaGVscEJ1dHRvbi5YU2hpZnQgPSAnLTI0MHB4JztcbiAgICAgIGhlbHBCdXR0b24uaXNIZWxwID0gdHJ1ZTtcbiAgICAgIGhlbHBCdXR0b24uc3R5bGUucmlnaHQgPSAnMHB4JztcbiAgICAgIGhlbHBCdXR0b24udGl0bGUgPSBnZXRTdHJpbmcoJ2hlbHAnKTtcbiAgICAgIGhlbHBCdXR0b24ub25jbGljayA9IGhlbHBPcHRpb25zLmhhbmRsZXI7XG5cbiAgICAgIHNldHVwQnV0dG9uKGhlbHBCdXR0b24sIHRydWUpO1xuICAgICAgYnV0dG9uUm93LmFwcGVuZENoaWxkKGhlbHBCdXR0b24pO1xuICAgICAgYnV0dG9ucy5oZWxwID0gaGVscEJ1dHRvbjtcbiAgICB9XG5cbiAgICBzZXRVbmRvUmVkb0J1dHRvblN0YXRlcygpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0VW5kb1JlZG9CdXR0b25TdGF0ZXMgKCkge1xuICAgIGlmICh1bmRvTWFuYWdlcikge1xuICAgICAgc2V0dXBCdXR0b24oYnV0dG9ucy51bmRvLCB1bmRvTWFuYWdlci5jYW5VbmRvKCkpO1xuICAgICAgc2V0dXBCdXR0b24oYnV0dG9ucy5yZWRvLCB1bmRvTWFuYWdlci5jYW5SZWRvKCkpO1xuICAgIH1cbiAgfTtcblxuICB0aGlzLnNldFVuZG9SZWRvQnV0dG9uU3RhdGVzID0gc2V0VW5kb1JlZG9CdXR0b25TdGF0ZXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVUlNYW5hZ2VyO1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHVhID0gcmVxdWlyZSgnLi91YScpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciBUZXh0YXJlYVN0YXRlID0gcmVxdWlyZSgnLi9UZXh0YXJlYVN0YXRlJyk7XG5cbmZ1bmN0aW9uIFVuZG9NYW5hZ2VyIChjYWxsYmFjaywgcGFuZWxzKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIHVuZG9TdGFjayA9IFtdO1xuICB2YXIgc3RhY2tQdHIgPSAwO1xuICB2YXIgbW9kZSA9ICdub25lJztcbiAgdmFyIGxhc3RTdGF0ZTtcbiAgdmFyIHRpbWVyO1xuICB2YXIgaW5wdXRTdGF0ZTtcblxuICBmdW5jdGlvbiBzZXRNb2RlIChuZXdNb2RlLCBub1NhdmUpIHtcbiAgICBpZiAobW9kZSAhPSBuZXdNb2RlKSB7XG4gICAgICBtb2RlID0gbmV3TW9kZTtcbiAgICAgIGlmICghbm9TYXZlKSB7XG4gICAgICAgIHNhdmVTdGF0ZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghdWEuaXNJRSB8fCBtb2RlICE9ICdtb3ZpbmcnKSB7XG4gICAgICB0aW1lciA9IHNldFRpbWVvdXQocmVmcmVzaFN0YXRlLCAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5wdXRTdGF0ZSA9IG51bGw7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIHJlZnJlc2hTdGF0ZSAoaXNJbml0aWFsU3RhdGUpIHtcbiAgICBpbnB1dFN0YXRlID0gbmV3IFRleHRhcmVhU3RhdGUocGFuZWxzLCBpc0luaXRpYWxTdGF0ZSk7XG4gICAgdGltZXIgPSB2b2lkIDA7XG4gIH1cblxuICBzZWxmLnNldENvbW1hbmRNb2RlID0gZnVuY3Rpb24gKCkge1xuICAgIG1vZGUgPSAnY29tbWFuZCc7XG4gICAgc2F2ZVN0YXRlKCk7XG4gICAgdGltZXIgPSBzZXRUaW1lb3V0KHJlZnJlc2hTdGF0ZSwgMCk7XG4gIH07XG5cbiAgc2VsZi5jYW5VbmRvID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBzdGFja1B0ciA+IDE7XG4gIH07XG5cbiAgc2VsZi5jYW5SZWRvID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB1bmRvU3RhY2tbc3RhY2tQdHIgKyAxXTtcbiAgfTtcblxuICBzZWxmLnVuZG8gPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHNlbGYuY2FuVW5kbygpKSB7XG4gICAgICBpZiAobGFzdFN0YXRlKSB7XG4gICAgICAgIGxhc3RTdGF0ZS5yZXN0b3JlKCk7XG4gICAgICAgIGxhc3RTdGF0ZSA9IG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1bmRvU3RhY2tbc3RhY2tQdHJdID0gbmV3IFRleHRhcmVhU3RhdGUocGFuZWxzKTtcbiAgICAgICAgdW5kb1N0YWNrWy0tc3RhY2tQdHJdLnJlc3RvcmUoKTtcblxuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIG1vZGUgPSAnbm9uZSc7XG4gICAgcGFuZWxzLmlucHV0LmZvY3VzKCk7XG4gICAgcmVmcmVzaFN0YXRlKCk7XG4gIH07XG5cbiAgc2VsZi5yZWRvID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChzZWxmLmNhblJlZG8oKSkge1xuICAgICAgdW5kb1N0YWNrWysrc3RhY2tQdHJdLnJlc3RvcmUoKTtcblxuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbW9kZSA9ICdub25lJztcbiAgICBwYW5lbHMuaW5wdXQuZm9jdXMoKTtcbiAgICByZWZyZXNoU3RhdGUoKTtcbiAgfTtcblxuICBmdW5jdGlvbiBzYXZlU3RhdGUgKCkge1xuICAgIHZhciBjdXJyU3RhdGUgPSBpbnB1dFN0YXRlIHx8IG5ldyBUZXh0YXJlYVN0YXRlKHBhbmVscyk7XG5cbiAgICBpZiAoIWN1cnJTdGF0ZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAobW9kZSA9PSAnbW92aW5nJykge1xuICAgICAgaWYgKCFsYXN0U3RhdGUpIHtcbiAgICAgICAgbGFzdFN0YXRlID0gY3VyclN0YXRlO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAobGFzdFN0YXRlKSB7XG4gICAgICBpZiAodW5kb1N0YWNrW3N0YWNrUHRyIC0gMV0udGV4dCAhPSBsYXN0U3RhdGUudGV4dCkge1xuICAgICAgICB1bmRvU3RhY2tbc3RhY2tQdHIrK10gPSBsYXN0U3RhdGU7XG4gICAgICB9XG4gICAgICBsYXN0U3RhdGUgPSBudWxsO1xuICAgIH1cbiAgICB1bmRvU3RhY2tbc3RhY2tQdHIrK10gPSBjdXJyU3RhdGU7XG4gICAgdW5kb1N0YWNrW3N0YWNrUHRyICsgMV0gPSBudWxsO1xuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwcmV2ZW50Q3RybFlaIChldmVudCkge1xuICAgIHZhciBrZXlDb2RlID0gZXZlbnQuY2hhckNvZGUgfHwgZXZlbnQua2V5Q29kZTtcbiAgICB2YXIgeXogPSBrZXlDb2RlID09IDg5IHx8IGtleUNvZGUgPT0gOTA7XG4gICAgdmFyIGN0cmwgPSBldmVudC5jdHJsS2V5IHx8IGV2ZW50Lm1ldGFLZXk7XG4gICAgaWYgKGN0cmwgJiYgeXopIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGhhbmRsZUN0cmxZWiAoZXZlbnQpIHtcbiAgICB2YXIgaGFuZGxlZCA9IGZhbHNlO1xuICAgIHZhciBrZXlDb2RlID0gZXZlbnQuY2hhckNvZGUgfHwgZXZlbnQua2V5Q29kZTtcbiAgICB2YXIga2V5Q29kZUNoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGtleUNvZGUpO1xuXG4gICAgaWYgKGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQubWV0YUtleSkge1xuICAgICAgc3dpdGNoIChrZXlDb2RlQ2hhci50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgIGNhc2UgJ3knOlxuICAgICAgICAgIHNlbGYucmVkbygpO1xuICAgICAgICAgIGhhbmRsZWQgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ3onOlxuICAgICAgICAgIGlmICghZXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgICAgICAgIHNlbGYudW5kbygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHNlbGYucmVkbygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBoYW5kbGVkID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaGFuZGxlZCkge1xuICAgICAgaWYgKGV2ZW50LnByZXZlbnREZWZhdWx0KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgICBpZiAod2luZG93LmV2ZW50KSB7XG4gICAgICAgIHdpbmRvdy5ldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZU1vZGVDaGFuZ2UgKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQubWV0YUtleSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcblxuICAgIGlmICgoa2V5Q29kZSA+PSAzMyAmJiBrZXlDb2RlIDw9IDQwKSB8fCAoa2V5Q29kZSA+PSA2MzIzMiAmJiBrZXlDb2RlIDw9IDYzMjM1KSkge1xuICAgICAgc2V0TW9kZSgnbW92aW5nJyk7XG4gICAgfSBlbHNlIGlmIChrZXlDb2RlID09IDggfHwga2V5Q29kZSA9PSA0NiB8fCBrZXlDb2RlID09IDEyNykge1xuICAgICAgc2V0TW9kZSgnZGVsZXRpbmcnKTtcbiAgICB9IGVsc2UgaWYgKGtleUNvZGUgPT0gMTMpIHtcbiAgICAgIHNldE1vZGUoJ25ld2xpbmVzJyk7XG4gICAgfSBlbHNlIGlmIChrZXlDb2RlID09IDI3KSB7XG4gICAgICBzZXRNb2RlKCdlc2NhcGUnKTtcbiAgICB9IGVsc2UgaWYgKChrZXlDb2RlIDwgMTYgfHwga2V5Q29kZSA+IDIwKSAmJiBrZXlDb2RlICE9IDkxKSB7XG4gICAgICBzZXRNb2RlKCd0eXBpbmcnKTtcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gc2V0RXZlbnRIYW5kbGVycyAoKSB7XG4gICAgdXRpbC5hZGRFdmVudChwYW5lbHMuaW5wdXQsICdrZXlwcmVzcycsIHByZXZlbnRDdHJsWVopO1xuICAgIHV0aWwuYWRkRXZlbnQocGFuZWxzLmlucHV0LCAna2V5ZG93bicsIGhhbmRsZUN0cmxZWik7XG4gICAgdXRpbC5hZGRFdmVudChwYW5lbHMuaW5wdXQsICdrZXlkb3duJywgaGFuZGxlTW9kZUNoYW5nZSk7XG4gICAgdXRpbC5hZGRFdmVudChwYW5lbHMuaW5wdXQsICdtb3VzZWRvd24nLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZXRNb2RlKCdtb3ZpbmcnKTtcbiAgICB9KTtcblxuICAgIHBhbmVscy5pbnB1dC5vbnBhc3RlID0gaGFuZGxlUGFzdGU7XG4gICAgcGFuZWxzLmlucHV0Lm9uZHJvcCA9IGhhbmRsZVBhc3RlO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlUGFzdGUgKCkge1xuICAgIGlmICh1YS5pc0lFIHx8IChpbnB1dFN0YXRlICYmIGlucHV0U3RhdGUudGV4dCAhPSBwYW5lbHMuaW5wdXQudmFsdWUpKSB7XG4gICAgICBpZiAodGltZXIgPT0gdm9pZCAwKSB7XG4gICAgICAgIG1vZGUgPSAncGFzdGUnO1xuICAgICAgICBzYXZlU3RhdGUoKTtcbiAgICAgICAgcmVmcmVzaFN0YXRlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5pdCAoKSB7XG4gICAgc2V0RXZlbnRIYW5kbGVycygpO1xuICAgIHJlZnJlc2hTdGF0ZSh0cnVlKTtcbiAgICBzYXZlU3RhdGUoKTtcbiAgfTtcblxuICBpbml0KCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVW5kb01hbmFnZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB0cmltID0gL15cXHMrfFxccyskL2c7XG52YXIgd2hpdGVzcGFjZSA9IC9cXHMrL2c7XG5cbmZ1bmN0aW9uIGludGVycHJldCAoaW5wdXQpIHtcbiAgcmV0dXJuIHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycgPyBpbnB1dC5yZXBsYWNlKHRyaW0sICcnKS5zcGxpdCh3aGl0ZXNwYWNlKSA6IGlucHV0O1xufVxuXG5mdW5jdGlvbiBjbGFzc2VzIChub2RlKSB7XG4gIHJldHVybiBub2RlLmNsYXNzTmFtZS5yZXBsYWNlKHRyaW0sICcnKS5zcGxpdCh3aGl0ZXNwYWNlKTtcbn1cblxuZnVuY3Rpb24gc2V0IChub2RlLCBpbnB1dCkge1xuICBub2RlLmNsYXNzTmFtZSA9IGlucHV0LmpvaW4oJyAnKTtcbn1cblxuZnVuY3Rpb24gYWRkIChub2RlLCBpbnB1dCkge1xuICB2YXIgY3VycmVudCA9IHJlbW92ZShub2RlLCBpbnB1dCk7XG4gIHZhciB2YWx1ZXMgPSBpbnRlcnByZXQoaW5wdXQpO1xuICBjdXJyZW50LnB1c2guYXBwbHkoY3VycmVudCwgdmFsdWVzKTtcbiAgc2V0KG5vZGUsIGN1cnJlbnQpO1xuICByZXR1cm4gY3VycmVudDtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlIChub2RlLCBpbnB1dCkge1xuICB2YXIgY3VycmVudCA9IGNsYXNzZXMobm9kZSk7XG4gIHZhciB2YWx1ZXMgPSBpbnRlcnByZXQoaW5wdXQpO1xuICB2YWx1ZXMuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB2YXIgaSA9IGN1cnJlbnQuaW5kZXhPZih2YWx1ZSk7XG4gICAgaWYgKGkgIT09IC0xKSB7XG4gICAgICBjdXJyZW50LnNwbGljZShpLCAxKTtcbiAgICB9XG4gIH0pO1xuICBzZXQobm9kZSwgY3VycmVudCk7XG4gIHJldHVybiBjdXJyZW50O1xufVxuXG5mdW5jdGlvbiBjb250YWlucyAobm9kZSwgaW5wdXQpIHtcbiAgdmFyIGN1cnJlbnQgPSBjbGFzc2VzKG5vZGUpO1xuICB2YXIgdmFsdWVzID0gaW50ZXJwcmV0KGlucHV0KTtcblxuICByZXR1cm4gdmFsdWVzLmV2ZXJ5KGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiBjdXJyZW50LmluZGV4T2YodmFsdWUpICE9PSAtMTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhZGQ6IGFkZCxcbiAgcmVtb3ZlOiByZW1vdmUsXG4gIGNvbnRhaW5zOiBjb250YWlucyxcbiAgc2V0OiBzZXQsXG4gIGdldDogY2xhc3Nlc1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gY29uZmlndXJlIChvcHRzKSB7XG4gIHZhciBvID0gb3B0cyB8fCB7fTtcbiAgaWYgKG8uaW1hZ2VVcGxvYWRzKSB7XG4gICAgaWYgKHR5cGVvZiBvLmltYWdlVXBsb2FkcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbmZpZ3VyZS5pbWFnZVVwbG9hZHMgPSB7XG4gICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgIHVybDogby5pbWFnZVVwbG9hZHMsXG4gICAgICAgIGtleTogJ2ltYWdlJ1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uZmlndXJlLmltYWdlVXBsb2FkcyA9IG8uaW1hZ2VVcGxvYWRzO1xuICAgIH1cbiAgfVxuICBpZiAoby5tYXJrZG93bikge1xuICAgIGNvbmZpZ3VyZS5tYXJrZG93biA9IG8ubWFya2Rvd247XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb25maWd1cmU7XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQ7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGVsZW0sIHR5cGUpIHtcbiAgdmFyIGU7XG5cbiAgaWYgKGRvYy5jcmVhdGVFdmVudCkge1xuICAgIGUgPSBkb2MuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKTtcbiAgICBlLmluaXRFdmVudCh0eXBlLCB0cnVlLCB0cnVlKTtcbiAgfSBlbHNlIHtcbiAgICBlID0gZG9jLmNyZWF0ZUV2ZW50T2JqZWN0KCk7XG4gICAgZS5ldmVudFR5cGUgPSB0eXBlO1xuICB9XG4gIGUuZXZlbnROYW1lID0gdHlwZTtcblxuICBpZiAoZG9jLmNyZWF0ZUV2ZW50KSB7XG4gICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGUpO1xuICB9IGVsc2Uge1xuICAgIGVsZW1lbnQuZmlyZUV2ZW50KCdvbicgKyBlLmV2ZW50VHlwZSwgZSk7XG4gIH1cbn07XG5cbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY29uZmlndXJlID0gcmVxdWlyZSgnLi9jb25maWd1cmUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGV4dCkge1xuICByZXR1cm4gY29uZmlndXJlLm1hcmtkb3duKHRleHQpO1xufTtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIGRvYyA9IGdsb2JhbC5kb2N1bWVudDtcbnZhciB1aSA9IHJlcXVpcmUoJy4vdWknKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgY29uZmlndXJlID0gcmVxdWlyZSgnLi9jb25maWd1cmUnKTtcbnZhciBjbGFzc2VzID0gcmVxdWlyZSgnLi9jbGFzc2VzJyk7XG52YXIgRWRpdG9yID0gcmVxdWlyZSgnLi9FZGl0b3InKTtcbnZhciBuZXh0SWQgPSAwO1xuXG5mdW5jdGlvbiBwb255bWFyayAobykge1xuICB2YXIgcG9zdGZpeCA9IG5leHRJZCsrO1xuICB2YXIgZWRpdG9yO1xuXG4gIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgbyA9IHsgdGV4dGFyZWE6IG8sIHByZXZpZXc6IG8gfTtcbiAgfVxuXG4gIG1hcmt1cChvLCBwb3N0Zml4KTtcblxuICBlZGl0b3IgPSBuZXcgRWRpdG9yKHBvc3RmaXgpO1xuICBlZGl0b3IucnVuKCk7XG5cbiAgcmV0dXJuIGVkaXRvci5hcGk7XG59XG5cbmZ1bmN0aW9uIG1hcmt1cCAobywgcG9zdGZpeCkge1xuICB2YXIgYnV0dG9uQmFyID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB2YXIgcHJldmlldyA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdmFyIGlucHV0O1xuXG4gIGlmIChjbGFzc2VzLmNvbnRhaW5zKG8udGV4dGFyZWEsICdwbWstaW5wdXQnKSkge1xuICAgIGNsYXNzZXMuYWRkKG8udGV4dGFyZWEsICdwbWstaW5wdXQnKTtcbiAgfVxuXG4gIGJ1dHRvbkJhci5pZCA9ICdwbWstYnV0dG9ucy0nICsgcG9zdGZpeDtcbiAgYnV0dG9uQmFyLmNsYXNzTmFtZSA9ICdwbWstYnV0dG9ucyc7XG4gIHByZXZpZXcuaWQgPSAncG1rLXByZXZpZXctJyArIHBvc3RmaXg7XG4gIHByZXZpZXcuY2xhc3NOYW1lID0gJ3Btay1wcmV2aWV3JztcblxuICBvLnRleHRhcmVhLmlkID0gJ3Btay1pbnB1dC0nICsgcG9zdGZpeDtcbiAgby50ZXh0YXJlYS5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShidXR0b25CYXIsIG8udGV4dGFyZWEpO1xuICBvLnByZXZpZXcuYXBwZW5kQ2hpbGQocHJldmlldyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcG9ueW1hcms7XG5cbnBvbnltYXJrLkVkaXRvciA9IEVkaXRvcjtcbnBvbnltYXJrLmNvbmZpZ3VyZSA9IGNvbmZpZ3VyZTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQ7XG5cbmZ1bmN0aW9uIGdldFRvcCAoZWxlbSwgaXNJbm5lcikge1xuICB2YXIgcmVzdWx0ID0gZWxlbS5vZmZzZXRUb3A7XG4gIGlmICghaXNJbm5lcikge1xuICAgIHdoaWxlIChlbGVtID0gZWxlbS5vZmZzZXRQYXJlbnQpIHtcbiAgICAgIHJlc3VsdCArPSBlbGVtLm9mZnNldFRvcDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmZ1bmN0aW9uIGdldEhlaWdodCAoZWxlbSkge1xuICByZXR1cm4gZWxlbS5vZmZzZXRIZWlnaHQgfHwgZWxlbS5zY3JvbGxIZWlnaHQ7XG59O1xuXG5mdW5jdGlvbiBnZXRXaWR0aCAoZWxlbSkge1xuICByZXR1cm4gZWxlbS5vZmZzZXRXaWR0aCB8fCBlbGVtLnNjcm9sbFdpZHRoO1xufTtcblxuZnVuY3Rpb24gZ2V0UGFnZVNpemUgKCkge1xuICB2YXIgc2Nyb2xsV2lkdGgsIHNjcm9sbEhlaWdodDtcbiAgdmFyIGlubmVyV2lkdGgsIGlubmVySGVpZ2h0O1xuXG4gIGlmIChzZWxmLmlubmVySGVpZ2h0ICYmIHNlbGYuc2Nyb2xsTWF4WSkge1xuICAgIHNjcm9sbFdpZHRoID0gZG9jLmJvZHkuc2Nyb2xsV2lkdGg7XG4gICAgc2Nyb2xsSGVpZ2h0ID0gc2VsZi5pbm5lckhlaWdodCArIHNlbGYuc2Nyb2xsTWF4WTtcbiAgfSBlbHNlIGlmIChkb2MuYm9keS5zY3JvbGxIZWlnaHQgPiBkb2MuYm9keS5vZmZzZXRIZWlnaHQpIHtcbiAgICBzY3JvbGxXaWR0aCA9IGRvYy5ib2R5LnNjcm9sbFdpZHRoO1xuICAgIHNjcm9sbEhlaWdodCA9IGRvYy5ib2R5LnNjcm9sbEhlaWdodDtcbiAgfSBlbHNlIHtcbiAgICBzY3JvbGxXaWR0aCA9IGRvYy5ib2R5Lm9mZnNldFdpZHRoO1xuICAgIHNjcm9sbEhlaWdodCA9IGRvYy5ib2R5Lm9mZnNldEhlaWdodDtcbiAgfVxuXG4gIGlmIChzZWxmLmlubmVySGVpZ2h0KSB7XG4gICAgaW5uZXJXaWR0aCA9IHNlbGYuaW5uZXJXaWR0aDtcbiAgICBpbm5lckhlaWdodCA9IHNlbGYuaW5uZXJIZWlnaHQ7XG4gIH0gZWxzZSBpZiAoZG9jLmRvY3VtZW50RWxlbWVudCAmJiBkb2MuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCkge1xuICAgIGlubmVyV2lkdGggPSBkb2MuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoO1xuICAgIGlubmVySGVpZ2h0ID0gZG9jLmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gIH0gZWxzZSBpZiAoZG9jLmJvZHkpIHtcbiAgICBpbm5lcldpZHRoID0gZG9jLmJvZHkuY2xpZW50V2lkdGg7XG4gICAgaW5uZXJIZWlnaHQgPSBkb2MuYm9keS5jbGllbnRIZWlnaHQ7XG4gIH1cblxuICB2YXIgbWF4V2lkdGggPSBNYXRoLm1heChzY3JvbGxXaWR0aCwgaW5uZXJXaWR0aCk7XG4gIHZhciBtYXhIZWlnaHQgPSBNYXRoLm1heChzY3JvbGxIZWlnaHQsIGlubmVySGVpZ2h0KTtcbiAgcmV0dXJuIFttYXhXaWR0aCwgbWF4SGVpZ2h0LCBpbm5lcldpZHRoLCBpbm5lckhlaWdodF07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0VG9wOiBnZXRUb3AsXG4gIGdldEhlaWdodDogZ2V0SGVpZ2h0LFxuICBnZXRXaWR0aDogZ2V0V2lkdGgsXG4gIGdldFBhZ2VTaXplOiBnZXRQYWdlU2l6ZVxufTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciB4aHIgPSByZXF1aXJlKCd4aHInKTtcbnZhciByYWYgPSByZXF1aXJlKCdyYWYnKTtcbnZhciBjb25maWd1cmUgPSByZXF1aXJlKCcuL2NvbmZpZ3VyZScpO1xudmFyIHByb21wdExpbmsgPSByZXF1aXJlKCcuL3Byb21wdExpbmsnKTtcbnZhciBwcm9tcHRSZW5kZXIgPSByZXF1aXJlKCcuL3Byb21wdFJlbmRlcicpO1xudmFyIGZpcmVFdmVudCA9IHJlcXVpcmUoJy4vZmlyZUV2ZW50Jyk7XG52YXIgY2FjaGU7XG5cbmZ1bmN0aW9uIGRyYXcgKGNiKSB7XG4gIGlmIChjYWNoZSkge1xuICAgIGNhY2hlLmRpYWxvZy5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGNhY2hlLmRpYWxvZyk7XG4gIH1cbiAgY2FjaGUgPSBwcm9tcHRSZW5kZXIoe1xuICAgIGlkOiAncG1rLWltYWdlLXByb21wdCcsXG4gICAgdGl0bGU6ICdJbnNlcnQgSW1hZ2UnLFxuICAgIGRlc2NyaXB0aW9uOiAnVHlwZSBvciBwYXN0ZSB0aGUgdXJsIHRvIHlvdXIgaW1hZ2UnLFxuICAgIHBsYWNlaG9sZGVyOiAnaHR0cDovL2V4YW1wbGUuY29tL3B1YmxpYy9kb2dlLnBuZyBcIm9wdGlvbmFsIHRpdGxlXCInXG4gIH0pO1xuICBpbml0KGNhY2hlLCBjYik7XG4gIGNhY2hlLmRpYWxvZy5jbGFzc0xpc3QuYWRkKCdwbWstcHJvbXB0LW9wZW4nKTtcbiAgcmFmKGZvY3VzKTtcbiAgcmV0dXJuIGNhY2hlLmRpYWxvZztcbn1cblxuZnVuY3Rpb24gZm9jdXMgKCkge1xuICBjYWNoZS5pbnB1dC5mb2N1cygpO1xufVxuXG5mdW5jdGlvbiBpbml0IChkb20sIGNiKSB7XG4gIHByb21wdExpbmsuaW5pdChkb20sIGNiKTtcblxuICBpZiAoY29uZmlndXJlLmltYWdlVXBsb2Fkcykge1xuICAgIGFycmFuZ2VJbWFnZVVwbG9hZChkb20sIGNiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhcnJhbmdlSW1hZ2VVcGxvYWQgKGRvbSwgY2IpIHtcbiAgdmFyIHVwID0gcHJvbXB0UmVuZGVyLnVwbG9hZHMoZG9tKTtcbiAgdmFyIGRyYWdDbGFzcyA9ICdwbWstcHJvbXB0LXVwbG9hZC1kcmFnZ2luZyc7XG5cbiAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW50ZXInLCBkcmFnZ2luZyk7XG4gIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VuZCcsIGRyYWdzdG9wKTtcblxuICB1cC5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBoYW5kbGVDaGFuZ2UsIGZhbHNlKTtcbiAgdXAudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgaGFuZGxlRHJhZ092ZXIsIGZhbHNlKTtcbiAgdXAudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBoYW5kbGVGaWxlU2VsZWN0LCBmYWxzZSk7XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2hhbmdlIChlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZ28oZS50YXJnZXQuZmlsZXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlRHJhZ092ZXIgKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gJ2NvcHknO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlRmlsZVNlbGVjdCAoZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGdvKGUuZGF0YVRyYW5zZmVyLmZpbGVzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHZhbGlkIChmaWxlcykge1xuICAgIHZhciBtaW1lID0gL15pbWFnZVxcLy9pLCBpLCBmaWxlO1xuXG4gICAgdXAud2FybmluZy5jbGFzc0xpc3QucmVtb3ZlKCdwbWstcHJvbXB0LWVycm9yLXNob3cnKTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgZmlsZSA9IGZpbGVzW2ldO1xuXG4gICAgICBpZiAobWltZS50ZXN0KGZpbGUudHlwZSkpIHtcbiAgICAgICAgcmV0dXJuIGZpbGU7XG4gICAgICB9XG4gICAgfVxuICAgIHdhcm4oKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHdhcm4gKG1lc3NhZ2UpIHtcbiAgICB1cC53YXJuaW5nLmNsYXNzTGlzdC5hZGQoJ3Btay1wcm9tcHQtZXJyb3Itc2hvdycpO1xuICB9XG5cbiAgZnVuY3Rpb24gZHJhZ2dpbmcgKCkge1xuICAgIHVwLnVwbG9hZC5jbGFzc0xpc3QuYWRkKGRyYWdDbGFzcyk7XG4gIH1cblxuICBmdW5jdGlvbiBkcmFnc3RvcCAoKSB7XG4gICAgdXAudXBsb2FkLmNsYXNzTGlzdC5yZW1vdmUoZHJhZ0NsYXNzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb3NlICgpIHtcbiAgICBjYWNoZS5kaWFsb2cuY2xhc3NMaXN0LnJlbW92ZSgncG1rLXByb21wdC1vcGVuJyk7XG4gIH1cblxuICBmdW5jdGlvbiBnbyAoZmlsZXMpIHtcbiAgICB2YXIgZmlsZSA9IHZhbGlkKGZpbGVzKTtcbiAgICBpZiAoIWZpbGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGZvcm0gPSBuZXcgRm9ybURhdGEoKTtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICdDb250ZW50LVR5cGUnOiAnbXVsdGlwYXJ0L2Zvcm0tZGF0YScsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIEFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICB9LFxuICAgICAgbWV0aG9kOiBjb25maWd1cmUuaW1hZ2VVcGxvYWRzLm1ldGhvZCxcbiAgICAgIHVybDogY29uZmlndXJlLmltYWdlVXBsb2Fkcy51cmwsXG4gICAgICBib2R5OiBmb3JtLFxuICAgICAgdGltZW91dDogMTUwMDBcbiAgICB9O1xuICAgIGZvcm0uYXBwZW5kKGNvbmZpZ3VyZS5pbWFnZVVwbG9hZHMua2V5LCBmaWxlLCBmaWxlLm5hbWUpO1xuICAgIHVwLnVwbG9hZC5jbGFzc0xpc3QuYWRkKCdwbWstcHJvbXB0LXVwbG9hZGluZycpO1xuICAgIHhocihvcHRpb25zLCBkb25lKTtcblxuICAgIGZ1bmN0aW9uIGRvbmUgKGVyciwgeGhyLCBib2R5KSB7XG4gICAgICB1cC51cGxvYWQuY2xhc3NMaXN0LnJlbW92ZSgncG1rLXByb21wdC11cGxvYWRpbmcnKTtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgdXAuZmFpbGVkLmNsYXNzTGlzdC5hZGQoJ3Btay1wcm9tcHQtZXJyb3Itc2hvdycpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIganNvbiA9IEpTT04ucGFyc2UoYm9keSk7XG4gICAgICBkb20uaW5wdXQudmFsdWUgPSBqc29uLnVybCArICcgXCInICsganNvbi5hbHQgKyAnXCInO1xuICAgICAgY2xvc2UoKTtcbiAgICAgIGNiKGRvbS5pbnB1dC52YWx1ZSk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBkcmF3OiBkcmF3XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcmFmID0gcmVxdWlyZSgncmFmJyk7XG52YXIgcHJvbXB0UmVuZGVyID0gcmVxdWlyZSgnLi9wcm9tcHRSZW5kZXInKTtcbnZhciBjYWNoZTtcbnZhciBFTlRFUl9LRVkgPSAxMztcbnZhciBFU0NBUEVfS0VZID0gMjc7XG5cbmZ1bmN0aW9uIGRyYXcgKGNiKSB7XG4gIGlmIChjYWNoZSkge1xuICAgIGNhY2hlLmRpYWxvZy5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGNhY2hlLmRpYWxvZyk7XG4gIH1cbiAgY2FjaGUgPSBwcm9tcHRSZW5kZXIoe1xuICAgIGlkOiAncG1rLWxpbmstcHJvbXB0JyxcbiAgICB0aXRsZTogJ0luc2VydCBMaW5rJyxcbiAgICBkZXNjcmlwdGlvbjogJ1R5cGUgb3IgcGFzdGUgdGhlIHVybCB0byB5b3VyIGxpbmsnLFxuICAgIHBsYWNlaG9sZGVyOiAnaHR0cDovL2V4YW1wbGUuY29tLyBcIm9wdGlvbmFsIHRpdGxlXCInXG4gIH0pO1xuICBpbml0KGNhY2hlLCBjYik7XG4gIGNhY2hlLmRpYWxvZy5jbGFzc0xpc3QuYWRkKCdwbWstcHJvbXB0LW9wZW4nKTtcbiAgcmFmKGZvY3VzKTtcbiAgcmV0dXJuIGNhY2hlLmRpYWxvZztcbn1cblxuZnVuY3Rpb24gZm9jdXMgKCkge1xuICBjYWNoZS5pbnB1dC5mb2N1cygpO1xufVxuXG5mdW5jdGlvbiBpbml0IChkb20sIGNiKSB7XG4gIGRvbS5jYW5jZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZSk7XG4gIGRvbS5jbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlKTtcbiAgZG9tLm9rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb2spO1xuXG4gIGRvbS5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIGVudGVyKTtcbiAgZG9tLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBlc2MpO1xuXG4gIGZ1bmN0aW9uIGVudGVyIChlKSB7XG4gICAgdmFyIGtleSA9IGUud2hpY2ggfHwgZS5rZXlDb2RlO1xuICAgIGlmIChrZXkgPT09IEVOVEVSX0tFWSkge1xuICAgICAgb2soKTtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBlc2MgKGUpIHtcbiAgICB2YXIga2V5ID0gZS53aGljaCB8fCBlLmtleUNvZGU7XG4gICAgaWYgKGtleSA9PT0gRVNDQVBFX0tFWSkge1xuICAgICAgY2xvc2UoKTtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvayAoKSB7XG4gICAgY2xvc2UoKTtcbiAgICBjYihkb20uaW5wdXQudmFsdWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xvc2UgKCkge1xuICAgIGRvbS5kaWFsb2cuY2xhc3NMaXN0LnJlbW92ZSgncG1rLXByb21wdC1vcGVuJyk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGRyYXc6IGRyYXcsXG4gIGluaXQ6IGluaXRcbn07XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQ7XG52YXIgYWMgPSAnYXBwZW5kQ2hpbGQnO1xuXG5mdW5jdGlvbiBlICh0eXBlLCBjbHMsIHRleHQpIHtcbiAgdmFyIGVsZW0gPSBkb2MuY3JlYXRlRWxlbWVudCh0eXBlKTtcbiAgZWxlbS5jbGFzc05hbWUgPSBjbHM7XG4gIGlmICh0ZXh0KSB7XG4gICAgZWxlbS5pbm5lclRleHQgPSB0ZXh0O1xuICB9XG4gIHJldHVybiBlbGVtO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gIHZhciBkb20gPSB7XG4gICAgZGlhbG9nOiBlKCdhcnRpY2xlJywgJ3Btay1wcm9tcHQgJyArIG9wdHMuaWQpLFxuICAgIGNsb3NlOiBlKCdhJywgJ3Btay1wcm9tcHQtY2xvc2UnKSxcbiAgICBoZWFkZXI6IGUoJ2hlYWRlcicsICdwbWstcHJvbXB0LWhlYWRlcicpLFxuICAgIGgxOiBlKCdoMScsICdwbWstcHJvbXB0LXRpdGxlJywgb3B0cy50aXRsZSksXG4gICAgc2VjdGlvbjogZSgnc2VjdGlvbicsICdwbWstcHJvbXB0LWJvZHknKSxcbiAgICBkZXNjOiBlKCdwJywgJ3Btay1wcm9tcHQtZGVzY3JpcHRpb24nLCBvcHRzLmRlc2NyaXB0aW9uKSxcbiAgICBpbnB1dDogZSgnaW5wdXQnLCAncG1rLXByb21wdC1pbnB1dCcpLFxuICAgIGNhbmNlbDogZSgnYScsICdwbWstcHJvbXB0LWNhbmNlbCcsICdDYW5jZWwnKSxcbiAgICBvazogZSgnYnV0dG9uJywgJ3Btay1wcm9tcHQtb2snLCAnT2snKSxcbiAgICBmb290ZXI6IGUoJ2Zvb3RlcicsICdwbWstcHJvbXB0LWJ1dHRvbnMnKVxuICB9O1xuICBkb20uaGVhZGVyW2FjXShkb20uaDEpO1xuICBkb20uc2VjdGlvblthY10oZG9tLmRlc2MpO1xuICBkb20uc2VjdGlvblthY10oZG9tLmlucHV0KTtcbiAgZG9tLmlucHV0LnBsYWNlaG9sZGVyID0gb3B0cy5wbGFjZWhvbGRlcjtcbiAgZG9tLmZvb3RlclthY10oZG9tLmNhbmNlbCk7XG4gIGRvbS5mb290ZXJbYWNdKGRvbS5vayk7XG4gIGRvbS5kaWFsb2dbYWNdKGRvbS5jbG9zZSk7XG4gIGRvbS5kaWFsb2dbYWNdKGRvbS5oZWFkZXIpO1xuICBkb20uZGlhbG9nW2FjXShkb20uc2VjdGlvbik7XG4gIGRvbS5kaWFsb2dbYWNdKGRvbS5mb290ZXIpO1xuICBkb2MuYm9keVthY10oZG9tLmRpYWxvZyk7XG4gIHJldHVybiBkb207XG59O1xuXG5tb2R1bGUuZXhwb3J0cy51cGxvYWRzID0gZnVuY3Rpb24gKGRvbSkge1xuICB2YXIgZnVwID0gJ3Btay1wcm9tcHQtZmlsZXVwbG9hZCc7XG4gIHZhciB1cCA9IHtcbiAgICBhcmVhOiBlKCdzZWN0aW9uJywgJ3Btay1wcm9tcHQtdXBsb2FkLWFyZWEnKSxcbiAgICB3YXJuaW5nOiBlKCdwJywgJ3Btay1wcm9tcHQtZXJyb3IgcG1rLXdhcm5pbmcnLCAnT25seSBHSUYsIEpQRUcgYW5kIFBORyBpbWFnZXMgYXJlIGFsbG93ZWQnKSxcbiAgICBmYWlsZWQ6IGUoJ3AnLCAncG1rLXByb21wdC1lcnJvciBwbWstZmFpbGVkJywgJ1VwbG9hZCBmYWlsZWQnKSxcbiAgICB1cGxvYWQ6IGUoJ2J1dHRvbicsICdwbWstcHJvbXB0LXVwbG9hZCcpLFxuICAgIHVwbG9hZGluZzogZSgnc3BhbicsICdwbWstcHJvbXB0LXByb2dyZXNzJywgJ1VwbG9hZGluZyBmaWxlLi4uJyksXG4gICAgZHJvcDogZSgnc3BhbicsICdwbWstcHJvbXB0LWRyb3AnLCAnRHJvcCBoZXJlIHRvIGJlZ2luIHVwbG9hZCcpLFxuICAgIGJyb3dzZTogZSgnc3BhbicsICdwbWstcHJvbXB0LWJyb3dzZScsICdCcm93c2UuLi4nKSxcbiAgICBkcmFnZHJvcDogZSgnc3BhbicsICdwbWstcHJvbXB0LWRyYWdkcm9wJywgJ1lvdSBjYW4gYWxzbyBkcm9wIGZpbGVzIGhlcmUnKSxcbiAgICBpbnB1dDogZSgnaW5wdXQnLCBmdXApXG4gIH07XG4gIHVwLmFyZWFbYWNdKHVwLndhcm5pbmcpO1xuICB1cC5hcmVhW2FjXSh1cC5mYWlsZWQpO1xuICB1cC5hcmVhW2FjXSh1cC51cGxvYWQpO1xuICB1cC51cGxvYWRbYWNdKHVwLmRyb3ApO1xuICB1cC51cGxvYWRbYWNdKHVwLnVwbG9hZGluZyk7XG4gIHVwLnVwbG9hZFthY10odXAuYnJvd3NlKTtcbiAgdXAudXBsb2FkW2FjXSh1cC5kcmFnZHJvcCk7XG4gIHVwLnVwbG9hZFthY10odXAuaW5wdXQpO1xuICB1cC5pbnB1dC5pZCA9IGZ1cDtcbiAgdXAuaW5wdXQudHlwZSA9ICdmaWxlJztcbiAgZG9tLnNlY3Rpb25bYWNdKHVwLmFyZWEpO1xuICBkb20udXAgPSB1cDtcbiAgcmV0dXJuIHVwO1xufTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBuYXYgPSB3aW5kb3cubmF2aWdhdG9yO1xudmFyIHVhID0gbmF2LnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpO1xudmFyIHVhU25pZmZlciA9IHtcbiAgaXNJRTogL21zaWUvLnRlc3QodWEpLFxuICBpc0lFXzVvcjY6IC9tc2llIFs1Nl0vLnRlc3QodWEpLFxuICBpc09wZXJhOiAvb3BlcmEvLnRlc3QodWEpLFxuICBpc0Nocm9tZTogL2Nocm9tZS8udGVzdCh1YSksXG4gIGlzV2luZG93czogL3dpbi9pLnRlc3QobmF2LnBsYXRmb3JtKVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB1YVNuaWZmZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBwcm9tcHRMaW5rID0gcmVxdWlyZSgnLi9wcm9tcHRMaW5rJyk7XG52YXIgcHJvbXB0SW1hZ2UgPSByZXF1aXJlKCcuL3Byb21wdEltYWdlJyk7XG52YXIgbGlua3M7XG52YXIgaW1hZ2VzO1xuXG5mdW5jdGlvbiBwcm9tcHQgKHR5cGUsIGNiKSB7XG4gIGlmIChsaW5rcykge1xuICAgIGxpbmtzLmNsYXNzTGlzdC5yZW1vdmUoJ3Btay1wcm9tcHQtb3BlbicpO1xuICB9XG4gIGlmIChpbWFnZXMpIHtcbiAgICBpbWFnZXMuY2xhc3NMaXN0LnJlbW92ZSgncG1rLXByb21wdC1vcGVuJyk7XG4gIH1cbiAgaWYgKHR5cGUgPT09ICdsaW5rJykge1xuICAgIGxpbmtzID0gcHJvbXB0TGluay5kcmF3KHByZXByb2Nlc3MpO1xuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdpbWFnZScpIHtcbiAgICBpbWFnZXMgPSBwcm9tcHRJbWFnZS5kcmF3KHByZXByb2Nlc3MpO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJlcHJvY2VzcyAodGV4dCkge1xuICAgIGlmICh0ZXh0ICE9PSBudWxsKXsgLy8gZml4ZXMgY29tbW9uIHBhc3RlIGVycm9yc1xuICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSgvXmh0dHA6XFwvXFwvKGh0dHBzP3xmdHApOlxcL1xcLy8sICckMTovLycpO1xuICAgICAgaWYgKHRleHRbMF0gIT09ICcvJyAmJiAhL14oPzpodHRwcz98ZnRwKTpcXC9cXC8vLnRlc3QodGV4dCkpe1xuICAgICAgICB0ZXh0ID0gJ2h0dHA6Ly8nICsgdGV4dDtcbiAgICAgIH1cbiAgICB9XG4gICAgY2IodGV4dCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHByb21wdDogcHJvbXB0XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBpc1Zpc2libGUgKGVsZW0pIHtcbiAgaWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW0sIG51bGwpLmdldFByb3BlcnR5VmFsdWUoJ2Rpc3BsYXknKSAhPT0gJ25vbmUnO1xuICB9IGVsc2UgaWYgKGVsZW0uY3VycmVudFN0eWxlKSB7XG4gICAgcmV0dXJuIGVsZW0uY3VycmVudFN0eWxlLmRpc3BsYXkgIT09ICdub25lJztcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRFdmVudCAoZWxlbSwgdHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKGVsZW0uYXR0YWNoRXZlbnQpIHtcbiAgICBlbGVtLmF0dGFjaEV2ZW50KCdvbicgKyB0eXBlLCBsaXN0ZW5lcik7XG4gIH0gZWxzZSB7XG4gICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCBmYWxzZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkRXZlbnREZWxlZ2F0ZSAoZWxlbSwgY2xhc3NOYW1lLCB0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgcmVnZXggPSBuZXcgUmVnRXhwKCdcXGInICsgY2xhc3NOYW1lICsgJ1xcYicpO1xuXG4gIGlmIChlbGVtLmF0dGFjaEV2ZW50KSB7XG4gICAgZWxlbS5hdHRhY2hFdmVudCgnb24nICsgdHlwZSwgZGVsZWdhdG9yKTtcbiAgfSBlbHNlIHtcbiAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgZGVsZWdhdG9yLCBmYWxzZSk7XG4gIH1cbiAgZnVuY3Rpb24gZGVsZWdhdG9yIChlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgIHZhciBlbGVtID0gZS50YXJnZXQ7XG4gICAgaWYgKGVsZW0uY2xhc3NMaXN0KSB7XG4gICAgICBpZiAoZWxlbS5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSkge1xuICAgICAgICBmaXJlKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChlbGVtLmNsYXNzTmFtZS5tYXRjaChyZWdleCkpIHtcbiAgICAgICAgZmlyZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpcmUgKCkge1xuICAgICAgbGlzdGVuZXIuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUV2ZW50IChlbGVtLCBldmVudCwgbGlzdGVuZXIpIHtcbiAgaWYgKGVsZW0uZGV0YWNoRXZlbnQpIHtcbiAgICBlbGVtLmRldGFjaEV2ZW50KCdvbicgKyBldmVudCwgbGlzdGVuZXIpO1xuICB9IGVsc2Uge1xuICAgIGVsZW0ucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgbGlzdGVuZXIsIGZhbHNlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmaXhFb2xDaGFycyAodGV4dCkge1xuICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cXHJcXG4vZywgJ1xcbicpO1xuICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cXHIvZywgJ1xcbicpO1xuICByZXR1cm4gdGV4dDtcbn1cblxuZnVuY3Rpb24gZXh0ZW5kUmVnRXhwIChyZWdleCwgcHJlLCBwb3N0KSB7XG4gIGlmIChwcmUgPT09IG51bGwgfHwgcHJlID09PSB2b2lkIDApIHtcbiAgICBwcmUgPSAnJztcbiAgfVxuICBpZiAocG9zdCA9PT0gbnVsbCB8fCBwb3N0ID09PSB2b2lkIDApIHtcbiAgICBwb3N0ID0gJyc7XG4gIH1cblxuICB2YXIgcGF0dGVybiA9IHJlZ2V4LnRvU3RyaW5nKCk7XG4gIHZhciBmbGFncztcblxuICBwYXR0ZXJuID0gcGF0dGVybi5yZXBsYWNlKC9cXC8oW2dpbV0qKSQvLCBmdW5jdGlvbiAod2hvbGVNYXRjaCwgZmxhZ3NQYXJ0KSB7XG4gICAgZmxhZ3MgPSBmbGFnc1BhcnQ7XG4gICAgcmV0dXJuICcnO1xuICB9KTtcbiAgcGF0dGVybiA9IHBhdHRlcm4ucmVwbGFjZSgvKF5cXC98XFwvJCkvZywgJycpO1xuICBwYXR0ZXJuID0gcHJlICsgcGF0dGVybiArIHBvc3Q7XG4gIHJldHVybiBuZXcgUmVnRXhwKHBhdHRlcm4sIGZsYWdzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzVmlzaWJsZTogaXNWaXNpYmxlLFxuICBhZGRFdmVudDogYWRkRXZlbnQsXG4gIGFkZEV2ZW50RGVsZWdhdGU6IGFkZEV2ZW50RGVsZWdhdGUsXG4gIHJlbW92ZUV2ZW50OiByZW1vdmVFdmVudCxcbiAgZml4RW9sQ2hhcnM6IGZpeEVvbENoYXJzLFxuICBleHRlbmRSZWdFeHA6IGV4dGVuZFJlZ0V4cFxufTtcbiJdfQ==
(25)
});
