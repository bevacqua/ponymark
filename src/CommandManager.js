'use strict';

var settings = { lineLength: 72 };
var re = RegExp;

function CommandManager (pluginHooks, getString) {
  this.hooks = pluginHooks;
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
    var that = this;

    if (isImage) {
      if (!this.hooks.insertImageDialog(linkEnteredCallback)){
        ui.prompt('prompt-image', linkEnteredCallback);
      }
    } else {
      ui.prompt('prompt-link', linkEnteredCallback);
    }
    return true;
  }

  function linkEnteredCallback (link) {
    if (link !== null) {
      chunk.selection = (' ' + chunk.selection).replace(/([^\\](?:\\\\)*)(?=[[\]])/g, '$1\\').substr(1);

      var linkDef = ' [999]: ' + properlyEncoded(link);
      var num = that.addLinkDef(chunk, linkDef);
      chunk.startTag = isImage ? '![' : '[';
      chunk.endTag = '][' + num + ']';

      if (!chunk.selection) {
        if (isImage) {
          chunk.selection = that.getString('imagedescription');
        }
        else {
          chunk.selection = that.getString('linkdescription');
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

  chunk.selection = this.hooks.postBlockquoteCreation(chunk.selection);

  if (!/\n/.test(chunk.selection)) {
    chunk.selection = chunk.selection.replace(/^(> *)/,
      function (wholeMatch, blanks) {
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
    chunk.endTag = ' ##';
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

  var headerLevelToCreate = headerLevel == 0 ? 2 : headerLevel - 1;
  if (headerLevelToCreate > 0) {
    var headerChar = headerLevelToCreate >= 2 ? '-' : '=';
    var len = chunk.selection.length;
    if (len > settings.lineLength) {
      len = settings.lineLength;
    }
    chunk.endTag = '\n';
    while (len--) {
      chunk.endTag += headerChar;
    }
  }
};

$.doHorizontalRule = function (chunk, postProcessing) {
  chunk.startTag = '----------\n';
  chunk.selection = '';
  chunk.skipLines(2, 1, true);
}

module.exports = CommandManager;
