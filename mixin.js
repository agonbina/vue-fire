
/**
 * Mixin dependencies
 */

var noop = require('101/noop');
var Fire = require('./lib/fire');


/**
 * The vue-fire mixin
 *
 * @param app {String} The Firebase application name
 */

module.exports = function (app) {

    var root = new Firebase('https://' + app + '.firebaseio.com');

    return {
        created: function () {
            var vm = this;
            var firebase = this.$options.firebase || noop;
            var refs = firebase.call(root, root) || {};

            //var arrays = refs.arrays || [];
            var values = refs.values || [];

            vm.$firebase = new Fire(vm, root);

            values.forEach(function (keyPath) {
                vm.$firebase.setValue(keyPath)
            });

        },

        attached: function () {
            console.log('attached');
            this.$firebase.attachListeners();
        },

        detached: function () {
            console.log('detached');
            this.$firebase.detachListeners();
        }
    }
};