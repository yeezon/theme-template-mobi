<docs>
## YuMask Docs

* 还是有必要的，统一样式、风格、功能和设置
</docs>

<template>
  <div class="yu-items" v-if="items.length" data-com="YuMask" :style="{'marginBottom': `calc(-${marginBottom})`}">
    <div v-for="item in items" :key="item.id" class="yu-items-item" :style="{'width': `calc(${width})`, 'marginBottom': `calc(${marginBottom})`}">
      <slot name="item" :item="item" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'YuMask',
  props: {
    items: {
      type: Array,
      default () {
        return []
      }
    },
    cols: {
      type: Number,
      default: 2
    },
    spacing: {
      type: Number,
      default: 10
    },
    spacingY: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      width: `${100 / this.cols}% - ${this.spacing * (this.cols - 1) / this.cols}px`,
      marginBottom: `${this.spacingY || this.spacing}px`
    }
  },
  watch: { // Computed 相对耗性能点
    cols () {
      this.width = `${100 / this.cols}% - ${this.spacing / 2}px`
    },
    spacing () {
      this.width = `${100 / this.cols}% - ${this.spacing / 2}px`
      this.marginBottom = `${this.spacingY || this.spacing}px`
    },
    spacingY () {
      this.marginBottom = `${this.spacingY || this.spacing}px`
    }
  }
}
</script>

<style>
.yu-items {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0;
  overflow: hidden;
}
</style>
