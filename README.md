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

### .setValue(ref|Firebase)
  Creates a new keypath in ```$data``` with the ```.key()``` of the Firebase ```ref```.
  Attaches a listener on the ```'value'``` event and updates the value stored in the keypath.

### .setArray(ref|Firebase)
  Creates an array with the reference key in $data and attaches listeners
  on the Firebase list events(child_added, child_removed, child_moved, child_changed).

```js
  vm.$firebase.setArray(function(root) {
    return root.child('people').orderByChild('crazinessFactor').equalTo('100%');
  })
```

### .remove(path|String, [ removeLocal|Boolean ])
  Removes the Firebase listeners for the given path, so the value stored in ```$data```
  is no longer updated.
  If ```removeLocal``` is set to ```true```, it ```$delete```s the keypath from the view model.

### .ref(path|String)
  Retrieve the Firebase ```ref``` instance previously specified in ```fb``` or during a ```.set*``` operation.
  Note: If the reference is a Firebase Query, ```.ref(path)``` will still return the reference to
  ```firebaseUrl/**path**``` and not the query instance that was passed in.