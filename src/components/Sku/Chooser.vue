<docs>
## SkuChooser Docs

* 参考 You Kit 做优化
* 无需判断登录状态
  * AddCart 全局 API 鉴权和提示
  * BuyNow 直接到`/checkout`再做相关业务处理
</docs>

<template>
<div class="sku-chooser">
  <YuPopup :value="showPopup" @input="fnPopChange">
    <div class="box" v-if="showPopup">
      <div class="info">
        <div class="img_box" v-if="oNowSku.feature_image">
          <img v-if="oNowSku.feature_image" class="img" :src="oNowSku.feature_image.src | imgURL('172x172')" :alt="oNowSku.feature_image.image_name" />
        </div>
        <div class="img_box" v-else>
          <img v-if="oPro.images && oPro.images[0]" class="img" :src="oPro.images[0].src | imgURL('172x172')" :alt="oPro.name" />
        </div>
        <div class="pro">
          <div class="name">{{ oPro.name }}</div>
          <template v-if="oNowSku.id">
            <div class="prices">
              <yu-currency class="price" :val="nPrice"></yu-currency>
              <yu-currency v-if="nComparePrice > nPrice" class="price_src" :val="nComparePrice"></yu-currency>
            </div>
          </template>
          <template v-else>
            <div class="prices">
              <span class="price">
                <yu-currency :val="oPro.price_min"></yu-currency>
                <template v-if="oPro.price_min < oPro.price_max">
                  <span class="price_line">~</span>
                  <yu-currency :val="oPro.price_max"></yu-currency>
                </template>
              </span>
              <del class="price_src" v-if="oPro.compare_price_min < oPro.compare_price_max">
                <yu-currency :val="oPro.compare_price_max"></yu-currency>
              </del>
            </div>
          </template>
        </div>
        <YuButton v-if="oConfig.hasClose" class="close" type="text" @click="fnPopChange(false, 'close')">
          <YuIcon class="close_icon" name="yu-icon-close" slot="icon" />
        </YuButton>
      </div>
      <div v-if="(options || []).length" class="chooser">
        <YuScrollView class="scroll_view">
          <sku-options :sku-id="this.nNowSku" :skus="variants" :options="options" @change="fnSkuChange"></sku-options>
        </YuScrollView>
      </div>
      <div v-if="oConfig.hasAmount" class="num">
        <div class="num_label"><span>购买数量</span></div>
        <YuQuantity v-model="nNowQuantity" :max="nNowStock || nSumStock || 0" />
      </div>
      <div class="btns">
        <YuButton v-if="!oConfig.addCart && !oConfig.buyNow" class="btn i-confirm" type="primary" @click="fnConfirm">确定</YuButton>
        <YuButton v-if="oConfig.addCart" class="btn i-add_cart" type="primary" @click="fnAddCart">加入购物车</YuButton>
        <YuButton v-if="oConfig.buyNow" class="btn i-buy_now" type="primary" @click="fnBuyNow">立即购买</YuButton>
      </div>
      <YuHomeIndicator />
    </div>
  </YuPopup>
</div>
</template>

<script>
import Products from '@/api/v1/products'

import SkuOptions from './Options'

