vue-firebase
============
A mixin which enables syncing $data of a Vue.js view model with a Firebase reference.

## Usage
```
npm install --save vue-firebase-mixin
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
        root.child('status'),
        root.child('name')
      ]
    };
  }

});

app.$mount('#app');
```

This mixin attaches a ```$firebase``` property on the view model, which has the following API:

## API for vm.$firebase

### .$setValue([ keyPath|String ], firebaseKey|String)
  Creates a new keypath in view model with the ```firebaseKey``` or ```keyPath```(if specified) and listens on the
  ```'value'``` event to update the view model value as it changes in the ```firebaseKey``` Firebase location.

### .$setArray([ firebaseKey|String ], setter|Function)
  Creates an array with the reference key in $data and attaches listeners
  on the Firebase list events(child_added, child_removed, child_moved, child_changed).

```js
  vm.$firebase.setArray('crazyPeople', function(root) {
    return root.child('people').orderByChild('crazinessFactor').equalTo('100');
  }) // vm.crazyPeople now updates as the data in the given query changes/moves
```

### .$get(key|String)
  Every reference that is returned from the ```firebase``` option in the view model has a property within vm.$firebase.
  From the example above:
  ```
  vm.$firebase.$get('people')
  vm.$firebase.$get('presence')
  vm.$firebase.$get('name')
  ```

  The returned object has the following API:

#### .on(event|String, callback|Function)
#### .off(event|String, [ callback|Function ])
#### .ref()

### .remove([ removeLocal|Boolean ])
  Removes the Firebase listeners, so the value stored in ```$data``` is no longer updated.
  If ```removeLocal``` is set to ```true```, it ```$delete```s the keypath from the view model.

