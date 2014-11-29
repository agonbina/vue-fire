
/**
 * The vue-fire mixin
 *
 * @param app {String} The Firebase application name
 */

module.exports = function (app) {

    var root = new Firebase('https://' + app + '.firebaseio.com');

    return {
        created: function () {
            var firebase = this.$options.firebase;
            var refs = firebase.call(root, root);


        }
    }
};