<docs>
## SearchView Docs
</docs>

<template>
<div class="search-view">
  <yu-header>
    <YuNavBar v-if="showNavBar" class="bar">
      <YuButton class="bar_btn i-back" @click="fnBack" type="text" slot="left"><YuIcon class="bar_icon" name="yu-icon-left" slot="icon" /></YuButton>
      <span>搜索</span>
      <YuButton class="bar_btn i-style" @click="nCols = (nCols === 2 ? 1 : 2)" type="text" slot="right"><YuIcon class="bar_icon" :name="nCols === 2 ? 't-icon-list_1' : 't-icon-list_2'" slot="icon" /></YuButton>
    </YuNavBar>
  </yu-header>
  <div class="search">
    <form class="box" action="#" @submit="fnSubmit">
      <YuIcon class="icon" name="yu-icon-search" slot="icon" />
      <input class="search-cont" :value="terms" @input="fnInput" type="search" placeholder="请输入搜索内容" />
      <YuButton class="cancel" type="text" @click="fnClear"><svg-icon name="close" slot="icon"></svg-icon></YuButton>
    </form>
    <YuButton class="submit" type="text" @click="fnSubmit">搜索</YuButton>
  </div>
  <div class="rules" @touchmove.prevent.stop>
    <YuButton class="rule" :class="{'i-on': nSort === 1}" @click="fnRule(1)" type="text">综合</YuButton>
    <YuButton class="rule" :class="{'i-on': nSort === 2}" @click="fnRule(2)" type="text">新品</YuButton>
    <YuButton class="rule" :class="{'i-on': nSort === 3}" @click="fnRule(3)" type="text">最热</YuButton>
    <YuButton class="rule" :class="{'i-on': nSort === 4 || nSort === 5, 'i-down': nSort === 4}" @click="fnRule(nSort === 5 ? 4 : 5)" type="text"><span>价格</span><svg class="icon_price" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path class="icon_price_down" d="M505.75037 1014.968743 794.710845 610.419022 216.789896 610.419022Z"></path><path class="icon_price_up" d="M505.75037 3.612503 216.789896 408.144161 794.710845 408.144161Z"></path></svg></YuButton>
  </div>
  <YuScrollView class="cont" @lower="fnLower">
    <div class="background_block"></div>
    <YuLoadTips v-if="!items.length" :is-loading="isLoading" :is-empty="!items.length" :is-error="!!errorTip" empty-text="没找到相关商品~" @retry="update" />
    <YuItems v-else class="items" :items="items" :cols="nCols" :spacing="6" :spacingY="nCols === 2 ? 18 : 10">
      <template slot-scope="scope" slot="item">
        <ProductItem :item="scope.item" :cols="nCols" />
      </template>
    </YuItems>
    <YuLowerTips v-if="items.length" class="tips" :has-more="hasMore" :is-loading="isLoading" more="下拉加载更多~" no-more="没有更多了~" loading="加载中.." />
  </YuScrollView>
  <div v-if="!showNavBar" class="footer_block"></div>
</div>
</template>

<script>
import ProductItem from '@/components/Product/Item'

export default {
  name: 'SearchView',
  components: {
    ProductItem
  },
  props: {
    showNavBar: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isLoading: false,
      errorTip: '',
      items: [],
      oQuery: {
        sort_type: 1
      },
      oPaging: {
        page: 1,
        per_page: 10,
        total_page: 1
      },
      nCols: 2,
      terms: ''
    }
  },
  computed: {
    nSort () {
      return this.oQuery.sort_type
    },
    hasMore () {
      return (this.oPaging.total_page > this.oPaging.page)
    }
  },
  watch: {
    errorTip (val) {
      // 滚动加载错误才用 Toast，首次加载用 DOM 提示
      if (this.nPage > 1 && val) {
        this.$toast.info(val)
      }
    }
  },
  created () {
    this.terms = this.$route.query.terms || ''

    this.update()
  },
  methods: {
    getProducts (nPage) {
      if (this.isLoading) return

      this.isLoading = true

      // const handle = this.$route.params.handle
      const _oPaging = this.oPaging
      const _oQuery = this.oQuery

      const oConfig = {
        search: this.terms || '',
        page: nPage || _oPaging.page || 1,
        per_page: _oPaging.per_page || 10
      }

      switch (_oQuery.sort_type) {
        case 2:
          oConfig.so = 'date_desc'
          break
        case 3:
          oConfig.so = 'sale_desc'
          break
        case 4:
          oConfig.so = 'price_asc'
          break
        case 5:
          oConfig.so = 'price_desc'
          break
        default:
          break
      }

      this.$sdk.product.get(oConfig, oRes => {
        oRes = oRes.res || {}

        if (oRes.code === 200) {
          const _items = oRes.products || []

          // 1 时没意义，直接重置，方便其他功能
          if (nPage > 1) {
            this.items = this.items.concat(_items)
          } else {
            this.items = _items
          }

          const _oPaging = oRes.paging || {}
          this.oPaging = {
            page: _oPaging.view || 1,
            per_page: _oPaging.size || 10,
            total_page: _oPaging.pages || 1
          }
        } else {
          this.errorTip = '获取数据失败'
        }

        this.isLoading = false
      })
    },
    update () {
      this.getProducts()
    },
    fnBack () {
      this.$router.back()
    },
    fnRule (type) {
      const _oQuery = this.oQuery

      if (_oQuery.sort_type !== type && !this.isLoading) {
        _oQuery.sort_type = type
        this.getProducts()
      }
    },
    fnLower () {
      if (this.hasMore) {
        this.getProducts(this.oPaging.page + 1)
      }
    },
    fnSubmit (evt) {
      if (evt) {
        // 输入法 Enter 显示「搜索」需要 form 和 action
        evt.preventDefault()
        evt.stopPropagation()
      }

      const _terms = this.terms || ''

      this.getProducts(1)

      if (_terms) {
        const _searchTags = window.localStorage.getItem('search_tags')

        let _tags = []

        try {
          _tags = JSON.parse(_searchTags || '[]')
        } catch (e) {
          _tags.push(_searchTags)
        }

        _tags.push(_terms)

        // 去重
        _tags = [...(new Set(_tags))]

        window.localStorage.setItem('search_tags', JSON.stringify(_tags))
      }

      return false // 不确定各浏览器机制，最好返回一下 false
    },
    fnInput (evt) {
      this.terms = evt.target.value || ''
    },
    fnClear () {
      this.terms = ''
      this.fnSubmit()
    }
  }
}
</script>

