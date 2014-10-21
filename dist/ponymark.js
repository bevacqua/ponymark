/**
 * ponymark - Next-generation PageDown fork
 * @version v3.3.1
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
  var uploads;
  var o = opts || {};
  if (o.imageUploads) {
    if (typeof o.imageUploads === 'string') {
      uploads = { url: o.imageUploads };
    } else {
      uploads = o.imageUploads;
    }
    if (!uploads.url) { throw new Error('Required imageUploads.url property missing'); }
    if (!uploads.method) { uploads.method = 'PUT'; }
    if (!uploads.key) { uploads.key = 'image'; }
    if (!uploads.timeout) { uploads.timeout = 15000; }
    configure.imageUploads = uploads;
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
      timeout: configure.imageUploads.timeout,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL2NvbnRyYS5lbWl0dGVyL2luZGV4LmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL2NvbnRyYS5lbWl0dGVyL3NyYy9jb250cmEuZW1pdHRlci5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL25vZGVfbW9kdWxlcy9yYWYvaW5kZXguanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMvcmFmL25vZGVfbW9kdWxlcy9wZXJmb3JtYW5jZS1ub3cvbGliL3BlcmZvcm1hbmNlLW5vdy5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL25vZGVfbW9kdWxlcy94aHIvaW5kZXguanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMveGhyL25vZGVfbW9kdWxlcy9nbG9iYWwvd2luZG93LmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMvb25jZS9vbmNlLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMvcGFyc2UtaGVhZGVycy9ub2RlX21vZHVsZXMvZm9yLWVhY2gvaW5kZXguanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMveGhyL25vZGVfbW9kdWxlcy9wYXJzZS1oZWFkZXJzL25vZGVfbW9kdWxlcy9mb3ItZWFjaC9ub2RlX21vZHVsZXMvaXMtZnVuY3Rpb24vaW5kZXguanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMveGhyL25vZGVfbW9kdWxlcy9wYXJzZS1oZWFkZXJzL25vZGVfbW9kdWxlcy90cmltL2luZGV4LmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMvcGFyc2UtaGVhZGVycy9wYXJzZS1oZWFkZXJzLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvc3JjL0NodW5rcy5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy9Db21tYW5kTWFuYWdlci5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy9FZGl0b3IuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9zcmMvUGFuZWxDb2xsZWN0aW9uLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvc3JjL1ByZXZpZXdNYW5hZ2VyLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvc3JjL1RleHRhcmVhU3RhdGUuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9zcmMvVUlNYW5hZ2VyLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvc3JjL1VuZG9NYW5hZ2VyLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvc3JjL2NsYXNzZXMuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9zcmMvY29uZmlndXJlLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvc3JjL2ZpcmVFdmVudC5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy9wYXJzZS5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy9wb255bWFyay5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy9wb3NpdGlvbi5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy9wcm9tcHRJbWFnZS5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy9wcm9tcHRMaW5rLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvc3JjL3Byb21wdFJlbmRlci5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy91YS5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy91aS5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hpQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gZXYuc291cmNlO1xuICAgICAgICAgICAgaWYgKChzb3VyY2UgPT09IHdpbmRvdyB8fCBzb3VyY2UgPT09IG51bGwpICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL3NyYy9jb250cmEuZW1pdHRlci5qcycpO1xuIiwiKGZ1bmN0aW9uIChwcm9jZXNzKXtcbihmdW5jdGlvbiAocm9vdCwgdW5kZWZpbmVkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgdW5kZWYgPSAnJyArIHVuZGVmaW5lZDtcbiAgZnVuY3Rpb24gYXRvYSAoYSwgbikgeyByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYSwgbik7IH1cbiAgZnVuY3Rpb24gZGVib3VuY2UgKGZuLCBhcmdzLCBjdHgpIHsgaWYgKCFmbikgeyByZXR1cm47IH0gdGljayhmdW5jdGlvbiBydW4gKCkgeyBmbi5hcHBseShjdHggfHwgbnVsbCwgYXJncyB8fCBbXSk7IH0pOyB9XG5cbiAgLy8gY3Jvc3MtcGxhdGZvcm0gdGlja2VyXG4gIHZhciBzaSA9IHR5cGVvZiBzZXRJbW1lZGlhdGUgPT09ICdmdW5jdGlvbicsIHRpY2s7XG4gIGlmIChzaSkge1xuICAgIHRpY2sgPSBmdW5jdGlvbiAoZm4pIHsgc2V0SW1tZWRpYXRlKGZuKTsgfTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gdW5kZWYgJiYgcHJvY2Vzcy5uZXh0VGljaykge1xuICAgIHRpY2sgPSBwcm9jZXNzLm5leHRUaWNrO1xuICB9IGVsc2Uge1xuICAgIHRpY2sgPSBmdW5jdGlvbiAoZm4pIHsgc2V0VGltZW91dChmbiwgMCk7IH07XG4gIH1cblxuICBmdW5jdGlvbiBfZW1pdHRlciAodGhpbmcsIG9wdGlvbnMpIHtcbiAgICB2YXIgb3B0cyA9IG9wdGlvbnMgfHwge307XG4gICAgdmFyIGV2dCA9IHt9O1xuICAgIGlmICh0aGluZyA9PT0gdW5kZWZpbmVkKSB7IHRoaW5nID0ge307IH1cbiAgICB0aGluZy5vbiA9IGZ1bmN0aW9uICh0eXBlLCBmbikge1xuICAgICAgaWYgKCFldnRbdHlwZV0pIHtcbiAgICAgICAgZXZ0W3R5cGVdID0gW2ZuXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGV2dFt0eXBlXS5wdXNoKGZuKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGluZztcbiAgICB9O1xuICAgIHRoaW5nLm9uY2UgPSBmdW5jdGlvbiAodHlwZSwgZm4pIHtcbiAgICAgIGZuLl9vbmNlID0gdHJ1ZTsgLy8gdGhpbmcub2ZmKGZuKSBzdGlsbCB3b3JrcyFcbiAgICAgIHRoaW5nLm9uKHR5cGUsIGZuKTtcbiAgICAgIHJldHVybiB0aGluZztcbiAgICB9O1xuICAgIHRoaW5nLm9mZiA9IGZ1bmN0aW9uICh0eXBlLCBmbikge1xuICAgICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgaWYgKGMgPT09IDEpIHtcbiAgICAgICAgZGVsZXRlIGV2dFt0eXBlXTtcbiAgICAgIH0gZWxzZSBpZiAoYyA9PT0gMCkge1xuICAgICAgICBldnQgPSB7fTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBldCA9IGV2dFt0eXBlXTtcbiAgICAgICAgaWYgKCFldCkgeyByZXR1cm4gdGhpbmc7IH1cbiAgICAgICAgZXQuc3BsaWNlKGV0LmluZGV4T2YoZm4pLCAxKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGluZztcbiAgICB9O1xuICAgIHRoaW5nLmVtaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY3R4ID0gdGhpcztcbiAgICAgIHZhciBhcmdzID0gYXRvYShhcmd1bWVudHMpO1xuICAgICAgdmFyIHR5cGUgPSBhcmdzLnNoaWZ0KCk7XG4gICAgICB2YXIgZXQgPSBldnRbdHlwZV07XG4gICAgICBpZiAodHlwZSA9PT0gJ2Vycm9yJyAmJiBvcHRzLnRocm93cyAhPT0gZmFsc2UgJiYgIWV0KSB7IHRocm93IGFyZ3MubGVuZ3RoID09PSAxID8gYXJnc1swXSA6IGFyZ3M7IH1cbiAgICAgIGlmICghZXQpIHsgcmV0dXJuIHRoaW5nOyB9XG4gICAgICBldnRbdHlwZV0gPSBldC5maWx0ZXIoZnVuY3Rpb24gZW1pdHRlciAobGlzdGVuKSB7XG4gICAgICAgIGlmIChvcHRzLmFzeW5jKSB7IGRlYm91bmNlKGxpc3RlbiwgYXJncywgY3R4KTsgfSBlbHNlIHsgbGlzdGVuLmFwcGx5KGN0eCwgYXJncyk7IH1cbiAgICAgICAgcmV0dXJuICFsaXN0ZW4uX29uY2U7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGluZztcbiAgICB9O1xuICAgIHJldHVybiB0aGluZztcbiAgfVxuXG4gIC8vIGNyb3NzLXBsYXRmb3JtIGV4cG9ydFxuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gdW5kZWYgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IF9lbWl0dGVyO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuY29udHJhID0gcm9vdC5jb250cmEgfHwge307XG4gICAgcm9vdC5jb250cmEuZW1pdHRlciA9IF9lbWl0dGVyO1xuICB9XG59KSh0aGlzKTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJGV2FBU0hcIikpIiwidmFyIG5vdyA9IHJlcXVpcmUoJ3BlcmZvcm1hbmNlLW5vdycpXG4gICwgZ2xvYmFsID0gdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgPyB7fSA6IHdpbmRvd1xuICAsIHZlbmRvcnMgPSBbJ21veicsICd3ZWJraXQnXVxuICAsIHN1ZmZpeCA9ICdBbmltYXRpb25GcmFtZSdcbiAgLCByYWYgPSBnbG9iYWxbJ3JlcXVlc3QnICsgc3VmZml4XVxuICAsIGNhZiA9IGdsb2JhbFsnY2FuY2VsJyArIHN1ZmZpeF0gfHwgZ2xvYmFsWydjYW5jZWxSZXF1ZXN0JyArIHN1ZmZpeF1cbiAgLCBpc05hdGl2ZSA9IHRydWVcblxuZm9yKHZhciBpID0gMDsgaSA8IHZlbmRvcnMubGVuZ3RoICYmICFyYWY7IGkrKykge1xuICByYWYgPSBnbG9iYWxbdmVuZG9yc1tpXSArICdSZXF1ZXN0JyArIHN1ZmZpeF1cbiAgY2FmID0gZ2xvYmFsW3ZlbmRvcnNbaV0gKyAnQ2FuY2VsJyArIHN1ZmZpeF1cbiAgICAgIHx8IGdsb2JhbFt2ZW5kb3JzW2ldICsgJ0NhbmNlbFJlcXVlc3QnICsgc3VmZml4XVxufVxuXG4vLyBTb21lIHZlcnNpb25zIG9mIEZGIGhhdmUgckFGIGJ1dCBub3QgY0FGXG5pZighcmFmIHx8ICFjYWYpIHtcbiAgaXNOYXRpdmUgPSBmYWxzZVxuXG4gIHZhciBsYXN0ID0gMFxuICAgICwgaWQgPSAwXG4gICAgLCBxdWV1ZSA9IFtdXG4gICAgLCBmcmFtZUR1cmF0aW9uID0gMTAwMCAvIDYwXG5cbiAgcmFmID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICBpZihxdWV1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgIHZhciBfbm93ID0gbm93KClcbiAgICAgICAgLCBuZXh0ID0gTWF0aC5tYXgoMCwgZnJhbWVEdXJhdGlvbiAtIChfbm93IC0gbGFzdCkpXG4gICAgICBsYXN0ID0gbmV4dCArIF9ub3dcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjcCA9IHF1ZXVlLnNsaWNlKDApXG4gICAgICAgIC8vIENsZWFyIHF1ZXVlIGhlcmUgdG8gcHJldmVudFxuICAgICAgICAvLyBjYWxsYmFja3MgZnJvbSBhcHBlbmRpbmcgbGlzdGVuZXJzXG4gICAgICAgIC8vIHRvIHRoZSBjdXJyZW50IGZyYW1lJ3MgcXVldWVcbiAgICAgICAgcXVldWUubGVuZ3RoID0gMFxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgY3AubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZighY3BbaV0uY2FuY2VsbGVkKSB7XG4gICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgIGNwW2ldLmNhbGxiYWNrKGxhc3QpXG4gICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgdGhyb3cgZSB9LCAwKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgTWF0aC5yb3VuZChuZXh0KSlcbiAgICB9XG4gICAgcXVldWUucHVzaCh7XG4gICAgICBoYW5kbGU6ICsraWQsXG4gICAgICBjYWxsYmFjazogY2FsbGJhY2ssXG4gICAgICBjYW5jZWxsZWQ6IGZhbHNlXG4gICAgfSlcbiAgICByZXR1cm4gaWRcbiAgfVxuXG4gIGNhZiA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYocXVldWVbaV0uaGFuZGxlID09PSBoYW5kbGUpIHtcbiAgICAgICAgcXVldWVbaV0uY2FuY2VsbGVkID0gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuKSB7XG4gIC8vIFdyYXAgaW4gYSBuZXcgZnVuY3Rpb24gdG8gcHJldmVudFxuICAvLyBgY2FuY2VsYCBwb3RlbnRpYWxseSBiZWluZyBhc3NpZ25lZFxuICAvLyB0byB0aGUgbmF0aXZlIHJBRiBmdW5jdGlvblxuICBpZighaXNOYXRpdmUpIHtcbiAgICByZXR1cm4gcmFmLmNhbGwoZ2xvYmFsLCBmbilcbiAgfVxuICByZXR1cm4gcmFmLmNhbGwoZ2xvYmFsLCBmdW5jdGlvbigpIHtcbiAgICB0cnl7XG4gICAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyB0aHJvdyBlIH0sIDApXG4gICAgfVxuICB9KVxufVxubW9kdWxlLmV4cG9ydHMuY2FuY2VsID0gZnVuY3Rpb24oKSB7XG4gIGNhZi5hcHBseShnbG9iYWwsIGFyZ3VtZW50cylcbn1cbiIsIihmdW5jdGlvbiAocHJvY2Vzcyl7XG4vLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuNi4zXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBnZXROYW5vU2Vjb25kcywgaHJ0aW1lLCBsb2FkVGltZTtcblxuICBpZiAoKHR5cGVvZiBwZXJmb3JtYW5jZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBwZXJmb3JtYW5jZSAhPT0gbnVsbCkgJiYgcGVyZm9ybWFuY2Uubm93KSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICB9O1xuICB9IGVsc2UgaWYgKCh0eXBlb2YgcHJvY2VzcyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBwcm9jZXNzICE9PSBudWxsKSAmJiBwcm9jZXNzLmhydGltZSkge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gKGdldE5hbm9TZWNvbmRzKCkgLSBsb2FkVGltZSkgLyAxZTY7XG4gICAgfTtcbiAgICBocnRpbWUgPSBwcm9jZXNzLmhydGltZTtcbiAgICBnZXROYW5vU2Vjb25kcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGhyO1xuICAgICAgaHIgPSBocnRpbWUoKTtcbiAgICAgIHJldHVybiBoclswXSAqIDFlOSArIGhyWzFdO1xuICAgIH07XG4gICAgbG9hZFRpbWUgPSBnZXROYW5vU2Vjb25kcygpO1xuICB9IGVsc2UgaWYgKERhdGUubm93KSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBEYXRlLm5vdygpIC0gbG9hZFRpbWU7XG4gICAgfTtcbiAgICBsb2FkVGltZSA9IERhdGUubm93KCk7XG4gIH0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIGxvYWRUaW1lO1xuICAgIH07XG4gICAgbG9hZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgfVxuXG59KS5jYWxsKHRoaXMpO1xuXG4vKlxuLy9AIHNvdXJjZU1hcHBpbmdVUkw9cGVyZm9ybWFuY2Utbm93Lm1hcFxuKi9cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJGV2FBU0hcIikpIiwidmFyIHdpbmRvdyA9IHJlcXVpcmUoXCJnbG9iYWwvd2luZG93XCIpXG52YXIgb25jZSA9IHJlcXVpcmUoXCJvbmNlXCIpXG52YXIgcGFyc2VIZWFkZXJzID0gcmVxdWlyZSgncGFyc2UtaGVhZGVycycpXG5cbnZhciBtZXNzYWdlcyA9IHtcbiAgICBcIjBcIjogXCJJbnRlcm5hbCBYTUxIdHRwUmVxdWVzdCBFcnJvclwiLFxuICAgIFwiNFwiOiBcIjR4eCBDbGllbnQgRXJyb3JcIixcbiAgICBcIjVcIjogXCI1eHggU2VydmVyIEVycm9yXCJcbn1cblxudmFyIFhIUiA9IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCB8fCBub29wXG52YXIgWERSID0gXCJ3aXRoQ3JlZGVudGlhbHNcIiBpbiAobmV3IFhIUigpKSA/IFhIUiA6IHdpbmRvdy5YRG9tYWluUmVxdWVzdFxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVhIUlxuXG5mdW5jdGlvbiBjcmVhdGVYSFIob3B0aW9ucywgY2FsbGJhY2spIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgb3B0aW9ucyA9IHsgdXJpOiBvcHRpb25zIH1cbiAgICB9XG5cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICAgIGNhbGxiYWNrID0gb25jZShjYWxsYmFjaylcblxuICAgIHZhciB4aHIgPSBvcHRpb25zLnhociB8fCBudWxsXG5cbiAgICBpZiAoIXhocikge1xuICAgICAgICBpZiAob3B0aW9ucy5jb3JzIHx8IG9wdGlvbnMudXNlWERSKSB7XG4gICAgICAgICAgICB4aHIgPSBuZXcgWERSKClcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB4aHIgPSBuZXcgWEhSKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciB1cmkgPSB4aHIudXJsID0gb3B0aW9ucy51cmkgfHwgb3B0aW9ucy51cmxcbiAgICB2YXIgbWV0aG9kID0geGhyLm1ldGhvZCA9IG9wdGlvbnMubWV0aG9kIHx8IFwiR0VUXCJcbiAgICB2YXIgYm9keSA9IG9wdGlvbnMuYm9keSB8fCBvcHRpb25zLmRhdGFcbiAgICB2YXIgaGVhZGVycyA9IHhoci5oZWFkZXJzID0gb3B0aW9ucy5oZWFkZXJzIHx8IHt9XG4gICAgdmFyIHN5bmMgPSAhIW9wdGlvbnMuc3luY1xuICAgIHZhciBpc0pzb24gPSBmYWxzZVxuICAgIHZhciBrZXlcbiAgICB2YXIgbG9hZCA9IG9wdGlvbnMucmVzcG9uc2UgPyBsb2FkUmVzcG9uc2UgOiBsb2FkWGhyXG5cbiAgICBpZiAoXCJqc29uXCIgaW4gb3B0aW9ucykge1xuICAgICAgICBpc0pzb24gPSB0cnVlXG4gICAgICAgIGhlYWRlcnNbXCJBY2NlcHRcIl0gPSBcImFwcGxpY2F0aW9uL2pzb25cIlxuICAgICAgICBpZiAobWV0aG9kICE9PSBcIkdFVFwiICYmIG1ldGhvZCAhPT0gXCJIRUFEXCIpIHtcbiAgICAgICAgICAgIGhlYWRlcnNbXCJDb250ZW50LVR5cGVcIl0gPSBcImFwcGxpY2F0aW9uL2pzb25cIlxuICAgICAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuanNvbilcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSByZWFkeXN0YXRlY2hhbmdlXG4gICAgeGhyLm9ubG9hZCA9IGxvYWRcbiAgICB4aHIub25lcnJvciA9IGVycm9yXG4gICAgLy8gSUU5IG11c3QgaGF2ZSBvbnByb2dyZXNzIGJlIHNldCB0byBhIHVuaXF1ZSBmdW5jdGlvbi5cbiAgICB4aHIub25wcm9ncmVzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gSUUgbXVzdCBkaWVcbiAgICB9XG4gICAgLy8gaGF0ZSBJRVxuICAgIHhoci5vbnRpbWVvdXQgPSBub29wXG4gICAgeGhyLm9wZW4obWV0aG9kLCB1cmksICFzeW5jKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9iYWNrd2FyZCBjb21wYXRpYmlsaXR5XG4gICAgaWYgKG9wdGlvbnMud2l0aENyZWRlbnRpYWxzIHx8IChvcHRpb25zLmNvcnMgJiYgb3B0aW9ucy53aXRoQ3JlZGVudGlhbHMgIT09IGZhbHNlKSkge1xuICAgICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZVxuICAgIH1cblxuICAgIC8vIENhbm5vdCBzZXQgdGltZW91dCB3aXRoIHN5bmMgcmVxdWVzdFxuICAgIGlmICghc3luYykge1xuICAgICAgICB4aHIudGltZW91dCA9IFwidGltZW91dFwiIGluIG9wdGlvbnMgPyBvcHRpb25zLnRpbWVvdXQgOiA1MDAwXG4gICAgfVxuXG4gICAgaWYgKHhoci5zZXRSZXF1ZXN0SGVhZGVyKSB7XG4gICAgICAgIGZvcihrZXkgaW4gaGVhZGVycyl7XG4gICAgICAgICAgICBpZihoZWFkZXJzLmhhc093blByb3BlcnR5KGtleSkpe1xuICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgaGVhZGVyc1trZXldKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChvcHRpb25zLmhlYWRlcnMpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSGVhZGVycyBjYW5ub3QgYmUgc2V0IG9uIGFuIFhEb21haW5SZXF1ZXN0IG9iamVjdFwiKVxuICAgIH1cblxuICAgIGlmIChcInJlc3BvbnNlVHlwZVwiIGluIG9wdGlvbnMpIHtcbiAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9IG9wdGlvbnMucmVzcG9uc2VUeXBlXG4gICAgfVxuICAgIFxuICAgIGlmIChcImJlZm9yZVNlbmRcIiBpbiBvcHRpb25zICYmIFxuICAgICAgICB0eXBlb2Ygb3B0aW9ucy5iZWZvcmVTZW5kID09PSBcImZ1bmN0aW9uXCJcbiAgICApIHtcbiAgICAgICAgb3B0aW9ucy5iZWZvcmVTZW5kKHhocilcbiAgICB9XG5cbiAgICB4aHIuc2VuZChib2R5KVxuXG4gICAgcmV0dXJuIHhoclxuXG4gICAgZnVuY3Rpb24gcmVhZHlzdGF0ZWNoYW5nZSgpIHtcbiAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgICBsb2FkKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEJvZHkoKSB7XG4gICAgICAgIC8vIENocm9tZSB3aXRoIHJlcXVlc3RUeXBlPWJsb2IgdGhyb3dzIGVycm9ycyBhcnJvdW5kIHdoZW4gZXZlbiB0ZXN0aW5nIGFjY2VzcyB0byByZXNwb25zZVRleHRcbiAgICAgICAgdmFyIGJvZHkgPSBudWxsXG5cbiAgICAgICAgaWYgKHhoci5yZXNwb25zZSkge1xuICAgICAgICAgICAgYm9keSA9IHhoci5yZXNwb25zZVxuICAgICAgICB9IGVsc2UgaWYgKHhoci5yZXNwb25zZVR5cGUgPT09ICd0ZXh0JyB8fCAheGhyLnJlc3BvbnNlVHlwZSkge1xuICAgICAgICAgICAgYm9keSA9IHhoci5yZXNwb25zZVRleHQgfHwgeGhyLnJlc3BvbnNlWE1MXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNKc29uKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGJvZHkgPSBKU09OLnBhcnNlKGJvZHkpXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJvZHlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTdGF0dXNDb2RlKCkge1xuICAgICAgICByZXR1cm4geGhyLnN0YXR1cyA9PT0gMTIyMyA/IDIwNCA6IHhoci5zdGF0dXNcbiAgICB9XG5cbiAgICAvLyBpZiB3ZSdyZSBnZXR0aW5nIGEgbm9uZS1vayBzdGF0dXNDb2RlLCBidWlsZCAmIHJldHVybiBhbiBlcnJvclxuICAgIGZ1bmN0aW9uIGVycm9yRnJvbVN0YXR1c0NvZGUoc3RhdHVzKSB7XG4gICAgICAgIHZhciBlcnJvciA9IG51bGxcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMCB8fCAoc3RhdHVzID49IDQwMCAmJiBzdGF0dXMgPCA2MDApKSB7XG4gICAgICAgICAgICB2YXIgbWVzc2FnZSA9ICh0eXBlb2YgYm9keSA9PT0gXCJzdHJpbmdcIiA/IGJvZHkgOiBmYWxzZSkgfHxcbiAgICAgICAgICAgICAgICBtZXNzYWdlc1tTdHJpbmcoc3RhdHVzKS5jaGFyQXQoMCldXG4gICAgICAgICAgICBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKVxuICAgICAgICAgICAgZXJyb3Iuc3RhdHVzQ29kZSA9IHN0YXR1c1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVycm9yXG4gICAgfVxuXG4gICAgLy8gd2lsbCBsb2FkIHRoZSBkYXRhICYgcHJvY2VzcyB0aGUgcmVzcG9uc2UgaW4gYSBzcGVjaWFsIHJlc3BvbnNlIG9iamVjdFxuICAgIGZ1bmN0aW9uIGxvYWRSZXNwb25zZSgpIHtcbiAgICAgICAgdmFyIHN0YXR1cyA9IGdldFN0YXR1c0NvZGUoKVxuICAgICAgICB2YXIgZXJyb3IgPSBlcnJvckZyb21TdGF0dXNDb2RlKHN0YXR1cylcbiAgICAgICAgdmFyIHJlc3BvbnNlID0ge1xuICAgICAgICAgICAgYm9keTogZ2V0Qm9keSgpLFxuICAgICAgICAgICAgc3RhdHVzQ29kZTogc3RhdHVzLFxuICAgICAgICAgICAgc3RhdHVzVGV4dDogeGhyLnN0YXR1c1RleHQsXG4gICAgICAgICAgICByYXc6IHhoclxuICAgICAgICB9XG4gICAgICAgIGlmKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMpeyAvL3JlbWVtYmVyIHhociBjYW4gaW4gZmFjdCBiZSBYRFIgZm9yIENPUlMgaW4gSUVcbiAgICAgICAgICAgIHJlc3BvbnNlLmhlYWRlcnMgPSBwYXJzZUhlYWRlcnMoeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzcG9uc2UuaGVhZGVycyA9IHt9XG4gICAgICAgIH1cblxuICAgICAgICBjYWxsYmFjayhlcnJvciwgcmVzcG9uc2UsIHJlc3BvbnNlLmJvZHkpXG4gICAgfVxuXG4gICAgLy8gd2lsbCBsb2FkIHRoZSBkYXRhIGFuZCBhZGQgc29tZSByZXNwb25zZSBwcm9wZXJ0aWVzIHRvIHRoZSBzb3VyY2UgeGhyXG4gICAgLy8gYW5kIHRoZW4gcmVzcG9uZCB3aXRoIHRoYXRcbiAgICBmdW5jdGlvbiBsb2FkWGhyKCkge1xuICAgICAgICB2YXIgc3RhdHVzID0gZ2V0U3RhdHVzQ29kZSgpXG4gICAgICAgIHZhciBlcnJvciA9IGVycm9yRnJvbVN0YXR1c0NvZGUoc3RhdHVzKVxuXG4gICAgICAgIHhoci5zdGF0dXMgPSB4aHIuc3RhdHVzQ29kZSA9IHN0YXR1c1xuICAgICAgICB4aHIuYm9keSA9IGdldEJvZHkoKVxuICAgICAgICB4aHIuaGVhZGVycyA9IHBhcnNlSGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpXG5cbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIHhociwgeGhyLmJvZHkpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXJyb3IoZXZ0KSB7XG4gICAgICAgIGNhbGxiYWNrKGV2dCwgeGhyKVxuICAgIH1cbn1cblxuXG5mdW5jdGlvbiBub29wKCkge31cbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbmlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSB3aW5kb3c7XG59IGVsc2UgaWYgKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGdsb2JhbDtcbn0gZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIpe1xuICAgIG1vZHVsZS5leHBvcnRzID0gc2VsZjtcbn0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7fTtcbn1cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJtb2R1bGUuZXhwb3J0cyA9IG9uY2Vcblxub25jZS5wcm90byA9IG9uY2UoZnVuY3Rpb24gKCkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRnVuY3Rpb24ucHJvdG90eXBlLCAnb25jZScsIHtcbiAgICB2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG9uY2UodGhpcylcbiAgICB9LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KVxufSlcblxuZnVuY3Rpb24gb25jZSAoZm4pIHtcbiAgdmFyIGNhbGxlZCA9IGZhbHNlXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGNhbGxlZCkgcmV0dXJuXG4gICAgY2FsbGVkID0gdHJ1ZVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gIH1cbn1cbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnaXMtZnVuY3Rpb24nKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvckVhY2hcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eVxuXG5mdW5jdGlvbiBmb3JFYWNoKGxpc3QsIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaWYgKCFpc0Z1bmN0aW9uKGl0ZXJhdG9yKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdpdGVyYXRvciBtdXN0IGJlIGEgZnVuY3Rpb24nKVxuICAgIH1cblxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykge1xuICAgICAgICBjb250ZXh0ID0gdGhpc1xuICAgIH1cbiAgICBcbiAgICBpZiAodG9TdHJpbmcuY2FsbChsaXN0KSA9PT0gJ1tvYmplY3QgQXJyYXldJylcbiAgICAgICAgZm9yRWFjaEFycmF5KGxpc3QsIGl0ZXJhdG9yLCBjb250ZXh0KVxuICAgIGVsc2UgaWYgKHR5cGVvZiBsaXN0ID09PSAnc3RyaW5nJylcbiAgICAgICAgZm9yRWFjaFN0cmluZyhsaXN0LCBpdGVyYXRvciwgY29udGV4dClcbiAgICBlbHNlXG4gICAgICAgIGZvckVhY2hPYmplY3QobGlzdCwgaXRlcmF0b3IsIGNvbnRleHQpXG59XG5cbmZ1bmN0aW9uIGZvckVhY2hBcnJheShhcnJheSwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoYXJyYXksIGkpKSB7XG4gICAgICAgICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIGFycmF5W2ldLCBpLCBhcnJheSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZm9yRWFjaFN0cmluZyhzdHJpbmcsIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHN0cmluZy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAvLyBubyBzdWNoIHRoaW5nIGFzIGEgc3BhcnNlIHN0cmluZy5cbiAgICAgICAgaXRlcmF0b3IuY2FsbChjb250ZXh0LCBzdHJpbmcuY2hhckF0KGkpLCBpLCBzdHJpbmcpXG4gICAgfVxufVxuXG5mdW5jdGlvbiBmb3JFYWNoT2JqZWN0KG9iamVjdCwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBmb3IgKHZhciBrIGluIG9iamVjdCkge1xuICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGspKSB7XG4gICAgICAgICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9iamVjdFtrXSwgaywgb2JqZWN0KVxuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBpc0Z1bmN0aW9uXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcblxuZnVuY3Rpb24gaXNGdW5jdGlvbiAoZm4pIHtcbiAgdmFyIHN0cmluZyA9IHRvU3RyaW5nLmNhbGwoZm4pXG4gIHJldHVybiBzdHJpbmcgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXScgfHxcbiAgICAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nICYmIHN0cmluZyAhPT0gJ1tvYmplY3QgUmVnRXhwXScpIHx8XG4gICAgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgIC8vIElFOCBhbmQgYmVsb3dcbiAgICAgKGZuID09PSB3aW5kb3cuc2V0VGltZW91dCB8fFxuICAgICAgZm4gPT09IHdpbmRvdy5hbGVydCB8fFxuICAgICAgZm4gPT09IHdpbmRvdy5jb25maXJtIHx8XG4gICAgICBmbiA9PT0gd2luZG93LnByb21wdCkpXG59O1xuIiwiXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSB0cmltO1xuXG5mdW5jdGlvbiB0cmltKHN0cil7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyp8XFxzKiQvZywgJycpO1xufVxuXG5leHBvcnRzLmxlZnQgPSBmdW5jdGlvbihzdHIpe1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMqLywgJycpO1xufTtcblxuZXhwb3J0cy5yaWdodCA9IGZ1bmN0aW9uKHN0cil7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXFxzKiQvLCAnJyk7XG59O1xuIiwidmFyIHRyaW0gPSByZXF1aXJlKCd0cmltJylcbiAgLCBmb3JFYWNoID0gcmVxdWlyZSgnZm9yLWVhY2gnKVxuICAsIGlzQXJyYXkgPSBmdW5jdGlvbihhcmcpIHtcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGhlYWRlcnMpIHtcbiAgaWYgKCFoZWFkZXJzKVxuICAgIHJldHVybiB7fVxuXG4gIHZhciByZXN1bHQgPSB7fVxuXG4gIGZvckVhY2goXG4gICAgICB0cmltKGhlYWRlcnMpLnNwbGl0KCdcXG4nKVxuICAgICwgZnVuY3Rpb24gKHJvdykge1xuICAgICAgICB2YXIgaW5kZXggPSByb3cuaW5kZXhPZignOicpXG4gICAgICAgICAgLCBrZXkgPSB0cmltKHJvdy5zbGljZSgwLCBpbmRleCkpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAsIHZhbHVlID0gdHJpbShyb3cuc2xpY2UoaW5kZXggKyAxKSlcblxuICAgICAgICBpZiAodHlwZW9mKHJlc3VsdFtrZXldKSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICByZXN1bHRba2V5XSA9IHZhbHVlXG4gICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheShyZXN1bHRba2V5XSkpIHtcbiAgICAgICAgICByZXN1bHRba2V5XS5wdXNoKHZhbHVlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdFtrZXldID0gWyByZXN1bHRba2V5XSwgdmFsdWUgXVxuICAgICAgICB9XG4gICAgICB9XG4gIClcblxuICByZXR1cm4gcmVzdWx0XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdWEgPSByZXF1aXJlKCcuL3VhJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIHJlID0gUmVnRXhwO1xuXG5mdW5jdGlvbiBDaHVua3MgKCkge1xufVxuXG5DaHVua3MucHJvdG90eXBlLmZpbmRUYWdzID0gZnVuY3Rpb24gKHN0YXJ0UmVnZXgsIGVuZFJlZ2V4KSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIHJlZ2V4O1xuXG4gIGlmIChzdGFydFJlZ2V4KSB7XG4gICAgcmVnZXggPSB1dGlsLmV4dGVuZFJlZ0V4cChzdGFydFJlZ2V4LCAnJywgJyQnKTtcbiAgICB0aGlzLmJlZm9yZSA9IHRoaXMuYmVmb3JlLnJlcGxhY2UocmVnZXgsIHN0YXJ0X3JlcGxhY2VyKTtcbiAgICByZWdleCA9IHV0aWwuZXh0ZW5kUmVnRXhwKHN0YXJ0UmVnZXgsICdeJywgJycpO1xuICAgIHRoaXMuc2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb24ucmVwbGFjZShyZWdleCwgc3RhcnRfcmVwbGFjZXIpO1xuICB9XG5cbiAgaWYgKGVuZFJlZ2V4KSB7XG4gICAgcmVnZXggPSB1dGlsLmV4dGVuZFJlZ0V4cChlbmRSZWdleCwgJycsICckJyk7XG4gICAgdGhpcy5zZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvbi5yZXBsYWNlKHJlZ2V4LCBlbmRfcmVwbGFjZXIpO1xuICAgIHJlZ2V4ID0gdXRpbC5leHRlbmRSZWdFeHAoZW5kUmVnZXgsICdeJywgJycpO1xuICAgIHRoaXMuYWZ0ZXIgPSB0aGlzLmFmdGVyLnJlcGxhY2UocmVnZXgsIGVuZF9yZXBsYWNlcik7XG4gIH1cblxuICBmdW5jdGlvbiBzdGFydF9yZXBsYWNlciAobWF0Y2gpIHtcbiAgICBzZWxmLnN0YXJ0VGFnID0gc2VsZi5zdGFydFRhZyArIG1hdGNoO1xuICAgIHJldHVybiAnJztcbiAgfVxuICBmdW5jdGlvbiBlbmRfcmVwbGFjZXIgKG1hdGNoKSB7XG4gICAgc2VsZi5lbmRUYWcgPSBtYXRjaCArIHNlbGYuZW5kVGFnO1xuICAgIHJldHVybiAnJztcbiAgfVxufTtcblxuQ2h1bmtzLnByb3RvdHlwZS50cmltV2hpdGVzcGFjZSA9IGZ1bmN0aW9uIChyZW1vdmUpIHtcbiAgdmFyIGJlZm9yZVJlcGxhY2VyLCBhZnRlclJlcGxhY2VyLCBzZWxmID0gdGhpcztcbiAgaWYgKHJlbW92ZSkge1xuICAgIGJlZm9yZVJlcGxhY2VyID0gYWZ0ZXJSZXBsYWNlciA9ICcnO1xuICB9IGVsc2Uge1xuICAgIGJlZm9yZVJlcGxhY2VyID0gZnVuY3Rpb24gKHMpIHsgc2VsZi5iZWZvcmUgKz0gczsgcmV0dXJuICcnOyB9XG4gICAgYWZ0ZXJSZXBsYWNlciA9IGZ1bmN0aW9uIChzKSB7IHNlbGYuYWZ0ZXIgPSBzICsgc2VsZi5hZnRlcjsgcmV0dXJuICcnOyB9XG4gIH1cblxuICB0aGlzLnNlbGVjdGlvbiA9IHRoaXMuc2VsZWN0aW9uLnJlcGxhY2UoL14oXFxzKikvLCBiZWZvcmVSZXBsYWNlcikucmVwbGFjZSgvKFxccyopJC8sIGFmdGVyUmVwbGFjZXIpO1xufTtcblxuQ2h1bmtzLnByb3RvdHlwZS5za2lwTGluZXMgPSBmdW5jdGlvbiAobkxpbmVzQmVmb3JlLCBuTGluZXNBZnRlciwgZmluZEV4dHJhTmV3bGluZXMpIHtcbiAgaWYgKG5MaW5lc0JlZm9yZSA9PT0gdm9pZCAwKSB7XG4gICAgbkxpbmVzQmVmb3JlID0gMTtcbiAgfVxuXG4gIGlmIChuTGluZXNBZnRlciA9PT0gdm9pZCAwKSB7XG4gICAgbkxpbmVzQWZ0ZXIgPSAxO1xuICB9XG5cbiAgbkxpbmVzQmVmb3JlKys7XG4gIG5MaW5lc0FmdGVyKys7XG5cbiAgdmFyIHJlZ2V4VGV4dDtcbiAgdmFyIHJlcGxhY2VtZW50VGV4dDtcblxuICBpZiAodWEuaXNDaHJvbWUpIHtcbiAgICAnWCcubWF0Y2goLygpLi8pO1xuICB9XG5cbiAgdGhpcy5zZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvbi5yZXBsYWNlKC8oXlxcbiopLywgJycpO1xuICB0aGlzLnN0YXJ0VGFnID0gdGhpcy5zdGFydFRhZyArIHJlLiQxO1xuICB0aGlzLnNlbGVjdGlvbiA9IHRoaXMuc2VsZWN0aW9uLnJlcGxhY2UoLyhcXG4qJCkvLCAnJyk7XG4gIHRoaXMuZW5kVGFnID0gdGhpcy5lbmRUYWcgKyByZS4kMTtcbiAgdGhpcy5zdGFydFRhZyA9IHRoaXMuc3RhcnRUYWcucmVwbGFjZSgvKF5cXG4qKS8sICcnKTtcbiAgdGhpcy5iZWZvcmUgPSB0aGlzLmJlZm9yZSArIHJlLiQxO1xuICB0aGlzLmVuZFRhZyA9IHRoaXMuZW5kVGFnLnJlcGxhY2UoLyhcXG4qJCkvLCAnJyk7XG4gIHRoaXMuYWZ0ZXIgPSB0aGlzLmFmdGVyICsgcmUuJDE7XG5cbiAgaWYgKHRoaXMuYmVmb3JlKSB7XG4gICAgcmVnZXhUZXh0ID0gcmVwbGFjZW1lbnRUZXh0ID0gJyc7XG5cbiAgICB3aGlsZSAobkxpbmVzQmVmb3JlLS0pIHtcbiAgICAgIHJlZ2V4VGV4dCArPSAnXFxcXG4/JztcbiAgICAgIHJlcGxhY2VtZW50VGV4dCArPSAnXFxuJztcbiAgICB9XG5cbiAgICBpZiAoZmluZEV4dHJhTmV3bGluZXMpIHtcbiAgICAgIHJlZ2V4VGV4dCA9ICdcXFxcbionO1xuICAgIH1cbiAgICB0aGlzLmJlZm9yZSA9IHRoaXMuYmVmb3JlLnJlcGxhY2UobmV3IHJlKHJlZ2V4VGV4dCArICckJywgJycpLCByZXBsYWNlbWVudFRleHQpO1xuICB9XG5cbiAgaWYgKHRoaXMuYWZ0ZXIpIHtcbiAgICByZWdleFRleHQgPSByZXBsYWNlbWVudFRleHQgPSAnJztcblxuICAgIHdoaWxlIChuTGluZXNBZnRlci0tKSB7XG4gICAgICByZWdleFRleHQgKz0gJ1xcXFxuPyc7XG4gICAgICByZXBsYWNlbWVudFRleHQgKz0gJ1xcbic7XG4gICAgfVxuICAgIGlmIChmaW5kRXh0cmFOZXdsaW5lcykge1xuICAgICAgcmVnZXhUZXh0ID0gJ1xcXFxuKic7XG4gICAgfVxuXG4gICAgdGhpcy5hZnRlciA9IHRoaXMuYWZ0ZXIucmVwbGFjZShuZXcgcmUocmVnZXhUZXh0LCAnJyksIHJlcGxhY2VtZW50VGV4dCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2h1bmtzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdWkgPSByZXF1aXJlKCcuL3VpJylcbnZhciBzZXR0aW5ncyA9IHsgbGluZUxlbmd0aDogNzIgfTtcbnZhciByZSA9IFJlZ0V4cDtcblxuZnVuY3Rpb24gQ29tbWFuZE1hbmFnZXIgKGdldFN0cmluZykge1xuICB0aGlzLmdldFN0cmluZyA9IGdldFN0cmluZztcbn1cblxudmFyICQgPSBDb21tYW5kTWFuYWdlci5wcm90b3R5cGU7XG5cbiQucHJlZml4ZXMgPSAnKD86XFxcXHN7NCx9fFxcXFxzKj58XFxcXHMqLVxcXFxzK3xcXFxccypcXFxcZCtcXFxcLnw9fFxcXFwrfC18X3xcXFxcKnwjfFxcXFxzKlxcXFxbW15cXG5dXStcXFxcXTopJztcblxuJC51bndyYXAgPSBmdW5jdGlvbiAoY2h1bmspIHtcbiAgdmFyIHR4dCA9IG5ldyByZSgnKFteXFxcXG5dKVxcXFxuKD8hKFxcXFxufCcgKyB0aGlzLnByZWZpeGVzICsgJykpJywgJ2cnKTtcbiAgY2h1bmsuc2VsZWN0aW9uID0gY2h1bmsuc2VsZWN0aW9uLnJlcGxhY2UodHh0LCAnJDEgJDInKTtcbn07XG5cbiQud3JhcCA9IGZ1bmN0aW9uIChjaHVuaywgbGVuKSB7XG4gIHRoaXMudW53cmFwKGNodW5rKTtcbiAgdmFyIHJlZ2V4ID0gbmV3IHJlKCcoLnsxLCcgKyBsZW4gKyAnfSkoICt8JFxcXFxuPyknLCAnZ20nKSxcbiAgICB0aGF0ID0gdGhpcztcblxuICBjaHVuay5zZWxlY3Rpb24gPSBjaHVuay5zZWxlY3Rpb24ucmVwbGFjZShyZWdleCwgZnVuY3Rpb24gKGxpbmUsIG1hcmtlZCkge1xuICAgIGlmIChuZXcgcmUoJ14nICsgdGhhdC5wcmVmaXhlcywgJycpLnRlc3QobGluZSkpIHtcbiAgICAgIHJldHVybiBsaW5lO1xuICAgIH1cbiAgICByZXR1cm4gbWFya2VkICsgJ1xcbic7XG4gIH0pO1xuXG4gIGNodW5rLnNlbGVjdGlvbiA9IGNodW5rLnNlbGVjdGlvbi5yZXBsYWNlKC9cXHMrJC8sICcnKTtcbn07XG5cbiQuZG9Cb2xkID0gZnVuY3Rpb24gKGNodW5rLCBwb3N0UHJvY2Vzc2luZykge1xuICByZXR1cm4gdGhpcy5kb0JvckkoY2h1bmssIHBvc3RQcm9jZXNzaW5nLCAyLCB0aGlzLmdldFN0cmluZygnYm9sZGV4YW1wbGUnKSk7XG59O1xuXG4kLmRvSXRhbGljID0gZnVuY3Rpb24gKGNodW5rLCBwb3N0UHJvY2Vzc2luZykge1xuICByZXR1cm4gdGhpcy5kb0JvckkoY2h1bmssIHBvc3RQcm9jZXNzaW5nLCAxLCB0aGlzLmdldFN0cmluZygnaXRhbGljZXhhbXBsZScpKTtcbn07XG5cbiQuZG9Cb3JJID0gZnVuY3Rpb24gKGNodW5rLCBwb3N0UHJvY2Vzc2luZywgblN0YXJzLCBpbnNlcnRUZXh0KSB7XG4gIGNodW5rLnRyaW1XaGl0ZXNwYWNlKCk7XG4gIGNodW5rLnNlbGVjdGlvbiA9IGNodW5rLnNlbGVjdGlvbi5yZXBsYWNlKC9cXG57Mix9L2csICdcXG4nKTtcblxuICB2YXIgc3RhcnNCZWZvcmUgPSAvKFxcKiokKS8uZXhlYyhjaHVuay5iZWZvcmUpWzBdO1xuICB2YXIgc3RhcnNBZnRlciA9IC8oXlxcKiopLy5leGVjKGNodW5rLmFmdGVyKVswXTtcbiAgdmFyIHByZXZTdGFycyA9IE1hdGgubWluKHN0YXJzQmVmb3JlLmxlbmd0aCwgc3RhcnNBZnRlci5sZW5ndGgpO1xuXG4gIGlmICgocHJldlN0YXJzID49IG5TdGFycykgJiYgKHByZXZTdGFycyAhPSAyIHx8IG5TdGFycyAhPSAxKSkge1xuICAgIGNodW5rLmJlZm9yZSA9IGNodW5rLmJlZm9yZS5yZXBsYWNlKHJlKCdbKl17JyArIG5TdGFycyArICd9JCcsICcnKSwgJycpO1xuICAgIGNodW5rLmFmdGVyID0gY2h1bmsuYWZ0ZXIucmVwbGFjZShyZSgnXlsqXXsnICsgblN0YXJzICsgJ30nLCAnJyksICcnKTtcbiAgfSBlbHNlIGlmICghY2h1bmsuc2VsZWN0aW9uICYmIHN0YXJzQWZ0ZXIpIHtcbiAgICBjaHVuay5hZnRlciA9IGNodW5rLmFmdGVyLnJlcGxhY2UoL14oWypfXSopLywgJycpO1xuICAgIGNodW5rLmJlZm9yZSA9IGNodW5rLmJlZm9yZS5yZXBsYWNlKC8oXFxzPykkLywgJycpO1xuICAgIHZhciB3aGl0ZXNwYWNlID0gcmUuJDE7XG4gICAgY2h1bmsuYmVmb3JlID0gY2h1bmsuYmVmb3JlICsgc3RhcnNBZnRlciArIHdoaXRlc3BhY2U7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCFjaHVuay5zZWxlY3Rpb24gJiYgIXN0YXJzQWZ0ZXIpIHtcbiAgICAgIGNodW5rLnNlbGVjdGlvbiA9IGluc2VydFRleHQ7XG4gICAgfVxuXG4gICAgdmFyIG1hcmt1cCA9IG5TdGFycyA8PSAxID8gJyonIDogJyoqJztcbiAgICBjaHVuay5iZWZvcmUgPSBjaHVuay5iZWZvcmUgKyBtYXJrdXA7XG4gICAgY2h1bmsuYWZ0ZXIgPSBtYXJrdXAgKyBjaHVuay5hZnRlcjtcbiAgfVxufTtcblxuJC5zdHJpcExpbmtEZWZzID0gZnVuY3Rpb24gKHRleHQsIGRlZnNUb0FkZCkge1xuICB2YXIgcmVnZXggPSAvXlsgXXswLDN9XFxbKFxcZCspXFxdOlsgXFx0XSpcXG4/WyBcXHRdKjw/KFxcUys/KT4/WyBcXHRdKlxcbj9bIFxcdF0qKD86KFxcbiopW1wiKF0oLis/KVtcIildWyBcXHRdKik/KD86XFxuK3wkKS9nbTtcblxuICBmdW5jdGlvbiByZXBsYWNlciAoYWxsLCBpZCwgbGluaywgbmV3bGluZXMsIHRpdGxlKSB7XG4gICAgZGVmc1RvQWRkW2lkXSA9IGFsbC5yZXBsYWNlKC9cXHMqJC8sICcnKTtcbiAgICBpZiAobmV3bGluZXMpIHtcbiAgICAgIGRlZnNUb0FkZFtpZF0gPSBhbGwucmVwbGFjZSgvW1wiKF0oLis/KVtcIildJC8sICcnKTtcbiAgICAgIHJldHVybiBuZXdsaW5lcyArIHRpdGxlO1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlZ2V4LCByZXBsYWNlcik7XG59O1xuXG4kLmFkZExpbmtEZWYgPSBmdW5jdGlvbiAoY2h1bmssIGxpbmtEZWYpIHtcbiAgdmFyIHJlZk51bWJlciA9IDA7XG4gIHZhciBkZWZzVG9BZGQgPSB7fTtcbiAgY2h1bmsuYmVmb3JlID0gdGhpcy5zdHJpcExpbmtEZWZzKGNodW5rLmJlZm9yZSwgZGVmc1RvQWRkKTtcbiAgY2h1bmsuc2VsZWN0aW9uID0gdGhpcy5zdHJpcExpbmtEZWZzKGNodW5rLnNlbGVjdGlvbiwgZGVmc1RvQWRkKTtcbiAgY2h1bmsuYWZ0ZXIgPSB0aGlzLnN0cmlwTGlua0RlZnMoY2h1bmsuYWZ0ZXIsIGRlZnNUb0FkZCk7XG5cbiAgdmFyIGRlZnMgPSAnJztcbiAgdmFyIHJlZ2V4ID0gLyhcXFspKCg/OlxcW1teXFxdXSpcXF18W15cXFtcXF1dKSopKFxcXVsgXT8oPzpcXG5bIF0qKT9cXFspKFxcZCspKFxcXSkvZztcblxuICBmdW5jdGlvbiBhZGREZWZOdW1iZXIgKGRlZikge1xuICAgIHJlZk51bWJlcisrO1xuICAgIGRlZiA9IGRlZi5yZXBsYWNlKC9eWyBdezAsM31cXFsoXFxkKylcXF06LywgJyAgWycgKyByZWZOdW1iZXIgKyAnXTonKTtcbiAgICBkZWZzICs9ICdcXG4nICsgZGVmO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGluayAod2hvbGVNYXRjaCwgYmVmb3JlLCBpbm5lciwgYWZ0ZXJJbm5lciwgaWQsIGVuZCkge1xuICAgIGlubmVyID0gaW5uZXIucmVwbGFjZShyZWdleCwgZ2V0TGluayk7XG4gICAgaWYgKGRlZnNUb0FkZFtpZF0pIHtcbiAgICAgIGFkZERlZk51bWJlcihkZWZzVG9BZGRbaWRdKTtcbiAgICAgIHJldHVybiBiZWZvcmUgKyBpbm5lciArIGFmdGVySW5uZXIgKyByZWZOdW1iZXIgKyBlbmQ7XG4gICAgfVxuICAgIHJldHVybiB3aG9sZU1hdGNoO1xuICB9XG5cbiAgY2h1bmsuYmVmb3JlID0gY2h1bmsuYmVmb3JlLnJlcGxhY2UocmVnZXgsIGdldExpbmspO1xuXG4gIGlmIChsaW5rRGVmKSB7XG4gICAgYWRkRGVmTnVtYmVyKGxpbmtEZWYpO1xuICB9IGVsc2Uge1xuICAgIGNodW5rLnNlbGVjdGlvbiA9IGNodW5rLnNlbGVjdGlvbi5yZXBsYWNlKHJlZ2V4LCBnZXRMaW5rKTtcbiAgfVxuXG4gIHZhciByZWZPdXQgPSByZWZOdW1iZXI7XG5cbiAgY2h1bmsuYWZ0ZXIgPSBjaHVuay5hZnRlci5yZXBsYWNlKHJlZ2V4LCBnZXRMaW5rKTtcblxuICBpZiAoY2h1bmsuYWZ0ZXIpIHtcbiAgICBjaHVuay5hZnRlciA9IGNodW5rLmFmdGVyLnJlcGxhY2UoL1xcbiokLywgJycpO1xuICB9XG4gIGlmICghY2h1bmsuYWZ0ZXIpIHtcbiAgICBjaHVuay5zZWxlY3Rpb24gPSBjaHVuay5zZWxlY3Rpb24ucmVwbGFjZSgvXFxuKiQvLCAnJyk7XG4gIH1cblxuICBjaHVuay5hZnRlciArPSAnXFxuXFxuJyArIGRlZnM7XG5cbiAgcmV0dXJuIHJlZk91dDtcbn07XG5cbmZ1bmN0aW9uIHByb3Blcmx5RW5jb2RlZCAobGlua2RlZikge1xuICBmdW5jdGlvbiByZXBsYWNlciAod2hvbGVtYXRjaCwgbGluaywgdGl0bGUpIHtcbiAgICBsaW5rID0gbGluay5yZXBsYWNlKC9cXD8uKiQvLCBmdW5jdGlvbiAocXVlcnlwYXJ0KSB7XG4gICAgICByZXR1cm4gcXVlcnlwYXJ0LnJlcGxhY2UoL1xcKy9nLCAnICcpOyAvLyBpbiB0aGUgcXVlcnkgc3RyaW5nLCBhIHBsdXMgYW5kIGEgc3BhY2UgYXJlIGlkZW50aWNhbFxuICAgIH0pO1xuICAgIGxpbmsgPSBkZWNvZGVVUklDb21wb25lbnQobGluayk7IC8vIHVuZW5jb2RlIGZpcnN0LCB0byBwcmV2ZW50IGRvdWJsZSBlbmNvZGluZ1xuICAgIGxpbmsgPSBlbmNvZGVVUkkobGluaykucmVwbGFjZSgvJy9nLCAnJTI3JykucmVwbGFjZSgvXFwoL2csICclMjgnKS5yZXBsYWNlKC9cXCkvZywgJyUyOScpO1xuICAgIGxpbmsgPSBsaW5rLnJlcGxhY2UoL1xcPy4qJC8sIGZ1bmN0aW9uIChxdWVyeXBhcnQpIHtcbiAgICAgIHJldHVybiBxdWVyeXBhcnQucmVwbGFjZSgvXFwrL2csICclMmInKTsgLy8gc2luY2Ugd2UgcmVwbGFjZWQgcGx1cyB3aXRoIHNwYWNlcyBpbiB0aGUgcXVlcnkgcGFydCwgYWxsIHBsdXNlcyB0aGF0IG5vdyBhcHBlYXIgd2hlcmUgb3JpZ2luYWxseSBlbmNvZGVkXG4gICAgfSk7XG4gICAgaWYgKHRpdGxlKSB7XG4gICAgICB0aXRsZSA9IHRpdGxlLnRyaW0gPyB0aXRsZS50cmltKCkgOiB0aXRsZS5yZXBsYWNlKC9eXFxzKi8sICcnKS5yZXBsYWNlKC9cXHMqJC8sICcnKTtcbiAgICAgIHRpdGxlID0gdGl0bGUucmVwbGFjZSgvXCIvZywgJ3F1b3Q7JykucmVwbGFjZSgvXFwoL2csICcmIzQwOycpLnJlcGxhY2UoL1xcKS9nLCAnJiM0MTsnKS5yZXBsYWNlKC88L2csICcmbHQ7JykucmVwbGFjZSgvPi9nLCAnJmd0OycpO1xuICAgIH1cbiAgICByZXR1cm4gdGl0bGUgPyBsaW5rICsgJyBcIicgKyB0aXRsZSArICdcIicgOiBsaW5rO1xuICB9XG4gIHJldHVybiBsaW5rZGVmLnJlcGxhY2UoL15cXHMqKC4qPykoPzpcXHMrXCIoLispXCIpP1xccyokLywgcmVwbGFjZXIpO1xufVxuXG4kLmRvTGlua09ySW1hZ2UgPSBmdW5jdGlvbiAoY2h1bmssIHBvc3RQcm9jZXNzaW5nLCBpc0ltYWdlKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGJhY2tncm91bmQ7XG5cbiAgY2h1bmsudHJpbVdoaXRlc3BhY2UoKTtcbiAgY2h1bmsuZmluZFRhZ3MoL1xccyohP1xcWy8sIC9cXF1bIF0/KD86XFxuWyBdKik/KFxcWy4qP1xcXSk/Lyk7XG5cbiAgaWYgKGNodW5rLmVuZFRhZy5sZW5ndGggPiAxICYmIGNodW5rLnN0YXJ0VGFnLmxlbmd0aCA+IDApIHtcbiAgICBjaHVuay5zdGFydFRhZyA9IGNodW5rLnN0YXJ0VGFnLnJlcGxhY2UoLyE/XFxbLywgJycpO1xuICAgIGNodW5rLmVuZFRhZyA9ICcnO1xuICAgIHRoaXMuYWRkTGlua0RlZihjaHVuaywgbnVsbCk7XG4gIH0gZWxzZSB7XG4gICAgY2h1bmsuc2VsZWN0aW9uID0gY2h1bmsuc3RhcnRUYWcgKyBjaHVuay5zZWxlY3Rpb24gKyBjaHVuay5lbmRUYWc7XG4gICAgY2h1bmsuc3RhcnRUYWcgPSBjaHVuay5lbmRUYWcgPSAnJztcblxuICAgIGlmICgvXFxuXFxuLy50ZXN0KGNodW5rLnNlbGVjdGlvbikpIHtcbiAgICAgIHRoaXMuYWRkTGlua0RlZihjaHVuaywgbnVsbCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChpc0ltYWdlKSB7XG4gICAgICB1aS5wcm9tcHQoJ2ltYWdlJywgbGlua0VudGVyZWRDYWxsYmFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVpLnByb21wdCgnbGluaycsIGxpbmtFbnRlcmVkQ2FsbGJhY2spO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxpbmtFbnRlcmVkQ2FsbGJhY2sgKGxpbmspIHtcbiAgICBpZiAobGluayAhPT0gbnVsbCkge1xuICAgICAgY2h1bmsuc2VsZWN0aW9uID0gKCcgJyArIGNodW5rLnNlbGVjdGlvbikucmVwbGFjZSgvKFteXFxcXF0oPzpcXFxcXFxcXCkqKSg/PVtbXFxdXSkvZywgJyQxXFxcXCcpLnN1YnN0cigxKTtcblxuICAgICAgdmFyIGxpbmtEZWYgPSAnIFs5OTldOiAnICsgcHJvcGVybHlFbmNvZGVkKGxpbmspO1xuICAgICAgdmFyIG51bSA9IHNlbGYuYWRkTGlua0RlZihjaHVuaywgbGlua0RlZik7XG4gICAgICBjaHVuay5zdGFydFRhZyA9IGlzSW1hZ2UgPyAnIVsnIDogJ1snO1xuICAgICAgY2h1bmsuZW5kVGFnID0gJ11bJyArIG51bSArICddJztcblxuICAgICAgaWYgKCFjaHVuay5zZWxlY3Rpb24pIHtcbiAgICAgICAgaWYgKGlzSW1hZ2UpIHtcbiAgICAgICAgICBjaHVuay5zZWxlY3Rpb24gPSBzZWxmLmdldFN0cmluZygnaW1hZ2VkZXNjcmlwdGlvbicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNodW5rLnNlbGVjdGlvbiA9IHNlbGYuZ2V0U3RyaW5nKCdsaW5rZGVzY3JpcHRpb24nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBwb3N0UHJvY2Vzc2luZygpO1xuICB9XG59O1xuXG4kLmRvQXV0b2luZGVudCA9IGZ1bmN0aW9uIChjaHVuaywgcG9zdFByb2Nlc3NpbmcpIHtcbiAgdmFyIGNvbW1hbmRNZ3IgPSB0aGlzO1xuICB2YXIgZmFrZVNlbGVjdGlvbiA9IGZhbHNlO1xuXG4gIGNodW5rLmJlZm9yZSA9IGNodW5rLmJlZm9yZS5yZXBsYWNlKC8oXFxufF4pWyBdezAsM30oWyorLV18XFxkK1suXSlbIFxcdF0qXFxuJC8sICdcXG5cXG4nKTtcbiAgY2h1bmsuYmVmb3JlID0gY2h1bmsuYmVmb3JlLnJlcGxhY2UoLyhcXG58XilbIF17MCwzfT5bIFxcdF0qXFxuJC8sICdcXG5cXG4nKTtcbiAgY2h1bmsuYmVmb3JlID0gY2h1bmsuYmVmb3JlLnJlcGxhY2UoLyhcXG58XilbIFxcdF0rXFxuJC8sICdcXG5cXG4nKTtcblxuICBpZiAoIWNodW5rLnNlbGVjdGlvbiAmJiAhL15bIFxcdF0qKD86XFxufCQpLy50ZXN0KGNodW5rLmFmdGVyKSkge1xuICAgIGNodW5rLmFmdGVyID0gY2h1bmsuYWZ0ZXIucmVwbGFjZSgvXlteXFxuXSovLCBmdW5jdGlvbiAod2hvbGVNYXRjaCkge1xuICAgICAgY2h1bmsuc2VsZWN0aW9uID0gd2hvbGVNYXRjaDtcbiAgICAgIHJldHVybiAnJztcbiAgICB9KTtcbiAgICBmYWtlU2VsZWN0aW9uID0gdHJ1ZTtcbiAgfVxuXG4gIGlmICgvKFxcbnxeKVsgXXswLDN9KFsqKy1dfFxcZCtbLl0pWyBcXHRdKy4qXFxuJC8udGVzdChjaHVuay5iZWZvcmUpKSB7XG4gICAgaWYgKGNvbW1hbmRNZ3IuZG9MaXN0KSB7XG4gICAgICBjb21tYW5kTWdyLmRvTGlzdChjaHVuayk7XG4gICAgfVxuICB9XG4gIGlmICgvKFxcbnxeKVsgXXswLDN9PlsgXFx0XSsuKlxcbiQvLnRlc3QoY2h1bmsuYmVmb3JlKSkge1xuICAgIGlmIChjb21tYW5kTWdyLmRvQmxvY2txdW90ZSkge1xuICAgICAgY29tbWFuZE1nci5kb0Jsb2NrcXVvdGUoY2h1bmspO1xuICAgIH1cbiAgfVxuICBpZiAoLyhcXG58XikoXFx0fFsgXXs0LH0pLipcXG4kLy50ZXN0KGNodW5rLmJlZm9yZSkpIHtcbiAgICBpZiAoY29tbWFuZE1nci5kb0NvZGUpIHtcbiAgICAgIGNvbW1hbmRNZ3IuZG9Db2RlKGNodW5rKTtcbiAgICB9XG4gIH1cblxuICBpZiAoZmFrZVNlbGVjdGlvbikge1xuICAgIGNodW5rLmFmdGVyID0gY2h1bmsuc2VsZWN0aW9uICsgY2h1bmsuYWZ0ZXI7XG4gICAgY2h1bmsuc2VsZWN0aW9uID0gJyc7XG4gIH1cbn07XG5cbiQuZG9CbG9ja3F1b3RlID0gZnVuY3Rpb24gKGNodW5rLCBwb3N0UHJvY2Vzc2luZykge1xuICBjaHVuay5zZWxlY3Rpb24gPSBjaHVuay5zZWxlY3Rpb24ucmVwbGFjZSgvXihcXG4qKShbXlxccl0rPykoXFxuKikkLyxcbiAgICBmdW5jdGlvbiAodG90YWxNYXRjaCwgbmV3bGluZXNCZWZvcmUsIHRleHQsIG5ld2xpbmVzQWZ0ZXIpIHtcbiAgICAgIGNodW5rLmJlZm9yZSArPSBuZXdsaW5lc0JlZm9yZTtcbiAgICAgIGNodW5rLmFmdGVyID0gbmV3bGluZXNBZnRlciArIGNodW5rLmFmdGVyO1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfSk7XG5cbiAgY2h1bmsuYmVmb3JlID0gY2h1bmsuYmVmb3JlLnJlcGxhY2UoLyg+WyBcXHRdKikkLyxcbiAgICBmdW5jdGlvbiAodG90YWxNYXRjaCwgYmxhbmtMaW5lKSB7XG4gICAgICBjaHVuay5zZWxlY3Rpb24gPSBibGFua0xpbmUgKyBjaHVuay5zZWxlY3Rpb247XG4gICAgICByZXR1cm4gJyc7XG4gICAgfSk7XG5cbiAgY2h1bmsuc2VsZWN0aW9uID0gY2h1bmsuc2VsZWN0aW9uLnJlcGxhY2UoL14oXFxzfD4pKyQvLCAnJyk7XG4gIGNodW5rLnNlbGVjdGlvbiA9IGNodW5rLnNlbGVjdGlvbiB8fCB0aGlzLmdldFN0cmluZygncXVvdGVleGFtcGxlJyk7XG5cbiAgdmFyIG1hdGNoID0gJyc7XG4gIHZhciBsZWZ0T3ZlciA9ICcnO1xuICB2YXIgbGluZTtcblxuICBpZiAoY2h1bmsuYmVmb3JlKSB7XG4gICAgdmFyIGxpbmVzID0gY2h1bmsuYmVmb3JlLnJlcGxhY2UoL1xcbiQvLCAnJykuc3BsaXQoJ1xcbicpO1xuICAgIHZhciBpbkNoYWluID0gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGdvb2QgPSBmYWxzZTtcbiAgICAgIGxpbmUgPSBsaW5lc1tpXTtcbiAgICAgIGluQ2hhaW4gPSBpbkNoYWluICYmIGxpbmUubGVuZ3RoID4gMDtcbiAgICAgIGlmICgvXj4vLnRlc3QobGluZSkpIHtcbiAgICAgICAgZ29vZCA9IHRydWU7XG4gICAgICAgIGlmICghaW5DaGFpbiAmJiBsaW5lLmxlbmd0aCA+IDEpXG4gICAgICAgICAgaW5DaGFpbiA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKC9eWyBcXHRdKiQvLnRlc3QobGluZSkpIHtcbiAgICAgICAgZ29vZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBnb29kID0gaW5DaGFpbjtcbiAgICAgIH1cbiAgICAgIGlmIChnb29kKSB7XG4gICAgICAgIG1hdGNoICs9IGxpbmUgKyAnXFxuJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxlZnRPdmVyICs9IG1hdGNoICsgbGluZTtcbiAgICAgICAgbWF0Y2ggPSAnXFxuJztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCEvKF58XFxuKT4vLnRlc3QobWF0Y2gpKSB7XG4gICAgICBsZWZ0T3ZlciArPSBtYXRjaDtcbiAgICAgIG1hdGNoID0gJyc7XG4gICAgfVxuICB9XG5cbiAgY2h1bmsuc3RhcnRUYWcgPSBtYXRjaDtcbiAgY2h1bmsuYmVmb3JlID0gbGVmdE92ZXI7XG5cbiAgLy8gZW5kIG9mIGNoYW5nZVxuXG4gIGlmIChjaHVuay5hZnRlcikge1xuICAgIGNodW5rLmFmdGVyID0gY2h1bmsuYWZ0ZXIucmVwbGFjZSgvXlxcbj8vLCAnXFxuJyk7XG4gIH1cblxuICBjaHVuay5hZnRlciA9IGNodW5rLmFmdGVyLnJlcGxhY2UoL14oKChcXG58XikoXFxuWyBcXHRdKikqPiguK1xcbikqLiopKyhcXG5bIFxcdF0qKSopLyxcbiAgICBmdW5jdGlvbiAodG90YWxNYXRjaCkge1xuICAgICAgY2h1bmsuZW5kVGFnID0gdG90YWxNYXRjaDtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICk7XG5cbiAgdmFyIHJlcGxhY2VCbGFua3NJblRhZ3MgPSBmdW5jdGlvbiAodXNlQnJhY2tldCkge1xuXG4gICAgdmFyIHJlcGxhY2VtZW50ID0gdXNlQnJhY2tldCA/ICc+ICcgOiAnJztcblxuICAgIGlmIChjaHVuay5zdGFydFRhZykge1xuICAgICAgY2h1bmsuc3RhcnRUYWcgPSBjaHVuay5zdGFydFRhZy5yZXBsYWNlKC9cXG4oKD58XFxzKSopXFxuJC8sXG4gICAgICAgIGZ1bmN0aW9uICh0b3RhbE1hdGNoLCBtYXJrZG93bikge1xuICAgICAgICAgIHJldHVybiAnXFxuJyArIG1hcmtkb3duLnJlcGxhY2UoL15bIF17MCwzfT4/WyBcXHRdKiQvZ20sIHJlcGxhY2VtZW50KSArICdcXG4nO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGNodW5rLmVuZFRhZykge1xuICAgICAgY2h1bmsuZW5kVGFnID0gY2h1bmsuZW5kVGFnLnJlcGxhY2UoL15cXG4oKD58XFxzKSopXFxuLyxcbiAgICAgICAgZnVuY3Rpb24gKHRvdGFsTWF0Y2gsIG1hcmtkb3duKSB7XG4gICAgICAgICAgcmV0dXJuICdcXG4nICsgbWFya2Rvd24ucmVwbGFjZSgvXlsgXXswLDN9Pj9bIFxcdF0qJC9nbSwgcmVwbGFjZW1lbnQpICsgJ1xcbic7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBpZiAoL14oPyFbIF17MCwzfT4pL20udGVzdChjaHVuay5zZWxlY3Rpb24pKSB7XG4gICAgdGhpcy53cmFwKGNodW5rLCBzZXR0aW5ncy5saW5lTGVuZ3RoIC0gMik7XG4gICAgY2h1bmsuc2VsZWN0aW9uID0gY2h1bmsuc2VsZWN0aW9uLnJlcGxhY2UoL14vZ20sICc+ICcpO1xuICAgIHJlcGxhY2VCbGFua3NJblRhZ3ModHJ1ZSk7XG4gICAgY2h1bmsuc2tpcExpbmVzKCk7XG4gIH0gZWxzZSB7XG4gICAgY2h1bmsuc2VsZWN0aW9uID0gY2h1bmsuc2VsZWN0aW9uLnJlcGxhY2UoL15bIF17MCwzfT4gPy9nbSwgJycpO1xuICAgIHRoaXMudW53cmFwKGNodW5rKTtcbiAgICByZXBsYWNlQmxhbmtzSW5UYWdzKGZhbHNlKTtcblxuICAgIGlmICghL14oXFxufF4pWyBdezAsM30+Ly50ZXN0KGNodW5rLnNlbGVjdGlvbikgJiYgY2h1bmsuc3RhcnRUYWcpIHtcbiAgICAgIGNodW5rLnN0YXJ0VGFnID0gY2h1bmsuc3RhcnRUYWcucmVwbGFjZSgvXFxuezAsMn0kLywgJ1xcblxcbicpO1xuICAgIH1cblxuICAgIGlmICghLyhcXG58XilbIF17MCwzfT4uKiQvLnRlc3QoY2h1bmsuc2VsZWN0aW9uKSAmJiBjaHVuay5lbmRUYWcpIHtcbiAgICAgIGNodW5rLmVuZFRhZyA9IGNodW5rLmVuZFRhZy5yZXBsYWNlKC9eXFxuezAsMn0vLCAnXFxuXFxuJyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCEvXFxuLy50ZXN0KGNodW5rLnNlbGVjdGlvbikpIHtcbiAgICBjaHVuay5zZWxlY3Rpb24gPSBjaHVuay5zZWxlY3Rpb24ucmVwbGFjZSgvXig+ICopLywgZnVuY3Rpb24gKHdob2xlTWF0Y2gsIGJsYW5rcykge1xuICAgICAgY2h1bmsuc3RhcnRUYWcgKz0gYmxhbmtzO1xuICAgICAgcmV0dXJuICcnO1xuICAgIH0pO1xuICB9XG59O1xuXG4kLmRvQ29kZSA9IGZ1bmN0aW9uIChjaHVuaywgcG9zdFByb2Nlc3NpbmcpIHtcblxuICB2YXIgaGFzVGV4dEJlZm9yZSA9IC9cXFNbIF0qJC8udGVzdChjaHVuay5iZWZvcmUpO1xuICB2YXIgaGFzVGV4dEFmdGVyID0gL15bIF0qXFxTLy50ZXN0KGNodW5rLmFmdGVyKTtcblxuICAvLyBVc2UgJ2ZvdXIgc3BhY2UnIG1hcmtkb3duIGlmIHRoZSBzZWxlY3Rpb24gaXMgb24gaXRzIG93blxuICAvLyBsaW5lIG9yIGlzIG11bHRpbGluZS5cbiAgaWYgKCghaGFzVGV4dEFmdGVyICYmICFoYXNUZXh0QmVmb3JlKSB8fCAvXFxuLy50ZXN0KGNodW5rLnNlbGVjdGlvbikpIHtcblxuICAgIGNodW5rLmJlZm9yZSA9IGNodW5rLmJlZm9yZS5yZXBsYWNlKC9bIF17NH0kLyxcbiAgICAgIGZ1bmN0aW9uICh0b3RhbE1hdGNoKSB7XG4gICAgICAgIGNodW5rLnNlbGVjdGlvbiA9IHRvdGFsTWF0Y2ggKyBjaHVuay5zZWxlY3Rpb247XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH0pO1xuXG4gICAgdmFyIG5MaW5lc0JhY2sgPSAxO1xuICAgIHZhciBuTGluZXNGb3J3YXJkID0gMTtcblxuICAgIGlmICgvKFxcbnxeKShcXHR8WyBdezQsfSkuKlxcbiQvLnRlc3QoY2h1bmsuYmVmb3JlKSkge1xuICAgICAgbkxpbmVzQmFjayA9IDA7XG4gICAgfVxuICAgIGlmICgvXlxcbihcXHR8WyBdezQsfSkvLnRlc3QoY2h1bmsuYWZ0ZXIpKSB7XG4gICAgICBuTGluZXNGb3J3YXJkID0gMDtcbiAgICB9XG5cbiAgICBjaHVuay5za2lwTGluZXMobkxpbmVzQmFjaywgbkxpbmVzRm9yd2FyZCk7XG5cbiAgICBpZiAoIWNodW5rLnNlbGVjdGlvbikge1xuICAgICAgY2h1bmsuc3RhcnRUYWcgPSAnICAgICc7XG4gICAgICBjaHVuay5zZWxlY3Rpb24gPSB0aGlzLmdldFN0cmluZygnY29kZWV4YW1wbGUnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpZiAoL15bIF17MCwzfVxcUy9tLnRlc3QoY2h1bmsuc2VsZWN0aW9uKSkge1xuICAgICAgICBpZiAoL1xcbi8udGVzdChjaHVuay5zZWxlY3Rpb24pKVxuICAgICAgICAgIGNodW5rLnNlbGVjdGlvbiA9IGNodW5rLnNlbGVjdGlvbi5yZXBsYWNlKC9eL2dtLCAnICAgICcpO1xuICAgICAgICBlbHNlIC8vIGlmIGl0J3Mgbm90IG11bHRpbGluZSwgZG8gbm90IHNlbGVjdCB0aGUgZm91ciBhZGRlZCBzcGFjZXM7IHRoaXMgaXMgbW9yZSBjb25zaXN0ZW50IHdpdGggdGhlIGRvTGlzdCBiZWhhdmlvclxuICAgICAgICAgIGNodW5rLmJlZm9yZSArPSAnICAgICc7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgY2h1bmsuc2VsZWN0aW9uID0gY2h1bmsuc2VsZWN0aW9uLnJlcGxhY2UoL14oPzpbIF17NH18WyBdezAsM31cXHQpL2dtLCAnJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGVsc2Uge1xuICAgIC8vIFVzZSBiYWNrdGlja3MgKGApIHRvIGRlbGltaXQgdGhlIGNvZGUgYmxvY2suXG5cbiAgICBjaHVuay50cmltV2hpdGVzcGFjZSgpO1xuICAgIGNodW5rLmZpbmRUYWdzKC9gLywgL2AvKTtcblxuICAgIGlmICghY2h1bmsuc3RhcnRUYWcgJiYgIWNodW5rLmVuZFRhZykge1xuICAgICAgY2h1bmsuc3RhcnRUYWcgPSBjaHVuay5lbmRUYWcgPSAnYCc7XG4gICAgICBpZiAoIWNodW5rLnNlbGVjdGlvbikge1xuICAgICAgICBjaHVuay5zZWxlY3Rpb24gPSB0aGlzLmdldFN0cmluZygnY29kZWV4YW1wbGUnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoY2h1bmsuZW5kVGFnICYmICFjaHVuay5zdGFydFRhZykge1xuICAgICAgY2h1bmsuYmVmb3JlICs9IGNodW5rLmVuZFRhZztcbiAgICAgIGNodW5rLmVuZFRhZyA9ICcnO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGNodW5rLnN0YXJ0VGFnID0gY2h1bmsuZW5kVGFnID0gJyc7XG4gICAgfVxuICB9XG59O1xuXG4kLmRvTGlzdCA9IGZ1bmN0aW9uIChjaHVuaywgcG9zdFByb2Nlc3NpbmcsIGlzTnVtYmVyZWRMaXN0KSB7XG4gIHZhciBwcmV2aW91c0l0ZW1zUmVnZXggPSAvKFxcbnxeKSgoWyBdezAsM30oWyorLV18XFxkK1suXSlbIFxcdF0rLiopKFxcbi4rfFxcbnsyLH0oWyorLV0uKnxcXGQrWy5dKVsgXFx0XSsuKnxcXG57Mix9WyBcXHRdK1xcUy4qKSopXFxuKiQvO1xuICB2YXIgbmV4dEl0ZW1zUmVnZXggPSAvXlxcbiooKFsgXXswLDN9KFsqKy1dfFxcZCtbLl0pWyBcXHRdKy4qKShcXG4uK3xcXG57Mix9KFsqKy1dLip8XFxkK1suXSlbIFxcdF0rLip8XFxuezIsfVsgXFx0XStcXFMuKikqKVxcbiovO1xuICB2YXIgYnVsbGV0ID0gJy0nO1xuICB2YXIgbnVtID0gMTtcblxuICBmdW5jdGlvbiBnZXRJdGVtUHJlZml4ICgpIHtcbiAgICB2YXIgcHJlZml4O1xuICAgIGlmIChpc051bWJlcmVkTGlzdCkge1xuICAgICAgcHJlZml4ID0gJyAnICsgbnVtICsgJy4gJztcbiAgICAgIG51bSsrO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHByZWZpeCA9ICcgJyArIGJ1bGxldCArICcgJztcbiAgICB9XG4gICAgcmV0dXJuIHByZWZpeDtcbiAgfTtcblxuICBmdW5jdGlvbiBnZXRQcmVmaXhlZEl0ZW0gKGl0ZW1UZXh0KSB7XG4gICAgaWYgKGlzTnVtYmVyZWRMaXN0ID09PSB2b2lkIDApIHtcbiAgICAgIGlzTnVtYmVyZWRMaXN0ID0gL15cXHMqXFxkLy50ZXN0KGl0ZW1UZXh0KTtcbiAgICB9XG5cbiAgICBpdGVtVGV4dCA9IGl0ZW1UZXh0LnJlcGxhY2UoL15bIF17MCwzfShbKistXXxcXGQrWy5dKVxccy9nbSwgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGdldEl0ZW1QcmVmaXgoKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBpdGVtVGV4dDtcbiAgfTtcblxuICBjaHVuay5maW5kVGFncygvKFxcbnxeKSpbIF17MCwzfShbKistXXxcXGQrWy5dKVxccysvLCBudWxsKTtcblxuICBpZiAoY2h1bmsuYmVmb3JlICYmICEvXFxuJC8udGVzdChjaHVuay5iZWZvcmUpICYmICEvXlxcbi8udGVzdChjaHVuay5zdGFydFRhZykpIHtcbiAgICBjaHVuay5iZWZvcmUgKz0gY2h1bmsuc3RhcnRUYWc7XG4gICAgY2h1bmsuc3RhcnRUYWcgPSAnJztcbiAgfVxuXG4gIGlmIChjaHVuay5zdGFydFRhZykge1xuXG4gICAgdmFyIGhhc0RpZ2l0cyA9IC9cXGQrWy5dLy50ZXN0KGNodW5rLnN0YXJ0VGFnKTtcbiAgICBjaHVuay5zdGFydFRhZyA9ICcnO1xuICAgIGNodW5rLnNlbGVjdGlvbiA9IGNodW5rLnNlbGVjdGlvbi5yZXBsYWNlKC9cXG5bIF17NH0vZywgJ1xcbicpO1xuICAgIHRoaXMudW53cmFwKGNodW5rKTtcbiAgICBjaHVuay5za2lwTGluZXMoKTtcblxuICAgIGlmIChoYXNEaWdpdHMpIHtcbiAgICAgIGNodW5rLmFmdGVyID0gY2h1bmsuYWZ0ZXIucmVwbGFjZShuZXh0SXRlbXNSZWdleCwgZ2V0UHJlZml4ZWRJdGVtKTtcbiAgICB9XG4gICAgaWYgKGlzTnVtYmVyZWRMaXN0ID09IGhhc0RpZ2l0cykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIHZhciBuTGluZXNVcCA9IDE7XG5cbiAgY2h1bmsuYmVmb3JlID0gY2h1bmsuYmVmb3JlLnJlcGxhY2UocHJldmlvdXNJdGVtc1JlZ2V4LFxuICAgIGZ1bmN0aW9uIChpdGVtVGV4dCkge1xuICAgICAgaWYgKC9eXFxzKihbKistXSkvLnRlc3QoaXRlbVRleHQpKSB7XG4gICAgICAgIGJ1bGxldCA9IHJlLiQxO1xuICAgICAgfVxuICAgICAgbkxpbmVzVXAgPSAvW15cXG5dXFxuXFxuW15cXG5dLy50ZXN0KGl0ZW1UZXh0KSA/IDEgOiAwO1xuICAgICAgcmV0dXJuIGdldFByZWZpeGVkSXRlbShpdGVtVGV4dCk7XG4gICAgfSk7XG5cbiAgaWYgKCFjaHVuay5zZWxlY3Rpb24pIHtcbiAgICBjaHVuay5zZWxlY3Rpb24gPSB0aGlzLmdldFN0cmluZygnbGl0ZW0nKTtcbiAgfVxuXG4gIHZhciBwcmVmaXggPSBnZXRJdGVtUHJlZml4KCk7XG4gIHZhciBuTGluZXNEb3duID0gMTtcblxuICBjaHVuay5hZnRlciA9IGNodW5rLmFmdGVyLnJlcGxhY2UobmV4dEl0ZW1zUmVnZXgsIGZ1bmN0aW9uIChpdGVtVGV4dCkge1xuICAgIG5MaW5lc0Rvd24gPSAvW15cXG5dXFxuXFxuW15cXG5dLy50ZXN0KGl0ZW1UZXh0KSA/IDEgOiAwO1xuICAgIHJldHVybiBnZXRQcmVmaXhlZEl0ZW0oaXRlbVRleHQpO1xuICB9KTtcbiAgY2h1bmsudHJpbVdoaXRlc3BhY2UodHJ1ZSk7XG4gIGNodW5rLnNraXBMaW5lcyhuTGluZXNVcCwgbkxpbmVzRG93biwgdHJ1ZSk7XG4gIGNodW5rLnN0YXJ0VGFnID0gcHJlZml4O1xuICB2YXIgc3BhY2VzID0gcHJlZml4LnJlcGxhY2UoLy4vZywgJyAnKTtcbiAgdGhpcy53cmFwKGNodW5rLCBzZXR0aW5ncy5saW5lTGVuZ3RoIC0gc3BhY2VzLmxlbmd0aCk7XG4gIGNodW5rLnNlbGVjdGlvbiA9IGNodW5rLnNlbGVjdGlvbi5yZXBsYWNlKC9cXG4vZywgJ1xcbicgKyBzcGFjZXMpO1xuXG59O1xuXG4kLmRvSGVhZGluZyA9IGZ1bmN0aW9uIChjaHVuaywgcG9zdFByb2Nlc3NpbmcpIHtcbiAgY2h1bmsuc2VsZWN0aW9uID0gY2h1bmsuc2VsZWN0aW9uLnJlcGxhY2UoL1xccysvZywgJyAnKTtcbiAgY2h1bmsuc2VsZWN0aW9uID0gY2h1bmsuc2VsZWN0aW9uLnJlcGxhY2UoLyheXFxzK3xcXHMrJCkvZywgJycpO1xuXG4gIGlmICghY2h1bmsuc2VsZWN0aW9uKSB7XG4gICAgY2h1bmsuc3RhcnRUYWcgPSAnIyMgJztcbiAgICBjaHVuay5zZWxlY3Rpb24gPSB0aGlzLmdldFN0cmluZygnaGVhZGluZ2V4YW1wbGUnKTtcbiAgICBjaHVuay5lbmRUYWcgPSAnJztcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgaGVhZGVyTGV2ZWwgPSAwO1xuXG4gIGNodW5rLmZpbmRUYWdzKC8jK1sgXSovLCAvWyBdKiMrLyk7XG4gIGlmICgvIysvLnRlc3QoY2h1bmsuc3RhcnRUYWcpKSB7XG4gICAgaGVhZGVyTGV2ZWwgPSByZS5sYXN0TWF0Y2gubGVuZ3RoO1xuICB9XG4gIGNodW5rLnN0YXJ0VGFnID0gY2h1bmsuZW5kVGFnID0gJyc7XG4gIGNodW5rLmZpbmRUYWdzKG51bGwsIC9cXHM/KC0rfD0rKS8pO1xuICBpZiAoLz0rLy50ZXN0KGNodW5rLmVuZFRhZykpIHtcbiAgICBoZWFkZXJMZXZlbCA9IDE7XG4gIH1cbiAgaWYgKC8tKy8udGVzdChjaHVuay5lbmRUYWcpKSB7XG4gICAgaGVhZGVyTGV2ZWwgPSAyO1xuICB9XG5cbiAgY2h1bmsuc3RhcnRUYWcgPSBjaHVuay5lbmRUYWcgPSAnJztcbiAgY2h1bmsuc2tpcExpbmVzKDEsIDEpO1xuXG4gIHZhciBoZWFkZXJMZXZlbFRvQ3JlYXRlID0gaGVhZGVyTGV2ZWwgPT0gMSA/IDIgOiBoZWFkZXJMZXZlbCAtIDE7XG4gIGlmIChoZWFkZXJMZXZlbFRvQ3JlYXRlID4gMCkge1xuICAgIGNodW5rLmVuZFRhZyA9ICdcXG4nO1xuICAgIHdoaWxlIChoZWFkZXJMZXZlbFRvQ3JlYXRlLS0pIHtcbiAgICAgIGNodW5rLnN0YXJ0VGFnICs9ICcjJztcbiAgICB9XG4gICAgY2h1bmsuc3RhcnRUYWcgKz0gJyAnO1xuICB9XG59O1xuXG4kLmRvSG9yaXpvbnRhbFJ1bGUgPSBmdW5jdGlvbiAoY2h1bmssIHBvc3RQcm9jZXNzaW5nKSB7XG4gIGNodW5rLnN0YXJ0VGFnID0gJy0tLS0tLS0tLS1cXG4nO1xuICBjaHVuay5zZWxlY3Rpb24gPSAnJztcbiAgY2h1bmsuc2tpcExpbmVzKDIsIDEsIHRydWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbW1hbmRNYW5hZ2VyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW1pdHRlciA9IHJlcXVpcmUoJ2NvbnRyYS5lbWl0dGVyJyk7XG52YXIgdWkgPSByZXF1aXJlKCcuL3VpJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIHBvc2l0aW9uID0gcmVxdWlyZSgnLi9wb3NpdGlvbicpO1xudmFyIFBhbmVsQ29sbGVjdGlvbiA9IHJlcXVpcmUoJy4vUGFuZWxDb2xsZWN0aW9uJyk7XG52YXIgVW5kb01hbmFnZXIgPSByZXF1aXJlKCcuL1VuZG9NYW5hZ2VyJyk7XG52YXIgVUlNYW5hZ2VyID0gcmVxdWlyZSgnLi9VSU1hbmFnZXInKTtcbnZhciBDb21tYW5kTWFuYWdlciA9IHJlcXVpcmUoJy4vQ29tbWFuZE1hbmFnZXInKTtcbnZhciBQcmV2aWV3TWFuYWdlciA9IHJlcXVpcmUoJy4vUHJldmlld01hbmFnZXInKTtcblxudmFyIGRlZmF1bHRzU3RyaW5ncyA9IHtcbiAgYm9sZDogJ1N0cm9uZyA8c3Ryb25nPiBDdHJsK0InLFxuICBib2xkZXhhbXBsZTogJ3N0cm9uZyB0ZXh0JyxcbiAgY29kZTogJ0NvZGUgU2FtcGxlIDxwcmU+PGNvZGU+IEN0cmwrSycsXG4gIGNvZGVleGFtcGxlOiAnZW50ZXIgY29kZSBoZXJlJyxcbiAgaGVhZGluZzogJ0hlYWRpbmcgPGgxPi88aDI+IEN0cmwrSCcsXG4gIGhlYWRpbmdleGFtcGxlOiAnSGVhZGluZycsXG4gIGhlbHA6ICdNYXJrZG93biBFZGl0aW5nIEhlbHAnLFxuICBocjogJ0hvcml6b250YWwgUnVsZSA8aHI+IEN0cmwrUicsXG4gIGltYWdlOiAnSW1hZ2UgPGltZz4gQ3RybCtHJyxcbiAgaW1hZ2VkZXNjcmlwdGlvbjogJ2VudGVyIGltYWdlIGRlc2NyaXB0aW9uIGhlcmUnLFxuICBpdGFsaWM6ICdFbXBoYXNpcyA8ZW0+IEN0cmwrSScsXG4gIGl0YWxpY2V4YW1wbGU6ICdlbXBoYXNpemVkIHRleHQnLFxuICBsaW5rOiAnSHlwZXJsaW5rIDxhPiBDdHJsK0wnLFxuICBsaW5rZGVzY3JpcHRpb246ICdlbnRlciBsaW5rIGRlc2NyaXB0aW9uIGhlcmUnLFxuICBsaXRlbTogJ0xpc3QgaXRlbScsXG4gIG9saXN0OiAnTnVtYmVyZWQgTGlzdCA8b2w+IEN0cmwrTycsXG4gIHF1b3RlOiAnQmxvY2txdW90ZSA8YmxvY2txdW90ZT4gQ3RybCtRJyxcbiAgcXVvdGVleGFtcGxlOiAnQmxvY2txdW90ZScsXG4gIHJlZG86ICdSZWRvIC0gQ3RybCtZJyxcbiAgcmVkb21hYzogJ1JlZG8gLSBDdHJsK1NoaWZ0K1onLFxuICB1bGlzdDogJ0J1bGxldGVkIExpc3QgPHVsPiBDdHJsK1UnLFxuICB1bmRvOiAnVW5kbyAtIEN0cmwrWidcbn07XG5cbmZ1bmN0aW9uIEVkaXRvciAocG9zdGZpeCwgb3B0cykge1xuICB2YXIgb3B0aW9ucyA9IG9wdHMgfHwge307XG5cbiAgaWYgKHR5cGVvZiBvcHRpb25zLmhhbmRsZXIgPT09ICdmdW5jdGlvbicpIHsgLy9iYWNrd2FyZHMgY29tcGF0aWJsZSBiZWhhdmlvclxuICAgIG9wdGlvbnMgPSB7IGhlbHBCdXR0b246IG9wdGlvbnMgfTtcbiAgfVxuICBvcHRpb25zLnN0cmluZ3MgPSBvcHRpb25zLnN0cmluZ3MgfHwge307XG4gIGlmIChvcHRpb25zLmhlbHBCdXR0b24pIHtcbiAgICBvcHRpb25zLnN0cmluZ3MuaGVscCA9IG9wdGlvbnMuc3RyaW5ncy5oZWxwIHx8IG9wdGlvbnMuaGVscEJ1dHRvbi50aXRsZTtcbiAgfVxuICBmdW5jdGlvbiBnZXRTdHJpbmcgKGlkZW50aWZpZXIpIHtcbiAgICByZXR1cm4gb3B0aW9ucy5zdHJpbmdzW2lkZW50aWZpZXJdIHx8IGRlZmF1bHRzU3RyaW5nc1tpZGVudGlmaWVyXTtcbiAgfVxuXG4gIHZhciBhcGkgPSBlbWl0dGVyKCk7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIHBhbmVscztcblxuICBzZWxmLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAocGFuZWxzKSB7XG4gICAgICByZXR1cm47IC8vIGFscmVhZHkgaW5pdGlhbGl6ZWRcbiAgICB9XG5cbiAgICBwYW5lbHMgPSBuZXcgUGFuZWxDb2xsZWN0aW9uKHBvc3RmaXgpO1xuXG4gICAgdmFyIGNvbW1hbmRNYW5hZ2VyID0gbmV3IENvbW1hbmRNYW5hZ2VyKGdldFN0cmluZyk7XG4gICAgdmFyIHByZXZpZXdNYW5hZ2VyID0gbmV3IFByZXZpZXdNYW5hZ2VyKHBhbmVscywgZnVuY3Rpb24gKCkge1xuICAgICAgYXBpLmVtaXQoJ3JlZnJlc2gnKTtcbiAgICB9KTtcbiAgICB2YXIgdWlNYW5hZ2VyO1xuXG4gICAgdmFyIHVuZG9NYW5hZ2VyID0gbmV3IFVuZG9NYW5hZ2VyKGZ1bmN0aW9uICgpIHtcbiAgICAgIHByZXZpZXdNYW5hZ2VyLnJlZnJlc2goKTtcbiAgICAgIGlmICh1aU1hbmFnZXIpIHsgLy8gbm90IGF2YWlsYWJsZSBvbiB0aGUgZmlyc3QgY2FsbFxuICAgICAgICB1aU1hbmFnZXIuc2V0VW5kb1JlZG9CdXR0b25TdGF0ZXMoKTtcbiAgICAgIH1cbiAgICB9LCBwYW5lbHMpO1xuXG4gICAgdWlNYW5hZ2VyID0gbmV3IFVJTWFuYWdlcihwb3N0Zml4LCBwYW5lbHMsIHVuZG9NYW5hZ2VyLCBwcmV2aWV3TWFuYWdlciwgY29tbWFuZE1hbmFnZXIsIG9wdGlvbnMuaGVscEJ1dHRvbiwgZ2V0U3RyaW5nKTtcbiAgICB1aU1hbmFnZXIuc2V0VW5kb1JlZG9CdXR0b25TdGF0ZXMoKTtcblxuICAgIGFwaS5yZWZyZXNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgcHJldmlld01hbmFnZXIucmVmcmVzaCh0cnVlKTtcbiAgICB9O1xuICAgIGFwaS5yZWZyZXNoKCk7XG4gIH07XG5cbiAgc2VsZi5hcGkgPSBhcGk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRWRpdG9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBQYW5lbENvbGxlY3Rpb24gKHBvc3RmaXgpIHtcbiAgdGhpcy5idXR0b25CYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG1rLWJ1dHRvbnMtJyArIHBvc3RmaXgpO1xuICB0aGlzLnByZXZpZXcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG1rLXByZXZpZXctJyArIHBvc3RmaXgpO1xuICB0aGlzLmlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Btay1pbnB1dC0nICsgcG9zdGZpeCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGFuZWxDb2xsZWN0aW9uO1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZG9jID0gZ2xvYmFsLmRvY3VtZW50O1xudmFyIHVhID0gcmVxdWlyZSgnLi91YScpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciBwYXJzZSA9IHJlcXVpcmUoJy4vcGFyc2UnKTtcbnZhciBwb3NpdGlvbiA9IHJlcXVpcmUoJy4vcG9zaXRpb24nKTtcblxuZnVuY3Rpb24gUHJldmlld01hbmFnZXIgKHBhbmVscywgcHJldmlld1JlZnJlc2hDYWxsYmFjaykge1xuICB2YXIgbWFuYWdlck9iaiA9IHRoaXM7XG4gIHZhciB0aW1lb3V0O1xuICB2YXIgZWxhcHNlZFRpbWU7XG4gIHZhciBvbGRJbnB1dFRleHQ7XG4gIHZhciBtYXhEZWxheSA9IDMwMDA7XG4gIHZhciBzdGFydFR5cGUgPSAnZGVsYXllZCc7IC8vIFRoZSBvdGhlciBsZWdhbCB2YWx1ZSBpcyAnbWFudWFsJ1xuXG4gIC8vIEFkZHMgZXZlbnQgbGlzdGVuZXJzIHRvIGVsZW1lbnRzXG4gIHZhciBzZXR1cEV2ZW50cyA9IGZ1bmN0aW9uIChpbnB1dEVsZW0sIGxpc3RlbmVyKSB7XG5cbiAgICB1dGlsLmFkZEV2ZW50KGlucHV0RWxlbSwgJ2lucHV0JywgbGlzdGVuZXIpO1xuICAgIGlucHV0RWxlbS5vbnBhc3RlID0gbGlzdGVuZXI7XG4gICAgaW5wdXRFbGVtLm9uZHJvcCA9IGxpc3RlbmVyO1xuXG4gICAgdXRpbC5hZGRFdmVudChpbnB1dEVsZW0sICdrZXlwcmVzcycsIGxpc3RlbmVyKTtcbiAgICB1dGlsLmFkZEV2ZW50KGlucHV0RWxlbSwgJ2tleWRvd24nLCBsaXN0ZW5lcik7XG4gIH07XG5cbiAgdmFyIGdldERvY1Njcm9sbFRvcCA9IGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciByZXN1bHQgPSAwO1xuXG4gICAgaWYgKHdpbmRvdy5pbm5lckhlaWdodCkge1xuICAgICAgcmVzdWx0ID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgIH0gZWxzZSBpZiAoZG9jLmRvY3VtZW50RWxlbWVudCAmJiBkb2MuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCkge1xuICAgICAgcmVzdWx0ID0gZG9jLmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XG4gICAgfSBlbHNlIGlmIChkb2MuYm9keSkge1xuICAgICAgcmVzdWx0ID0gZG9jLmJvZHkuc2Nyb2xsVG9wO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgdmFyIG1ha2VQcmV2aWV3SHRtbCA9IGZ1bmN0aW9uICgpIHtcblxuICAgIC8vIElmIHRoZXJlIGlzIG5vIHJlZ2lzdGVyZWQgcHJldmlldyBwYW5lbFxuICAgIC8vIHRoZXJlIGlzIG5vdGhpbmcgdG8gZG8uXG4gICAgaWYgKCFwYW5lbHMucHJldmlldykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciB0ZXh0ID0gcGFuZWxzLmlucHV0LnZhbHVlO1xuICAgIGlmICh0ZXh0ICYmIHRleHQgPT0gb2xkSW5wdXRUZXh0KSB7XG4gICAgICByZXR1cm47IC8vIElucHV0IHRleHQgaGFzbid0IGNoYW5nZWQuXG4gICAgfSBlbHNlIHtcbiAgICAgIG9sZElucHV0VGV4dCA9IHRleHQ7XG4gICAgfVxuXG4gICAgdmFyIHByZXZUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICB0ZXh0ID0gcGFyc2UodGV4dCk7XG5cbiAgICAvLyBDYWxjdWxhdGUgdGhlIHByb2Nlc3NpbmcgdGltZSBvZiB0aGUgSFRNTCBjcmVhdGlvbi5cbiAgICAvLyBJdCdzIHVzZWQgYXMgdGhlIGRlbGF5IHRpbWUgaW4gdGhlIGV2ZW50IGxpc3RlbmVyLlxuICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIGVsYXBzZWRUaW1lID0gY3VyclRpbWUgLSBwcmV2VGltZTtcblxuICAgIHB1c2hQcmV2aWV3SHRtbCh0ZXh0KTtcbiAgfTtcblxuICAvLyBzZXRUaW1lb3V0IGlzIGFscmVhZHkgdXNlZC4gIFVzZWQgYXMgYW4gZXZlbnQgbGlzdGVuZXIuXG4gIHZhciBhcHBseVRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICBpZiAodGltZW91dCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgdGltZW91dCA9IHZvaWQgMDtcbiAgICB9XG5cbiAgICBpZiAoc3RhcnRUeXBlICE9PSAnbWFudWFsJykge1xuXG4gICAgICB2YXIgZGVsYXkgPSAwO1xuXG4gICAgICBpZiAoc3RhcnRUeXBlID09PSAnZGVsYXllZCcpIHtcbiAgICAgICAgZGVsYXkgPSBlbGFwc2VkVGltZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRlbGF5ID4gbWF4RGVsYXkpIHtcbiAgICAgICAgZGVsYXkgPSBtYXhEZWxheTtcbiAgICAgIH1cbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KG1ha2VQcmV2aWV3SHRtbCwgZGVsYXkpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgZ2V0U2NhbGVGYWN0b3IgPSBmdW5jdGlvbiAocGFuZWwpIHtcbiAgICBpZiAocGFuZWwuc2Nyb2xsSGVpZ2h0IDw9IHBhbmVsLmNsaWVudEhlaWdodCkge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfVxuICAgIHJldHVybiBwYW5lbC5zY3JvbGxUb3AgLyAocGFuZWwuc2Nyb2xsSGVpZ2h0IC0gcGFuZWwuY2xpZW50SGVpZ2h0KTtcbiAgfTtcblxuICB2YXIgc2V0UGFuZWxTY3JvbGxUb3BzID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChwYW5lbHMucHJldmlldykge1xuICAgICAgcGFuZWxzLnByZXZpZXcuc2Nyb2xsVG9wID0gKHBhbmVscy5wcmV2aWV3LnNjcm9sbEhlaWdodCAtIHBhbmVscy5wcmV2aWV3LmNsaWVudEhlaWdodCkgKiBnZXRTY2FsZUZhY3RvcihwYW5lbHMucHJldmlldyk7XG4gICAgfVxuICB9O1xuXG4gIHRoaXMucmVmcmVzaCA9IGZ1bmN0aW9uIChyZXF1aXJlc1JlZnJlc2gpIHtcblxuICAgIGlmIChyZXF1aXJlc1JlZnJlc2gpIHtcbiAgICAgIG9sZElucHV0VGV4dCA9ICcnO1xuICAgICAgbWFrZVByZXZpZXdIdG1sKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgYXBwbHlUaW1lb3V0KCk7XG4gICAgfVxuICB9O1xuXG4gIHRoaXMucHJvY2Vzc2luZ1RpbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGVsYXBzZWRUaW1lO1xuICB9O1xuXG4gIHZhciBpc0ZpcnN0VGltZUZpbGxlZCA9IHRydWU7XG5cbiAgLy8gSUUgZG9lc24ndCBsZXQgeW91IHVzZSBpbm5lckhUTUwgaWYgdGhlIGVsZW1lbnQgaXMgY29udGFpbmVkIHNvbWV3aGVyZSBpbiBhIHRhYmxlXG4gIC8vICh3aGljaCBpcyB0aGUgY2FzZSBmb3IgaW5saW5lIGVkaXRpbmcpIC0tIGluIHRoYXQgY2FzZSwgZGV0YWNoIHRoZSBlbGVtZW50LCBzZXQgdGhlXG4gIC8vIHZhbHVlLCBhbmQgcmVhdHRhY2guIFllcywgdGhhdCAqaXMqIHJpZGljdWxvdXMuXG4gIHZhciBpZVNhZmVQcmV2aWV3U2V0ID0gZnVuY3Rpb24gKHRleHQpIHtcbiAgICB2YXIgcHJldmlldyA9IHBhbmVscy5wcmV2aWV3O1xuICAgIHZhciBwYXJlbnQgPSBwcmV2aWV3LnBhcmVudE5vZGU7XG4gICAgdmFyIHNpYmxpbmcgPSBwcmV2aWV3Lm5leHRTaWJsaW5nO1xuICAgIHBhcmVudC5yZW1vdmVDaGlsZChwcmV2aWV3KTtcbiAgICBwcmV2aWV3LmlubmVySFRNTCA9IHRleHQ7XG4gICAgaWYgKCFzaWJsaW5nKVxuICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHByZXZpZXcpO1xuICAgIGVsc2VcbiAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUocHJldmlldywgc2libGluZyk7XG4gIH1cblxuICB2YXIgbm9uU3Vja3lCcm93c2VyUHJldmlld1NldCA9IGZ1bmN0aW9uICh0ZXh0KSB7XG4gICAgcGFuZWxzLnByZXZpZXcuaW5uZXJIVE1MID0gdGV4dDtcbiAgfVxuXG4gIHZhciBwcmV2aWV3U2V0dGVyO1xuXG4gIHZhciBwcmV2aWV3U2V0ID0gZnVuY3Rpb24gKHRleHQpIHtcbiAgICBpZiAocHJldmlld1NldHRlcilcbiAgICAgIHJldHVybiBwcmV2aWV3U2V0dGVyKHRleHQpO1xuXG4gICAgdHJ5IHtcbiAgICAgIG5vblN1Y2t5QnJvd3NlclByZXZpZXdTZXQodGV4dCk7XG4gICAgICBwcmV2aWV3U2V0dGVyID0gbm9uU3Vja3lCcm93c2VyUHJldmlld1NldDtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBwcmV2aWV3U2V0dGVyID0gaWVTYWZlUHJldmlld1NldDtcbiAgICAgIHByZXZpZXdTZXR0ZXIodGV4dCk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBwdXNoUHJldmlld0h0bWwgPSBmdW5jdGlvbiAodGV4dCkge1xuXG4gICAgdmFyIGVtcHR5VG9wID0gcG9zaXRpb24uZ2V0VG9wKHBhbmVscy5pbnB1dCkgLSBnZXREb2NTY3JvbGxUb3AoKTtcblxuICAgIGlmIChwYW5lbHMucHJldmlldykge1xuICAgICAgcHJldmlld1NldCh0ZXh0KTtcbiAgICAgIHByZXZpZXdSZWZyZXNoQ2FsbGJhY2soKTtcbiAgICB9XG5cbiAgICBzZXRQYW5lbFNjcm9sbFRvcHMoKTtcblxuICAgIGlmIChpc0ZpcnN0VGltZUZpbGxlZCkge1xuICAgICAgaXNGaXJzdFRpbWVGaWxsZWQgPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZnVsbFRvcCA9IHBvc2l0aW9uLmdldFRvcChwYW5lbHMuaW5wdXQpIC0gZ2V0RG9jU2Nyb2xsVG9wKCk7XG5cbiAgICBpZiAodWEuaXNJRSkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdpbmRvdy5zY3JvbGxCeSgwLCBmdWxsVG9wIC0gZW1wdHlUb3ApO1xuICAgICAgfSwgMCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgd2luZG93LnNjcm9sbEJ5KDAsIGZ1bGxUb3AgLSBlbXB0eVRvcCk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBpbml0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgc2V0dXBFdmVudHMocGFuZWxzLmlucHV0LCBhcHBseVRpbWVvdXQpO1xuICAgIG1ha2VQcmV2aWV3SHRtbCgpO1xuXG4gICAgaWYgKHBhbmVscy5wcmV2aWV3KSB7XG4gICAgICBwYW5lbHMucHJldmlldy5zY3JvbGxUb3AgPSAwO1xuICAgIH1cbiAgfTtcblxuICBpbml0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByZXZpZXdNYW5hZ2VyO1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIGRvYyA9IGdsb2JhbC5kb2N1bWVudDtcbnZhciBDaHVua3MgPSByZXF1aXJlKCcuL0NodW5rcycpO1xudmFyIHVhID0gcmVxdWlyZSgnLi91YScpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuZnVuY3Rpb24gVGV4dGFyZWFTdGF0ZSAocGFuZWxzLCBpc0luaXRpYWxTdGF0ZSkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBpbnB1dCA9IHBhbmVscy5pbnB1dDtcblxuICBzZWxmLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF1dGlsLmlzVmlzaWJsZShpbnB1dCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFpc0luaXRpYWxTdGF0ZSAmJiBkb2MuYWN0aXZlRWxlbWVudCAmJiBkb2MuYWN0aXZlRWxlbWVudCAhPT0gaW5wdXQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzZWxmLnNldElucHV0U2VsZWN0aW9uU3RhcnRFbmQoKTtcbiAgICBzZWxmLnNjcm9sbFRvcCA9IGlucHV0LnNjcm9sbFRvcDtcbiAgICBpZiAoIXNlbGYudGV4dCAmJiBpbnB1dC5zZWxlY3Rpb25TdGFydCB8fCBpbnB1dC5zZWxlY3Rpb25TdGFydCA9PT0gMCkge1xuICAgICAgc2VsZi50ZXh0ID0gaW5wdXQudmFsdWU7XG4gICAgfVxuICB9XG5cbiAgc2VsZi5zZXRJbnB1dFNlbGVjdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXV0aWwuaXNWaXNpYmxlKGlucHV0KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChpbnB1dC5zZWxlY3Rpb25TdGFydCAhPT0gdm9pZCAwICYmICF1YS5pc09wZXJhKSB7XG4gICAgICBpbnB1dC5mb2N1cygpO1xuICAgICAgaW5wdXQuc2VsZWN0aW9uU3RhcnQgPSBzZWxmLnN0YXJ0O1xuICAgICAgaW5wdXQuc2VsZWN0aW9uRW5kID0gc2VsZi5lbmQ7XG4gICAgICBpbnB1dC5zY3JvbGxUb3AgPSBzZWxmLnNjcm9sbFRvcDtcbiAgICB9IGVsc2UgaWYgKGRvYy5zZWxlY3Rpb24pIHtcbiAgICAgIGlmIChkb2MuYWN0aXZlRWxlbWVudCAmJiBkb2MuYWN0aXZlRWxlbWVudCAhPT0gaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpbnB1dC5mb2N1cygpO1xuICAgICAgdmFyIHJhbmdlID0gaW5wdXQuY3JlYXRlVGV4dFJhbmdlKCk7XG4gICAgICByYW5nZS5tb3ZlU3RhcnQoJ2NoYXJhY3RlcicsIC1pbnB1dC52YWx1ZS5sZW5ndGgpO1xuICAgICAgcmFuZ2UubW92ZUVuZCgnY2hhcmFjdGVyJywgLWlucHV0LnZhbHVlLmxlbmd0aCk7XG4gICAgICByYW5nZS5tb3ZlRW5kKCdjaGFyYWN0ZXInLCBzZWxmLmVuZCk7XG4gICAgICByYW5nZS5tb3ZlU3RhcnQoJ2NoYXJhY3RlcicsIHNlbGYuc3RhcnQpO1xuICAgICAgcmFuZ2Uuc2VsZWN0KCk7XG4gICAgfVxuICB9O1xuXG4gIHNlbGYuc2V0SW5wdXRTZWxlY3Rpb25TdGFydEVuZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXBhbmVscy5pZUNhY2hlZFJhbmdlICYmIChpbnB1dC5zZWxlY3Rpb25TdGFydCB8fCBpbnB1dC5zZWxlY3Rpb25TdGFydCA9PT0gMCkpIHtcbiAgICAgIHNlbGYuc3RhcnQgPSBpbnB1dC5zZWxlY3Rpb25TdGFydDtcbiAgICAgIHNlbGYuZW5kID0gaW5wdXQuc2VsZWN0aW9uRW5kO1xuICAgIH0gZWxzZSBpZiAoZG9jLnNlbGVjdGlvbikge1xuICAgICAgc2VsZi50ZXh0ID0gdXRpbC5maXhFb2xDaGFycyhpbnB1dC52YWx1ZSk7XG5cbiAgICAgIHZhciByYW5nZSA9IHBhbmVscy5pZUNhY2hlZFJhbmdlIHx8IGRvYy5zZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKTtcbiAgICAgIHZhciBmaXhlZFJhbmdlID0gdXRpbC5maXhFb2xDaGFycyhyYW5nZS50ZXh0KTtcbiAgICAgIHZhciBtYXJrZXIgPSAnXFx4MDcnO1xuICAgICAgdmFyIG1hcmtlZFJhbmdlID0gbWFya2VyICsgZml4ZWRSYW5nZSArIG1hcmtlcjtcbiAgICAgIHJhbmdlLnRleHQgPSBtYXJrZWRSYW5nZTtcbiAgICAgIHZhciBpbnB1dFRleHQgPSB1dGlsLmZpeEVvbENoYXJzKGlucHV0LnZhbHVlKTtcblxuICAgICAgcmFuZ2UubW92ZVN0YXJ0KCdjaGFyYWN0ZXInLCAtbWFya2VkUmFuZ2UubGVuZ3RoKTtcbiAgICAgIHJhbmdlLnRleHQgPSBmaXhlZFJhbmdlO1xuXG4gICAgICBzZWxmLnN0YXJ0ID0gaW5wdXRUZXh0LmluZGV4T2YobWFya2VyKTtcbiAgICAgIHNlbGYuZW5kID0gaW5wdXRUZXh0Lmxhc3RJbmRleE9mKG1hcmtlcikgLSBtYXJrZXIubGVuZ3RoO1xuXG4gICAgICB2YXIgbGVuID0gc2VsZi50ZXh0Lmxlbmd0aCAtIHV0aWwuZml4RW9sQ2hhcnMoaW5wdXQudmFsdWUpLmxlbmd0aDtcbiAgICAgIGlmIChsZW4pIHtcbiAgICAgICAgcmFuZ2UubW92ZVN0YXJ0KCdjaGFyYWN0ZXInLCAtZml4ZWRSYW5nZS5sZW5ndGgpO1xuICAgICAgICB3aGlsZSAobGVuLS0pIHtcbiAgICAgICAgICBmaXhlZFJhbmdlICs9ICdcXG4nO1xuICAgICAgICAgIHNlbGYuZW5kICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmFuZ2UudGV4dCA9IGZpeGVkUmFuZ2U7XG4gICAgICB9XG5cbiAgICAgIGlmIChwYW5lbHMuaWVDYWNoZWRSYW5nZSkge1xuICAgICAgICBzZWxmLnNjcm9sbFRvcCA9IHBhbmVscy5pZUNhY2hlZFNjcm9sbFRvcDtcbiAgICAgIH1cbiAgICAgIHBhbmVscy5pZUNhY2hlZFJhbmdlID0gbnVsbDtcbiAgICAgIHNlbGYuc2V0SW5wdXRTZWxlY3Rpb24oKTtcbiAgICB9XG4gIH07XG5cbiBzZWxmLnJlc3RvcmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHNlbGYudGV4dCAhPSB2b2lkIDAgJiYgc2VsZi50ZXh0ICE9IGlucHV0LnZhbHVlKSB7XG4gICAgICBpbnB1dC52YWx1ZSA9IHNlbGYudGV4dDtcbiAgICB9XG4gICAgc2VsZi5zZXRJbnB1dFNlbGVjdGlvbigpO1xuICAgIGlucHV0LnNjcm9sbFRvcCA9IHNlbGYuc2Nyb2xsVG9wO1xuICB9O1xuXG4gIHNlbGYuZ2V0Q2h1bmtzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjaHVuayA9IG5ldyBDaHVua3MoKTtcbiAgICBjaHVuay5iZWZvcmUgPSB1dGlsLmZpeEVvbENoYXJzKHNlbGYudGV4dC5zdWJzdHJpbmcoMCwgc2VsZi5zdGFydCkpO1xuICAgIGNodW5rLnN0YXJ0VGFnID0gJyc7XG4gICAgY2h1bmsuc2VsZWN0aW9uID0gdXRpbC5maXhFb2xDaGFycyhzZWxmLnRleHQuc3Vic3RyaW5nKHNlbGYuc3RhcnQsIHNlbGYuZW5kKSk7XG4gICAgY2h1bmsuZW5kVGFnID0gJyc7XG4gICAgY2h1bmsuYWZ0ZXIgPSB1dGlsLmZpeEVvbENoYXJzKHNlbGYudGV4dC5zdWJzdHJpbmcoc2VsZi5lbmQpKTtcbiAgICBjaHVuay5zY3JvbGxUb3AgPSBzZWxmLnNjcm9sbFRvcDtcbiAgICByZXR1cm4gY2h1bms7XG4gIH07XG5cbiAgc2VsZi5zZXRDaHVua3MgPSBmdW5jdGlvbiAoY2h1bmspIHtcbiAgICBjaHVuay5iZWZvcmUgPSBjaHVuay5iZWZvcmUgKyBjaHVuay5zdGFydFRhZztcbiAgICBjaHVuay5hZnRlciA9IGNodW5rLmVuZFRhZyArIGNodW5rLmFmdGVyO1xuICAgIHNlbGYuc3RhcnQgPSBjaHVuay5iZWZvcmUubGVuZ3RoO1xuICAgIHNlbGYuZW5kID0gY2h1bmsuYmVmb3JlLmxlbmd0aCArIGNodW5rLnNlbGVjdGlvbi5sZW5ndGg7XG4gICAgc2VsZi50ZXh0ID0gY2h1bmsuYmVmb3JlICsgY2h1bmsuc2VsZWN0aW9uICsgY2h1bmsuYWZ0ZXI7XG4gICAgc2VsZi5zY3JvbGxUb3AgPSBjaHVuay5zY3JvbGxUb3A7XG4gIH07XG5cbiAgc2VsZi5pbml0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRleHRhcmVhU3RhdGU7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZG9jID0gZ2xvYmFsLmRvY3VtZW50O1xudmFyIGMgPSBkb2MuY3JlYXRlRWxlbWVudC5iaW5kKGRvYyk7XG52YXIgdWEgPSByZXF1aXJlKCcuL3VhJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIFRleHRhcmVhU3RhdGUgPSByZXF1aXJlKCcuL1RleHRhcmVhU3RhdGUnKTtcblxuZnVuY3Rpb24gVUlNYW5hZ2VyIChwb3N0Zml4LCBwYW5lbHMsIHVuZG9NYW5hZ2VyLCBwcmV2aWV3TWFuYWdlciwgY29tbWFuZE1hbmFnZXIsIGhlbHBPcHRpb25zLCBnZXRTdHJpbmcpIHtcbiAgdmFyIGlucHV0Qm94ID0gcGFuZWxzLmlucHV0O1xuICB2YXIgYnV0dG9ucyA9IHt9O1xuXG4gIG1ha2VTcHJpdGVkQnV0dG9uUm93KCk7XG5cbiAgdmFyIGtleUV2ZW50ID0gJ2tleWRvd24nO1xuICBpZiAodWEuaXNPcGVyYSkge1xuICAgIGtleUV2ZW50ID0gJ2tleXByZXNzJztcbiAgfVxuXG4gIHV0aWwuYWRkRXZlbnQoaW5wdXRCb3gsIGtleUV2ZW50LCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKCgha2V5LmN0cmxLZXkgJiYgIWtleS5tZXRhS2V5KSB8fCBrZXkuYWx0S2V5IHx8IGtleS5zaGlmdEtleSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBrZXlDb2RlID0ga2V5LmNoYXJDb2RlIHx8IGtleS5rZXlDb2RlO1xuICAgIHZhciBrZXlDb2RlU3RyID0gU3RyaW5nLmZyb21DaGFyQ29kZShrZXlDb2RlKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgc3dpdGNoIChrZXlDb2RlU3RyKSB7XG4gICAgICBjYXNlICdiJzogZG9DbGljayhidXR0b25zLmJvbGQpOyBicmVhaztcbiAgICAgIGNhc2UgJ2knOiBkb0NsaWNrKGJ1dHRvbnMuaXRhbGljKTsgYnJlYWs7XG4gICAgICBjYXNlICdsJzogZG9DbGljayhidXR0b25zLmxpbmspOyBicmVhaztcbiAgICAgIGNhc2UgJ3EnOiBkb0NsaWNrKGJ1dHRvbnMucXVvdGUpOyBicmVhaztcbiAgICAgIGNhc2UgJ2snOiBkb0NsaWNrKGJ1dHRvbnMuY29kZSk7IGJyZWFrO1xuICAgICAgY2FzZSAnZyc6IGRvQ2xpY2soYnV0dG9ucy5pbWFnZSk7IGJyZWFrO1xuICAgICAgY2FzZSAnbyc6IGRvQ2xpY2soYnV0dG9ucy5vbGlzdCk7IGJyZWFrO1xuICAgICAgY2FzZSAndSc6IGRvQ2xpY2soYnV0dG9ucy51bGlzdCk7IGJyZWFrO1xuICAgICAgY2FzZSAnaCc6IGRvQ2xpY2soYnV0dG9ucy5oZWFkaW5nKTsgYnJlYWs7XG4gICAgICBjYXNlICdyJzogZG9DbGljayhidXR0b25zLmhyKTsgYnJlYWs7XG4gICAgICBjYXNlICd5JzogZG9DbGljayhidXR0b25zLnJlZG8pOyBicmVhaztcbiAgICAgIGNhc2UgJ3onOlxuICAgICAgICBpZiAoa2V5LnNoaWZ0S2V5KSB7XG4gICAgICAgICAgZG9DbGljayhidXR0b25zLnJlZG8pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGRvQ2xpY2soYnV0dG9ucy51bmRvKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoa2V5LnByZXZlbnREZWZhdWx0KSB7XG4gICAgICBrZXkucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gICAgaWYgKHdpbmRvdy5ldmVudCkge1xuICAgICAgd2luZG93LmV2ZW50LnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgfVxuICB9KTtcblxuICB1dGlsLmFkZEV2ZW50KGlucHV0Qm94LCAna2V5dXAnLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKGtleS5zaGlmdEtleSAmJiAha2V5LmN0cmxLZXkgJiYgIWtleS5tZXRhS2V5KSB7XG4gICAgICB2YXIga2V5Q29kZSA9IGtleS5jaGFyQ29kZSB8fCBrZXkua2V5Q29kZTtcblxuICAgICAgaWYgKGtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgIHZhciBmYWtlQnV0dG9uID0ge307XG4gICAgICAgIGZha2VCdXR0b24udGV4dE9wID0gYmluZENvbW1hbmQoJ2RvQXV0b2luZGVudCcpO1xuICAgICAgICBkb0NsaWNrKGZha2VCdXR0b24pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgaWYgKHVhLmlzSUUpIHtcbiAgICB1dGlsLmFkZEV2ZW50KGlucHV0Qm94LCAna2V5ZG93bicsIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHZhciBjb2RlID0ga2V5LmtleUNvZGU7XG4gICAgICBpZiAoY29kZSA9PT0gMjcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cblxuICBmdW5jdGlvbiBkb0NsaWNrIChidXR0b24pIHtcbiAgICBpbnB1dEJveC5mb2N1cygpO1xuXG4gICAgaWYgKGJ1dHRvbi50ZXh0T3ApIHtcbiAgICAgIGlmICh1bmRvTWFuYWdlcikge1xuICAgICAgICB1bmRvTWFuYWdlci5zZXRDb21tYW5kTW9kZSgpO1xuICAgICAgfVxuXG4gICAgICB2YXIgc3RhdGUgPSBuZXcgVGV4dGFyZWFTdGF0ZShwYW5lbHMpO1xuXG4gICAgICBpZiAoIXN0YXRlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNodW5rcyA9IHN0YXRlLmdldENodW5rcygpO1xuICAgICAgdmFyIG5vQ2xlYW51cCA9IGJ1dHRvbi50ZXh0T3AoY2h1bmtzLCBmaXh1cElucHV0QXJlYSk7XG5cbiAgICAgIGlmICghbm9DbGVhbnVwKSB7XG4gICAgICAgIGZpeHVwSW5wdXRBcmVhKCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChidXR0b24uZXhlY3V0ZSkge1xuICAgICAgYnV0dG9uLmV4ZWN1dGUodW5kb01hbmFnZXIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpeHVwSW5wdXRBcmVhICgpIHtcbiAgICAgIGlucHV0Qm94LmZvY3VzKCk7XG5cbiAgICAgIGlmIChjaHVua3MpIHtcbiAgICAgICAgc3RhdGUuc2V0Q2h1bmtzKGNodW5rcyk7XG4gICAgICB9XG4gICAgICBzdGF0ZS5yZXN0b3JlKCk7XG4gICAgICBwcmV2aWV3TWFuYWdlci5yZWZyZXNoKCk7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIHNldHVwQnV0dG9uIChidXR0b24sIGlzRW5hYmxlZCkge1xuICAgIHZhciBub3JtYWxZU2hpZnQgPSAnMHB4JztcbiAgICB2YXIgZGlzYWJsZWRZU2hpZnQgPSAnLTIwcHgnO1xuICAgIHZhciBoaWdobGlnaHRZU2hpZnQgPSAnLTQwcHgnO1xuICAgIHZhciBpbWFnZSA9IGJ1dHRvbi5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc3BhbicpWzBdO1xuICAgIGlmIChpc0VuYWJsZWQpIHtcbiAgICAgIGJ1dHRvbi5vbm1vdXNlb3ZlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaW1hZ2Uuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gdGhpcy5YU2hpZnQgKyAnICcgKyBoaWdobGlnaHRZU2hpZnQ7XG4gICAgICB9O1xuICAgICAgYnV0dG9uLm9ubW91c2VvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGltYWdlLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9IHRoaXMuWFNoaWZ0ICsgJyAnICsgbm9ybWFsWVNoaWZ0O1xuICAgICAgfTtcbiAgICAgIGJ1dHRvbi5vbm1vdXNlb3V0KCk7XG5cbiAgICAgIGlmICh1YS5pc0lFKSB7XG4gICAgICAgIGJ1dHRvbi5vbm1vdXNlZG93biA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoZG9jLmFjdGl2ZUVsZW1lbnQgJiYgZG9jLmFjdGl2ZUVsZW1lbnQgIT09IHBhbmVscy5pbnB1dCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBwYW5lbHMuaWVDYWNoZWRSYW5nZSA9IGRvY3VtZW50LnNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpO1xuICAgICAgICAgIHBhbmVscy5pZUNhY2hlZFNjcm9sbFRvcCA9IHBhbmVscy5pbnB1dC5zY3JvbGxUb3A7XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmICghYnV0dG9uLmlzSGVscCkge1xuICAgICAgICBidXR0b24ub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAodGhpcy5vbm1vdXNlb3V0KSB7XG4gICAgICAgICAgICB0aGlzLm9ubW91c2VvdXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZG9DbGljayh0aGlzKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaW1hZ2Uuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gYnV0dG9uLlhTaGlmdCArICcgJyArIGRpc2FibGVkWVNoaWZ0O1xuICAgICAgYnV0dG9uLm9ubW91c2VvdmVyID0gYnV0dG9uLm9ubW91c2VvdXQgPSBidXR0b24ub25jbGljayA9IGZ1bmN0aW9uICgpIHsgfTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBiaW5kQ29tbWFuZCAobWV0aG9kKSB7XG4gICAgaWYgKHR5cGVvZiBtZXRob2QgPT09ICdzdHJpbmcnKSB7XG4gICAgICBtZXRob2QgPSBjb21tYW5kTWFuYWdlclttZXRob2RdO1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgbWV0aG9kLmFwcGx5KGNvbW1hbmRNYW5hZ2VyLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlU3ByaXRlZEJ1dHRvblJvdyAoKSB7XG4gICAgdmFyIGJ1dHRvbkJhciA9IHBhbmVscy5idXR0b25CYXI7XG4gICAgdmFyIG5vcm1hbFlTaGlmdCA9ICcwcHgnO1xuICAgIHZhciBkaXNhYmxlZFlTaGlmdCA9ICctMjBweCc7XG4gICAgdmFyIGhpZ2hsaWdodFlTaGlmdCA9ICctNDBweCc7XG5cbiAgICB2YXIgYnV0dG9uUm93ID0gYygndWwnKTtcbiAgICBidXR0b25Sb3cuaWQgPSAncG1rLWJ1dHRvbi1yb3ctJyArIHBvc3RmaXg7XG4gICAgYnV0dG9uUm93LmNsYXNzTmFtZSA9ICdwbWstYnV0dG9uLXJvdyc7XG4gICAgYnV0dG9uUm93ID0gYnV0dG9uQmFyLmFwcGVuZENoaWxkKGJ1dHRvblJvdyk7XG5cbiAgICBmdW5jdGlvbiBtYWtlQnV0dG9uIChpZCwgdGl0bGUsIFhTaGlmdCwgdGV4dE9wKSB7XG4gICAgICB2YXIgYnV0dG9uID0gYygnbGknKTtcbiAgICAgIGJ1dHRvbi5jbGFzc05hbWUgPSAncG1rLWJ1dHRvbiAnICsgaWQ7XG4gICAgICB2YXIgYnV0dG9uSW1hZ2UgPSBjKCdzcGFuJyk7XG4gICAgICBidXR0b24uaWQgPSBpZCArICctJyArIHBvc3RmaXg7XG4gICAgICBidXR0b24uYXBwZW5kQ2hpbGQoYnV0dG9uSW1hZ2UpO1xuICAgICAgYnV0dG9uLnRpdGxlID0gdGl0bGU7XG4gICAgICBidXR0b24uWFNoaWZ0ID0gWFNoaWZ0O1xuICAgICAgaWYgKHRleHRPcCkge1xuICAgICAgICBidXR0b24udGV4dE9wID0gdGV4dE9wO1xuICAgICAgfVxuICAgICAgc2V0dXBCdXR0b24oYnV0dG9uLCB0cnVlKTtcbiAgICAgIGJ1dHRvblJvdy5hcHBlbmRDaGlsZChidXR0b24pO1xuICAgICAgcmV0dXJuIGJ1dHRvbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlU3BhY2VyIChudW0pIHtcbiAgICAgIHZhciBzcGFjZXIgPSBjKCdsaScpO1xuICAgICAgc3BhY2VyLmNsYXNzTmFtZSA9ICdwbWstc3BhY2VyIHBtay1zcGFjZXItJyArIG51bTtcbiAgICAgIHNwYWNlci5pZCA9ICdwbWstc3BhY2VyLScgKyBwb3N0Zml4ICsgJy0nICsgbnVtO1xuICAgICAgYnV0dG9uUm93LmFwcGVuZENoaWxkKHNwYWNlcik7XG4gICAgfVxuXG4gICAgYnV0dG9ucy5ib2xkID0gbWFrZUJ1dHRvbigncG1rLWJvbGQtYnV0dG9uJywgZ2V0U3RyaW5nKCdib2xkJyksICcwcHgnLCBiaW5kQ29tbWFuZCgnZG9Cb2xkJykpO1xuICAgIGJ1dHRvbnMuaXRhbGljID0gbWFrZUJ1dHRvbigncG1rLWl0YWxpYy1idXR0b24nLCBnZXRTdHJpbmcoJ2l0YWxpYycpLCAnLTIwcHgnLCBiaW5kQ29tbWFuZCgnZG9JdGFsaWMnKSk7XG4gICAgbWFrZVNwYWNlcigxKTtcbiAgICBidXR0b25zLmxpbmsgPSBtYWtlQnV0dG9uKCdwbWstbGluay1idXR0b24nLCBnZXRTdHJpbmcoJ2xpbmsnKSwgJy00MHB4JywgYmluZENvbW1hbmQoZnVuY3Rpb24gKGNodW5rLCBwb3N0UHJvY2Vzc2luZykge1xuICAgICAgcmV0dXJuIHRoaXMuZG9MaW5rT3JJbWFnZShjaHVuaywgcG9zdFByb2Nlc3NpbmcsIGZhbHNlKTtcbiAgICB9KSk7XG4gICAgYnV0dG9ucy5xdW90ZSA9IG1ha2VCdXR0b24oJ3Btay1xdW90ZS1idXR0b24nLCBnZXRTdHJpbmcoJ3F1b3RlJyksICctNjBweCcsIGJpbmRDb21tYW5kKCdkb0Jsb2NrcXVvdGUnKSk7XG4gICAgYnV0dG9ucy5jb2RlID0gbWFrZUJ1dHRvbigncG1rLWNvZGUtYnV0dG9uJywgZ2V0U3RyaW5nKCdjb2RlJyksICctODBweCcsIGJpbmRDb21tYW5kKCdkb0NvZGUnKSk7XG4gICAgYnV0dG9ucy5pbWFnZSA9IG1ha2VCdXR0b24oJ3Btay1pbWFnZS1idXR0b24nLCBnZXRTdHJpbmcoJ2ltYWdlJyksICctMTAwcHgnLCBiaW5kQ29tbWFuZChmdW5jdGlvbiAoY2h1bmssIHBvc3RQcm9jZXNzaW5nKSB7XG4gICAgICByZXR1cm4gdGhpcy5kb0xpbmtPckltYWdlKGNodW5rLCBwb3N0UHJvY2Vzc2luZywgdHJ1ZSk7XG4gICAgfSkpO1xuICAgIG1ha2VTcGFjZXIoMik7XG4gICAgYnV0dG9ucy5vbGlzdCA9IG1ha2VCdXR0b24oJ3Btay1vbGlzdC1idXR0b24nLCBnZXRTdHJpbmcoJ29saXN0JyksICctMTIwcHgnLCBiaW5kQ29tbWFuZChmdW5jdGlvbiAoY2h1bmssIHBvc3RQcm9jZXNzaW5nKSB7XG4gICAgICB0aGlzLmRvTGlzdChjaHVuaywgcG9zdFByb2Nlc3NpbmcsIHRydWUpO1xuICAgIH0pKTtcbiAgICBidXR0b25zLnVsaXN0ID0gbWFrZUJ1dHRvbigncG1rLXVsaXN0LWJ1dHRvbicsIGdldFN0cmluZygndWxpc3QnKSwgJy0xNDBweCcsIGJpbmRDb21tYW5kKGZ1bmN0aW9uIChjaHVuaywgcG9zdFByb2Nlc3NpbmcpIHtcbiAgICAgIHRoaXMuZG9MaXN0KGNodW5rLCBwb3N0UHJvY2Vzc2luZywgZmFsc2UpO1xuICAgIH0pKTtcbiAgICBidXR0b25zLmhlYWRpbmcgPSBtYWtlQnV0dG9uKCdwbWstaGVhZGluZy1idXR0b24nLCBnZXRTdHJpbmcoJ2hlYWRpbmcnKSwgJy0xNjBweCcsIGJpbmRDb21tYW5kKCdkb0hlYWRpbmcnKSk7XG4gICAgYnV0dG9ucy5ociA9IG1ha2VCdXR0b24oJ3Btay1oci1idXR0b24nLCBnZXRTdHJpbmcoJ2hyJyksICctMTgwcHgnLCBiaW5kQ29tbWFuZCgnZG9Ib3Jpem9udGFsUnVsZScpKTtcbiAgICBtYWtlU3BhY2VyKDMpO1xuICAgIGJ1dHRvbnMudW5kbyA9IG1ha2VCdXR0b24oJ3Btay11bmRvLWJ1dHRvbicsIGdldFN0cmluZygndW5kbycpLCAnLTIwMHB4JywgbnVsbCk7XG4gICAgYnV0dG9ucy51bmRvLmV4ZWN1dGUgPSBmdW5jdGlvbiAobWFuYWdlcikge1xuICAgICAgaWYgKG1hbmFnZXIpIHtcbiAgICAgICAgbWFuYWdlci51bmRvKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciByZWRvVGl0bGUgPSBnZXRTdHJpbmcodWEuaXNXaWRub3dzID8gJ3JlZG8nIDogJ3JlZG9tYWMnKTtcblxuICAgIGJ1dHRvbnMucmVkbyA9IG1ha2VCdXR0b24oJ3Btay1yZWRvLWJ1dHRvbicsIHJlZG9UaXRsZSwgJy0yMjBweCcsIG51bGwpO1xuICAgIGJ1dHRvbnMucmVkby5leGVjdXRlID0gZnVuY3Rpb24gKG1hbmFnZXIpIHtcbiAgICAgIGlmIChtYW5hZ2VyKSB7XG4gICAgICAgIG1hbmFnZXIucmVkbygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoaGVscE9wdGlvbnMpIHtcbiAgICAgIHZhciBoZWxwQnV0dG9uID0gYygnbGknKTtcbiAgICAgIHZhciBoZWxwQnV0dG9uSW1hZ2UgPSBjKCdzcGFuJyk7XG4gICAgICBoZWxwQnV0dG9uLmFwcGVuZENoaWxkKGhlbHBCdXR0b25JbWFnZSk7XG4gICAgICBoZWxwQnV0dG9uLmNsYXNzTmFtZSA9ICdwbWstYnV0dG9uIHBtay1oZWxwLWJ1dHRvbic7XG4gICAgICBoZWxwQnV0dG9uLmlkID0gJ3Btay1oZWxwLWJ1dHRvbi0nICsgcG9zdGZpeDtcbiAgICAgIGhlbHBCdXR0b24uWFNoaWZ0ID0gJy0yNDBweCc7XG4gICAgICBoZWxwQnV0dG9uLmlzSGVscCA9IHRydWU7XG4gICAgICBoZWxwQnV0dG9uLnN0eWxlLnJpZ2h0ID0gJzBweCc7XG4gICAgICBoZWxwQnV0dG9uLnRpdGxlID0gZ2V0U3RyaW5nKCdoZWxwJyk7XG4gICAgICBoZWxwQnV0dG9uLm9uY2xpY2sgPSBoZWxwT3B0aW9ucy5oYW5kbGVyO1xuXG4gICAgICBzZXR1cEJ1dHRvbihoZWxwQnV0dG9uLCB0cnVlKTtcbiAgICAgIGJ1dHRvblJvdy5hcHBlbmRDaGlsZChoZWxwQnV0dG9uKTtcbiAgICAgIGJ1dHRvbnMuaGVscCA9IGhlbHBCdXR0b247XG4gICAgfVxuXG4gICAgc2V0VW5kb1JlZG9CdXR0b25TdGF0ZXMoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFVuZG9SZWRvQnV0dG9uU3RhdGVzICgpIHtcbiAgICBpZiAodW5kb01hbmFnZXIpIHtcbiAgICAgIHNldHVwQnV0dG9uKGJ1dHRvbnMudW5kbywgdW5kb01hbmFnZXIuY2FuVW5kbygpKTtcbiAgICAgIHNldHVwQnV0dG9uKGJ1dHRvbnMucmVkbywgdW5kb01hbmFnZXIuY2FuUmVkbygpKTtcbiAgICB9XG4gIH07XG5cbiAgdGhpcy5zZXRVbmRvUmVkb0J1dHRvblN0YXRlcyA9IHNldFVuZG9SZWRvQnV0dG9uU3RhdGVzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVJTWFuYWdlcjtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1YSA9IHJlcXVpcmUoJy4vdWEnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgVGV4dGFyZWFTdGF0ZSA9IHJlcXVpcmUoJy4vVGV4dGFyZWFTdGF0ZScpO1xuXG5mdW5jdGlvbiBVbmRvTWFuYWdlciAoY2FsbGJhY2ssIHBhbmVscykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciB1bmRvU3RhY2sgPSBbXTtcbiAgdmFyIHN0YWNrUHRyID0gMDtcbiAgdmFyIG1vZGUgPSAnbm9uZSc7XG4gIHZhciBsYXN0U3RhdGU7XG4gIHZhciB0aW1lcjtcbiAgdmFyIGlucHV0U3RhdGU7XG5cbiAgZnVuY3Rpb24gc2V0TW9kZSAobmV3TW9kZSwgbm9TYXZlKSB7XG4gICAgaWYgKG1vZGUgIT0gbmV3TW9kZSkge1xuICAgICAgbW9kZSA9IG5ld01vZGU7XG4gICAgICBpZiAoIW5vU2F2ZSkge1xuICAgICAgICBzYXZlU3RhdGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXVhLmlzSUUgfHwgbW9kZSAhPSAnbW92aW5nJykge1xuICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KHJlZnJlc2hTdGF0ZSwgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlucHV0U3RhdGUgPSBudWxsO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiByZWZyZXNoU3RhdGUgKGlzSW5pdGlhbFN0YXRlKSB7XG4gICAgaW5wdXRTdGF0ZSA9IG5ldyBUZXh0YXJlYVN0YXRlKHBhbmVscywgaXNJbml0aWFsU3RhdGUpO1xuICAgIHRpbWVyID0gdm9pZCAwO1xuICB9XG5cbiAgc2VsZi5zZXRDb21tYW5kTW9kZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBtb2RlID0gJ2NvbW1hbmQnO1xuICAgIHNhdmVTdGF0ZSgpO1xuICAgIHRpbWVyID0gc2V0VGltZW91dChyZWZyZXNoU3RhdGUsIDApO1xuICB9O1xuXG4gIHNlbGYuY2FuVW5kbyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gc3RhY2tQdHIgPiAxO1xuICB9O1xuXG4gIHNlbGYuY2FuUmVkbyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdW5kb1N0YWNrW3N0YWNrUHRyICsgMV07XG4gIH07XG5cbiAgc2VsZi51bmRvID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChzZWxmLmNhblVuZG8oKSkge1xuICAgICAgaWYgKGxhc3RTdGF0ZSkge1xuICAgICAgICBsYXN0U3RhdGUucmVzdG9yZSgpO1xuICAgICAgICBsYXN0U3RhdGUgPSBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdW5kb1N0YWNrW3N0YWNrUHRyXSA9IG5ldyBUZXh0YXJlYVN0YXRlKHBhbmVscyk7XG4gICAgICAgIHVuZG9TdGFja1stLXN0YWNrUHRyXS5yZXN0b3JlKCk7XG5cbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBtb2RlID0gJ25vbmUnO1xuICAgIHBhbmVscy5pbnB1dC5mb2N1cygpO1xuICAgIHJlZnJlc2hTdGF0ZSgpO1xuICB9O1xuXG4gIHNlbGYucmVkbyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoc2VsZi5jYW5SZWRvKCkpIHtcbiAgICAgIHVuZG9TdGFja1srK3N0YWNrUHRyXS5yZXN0b3JlKCk7XG5cbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIG1vZGUgPSAnbm9uZSc7XG4gICAgcGFuZWxzLmlucHV0LmZvY3VzKCk7XG4gICAgcmVmcmVzaFN0YXRlKCk7XG4gIH07XG5cbiAgZnVuY3Rpb24gc2F2ZVN0YXRlICgpIHtcbiAgICB2YXIgY3VyclN0YXRlID0gaW5wdXRTdGF0ZSB8fCBuZXcgVGV4dGFyZWFTdGF0ZShwYW5lbHMpO1xuXG4gICAgaWYgKCFjdXJyU3RhdGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKG1vZGUgPT0gJ21vdmluZycpIHtcbiAgICAgIGlmICghbGFzdFN0YXRlKSB7XG4gICAgICAgIGxhc3RTdGF0ZSA9IGN1cnJTdGF0ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGxhc3RTdGF0ZSkge1xuICAgICAgaWYgKHVuZG9TdGFja1tzdGFja1B0ciAtIDFdLnRleHQgIT0gbGFzdFN0YXRlLnRleHQpIHtcbiAgICAgICAgdW5kb1N0YWNrW3N0YWNrUHRyKytdID0gbGFzdFN0YXRlO1xuICAgICAgfVxuICAgICAgbGFzdFN0YXRlID0gbnVsbDtcbiAgICB9XG4gICAgdW5kb1N0YWNrW3N0YWNrUHRyKytdID0gY3VyclN0YXRlO1xuICAgIHVuZG9TdGFja1tzdGFja1B0ciArIDFdID0gbnVsbDtcbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcHJldmVudEN0cmxZWiAoZXZlbnQpIHtcbiAgICB2YXIga2V5Q29kZSA9IGV2ZW50LmNoYXJDb2RlIHx8IGV2ZW50LmtleUNvZGU7XG4gICAgdmFyIHl6ID0ga2V5Q29kZSA9PSA4OSB8fCBrZXlDb2RlID09IDkwO1xuICAgIHZhciBjdHJsID0gZXZlbnQuY3RybEtleSB8fCBldmVudC5tZXRhS2V5O1xuICAgIGlmIChjdHJsICYmIHl6KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBoYW5kbGVDdHJsWVogKGV2ZW50KSB7XG4gICAgdmFyIGhhbmRsZWQgPSBmYWxzZTtcbiAgICB2YXIga2V5Q29kZSA9IGV2ZW50LmNoYXJDb2RlIHx8IGV2ZW50LmtleUNvZGU7XG4gICAgdmFyIGtleUNvZGVDaGFyID0gU3RyaW5nLmZyb21DaGFyQ29kZShrZXlDb2RlKTtcblxuICAgIGlmIChldmVudC5jdHJsS2V5IHx8IGV2ZW50Lm1ldGFLZXkpIHtcbiAgICAgIHN3aXRjaCAoa2V5Q29kZUNoYXIudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICBjYXNlICd5JzpcbiAgICAgICAgICBzZWxmLnJlZG8oKTtcbiAgICAgICAgICBoYW5kbGVkID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICd6JzpcbiAgICAgICAgICBpZiAoIWV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICBzZWxmLnVuZG8oKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzZWxmLnJlZG8oKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaGFuZGxlZCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGhhbmRsZWQpIHtcbiAgICAgIGlmIChldmVudC5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgICAgaWYgKHdpbmRvdy5ldmVudCkge1xuICAgICAgICB3aW5kb3cuZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVNb2RlQ2hhbmdlIChldmVudCkge1xuICAgIGlmIChldmVudC5jdHJsS2V5IHx8IGV2ZW50Lm1ldGFLZXkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIga2V5Q29kZSA9IGV2ZW50LmtleUNvZGU7XG5cbiAgICBpZiAoKGtleUNvZGUgPj0gMzMgJiYga2V5Q29kZSA8PSA0MCkgfHwgKGtleUNvZGUgPj0gNjMyMzIgJiYga2V5Q29kZSA8PSA2MzIzNSkpIHtcbiAgICAgIHNldE1vZGUoJ21vdmluZycpO1xuICAgIH0gZWxzZSBpZiAoa2V5Q29kZSA9PSA4IHx8IGtleUNvZGUgPT0gNDYgfHwga2V5Q29kZSA9PSAxMjcpIHtcbiAgICAgIHNldE1vZGUoJ2RlbGV0aW5nJyk7XG4gICAgfSBlbHNlIGlmIChrZXlDb2RlID09IDEzKSB7XG4gICAgICBzZXRNb2RlKCduZXdsaW5lcycpO1xuICAgIH0gZWxzZSBpZiAoa2V5Q29kZSA9PSAyNykge1xuICAgICAgc2V0TW9kZSgnZXNjYXBlJyk7XG4gICAgfSBlbHNlIGlmICgoa2V5Q29kZSA8IDE2IHx8IGtleUNvZGUgPiAyMCkgJiYga2V5Q29kZSAhPSA5MSkge1xuICAgICAgc2V0TW9kZSgndHlwaW5nJyk7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIHNldEV2ZW50SGFuZGxlcnMgKCkge1xuICAgIHV0aWwuYWRkRXZlbnQocGFuZWxzLmlucHV0LCAna2V5cHJlc3MnLCBwcmV2ZW50Q3RybFlaKTtcbiAgICB1dGlsLmFkZEV2ZW50KHBhbmVscy5pbnB1dCwgJ2tleWRvd24nLCBoYW5kbGVDdHJsWVopO1xuICAgIHV0aWwuYWRkRXZlbnQocGFuZWxzLmlucHV0LCAna2V5ZG93bicsIGhhbmRsZU1vZGVDaGFuZ2UpO1xuICAgIHV0aWwuYWRkRXZlbnQocGFuZWxzLmlucHV0LCAnbW91c2Vkb3duJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2V0TW9kZSgnbW92aW5nJyk7XG4gICAgfSk7XG5cbiAgICBwYW5lbHMuaW5wdXQub25wYXN0ZSA9IGhhbmRsZVBhc3RlO1xuICAgIHBhbmVscy5pbnB1dC5vbmRyb3AgPSBoYW5kbGVQYXN0ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZVBhc3RlICgpIHtcbiAgICBpZiAodWEuaXNJRSB8fCAoaW5wdXRTdGF0ZSAmJiBpbnB1dFN0YXRlLnRleHQgIT0gcGFuZWxzLmlucHV0LnZhbHVlKSkge1xuICAgICAgaWYgKHRpbWVyID09IHZvaWQgMCkge1xuICAgICAgICBtb2RlID0gJ3Bhc3RlJztcbiAgICAgICAgc2F2ZVN0YXRlKCk7XG4gICAgICAgIHJlZnJlc2hTdGF0ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXQgKCkge1xuICAgIHNldEV2ZW50SGFuZGxlcnMoKTtcbiAgICByZWZyZXNoU3RhdGUodHJ1ZSk7XG4gICAgc2F2ZVN0YXRlKCk7XG4gIH07XG5cbiAgaW5pdCgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVuZG9NYW5hZ2VyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdHJpbSA9IC9eXFxzK3xcXHMrJC9nO1xudmFyIHdoaXRlc3BhY2UgPSAvXFxzKy9nO1xuXG5mdW5jdGlvbiBpbnRlcnByZXQgKGlucHV0KSB7XG4gIHJldHVybiB0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnID8gaW5wdXQucmVwbGFjZSh0cmltLCAnJykuc3BsaXQod2hpdGVzcGFjZSkgOiBpbnB1dDtcbn1cblxuZnVuY3Rpb24gY2xhc3NlcyAobm9kZSkge1xuICByZXR1cm4gbm9kZS5jbGFzc05hbWUucmVwbGFjZSh0cmltLCAnJykuc3BsaXQod2hpdGVzcGFjZSk7XG59XG5cbmZ1bmN0aW9uIHNldCAobm9kZSwgaW5wdXQpIHtcbiAgbm9kZS5jbGFzc05hbWUgPSBpbnB1dC5qb2luKCcgJyk7XG59XG5cbmZ1bmN0aW9uIGFkZCAobm9kZSwgaW5wdXQpIHtcbiAgdmFyIGN1cnJlbnQgPSByZW1vdmUobm9kZSwgaW5wdXQpO1xuICB2YXIgdmFsdWVzID0gaW50ZXJwcmV0KGlucHV0KTtcbiAgY3VycmVudC5wdXNoLmFwcGx5KGN1cnJlbnQsIHZhbHVlcyk7XG4gIHNldChub2RlLCBjdXJyZW50KTtcbiAgcmV0dXJuIGN1cnJlbnQ7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZSAobm9kZSwgaW5wdXQpIHtcbiAgdmFyIGN1cnJlbnQgPSBjbGFzc2VzKG5vZGUpO1xuICB2YXIgdmFsdWVzID0gaW50ZXJwcmV0KGlucHV0KTtcbiAgdmFsdWVzLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdmFyIGkgPSBjdXJyZW50LmluZGV4T2YodmFsdWUpO1xuICAgIGlmIChpICE9PSAtMSkge1xuICAgICAgY3VycmVudC5zcGxpY2UoaSwgMSk7XG4gICAgfVxuICB9KTtcbiAgc2V0KG5vZGUsIGN1cnJlbnQpO1xuICByZXR1cm4gY3VycmVudDtcbn1cblxuZnVuY3Rpb24gY29udGFpbnMgKG5vZGUsIGlucHV0KSB7XG4gIHZhciBjdXJyZW50ID0gY2xhc3Nlcyhub2RlKTtcbiAgdmFyIHZhbHVlcyA9IGludGVycHJldChpbnB1dCk7XG5cbiAgcmV0dXJuIHZhbHVlcy5ldmVyeShmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gY3VycmVudC5pbmRleE9mKHZhbHVlKSAhPT0gLTE7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWRkOiBhZGQsXG4gIHJlbW92ZTogcmVtb3ZlLFxuICBjb250YWluczogY29udGFpbnMsXG4gIHNldDogc2V0LFxuICBnZXQ6IGNsYXNzZXNcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGNvbmZpZ3VyZSAob3B0cykge1xuICB2YXIgdXBsb2FkcztcbiAgdmFyIG8gPSBvcHRzIHx8IHt9O1xuICBpZiAoby5pbWFnZVVwbG9hZHMpIHtcbiAgICBpZiAodHlwZW9mIG8uaW1hZ2VVcGxvYWRzID09PSAnc3RyaW5nJykge1xuICAgICAgdXBsb2FkcyA9IHsgdXJsOiBvLmltYWdlVXBsb2FkcyB9O1xuICAgIH0gZWxzZSB7XG4gICAgICB1cGxvYWRzID0gby5pbWFnZVVwbG9hZHM7XG4gICAgfVxuICAgIGlmICghdXBsb2Fkcy51cmwpIHsgdGhyb3cgbmV3IEVycm9yKCdSZXF1aXJlZCBpbWFnZVVwbG9hZHMudXJsIHByb3BlcnR5IG1pc3NpbmcnKTsgfVxuICAgIGlmICghdXBsb2Fkcy5tZXRob2QpIHsgdXBsb2Fkcy5tZXRob2QgPSAnUFVUJzsgfVxuICAgIGlmICghdXBsb2Fkcy5rZXkpIHsgdXBsb2Fkcy5rZXkgPSAnaW1hZ2UnOyB9XG4gICAgaWYgKCF1cGxvYWRzLnRpbWVvdXQpIHsgdXBsb2Fkcy50aW1lb3V0ID0gMTUwMDA7IH1cbiAgICBjb25maWd1cmUuaW1hZ2VVcGxvYWRzID0gdXBsb2FkcztcbiAgfVxuICBpZiAoby5tYXJrZG93bikge1xuICAgIGNvbmZpZ3VyZS5tYXJrZG93biA9IG8ubWFya2Rvd247XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb25maWd1cmU7XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQ7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGVsZW0sIHR5cGUpIHtcbiAgdmFyIGU7XG5cbiAgaWYgKGRvYy5jcmVhdGVFdmVudCkge1xuICAgIGUgPSBkb2MuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKTtcbiAgICBlLmluaXRFdmVudCh0eXBlLCB0cnVlLCB0cnVlKTtcbiAgfSBlbHNlIHtcbiAgICBlID0gZG9jLmNyZWF0ZUV2ZW50T2JqZWN0KCk7XG4gICAgZS5ldmVudFR5cGUgPSB0eXBlO1xuICB9XG4gIGUuZXZlbnROYW1lID0gdHlwZTtcblxuICBpZiAoZG9jLmNyZWF0ZUV2ZW50KSB7XG4gICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGUpO1xuICB9IGVsc2Uge1xuICAgIGVsZW1lbnQuZmlyZUV2ZW50KCdvbicgKyBlLmV2ZW50VHlwZSwgZSk7XG4gIH1cbn07XG5cbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY29uZmlndXJlID0gcmVxdWlyZSgnLi9jb25maWd1cmUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGV4dCkge1xuICByZXR1cm4gY29uZmlndXJlLm1hcmtkb3duKHRleHQpO1xufTtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIGRvYyA9IGdsb2JhbC5kb2N1bWVudDtcbnZhciB1aSA9IHJlcXVpcmUoJy4vdWknKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgY29uZmlndXJlID0gcmVxdWlyZSgnLi9jb25maWd1cmUnKTtcbnZhciBjbGFzc2VzID0gcmVxdWlyZSgnLi9jbGFzc2VzJyk7XG52YXIgRWRpdG9yID0gcmVxdWlyZSgnLi9FZGl0b3InKTtcbnZhciBuZXh0SWQgPSAwO1xuXG5mdW5jdGlvbiBwb255bWFyayAobykge1xuICB2YXIgcG9zdGZpeCA9IG5leHRJZCsrO1xuICB2YXIgZWRpdG9yO1xuXG4gIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgbyA9IHsgdGV4dGFyZWE6IG8sIHByZXZpZXc6IG8gfTtcbiAgfVxuXG4gIG1hcmt1cChvLCBwb3N0Zml4KTtcblxuICBlZGl0b3IgPSBuZXcgRWRpdG9yKHBvc3RmaXgpO1xuICBlZGl0b3IucnVuKCk7XG5cbiAgcmV0dXJuIGVkaXRvci5hcGk7XG59XG5cbmZ1bmN0aW9uIG1hcmt1cCAobywgcG9zdGZpeCkge1xuICB2YXIgYnV0dG9uQmFyID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB2YXIgcHJldmlldyA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdmFyIGlucHV0O1xuXG4gIGlmIChjbGFzc2VzLmNvbnRhaW5zKG8udGV4dGFyZWEsICdwbWstaW5wdXQnKSkge1xuICAgIGNsYXNzZXMuYWRkKG8udGV4dGFyZWEsICdwbWstaW5wdXQnKTtcbiAgfVxuXG4gIGJ1dHRvbkJhci5pZCA9ICdwbWstYnV0dG9ucy0nICsgcG9zdGZpeDtcbiAgYnV0dG9uQmFyLmNsYXNzTmFtZSA9ICdwbWstYnV0dG9ucyc7XG4gIHByZXZpZXcuaWQgPSAncG1rLXByZXZpZXctJyArIHBvc3RmaXg7XG4gIHByZXZpZXcuY2xhc3NOYW1lID0gJ3Btay1wcmV2aWV3JztcblxuICBvLnRleHRhcmVhLmlkID0gJ3Btay1pbnB1dC0nICsgcG9zdGZpeDtcbiAgby50ZXh0YXJlYS5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShidXR0b25CYXIsIG8udGV4dGFyZWEpO1xuICBvLnByZXZpZXcuYXBwZW5kQ2hpbGQocHJldmlldyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcG9ueW1hcms7XG5cbnBvbnltYXJrLkVkaXRvciA9IEVkaXRvcjtcbnBvbnltYXJrLmNvbmZpZ3VyZSA9IGNvbmZpZ3VyZTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQ7XG5cbmZ1bmN0aW9uIGdldFRvcCAoZWxlbSwgaXNJbm5lcikge1xuICB2YXIgcmVzdWx0ID0gZWxlbS5vZmZzZXRUb3A7XG4gIGlmICghaXNJbm5lcikge1xuICAgIHdoaWxlIChlbGVtID0gZWxlbS5vZmZzZXRQYXJlbnQpIHtcbiAgICAgIHJlc3VsdCArPSBlbGVtLm9mZnNldFRvcDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmZ1bmN0aW9uIGdldEhlaWdodCAoZWxlbSkge1xuICByZXR1cm4gZWxlbS5vZmZzZXRIZWlnaHQgfHwgZWxlbS5zY3JvbGxIZWlnaHQ7XG59O1xuXG5mdW5jdGlvbiBnZXRXaWR0aCAoZWxlbSkge1xuICByZXR1cm4gZWxlbS5vZmZzZXRXaWR0aCB8fCBlbGVtLnNjcm9sbFdpZHRoO1xufTtcblxuZnVuY3Rpb24gZ2V0UGFnZVNpemUgKCkge1xuICB2YXIgc2Nyb2xsV2lkdGgsIHNjcm9sbEhlaWdodDtcbiAgdmFyIGlubmVyV2lkdGgsIGlubmVySGVpZ2h0O1xuXG4gIGlmIChzZWxmLmlubmVySGVpZ2h0ICYmIHNlbGYuc2Nyb2xsTWF4WSkge1xuICAgIHNjcm9sbFdpZHRoID0gZG9jLmJvZHkuc2Nyb2xsV2lkdGg7XG4gICAgc2Nyb2xsSGVpZ2h0ID0gc2VsZi5pbm5lckhlaWdodCArIHNlbGYuc2Nyb2xsTWF4WTtcbiAgfSBlbHNlIGlmIChkb2MuYm9keS5zY3JvbGxIZWlnaHQgPiBkb2MuYm9keS5vZmZzZXRIZWlnaHQpIHtcbiAgICBzY3JvbGxXaWR0aCA9IGRvYy5ib2R5LnNjcm9sbFdpZHRoO1xuICAgIHNjcm9sbEhlaWdodCA9IGRvYy5ib2R5LnNjcm9sbEhlaWdodDtcbiAgfSBlbHNlIHtcbiAgICBzY3JvbGxXaWR0aCA9IGRvYy5ib2R5Lm9mZnNldFdpZHRoO1xuICAgIHNjcm9sbEhlaWdodCA9IGRvYy5ib2R5Lm9mZnNldEhlaWdodDtcbiAgfVxuXG4gIGlmIChzZWxmLmlubmVySGVpZ2h0KSB7XG4gICAgaW5uZXJXaWR0aCA9IHNlbGYuaW5uZXJXaWR0aDtcbiAgICBpbm5lckhlaWdodCA9IHNlbGYuaW5uZXJIZWlnaHQ7XG4gIH0gZWxzZSBpZiAoZG9jLmRvY3VtZW50RWxlbWVudCAmJiBkb2MuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCkge1xuICAgIGlubmVyV2lkdGggPSBkb2MuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoO1xuICAgIGlubmVySGVpZ2h0ID0gZG9jLmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gIH0gZWxzZSBpZiAoZG9jLmJvZHkpIHtcbiAgICBpbm5lcldpZHRoID0gZG9jLmJvZHkuY2xpZW50V2lkdGg7XG4gICAgaW5uZXJIZWlnaHQgPSBkb2MuYm9keS5jbGllbnRIZWlnaHQ7XG4gIH1cblxuICB2YXIgbWF4V2lkdGggPSBNYXRoLm1heChzY3JvbGxXaWR0aCwgaW5uZXJXaWR0aCk7XG4gIHZhciBtYXhIZWlnaHQgPSBNYXRoLm1heChzY3JvbGxIZWlnaHQsIGlubmVySGVpZ2h0KTtcbiAgcmV0dXJuIFttYXhXaWR0aCwgbWF4SGVpZ2h0LCBpbm5lcldpZHRoLCBpbm5lckhlaWdodF07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0VG9wOiBnZXRUb3AsXG4gIGdldEhlaWdodDogZ2V0SGVpZ2h0LFxuICBnZXRXaWR0aDogZ2V0V2lkdGgsXG4gIGdldFBhZ2VTaXplOiBnZXRQYWdlU2l6ZVxufTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciB4aHIgPSByZXF1aXJlKCd4aHInKTtcbnZhciByYWYgPSByZXF1aXJlKCdyYWYnKTtcbnZhciBjb25maWd1cmUgPSByZXF1aXJlKCcuL2NvbmZpZ3VyZScpO1xudmFyIHByb21wdExpbmsgPSByZXF1aXJlKCcuL3Byb21wdExpbmsnKTtcbnZhciBwcm9tcHRSZW5kZXIgPSByZXF1aXJlKCcuL3Byb21wdFJlbmRlcicpO1xudmFyIGZpcmVFdmVudCA9IHJlcXVpcmUoJy4vZmlyZUV2ZW50Jyk7XG52YXIgY2FjaGU7XG5cbmZ1bmN0aW9uIGRyYXcgKGNiKSB7XG4gIGlmIChjYWNoZSkge1xuICAgIGNhY2hlLmRpYWxvZy5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGNhY2hlLmRpYWxvZyk7XG4gIH1cbiAgY2FjaGUgPSBwcm9tcHRSZW5kZXIoe1xuICAgIGlkOiAncG1rLWltYWdlLXByb21wdCcsXG4gICAgdGl0bGU6ICdJbnNlcnQgSW1hZ2UnLFxuICAgIGRlc2NyaXB0aW9uOiAnVHlwZSBvciBwYXN0ZSB0aGUgdXJsIHRvIHlvdXIgaW1hZ2UnLFxuICAgIHBsYWNlaG9sZGVyOiAnaHR0cDovL2V4YW1wbGUuY29tL3B1YmxpYy9kb2dlLnBuZyBcIm9wdGlvbmFsIHRpdGxlXCInXG4gIH0pO1xuICBpbml0KGNhY2hlLCBjYik7XG4gIGNhY2hlLmRpYWxvZy5jbGFzc0xpc3QuYWRkKCdwbWstcHJvbXB0LW9wZW4nKTtcbiAgcmFmKGZvY3VzKTtcbiAgcmV0dXJuIGNhY2hlLmRpYWxvZztcbn1cblxuZnVuY3Rpb24gZm9jdXMgKCkge1xuICBjYWNoZS5pbnB1dC5mb2N1cygpO1xufVxuXG5mdW5jdGlvbiBpbml0IChkb20sIGNiKSB7XG4gIHByb21wdExpbmsuaW5pdChkb20sIGNiKTtcblxuICBpZiAoY29uZmlndXJlLmltYWdlVXBsb2Fkcykge1xuICAgIGFycmFuZ2VJbWFnZVVwbG9hZChkb20sIGNiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhcnJhbmdlSW1hZ2VVcGxvYWQgKGRvbSwgY2IpIHtcbiAgdmFyIHVwID0gcHJvbXB0UmVuZGVyLnVwbG9hZHMoZG9tKTtcbiAgdmFyIGRyYWdDbGFzcyA9ICdwbWstcHJvbXB0LXVwbG9hZC1kcmFnZ2luZyc7XG5cbiAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW50ZXInLCBkcmFnZ2luZyk7XG4gIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VuZCcsIGRyYWdzdG9wKTtcblxuICB1cC5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBoYW5kbGVDaGFuZ2UsIGZhbHNlKTtcbiAgdXAudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgaGFuZGxlRHJhZ092ZXIsIGZhbHNlKTtcbiAgdXAudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBoYW5kbGVGaWxlU2VsZWN0LCBmYWxzZSk7XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2hhbmdlIChlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZ28oZS50YXJnZXQuZmlsZXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlRHJhZ092ZXIgKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gJ2NvcHknO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlRmlsZVNlbGVjdCAoZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGdvKGUuZGF0YVRyYW5zZmVyLmZpbGVzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHZhbGlkIChmaWxlcykge1xuICAgIHZhciBtaW1lID0gL15pbWFnZVxcLy9pLCBpLCBmaWxlO1xuXG4gICAgdXAud2FybmluZy5jbGFzc0xpc3QucmVtb3ZlKCdwbWstcHJvbXB0LWVycm9yLXNob3cnKTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgZmlsZSA9IGZpbGVzW2ldO1xuXG4gICAgICBpZiAobWltZS50ZXN0KGZpbGUudHlwZSkpIHtcbiAgICAgICAgcmV0dXJuIGZpbGU7XG4gICAgICB9XG4gICAgfVxuICAgIHdhcm4oKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHdhcm4gKG1lc3NhZ2UpIHtcbiAgICB1cC53YXJuaW5nLmNsYXNzTGlzdC5hZGQoJ3Btay1wcm9tcHQtZXJyb3Itc2hvdycpO1xuICB9XG5cbiAgZnVuY3Rpb24gZHJhZ2dpbmcgKCkge1xuICAgIHVwLnVwbG9hZC5jbGFzc0xpc3QuYWRkKGRyYWdDbGFzcyk7XG4gIH1cblxuICBmdW5jdGlvbiBkcmFnc3RvcCAoKSB7XG4gICAgdXAudXBsb2FkLmNsYXNzTGlzdC5yZW1vdmUoZHJhZ0NsYXNzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb3NlICgpIHtcbiAgICBjYWNoZS5kaWFsb2cuY2xhc3NMaXN0LnJlbW92ZSgncG1rLXByb21wdC1vcGVuJyk7XG4gIH1cblxuICBmdW5jdGlvbiBnbyAoZmlsZXMpIHtcbiAgICB2YXIgZmlsZSA9IHZhbGlkKGZpbGVzKTtcbiAgICBpZiAoIWZpbGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGZvcm0gPSBuZXcgRm9ybURhdGEoKTtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICdDb250ZW50LVR5cGUnOiAnbXVsdGlwYXJ0L2Zvcm0tZGF0YScsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIEFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICB9LFxuICAgICAgbWV0aG9kOiBjb25maWd1cmUuaW1hZ2VVcGxvYWRzLm1ldGhvZCxcbiAgICAgIHVybDogY29uZmlndXJlLmltYWdlVXBsb2Fkcy51cmwsXG4gICAgICB0aW1lb3V0OiBjb25maWd1cmUuaW1hZ2VVcGxvYWRzLnRpbWVvdXQsXG4gICAgICBib2R5OiBmb3JtXG4gICAgfTtcbiAgICBmb3JtLmFwcGVuZChjb25maWd1cmUuaW1hZ2VVcGxvYWRzLmtleSwgZmlsZSwgZmlsZS5uYW1lKTtcbiAgICB1cC51cGxvYWQuY2xhc3NMaXN0LmFkZCgncG1rLXByb21wdC11cGxvYWRpbmcnKTtcbiAgICB4aHIob3B0aW9ucywgZG9uZSk7XG5cbiAgICBmdW5jdGlvbiBkb25lIChlcnIsIHhociwgYm9keSkge1xuICAgICAgdXAudXBsb2FkLmNsYXNzTGlzdC5yZW1vdmUoJ3Btay1wcm9tcHQtdXBsb2FkaW5nJyk7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHVwLmZhaWxlZC5jbGFzc0xpc3QuYWRkKCdwbWstcHJvbXB0LWVycm9yLXNob3cnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIGpzb24gPSBKU09OLnBhcnNlKGJvZHkpO1xuICAgICAgZG9tLmlucHV0LnZhbHVlID0ganNvbi51cmwgKyAnIFwiJyArIGpzb24uYWx0ICsgJ1wiJztcbiAgICAgIGNsb3NlKCk7XG4gICAgICBjYihkb20uaW5wdXQudmFsdWUpO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZHJhdzogZHJhd1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHJhZiA9IHJlcXVpcmUoJ3JhZicpO1xudmFyIHByb21wdFJlbmRlciA9IHJlcXVpcmUoJy4vcHJvbXB0UmVuZGVyJyk7XG52YXIgY2FjaGU7XG52YXIgRU5URVJfS0VZID0gMTM7XG52YXIgRVNDQVBFX0tFWSA9IDI3O1xuXG5mdW5jdGlvbiBkcmF3IChjYikge1xuICBpZiAoY2FjaGUpIHtcbiAgICBjYWNoZS5kaWFsb2cucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChjYWNoZS5kaWFsb2cpO1xuICB9XG4gIGNhY2hlID0gcHJvbXB0UmVuZGVyKHtcbiAgICBpZDogJ3Btay1saW5rLXByb21wdCcsXG4gICAgdGl0bGU6ICdJbnNlcnQgTGluaycsXG4gICAgZGVzY3JpcHRpb246ICdUeXBlIG9yIHBhc3RlIHRoZSB1cmwgdG8geW91ciBsaW5rJyxcbiAgICBwbGFjZWhvbGRlcjogJ2h0dHA6Ly9leGFtcGxlLmNvbS8gXCJvcHRpb25hbCB0aXRsZVwiJ1xuICB9KTtcbiAgaW5pdChjYWNoZSwgY2IpO1xuICBjYWNoZS5kaWFsb2cuY2xhc3NMaXN0LmFkZCgncG1rLXByb21wdC1vcGVuJyk7XG4gIHJhZihmb2N1cyk7XG4gIHJldHVybiBjYWNoZS5kaWFsb2c7XG59XG5cbmZ1bmN0aW9uIGZvY3VzICgpIHtcbiAgY2FjaGUuaW5wdXQuZm9jdXMoKTtcbn1cblxuZnVuY3Rpb24gaW5pdCAoZG9tLCBjYikge1xuICBkb20uY2FuY2VsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2UpO1xuICBkb20uY2xvc2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZSk7XG4gIGRvbS5vay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9rKTtcblxuICBkb20uaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCBlbnRlcik7XG4gIGRvbS5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZXNjKTtcblxuICBmdW5jdGlvbiBlbnRlciAoZSkge1xuICAgIHZhciBrZXkgPSBlLndoaWNoIHx8IGUua2V5Q29kZTtcbiAgICBpZiAoa2V5ID09PSBFTlRFUl9LRVkpIHtcbiAgICAgIG9rKCk7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZXNjIChlKSB7XG4gICAgdmFyIGtleSA9IGUud2hpY2ggfHwgZS5rZXlDb2RlO1xuICAgIGlmIChrZXkgPT09IEVTQ0FQRV9LRVkpIHtcbiAgICAgIGNsb3NlKCk7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb2sgKCkge1xuICAgIGNsb3NlKCk7XG4gICAgY2IoZG9tLmlucHV0LnZhbHVlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb3NlICgpIHtcbiAgICBkb20uZGlhbG9nLmNsYXNzTGlzdC5yZW1vdmUoJ3Btay1wcm9tcHQtb3BlbicpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBkcmF3OiBkcmF3LFxuICBpbml0OiBpbml0XG59O1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZG9jID0gZ2xvYmFsLmRvY3VtZW50O1xudmFyIGFjID0gJ2FwcGVuZENoaWxkJztcblxuZnVuY3Rpb24gZSAodHlwZSwgY2xzLCB0ZXh0KSB7XG4gIHZhciBlbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnQodHlwZSk7XG4gIGVsZW0uY2xhc3NOYW1lID0gY2xzO1xuICBpZiAodGV4dCkge1xuICAgIGVsZW0uaW5uZXJUZXh0ID0gdGV4dDtcbiAgfVxuICByZXR1cm4gZWxlbTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3B0cykge1xuICB2YXIgZG9tID0ge1xuICAgIGRpYWxvZzogZSgnYXJ0aWNsZScsICdwbWstcHJvbXB0ICcgKyBvcHRzLmlkKSxcbiAgICBjbG9zZTogZSgnYScsICdwbWstcHJvbXB0LWNsb3NlJyksXG4gICAgaGVhZGVyOiBlKCdoZWFkZXInLCAncG1rLXByb21wdC1oZWFkZXInKSxcbiAgICBoMTogZSgnaDEnLCAncG1rLXByb21wdC10aXRsZScsIG9wdHMudGl0bGUpLFxuICAgIHNlY3Rpb246IGUoJ3NlY3Rpb24nLCAncG1rLXByb21wdC1ib2R5JyksXG4gICAgZGVzYzogZSgncCcsICdwbWstcHJvbXB0LWRlc2NyaXB0aW9uJywgb3B0cy5kZXNjcmlwdGlvbiksXG4gICAgaW5wdXQ6IGUoJ2lucHV0JywgJ3Btay1wcm9tcHQtaW5wdXQnKSxcbiAgICBjYW5jZWw6IGUoJ2EnLCAncG1rLXByb21wdC1jYW5jZWwnLCAnQ2FuY2VsJyksXG4gICAgb2s6IGUoJ2J1dHRvbicsICdwbWstcHJvbXB0LW9rJywgJ09rJyksXG4gICAgZm9vdGVyOiBlKCdmb290ZXInLCAncG1rLXByb21wdC1idXR0b25zJylcbiAgfTtcbiAgZG9tLmhlYWRlclthY10oZG9tLmgxKTtcbiAgZG9tLnNlY3Rpb25bYWNdKGRvbS5kZXNjKTtcbiAgZG9tLnNlY3Rpb25bYWNdKGRvbS5pbnB1dCk7XG4gIGRvbS5pbnB1dC5wbGFjZWhvbGRlciA9IG9wdHMucGxhY2Vob2xkZXI7XG4gIGRvbS5mb290ZXJbYWNdKGRvbS5jYW5jZWwpO1xuICBkb20uZm9vdGVyW2FjXShkb20ub2spO1xuICBkb20uZGlhbG9nW2FjXShkb20uY2xvc2UpO1xuICBkb20uZGlhbG9nW2FjXShkb20uaGVhZGVyKTtcbiAgZG9tLmRpYWxvZ1thY10oZG9tLnNlY3Rpb24pO1xuICBkb20uZGlhbG9nW2FjXShkb20uZm9vdGVyKTtcbiAgZG9jLmJvZHlbYWNdKGRvbS5kaWFsb2cpO1xuICByZXR1cm4gZG9tO1xufTtcblxubW9kdWxlLmV4cG9ydHMudXBsb2FkcyA9IGZ1bmN0aW9uIChkb20pIHtcbiAgdmFyIGZ1cCA9ICdwbWstcHJvbXB0LWZpbGV1cGxvYWQnO1xuICB2YXIgdXAgPSB7XG4gICAgYXJlYTogZSgnc2VjdGlvbicsICdwbWstcHJvbXB0LXVwbG9hZC1hcmVhJyksXG4gICAgd2FybmluZzogZSgncCcsICdwbWstcHJvbXB0LWVycm9yIHBtay13YXJuaW5nJywgJ09ubHkgR0lGLCBKUEVHIGFuZCBQTkcgaW1hZ2VzIGFyZSBhbGxvd2VkJyksXG4gICAgZmFpbGVkOiBlKCdwJywgJ3Btay1wcm9tcHQtZXJyb3IgcG1rLWZhaWxlZCcsICdVcGxvYWQgZmFpbGVkJyksXG4gICAgdXBsb2FkOiBlKCdidXR0b24nLCAncG1rLXByb21wdC11cGxvYWQnKSxcbiAgICB1cGxvYWRpbmc6IGUoJ3NwYW4nLCAncG1rLXByb21wdC1wcm9ncmVzcycsICdVcGxvYWRpbmcgZmlsZS4uLicpLFxuICAgIGRyb3A6IGUoJ3NwYW4nLCAncG1rLXByb21wdC1kcm9wJywgJ0Ryb3AgaGVyZSB0byBiZWdpbiB1cGxvYWQnKSxcbiAgICBicm93c2U6IGUoJ3NwYW4nLCAncG1rLXByb21wdC1icm93c2UnLCAnQnJvd3NlLi4uJyksXG4gICAgZHJhZ2Ryb3A6IGUoJ3NwYW4nLCAncG1rLXByb21wdC1kcmFnZHJvcCcsICdZb3UgY2FuIGFsc28gZHJvcCBmaWxlcyBoZXJlJyksXG4gICAgaW5wdXQ6IGUoJ2lucHV0JywgZnVwKVxuICB9O1xuICB1cC5hcmVhW2FjXSh1cC53YXJuaW5nKTtcbiAgdXAuYXJlYVthY10odXAuZmFpbGVkKTtcbiAgdXAuYXJlYVthY10odXAudXBsb2FkKTtcbiAgdXAudXBsb2FkW2FjXSh1cC5kcm9wKTtcbiAgdXAudXBsb2FkW2FjXSh1cC51cGxvYWRpbmcpO1xuICB1cC51cGxvYWRbYWNdKHVwLmJyb3dzZSk7XG4gIHVwLnVwbG9hZFthY10odXAuZHJhZ2Ryb3ApO1xuICB1cC51cGxvYWRbYWNdKHVwLmlucHV0KTtcbiAgdXAuaW5wdXQuaWQgPSBmdXA7XG4gIHVwLmlucHV0LnR5cGUgPSAnZmlsZSc7XG4gIGRvbS5zZWN0aW9uW2FjXSh1cC5hcmVhKTtcbiAgZG9tLnVwID0gdXA7XG4gIHJldHVybiB1cDtcbn07XG5cbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgbmF2ID0gd2luZG93Lm5hdmlnYXRvcjtcbnZhciB1YSA9IG5hdi51c2VyQWdlbnQudG9Mb3dlckNhc2UoKTtcbnZhciB1YVNuaWZmZXIgPSB7XG4gIGlzSUU6IC9tc2llLy50ZXN0KHVhKSxcbiAgaXNJRV81b3I2OiAvbXNpZSBbNTZdLy50ZXN0KHVhKSxcbiAgaXNPcGVyYTogL29wZXJhLy50ZXN0KHVhKSxcbiAgaXNDaHJvbWU6IC9jaHJvbWUvLnRlc3QodWEpLFxuICBpc1dpbmRvd3M6IC93aW4vaS50ZXN0KG5hdi5wbGF0Zm9ybSlcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdWFTbmlmZmVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcHJvbXB0TGluayA9IHJlcXVpcmUoJy4vcHJvbXB0TGluaycpO1xudmFyIHByb21wdEltYWdlID0gcmVxdWlyZSgnLi9wcm9tcHRJbWFnZScpO1xudmFyIGxpbmtzO1xudmFyIGltYWdlcztcblxuZnVuY3Rpb24gcHJvbXB0ICh0eXBlLCBjYikge1xuICBpZiAobGlua3MpIHtcbiAgICBsaW5rcy5jbGFzc0xpc3QucmVtb3ZlKCdwbWstcHJvbXB0LW9wZW4nKTtcbiAgfVxuICBpZiAoaW1hZ2VzKSB7XG4gICAgaW1hZ2VzLmNsYXNzTGlzdC5yZW1vdmUoJ3Btay1wcm9tcHQtb3BlbicpO1xuICB9XG4gIGlmICh0eXBlID09PSAnbGluaycpIHtcbiAgICBsaW5rcyA9IHByb21wdExpbmsuZHJhdyhwcmVwcm9jZXNzKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnaW1hZ2UnKSB7XG4gICAgaW1hZ2VzID0gcHJvbXB0SW1hZ2UuZHJhdyhwcmVwcm9jZXNzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByZXByb2Nlc3MgKHRleHQpIHtcbiAgICBpZiAodGV4dCAhPT0gbnVsbCl7IC8vIGZpeGVzIGNvbW1vbiBwYXN0ZSBlcnJvcnNcbiAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoL15odHRwOlxcL1xcLyhodHRwcz98ZnRwKTpcXC9cXC8vLCAnJDE6Ly8nKTtcbiAgICAgIGlmICh0ZXh0WzBdICE9PSAnLycgJiYgIS9eKD86aHR0cHM/fGZ0cCk6XFwvXFwvLy50ZXN0KHRleHQpKXtcbiAgICAgICAgdGV4dCA9ICdodHRwOi8vJyArIHRleHQ7XG4gICAgICB9XG4gICAgfVxuICAgIGNiKHRleHQpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBwcm9tcHQ6IHByb21wdFxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gaXNWaXNpYmxlIChlbGVtKSB7XG4gIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkge1xuICAgIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKCdkaXNwbGF5JykgIT09ICdub25lJztcbiAgfSBlbHNlIGlmIChlbGVtLmN1cnJlbnRTdHlsZSkge1xuICAgIHJldHVybiBlbGVtLmN1cnJlbnRTdHlsZS5kaXNwbGF5ICE9PSAnbm9uZSc7XG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkRXZlbnQgKGVsZW0sIHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmIChlbGVtLmF0dGFjaEV2ZW50KSB7XG4gICAgZWxlbS5hdHRhY2hFdmVudCgnb24nICsgdHlwZSwgbGlzdGVuZXIpO1xuICB9IGVsc2Uge1xuICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgZmFsc2UpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFkZEV2ZW50RGVsZWdhdGUgKGVsZW0sIGNsYXNzTmFtZSwgdHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cCgnXFxiJyArIGNsYXNzTmFtZSArICdcXGInKTtcblxuICBpZiAoZWxlbS5hdHRhY2hFdmVudCkge1xuICAgIGVsZW0uYXR0YWNoRXZlbnQoJ29uJyArIHR5cGUsIGRlbGVnYXRvcik7XG4gIH0gZWxzZSB7XG4gICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGRlbGVnYXRvciwgZmFsc2UpO1xuICB9XG4gIGZ1bmN0aW9uIGRlbGVnYXRvciAoZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICB2YXIgZWxlbSA9IGUudGFyZ2V0O1xuICAgIGlmIChlbGVtLmNsYXNzTGlzdCkge1xuICAgICAgaWYgKGVsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkpIHtcbiAgICAgICAgZmlyZSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZWxlbS5jbGFzc05hbWUubWF0Y2gocmVnZXgpKSB7XG4gICAgICAgIGZpcmUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaXJlICgpIHtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmVFdmVudCAoZWxlbSwgZXZlbnQsIGxpc3RlbmVyKSB7XG4gIGlmIChlbGVtLmRldGFjaEV2ZW50KSB7XG4gICAgZWxlbS5kZXRhY2hFdmVudCgnb24nICsgZXZlbnQsIGxpc3RlbmVyKTtcbiAgfSBlbHNlIHtcbiAgICBlbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyLCBmYWxzZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZml4RW9sQ2hhcnMgKHRleHQpIHtcbiAgdGV4dCA9IHRleHQucmVwbGFjZSgvXFxyXFxuL2csICdcXG4nKTtcbiAgdGV4dCA9IHRleHQucmVwbGFjZSgvXFxyL2csICdcXG4nKTtcbiAgcmV0dXJuIHRleHQ7XG59XG5cbmZ1bmN0aW9uIGV4dGVuZFJlZ0V4cCAocmVnZXgsIHByZSwgcG9zdCkge1xuICBpZiAocHJlID09PSBudWxsIHx8IHByZSA9PT0gdm9pZCAwKSB7XG4gICAgcHJlID0gJyc7XG4gIH1cbiAgaWYgKHBvc3QgPT09IG51bGwgfHwgcG9zdCA9PT0gdm9pZCAwKSB7XG4gICAgcG9zdCA9ICcnO1xuICB9XG5cbiAgdmFyIHBhdHRlcm4gPSByZWdleC50b1N0cmluZygpO1xuICB2YXIgZmxhZ3M7XG5cbiAgcGF0dGVybiA9IHBhdHRlcm4ucmVwbGFjZSgvXFwvKFtnaW1dKikkLywgZnVuY3Rpb24gKHdob2xlTWF0Y2gsIGZsYWdzUGFydCkge1xuICAgIGZsYWdzID0gZmxhZ3NQYXJ0O1xuICAgIHJldHVybiAnJztcbiAgfSk7XG4gIHBhdHRlcm4gPSBwYXR0ZXJuLnJlcGxhY2UoLyheXFwvfFxcLyQpL2csICcnKTtcbiAgcGF0dGVybiA9IHByZSArIHBhdHRlcm4gKyBwb3N0O1xuICByZXR1cm4gbmV3IFJlZ0V4cChwYXR0ZXJuLCBmbGFncyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc1Zpc2libGU6IGlzVmlzaWJsZSxcbiAgYWRkRXZlbnQ6IGFkZEV2ZW50LFxuICBhZGRFdmVudERlbGVnYXRlOiBhZGRFdmVudERlbGVnYXRlLFxuICByZW1vdmVFdmVudDogcmVtb3ZlRXZlbnQsXG4gIGZpeEVvbENoYXJzOiBmaXhFb2xDaGFycyxcbiAgZXh0ZW5kUmVnRXhwOiBleHRlbmRSZWdFeHBcbn07XG4iXX0=
(25)
});
