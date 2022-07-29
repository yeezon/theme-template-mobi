
export default function () {
  const isWeChat = /micromessenger/i.test(window.navigator.userAgent)
  const hasWxSDK = (window.$$shop || {}).enable_weixin_sdk || false
  const _wx = window.wx || null

  window.$$updateWeChatShareInfo = function (oInfo) {
    // console.log('设置微信分享信息', oInfo)

    if (isWeChat && _wx && hasWxSDK) {
      // 一般使用 oInfo 内的信息，避免路由切换导致相关处理复杂
      oInfo = oInfo || {}

      const getShareInfo = function (type) {
        const _title = oInfo.title || window.document.title || ''
        const _desc = oInfo.desc || window.document.querySelector('meta[name="description"]').content || ''
        const _link = oInfo.link || window.location.href || ''
        const _imgUrl = (oInfo.imgUrl || window.document.querySelector('meta[property="og:image"]').content || '').replace(/^\/\//, 'https://')

        return {
          title: _title,
          desc: _desc,
          link: _link,
          imgUrl: _imgUrl,
          success: function () {},
          cancel: function () {}
        }
      }

      _wx.ready(function () {
        _wx.updateTimelineShareData(getShareInfo('timeline'))
        _wx.updateAppMessageShareData(getShareInfo('frends'))
        _wx.onMenuShareWeibo(getShareInfo('weibo'))

      // _wx.checkJsApi({
      //    jsApiList: ['updateTimelineShareData', 'updateAppMessageShareData'], // 需要检测的 JS 接口列表
      //    success: function(res) {
      //      // alert(JSON.stringify(res))
      //      // 以键值对的形式返回，可用的 api 值 true，不可用为 false
      //      // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
      //   }
      // })
      })

    // _wx.error(function(res){
    //   alert(JSON.stringify(res))
    //   // config 信息验证失败会执行 error 函数，如签名过期导致验证失败，具体错误信息可以打开 config 的 debug 模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    // })
    }
  }

  if (isWeChat && _wx && hasWxSDK) {
    window.fetch(`/api/v1/third_api/weixin_signature?url=${window.encodeURIComponent(window.location.href)}`, {
      method: 'GET',
      // headers: {
      //   'Content-Type': 'application/json'
      // },
      credentials: 'include'
    }).then(oRes => {
      return oRes.json()
    }).then(oData => {
      if ((oData || {}).code === 200) {
        _wx.config({
          debug: false,
          appId: oData.config.appid,
          timestamp: oData.config.timestamp,
          nonceStr: oData.config.noncestr,
          signature: oData.config.signature,
          jsApiList: [
            'updateTimelineShareData',
            'updateAppMessageShareData',
            'onMenuShareWeibo'
          ]
        })

        window.$$updateWeChatShareInfo()
      }
    }).catch(oError => {
      // console.log(oError)
    })
  }
}
