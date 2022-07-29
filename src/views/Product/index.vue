<docs>
## ProductView Docs

* 顶层记得`v-if="oPro.handle"`
  * 避免`<YuSlides>`报错
  * 避免首次访问内部运行两次
* JSSDK v2 出来后用 Promise.all() 优化代码逻辑
</docs>

<template>
<div :key="oPro.handle" class="product-view">
  <div class="bar">
    <yu-button class="bar_back" type="text" @click="fnBack">
      <YuIcon class="bar_back_icon" name="t-icon-back" slot="icon" />
    </yu-button>
  </div>
  <div class="status-bar"></div>
  <template v-if="oPro.handle && !isLoading">
      <YuSlides class="slides">
        <img v-for="oImg in oPro.images" :key="oImg.id" :src="oImg.src | imgURL('375x375')" slot="item" @click="fnImageZoom" />
      </YuSlides>
      <div class="info">
        <s-seckill v-if="nDiscountType === 1" :product="oPro" :sku="getNowSku(oNowSku.id)" :marketing="oMarketing" @start="fnDiscountStart" @end="fnDiscountEnd" @discount-handle="setDiscountHandle"></s-seckill>
        <s-limit v-else-if="nDiscountType === 2" :product="oPro" :sku="getNowSku(oNowSku.id)" :marketing="oMarketing" @start="fnDiscountStart" @end="fnDiscountEnd" @discount-handle="setDiscountHandle"></s-limit>
        <s-presell v-else-if="nDiscountType === 10" :product="oPro" :sku="getNowSku(oNowSku.id)" :marketing="oMarketing" @start="fnDiscountStart" @end="fnDiscountEnd" @discount-handle="setDiscountHandle"></s-presell>
        <s-info v-if="!isDiscountStarted" :product="oPro" :sku="getNowSku(oNowSku.id)" :discounts="discounts"></s-info>
      </div>
      <s-tags class="tags"></s-tags>
      <div class="sku">
        <yu-cell class="sku_cont" v-if="optionsTip" :label="nowOptionsText || optionsTip" :is-link="true" @click="fnSkuChooser">
          <YuIcon class="sku_icon" slot="suffix" name="yu-icon-right" />
        </yu-cell>
      </div>
      <div class="cont" v-if="contHTML">
        <rich-text class="rich_text" :cont="contHTML"></rich-text>
      </div>
      <div class="footer_block"></div>
      <div class="buys">
        <div class="buys_items">
          <router-link class="home" to="/"><svg-icon class="home_icon" name="home"></svg-icon></router-link>
          <router-link class="cart" to="/cart"><cart-icon class="cart_icon"></cart-icon></router-link>
          <yu-button v-if="nDiscountType && !isDiscountStarted && oNowEventInfo.reserve_enable" class="buy" type="text" @click="fnSubscribe">
            <svg-icon class="clock_icon" name="clock"></svg-icon>
            <span>提醒我</span>
          </yu-button>
          <!-- 预售不能经过购物车 -->
          <yu-button v-if="nDiscountType !== 10" class="buy i-cart" type="text" @click="fnAddCart">加入购物车</yu-button>
          <yu-button v-if="!nDiscountType || isDiscountStarted || !oNowEventInfo.reserve_enable" class="buy" type="text" @click="fnBuyNow">立即购买</yu-button>
        </div>
        <YuHomeIndicator />
      </div>
  </template>
  <YuLoadTips :is-loading="isLoading" :is-empty="!oPro.handle" :is-error="!!errorTip" empty-text="没找到相关商品~" @retry="update" />
  <button class="contact" @touchstart="fnContact">
    <span class="contact_btn"><svg-icon class="contact_icon" name="contact"></svg-icon></span>
    <span class="contact_text">客服</span>
  </button>
</div>
</template>

<script>
import CartIcon from '@/components/Cart/Icon'
import RichText from '@/components/HTML/RichText'

import sInfo from './components/Info'
import sSeckill from './components/Info/Seckill'
import sLimit from './components/Info/Limit'
import sPresell from './components/Info/Presell'
import sTags from './components/Tags'

