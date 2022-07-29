<docs>
## YkAccountOrdersNav Docs
</docs>

<template>
  <div class="yk-account_orders_nav" data-com="YkAccountOrdersNav">
    <YuCell class="yk-account_orders_nav-title" label="我的订单" :is-link="false">
      <YkIcon class="icon_order" name="order" slot="icon" />
    </YuCell>
    <div class="yk-account_orders_nav-links">
      <button @click="fnTo('/account/orders')" class="yk-account_orders_nav-link">
        <YkIcon name="order_all" />
        <span class="yk-account_orders_nav-cont">
          <span>全部订单</span>
        </span>
      </button>
      <button @click="fnTo('/account/orders#wait_pay')" class="yk-account_orders_nav-link">
        <YkIcon name="order_wait_pay" />
        <span class="yk-account_orders_nav-cont">
          <span>待付款</span>
          <span v-if="waitPay" class="yk-account_orders_nav-tip">{{ waitPay }}</span>
        </span>
      </button>
      <button @click="fnTo('/account/orders#wait_get')" class="yk-account_orders_nav-link">
        <YkIcon name="order_wait_get" />
        <span class="yk-account_orders_nav-cont">
          <span>待收货</span>
          <span v-if="waitGet" class="yk-account_orders_nav-tip">{{ waitGet }}</span>
        </span>
      </button>
      <button @click="fnTo('/account/orders#completed')" class="yk-account_orders_nav-link">
        <YkIcon name="order_completed" />
        <span class="yk-account_orders_nav-cont">
          <span>已完成</span>
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import YkIcon from '@/components/Icon'

export default {
  componentName: 'YkAccountOrdersNav',
  components: {
    YkIcon
  },
  props: {
    waitPay: {
      type: Number,
      default: null
    },
    waitGet: {
      type: Number,
      default: null
    }
  },
  methods: {
    fnTo (path) {
      this.$emit('to', path)
    }
  }
}
</script>

<style scoped>
  .yk-account_orders_nav-title {
    border: 0 solid #d5d5d5;
    border-width: 0 0 var(--1px);
  }
  .yk-account_orders_nav-title .yk-icon {
    color: #999;
  }
  .yk-account_orders_nav-links {
    display: flex;
    padding: 0 15px;
  }
  .yk-account_orders_nav-link {
    flex: 1;
    display: block;
    margin: 0;
    padding: 14px 0;
    outline: none;
    border: none;
    background-color: #fff;
  }
  .yk-account_orders_nav-link > .yk-icon {
    display: block;
    margin: 0 auto 8px;
    width: 30px;
    height: 30px;
    color: #999;
  }
  .yk-account_orders_nav-cont span {
    display: inline-block;
    font-size: 12px;
  }
  .yk-account_orders_nav-cont {
    position: relative;
    display: inline-block;
  }
  .yk-account_orders_nav-tip {
    position: absolute;
    top: -43px;
    right: -8px;
    width: 16px;
    height: 16px;
    line-height: 16px;
    border: 1.5px solid currentColor;
    border-radius: 50%;
    color: #f44;
    background-color: #fff;
    font-size: 10px;
    font-weight: bold;
  }
  .icon_order {
    font-size: 20px;
  }
</style>
