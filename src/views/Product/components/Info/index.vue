<docs>
## ProductInfo Docs
</docs>

<template>
<div class="product-info">
  <div class="head">
    <div class="infos">
      <div class="name">{{ product.name }}</div>
      <div class="desc" v-if="product.short_desc">{{ product.short_desc }}</div>
    </div>
    <div class="actions">
      <s-share :title="product.name" :price="product.price_min / 100" :img-url="product.feature_image.src | imgURL('375x375')"></s-share>
    </div>
  </div>
  <div class="sale_info">
    <div class="prices" v-if="sku.id">
      <span class="price">
        <yu-currency :val="sku.price"></yu-currency>
      </span>
      <del class="price_src" v-if="sku.price < sku.market_price"><yu-currency :val="sku.market_price" /></del>
    </div>
    <div class="prices" v-else>
      <span class="price">
        <yu-currency :val="product.price_min"></yu-currency>
        <template v-if="product.price_min < product.price_max">
          <span class="price_line">~</span>
          <yu-currency :val="product.price_max"></yu-currency>
        </template>
      </span>
      <del class="price_src" v-if="product.compare_price_min < product.compare_price_max">
        <yu-currency :val="product.compare_price_max"></yu-currency>
      </del>
    </div>
    <div class="sale_sum" v-if="nSale">
      <span>销量&nbsp;</span>
      <span>{{ nSale }}</span>
    </div>
  </div>
  <s-discounts :discounts="discounts"></s-discounts>
</div>
</template>

<script>
import sShare from '../Share'
import sDiscounts from './Discounts'

export default {
  name: 'ProductInfo',
  components: {
    sShare,
    sDiscounts
  },
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
    discounts: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      nSale: null
    }
  },
  watch: {
    product (oVal) {
      this.initSale()
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.initSale()
    },
    initSale () {
      const _skus = (this.product || {}).variants || []
      let nSum = 0

      for (const oSku of _skus) {
        nSum += (oSku.sale || 0)
      }

      this.nSale = nSum
    }
  }
}
</script>

<style scoped>
.product-info {
  font-size: 0;
  line-height: 1;
}
.head {
  display: flex;
}
.infos {
  flex: 1;
}
.actions {
  display: flex;
  padding: 20px 0 0;
}
.name {
  margin: 0 0 7px;
  padding: 20px 0 0;
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
.sale_info {
  display: flex;
  align-items: center;
}
.prices {
  flex: 1;
}
.price {
  display: inline-block;
  margin: 0 10px 0 0;
  color: #fe384f;
  font-size: 16px;
  font-weight: bold;
  vertical-align: baseline;
}
.price_src {
  display: inline-block;
  margin: 4px 10px 0 0;
  color: #a3a3a3;
  font-size: 12px;
  vertical-align: baseline;
  text-decoration: line-through;
}
.price_line {
  margin: 0 0 0 4px;
}
.sale_sum {
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 85px;
  line-height: 1;
  font-size: 12px;
  color: #a3a3a3;
  white-space: nowrap;
}
</style>
