<docs>
## Not Found View Docs
</docs>

<template>
<div class="not-found-view">
  <div class="tip">Not Found</div>
  <router-link to="/">返回首页</router-link>
</div>
</template>

<script>
export default {
  name: 'NotFoundView',
  created () {
    this.init()
  },
  methods: {
    init () {
      const err = new Error(`Not Found - ${window.location.href}`)

      // 上报 APM
      window?.$$APM?.captureError(err)
    }
  }
}
</script>

<style scoped>
.not-found-view {
  text-align: center;
}
.tip {
  padding: 100px 0;
  font-size: 16px;
  text-align: center;
}
</style>
