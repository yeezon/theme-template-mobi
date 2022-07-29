<docs>
## YkCheckoutBar Docs
</docs>

<template>
<div class="yk-checkout_bar" data-com="YkCheckoutBar">
  <div v-if="Object.keys(address).length" class="yk-checkout_bar-add">
    <div>寄送至：{{ (address.location_full_titles || '').replace(/,/g, ' ') }} {{ address.detail }}</div>
    <div>收货人：{{ address.name }} {{ address.mobile }}</div>
  </div>
  <div class="yk-checkout_bar-cont">
    <div class="yk-checkout_bar-left">
      <div class="yk-checkout_bar-sum">实付金额：<YuCurrency :val="amount" /></div>
      <div v-if="point" class="yk-checkout_bar-point">可获得积分：{{ point }}</div>
    </div>
    <YuButton class="yk-checkout_bar-submit" type="danger" @click="fnSubmit" :disabled="amount === null">提交订单</YuButton>
  </div>
  <YuHomeIndicator />
</div>
</template>

<script>
export default {
  componentName: 'YkCheckoutBar',
  props: {
    address: {
      type: Object,
      default () {
        return {}
      }
    },
    amount: {
      type: Number,
      default: null
    },
    point: {
      type: Number,
      default: null
    }
  },
  methods: {
    fnSubmit () {
      this.$emit('submit')
    }
  }
}
</script>

<style scoped>
  .yk-checkout_bar {
    width: stretch;
    background-color: #fff;
  }
  .yk-checkout_bar-add {
    padding: 7px 15px;
    background-color: #fffbea;
    border: 0 solid #d5d5d5;
    border-width: var(--1px) 0 0;
    font-size: 12px;
    line-height: 18px;
  }
  .yk-checkout_bar-cont {
    display: flex;
    padding: 7px 15px;
    background-color: #fff;
    text-align: right;
    border: 0 solid #d5d5d5;
    border-width: var(--1px) 0 0;
  }
  .yk-checkout_bar-left {
    flex: 1;
    margin: auto;
    padding: 0 10px 0 0;
    line-height: 20px;
  }
  .yk-checkout_bar-sum>span {
    color: #f44;
    font-weight: bold;
  }
  .yk-checkout_bar-point {
    font-size: 12px;
    color: #989898;
  }
  .yk-checkout_bar-submit {
    margin: auto;
    padding: 12px 29px 13px;
    font-size: 16px;
  }
</style>
