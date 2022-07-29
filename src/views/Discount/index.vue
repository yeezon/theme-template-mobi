<docs>
## DiscountView Docs
</docs>

<todo>
* 没接口，暂时先用 Liquid 数据
* 暂时先将全局 size 设置到最大
</todo>

<template>
  <div class="discount-view" data-com="DiscountView">
    <yu-header :is-fixed="true">
      <YuNavBar class="s-bar">
        <YuButton class="s-bar_btn i-back" @click="fnBack" type="text" slot="left"><YuIcon class="s-bar_icon" name="yu-icon-left" slot="icon" /></YuButton>
        <span>{{ oDiscount.name || oMarketing.title }}</span>
        <YuButton class="s-bar_btn i-style" @click="nCols = (nCols === 2 ? 1 : 2)" type="text" slot="right"><YuIcon class="s-bar_icon" :name="nCols === 2 ? 't-icon-list_1' : 't-icon-list_2'" slot="icon" /></YuButton>
      </YuNavBar>
    </yu-header>
    <YuScrollView class="s-cont" @lower="fnLower">
      <YuLoadTips :is-loading="isLoading" :is-empty="!isLoading && !err && !products.length" :is-error="!isLoading && !!err" empty-text="没找到相关商品~" @retry="update" />
      <template v-if="!isLoading">
        <div class="s-details">
          <template v-if="oMarketing.id">
            <!-- 新营销活动 -->
            <s-limit :marketing="oMarketing"></s-limit>
          </template>
          <template v-else>
            <!-- 旧营销活动 -->
            <template v-for="(oActive, index) of oDiscount.details">
              <div class="s-details_item" :key="index + oDiscount.discount_type" v-if="oDiscount.discount_type === 'amount_off'">
                <span>{{ oActive.type_id === 1 ? '每满' : '满' }} <YuCurrency :val="oActive.active_amount" /> 减<YuCurrency :val="oActive.discount_amount" /></span>
              </div>
              <div class="s-details_item" :key="index + oDiscount.discount_type" v-else-if="oDiscount.discount_type === 'percent_off'">
                <span v-if="oActive.type_id === 1">满 {{ oActive.active_amount }} 件 打 {{ (oActive.discount_percent / 10).toFixed(1) }} 折</span>
                <span v-else>满 <YuCurrency :val="oActive.active_amount" /> 打 {{ (oActive.discount_percent / 10).toFixed(1) }} 折</span>
              </div>
              <div class="s-details_item" :key="index + oDiscount.discount_type" v-else-if="oDiscount.discount_type === 'coupon'">满 <YuCurrency :val="oActive.active_amount" /> 赠送 <YuCurrency :val="oActive.coupon_discount_amount" /> 优惠券</div>
              <div class="s-details_item" :key="index + oDiscount.discount_type" v-else-if="oDiscount.discount_type === 'free_shipping'"><span v-if="oActive.active_amount === 0">免邮促销</span><span v-else>满 <YuCurrency :val="oActive.active_amount" /> 享受免邮促销</span></div>
            </template>
          </template>
        </div>
        <YuItems class="s-items" :items="products" :cols="nCols" :spacing="6" :spacingY="nCols === 2 ? 18 : 10">
          <template slot-scope="scope" slot="item">
            <ProductItem :item="scope.item" :cols="nCols" :show-tag="false" />
          </template>
        </YuItems>
        <YuLowerTips v-if="products.length > 4" class="s-tips" :has-more="hasMore" :is-loading="isLoading" more="下拉加载更多~" no-more="没有更多了~" loading="加载中.." />
      </template>
    </YuScrollView>
  </div>
</template>

<script>
import sLimit from './components/Limit'
import ProductItem from '@/components/Product/Item'

export default {
  name: 'DiscountView',
  components: {
    sLimit,
    ProductItem
  },
  data () {
    return {
      isLoading: false,
      err: '',
      handle: '',
      oDiscount: {},
      oMarketing: {},
      products: [],
      nCols: 2,
      oPaging: {
        items: 0,
        pages: 1,
        size: 20,
        view: 1
      }
    }
  },
  computed: {
    hasMore () {
      return (this.oPaging.pages > this.oPaging.view)
    }
  },
  watch: {
    err (val) {
      // 滚动加载错误才用 Toast，首次加载用 DOM 提示
      if (this.nPage > 1 && val) {
        this.$toast.info(val)
      }
    }
  },
  created () {
    this.handle = this.$route.params.handle || ''
    this.getDiscounts()
  },
  methods: {
    getDiscounts (nPage) {
      this.isLoading = true

      this.$sdk.discount.get(this.handle, ({ res: oRes }) => {
        this.isLoading = false

        if (oRes.code === 200) {
          const _oData = ((oRes || {}).msg || {}).results || {}

          this.nDiscountType = _oData.c_id || null
          this.oDiscount = _oData.discount || {}
          this.oMarketing = _oData.info || {}
          this.products = _oData.products || []
          this.oPaging = _oData.paging || {
            items: _oData.total_count || 0,
            pages: _oData.total_page || 1,
            size: 20,
            view: 1
          }
        } else {
          this.err = '加载数据失败..'
        }
      })
    },
    update () {
      this.getDiscounts()
    },
    fnBack () {
      this.$router.back()
    },
    fnLower () {
      // if (this.hasMore) return
    }
  }
}
</script>

<style scoped>
.discount-view {
  display: flex;
  flex-direction: column;
  height: var(--100vh);
}
.s-bar_btn {
  padding: 0 14px;
  height: 100%;
  color: #9e9e9e;
}
.s-bar_btn.i-back {
  padding-right: 21px;
}
.s-bar_btn.i-style {
  margin: 0;
}
.s-bar_btn:active {
  color: #9e9e9e;
  opacity: .7;
}
.s-bar_search {
  padding-right: 7px;
  -webkit-tap-highlight-color: transparent;
}
.s-bar_search .s-bar_icon {
  color: #9e9e9e;
}
.s-bar_search:active .s-bar_icon {
  opacity: .7;
}
.s-bar_icon {
  width: 18px;
  height: 18px;
}
.s-bar_btn.i-back .s-bar_icon {
  width: 15px;
  height: 15px;
}
.s-bar_btn.i-style .s-bar_icon {
  width: 17px;
  height: 17px;
}
.s-details {
  overflow: hidden;
  border: 0 solid #e0e0e0;
  border-width: 0 0 var(--1px);
  background-color: #fff;
}
.s-details_item {
  margin: 1em 0;
  padding: 0 10px;
  text-align: center;
  line-height: 1;
}
.s-cont {
  flex: 1;
  background-color: #fff;
}
.s-items {
  padding: 10px;
}
.s-tips {
  margin: 20px auto 30px;
  text-align: center;
  color: #9e9e9e;
}
</style>
