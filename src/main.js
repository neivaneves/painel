import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import 'leaflet/dist/leaflet.css'
import router from './router'
import store from './store'
import Vuex from 'vuex'

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  Vuex,
  store,
  render: h => h(App)
}).$mount('#app')
