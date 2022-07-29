<docs>
## ProductShare Docs
</docs>

<template>
<div class="product-share" :class="{ 'i-show': isShow }" @click="fnClick">
  <svg-icon class="icon" name="product-share"></svg-icon>
  <div class="text">分享</div>
</div>
</template>

<script>
export default {
  name: 'ProductShare',
  props: {
    shareUrl: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      default: null
    },
    imgUrl: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isShow: false
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.isShow = !!(this.$env || {}).isWeApp
    },
    fnClick () {
      const _env = this.$env || {}

      if (_env.isWeApp) {
        // 跳转到小程序分享
        window.wx && window.wx.miniProgram.navigateTo({
          url: '/pages/share/index?config=' + this.getConfig()
        })
      } else if (_env.isSafari) {
        window.alert('请点击下方菜单分享')
      } else {
        window.alert('请点击右上角菜单分享')
      }
    },
    getConfig () {
      const nWidth = 750
      const nHeight = 950
      const nProWidth = 690
      const nProHeight = 690

      const proURL = this.shareUrl || window.location.href || ''
      const proTitle = this.title || ''
      const proPrice = '￥' + (window.parseInt(this.price)).toFixed(2) || '-'
      let proImg = this.imgUrl || 'https://asset.ibanquan.com/image/53f649ffe2931e0b91000007/s.png'

      if (!(/^http/ig.test(proImg))) {
        proImg = window.location.protocol + proImg
      }

      function fnShareTitleHandle (title) {
        const titleLength = 18
        const forCnt = parseInt(title.length / titleLength, 10) + (title.length % titleLength ? 1 : 0)
        const tmpAry = []

        for (let i = 0; i < forCnt; i++) {
          tmpAry.push(title.slice(i * titleLength, i * titleLength + 18))
        }

        return tmpAry.join(' ')
      }

      const oConfig = {
        info: {
          title: proTitle,
          url: proURL,
          image: proImg
        },
        image: {
          width: nWidth,
          height: nHeight,
          elements: [
            {
              type: 'fillRect',
              color: '#ffffff',
              width: nWidth,
              height: nHeight,
              x: 0,
              y: 0
            },
            {
              type: 'image',
              url: proImg,
              path: '',
              width: nProWidth,
              height: nProHeight,
              x: (nWidth - nProWidth) / 2,
              y: 30
            },
            {
              type: 'qrcode',
              text: proURL,
              path: proURL,
              width: 175,
              height: 175,
              x: nWidth - 175 - 30,
              y: nHeight - 175 - 30
            },
            {
              type: 'text',
              text: fnShareTitleHandle(proTitle),
              color: '#000000',
              font_weight: 'normal',
              text_align: 'left',
              font_family: 'SWISSCB',
              font_size: 28,
              x: 30,
              y: nHeight - 32 * 4.5
            },
            // {
            //   type: 'text',
            //   text: proType,
            //   color: '#555',
            //   font_weight: 'normal',
            //   text_align: 'left',
            //   font_family: 'SWISSCB',
            //   font_size: 23,
            //   x: 30,
            //   y: nHeight - 32 * 3.2
            // },
            {
              type: 'text',
              text: proPrice,
              color: 'red',
              font_weight: 'bold',
              text_align: 'left',
              font_family: 'SWISSCB',
              font_size: 36,
              x: 30,
              y: nHeight - 32 * 1.5
            }
          ]
        }
      }
      return window.encodeURIComponent(JSON.stringify(oConfig))
    }
  }
}
</script>

<style scoped>
.product-share {
  /* display: flex; */
  display: none;
  flex-direction: column;
  align-items: center;
  margin: 3px 5px 0 0;
}
.product-share.i-show {
  display: flex;
}
.icon {
  display: block;
  color: #595959;
  font-size: 20px;
}
.text {
  display: inline-block;
  margin: 3px 0 0;
  font-size: 11px;
  color: #595959;
}
</style>
