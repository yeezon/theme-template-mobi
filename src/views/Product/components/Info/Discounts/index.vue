<docs>
## ProductInfoDiscounts Docs
</docs>

<template>
<div class="product-info-discounts">
  <div class="s-items">
    <template v-for="oDiscount of discounts">
      <router-link class="s-item" :to="`/discounts/${oDiscount.handle}`" :key="oDiscount.handle">{{ oDiscount.name }}</router-link>
    </template>
  </div>
</div>
</template>

<script>
export default {
  name: 'ProductInfoDiscounts',
  props: {
    discounts: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {}
  },
  methods: {}
}
</script>

<style scoped>
.product-info-discounts {
  padding: 15px 0 0;
  white-space: normal;
  word-break: break-all;
}
.s-items {
  margin: 0 0 -8px 0;
}
.s-item {
  display: inline-block;
  margin: 0 8px 8px 0;
  padding: 2px 6px;
  border: 1px solid #f55;
  border-radius: 2px;
  font-size: 12px;
  background-color: #f55;
  color: #fff;
  vertical-align: middle;
  line-height: 1.5em;
  text-align: left;
}
</style>