export default {
  name: 'ProductView',
  components: {
    CartIcon,
    RichText,
    sInfo,
    sSeckill,
    sLimit,
    sPresell,
    sTags
  },
  props: {
    handle: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      fnNavigateTo: ((window.wx || {}).miniProgram || {}).navigateTo || function () {},
      isLoading: false,
      errorTip: '',
      oPro: {},
      oNowSku: {},
      oSkuMap: {},
      discounts: [],
      oMarketing: {},
      oEventSkuMap: {},
      variants: [],
      options: [],
      optionsTip: '',
      nowOptionsText: '',
      isDiscountStarted: false,
      nQuantity: 1, // 初始化需重置
      isBackHome: false
    }
  },
  computed: {
    nDiscountType () {
      return ((this.oEventSkuMap || {})[(this.oNowSku || {}).id] || {}).c_id || null
    },
    oEventSku () {
      return (this.oEventSkuMap || {})[(this.oNowSku || {}).id] || {}
    },
    oNowEventInfo () {
      const _oEventSku = this.oEventSkuMap[(this.oNowSku || {}).id] || {}
      const _oNowEventInfo = ((this.oMarketing || {}).info || {})[_oEventSku.c_id || null] || {}

      return _oNowEventInfo
    },
    contHTML () {
      const _oPro = this.oPro || {}
      let _cont = ''

      if (this.$env.isMobi) {
        _cont = _oPro.mobile_content_html || _oPro.content_html || ''
      } else {
        _cont = _oPro.content_html
      }

      return _cont
    }
  },
  watch: {
    handle () {
      this.init()
    },
    oPro () {
      this.initPro()
      this.initEventSkuMap() // 待优化，Promise.all()
      this.setShareInfo()
    },
    oNowSku (oVal) {
      // oNowSku 可能只有 id 内容
      const _oNowSku = this.oSkuMap[oVal.id] || {}

      if (_oNowSku.option_1 || _oNowSku.option_2 || _oNowSku.option_3) {
        this.nowOptionsText = `已选择：${_oNowSku.option_1} ${_oNowSku.option_2} ${_oNowSku.option_3}`
      } else {
        this.nowOptionsText = ''
      }
    },
    oMarketing (oVal) {
      this.initEventSkuMap()
    }
  },
  beforeRouteLeave (to, from, next) {
    this.isBackHome = false

    next()
  },
  created () {
    this.init()
    this.setShareInfo()
  },
  methods: {
    init () {
      this.nQuantity = 1
      this.update()
    },
    initPro () {
      this.isDiscountStarted = false

      this.initSku()
      this.initSkuMap()
      this.initOptions()
    },
    initSku () {
      // 初始化，缓存需要刷新
      this.oNowSku = {}
    },
    initSkuMap () {
      const oNewSkuMap = {}
      for (const oSku of (this.oPro.variants || [])) {
        oNewSkuMap[oSku.id] = oSku
      }
      this.oSkuMap = oNewSkuMap
    },
    initEventSkuMap () {
      const _oEventSkuMap = {}
      let _nNowSkuID = window.parseInt(this.$route.query.variant_id) || null // 路由指定 SKU

      for (const oItem of ((this.oMarketing || {}).variants || [])) {
        _oEventSkuMap[oItem.variant_id] = oItem

        // 默认选中特价活动 SKU ID
        if (!_nNowSkuID && (oItem.c_id === 1 || oItem.c_id === 2 || oItem.c_id === 3 || oItem.c_id === 10)) {
          _nNowSkuID = oItem.variant_id || null
        }
      }

      this.oEventSkuMap = _oEventSkuMap

      // 默认选中 SKU
      if (_nNowSkuID && (this.oNowSku.id !== _nNowSkuID)) {
        this.oNowSku = {
          id: _nNowSkuID
        }
      }
    },
    initOptions () {
      let newOptions = ''

      for (const oOpt of (this.oPro.options || [])) {
        newOptions += `${oOpt.name} `
      }

      if (newOptions) {
        newOptions = '请选择：' + newOptions
      }

      this.optionsTip = newOptions || ''
    },
    update () {
      this.getPro()
      this.getDiscount()
    },
    setShareInfo () {
      const _oPro = this.oPro || {}

      if (_oPro.id) {
        const _title = _oPro.page_title || _oPro.name || ''
        const _desc = _oPro.page_desc || _oPro.short_desc || ''
        const _link = window.location.href
        const _imgUrl = (_oPro.share_image || {}).src || (_oPro.feature_image || {}).src || ''

        window.document.title = _title
        window.document.querySelector('meta[name="description"]').content = _desc

        window.document.querySelector('meta[property="og:title"]').content = _title
        window.document.querySelector('meta[property="og:description"]').content = _desc
        window.document.querySelector('meta[property="og:image"]').content = _imgUrl

        window.$$updateWeChatShareInfo({
          title: _title,
          desc: _desc,
          link: _link,
          imgUrl: _imgUrl
        })
      }
    },
    getPro () {
      const _handle = this.handle || ''

      if (_handle) {
        this.isLoading = true
        this.errorTip = ''

        this.$sdk.product.get(_handle, oRes => {
          oRes = oRes.res || {}

          if (oRes.code === 200) {
            this.oPro = oRes.product || {}
          } else {
            this.errorTip = '获取商品数据失败'
          }

          this.isLoading = false
        })
      } else {
        this.errorTip = ''
        this.oPro = {}
      }
    },
    getDiscount () {
      const _handle = this.handle

      if (_handle) {
        // this.isLoading = true
        this.$sdk.discount.matchProduct(_handle, data => {
          this.discounts = data.res.discounts || []
          this.oMarketing = data.res.marketing || {}

          // this.isLoading = false
        })
      }
    },
    getNowSku (id) {
      return (this.oSkuMap[id] || {})
    },
    fnDiscountEnd () {
      this.$confirm({
        title: '活动提示',
        msg: '活动已结束'
      }).then(() => {
        this.isDiscountStarted = false

        // 重新获取最新活动状态
        this.getDiscount()
      }).catch(() => {
        // 取消分支
      })
    },
    fnDiscountStart () {
      this.isDiscountStarted = true
    },
    fnSkuChange (oItem, oItemOld) {
      // 切换 SKU 后，需要重置 isDiscountStarted
      if (this.oNowSku.id !== oItem.variant_id) {
        this.isDiscountStarted = false
      }

      this.oNowSku = (this.oSkuMap[oItem.variant_id] || {})
      this.nQuantity = oItem.quantity
    },
    fnSkuChooser () {
      this.$skuChooser.on({
        product: this.oPro,
        sku: this.oNowSku.id,
        quantity: this.nQuantity,
        marketing: this.oMarketing,
        confirm: (oItem, oItemOld) => {
          this.$skuChooser.close()
          this.fnSkuChange(oItem, oItemOld)
        }
      })
    },
    setDiscountHandle (handle) {
      this.discountHandle = handle
    },
    fnBack () {
      this.isBackHome = true

      this.$router.back()

      window.setTimeout(() => {
        if (this.isBackHome) {
          this.$router.push('/')
        }
      }, 100)
    },
    fnAddCart () {
      if (!this.oPro.handle) return

      const _variants = this.oPro.variants || []
      let nSku = this.oNowSku.id
      if (!nSku && _variants.length === 1) {
        nSku = _variants[0].id || null
      }
      this.$skuChooser.on({
        // productId: this.oPro.handle,
        product: this.oPro,
        sku: nSku,
        quantity: this.nQuantity,
        marketing: this.oMarketing,
        autoType: 'add_cart',
        addCart: true,
        buyNow: false
      })
    },
    fnBuyNow () {
      if (!this.oPro.handle) return

      const _variants = this.oPro.variants || []
      let nSku = this.oNowSku.id
      if (!nSku && _variants.length === 1) {
        nSku = _variants[0].id || null
      }

      this.$skuChooser.on({
        // productId: this.oPro.handle,
        product: this.oPro,
        sku: nSku,
        quantity: this.nQuantity,
        marketing: this.oMarketing,
        autoType: 'buy_now',
        addCart: false,
        buyNow: true
      })
    },
    fnImageZoom (evt) {
      const eNow = evt.target

      if (eNow.requestFullscreen) {
        eNow.requestFullscreen()
      } else if (eNow.webkitRequestFullscreen) {
        eNow.webkitRequestFullscreen()
      }
    },
    fnContact () {
      const _env = this.$env || {}

      if (_env.isWeApp) {
        this.fnNavigateTo({
          url: '/pages/contact/index'
        })
      } else {
        const _oSetting = window.$$settings || {}

        if (_oSetting.contact_url) {
          window.location.href = _oSetting.contact_url
        } else {
          window.alert(_oSetting.contact_qr_code_desc || '无相关配置信息')
        }
      }
    },
    fnSubscribe () {
      const _handle = this.handle || ''
      const _discountHandle = this.oNowEventInfo.handle || ''
      const nMpID = (this.oEventSku || {}).mp_id || null

      if (_handle && _discountHandle && nMpID) {
        const cont = window.prompt('请输入手机号', '')

        if (this.$sdk.util.isMobile(cont)) {
          window.fetch(`/api/v1/marketing/${_discountHandle}/reserves`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              mp_id: nMpID,
              mobile_phone: cont,
              p_handle: _handle
            })
          })
            .then(function (oRes) {
              return oRes.json()
            })
            .then(function (oData) {
              if ((oData || {}).code === 200) {
                window.alert('订阅成功')
              } else {
                window.alert('订阅失败')
              }
            })
            .catch(oError => {
              window.alert('订阅失败')
              // window.console.log(oError)
            })
        } else if (cont) {
          window.alert('请输入正确手机号')
        }
      } else {
        window.alert('请选择属性')
      }
    }
  }
}
</script>

