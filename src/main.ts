import { createApp } from 'vue'

import store from "@/app/stores";
import App from './App.vue'
// import router from './router'

import './assets/index.css'
import './assets/main.scss'

// import './firebase';

// window['$__pinia'] = pinia;
const app = createApp(App)

app.use(store);
// app.use(router);

app.mount('#app')
