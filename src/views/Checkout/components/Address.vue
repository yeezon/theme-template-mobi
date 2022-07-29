<docs>
## YkCheckoutAddress Docs
</docs>

<template>
  <div class="yk-checkout-address" @click="goTo" data-com="YkCheckoutAddress">
    <YuIcon class="yk-checkout-address_icon" name="yk-icon-address" />
    <div class="yk-checkout-address-info">
      <template v-if="address.id || address.district_code">
        <div class="yk-checkout-address-top">
          <span class="yk-checkout-address-name">{{ address.name }}</span>
          <span class="yk-checkout-address-phone">{{ address.mobile || address.telephone }}</span>
        </div>
        <div class="yk-checkout-address-address">{{ (address.location_full_titles || '').replace(/,/g, ' ') }}</div>
        <div class="yk-checkout-address-address_detail">{{ address.detail }}</div>
      </template>
      <div v-else>添加地址</div>
    </div>
    <YuIcon class="yk-checkout-address-arrow" name="yu-icon-right" />
  </div>
</template>

<script>
export default {
  componentName: 'YkCheckoutAddress',
  props: {
    address: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    goTo () {
      const oQuery = {}

      if (this.address.id) {
        oQuery.id = this.address.id
      }

      this.$router.push({
        path: '/account/addresses_select',
        query: oQuery
      })
    }
  }
}
</script>

<style scoped>
  .yk-checkout-address {
    display: flex;
    margin: 0 0 15px;
    padding: 0 15px;
    border: 0 solid #d5d5d5;
    border-width: 0 0 var(--1px);
    background-color: #fff;
    -webkit-tap-highlight-color: transparent;
    transition: background-color .3s ease-out;
  }
  .yk-checkout-address:active {
    transition: none;
    background-color: #e6e6e6;
  }
  .yk-checkout-address-info {
    flex: 1;
    margin: auto;
    padding: 15px 0;
    overflow: hidden;
  }
  .yk-checkout-address_icon {
    margin: auto;
    padding: 0 12px 0 0;
    width: 24px;
    height: 24px;
    color: #999;
  }
  .yk-checkout-address-top {
    display: flex;
    margin: 0 0 8px;
    font-weight: bold;
    line-height: 20px;
  }
  .yk-checkout-address-name,
  .yk-checkout-address-phone {
    margin: auto 10px auto 0;
    font-size: 16px;
  }
  .yk-checkout-address-address {
    margin: 0 0 5px;
    line-height: 1;
    font-size: 13px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .yk-checkout-address-address_detail {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .yk-checkout-address-arrow {
    margin: auto auto auto 15px;
    color: #999;
    width: 16px;
    height: 16px;
  }
</style>
