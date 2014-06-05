'use strict'

function identity (x) { return x; }
function returnFalse (x) { return false; }

function HookCollection () {
}

HookCollection.prototype = {
  chain: function (name, fn) {
    var original = this[name];
    if (!original) {
      throw new Error('unknown hook ' + name);
    }

    if (original === identity) {
      this[name] = fn;
    } else {
      this[name] = function (x) { return fn(original(x)); }
    }
  },
  set: function (name, fn) {
    if (!this[name]) {
      throw new Error('unknown hook ' + name);
    }
    this[name] = fn;
  },
  addNoop: function (name) {
    this[name] = identity;
  },
  addFalse: function (name) {
    this[name] = returnFalse;
  }
};

module.exports = HookCollection;
