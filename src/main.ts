import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

app.mount('#app')

// Initialize i18n after mount
import { useI18nStore } from './stores/i18nStore'
const i18nStore = useI18nStore()
i18nStore.initLanguage()
