
const init = function () {
  // Configs
  // 缺省图跟着主题走
  window.productImage = '53f649ffe2931e0b91000007/noimage.png'
  window.vendorImage = '578fc93402282e4f18000003/noimage.png'
  window.iconImage = '57acb51702282e3f00000003/noimage.ico'
  window.shareImage = '57acb53a02282e3f00000007/noimage.png'
  window.assetPath = '//asset.ibanquan.com/image/'
  window.postImage = '581a3b0402282e2bcc000003/s.png'
  window.captchaPath = '//captcha.ibanquan.com'
  window.ajaxToken = ''

  // Settings
  window.$$shop = {}
  window.$$settings = {}

  // 测试阶段临时默认设置
  window.$$settings.SkSearchView_showProducts = true
  window.$$settings.SkSearchView_showPosts = true
  window.$$settings.SkSearchView_showBlogs = true
  // End 测试阶段临时默认设置
}

if (process.env.NODE_ENV !== 'production') init()

// export default init
