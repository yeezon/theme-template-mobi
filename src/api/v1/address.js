
import request from '../request'

export function items () {
  return request({
    url: '/customer/address',
    method: 'get'
  })
}

export function item (id) {
  id = id === 0 ? 0 : (id || null) // 默认 null 不会是 ID，返回当前路由正常业务错误

  return request({
    url: `/customer/address/${id}`,
    method: 'get'
  })
}

export function create (oConfig) {
  return request({
    url: '/customer/address',
    method: 'post',
    data: oConfig
  })
}

export function update (oConfig = {}) {
  return request({
    url: `/customer/address/${oConfig.id}`,
    method: 'put',
    data: (delete oConfig.id ? oConfig : oConfig) // 强迫症
  })
}

export function remove (id) {
  id = id === 0 ? 0 : (id || null) // 默认 null 不会是 ID，返回当前路由正常业务错误

  return request({
    url: `/customer/address/${id}`,
    method: 'delete'
  })
}

export function area (lang = 'zh-CN') {
  return request({
    url: `${window.location.origin}/data/area/${lang}.json`,
    method: 'get'
  })
}

export default {
  items,
  item,
  create,
  update,
  remove,
  area
}