export default {
  name: 'SkuChooser',
  components: {
    SkuOptions
  },
  data () {
    return {
      oConfig: {
        product: {},
        productId: null,
        sku: null,
        quantity: 1,
        marketing: {},
        hasAmount: true,
        hasClose: true,
        autoType: '', // '' / 'add_cart' / 'buy_now'
        close: null, // 指定了，里面要自己 vm.off() / this.$skuChooser.close()
        confirm: null,
        addCart: null,
        buyNow: null
      },
      showPopup: false,
      oPro: {},
      oNowSku: {},
      oNowEventSku: {},
      oSkuMap: {},
      oMarketing: {},
      oEventSkuMap: {},
      variants: [],
      options: [],
      nNowSku: null,
      nSumStock: 0,
      nNowQuantity: 1
    }
  },
  computed: {
    oNowEventInfo () {
      const _oNowEventInfo = ((this.oMarketing || {}).info || {})[this.oNowEventSku.c_id || null] || {}

      return _oNowEventInfo
    },
    nNowStock () {
      let res = this.nSumStock

      if (this.nNowSku) {
        res = this.oNowSku.stock
      }
      return res
    },
    nPrice () {
      let _nPrice = this.oNowSku.price

      if (!/^(4|5|13)$/.test(this.oNowEventSku.c_id)) {
        const _oNowEventInfo = this.oNowEventInfo || {}
        const nNowTime = (new Date()).getTime()
        const nStartAt = (new Date(_oNowEventInfo.start_at)).getTime()
        const nEndAt = (new Date(_oNowEventInfo.end_at)).getTime() || null

        if ((nNowTime >= nStartAt) && ((nNowTime <= nEndAt) || (nEndAt === null))) {
          _nPrice = this.oNowEventSku.event_price
        }
      }

      return _nPrice
    },
    nComparePrice () {
      let _nPrice = this.oNowSku.compare_price || 0

      if (!/^(4|5|13)$/.test(this.oNowEventSku.c_id)) {
        const _oNowEventInfo = this.oNowEventInfo || {}
        const nNowTime = (new Date()).getTime()
        const nStartAt = (new Date(_oNowEventInfo.start_at)).getTime()
        const nEndAt = (new Date(_oNowEventInfo.end_at)).getTime() || null

        if ((nNowTime >= nStartAt) && ((nNowTime <= nEndAt) || (nEndAt === null))) {
          if (this.oNowEventSku.event_price && this.oNowEventSku.c_id !== 4) {
            _nPrice = this.oNowSku.price || 0
          }
        }
      }

      return _nPrice
    }
  },
  watch: {
    oPro (val) {
      this.initSkuMap()
    },
    nNowSku (val) {
      this.initSku()
      this.setEventSku()
    },
    oMarketing (oVal) {
      const _oEventSkuMap = {}

      for (const oItem of ((oVal || {}).variants || [])) {
        _oEventSkuMap[oItem.variant_id] = oItem
      }

      this.oEventSkuMap = _oEventSkuMap

      this.setEventSku()
    }
  },
  methods: {
    on (oConfig) {
      // Init this.oConfig
      this.oConfig.product = oConfig.product || {}
      this.oConfig.productId = oConfig.productId || null
      this.oConfig.sku = oConfig.sku || null
      this.oConfig.quantity = oConfig.quantity || 1
      this.oConfig.marketing = oConfig.marketing || {}
      this.oConfig.hasAmount = (oConfig.hasAmount === false ? oConfig.hasAmount : true)
      this.oConfig.hasClose = (oConfig.hasClose === false ? oConfig.hasClose : true)

      this.oConfig.close = oConfig.close || null
      this.oConfig.confirm = oConfig.confirm || null
      this.oConfig.addCart = oConfig.addCart || null
      this.oConfig.buyNow = oConfig.buyNow || null

      // Init Other
      this.oPro = this.oConfig.product || {}
      this.oMarketing = this.oConfig.marketing || {}
      this.nNowSku = this.oConfig.sku || null
      this.nNowQuantity = this.oConfig.quantity || null

      if (this.autoType && this.nNowSku && this.nNowQuantity) {
        if (this.autoType === 'add_cart') {
          this.fnAddCart()
        } else if (this.autoType === 'buy_now') {
          this.fnBuyNow()
        }
      } else {
        // Get Product
        if (this.oConfig.productId) {
          this.$toast.loading('加载中...')

          Products.item(this.oConfig.productId).then(({ data }) => {
            this.oPro = data || {}
            this.$toast.off()
            this.showPopup = true
          }).catch(oError => {
            this.showPopup = false
            this.$toast.info(oError.message || '商品数据获取出错')
          })
        } else if (this.oPro.id) {
          this.showPopup = true
        } else {
          this.$toast.info('获取商品信息异常，请重试')
        }
      }
    },
    off () {
      this.showPopup = false
    },
    close () {
      this.fnPopChange(false, '')
    },
    initSkuMap () {
      const _oSkuMap = {}
      let _nSumStock = 0

      this.fnConvertSKU()

      for (const _oSku of (this.variants || [])) {
        _oSkuMap[_oSku.id] = _oSku
        _nSumStock += _oSku.stock
      }
      this.nSumStock = _nSumStock || 0
      this.oSkuMap = _oSkuMap
      this.initSku()
    },
    initSku () {
      this.oNowSku = this.oSkuMap[this.nNowSku] || {}
      // this.nNowSku 为 Null 时，判断是否需要自动选择默认 SKU
    },
    setEventSku () {
      this.oNowEventSku = this.oEventSkuMap[this.nNowSku] || {}
    },
    fnConvertSKU () {
      const oData = this.oPro || {}

      this.variants = oData.variants || []
      this.options = oData.options || []
    },
    fnPopChange (val, type = 'popup') {
      if (this.showPopup !== val && this.oConfig.hasClose) {
        if (this.oConfig.close) {
          this.oConfig.close({
            variant_id: this.nNowSku,
            quantity: this.nNowQuantity
          }, {
            variant_id: this.oConfig.sku,
            quantity: this.oConfig.quantity
          }, type)
        } else {
          this.showPopup = val
        }
      }
    },
    fnSkuChange (oSku) {
      const nSku = (oSku || {}).id

      this.nNowSku = nSku === 0 ? 0 : (nSku || null)
    },
    fnCheck (cb) {
      if (this.nNowSku && this.nNowQuantity) {
        const _oSku = this.oNowSku
        let _available = this.oPro.available

        _available = _available !== false

        // 提示「库存不足」优先于「不可购买」
        if (_available) {
          if (_oSku.stock_type === 'A') {
            cb && cb()
          } else if (_oSku.stock > 0) {
            cb && cb()
          } else {
            this.$toast.info('库存不足')
          }
        } else if (_oSku.stock < 1) {
          this.$toast.info('库存不足')
        } else {
          this.$toast.info('商品暂不可购买')
        }
      } else if (this.nNowSku) {
        this.$toast.info('请选择数量')
      } else {
        this.$toast.info('请选择属性')
      }
    },
    fnConfirm () {
      this.fnCheck(() => {
        if (this.nNowSku === this.oConfig.sku && this.nNowQuantity === this.oConfig.quantity) {
          this.fnPopChange(false, 'confirm')
        } else {
          this.oConfig.confirm({
            variant_id: this.nNowSku,
            quantity: this.nNowQuantity
          }, {
            variant_id: this.oConfig.sku,
            quantity: this.oConfig.quantity
          })
        }
      })
    },
    fnAddCart () {
      // 无需判断登录状态，全局 API 鉴权和提示

      // 回调分支处理
      if ((typeof this.oConfig.addCart) === 'function') {
        this.oConfig.addCart({
          variant_id: this.nNowSku,
          quantity: this.nNowQuantity
        }, {
          variant_id: this.oConfig.sku,
          quantity: this.oConfig.quantity
        })
      } else if (this.oConfig.addCart) {
        this.fnCheck(() => {
          this.$toast.loading('处理中..')

          this.$sdk.cart.add({
            variant_id: this.nNowSku,
            quantity: this.nNowQuantity,
            is_check: true
          }, oRes => {
            oRes = oRes.res || {}

            if (oRes.code === 200 || oRes.code === 212) {
              this.$store.dispatch('cart/getCartCount', { isUpdate: true })
              this.fnPopChange(false, 'add_cart')

              this.$toast.info('添加成功')
            } else {
              this.$toast.info('添加失败，请重试')
            }
          })
        })
      }
    },
    fnBuyNow () {
      // 无需判断登录状态，全局 API 鉴权和提示

      // const _nDiscountType = this.oNowEventSku.c_id || null

      // // 团购 和 预售 才检查
      // if (/^(3|10)$/.test(_nDiscountType)) {
      //   if (!(window.$account || {}).id) {
      //     this.$sdk.util.setCookie('redirect_back_url', window.location.href)
      //     this.$router.push(`${window.location.origin}/account/login`)
      //     return
      //   }

      //   // 限购 - 团购 才检查
      //   if (/^(3)$/.test(_nDiscountType)) {
      //     if (this.eventSku.is_purchase_limit && !(this.eventSku.quantity_limit > 0)) {
      //       this.$toast.info('超过限购')
      //       return
      //     }
      //   }
      // }

      // 回调分支处理
      if ((typeof this.oConfig.buyNow) === 'function') {
        this.oConfig.buyNow({
          variant_id: this.nNowSku,
          quantity: this.nNowQuantity
        }, {
          variant_id: this.oConfig.sku,
          quantity: this.oConfig.quantity
        })
      } else if (this.oConfig.buyNow) {
        this.fnCheck(() => {
          this.$toast.loading('处理中..')

          this.$sdk.cart.unCheckAll(() => {
            this.$sdk.cart.removeOne({ variant_id: this.nNowSku || null }, () => {
              this.$sdk.cart.add({
                variant_id: this.nNowSku,
                quantity: this.nNowQuantity,
                is_check: true
              }, oRes => {
                oRes = oRes.res || {}

                if (oRes.code === 200 || oRes.code === 212) {
                  this.$store.dispatch('cart/getCartCount', { isUpdate: true })
                  this.fnPopChange(false, 'add_cart')

                  this.$toast.info('添加成功')

                  this.$router.push('/account/create_order')
                } else {
                  this.$toast.info('添加失败，请重试')
                }
              })
            })
          })
        })
      }
    }
  }
}
</script>

