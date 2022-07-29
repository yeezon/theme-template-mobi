<docs>
## YuLowerTips Docs
</docs>

<template>
<div class="yu-lower_tips" data-com="YuLowerTips">
  <div class="yu-lower_tips-cont" v-if="isLoading">加载中..</div>
  <div class="yu-lower_tips-cont" v-else>{{ hasMore ? '下拉加载更多~' : '没有更多了~' }}</div>
</div>
</template>

<script>
export default {
  name: 'YuLowerTips',
  props: {
    hasMore: {
      type: Boolean,
      default: true
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    more: {
      type: String,
      default: ''
    },
    noMore: {
      type: String,
      default: ''
    },
    loading: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>
  .yu-lower_tips-cont {
    margin: auto;
    text-align: center;
  }
</style>