<style scoped>
.search-view {
  display: flex;
  flex-direction: column;
  height: var(--100vh);
  background-color: #f6f4f9;
}
.background_block {
  height: 10px;
}
.bar_btn {
  padding: 0 14px;
  height: 100%;
  color: #9e9e9e;
}
.bar_btn.i-back {
  padding-right: 21px;
}
.bar_btn.i-style {
  margin: 0;
}
.bar_btn:active {
  color: #9e9e9e;
  opacity: .7;
}
.bar_icon {
  width: 18px;
  height: 18px;
}
.bar_btn.i-back .bar_icon {
  width: 15px;
  height: 15px;
}
.bar_btn.i-style .bar_icon {
  width: 17px;
  height: 17px;
}

.search {
  display: flex;
  padding: 10px 15px;
  border: 0 solid #e0e0e0;
  border-width: 0 0 var(--1px);
  background-color: #fff;
}
.box {
  flex: 1;
  display: flex;
  padding: 0 15px 0 15px;
  height: 36px;
  -webkit-tap-highlight-color: transparent;
  align-items: center;
  background-color: #f6f4f9;
  border-radius: 18px;
}
.search-cont {
  /*-webkit-appearance: none;*/
  box-sizing: border-box;
  flex: 1;
  border: none;
  border-radius: 0;
  line-height: 22px;
  font-size: 14px;
  background-color: #f6f4f9;
  color: #bebebe;
}
.cancel {
  padding: 0 0 0 15px;
  color: #d6d6d6;
  font-size: 15px;
}
.icon {
  margin: 0 5px 0 0;
  font-size: 16px;
  color: #9e9e9e;
}
.submit {
  display: inline-block;
  padding: 0 0 0 15px;
  line-height: 1em;
  font-size: 14px;
  color: #333;
}

.cont {
  flex: 1;
  background-color: var(--backgroundColor)
}
.items {
  padding: 10px;
  background-color: #fff;
}
.tips {
  margin: 20px auto 30px;
  text-align: center;
  color: #9e9e9e;
}
.rules {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  background-color: #fff;
}
.rule {
  display: flex;
  position: relative;
  padding: 0 7px;
  height: 46px;
  color: inherit;
}
.rule.i-on,
.rule:active {
  color: #df3311;
}
.rule.i-on::after {
  content: "\20";
  display: block;
  position: absolute;
  left: 0;
  bottom: -0.5px;
  background-color: #df3311;
  width: 100%;
  height: 3px;
  line-height: 0;
  font-size: 0;
}

.icon_price {
  display: inline-block;
  margin: 0 0 0 2px;
  color: #9e9e9e;
  fill: currentColor;
  width: 11px;
  height: 11px;
}
.rule.i-on .icon_price {
  color: inherit;
}
.rule.i-on .icon_price_down {
  fill: #9e9e9e;
}
.rule.i-on.i-down .icon_price_up {
  fill: #9e9e9e;
}
.rule.i-on.i-down .icon_price_down {
  fill: currentColor;
}

.footer_block {
  height: calc(var(--tabBar) + var(--homeIndicator));
  background-color: #fff;
}
</style>
