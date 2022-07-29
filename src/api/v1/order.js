
import request from '../request'

export function items (oConfig) {
  return request({
    url: '/customer/orders',
    method: 'get',
    params: oConfig
  })
}

export function item (id) {
  id = id === 0 ? 0 : (id || null) // 默认 null 不会是 ID，返回当前路由正常业务错误

  return request({
    url: `/customer/order/${id}`,
    method: 'get'
  })
}

export function create (oConfig) {
  return request({
    url: '/customer/order',
    method: 'post',
    data: oConfig
  })
}

export function cancel (id) {
  return request({
    url: `/customer/order_cancel/${id || null}`,
    method: 'post',
    data: {}
  })
}

export function confirm (id) {
  return request({
    url: `/customer/order_confirm_express/${id || null}`,
    method: 'get'
  })
}

export function counts () {
  return request({
    url: '/customer/order_count',
    method: 'get'
  })
}

export default {
  items,
  item,
  create,
  cancel,
  confirm,
  counts
}
