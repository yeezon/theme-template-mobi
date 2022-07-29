<docs>
## ProductMany Docs
</docs>

<template>
<div class="product-many">
  <div class="header">
    <div class="title">大家都在看</div>
    <div class="desc">Watching</div>
  </div>
  <div class="items">
    <div class="item" v-for="oItem of items" :key="oItem.id">
      <product-item :item="oItem" size="100x100"></product-item>
    </div>
  </div>
</div>
</template>

<script>
import Products from '@/api/v1/products'

import ProductItem from '@/components/Product/Item'

export default {
  name: 'ProductMany',
  components: {
    ProductItem
  },
  data () {
    return {
      isLoading: false,
      errorTip: '',
      items: [],
      oQuery: {
        per_page: 8
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.getItems()
    },
    getItems () {
      this.isLoading = true

      Products.likes().then(({ data }) => {
        this.items = data.products || []
      }).catch(oError => {
        this.errorTip = oError.message || '获取数据失败'
      }).finally(() => {
        this.isLoading = false
      })
    }
  }
}
</script>

<style scoped>
.product-many {
  overflow: hidden;
  background-color: #fff;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
}
.title {
  font-size: 18px;
  font-weight: bold;
  color: #393939;
}
.desc {
  font-size: 12px;
  color: #989898;
}
.items {
  box-sizing: border-box;
  overflow-x: auto;
  overflow-y: hidden;
  margin: 0 0 5px;
  padding: 0 15px 15px;
  width: 100%;
  height: auto;
  line-height: 0;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}
.item {
  display: inline-block;
  margin: 0 0 0 8px;
  width: 100px;
  vertical-align: top;
  overflow: hidden;
  text-align: center;
}
.item:first-child {
  margin: 0;
}
.item >>> .desc {
  text-align: center;
}
.item >>> .name {
  font-size: 12px;
}
.item >>> .price {
  font-size: 12px;
}
.item >>> .price_market {
  font-size: 11px;
}
.item >>> .price_line {
  display: none;
}
.item >>> .price_line ~ .yu-currency {
  display: none;
}
.item >>> .price_market {
  display: none;
}
</style>
