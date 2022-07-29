<docs>
## YuHomeIndicator Docs
</docs>

<template>
<div class="yu-home_indicator" data-com="YuHomeIndicator"><span v-if="text">{{ text }}</span></div>
</template>

<script>
export default {
  name: 'YuHomeIndicator',
  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>
.yu-home_indicator {
  height: var(--homeIndicator);
  line-height: var(--homeIndicator);
  font-size: 14px;
  text-align: center;
}
</style>
