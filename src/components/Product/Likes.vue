<docs>
## ProductLikes Docs

* 去重，不然报错
</docs>

<template>
<div class="product-likes">
  <div class="header">
    <div class="title">猜你喜欢</div>
    <div class="desc">Guess you like</div>
  </div>
  <yu-items class="items" v-if="items.length" :items="items" :cols="2" :spacing="15" :spacingY="18">
    <template slot-scope="scope" slot="item">
      <product-item :item="scope.item" :cols="2" size="165x165"></product-item>
    </template>
  </yu-items>
  <lower-blank @lower="fnNextPage"></lower-blank>
</div>
</template>

<script>
import Products from '@/api/v1/products'

import ProductItem from '@/components/Product/Item'
import LowerBlank from '@/components/Lower/Blank'

export default {
  name: 'ProductLikes',
  components: {
    ProductItem,
    LowerBlank
  },
  data () {
    return {
      isLoading: false,
      errorTip: '',
      items: [],
      oQuery: {
        sort_type: 1,
        page: 1,
        per_page: 4
      },
      oPaging: {
        current_page: 1,
        per_page: 4,
        total_page: 1,
        total_count: 0
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.getItems()
    },
    fnNextPage () {
      // 无限循环
      this.getItems(1)
    },
    getItems (nPage) {
      if (this.isLoading) return

      this.isLoading = true

      const _oConfig = {}
      const _oQuery = this.oQuery

      for (const key in _oQuery) {
        const _val = _oQuery[key]
        if (_val || _val === 0) {
          _oConfig[key] = _val
        }
      }

      _oConfig.page = 1
      _oConfig.per_page = nPage ? 4 : 6

      Products.likes(_oConfig).then(({ data }) => {
        const _items = data.products || []

        // 无限循环
        if (nPage > 0) {
          this.items = this.items.concat(_items)
        } else {
          this.items = _items
        }
        this.oPaging = {
          current_page: data.current_page || 1,
          per_page: data.per_page || 4,
          total_page: data.total_page || 1,
          total_count: data.total_count || 0
        }
      }).catch(oError => {
        this.errorTip = oError.message || '获取数据失败'
      }).finally(() => {
        this.isLoading = false
      })
    }
  }
}
</script>

<style scoped>
.product-likes {
  background-color: #fff;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
}
.title {
  font-size: 18px;
  font-weight: bold;
  color: #393939;
}
.desc {
  font-size: 12px;
  color: #989898;
}
.items {
  margin: 0 15px;
}
</style>
