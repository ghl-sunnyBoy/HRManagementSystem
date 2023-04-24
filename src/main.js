import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
// 导入自定义指令
import '@/directives'
// 图标库
import '@/assets/iconfontCss/iconfont.css'
// 国际化
import i18n from '@/lang/index'
// 字体
import '@/assets/text/text.css'
// 彩色图标
import '@/assets/icon/iconfont.js' // 引入阿里巴巴图标库js
import '@/assets/icon/iconfont.css'// 引入阿里巴巴图标库css
// 强制刷新
// Vue.forceUpdate()
// 阿里巴巴动态图标
import lottie from 'vue-lottie'
Vue.component('lottie', lottie)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