<style scoped>
.box {
  display: flex;
  flex-direction: column;
  width: 100vw;
  max-height: 70vh;
  -webkit-tap-highlight-color: transparent;
}
.info {
  position: relative;
  display: flex;
  padding: 12px 42px 12px 15px;
  height: stretch;
  max-height: max-content;
}
.img_box {
  display: flex;
  margin: auto;
  width: 86px;
  height: 86px;
}
.img {
  display: block;
  margin: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.pro {
  flex: 1;
  margin: auto;
  padding: 0 0 0 10px;
}
.name {
  line-height: 1.3em;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.prices {
  margin: 8px 0 0;
  font-size: 0;
  line-height: 1;
}
.price_line {
  font-weight: bold;
  font-size: 16px;
  color: #f44;
}
.price {
  display: inline-block;
  margin: 0 10px 0 0;
  font-weight: bold;
  font-size: 16px;
  color: #f44;
}
.price_src {
  display: inline-block;
  margin: 4px 0 0 0;
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
}
.close {
  position: absolute;
  top: 0;
  right: 0;
  margin: 0;
  padding: 15px;
  color: #999;
}
.close:active {
  color: #888;
}
.close_icon {
  width: 12px;
  height: 12px;
}
.chooser {
  display: flex;
  flex: 1;
  overflow: hidden;
  border: 0 solid #d5d5d5;
  border-width: var(--1px) 0 0;
  max-height: min-content;
  -webkit-overflow-scrolling: touch;
}
.scroll_view {
  box-sizing: border-box;
  padding: 12px 15px 36px;
  width: 100%;
}
.num {
  display: flex;
  padding: 12px 15px;
  border: 0 solid #d5d5d5;
  border-width: var(--1px) 0 0;
  min-height: fit-content;
}
.num_label {
  flex: 1;
  margin: auto;
}
.btns {
  display: flex;
  height: stretch;
  max-height: max-content;
}
.btn.yu-btn {
  flex: 1;
  margin: 0;
  padding: 16px 0;
  border: none;
  border-radius: 0;
  font-size: 16px;
}
.btn.i-add_cart {
  background-color: #fdac39;
}
.btn.i-buy_now {
  background-color: #fb544e;
}
</style>
