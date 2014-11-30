**WIP** vue-fire
============
Sync a $data path of a Vue.js view model with a Firebase reference.

## Usage
First add it as a dependency:
```
npm install --save vue-fire
```

```javascript
// Plugin

var Vue = require('vue');
var vueFire = require('vue-fire');

Vue.use(vueFire, { app: 'your-firebase-app' });

// Mixin

var firebaseMixin = require('vue-fire').mixin;

var app = new Vue({

  mixins: [ firebaseMixin ],

  template: '<ul>' +
              '<li v-repeat="people">{{name}} : {{age}}</li>' +
            '</ul>',

  firebase: function(root) {
    var peopleRef = root.child('people').orderBy('age').limitToLast(3);

    return {
      arrays: [ peopleRef ],
      values: [
        'status',
        'name'
      ]
    };
  },

  ready: function() {
    // this.$firebase has been created, you can attach more stuff to the view model
    var ref = this.$firebase.setValue('user/presence', 'isOnline');

    ref.on('value:error', function(err) { })
  }

});

app.$mount('#app');
```

This mixin sets a ```$firebase``` property on the view model, which has the following API:

## API for vm.$firebase

### .setValue(firebaseLocation|String, [ keyPath|String ])
  Creates a new keypath in the view model with the ```firebaseLocation``` reference key or ```keyPath```(if specified)
  and listens on the ```'value'``` event to update the view model value as it changes in the ```firebaseLocation```.

  Ex.

  ```js
  // Binds https://your-firebase-app.firebaseio.com/user/presence to the 'vm.isOnline' keypath
  vm.$firebase.setValue('user/presence', 'isOnline')

  // Binds https://your-firebase-app.firebaseio.com/title to the 'vm.title' keypath
  vm.$firebase.setValue('title')
  ```

  .setValue returns a [```FirebaseValue```](#getkeypathstring) instance.

### .setArray([ firebaseLocation|String, setter|Function OR keyPath|String ])
  Creates an array with the reference key in $data and attaches listeners
  on the Firebase list events(child_added, child_removed, child_moved, child_changed).
  Examples:

  You can pass just the Firebase location:
  ```js
  vm.$firebase.setArray('group/123/members'); // vm.members will be synced with this Firebase location
  vm.$firebase.setArray('players'); // vm.players will be synced with this Firebase location
  ```

  You can also pass an optional keyPath:
  ```js
  vm.$firebase.setArray('group/123/members', 'firebaseMembers'); // vm.firebaseMembers is now synced with the 'group/123/members' location
  ```

  If you need access to the view model to construct a Firebase reference or query you can pass in a function:
  ```js
    vm.$firebase.setArray(function(root) {
      var groupId = this.id;

      // root === new Firebase('https://your-app-name.firebaseio.com')
      // this === vm

      return root.child('group').child(groupId).child('members').orderByChild('name');
    })
    // vm.members will be synced with the returned Firebase Query

    // You can also pass a custom keyPath
    vm.$firebase.setArray(function(root) { return someReference }, 'myKey')
  ```

  .setArray returns a [```FirebaseArray```](#getkeypathstring) instance.

### .get(keyPath|String)
  Returns a FirebaseValue or FirebaseArray.

  From the usage example above:
  ```
  // Values
  vm.$firebase.get('people')
  vm.$firebase.get('status')
  vm.$firebase.get('name')

  // Arrays
  vm.$firebase.get('members')
  ```

  The returned object is also an [Event Emitter](https://github.com/component/emitter) and has the following API:

#### .on(event|String, callback|Function)
  If its a ```FirebaseValue``` instance, you can listen on the ```'value'``` event if you need to get a hold of the raw
  ```snapshot```, or the ```'value:error'``` event which fires when there is an error in the syncing from Firebase.

  ```js
  var isOnline = vm.$firebase.get('isOnline')

  isOnline.on('value', function(snapshot) { })
  isOnline.on('value:error', function(error) { })
  ```

  If its a ```FirebaseArray``` instance, you can listen on the same events as you would on a Firebase list reference:

  * **'child_added'**
  * **'child_moved'**
  * **'child_changed'**
  * **'child_removed'**

  ```js
  var members = vm.$firebase.get('members'); // Assuming 'members' was created using .setArray

  members.on('child_added', function($id, $prevChildId) { })
  members.on('child_moved', function($id, $prevChildId) { })
  members.on('child_changed', function($id) { })
  members.on('child_removed', function($id) { })

  // Each one of these events can throw errors which you can listen to by adding ':error' to the eventName:
  members.on('child_removed:error', function(error) { })
  ```
#### .once()
  Same as .on, but triggers only one time.

#### .off([event|String, callback|Function ])
  Stop listening for an event which you previously subscribed to, or all of them when you don't pass any argument to .off

#### .ref()
  Returns the raw Firebase reference object.

### .remove([ removeLocal|Boolean ])
  Removes the Firebase listeners, so the value stored in ```$data``` is no longer updated.
  If ```removeLocal``` is set to ```true```, it completely ```$delete```s the keypath from the view model.

