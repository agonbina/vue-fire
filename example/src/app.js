
var firebaseMixin = require('../..').mixin;

module.exports = {

    mixins: [firebaseMixin],

    firebase: function (root) {
        var peopleQuery = root.child('people').orderByChild('age').limitToFirst(3);

        return {
            arrays: [ peopleQuery ],
            values: [
                root.child('presence'),
                root.child('name')
            ]
        }
    }

};
