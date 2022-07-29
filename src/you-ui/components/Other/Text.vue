<docs>
## YuText Docs
</docs>

<todo>
* CSS 能否直接控制？
* typo.css ?
* 参考小程序 space 有效值？
  * ensp 中文字符空格一半大小
  * emsp 中文字符空格大小
  * nbsp 根据字体设置的空格大小
</todo>

<template>
<div class="yu-status_bar" data-com="YuText" @touchmove.prevent.stop></div>
</template>

<script>
export default {
  name: 'YuText'
}
</script>

<style>
.yu-status_bar {
  height: var(--statusBar);
}
</style>
