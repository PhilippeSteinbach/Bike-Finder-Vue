import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import axios from 'axios'
import './registerServiceWorker'
import 'leaflet/dist/leaflet.css';
import moment from 'moment'

moment.locale('de')
Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.use(require('vue-moment'), {moment})

// Fix Leaflet marker icons not found
// eslint-disable-next-line  
delete L.Icon.Default.prototype._getIconUrl  
// eslint-disable-next-line  
L.Icon.Default.mergeOptions({  
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),  
  iconUrl: require('leaflet/dist/images/marker-icon.png'),  
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')  
}) // end fix

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')