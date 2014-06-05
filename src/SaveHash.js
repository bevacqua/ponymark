'use strict';

function SaveHash() {
}

SaveHash.prototype = {
    set: function (key, value) {
        this['h_' + key] = value;
    },
    get: function (key) {
        return this['h_' + key];
    }
};

module.exports = SaveHash;
