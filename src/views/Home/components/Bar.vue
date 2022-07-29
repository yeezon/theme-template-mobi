<docs>
## HomeBar Docs
</docs>

<template>
<div class="home-bar">
  <div class="box">
    <search-button class="search" placeholder="搜索你想要的商品">
      <div class="input"><svg-icon class="icon" name="search"></svg-icon><span>宝贝名称/关键词</span></div>
    </search-button>
  </div>
</div>
</template>

<script>
import SearchButton from '@/components/Search/Button'

export default {
  name: 'HomeBar',
  components: {
    SearchButton
  }
}
</script>

<style scoped>
.home-bar {
  height: calc(17px * 2 + 40px);
}
.box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #fb544e;
  z-index: 1;
}
.search {
  padding: 17px 15px;
}
.input {
  display: flex;
  height: 40px;
  border: none;
  border-radius: 20px;
  background-color: #fff;
  color: #bebebe;
  align-items: center;
  justify-content: center;
}
.icon {
  display: inline-block;
  line-height: 1;
  font-size: 16px;
}
.input > span {
  display: inline-block;
  margin: 0 0 0 8px;
  line-height: 1;
  font-size: 14px;
}
</style>
