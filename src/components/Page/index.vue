<docs>
## YkPage Docs

* 抽出，和 YkPage 一起使用 YkHTML
</docs>

<template>
  <div :key="id || handle" class="yk-page" data-com="YkPage">
    <YkHTML v-if="cont" :cont="cont" />
    <YuLoadTips v-else :is-loading="isLoading" :is-empty="!isLoading && !err && !cont" :is-error="!isLoading && !!err" empty-text="暂无内容~" :error-text="err" @retry="fnRetry" />
  </div>
</template>

<script>
import YkHTML from '../HTML'

export default {
  componentName: 'YkPage',
  components: {
    YkHTML
  },
  props: {
    id: {
      type: Number,
      default: null
    },
    handle: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isLoading: false,
      err: '',
      cont: '',
      oBlock: {}
    }
  },
  watch: {
    id () {
      this.getBlock()
    },
    handle () {
      this.getBlock()
    },
    oBlock (oVal) {
      this.setCont(oVal)
    }
  },
  created () {
    this.getBlock()
  },
  methods: {
    getBlock () {
      if (this.isLoading || (!this.handle && !this.id)) return

      const config = this.handle || {
        id: this.id
      }

      this.err = ''
      this.isLoading = true

      this.$sdk.page.get(config, (data) => {
        if (data.res.code === 200) {
          this.err = ''
          this.oBlock = data.res.page || {}
        } else {
          this.err = '获取内容数据失败~'
        }
        this.isLoading = false
      })
    },
    setCont (oBlock) {
      if (oBlock.use_mobile_content && window.$yk.env.isMobi) {
        this.cont = oBlock.mobile_content_html || ''
      } else {
        this.cont = oBlock.content_html || ''
      }
    },
    fnRetry () {
      this.getBlock()
    }
  }
}
</script>

<style scoped></style>
