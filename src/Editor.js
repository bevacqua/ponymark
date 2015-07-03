'use strict';

var emitter = require('contra/emitter');
var ui = require('./ui');
var util = require('./util');
var position = require('./position');
var PanelCollection = require('./PanelCollection');
var UndoManager = require('./UndoManager');
var UIManager = require('./UIManager');
var CommandManager = require('./CommandManager');
var PreviewManager = require('./PreviewManager');

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
