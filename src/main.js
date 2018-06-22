// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // 带编译器版本，有template和components
  components: { App },
  template: '<App/>'
  // 不带编译器版本为:
  // render: h => h(App)
})
