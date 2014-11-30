
/**
 *  Constructor dependencies
 */

var exists = require('101/exists');
var not = require('101/not');
var set = require('101/set');
var isString = require('101/is-string');
var isFunction = require('101/is-function');
var instanceOf = require('101/instance-of');

var FirebaseValue = require('./FirebaseValue');
var FirebaseArray = require('./FirebaseArray');

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

        keyPath = isString(keyPath)
            ? keyPath
            : ref.ref().key();

        var firebaseValue = new FirebaseValue(vm, keyPath, ref);

        set(this._references, keyPath, firebaseValue);

        return firebaseValue;
    },


    /**
     * Binds a Firebase array(list) to a view model keypath
     */

    setArray: function (location, setter, keyPath) {
        var vm = this._vm;
        var root = this._root;
        var ref;


        /**
         * If the location is a string, we use it to create a new Firebase reference to this location
         *
         * If the location is a function, we call it with the 'vm' as its context and pass 'root' as the first argument.
         * In return we expect a Firebase instance.
         */

        if(isString(location)) {
            ref = root.child(location);
            keyPath = isString(setter)
                ? setter
                : ref.ref().key();
        } else if(isFunction(location)) {
            ref = location.call(vm, root);

            if(not(instanceOf)(Firebase, ref)) {
                throw new Error('The setter function passed in to setArray must return a Firebase instance.');
            }

            keyPath = isString(setter)
                ? setter
                : ref.ref().key();
        }

        var firebaseArray = new FirebaseArray(vm, keyPath, ref);

        set(this._references, keyPath, firebaseArray);

        return firebaseArray;
    },

    attachListeners: function () {
        var fire = this;

        Object.keys(fire._references).forEach(function (key) {
            var ref = fire._references[key];
            ref.attachListeners();
        });
    },

    detachListeners: function () {
        var fire = this;

        Object.keys(fire._references).forEach(function (key) {
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