<docs>
## ProductItem Docs

* YuItems 已经有 Key 了
</docs>

<template>
<router-link class="product-item" :class="{'i-cols_1': cols === 1}" :to="`/products/${ item.handle }`">
  <div class="img" :style="{ backgroundImage: `url(${ getImg((item.feature_image || {}).src || item.src) })` }"></div>
  <div class="info">
    <div class="desc">{{ item.short_desc }}</div>
    <div class="name">{{ item.name }}</div>
    <div class="sale">
      <div class="prices">
        <template v-if="showTag">
          <div class="tag" v-if="priceTag">{{ priceTag }}</div>
          <div class="price"><yu-currency :val="nEventPrice || item.price_min"></yu-currency><template v-if="!priceTag && (item.price_min < item.price_max)"><span class="price_line">~</span><yu-currency :val="item.price_max"></yu-currency></template></div>
          <del class="price_market" v-if="nOriginPrice || (!(item.price_min < item.price_max) && (item.compare_price_max || item.compare_price_min))"><yu-currency :val="nOriginPrice || item.compare_price_max || item.compare_price_min"></yu-currency></del>
        </template>
        <template v-else-if="'event_price' in item">
          <div class="price"><yu-currency :val="item.event_price"></yu-currency><template v-if="item.event_price < item.event_price2"><span class="price_line">~</span><yu-currency :val="item.event_price2"></yu-currency></template></div>
          <del class="price_market" v-if="!(item.event_price < item.event_price2) && (item.origin_price2 || item.origin_price)"><yu-currency :val="item.origin_price2 || item.origin_price"></yu-currency></del>
        </template>
        <template v-else>
          <div class="price"><yu-currency :val="item.price_min"></yu-currency><template v-if="item.price_min < item.price_max"><span class="price_line">~</span><yu-currency :val="item.price_max"></yu-currency></template></div>
          <del class="price_market" v-if="!(item.price_min < item.price_max) && (item.compare_price_max || item.compare_price_min)"><yu-currency :val="item.compare_price_max || item.compare_price_min"></yu-currency></del>
        </template>
      </div>
    </div>
  </div>
</router-link>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'ProductItem',
  props: {
    cols: {
      type: Number,
      default: 2
    },
    item: {
      type: Object,
      default () {
        return {}
      }
    },
    size: {
      type: String,
      default: ''
    },
    showTag: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      nEventPrice: null,
      nOriginPrice: null,
      priceTag: '',
      oDiscount: {}
    }
  },
  mounted () {
    if (this.showTag) {
      this.getDiscount()
    }
  },
  methods: {
    getImg (url) {
      url = Vue.filter('imgURL')(url, (this.size || '375x375'))

      return url
    },
    getDiscount () {
      // 营销活动支持
      if ('IntersectionObserver' in window) {
        const fnDiscount = () => {
          const _handle = (this.item || {}).handle || ''

          if (!_handle) return

          this.$sdk.discount.matchProduct(_handle, (oRes) => {
            oRes = oRes.res || {}

            if (oRes.code === 200) {
              let nDisType = null
              let nEventPrice = null
              let nOriginPrice = null

              const _eventSkus = (oRes.marketing || {}).variants || []
              const _discounts = oRes.discounts || []

              for (let i = 0; i < _eventSkus.length; ++i) {
                const oEventSku = _eventSkus[i] || {}
                // 1 秒杀，2 限时，3 拼团，10 预售
                nDisType = oEventSku.c_id
                if (/^(1|2|3|10)$/ig.test(nDisType)) {
                  nEventPrice = oEventSku.event_price || null
                  nOriginPrice = oEventSku.origin_price || null
                  break
                }
              }

              let priceTag = ''
              if (nDisType === 1) {
                priceTag = '秒杀'
              } else if (nDisType === 2) {
                priceTag = '限时'
              } else if (nDisType === 3) {
                priceTag = '拼团'
              } else if (nDisType === 10) {
                priceTag = '预售'
              } else {
                // 旧活动
                for (let _i = 0; _i < _discounts.length; ++_i) {
                  const _oDis = _discounts[_i] || {}

                  if (_oDis.discount_type === 'amount_off') {
                    priceTag = '满减'
                    break
                  } else if (_oDis.discount_type === 'percent_off') {
                    priceTag = '满折'
                    break
                  }
                }
              }

              if (priceTag) {
                if (nEventPrice || nEventPrice === 0) {
                  this.nEventPrice = nEventPrice
                }
                if (nOriginPrice > nEventPrice) {
                  this.nOriginPrice = nOriginPrice
                }

                this.priceTag = priceTag
              }
            }
          })
        }

        const io = new IntersectionObserver(function (entries) {
          entries.forEach(oEntrie => {
            if (oEntrie.intersectionRatio > 0) {
              const el = oEntrie.target
              fnDiscount()
              io.unobserve(el) // 停止观察
            }
          })
        })

        io.observe(this.$el)
      }
    }
  }
}
</script>

<style scoped>
.product-item {
  display: block;
  height: 100%;
  background-color: #fff;
}
.product-item:active {
  color: inherit;
}
.img {
  box-sizing: border-box;
  position: relative;
  margin: 0;
  padding: 0 0 100%;
  width: 100%;
  height: 0;
  line-height: 0;
  font-size: 0;
  background-color: #fff;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 4px;
  box-shadow: 0 0 3px 0 rgba(96, 109, 143, 0.1);
}
.img::after {
  box-sizing: border-box;
  content: "\20";
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  opacity: .1;
  border: var(--1px) solid #000;
}
.info {
  margin: 0 8px;
  overflow: hidden;
}
.desc {
  display: -webkit-box;
  margin: 8px 0 0;
  width: 100%;
  height: 15px;
  font-size: 11px;
  line-height: 15px;
  color: #808080;
  text-align: left;
  overflow : hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.name {
  margin: 4px 0 10px;
  width: 100%;
  height: 16px;
  line-height: 16px;
  font-size: 13px;
  overflow : hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  color: #262626;
}
.sale {
  display: flex;
  margin: 0;
  align-items: flex-start;
}
.prices {
  flex: 1;
  margin: auto;
  white-space: normal;
  line-height: 1;
  font-size: 0;
}
.price {
  display: inline-block;
  margin: 0 2px 0 0;
  color: #fe384f;
  font-size: 14px;
  vertical-align: middle;
}
.price_market {
  display: inline-block;
  margin: 1px 0 0 2px;
  color: #a6a6a6;
  font-size: 13px;
  text-decoration: line-through;
  vertical-align: middle;
}
.price_line {
  margin: 0 0 0 2px;
}

.product-item.i-cols_1 {
  display: flex;
}
.product-item.i-cols_1 .img {
  width: 142px;
  padding: 0 0 142px;
}
.product-item.i-cols_1 .info {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 0 0 0 14px;
  justify-content: center;
}
.product-item.i-cols_1 .desc {
  display: -webkit-box;
  text-align: left;
  font-size: 13px;
}
.product-item.i-cols_1 .name {
  margin: 9px 0;
  height: 16px;
  line-height: 16px;
  font-size: 15px;
}
.product-item.i-cols_1 .sale {
  margin: 0;
}

.tag {
  display: inline-block;
  margin: 0 5px 0 0;
  padding: 2px 4px 2px 5px;
  font-size: 10px;
  line-height: 15px;
  color: #fff;
  background-color: #f55;
  border-radius: 2px;
  vertical-align: middle;
}
</style>
