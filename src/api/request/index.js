import axios from 'axios'
import store from '@/store'

const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'https://supplier.youhaosuda.com/applet' : '/applet',
  withCredentials: true
})

// Request 拦截器
service.interceptors.request.use(oConfig => {
  oConfig.headers.HTTP_APPID = window.$$alias || ''

  return oConfig
}, oError => {
  return Promise.reject(oError)
})

// Respone 拦截器
service.interceptors.response.use(
  oRes => {
    const _oData = oRes.data || {}
    let _oError = new Error(_oData.errmsg || '处理失败')

    // errcode 为其他值，switch 参考值未被转成 null，走 default -> reject
    // switch 参考值被转成了 null，走 null -> resolve
    switch (_oData.errcode || null) {
      case 40000:
        // 业务错误，不劫持处理返回数据，业务代码做处理
        break
      case 40001: // 权限错误
        _oError = new Error('请登录后再操作')

        store.dispatch('account/clearAccount')

        // Current Account Info & Cart Count API 请求不做鉴权提示
        if (!/(\/applet\/customer\/info|\/applet\/customer\/cart_count)/.test(oRes.request.responseURL)) {
          // 需要路由层的 Popup - Login
          window.alert('请先登录')
        }
        break
      case null:
        return oRes
      default:
        // Promise Reject
        break
    }

    _oError.response = oRes // 注入 Response

    return Promise.reject(_oError)
  },
  oError => {
    const oRes = oError.response || {}
    let _oError = oError
    let isSetData = false // 特殊注入

    switch (oRes.status) {
      case 504:
        _oError = new Error('请求超时，请重试')
        isSetData = true

        break
      default:
        break
    }

    // 无重置 Error 则无需特殊注入
    if (isSetData) {
      _oError.response = oRes // 注入 Response
      _oError.origin = oError // 错误追溯
    }

    return Promise.reject(_oError)
  }
)

export default service
