<docs>
## SearchButton Docs
</docs>

<todo>
* Resize 处理
* SearchBox 提升为 YouUI 全局性组件
  * 加 hash
</todo>

<tips>
* 为了输入体验，避免用 fixed
  * fixed 内有输入元素时，暂时兼容性不太好
</tips>

<template>
<div class="search-button">
  <div v-if="$slots.default" @click="fnShow"><slot></slot></div>
  <search-input v-else class="input" :has-cancel="false" @click.native="fnShow" :placeholder="placeholder"></search-input>
  <div class="view" :class="{'i-on': isShow}" ref="view">
    <SearchBox :is-show="isShow" type="inner" :placeholder="placeholder" @cancel="fnCancel" />
  </div>
</div>
</template>

<script>
import SearchInput from '@/components/Search/Input'
import SearchBox from '@/components/Search/Box'

export default {
  name: 'SearchButton',
  components: {
    SearchInput,
    SearchBox
  },
  props: {
    placeholder: {
      type: String,
      default: '请输入搜索内容'
    }
  },
  data () {
    return {
      isShow: false
    }
  },
  created () {
    this.isShow = false
  },
  methods: {
    setPosition () {
      const eCom = this.$el
      const eView = this.$refs.view
      eView.style.top = 0 - eCom.getBoundingClientRect().top + 'px'
      eView.style.left = 0 - eCom.getBoundingClientRect().left + 'px'
    },
    fnShow () {
      this.setPosition()
      this.isShow = true
      this.$refs.view.querySelector('form > input').focus()
    },
    fnCancel () {
      this.isShow = false
    }
  }
}
</script>

<style scoped>
.search-button {
  position: relative;
  -webkit-tap-highlight-color: transparent;
}
.input > input {
  pointer-events: none;
}
.view {
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;  /* 防止父元素不能用 overflow hidden 时的溢出 */
  height: 1px;
  background-color: #fff;
  opacity: 0;
  pointer-events: none;
  overflow: hidden;
}
.view.i-on {
  z-index: 1;
  opacity: 1;
  pointer-events: auto;
  width: 100vw;
  height: var(--100vh);
}
</style>
