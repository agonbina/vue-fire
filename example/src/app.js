
var firebaseMixin = require('../..').mixin;

module.exports = {

    mixins: [ firebaseMixin ],

    firebase: function (root) {
        var peopleQuery = root.child('people').orderByChild('age').limitToFirst(3);

        return {
            arrays: [ peopleQuery ],
            values: [
                'name'
            ]
        }
    },

    template:
        '<div>name: {{name}}</div>' +
        '<div>isOnline: {{isOnline}}</div>',

    ready: function () {
        this.$firebase.setValue('isOnline', 'user/presence');
    }

};
