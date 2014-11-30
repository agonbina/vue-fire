
/**
 * Dependencies
 */

var Emitter = require('component-emitter');


/**
 *
 * @type {Function}
 */

var FirebaseValue = module.exports = function (vm, keyPath, ref) {
    var listeners = {};

    this._vm = vm;
    this._ref = ref;
    this._keyPath = keyPath;

    vm.$set(keyPath, undefined);

    // Listen for the 'value' event on this reference
    listeners['value'] = function (snap) {
        var data = snap.val();

        vm.$set(keyPath, data);
    };

    // Store the listeners in this instance
    this._listeners = listeners;

    if(vm._isAttached) this.attachListeners();

    return this;
};


FirebaseValue.prototype = {

    attachListeners: function () {
        var self = this;
        var listeners = this._listeners;
        var ref = this._ref;

        Object.keys(listeners).forEach(function (eventName) {
            var cb = listeners[eventName];
            var onSuccess = function (snap) {
                cb(snap);
                self.emit('value', snap);
            };
            var onError = function (err) {
                self.emit(eventName + ':error', err);
            };

            ref.on(eventName, onSuccess, onError);
        })
    },

    detachListeners: function () {
        var listeners = this._listeners;
        var ref = this._ref;

        Object.keys(listeners).forEach(function (eventName) {
            var cb = listeners[eventName];
            ref.off(eventName, cb);
        })
    },

    remove: function (removeLocal) {
        this.detachListeners();

        // Remove the FirebaseValue instance from the $firebase references
        delete this._vm.$firebase._references[this._keyPath];

        if(removeLocal) {
            this._vm.$delete(this._keyPath);
        }
    },

    ref: function () {
        return this._ref;
    }

};


/**
 * Make FirebaseValue an Event Emitter
  */

Emitter(FirebaseValue.prototype);
