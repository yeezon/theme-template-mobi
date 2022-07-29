<docs>
## YuLoading Docs

* 支持无 Text
</docs>

<template>
<div v-if="isLoading" class="yu-loading" data-com="YuLoading">
  <YuIcon class="yu-loading-icon" :name="icon" />
  <div v-if="text" class="yu-loading-text">{{ text }}</div>
</div>
</template>

<script>
export default {
  name: 'YuLoading',
  props: {
    icon: {
      type: String,
      default: 'yu-icon-loading'
    },
    text: {
      type: String,
      default: ''
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
.yu-loading {
  display: flex;
  margin: auto;
  text-align: center;
  animation: yu_loading_opa .6s ease-in;
}
.yu-loading-icon {
  margin: auto 6px auto auto;
  width: 16px;
  height: 16px;
  /*will-change: transform;*/
  animation: yu_loading_spin .6s linear infinite;
}
.yu-loading-text {
  margin: auto;
}
@keyframes yu_loading_opa {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes yu_loading_spin {
  to {
    transform: rotate(1turn)
  }
}
</style>
