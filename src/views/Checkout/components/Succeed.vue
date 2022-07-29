<docs>
## YkCheckoutSucceed Docs
</docs>

<template>
<div class="yk-checkout_succeed" data-com="YkCheckoutSucceed">
  <div class="yk-checkout_succeed-cont">
    <div class="yk-checkout_succeed-title">{{ hasPay ? '请尽快支付' : '订单创建成功' }}</div>
    <div class="yk-checkout_succeed-no"><span>订单编号：</span><span class="yk-checkout_succeed-no_text">{{ orderNo }}</span></div>
    <div class="yk-checkout_succeed-info">请妥善保管此订单号，方便查询物流与订单状态。</div>
    <YuButton v-if="hasPay" class="yk-checkout_succeed-btn" type='danger' @click="fnPay">立即支付</YuButton>
    <YuButton v-else class="yk-checkout_succeed-btn" type='primary' @click="fnClick">确定</YuButton>
  </div>
</div>
</template>

<script>
export default {
  componentName: 'YkCheckoutSucceed',
  props: {
    orderNo: {
      type: [String, Number],
      default: ''
    },
    hasPay: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    fnPay (id, bankId) {
      this.$emit('pay')
    },
    fnClick () {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
  .yk-checkout_succeed {
    position: absolute;
    display: flex;
    top: 0;
    left: 0;
    width: 100vw;
    height: var(--100vh);
    background-color: #fff;
    overflow: hidden;
  }
  .yk-checkout_succeed-cont {
    margin: auto;
    padding: 0 0 200px;
    width: 75%;
  }
  .yk-checkout_succeed-title {
    margin: 0 0 15px;
    font-size: 18px;
    font-weight: bold;
  }
  .yk-checkout_succeed-no_text {
    color: #f71;
  }
  .yk-checkout_succeed-no,
  .yk-checkout_succeed-info {
    line-height: 22px;
  }
  .yk-checkout_succeed-info {
    margin: 0 0 20px;
  }
  .yk-checkout_succeed-btn {
    width: 100%;
  }
</style>
