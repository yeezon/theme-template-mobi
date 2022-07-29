<docs>
## PageView Docs
</docs>

<todo>
* 抽出，和 PageBlock 一起使用 YkHTML
</todo>

<template>
  <div :key="oPage.id" class="page-view" data-com="PageView">
    <yu-header>
      <YuNavBack class="back" />
    </yu-header>
    <s-html class="cont" v-if="cont" :cont="cont"></s-html>
    <YuLoadTips v-else :is-loading="isLoading" :is-empty="!isLoading && !err && !cont" :is-error="!isLoading && !!err" empty-text="暂无内容~" :error-text="err" @retry="fnRetry" />
  </div>
</template>

<script>
import sHtml from '@/components/HTML'

export default {
  name: 'PageView',
  components: {
    sHtml
  },
  props: {
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
      oPage: {}
    }
  },
  watch: {
    handle () {
      this.getPage()
    },
    oPage (oVal) {
      this.setCont(oVal)
    }
  },
  created () {
    this.getPage()
  },
  methods: {
    getPage () {
      const _handle = this.handle || ''

      if (this.isLoading || !_handle) return

      this.err = ''
      this.isLoading = true

      this.$sdk.page.get((_handle || {}), (data) => {
        if (data.res.code === 200) {
          this.err = ''
          this.oPage = data.res.page || {}
        } else {
          this.err = '获取内容数据失败'
          this.oPage = {}
        }
        this.isLoading = false
      })
    },
    setCont (oPage) {
      if (oPage.use_mobile_content && this.$env.isMobi) {
        this.cont = oPage.mobile_content_html || ''
      } else {
        this.cont = oPage.content_html || ''
      }
      document.title = oPage.title
    },
    fnRetry () {
      this.getPage()
    }
  }
}
</script>

<style scoped>
.cont {
  z-index: 1;
}
.back {
  z-index: 2;
  top: calc(14px + var(--statusBar)) !important;
}
</style>
