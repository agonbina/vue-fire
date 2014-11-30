
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
        '<ul>' +
            '<li v-repeat="people">{{name}} : {{age}}</li>' +
        '</ul>' +
        '<div>name: {{name}}</div>' +
        '<div>isOnline: {{isOnline}}</div>',

    ready: function () {
        var ref = this.$firebase.setValue('user/presence', 'isOnline');
        ref.on('value', function (snap) {
            console.log(snap.val())
        });

        var usersRef = this.$firebase.setArray(function (root) {
            return root.child('names').limitToFirst(3);
        }, 'myUsers');

        usersRef.on('child_added', function ($id, $prevId) {
            console.log('added myUsers with $id: ' + $id);
        })
    }

};
