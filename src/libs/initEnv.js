
const initEnv = function () {
  // Runtime PublicPath

  // eslint-disable-next-line
  __webpack_public_path__ = (((((window.document.currentScript || {}).src || '').match(/(.+\/)[^/]+\.js/) || [])[1]) || '').replace(/js\/$/, '') || '/'

  // eslint-disable-next-line
  // console.log('__webpack_public_path__ =>', __webpack_public_path__)
}

initEnv()

// export default initEnv
