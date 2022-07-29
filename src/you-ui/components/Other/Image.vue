<docs>
## YuImage Docs
</docs>

<todo>
* 结合 picture / (img-srcset/sizes) 做热自适应处理？
* <img decoding="async">
* svg 内设置大小，img 还是按常规使用
</todo>

<template>
<div class="yu-status_bar" data-com="YuImage" @touchmove.prevent.stop></div>
</template>

<script>
export default {
  name: 'YuImage'
}
</script>

<style>
.yu-status_bar {
  height: var(--statusBar);
}
</style>
