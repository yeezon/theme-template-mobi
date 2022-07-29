<docs>
## ProductShipment Docs
</docs>

<template>
<div class="product-shipment">
  <div class="item" v-for="(oItem, index) in newItems" :key="index">
    <div class="img"><img :src="oItem.image_url | imgURL(size || '380x380')" :alt="oItem.name" /></div>
    <div class="info">
      <div class="name">{{ oItem.name }}</div>
      <div class="sku">{{ oItem.sku_name }}</div>
    </div>
    <div class="count"><YuCurrency class="price" :val="oItem.price" /><br><span class="times">&times;{{oItem.quantity}}</span></div>
  </div>
</div>
</template>

<script>
export default {
  name: 'ProductShipment',
  props: {
    items: {
      type: Array,
      default () {
        return []
      }
    },
    size: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      newItems: []
    }
  },
  watch: {
    items () {
      this.init()
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      if (((this.items || [])[0] || {}).sku_name) {
        this.initTrades()
      } else {
        this.initItems()
      }
    },
    initItems () {
      const _newItems = []
      for (const oItem of (this.items || [])) {
        _newItems.push({
          name: oItem.name,
          image_url: oItem.item_image_url,
          sku_name: `${oItem.attr1} ${oItem.attr2} ${oItem.attr3}`,
          price: oItem.price,
          quantity: oItem.quantity
        })
      }
      this.newItems = _newItems
    },
    initTrades () {
      const _newItems = []
      for (const oItem of (this.items || [])) {
        _newItems.push({
          name: oItem.item_name,
          image_url: oItem.item_image_url,
          sku_name: oItem.sku_name,
          price: oItem.pay_price,
          quantity: oItem.num
        })
      }
      this.newItems = _newItems
    }
  }
}
</script>

<style scoped>
.item {
  display: flex;
  padding: 13px 0;
  border: 0 solid #d5d5d5;
  border-width: var(--1px) 0 0;
  background-color: #fff;
}
.item:first-child {
  border-width: 0;
}
.img {
  position: relative;
  width: 70px;
  height: 70px;
  overflow: hidden;
}
.img img {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  max-width: 100%;
  max-height: 100%;
}
.info {
  margin: auto;
  padding: 0 10px;
  flex: 1;
  line-height: 1;
  font-size: 12px;
}
.name {
  display: -webkit-box;
  margin: 0 0 4px;
  max-height: 32px;
  line-height: 16px;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}
.sku {
  display: -webkit-box;
  max-height: 32px;
  line-height: 16px;
  color: #999;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}
.count {
  text-align: right;
  font-weight: bold;
  line-height: 1;
}
.price {
  display: inline-block;
  line-height: 18px;
}
.times {
  color: #777;
}
</style>
