
import request from '../request'

export function items (oConfig) {
  return request({
    url: '/products',
    method: 'get',
    params: oConfig
  })
}

export function item (id) {
  id = id === 0 ? 0 : (id || null) // 默认 null 不会是 ID，返回当前路由正常业务错误

  return request({
    url: `/product/${id}`,
    method: 'get'
  })
}

export function likes (oConfig) {
  return request({
    url: '/farvirate',
    method: 'get',
    params: oConfig
  })
}

export default {
  items,
  item,
  likes
}
