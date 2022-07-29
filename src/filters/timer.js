
const timer = function (time, format = 'HH:mm:ss') {
  let _res = ''

  if (time) {
    // 天数
    if (time >= 86400000) {
      _res = Math.floor(time / 86400000) + ' 天 '
    }

    // 时数
    if (time >= 3600000) {
      _res = _res + Math.floor((time % 86400000) / 3600000) + ':'
    }

    // 分数
    if (time >= 60000) {
      let _m = Math.floor((time % 3600000) / 60000)
      _m = '0' + _m
      _res = _res + _m.substring(_m.length - 2) + ':'
    }

    // 秒数
    if (time >= 1000) {
      let _s = Math.floor((time % 60000) / 1000)
      _s = '0' + _s
      _res = _res + _s.substring(_s.length - 2)
    }
  }

  return _res
}

export default timer
