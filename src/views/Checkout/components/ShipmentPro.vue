<docs>
## YkCheckoutShipmentPro Docs

## To-do List

* 商品图片加链接

## 兼容组件

* CheckoutShipments
* AccountOrder

</docs>

<template>
<div class="yk-checkout_shipment_pro" data-com="YkCheckoutShipmentPro">
  <div v-for="pro in carts" class="yk-checkout_shipment_pro-item" :key="pro.id">
    <!-- AccountOrder 使用的是 feature_image -->
    <!-- 有可能 feature_image 对象里的属性直接在 product 对象 -->
    <div class="yk-img"><img :src="pro.image_src || imgURL(pro.feature_image || {})" :alt="pro.name" /></div>
    <div class="yk-info">
      <div class="yk-name">{{pro.name}}</div>
      <div class="yk-sku">{{pro.options_desc.replace(',', ' ')}}</div>
    </div>
    <div class="yk-count"><YuCurrency class="yk-price" :val="pro.price" /><br><span class="yk-times">&times;{{pro.quantity}}</span></div>
  </div>
</div>
</template>

<script>
export default {
  componentName: 'YkCheckoutShipmentPro',
  props: {
    carts: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    imgURL (img, size = 'w300h300') {
      // Base64 SVG 像素比例占位图
      if (typeof img === 'object') {
        return this.$sdk.util.getImageUrl(img.image_id, img.image_name, size, img.image_epoch)
      } else {
        return this.$sdk.util.getImageUrl(img, 's.png', size)
      }
    }
  }
}
</script>

<style scoped>
  .yk-checkout_shipment_pro-item {
    display: flex;
    padding: 13px 15px;
  }
  .yk-checkout_shipment_pro .yk-img {
    position: relative;
    width: 70px;
    height: 70px;
  }
  .yk-checkout_shipment_pro .yk-img img {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    max-width: 100%;
    max-height: 100%;
  }
  .yk-checkout_shipment_pro .yk-info {
    margin: auto;
    padding: 0 10px;
    flex: 1;
    line-height: 1;
    font-size: 12px;
  }
  .yk-checkout_shipment_pro .yk-name {
    display: -webkit-box;
    margin: 0 0 4px;
    max-height: 32px;
    line-height: 16px;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
  }
  .yk-checkout_shipment_pro .yk-sku {
    display: -webkit-box;
    max-height: 32px;
    line-height: 16px;
    color: #999;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
  }
  .yk-checkout_shipment_pro .yk-count {
    text-align: right;
    font-weight: bold;
    line-height: 1;
  }
  .yk-checkout_shipment_pro .yk-price {
    display: inline-block;
    line-height: 18px;
  }
  .yk-checkout_shipment_pro .yk-times {
    color: #777;
  }
</style>
