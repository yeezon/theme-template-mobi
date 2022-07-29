<docs>
## YkIcon Docs

:active 用 CSS 样式
.i-active 用 Click Event
</docs>

<template>
  <svg
    :class="[
      'yk-icon',
      'yk-icon-' + (active ? onName : name),
      {
        'i-active': active
      }
    ]"
    data-com="YkIcon"
  ><use :xlink:href="'#yk-icon-' + (active ? onName : name)"></use></svg>
</template>

<script>
export default {
  componentName: 'YkIcon',
  props: {
    name: {
      type: String,
      default: ''
    },
    onName: {
      type: String,
      default: ''
    },
    active: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.yk-icon {
  width: 1em;
  height: 1em;
  vertical-align: calc(-.65ex - (.5ex - .35em));
  fill: currentColor;
  overflow: hidden;
}
.yk-icon.i-hover:active {
  color: #bbb;
}
</style>
