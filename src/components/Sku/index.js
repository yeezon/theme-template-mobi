
// 组件用到 Vuex 的换类似 Auth 的方式？

import router from '@/router'
import store from '@/store'
import SkuChooserDef from './Chooser'

function Init (Vue) {
  // Todo DOMContentLoaded

  const isShadowDOM = false

  const eDiv = document.createElement('div')

  if (isShadowDOM) {
    eDiv.attachShadow({ mode: 'open' })
  }

  const VueExt = Vue.extend(SkuChooserDef)
  const vm = new VueExt({
    router,
    store,
    shadowRoot: eDiv.shadowRoot
  })

  vm.$mount()

  if (isShadowDOM) {
    eDiv.shadowRoot.appendChild(vm.$el)
  } else {
    eDiv.appendChild(vm.$el)
  }

  window.setTimeout(() => {
    window.document.body.appendChild(eDiv)
  }, 150)

  return vm
}

export default Init
