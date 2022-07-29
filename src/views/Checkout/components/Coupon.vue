<docs>
## YkCheckoutCoupon Docs
</docs>

<template>
  <div class="yk-checkout_coupon" :data-code="coupon.code || ''" data-com="YkCheckoutCoupon">
    <YuCell class="yk-checkout_coupon-cell" label="优惠券" @click="fnOpen" :val="coupon.code" placeholder="使用优惠券" :is-link="true"><span v-if="coupon.code"><span v-if="isAmount(coupon)">优惠<YuCurrency :decimal="0" :val="getDesc(coupon)" /></span><span v-else>打 {{ getDesc(coupon) }}</span></span></YuCell>
    <YuPopup v-model="isOpen" :has-input="true">
      <YkCouponChoose :coupon="coupon" title="使用优惠券" @change="fnChange" @close="fnClose" />
    </YuPopup>
  </div>
</template>

<script>
import YkCouponChoose from '@/components/Coupon/Choose'

export default {
  componentName: 'YkCheckoutCoupon',
  components: {
    YkCouponChoose
  },
  props: {
    coupon: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data: function () {
    return {
      isOpen: false
    }
  },
  methods: {
    fnOpen () {
      this.isOpen = true
    },
    fnClose () {
      this.isOpen = false
    },
    fnChange (val) {
      this.$emit('change', val)
      this.fnClose()
    },
    isAmount (oCoupon = this.coupon) {
      return oCoupon.utype === 'amount'
    },
    getDesc (oCoupon = this.coupon) {
      let _name
      switch (oCoupon.utype) {
        case 'amount' :
          _name = parseInt(oCoupon.discount_amount)
          break
        case 'percentage' :
          _name = ((oCoupon.discount_percentage || 0) / 10).toFixed(1).replace('.0', '') + ' 折'
          break
        default:
          _name = null
      }
      return _name
    }
  }
}
</script>

<style scoped>
  .yk-checkout_coupon {
    vertical-align: middle;
    background-color: #fff;
  }
  .yk-checkout_coupon .yk-checkout_coupon-cell .yu-cell-hr {
    display: none;
  }
</style>
