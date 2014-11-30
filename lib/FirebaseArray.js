
/**
 * Dependencies
 */

var Emitter = require('component-emitter');
var set = require('101/set');


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
        var newItem = snap.val();
        var position = findPositionAfter(array, prevId);

        set(newItem, '$id', snap.key());
        set(newItem, '$priority', snap.getPriority());

        array.splice(position, 0, newItem);
    };

    listeners['child_removed'] = function childRemoved(snap) {
        var position = findPosition(array, snap.key());

        if(position > -1) array.splice(position, 1);
    };

    listeners['child_changed'] = function childChanged(snap) {
        var position = findPosition(array, snap.key());

        if(position > -1) {
            var newData = snap.val();

            set(newData, '$id', snap.key());
            set(newData, '$priority', snap.getPriority());

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

    this._listeners = listeners;

    return this;
};


FirebaseArray.prototype = {

    attachListeners: function () {
        var self = this;
        var listeners = this._listeners;
        var ref = this._ref;

        Object.keys(listeners).forEach(function (eventName) {
            var cb = listeners[eventName];
            ref.on(eventName, cb);
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

    ref: function () {
        return this._ref;
    }

};


/**
 * Make FirebaseArray an Event Emitter
 */

Emitter(FirebaseArray.prototype);


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