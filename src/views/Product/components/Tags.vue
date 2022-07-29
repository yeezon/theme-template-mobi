<docs>
## ProductTags Docs
</docs>

<template>
<div v-if="isShow" class="product-tags">
  <div class="items">
    <div v-if="oSetting.product_service_tags_1" class="item"><svg-icon class="icon" name="check"></svg-icon><span class="name">{{ oSetting.product_service_tags_1 }}</span></div>
    <div v-if="oSetting.product_service_tags_2" class="item"><svg-icon class="icon" name="check"></svg-icon><span class="name">{{ oSetting.product_service_tags_2 }}</span></div>
    <div v-if="oSetting.product_service_tags_3" class="item"><svg-icon class="icon" name="check"></svg-icon><span class="name">{{ oSetting.product_service_tags_3 }}</span></div>
    <div v-if="oSetting.product_service_tags_4" class="item"><svg-icon class="icon" name="check"></svg-icon><span class="name">{{ oSetting.product_service_tags_4 }}</span></div>
    <!-- <YuIcon class="icon_right" name="yu-icon-right" /> -->
  </div>
</div>
</template>

<script>
export default {
  name: 'ProductTags',
  computed: {
    isShow () {
      const _oSetting = window.$$settings || {}

      return (_oSetting.product_service_tags_1 || _oSetting.product_service_tags_2 || _oSetting.product_service_tags_3 || _oSetting.product_service_tags_4)
    },
    oSetting () {
      return window.$$settings || {}
    }
  }
}
</script>

<style scoped>
.items {
  display: flex;
  padding: 10px 18px;
  line-height: 1;
  font-size: 0;
  background-color: #fff;
  color: #595959;
  align-items: center;
  justify-content: space-between;
  border: var(--1px) solid #e1e3e7;
  border-radius: 4px;
  box-shadow: 0 0 3px 0 rgba(96, 109, 143, 0.1);
}
.item {
  line-height: 16px;
  vertical-align: middle;
}
.icon {
  display: inline-block;
  margin: 0 5px 0 0;
  color: #fe384f;
  font-size: 13px;
  vertical-align: middle;
}
.name {
  font-size: 13px;
  vertical-align: middle;
}
.icon_right {
  color: #b3b3b3;
  width: 10px;
  height: 10px;
}
</style>
