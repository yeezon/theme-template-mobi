
import imgURL from './img_url'
import date from './date_time'
import timer from './timer'

const oFilters = {
  imgURL,
  date,
  timer
}

const install = function (Vue, options) {
  if (install.installed) return

  for (const key in oFilters) {
    const _fn = oFilters[key]

    Vue.filter(key, _fn)
  }

  install.installed = true
}

export default {
  install
}
