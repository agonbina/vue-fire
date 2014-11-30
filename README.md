**WIP** vue-fire
============
Sync a $data path of a Vue.js view model with a Firebase reference.

## Usage
```
npm install --save vue-fire
```

## Example
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

  .setValue return a [```FirebaseValue```](#getkeystring) instance.

### .setArray([ firebaseKey|String ], setter|Function)
  Creates an array with the reference key in $data and attaches listeners
  on the Firebase list events(child_added, child_removed, child_moved, child_changed).

```js
  vm.$firebase.setArray('crazyPeople', function(root) {
    return root.child('people').orderByChild('crazinessFactor').equalTo('100');
  }) // vm.crazyPeople now updates as the data in the given query changes/moves
```

### .get(keyPath|String)
  Returns a FirebaseValue or FirebaseArray.

  From the example above:
  ```
  vm.$firebase.get('people')
  vm.$firebase.get('presence')
  vm.$firebase.get('name')
  ```

  The returned object is an [Event Emitter](https://github.com/component/emitter) and has the following API:

#### .on(event|String, callback|Function)
  For FirebaseValue, you can listen on the ```'value'``` event if you need to get a hold off the raw ```snapshot```, or
  the ```'value:error'``` event which fires when there is an error in the syncing from Firebase.
  ```js
  var isOnline = vm.$firebase.get('isOnline')

  isOnline.on('value', function(snapshot) { })
  isOnline.on('value:error', function(error) { })
  ```

#### .off(event|String, [ callback|Function ])
  Stop listening for an event which you

#### .ref()
  Returns the raw Firebase reference object.

### .remove([ removeLocal|Boolean ])
  Removes the Firebase listeners, so the value stored in ```$data``` is no longer updated.
  If ```removeLocal``` is set to ```true```, it completely ```$delete```s the keypath from the view model.

