var Vue = require('vue');
var vueFire = require('../..');

Vue.use(vueFire, { app: 'ovally' });

var appOptions = require('./app');
window.app = new Vue(appOptions).$mount('#app');