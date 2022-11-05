import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import axios from 'axios'
import VueAxios from 'vue-axios'


loadFonts()
//const pinia = createPinia()
//axios.defaults.withCredentials = true;
//axios.defaults.headers.common['Authorization'] = 'Bearer 30|vQrZTl3EVWYPCqSqEHxOQPkm1FI4Q3uT2XcFOYkj';
createApp(App)
  .use(createPinia())
  .use(router)
  .use(VueAxios, axios)
  .use(vuetify)
  .mount('#app')
