
// BUGs
// * 报错 - /account => /account/orders - Uncaught (in promise) NavigationDuplicated
// * Uncaught (in promise) Error - 未登陆 /products/xxx => /account/create_order => /account/login / isSigned 放路由独享的守卫？

// 后面再把 window.$$app 改了

import Vue from 'vue'
import store from '@/store'

// 获取网站默认信息
const eSiteDesc = (window.document.querySelector('meta[name="description"]') || {})

const eOgTitle = (window.document.querySelector('meta[property="og:title"]') || {})
const eOgDesc = (window.document.querySelector('meta[property="og:description"]') || {})
const eOgImage = (window.document.querySelector('meta[property="og:image"]') || {})

const DEF_SITE_TITLE = window.document.title || ''
const DEF_SITE_DESC = eSiteDesc.content || ''

const DEF_OG_TITLE = eOgTitle.content || ''
const DEF_OG_DESC = eOgDesc.content || ''
const DEF_OG_IMAGE = eOgImage.content || ''

export function beforeEach (to, from, next) {
  if (/^\/(coupon)/.test(to.path)) {
    const _location = window.location
    if (_location.href.replace(_location.origin, '') !== to.fullPath) {
      _location.href = to.fullPath
    } else {
      next()
    }
  } else {
    // 判断鉴权路由
    if (store.state.account.isChecked) {
      if (store.state.account.isSigned) {
        next()
      } else {
        if (to.meta.isAuth) {
          next({
            path: '/account/login',
            query: {
              redirect_url: to.fullPath // 后端用的是 redirect_back_url，后面看看修改或兼容下
            }
          })
        } else {
          next()
        }
      }
    } else {
      store.dispatch('account/getAccountInfo').then(({ data }) => {
        next()
      }).catch(oError => {
        if (to.meta.isAuth) {
          next({
            path: '/account/login',
            query: {
              redirect_url: to.fullPath // 后端用的是 redirect_back_url，后面看看修改或兼容下
            }
          })
        } else {
          next()
        }
      })
    }
  }
}

export function beforeResolve (to, from, next) {
  next()

  // 兼容路由变化
  const $$app = window.$$app
  if ($$app) {
    $$app.$toast && $$app.$toast.off()
    $$app.$skuChooser && $$app.$skuChooser.off()
  }

  // 重置分享信息
  // 设置请到业务相关层处理
  window.document.title = to.meta.title || DEF_SITE_TITLE || DEF_OG_TITLE

  eSiteDesc.content = DEF_SITE_DESC

  eOgTitle.content = window.document.title
  eOgDesc.content = DEF_OG_DESC
  eOgImage.content = DEF_OG_IMAGE

  window.$$updateWeChatShareInfo({
    title: window.document.title,
    desc: DEF_OG_DESC,
    link: window.location.href,
    imgUrl: DEF_OG_IMAGE
  })
}

// 页面落地加载标记
let hasInit = false

export function afterEach (to, from) {
  if (hasInit) {
    // 上报 MTA，在 DOM 更新后
    // 路由跳转是异步，这时直接上报的是旧地址
    Vue.nextTick(() => {
      window.MtaH5 && window.MtaH5.pgv()
    })
  } else {
    hasInit = true
  }
}

export default {
  beforeEach,
  beforeResolve,
  afterEach
}
