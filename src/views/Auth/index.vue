<docs>
## Auth View Docs

* 参考 You Kit 做优化
* 改下 beforeCreate 内的实现
</docs>

<template>
<div class="auth-view" @touchmove.prevent.stop>
  <auth-box class="cont" type="view"></auth-box>
</div>
</template>

<script>
import AuthBox from '@/components/Auth/Box'

export default {
  name: 'AuthView',
  components: {
    AuthBox
  }
}
</script>

<style scoped>
.cont {
  background-color: var(--backgroundColor);
  width: 100vw;
  height: var(--100vh);
}
</style>
