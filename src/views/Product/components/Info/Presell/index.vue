<template>
<div class="sk-product_info-seckill">
  <div class="s-bar">
    <s-bar :key="sku.id + marketing.info['10']['start_at']" :info="oNowEventInfo" :price="nEventPrice" @start="fnStart" @end="fnEnd"></s-bar>
  </div>
  <template v-if="isStart">
    <div class="info">
      <div class="name">{{ product.name }}</div>
      <div class="desc" v-if="product.short_desc">{{ product.short_desc }}</div>
    </div>
    <div class="s-cont">
      <div class="s-price">
        <div class="s-dt">预售价</div>
        <div class="s-dd">
          <span class="s-event_price"><span class="s-small_y"></span><yu-currency :val="nEventPrice"></yu-currency></span>
          <span v-if="sku.price > nEventPrice" class="s-original_price"><span class="s-small_x">售价</span><yu-currency class="s-currency" :val="sku.price"></yu-currency></span>
        </div>
      </div>
      <div class="s-item i-order" v-if="nOrderCount > 0">
        <div class="s-dt">已预定</div>
        <div class="s-dd">{{ nOrderCount }} 件</div>
      </div>
      <div class="s-item i-award" v-if="tips">
        <div class="s-dt">奖励</div>
        <div class="s-dd">{{ tips }}</div>
      </div>
      <div class="s-item i-seckill">
        <div class="s-dt">发货</div>
        <div class="s-dd" v-if="!oNowEventInfo.delivery_type">付款成功 {{ oNowEventInfo.delivery_days }} 天后发货</div>
        <div class="s-dd" v-else>{{ oNowEventInfo.delivery_at | date }} 后开始发货</div>
      </div>
      <div class="s-item i-sale_sum" v-if="nSale">
        <div class="s-dt">销量</div>
        <div class="s-dd">{{ nSale }}</div>
      </div>
    </div>
  </template>
</div>
</template>

<script>
import sBar from './components/Bar.vue'

export default {
  props: {
    product: {
      type: Object,
      default () {
        return {}
      }
    },
    sku: {
      type: Object,
      default () {
        return {}
      }
    },
    marketing: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      isStart: false,
      nSale: null,
      oEventSkuMap: {}
    }
  },
  computed: {
    oNowEventInfo () {
      const _oEventSku = this.oEventSkuMap[(this.sku || {}).id] || {}
      const _oNowEventInfo = ((this.marketing || {}).info || {})[_oEventSku.c_id || null] || {}

      this.$emit('discount-handle', _oNowEventInfo.handle || '')

      return _oNowEventInfo
    },
    nEventPrice () {
      const _oEventSku = this.oEventSkuMap[(this.sku || {}).id] || {}

      return (_oEventSku || {}).event_price || null
    },
    nOrderCount () {
      return (this.marketing.order_item_count || {})[(this.sku || {}).id] || 0
    },
    isCredit () {
      return ((this.marketing || {}).store || {}).credit_enabled || false
    },
    isReward () {
      return ((this.marketing || {}).store || {}).reward_point_enabled || false
    },
    tips () {
      const _oEventSku = this.oEventSkuMap[(this.sku || {}).id] || {}
      const nPoint = _oEventSku.point || 0
      const nCredit = _oEventSku.credit || 0

      const _isReward = this.isReward && nPoint
      const _isCredit = this.isCredit && nCredit

      let tips = ''

      if (_isReward && _isCredit) {
        tips = `购买得 ${nPoint} 积分及 ${nCredit} 经验值`
      } else if (_isReward) {
        tips = `购买得 ${nPoint} 积分`
      } else if (_isCredit) {
        tips = `购买得 ${nCredit} 经验值`
      }

      return tips
    }
  },
  watch: {
    product (oVal) {
      this.initSale()
    },
    marketing (oVal) {
      this.initMarketing(oVal)
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.initMarketing()
      this.initSale()
    },
    initSale () {
      const _skus = (this.product || {}).variants || []
      let nSum = 0

      for (const oSku of _skus) {
        nSum += (oSku.sale || 0)
      }

      this.nSale = nSum
    },
    initMarketing (oVal = this.marketing) {
      const _oEventSkuMap = {}

      for (const oItem of ((oVal || {}).variants || [])) {
        _oEventSkuMap[(oItem || {}).variant_id] = oItem
      }

      this.oEventSkuMap = _oEventSkuMap
    },
    fnStart () {
      this.isStart = true

      this.$emit('start')
    },
    fnEnd () {
      this.isStart = false

      this.$emit('end')
    }
  },
  components: {
    sBar
  }
}
</script>

<style scoped>
.s-bar {
  margin: 0 -15px 20px;
}
.info {
  margin: 15px 0;
  font-size: 0;
  line-height: 1;
}
.name {
  margin: 0;
  color: #262626;
  line-height: 24px;
  font-size: 18px;
  font-weight: bold;
  word-break: break-all;
}
.desc {
  margin: 9px 0;
  color: #595959;
  font-size: 15px;
  line-height: 20px;
  word-break: break-all;
}

.s-cont {
  position: relative;
  background: #f7f6f4;
  padding: 15px 20px;
  border-radius: 4px;
}
.s-dt {
  display: inline-block;
  line-height: 20px;
  font-size: 12px;
  color: #444;
}
.s-dd {
  display: inline-block;
  line-height: 20px;
  font-size: 12px;
}
.s-price {
  margin-bottom: 20px;
}
.s-price .s-dt {
  margin-right: 20px;
}
.s-event_price {
  font-size: 24px;
  color: #f00;
  vertical-align: baseline;
  margin-right: 15px;
  display: inline-block;
}
.s-original_price {
  font-size: 12px;
  color: #999;
}
.s-small_x {
  padding-right: 5px;
}
.s-small_y {
  font-size: 16px;
}
.s-currency {
  text-decoration: line-through;
}
.s-item {
  margin: 10px 0 0;
}
.s-item .s-dt {
  margin-right: 20px;
  vertical-align: top;
}
..s-item .s-dd {
  color: #777;
  font-style: normal;
  vertical-align: top;
}
</style>
