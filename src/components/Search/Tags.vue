<docs>
## SearchTags Docs
</docs>

<template>
<div class="search-tags" v-if="tags.length">
  <div class="nav"><span>历史搜索</span><yu-button type="text" class="del" @click="fnClear"><svg-icon name="delete"></svg-icon></yu-button></div>
  <div class="tags">
    <span class="tag" v-for="(tag, index) in tags" @click="goTag(tag)" :key="index">{{ tag }}</span>
  </div>
</div>
</template>

<script>
export default {
  name: 'SearchTags',
  data () {
    return {
      tags: []
    }
  },
  created () {
    this.getTags()
  },
  methods: {
    getTags () {
      this.tags = JSON.parse(window.localStorage.getItem('search_tags') || '[]')
    },
    goTag (val) {
      if (val) {
        this.$router.push({
          path: '/search',
          query: {
            terms: val
          }
        })
      }
    },
    fnClear () {
      window.localStorage.setItem('search_tags', JSON.stringify([]))

      this.getTags()
    }
  }
}
</script>

<style scoped>
.search-tags {
  margin: 0 0 10px;
  background-color: #fff;
}
.nav {
  padding: 15px;
  font-size: 0;
  line-height: 0;
}
.nav span {
  display: inline-block;
  line-height: 16px;
  font-size: 12px;
  color: #999;
}
.del {
  float: right;
  color: #999;
  font-size: 15px;
}
.tags {
  margin: 0 15px 5px;
}
.tag {
  display: inline-block;
  margin: 0 10px 10px 0;
  padding: 0 15px;
  border-radius: 15px;
  line-height: 30px;
  font-size: 14px;
  background-color: #ededed;
  color: #666;
}
.tag:active {
  opacity: .7;
}
</style>
