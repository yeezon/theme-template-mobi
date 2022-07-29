<docs>
## YuGroup Docs
</docs>

<template>
  <div class="yu-group" data-com="YuGroup">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'YuGroup'
}
</script>

<style>
  .yu-group {
    background-color: #fff;
    border: 0 solid #d5d5d5;
    border-width: .5px 0;
  }
  .yu-group .yu-field:first-child .yu-field-hr {
    display: none;
  }
</style>
