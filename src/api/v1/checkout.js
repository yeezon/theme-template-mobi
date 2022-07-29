
import request from '../request'

export function shipments (oConfig) {
  const oDef = {
    url: '/customer/pre_create_order',
    method: 'get'
  }

  if (Object.keys(oConfig || {}).length > 0) {
    oDef.method = 'put'
    oDef.data = oConfig || {}
  }

  return request(oDef)
}

export default {
  shipments
}
