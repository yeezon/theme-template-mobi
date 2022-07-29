<docs>
## SearchBox Docs
</docs>

<template>
<div class="search-box">
  <yu-status-bar></yu-status-bar>
  <div class="search-bar" @touchmove.prevent.stop>
    <search-input class="search-ipt" @cancel="fnCancel" :placeholder="placeholder"></search-input>
  </div>
  <yu-scroll-view class="search-cont">
    <search-tags></search-tags>
    <product-likes v-if="isShow"></product-likes>
    <div class="bar-blank"></div>
  </yu-scroll-view>
</div>
</template>

<script>
import SearchInput from '@/components/Search/Input'
import ProductLikes from '@/components/Product/Likes'
import SearchTags from '@/components/Search/Tags'

export default {
  name: 'SearchBox',
  components: {
    SearchInput,
    ProductLikes,
    SearchTags
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请输入搜索内容'
    }
  },
  methods: {
    fnCancel () {
      this.$emit('cancel', true)
    }
  }
}
</script>

<style scoped>
.search-box {
  display: flex;
  flex-direction: column;
  height: var(--100vh);
  background-color: #f6f4f9;
}
.search-ipt {
  padding: 10px 15px;
  border: 0 solid #d5d5d5;
  border-width: 0 0 var(--1px);
}
.search-cont {
  flex: 1;
}
.bar-blank {
  padding: 20px 0 0;
  height: var(--tabBar);
  background-color: #fff;
}
</style>
