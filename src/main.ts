import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'vant/lib/index.css'
import 'uno.css'
import './styles/design-system.css'
import './styles/tokens.generated.css'
import './styles/global.css'

import App from './App.vue'
import router from './router'
import pinia from './stores'
import { installImageFallback } from './design/images'
import { useSettingsStore } from './stores/settings'
import { initAssets } from './utils/asset-db'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(ElementPlus)

installImageFallback(() => useSettingsStore().imageSource)

// 先把本地素材载入内存再挂载，保证 asset:// 引用首屏即可解析
initAssets().finally(() => app.mount('#app'))
