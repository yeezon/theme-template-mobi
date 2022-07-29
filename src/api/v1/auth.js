
import request from '../request'

export function info () {
  return request({
    url: '/customer/info',
    method: 'get'
  })
}

export function smsCode (oConfig) {
  return request({
    url: '/customer/mobile_validate_code',
    method: 'get',
    params: oConfig
  })
}

export function signIn (oConfig) {
  return request({
    url: '/customer/mobile_login',
    method: 'put',
    data: oConfig
  })
}

export default {
  info,
  smsCode,
  signIn
}