<style scoped>
.product-view {
  box-sizing: content-box;
  padding: 0 0 calc(48px + var(--homeIndicator));
  overflow: hidden;
  background-color: var(--backgroundColor);
}
.bar {
  position: fixed;
  top: var(--statusBar);
  width: 100%;
  z-index: 1;
}
.bar_back {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, .35);
  width: 40px;
  height: 40px;
  color: #fff;
  text-align: center;
}
.bar_back:active {
  color: #fff;
  opacity: .8;
}
.bar_back {
  top: 14px;
  left: 14px;
}
.bar_back_icon {
  width: 30px;
  height: 30px;
}

.status-bar {
  width: 100%;
  height: var(--statusBar);
  background-color: #fff;
}

.slides {
  background-color: #fff;
}

.info {
  padding: 0 15px 20px;
  background-color: #fff;
}

.tags {
  padding: 0 15px 10px;
  background-color: #fff;
}

.sku {
  overflow: hidden;
  margin: 0 0 10px;
  padding: 0 0 15px;
  background-color: #fff;
}
.sku_cont {
  margin: 0 15px;
  border: var(--1px) solid #e1e3e7;
  border-radius: 4px;
  box-shadow: 0 0 3px 0 rgba(96, 109, 143, 0.1);
  color: #262626;
}
.sku_cont >>> .yu-cell-hr {
  display: none;
}
.sku_cont >>> .yu-cell-inner {
  padding: 12px 18px;
}
.sku_icon.yu-icon {
  color: #b3b3b3;
  width: 10px;
  height: 10px;
}

