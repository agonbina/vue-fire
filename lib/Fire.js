
/**
 *  Constructor dependencies
 */

var exists = require('101/exists');
var isString = require('101/is-string');
var hasProperties = require('101/has-properties');

var FirebaseValue = require('./FirebaseValue');

var Fire = function (vm, root) {

    this._vm = vm;
    this._root = root;
    this._references = {};

};

Fire.prototype = {

    /**
     * Binds a Firebase value/object to a view model keypath
     *
     * @param keyPath {String} The Firebase reference will be bound to this keyPath in the view model
     * @param location {String} The relative to the root path of the Firebase reference
     */

    setValue: function (location, keyPath) {
        var vm = this._vm;
        var ref = this._root.child(location);

        keyPath = isString(keyPath) ? keyPath : ref.ref().key();

        this._references[keyPath] = new FirebaseValue(vm, keyPath, ref);

        return this.get(keyPath);
    },

    attachListeners: function () {
        var fire = this;

        Object.keys(fire._references).map(function (key) {
            var ref = fire._references[key];
            ref.attachListeners();
        });
    },

    detachListeners: function () {
        var fire = this;

        Object.keys(fire._references).map(function (key) {
            var ref = fire._references[key];
            ref.detachListeners();
        });
    },

    get: function (keyPath) {
        return isString(keyPath)
            ? this._references[keyPath]
            : null;
    }

};


module.exports = Fire;