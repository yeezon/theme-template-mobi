<docs>
## YkCheckoutPayment Docs
</docs>

<template>
  <div class="yk-checkout_payment" data-com="YkCheckoutPayment">
    <div class="yk-checkout_payment-title">支付方式</div>
    <YuRadioGroup v-if="hasOnline || hasOffline" :value="payMethodType" @input="setPayMethodType">
      <YuRadio v-if="hasOnline" val="online" align="left" :disabled="hasUnavailOnline">在线支付</YuRadio>
      <div v-if="hasOnline && hasUnavailOnline" class="yk-checkout_payment-tips">
        <div><span>以下 {{ paymentMethods.online.unavail_products.length }} 件商品不支持</span> <a href="/cart">返回购物车修改</a></div>
        <div v-for="(pro, index) in paymentMethods.online.unavail_products" :key="index" class="yk-checkout_payment-tips_items">
          <div class="yk-checkout_payment-tips_item">
            <div class="yk-checkout_payment-tips_img" :style="`background-image: url('${ (pro || {}).image_src }');`"></div>
            <div class="yk-checkout_payment-tips_info">
              <div class="yk-checkout_payment-tips_name">{{ pro.name }}</div>
              <div><YuCurrency :val="pro.price" />&nbsp;<span class="yk-times">&times;</span>&nbsp;{{ pro.quantity }}</div>
            </div>
          </div>
        </div>
      </div>
      <YuRadio v-if="hasOffline" val="offline" align="left" :disabled="hasUnavailOffline">货到付款</YuRadio>
      <div v-if="hasOffline && hasUnavailOffline" class="yk-checkout_payment-tips">
        <div><span>以下 {{ paymentMethods.offline.unavail_products.length }} 件商品不支持</span> <a href="/cart">返回购物车修改</a></div>
        <div v-for="(pro, index) in paymentMethods.offline.unavail_products" :key="index" class="yk-checkout_payment-tips_items">
          <div class="yk-checkout_payment-tips_item">
            <div class="yk-checkout_payment-tips_img" :style="`background-image: url('${ (pro || {}).image_src }');`"></div>
            <div class="yk-checkout_payment-tips_info">
              <div class="yk-checkout_payment-tips_name">{{ pro.name }}</div>
              <div><YuCurrency :val="pro.price" />&nbsp;<span class="yk-times">&times;</span>&nbsp;{{ pro.quantity }}</div>
            </div>
          </div>
        </div>
      </div>
    </YuRadioGroup>
    <div class="yk-checkout_payment-text" v-else-if="!hasAddress">请先选择收货地址</div>
    <div class="yk-checkout_payment-text" v-else>网站未配置当前设备收款方式，请联系客服</div>
  </div>
</template>

<script>
export default {
  name: 'YkCheckoutPayment',
  props: {
    hasAddress: {
      type: Boolean,
      default: false
    },
    paymentMethods: {
      type: Object,
      default () {
        return {}
      }
    },
    paymentData: {
      type: Object,
      default () {
        return {
          payment_method_id: null,
          payment_method_type: ''
        }
      }
    }
  },
  data: function () {
    return {
      payMethodId: this.paymentData.payment_method_id,
      payMethodType: this.paymentData.payment_method_type,
      onlineDefId: null,
      offlineDefId: null
    }
  },
  computed: {
    hasOnline () {
      if (Object.keys(this.paymentMethods).length && (this.paymentMethods.online.methods.bank.length || this.paymentMethods.online.methods.thirdparty.length)) {
        return true
      } else {
        return false
      }
    },
    hasOffline () {
      if (Object.keys(this.paymentMethods).length && this.paymentMethods.offline.methods.cod.length) {
        return true
      } else {
        return false
      }
    },
    hasUnavailOnline () {
      return !this.paymentMethods.online.avail
    },
    hasUnavailOffline () {
      return !this.paymentMethods.offline.avail
    }
  },
  watch: {
    paymentMethods () {
      this.initType()
    }
  },
  methods: {
    initType () {
      // 初始化 ID
      this.initId()
      // 初始化类型
      if (!this.paymentData.payment_method_type) {
        // 初始化 payment_method_type
        if (this.hasOnline && !this.hasUnavailOnline) {
          this.setPayMethodType('online')
        } else if (this.hasOffline && !this.hasUnavailOffline) {
          this.setPayMethodType('offline')
        }
      }
    },
    initId () {
      const payMethods = this.paymentMethods
      if (Object.keys(payMethods).length) {
        // 初始化在线支付 ID
        if (this.hasOnline && !this.onlineDefId) {
          const _methods = payMethods.online.methods
          if (_methods.thirdparty.length) {
            this.onlineDefId = _methods.thirdparty[0].id
          } else if (_methods.bank.length) {
            this.onlineDefId = _methods.bank[0].id
          }
        }

        // 初始化货到付款 ID
        if (this.hasOffline && !this.offlineDefId) {
          const _methods = payMethods.offline.methods
          if (_methods.cod.length) {
            this.offlineDefId = _methods.cod[0].id
          }
        }
      } else {
        this.onlineDefId = null
        this.offlineDefId = null
      }
    },
    // 只能主动，watch payMethodType 只能 change 模式 不能 input 模式
    setPayMethodType (val) {
      this.payMethodType = val
      if (val === 'online') {
        this.payMethodId = this.onlineDefId
      } else if (val === 'offline') {
        this.payMethodId = this.offlineDefId
      }
      this.fnChange()
    },
    fnChange () {
      this.$emit('change', {
        payment_method_id: this.payMethodId,
        payment_method_type: this.payMethodType
      })
    }
  }
}
</script>

<style scoped>
  .yk-checkout_payment {
    vertical-align: middle;
    padding: 0 15px;
    background-color: #fff;
  }
  .yk-checkout_payment-title {
    padding: 14px 0 15px;
    border: 0 solid #d5d5d5;
    border-width: 0 0 var(--1px);
    line-height: 1;
  }
  .yk-checkout_payment-text {
    padding: 15px 0;
    color: #999;
  }
  .yk-checkout_payment-tips {
    padding: 0 28px 15px;
    color: #777;
    font-size: 13px;
  }
  .yk-checkout_payment-tips_items {
    margin: 10px 0 0;
    font-size: 12px;
  }
  .yk-checkout_payment-tips_item {
    display: flex;
  }
  .yk-checkout_payment-tips_img {
    margin: 0 5px 0 0;
    width: 30px;
    height: 30px;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
  }
  .yk-checkout_payment-tips_info {
    flex: 1;
    overflow: hidden;
  }
  .yk-checkout_payment-tips_info > div {
    height: 15px;
    line-height: 15px;
  }
  .yk-checkout_payment-tips_name {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
