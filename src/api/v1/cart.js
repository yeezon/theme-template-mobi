
import request from '../request'

export function items () {
  return request({
    url: '/customer/cart',
    method: 'get'
  })
}

export function create (oConfig) {
  return request({
    url: '/customer/cart',
    method: 'post',
    data: oConfig
  })
}

export function update (oConfig = {}) {
  return request({
    url: `/customer/cart/${oConfig.id}`,
    method: 'put',
    data: (delete oConfig.id ? oConfig : oConfig) // 强迫症
  })
}

export function remove (id) {
  id = id === 0 ? 0 : (id || null) // 默认 null 不会是 ID，返回当前路由正常业务错误

  return request({
    url: `/customer/cart/${id}`,
    method: 'delete'
  })
}

export function checkAll () {
  return request({
    url: '/customer/cart_check_all',
    method: 'get'
  })
}

export function uncheckAll () {
  return request({
    url: '/customer/cart_uncheck_all',
    method: 'get'
  })
}

export function count () {
  return request({
    url: '/customer/cart_count',
    method: 'get'
  })
}

export default {
  items,
  create,
  update,
  remove,
  checkAll,
  uncheckAll,
  count
}
