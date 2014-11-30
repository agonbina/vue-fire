
/**
 * Dependencies
 */

var Emitter = require('component-emitter');
var set = require('101/set');
var isObject = require('101/is-object');

var FirebaseArray = module.exports = function (vm, keyPath, ref) {
    var listeners = {};

    this._vm = vm;
    this._ref = ref;
    this._keyPath = keyPath;

    // Initialize the keyPath with an empty array
    vm.$set(keyPath, []);

    // Get a reference to the newly created array
    var array = vm.$get(keyPath);

    listeners['child_added'] = function childAdded(snap, prevId) {
        var newItem = parseSnapshot(snap);
        var position = findPositionAfter(array, prevId);

        array.splice(position, 0, newItem);
    };

    listeners['child_removed'] = function childRemoved(snap) {
        var position = findPosition(array, snap.key());

        if(position > -1) array.splice(position, 1);
    };

    listeners['child_changed'] = function childChanged(snap) {
        var position = findPosition(array, snap.key());

        if(position > -1) {
            var newData = parseSnapshot(snap);
            array.$set(position, newData);
        }
    };

    listeners['child_moved'] = function childMoved(snap, prevId) {
        var currPosition = findPosition(array, snap.key());

        if(currPosition > - 1) {
            var data = array.splice(currPosition, 1)[0];
            var newPosition = findPositionAfter(array, prevId);

            set(data, '$priority', snap.getPriority());

            array.splice(newPosition, 0, data);
        }
    };

    function parseSnapshot(snap) {
        var data = {
            $id: snap.key(),
            $priority: snap.getPriority(),
            $value: snap.val()
        };
        var $value = isObject(data.$value) ? data.$value : {};

        Object.keys($value).forEach(function (key) {
            set(data, key, data.$value[key])
        });

        return data;
    }

    this._listeners = listeners;

    if(vm._isAttached) this.attachListeners();

    return this;
};


FirebaseArray.prototype = {

    attachListeners: function () {
        var self = this;
        var listeners = this._listeners;
        var ref = this._ref;

        Object.keys(listeners).forEach(function (eventName) {
            var cb = listeners[eventName];
            var onSuccess = function (snap, prevId) {
                // Invoke the callback
                cb(snap, prevId);

                // Emit an event
                switch (eventName) {
                    case 'child_added':
                    case 'child_moved':
                        self.emit(eventName, snap.key(), prevId);
                        break;
                    case 'child_removed':
                    case 'child_changed':
                        self.emit(eventName, snap.key());
                        break;
                }
            };
            var onError = function (err) {
                self.emit(eventName + ":error", err);
            };

            ref.on(eventName, onSuccess, onError);
        })
    },

    detachListeners: function () {
        var self = this;
        var listeners = this._listeners;
        var ref = this._ref;

        Object.keys(listeners).forEach(function (eventName) {
            var cb = listeners[eventName];
            ref.off(eventName, cb);
        })
    },

    remove: function (removeLocal) {
        this.detachListeners();

        // Remove all listeners of the 'value' and 'value:error' events
        this.off();

        // Remove the FirebaseArray instance from the $firebase references
        delete this._vm.$firebase._references[this._keyPath];

        if(removeLocal) {
            this._vm.$delete(this._keyPath);
        }
    },

    ref: function () {
        return this._ref.ref();
    }

};


// FirebaseArray helpers

function findPosition(array, id) {
    var position = -1;

    for(var i = 0, len = array.length; i < len; i += 1) {
        if(array[i].$id === id) position = i;
    }

    return position;
}

function findPositionAfter(array, prevId) {
    var position = -1;

    if(!prevId) {
        position = 0;
    } else {
        var prevPosition = findPosition(array, prevId);

        if(prevPosition === -1) position = array.length;
        else position = prevPosition + 1;
    }

    return position;
}


/**
 * Make FirebaseArray an Event Emitter
 */

Emitter(FirebaseArray.prototype);


