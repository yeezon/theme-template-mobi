
// Polyfill
import 'intersection-observer'
import SmoothScroll from 'smoothscroll-polyfill'

import Vue from 'vue'

import './libs/initEnv' // 初始化环境
import './libs/initDevData' // 初始化开发数据
import getEnv from './libs/getEnv'
import initCSSVar from './libs/initCSSVar'
import initWeChatShare from './libs/initWeChatShare'

import './icons' // Icons，后面优化成用 Vue.use
import './styles/index.css'

// SDKs
import './vendors/jssdk'

import App from './App.vue'
import router from './router'
import store from './store'
// import './registerServiceWorker'

// import YouUI from './../../you-ui/src/main.js'
import YouUI from './you-ui'
import SomeComponents from './components'
import Filters from './filters' // Filters

initCSSVar(window.$$settings) // 初始化 CSS 变量设置
initWeChatShare() // 初始化微信分享设置

SmoothScroll.polyfill()

Vue.config.productionTip = false

Vue.use(YouUI)
Vue.use(SomeComponents)
Vue.use(Filters)

const env = getEnv()

// 全局方法，先这样
Vue.prototype.$env = env
Vue.prototype.$sdk = (window.yhsd || {}).sdk || {}

window.$$app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// Safari Mobile 默认不使用`:active`状态，除非元素上或`<body>`上有一个`touchstart`事件处理器
window.document.addEventListener('touchstart', function () { }, { passive: true })

if (env.isSafari) {
  // 修复 100vh 不变动问题
  const eHTML = window.document.documentElement

  eHTML.style.setProperty('--100vh', `${window.innerHeight}px`)

  window.document.addEventListener('resize', function () {
    eHTML.style.setProperty('--100vh', `${window.innerHeight}px`)
  }, { passive: true })
}
