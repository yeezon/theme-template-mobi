<docs>
## SearchInput Docs
</docs>

<template>
<div class="search-input">
  <form class="box" action="#" @submit="fnSubmit">
    <input class="cont" :value="terms" @input="fnInput" type="search" :placeholder="placeholder" />
    <YuButton class="submit" type="text" @click="fnSubmit"><YuIcon name="yu-icon-search" slot="icon" /></YuButton>
  </form>
  <YuButton class="cancel" type="text" @click="fnCancel">取消</YuButton>
</div>
</template>

<script>
export default {
  name: 'SearchInput',
  props: {
    placeholder: {
      type: String,
      default: '请输入搜索内容'
    }
  },
  data () {
    return {
      terms: ''
    }
  },
  created () {
    this.terms = ''
  },
  methods: {
    fnSubmit (evt) {
      // 输入法 Enter 显示「搜索」需要 form 和 action
      evt.preventDefault()
      evt.stopPropagation()

      const _terms = this.terms || ''

      if (_terms) {
        this.$router.push({
          path: '/search',
          query: {
            terms: _terms
          }
        })

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
    fnCancel () {
      this.$emit('cancel', true)
    }
  }
}
</script>

<style scoped>
.search-input {
  display: flex;
  align-items: center;
  background-color: #fff;
}
.box {
  flex: 1;
  display: flex;
  padding: 0 15px 0 20px;
  height: 36px;
  -webkit-tap-highlight-color: transparent;
  align-items: center;
  background-color: #f6f4f9;
  border-radius: 18px;
}
.cont {
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
  display: inline-block;
  padding: 0 0 0 13px;
  line-height: 1em;
  font-size: 14px;
  color: #9e9e9e;
}
.submit {
  padding: 0 0 0 15px;
  color: #9e9e9e;
  font-size: 16px;
  line-height: 18px;
}
</style>
