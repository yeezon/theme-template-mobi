<docs>
## YuCurrency Docs

* 一个页面可能显示多种货币，所以货币符号直接输出成单个元素
* 利用 slot 避免 toFixed(2) 问题（自己控制精度）
* 完善，window.isFinite() And Number.isFinite()
  * 可以判断 0
  * window.isFinite() 忽略类型
    * window.isFinite('1') => true
    * Number.isFinite('1') => false
* 支持负值
* Currency 过滤器
  * `:value="scope.row.selling_price | currency"`
</docs>

<template>
  <span class="yu-currency" data-com="YuCurrency"><span v-if="val < 0">-</span><i v-if="symbol" class="yu-currency-symbol">{{symbol}}</i><span>{{ Math.abs(val / 100).toFixed(decimal) }}</span></span>
</template>

<script>
export default {
  name: 'YuCurrency',
  props: {
    val: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: 'CNY' // 根据 $shop.currency
    },
    symbol: {
      type: String,
      default: '￥' // 根据 $shop.currency_symbol
    },
    decimal: {
      type: Number,
      default: 2
    }
  }
}
</script>

<style>
  .yu-currency {
    display: inline-block;
    text-decoration: inherit;
  }
  .yu-currency span {
    display: inline-block;
    text-decoration: inherit;
  }
  .yu-currency-symbol {
    display: inline-block;
    font-family: 'Arial';
    font-style: normal;
    text-decoration: none;
  }
</style>
