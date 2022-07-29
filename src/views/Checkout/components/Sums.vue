<docs>
## YkCheckoutSums Docs

## 兼容组件

* CheckoutView
* AccountOrder

</docs>

<template>
<div class="yk-checkout_sums" data-com="YkCheckoutSums">
  <div class="yk-checkout_sums-item">
    <span>商品金额总计</span>
    <YuCurrency class="yk-checkout_sums-count" :val="data.oRes.item_amount" />
  </div>
  <div class="yk-checkout_sums-item">
    <span>运费总计</span>
    <YuCurrency class="yk-checkout_sums-count" :val="data.oRes.shipment_amount" />
  </div>
  <template v-if="discount.discounts && discount.discounts.length > 0">
    <template v-for="(dis, index) in discount.discounts">
      <div :key="index" v-if="dis.discount_amount" class="yk-checkout_sums-item">
        <span>{{ dis.name }}</span>
        <span class="yk-checkout_sums-count"><YuCurrency :val="-dis.discount_amount" /></span>
      </div>
    </template>
  </template>
  <!-- 订单详情记录 -->
  <template v-if="records.length > 0">
    <template v-for="(oRecord, index) in records">
      <div :key="index" v-if="oRecord.amount" class="yk-checkout_sums-item">
        <span>{{ oRecord.name }}</span>
        <span class="yk-checkout_sums-count"><YuCurrency :val="-oRecord.amount" /></span>
      </div>
    </template>
  </template>
  <div v-if="coupon.code" class="yk-checkout_sums-item">
    <span>优惠券</span>
    <span class="yk-checkout_sums-count"><YuCurrency :val="-couponSum" /></span>
  </div>
  <!-- 会员优惠 -->
  <div v-if="data.oRes.level_discount_amount" class="yk-checkout_sums-item">
    <span>会员优惠</span>
    <span class="yk-checkout_sums-count"><YuCurrency :val="-data.oRes.level_discount_amount" /></span>
  </div>
  <!-- 积分抵现 -->
  <div v-if="data.oRes.point_disocunt_amount" class="yk-checkout_sums-item">
    <span>积分抵现</span>
    <span class="yk-checkout_sums-count"><YuCurrency :val="-data.oRes.point_disocunt_amount" /></span>
  </div>
  <template v-if="Object.keys(data.others).length">
    <template v-for="(item, index) in data.others">
      <div :key="index" v-if="item.amount" class="yk-checkout_sums-item">
        <span>{{ item.name }}</span>
        <span class="yk-checkout_sums-count"><YuCurrency :val="item.amount" /></span>
      </div>
    </template>
  </template>
  <div v-if="(data.fix_amount || data.fix_amount === 0) && data.fix_amount !== data.oRes.final_amount && !data.Calc" class="yk-checkout_sums-item">
    <span>原价</span>
    <YuCurrency class="yk-checkout_sums-count yk-total" :val="data.oRes.final_amount" />
  </div>
  <div class="yk-checkout_sums-item">
    <span>实付金额</span>
    <YuCurrency class="yk-checkout_sums-count yk-total" :val="data.fix_amount || data.oRes.final_amount" />
  </div>
</div>
</template>

<script>
export default {
  componentName: 'YkCheckoutSums',
  props: {
    discount: {
      type: Object,
      default: function () {
        return {}
      }
    },
    coupon: {
      type: Object,
      default: function () {
        return {}
      }
    },
    records: {
      type: Array,
      default () {
        return []
      }
    },
    data: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  computed: {
    couponSum () {
      return this.coupon.discount_amount || 0
    }
  }
}
</script>

<style scoped>
  .yk-checkout_sums {
    padding: 13px 15px;
    background-color: #fff;
  }
  .yk-checkout_sums .yk-checkout_sums-item {
    display: flex;
    line-height: 26px;
  }
  .yk-checkout_sums .yk-checkout_sums-count {
    flex: 1;
    padding: 0 0 0 15px;
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .yk-checkout_sums .yk-total {
    color: #f44;
    font-weight: bold;
  }
</style>
