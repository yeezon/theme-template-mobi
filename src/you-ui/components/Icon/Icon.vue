<docs>
## YuIcon Docs

* `:active`用 CSS 样式
* `.i-active`用 Click Event
* 支持 ID Props，忽略`yu-icon-`前缀

</docs>

<template>
  <svg
    :class="[
      'yu-icon',
      (active ? onName : name),
      {
        'i-active': active
      }
    ]"
    data-com="YuIcon"
  ><use :xlink:href="'#' + (active ? onName : name)"></use></svg>
</template>

<script>
export default {
  name: 'YuIcon',
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

<style>
.yu-icon {
  width: 1em;
  height: 1em;
  vertical-align: calc(-.65ex - (.5ex - .35em));
  fill: currentColor;
  overflow: hidden;
}
.yu-icon.i-hover:active {
  color: #bbb;
}
</style>
