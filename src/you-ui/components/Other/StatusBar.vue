<docs>
## YuStatusBar Docs

* 滚动一定范围，过度透明，基本不需要控制 Status Bar 文字颜色
</docs>

<template>
<div class="yu-status_bar" data-com="YuStatusBar" @touchmove.prevent.stop></div>
</template>

<script>
export default {
  name: 'YuStatusBar'
}
</script>

<style>
.yu-status_bar {
  height: var(--statusBar);
  background-color: var(--statusBarBackgroundColor);
}
</style>
