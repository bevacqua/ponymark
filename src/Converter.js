'use strict'

var SaveHash = require('./SaveHash');
var HookCollection = require('./HookCollection');

function Converter () {
  var hooks = this.hooks = new HookCollection();
  hooks.addNoop('plainLinkText');
  hooks.addNoop('preConversion');
  hooks.addNoop('postConversion');

  var g_urls;
  var g_titles;
  var g_html_blocks;
  var g_list_level;

  this.makeHtml = function (text) {

    if (g_urls) {
      throw new Error('Recursive call to converter.makeHtml');
    }

    g_urls = new SaveHash();
    g_titles = new SaveHash();
    g_html_blocks = [];
    g_list_level = 0;

    text = hooks.preConversion(text);
    text = text.replace(/~/g, '~T');
    text = text.replace(/\$/g, '~D');
    text = text.replace(/\r\n/g, '\n');
    text = text.replace(/\r/g, '\n');
    text = '\n\n' + text + '\n\n';
    text = _untab(text);
    text = text.replace(/^[ \t]+$/mg, '');
    text = _hashHTMLBlocks(text);
    text = _stripLinkDefinitions(text);
    text = _runBlockGamut(text);
    text = _unescapeSpecialChars(text);
    text = text.replace(/~D/g, '$$');
    text = text.replace(/~T/g, '~');
    text = hooks.postConversion(text);

    g_html_blocks = g_titles = g_urls = null;

    return text;
  };

  function _stripLinkDefinitions (text) {
    var linked = /^[ ]{0,3}\[(.+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?(?=\s|$)[ \t]*\n?[ \t]*((\n*)["(](.+?)[")][ \t]*)?(?:\n+)/gm;

    function replacer (all, m1, m2, m3, m4, m5) {
      m1 = m1.toLowerCase();
      g_urls.set(m1, _encodeAmpsAndAngles(m2));
      if (m4) {
        return m3;
      } else if (m5) {
        g_titles.set(m1, m5.replace(/"/g, '&quot;'));
      }
      return '';
    }
    return text.replace(linkdef, replacer);
  }

  function _hashHTMLBlocks (text) {
    text = text.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del)\b[^\r]*?\n<\/\2>[ \t]*(?=\n+))/gm, hashElement);
    text = text.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math)\b[^\r]*?.*<\/\2>[ \t]*(?=\n+)\n)/gm, hashElement);
    text = text.replace(/\n[ ]{0,3}((<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g, hashElement);
    text = text.replace(/\n\n[ ]{0,3}(<!(--(?:|(?:[^>-]|-[^>])(?:[^-]|-[^-])*)--)>[ \t]*(?=\n{2,}))/g, hashElement);
    text = text.replace(/(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g, hashElement);
    return text;
  }

  function hashElement (all, m1) {
    var block = m1;
    block = block.replace(/^\n+/, '');
    block = block.replace(/\n+$/g, '');
    block = '\n\n~K' + (g_html_blocks.push(block) - 1) + 'K\n\n';
    return block;
  }

  function _runBlockGamut (text, doNotUnhash) {
    var replacement = '<hr />\n';
    text = _doHeaders(text);
    text = text.replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm, replacement);
    text = text.replace(/^[ ]{0,2}([ ]?-[ ]?){3,}[ \t]*$/gm, replacement);
    text = text.replace(/^[ ]{0,2}([ ]?_[ ]?){3,}[ \t]*$/gm, replacement);
    text = _doLists(text);
    text = _doCodeBlocks(text);
    text = _doBlockQuotes(text);
    text = _hashHTMLBlocks(text);
    text = _formParagraphs(text, doNotUnhash);
    return text;
  }

  function _runSpanGamut (text) {
    text = _doCodeSpans(text);
    text = _escapeSpecialCharsWithinTagAttributes(text);
    text = _encodeBackslashEscapes(text);
    text = _doImages(text);
    text = _doAnchors(text);
    text = _doAutoLinks(text);
    text = text.replace(/~P/g, '://');
    text = _encodeAmpsAndAngles(text);
    text = _doItalicsAndBold(text);
    text = text.replace(/  +\n/g, ' <br>\n');
    return text;
  }

  function _escapeSpecialCharsWithinTagAttributes (text) {
    var regex = /(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--(?:|(?:[^>-]|-[^>])(?:[^-]|-[^-])*)--)>)/gi;

    function matcher (all) {
      var tag = all.replace(/(.)<\/?code>(?=.)/g, '$1`');
      tag = escapeCharacters(tag, all.charAt(1) == '!' ? '\\`*_/' : '\\`*_');
      return tag;
    }
    return text.replace(regex, matcher);
  }

  function _doAnchors (text) {
    text = text.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g, writeAnchorTag);
    text = text.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?((?:\([^)]*\)|[^()\s])*?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g, writeAnchorTag);
    text = text.replace(/(\[([^\[\]]+)\])()()()()()/g, writeAnchorTag);
    return text;
  }

  function writeAnchorTag (all, m1, m2, m3, m4, m5, m6, m7) {
    if (m7 == void 0) {
      m7 = "";
    }
    var whole_match = m1;
    var link_text = m2.replace(/:\/\//g, '~P');
    var link_id = m3.toLowerCase();
    var url = m4;
    var title = m7;

    if (url == '') {
      if (link_id == '') {
        link_id = link_text.toLowerCase().replace(/ ?\n/g, ' ');
      }
      url = '#' + link_id;

      if (g_urls.get(link_id) != void 0) {
        url = g_urls.get(link_id);
        if (g_titles.get(link_id) != void 0) {
          title = g_titles.get(link_id);
        }
      } else {
        if (whole_match.search(/\(\s*\)$/m) > -1) {
          url = '';
        } else {
          return whole_match;
        }
      }
    }
    url = encodeProblemUrlChars(url);
    url = escapeCharacters(url, '*_');
    var result = '<a href="' + url + '"';

    if (title != '') {
      title = attributeEncode(title);
      title = escapeCharacters(title, '*_');
      result += ' title="' + title + '"';
    }
    result += '>' + link_text + '</a>';

    return result;
  }

  function _doImages (text) {
    text = text.replace(/(!\[(.*?)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g, writeImageTag);
    text = text.replace(/(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g, writeImageTag);
    return text;
  }

  function attributeEncode (text) {
    return text.replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  }

  function writeImageTag (all, m1, m2, m3, m4, m5, m6, m7) {
    var whole_match = m1;
    var alt_text = m2;
    var link_id = m3.toLowerCase();
    var url = m4;
    var title = m7;

    if (!title) {
      title = '';
    }

    if (url == '') {
      if (link_id == '') {
        link_id = alt_text.toLowerCase().replace(/ ?\n/g, ' ');
      }
      url = '#' + link_id;

      if (g_urls.get(link_id) != void 0) {
        url = g_urls.get(link_id);
        if (g_titles.get(link_id) != void 0) {
          title = g_titles.get(link_id);
        }
      } else {
        return whole_match;
      }
    }

    alt_text = escapeCharacters(attributeEncode(alt_text), '*_[]()');
    url = escapeCharacters(url, '*_');
    title = attributeEncode(title);
    title = escapeCharacters(title, '*_');

    var result = '<img src="' + url + '" alt="' + alt_text + '"';
    result += ' title="' + title + '"';
    result += ' />';
    return result;
  }

  function _doHeaders (text) {
    text = text.replace(/^(.+)[ \t]*\n=+[ \t]*\n+/gm, heading(1));
    text = text.replace(/^(.+)[ \t]*\n-+[ \t]*\n+/gm, heading(2));
    text = text.replace(/^(\#{1,6})[ \t]*(.+?)[ \t]*\#*\n+/gm, heading());

    function heading (level) {
      return function replacer (all, m1, m2) {
        var hl = level;
        if (hl) {
          text = m1;
        } else {
          text = m2;
          hl = m1.length;
        }
        return '<h' + hl + '>' + _runSpanGamut(text) + '</h' + hl + '>\n\n';
      }
    }

    return text;
  }

  function _doLists (text) {
    var whole_list;

    text += '~0';

    if (g_list_level) {
      whole_list = /^(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;
      text = text.replace(whole_list, replacer_list_level);
    } else {
      whole_list = /(\n\n|^\n?)(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/g;
      text = text.replace(whole_list, replacer);
    }

    function replacer_list_level (all, m1, m2) {
      var list = m1;
      var list_type = m2.search(/[*+-]/g > -1) ? 'ul' : 'ol';
      var result = _processListItems(list, list_type);
      result = result.replace(/\s+$/, '');
      result = '<' + list_type + '>' + result + '</' + list_type + '>\n';
      return result;
    }

    function replacer (all, m1, m2, m3) {
      var runup = m1;
      var list = m2;
      var list_type = m3.search(/[*+-]/g) > -1 ? 'ul' : 'ol';
      var result = _processListItems(list, list_type);
      result = runup + '<' + list_type + '>\n' + result + '</' + list_type + '>\n';
      return result;
    }

    text = text.replace(/~0/, '');
    return text;
  }

  var _listItemMarkers = { ol: '\\d+[.]', ul: '[*+-]' };

  function _processListItems(list_str, list_type) {
    var marker = _listItemMarkers[list_type];
    var re = new RegExp('(^[ \\t]*)(' + marker + ')[ \\t]+([^\\r]+?(\\n+))(?=(~0|\\1(' + marker + ')[ \\t]+))', 'gm');
    var last_item_had_a_double_newline = false;

    g_list_level++;
    list_str = list_str.replace(/\n{2,}$/, '\n');
    list_str += '~0';
    list_str = list_str.replace(re, replacer);
    list_str = list_str.replace(/~0/g, '');
    g_list_level--;

    function replacer (all, m1, m2, m3) {
      var item = m3;
      var leading_space = m1;
      var ends_with_double_newline = /\n\n$/.test(item);
      var contains_double_newline = ends_with_double_newline || item.search(/\n{2,}/) > -1;
      if (contains_double_newline || last_item_had_a_double_newline) {
        item = _runBlockGamut(_outdent(item), true);
      } else {
        item = _doLists(_outdent(item));
        item = item.replace(/\n$/, '');
        item = _runSpanGamut(item);
      }
      last_item_had_a_double_newline = ends_with_double_newline;
      return '<li>' + item + '</li>\n';
    }

    return list_str;
  }

  function _doCodeBlocks (text) {
    text += '~0';
    text = text.replace(/(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g, replacer);
    text = text.replace(/~0/, '');

    function replacer (all, m1, m2) {
      var codeblock = m1;
      var nextChar = m2;

      codeblock = _encodeCode(_outdent(codeblock));
      codeblock = _untab(codeblock);
      codeblock = codeblock.replace(/^\n+/g, '');
      codeblock = codeblock.replace(/\n+$/g, '');

      codeblock = '<pre><code>' + codeblock + '\n</code></pre>';

      return '\n\n' + codeblock + '\n\n' + nextChar;
    }

    return text;
  }

  function hashBlock (text) {
    text = text.replace(/(^\n+|\n+$)/g, '');
    return '\n\n~K' + (g_html_blocks.push(text) - 1) + 'K\n\n';
  }

  function _doCodeSpans (text) {
    function replacer (all, m1, m2, m3, m4) {
      var c = m3;
      c = c.replace(/^([ \t]*)/g, '');
      c = c.replace(/[ \t]*$/g, '');
      c = _encodeCode(c);
      c = c.replace(/:\/\//g, '~P');
      return m1 + '<code>' + c + '</code>';
    }
    return text.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm, replacer);
  }

  function _encodeCode (text) {
    text = text.replace(/&/g, '&amp;');
    text = text.replace(/</g, '&lt;');
    text = text.replace(/>/g, '&gt;');
    text = escapeCharacters(text, '\*_{}[]\\', false);
    return text;
  }

  function _doItalicsAndBold (text) {
    text = text.replace(/([\W_]|^)(\*\*|__)(?=\S)([^\r]*?\S[\*_]*)\2([\W_]|$)/g, '$1<strong>$3</strong>$4');
    text = text.replace(/([\W_]|^)(\*|_)(?=\S)([^\r\*_]*?\S)\2([\W_]|$)/g, '$1<em>$3</em>$4');
    return text;
  }

  function _doBlockQuotes (text) {
    function replacer (all, m1) {
      var bq = m1;
      bq = bq.replace(/^[ \t]*>[ \t]?/gm, '~0');
      bq = bq.replace(/~0/g, '');
      bq = bq.replace(/^[ \t]+$/gm, '');
      bq = _runBlockGamut(bq);
      bq = bq.replace(/(^|\n)/g, '$1  ');
      bq = bq.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm, hack_replacer);
      return hashBlock('<blockquote>\n' + bq + '\n</blockquote>');
    }
    function hack_replacer (all, m1) {
      var pre = m1;
      pre = pre.replace(/^  /mg, '~0');
      pre = pre.replace(/~0/g, '');
      return pre;
    }
    return text.replace(/((^[ \t]*>[ \t]?.+\n(.+\n)*\n*)+)/gm, replacer);
  }

  function _formParagraphs(text, doNotUnhash) {
    text = text.replace(/^\n+/g, '');
    text = text.replace(/\n+$/g, '');

    var grafs = text.split(/\n{2,}/g);
    var grafsOut = [];
    var markerRe = /~K(\d+)K/;
    var end = grafs.length;
    var any = true;
    var str;
    var i;

    for (i = 0; i < end; i++) {
      str = grafs[i];

      if (markerRe.test(str)) {
        grafsOut.push(str);
      } else if (/\S/.test(str)) {
        str = _runSpanGamut(str);
        str = str.replace(/^([ \t]*)/g, '<p>');
        str += '</p>';
        grafsOut.push(str);
      }
    }

    if (!doNotUnhash) {
      end = grafsOut.length;
      for (i = 0; i < end; i++) {
        while (any) {
          any = false;
          grafsOut[i] = grafsOut[i].replace(/~K(\d+)K/g, replacer);
        }
      }
    }

    function replacer (all, id) {
      any = true;
      return g_html_blocks[id];
    }
    return grafsOut.join('\n\n');
  }

  function _encodeAmpsAndAngles (text) {
    text = text.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g, '&amp;');
    text = text.replace(/<(?![a-z\/?!]|~D)/gi, '&lt;');
    return text;
  }

  function _encodeBackslashEscapes (text) {
    text = text.replace(/\\(\\)/g, escapeCharacters_callback);
    text = text.replace(/\\([`*_{}\[\]()>#+-.!])/g, escapeCharacters_callback);
    return text;
  }

  function _doAutoLinks (text) {
    text = text.replace(/(^|\s)(https?|ftp)(:\/\/[-A-Z0-9+&@#\/%?=~_|\[\]\(\)!:,\.;]*[-A-Z0-9+&@#\/%=~_|\[\]])($|\W)/gi, "$1<$2$3>$4");
    text = text.replace(/<((https?|ftp):[^'">\s]+)>/gi, replacer);

    function replacer (all, m1) {
      return '<a href="' + m1 + '"' + hooks.plainLinkText(m1) + '</a>';
    }
    return text;
  }

  function _unescapeSpecialChars (text) {
    function replacer (all, m1) {
      var charCodeToReplace = parseInt(m1);
      return String.fromCharCode(charCodeToReplace);
    }
    return text.replace(/~E(\d+)E/g, replacer);
  }

  function _outdent (text) {
    text = text.replace(/^(\t|[ ]{1,4})/gm, '~0');
    text = text.replace(/~0/g, '');
    return text;
  }

  function _untab (text) {
    var spaces = ['    ', '   ', '  ', ' '];
    var skew = 0;
    var v;

    if (!/\t/.test(text)) {
      return text;
    }

    function replacer (match, offset) {
      if (match === '\n') {
        skew = offset + 1;
        return match;
      }
      v = (offset - skew) % 4;
      skew = offset + 1;
      return spaces[v];
    }
    return text.replace(/[\n\t]/g, replacer);
  }

  var _problemUrlChars = /(?:["'*()[\]:]|~D)/g;

  function encodeProblemUrlChars(url) {
    var len = url.length;

    if (!url) {
      return '';
    }

    function replacer (match, offset) {
      if (match == '~D') {
        return '%24';
      }
      if (match == ':') {
        if (offset == len - 1 || /[0-9\/]/.test(url.charAt(offset + 1))) {
          return ':';
        }
      }
      return '%' + match.charCodeAt(0).toString(16);
    }
    return url.replace(_problemUrlChars, replacer);
  }

  function escapeCharacters(text, charsToEscape, afterBackslash) {
    var regexString = '([' + charsToEscape.replace(/([\[\]\\])/g, '\\$1') + '])';
    if (afterBackslash) {
        regexString = '\\\\' + regexString;
    }
    var regex = new RegExp(regexString, 'g');
    text = text.replace(regex, escapeCharacters_callback);
    return text;
  }


  function escapeCharacters_callback(wholeMatch, m1) {
    var charCodeToEscape = m1.charCodeAt(0);
    return '~E' + charCodeToEscape + 'E';
  }
};

module.exports = Converter;
