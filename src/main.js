import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from "pinia";
import './styles.css'

const app = createApp(App);

const pinia = createPinia();
app.use(pinia); // ⚠️ bunu unutursan store çalışmaz

app.mount("#app");
