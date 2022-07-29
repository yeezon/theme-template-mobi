
import request from '../request'

export function info () {
  return request({
    url: '/site_config',
    method: 'get'
  })
}

export default {
  info
}
