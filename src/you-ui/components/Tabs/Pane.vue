<docs>
## YuTabPane Docs
</docs>

<template>
  <div class="yu-tab_pane" data-com="YuTabPane" :name="name" v-show="active">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'YuTabPane',
  props: {
    name: String,
    label: String
  },
  data () {
    return {
      active: false
    }
  }
}
</script>

<style>
  .yu-tab_pane {
    /* x */
  }
</style>