.many {
  margin: 0 0 10px;
}

.cont {
  margin: 0 0 10px;
  padding: 15px;
  overflow: hidden;
  background-color: #fff;
}
.rich_text {
  overflow: hidden;
  width: 100%;
}

.buys {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  background-color: #fff;
}
.buys_items {
  display: flex;
  height: 47px;
  border: 0 solid #e0e0e0;
  border-width: var(--1px) 0;
}
.buys >>> .yu-btn {
  border-radius: 0;
}
.buys >>> .yu-btn + .yu-btn {
  margin-left: 0;
}
.buys >>> .yu-btn:active {
  opacity: .8;
}
.buy {
  flex: 1;
  background-color: #fb544e;
  color: #fff;
}
.buy:active {
  color: #fff;
}
.buy.i-cart {
  background-color: #fdac39;
}
.clock_icon {
  display: inline-block;
  margin: 0 5px 0 0;
  font-size: 16px;
}
.home {
  display: inline-flex;
  width: 58px;
  border: 0 solid #e0e0e0;
  border-width: 0 var(--1px) 0 0;
  background-color: #fff;
  color: #9f9f9f;
}
.home:active {
  border-color: #e0e0e0;
  color: #9f9f9f;
  opacity: .8;
}
.home_icon {
  margin: auto;
  font-size: 25px;
}
.contact {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  right: 15px;
  bottom: calc(var(--tabBar) + var(--homeIndicator) + 15px);
  padding: 6px 10px 8px;
  border: 0 solid #e0e0e0;
  border-radius: 5px;
  border-width: var(--1px);
  background-color: #fff;
  color: #9f9f9f;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}
.contact:active {
  border-color: #e0e0e0;
  color: #9f9f9f;
  opacity: .8;
}
.contact_btn {
  display: flex;
  padding: 0;
  border: none;
  pointer-events: none;
}
.contact_icon {
  margin: auto;
  font-size: 25px;
}
.contact_text {
  margin: 3px 0 0;
  font-size: 11px;
  pointer-events: none;
}
.cart {
  display: inline-flex;
  width: 58px;
  background-color: #fff;
  color: #9f9f9f;
}
.cart:active {
  color: #9f9f9f;
  opacity: .8;
}
.cart_icon {
  margin: auto;
  width: 24px;
  height: 24px;
}

.footer_block {
  height: calc(var(--tabBar) + var(--homeIndicator));
  background-color: #fff;
}
</style>
