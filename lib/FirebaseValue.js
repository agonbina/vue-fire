
/**
 * Dependencies
 */

var set = require('101/set');


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
};

FirebaseValue.prototype = {

    attachListeners: function () {
        var listeners = this._listeners;
        var ref = this._ref;

        Object.keys(listeners).forEach(function (eventName) {
            var cb = listeners[eventName];
            ref.on(eventName, cb);
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

        if(removeLocal) {
            this._vm.$delete(this._keyPath);
        }
    },

    ref: function () {
        return this._ref;
    }

};