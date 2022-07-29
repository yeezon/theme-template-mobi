
import request from '../request'

export function item (id) {
  id = id === 0 ? 0 : (id || null) // 默认 null 不会是 ID，返回当前路由正常业务错误

  return request({
    url: `/site_collection/${id}`,
    method: 'get'
  })
}

export default {
  item
}
