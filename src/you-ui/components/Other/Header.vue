<docs>
## YuHeader Docs
</docs>

<todo></todo>

<template>
  <div class="yu-header" :class="{'i-fixed': isFixed }" data-com="YuHeader" @touchmove.prevent.stop>
    <div class="yu-header-inner">
      <yu-status-bar></yu-status-bar>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'YuHeader',
  props: {
    isFixed: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
.yu-header.i-fixed {
  min-height: calc(var(--statusBar) + var(--navBar) + var(--1px));
}
.yu-header.i-fixed .yu-header-inner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
}
</style>
