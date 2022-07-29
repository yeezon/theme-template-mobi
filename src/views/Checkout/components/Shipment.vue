<docs>
## YkCheckoutShipment Docs
</docs>

<template>
<div class="yk-checkout_ship" data-com="YkCheckoutShipment">
  <YkCheckoutShipmentPro :carts="shipment.carts" />
  <YuCell v-if="shipment.id || shipment.id === 0" @click="fnOpen" :is-link="true">
    <span class="yk-checkout_ship-title" slot="label">
      <span v-if="order" class="yk-checkout_ship-title_pre">包裹 {{ order }}</span>
      <span class="yk-checkout_ship-title_cont">配送方式</span>
    </span>
    <span v-if="getShipType()"><span>{{getShipType()}}</span><span> - </span><span v-if="!getAmount()">免邮</span><YuCurrency v-else :val="getAmount()" /><span v-if="getDiscount()">（{{ getDiscount() }}）</span></span>
    <span v-else>请选择</span>
  </YuCell>
  <div v-else class="yk-checkout_ship-err">配送信息获取错误，请刷新重试</div>
  <YuPopup v-model="on">
    <div class="yk-checkout_ship-popup">
      <YuNavBar title="选择配送方式" :has-back="false" />
      <!-- Radio Input 不兼容 移动端，暂时用 Click -->
      <YuRadioGroup @input="function (val) { setMethod(val) }" :value="nSetMethodID" @click="fnClick">
        <YuRadio :key="oMethod.id" v-for="oMethod in shipment.shipment_methods" class="yk-radio" :val="oMethod.id"><span>{{getTypeDesc(oMethod.ship_type)}}</span><span> - </span><span v-if="!oMethod.amount">免邮</span><YuCurrency v-else :val="oMethod.amount" /><span v-if="oMethod.discount">（{{ oMethod.discount.name }}）</span></YuRadio>
      </YuRadioGroup>
    </div>
  </YuPopup>
</div>
</template>

<script>
import YkCheckoutShipmentPro from './ShipmentPro'

export default {
  name: 'YkCheckoutShipment',
  components: {
    YkCheckoutShipmentPro
  },
  props: {
    shipment: {
      type: Object,
      default () {
        return {}
      }
    },
    order: {
      type: Number,
      default: null
    }
  },
  data: function () {
    return {
      on: false,
      nSetMethodID: null,
      oMethodsMap: {}
    }
  },
  watch: {
    shipment () {
      this.initMethods()
    }
  },
  created () {
    this.initMethods()
  },
  methods: {
    initMethods () {
      // 选择默认配送方式
      if ((this.shipment.shipment_methods || []).length) {
        const shipMethods = this.shipment.shipment_methods
        let nDefMethodID = null

        for (const oShipMethod of shipMethods) {
          // 选择设置的默认配送方式（先进先出原则）
          if (!nDefMethodID && this.fnIsDefMethod(oShipMethod)) {
            nDefMethodID = oShipMethod.id
          }
          this.$set(this.oMethodsMap, oShipMethod.id, oShipMethod)
        }

        // 无指定默认配送方式，默认选第一个
        if (!nDefMethodID) {
          nDefMethodID = shipMethods[0].id
        }

        this.nSetMethodID = nDefMethodID
      }
      this.fnChange()
    },
    fnIsDefMethod (oShipMethod) {
      // 自定义默认配送方式
      // return (oShipMethod.ship_type === 1)  // 顺丰
      return false // 全返回 false，默认选择第一个
    },
    fnOpen () {
      this.on = true
    },
    fnClose () {
      this.on = false
    },
    fnClick (evt) {
      setTimeout(() => {
        this.fnClose()
      }, 300)
    },
    setMethod (nID) {
      this.nSetMethodID = nID
      this.fnChange()
    },
    getTypeDesc (shipType) {
      let _cont
      switch (shipType) {
        case 0 :
          _cont = '普通快递'
          break
        case 1 :
          _cont = '顺丰速运'
          break
        case 2 :
          _cont = 'EMS'
          break
        case 3 :
          _cont = '平邮/挂号信'
          break
        case 4 :
          _cont = '商家配送'
          break
        case 5 :
          _cont = '自提'
          break
        default:
          _cont = ''
      }
      return _cont
    },
    getShipType () {
      const _oShipMethod = this.oMethodsMap[this.nSetMethodID] || {}
      return this.getTypeDesc(_oShipMethod.ship_type)
    },
    getAmount () {
      const _oShipMethod = this.oMethodsMap[this.nSetMethodID] || {}
      return _oShipMethod.amount
    },
    getDiscount () {
      const _oShipMethod = this.oMethodsMap[this.nSetMethodID] || {}
      return (_oShipMethod.discount || {}).name || ''
    },
    fnChange () {
      const oData = {
        id: this.shipment.id || null,
        shipment_method_id: this.nSetMethodID,
        amount: this.getAmount()
      }
      this.$emit('change', oData)
    }
  }
}
</script>

<style scoped>
  .yk-checkout_ship {
    margin: 15px 0;
    background-color: #fff;
    border: 0 solid #d5d5d5;
    border-width: var(--1px) 0;
  }
  .yk-checkout_ship-err {
    margin: 0 15px;
    padding: 11px 0;
    line-height: 22px;
    color: #999;
    border: 0 solid #d5d5d5;
    border-width: var(--1px) 0 0;
  }
  .yk-checkout_ship-title {
    display: flex;
  }
  .yk-checkout_ship-title_pre {
    display: inline-block;
    margin: auto 6px auto 0;
    padding: 0 4px;
    background: #999;
    color: #fff;
    border-radius: 3px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
  }
  .yk-checkout_ship-title_cont {
    display: inline-block;
    vertical-align: middle;
  }
  .yk-checkout_ship-popup {
    width: 100vw;
    min-height: 30vh;
    background-color: #fff;
  }
  .yk-radio {
    padding: 10px 20px;
  }
</style>
