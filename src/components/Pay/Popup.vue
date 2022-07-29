<docs>
## YkPayPopup Docs
</docs>

<template>
<div class="yk-pay_popup" data-com="YkPayPopup">
  <YuPopup :value="isOpen" :mask-lock="true">
    <YuNavBar title="选择支付方式">
      <div class="yk-pay_popup-bar_left" slot="left">
        <YuButton v-if="isCard" class="yk-pay_popup-go_order" type="text" @click="fnCard">
          <svg class="yu-icon yk-pay_popup-go_order_icon i-back"><use xlink:href="#yu-icon-left"></use></svg>
          <span class="yk-pay_popup-back">返回</span>
        </YuButton>
        <YuButton v-else-if="isSignin" class="yk-pay_popup-go_order" type="text" @click="fnClose">
          <svg class="yu-icon yk-pay_popup-go_order_icon"><use xlink:href="#yu-icon-close"></use></svg>
        </YuButton>
      </div>
    </YuNavBar>
    <div v-if="isOpen" class="yk-pay_popup-popup">
      <template v-for="oPay in payMethods.thirdparty">
        <YuCell v-if="!isCard" class="yk-pay_popup-cell" :key="oPay.id" @click="goPay(oPay.id)" :is-link="true">
          <svg v-if="getIcon(oPay.pay_type)" slot="icon" :class="[
            'yu-icon',
            'yk-pay_popup-cell_icon_' + oPay.pay_type
            ]"
          ><use :xlink:href="getIcon(oPay.pay_type)"></use></svg>
          <span slot="label">{{ oPay.desc }}</span>
        </YuCell>
      </template>
      <YuCell v-if="!isCard && hasCard" @click="fnCard" class="yk-pay_popup-cell" :is-link="true">
        <svg slot="icon" class="yu-icon yk-pay_popup-cell_icon_card"><use :xlink:href="getIcon('card')"></use></svg>
        <span slot="label">银行卡</span>
      </YuCell>
      <YuCell v-else class="yk-pay_popup-cell" v-for="oPay in payMethods.bank" :key="oPay.id" @click="goPay(oPay.id, oPay.bank_code_id)">
        <span slot="label">{{ oPay.desc }}</span>
      </YuCell>
      <div v-if="nPayNum === 0" class="yk-pay_popup-empty">暂无可用支付方式，请联系客服</div>
    </div>
  </YuPopup>
</div>
</template>

<script>
export default {
  componentName: 'YkPayPopup',
  props: {
    isPay: {
      type: Boolean,
      default: false
    },
    isSignin: {
      type: Boolean,
      default: false
    },
    orderNo: {
      type: [String, Number],
      default: ''
    },
    payMethods: {
      type: Object,
      default () {
        return {
          bank: [],
          thirdparty: []
        }
      }
    },
    sum: {
      type: Number,
      default: 0
    }
  },
  data: function () {
    return {
      isOpen: false,
      isCard: false
    }
  },
  computed: {
    hasCard () {
      return !!(this.payMethods.bank || []).length
    },
    nPayNum () {
      return ((this.payMethods.bank || []).length + (this.payMethods.thirdparty || []).length) || 0
    }
  },
  watch: {
    isPay (val) {
      if (val && this.nPayNum === 1) {
        this.goOnePay()
        this.fnClose()
      } else {
        this.isOpen = val
      }
    }
  },
  methods: {
    getIcon (payType) {
      if (/^(card|wppay|alipay|tenpay|kuaipay|baifubao)$/.test(payType)) {
        return '#yu-icon-pay_' + payType
      } else if (/^alipay/.test(payType)) {
        return '#yu-icon-pay_alipay'
      } else if (/^tenpay/.test(payType)) {
        return '#yu-icon-pay_tenpay'
      } else {
        return null
      }
    },
    goPay (id, bankId) {
      window.setTimeout(() => {
        if (this.orderNo && id) {
          let url = `/payment/go_pay?order_no=${this.orderNo}&payment_method_id=${id}`
          if (bankId || (bankId === 0)) {
            url += `&bank_code_id=${bankId}`
          }
          if (this.isSignin) {
            this.$router.replace('/account/orders/' + (this.orderNo || ''))
          } else {
            this.$router.replace('/cart')
          }
          if (this.$env.isWeApp) {
            window.wx && window.wx.miniProgram.navigateTo({
              url: `/pages/payment/go_pay?order_no=${this.orderNo}&payment_method_id=${id}&sum=${this.sum}`
            })
          } else {
            window.setTimeout(() => {
              window.location.href = url
            }, 150)
          }
        } else {
          this.fnClose()
        }
      }, 50)
    },
    goOnePay () {
      let nPayID = null
      let nBankID = null
      if (this.payMethods.thirdparty.length) {
        const oPay = this.payMethods.thirdparty[0]
        nPayID = oPay.id
        this.goPay(nPayID)
      } else if (this.payMethods.bank.length) {
        const oBank = this.payMethods.bank[0]
        nPayID = oBank.id
        nBankID = oBank.bank_code_id
        this.goPay(nPayID, nBankID)
      }
    },
    fnClose () {
      this.isOpen = false
      this.$emit('close')
    },
    fnCard () {
      this.isCard = !this.isCard
    }
  }
}
</script>

<style scoped>
  .yk-pay_popup-popup {
    padding: 0 0 60px;
    width: 100vw;
    min-height: 30vh;
    max-height: 70vh;
    background-color: #fff;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  .yk-pay_popup-bar_left {
    display: flex;
  }
  .yk-pay_popup-go_order {
    display: flex;
    /*font-size: 0;*/
    /*line-height: 1;*/
  }
  .yk-pay_popup-go_order.yu-btn--text {
    color: #999;
  }
  .yk-pay_popup-go_order_icon {
    padding: 0 20px;
    width: 15px;
  }
  .yk-pay_popup-go_order_icon.i-back {
    padding: 0 3px 0 10px;
  }
  .yk-pay_popup-back {
    margin: auto;
  }
  .yk-pay_popup-cell .yu-cell-inner {
    min-height: 26px;
    line-height: 26px;
  }
  .yk-pay_popup-cell_icon_wppay {
    color: #06c90b;
  }
  .yk-pay_popup-cell_icon_alipay {
    color: #00a0e9;
  }
  .yk-pay_popup-cell_icon_tenpay {
    color: #f98703;
  }
  .yk-pay_popup-cell_icon_kuaipay {
    color: #bf0012;
  }
  .yk-pay_popup-cell_icon_baifubao {
    color: #f31410;
  }
  .yk-pay_popup-cell_icon_card {
    color: #edb445;
  }
  .yk-pay_popup-cell:first-child .yu-cell-hr {
    border: none;
  }
  .yk-pay_popup-empty {
    padding: 60px 0;
    text-align: center;
    color: #999;
  }
</style>
