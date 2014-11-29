
/**
 * Plugin dependencies
 */

var exists = require('101/exists');
var not = require('101/not');


exports.install = function (Vue, options) {

    if(not(exists)(window.Firebase)) {
        throw new Error('Firebase should be exposed as a global property.');
        return;
    }

    var app = options.app;


    /**
     * Register the orderByPriority filter
     */

    Vue.filter('orderByPriority', function (array) {
        var key = this.$get(array);

        return this.$eval(key + " | orderBy '$priority'");
    });


    /**
     * Setup, then export the vue-fire plugin
     */

    exports.mixin = require('./mixin')(app)
};