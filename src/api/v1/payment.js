
import request from '../request'

export function info (oConfig = {}) {
  return request({
    url: `/customer/h5_go_pay/${oConfig.id || null}`,
    method: 'get',
    params: (delete oConfig.id ? oConfig : oConfig) // 强迫症
  })
}

export default {
  info
}
