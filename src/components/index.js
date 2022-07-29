
import SkuChooserInit from './Sku'

const componentDefs = []

const install = function (Vue, options) {
  if (install.installed) return

  for (const oComDef of componentDefs) {
    Vue.component(oComDef.name, oComDef)
  }

  // 放在后面，避免引用了还没注册的组件报错
  Vue.prototype.$skuChooser = SkuChooserInit(Vue)

  install.installed = true
}

export default {
  install
}
