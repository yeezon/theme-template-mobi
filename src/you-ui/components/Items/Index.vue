<docs>
## YuItems Docs

* 支持横向列表
</docs>

<template>
  <div class="yu-items" v-if="items.length" data-com="YuItems">
    <div v-for="(oItem, index) in items" :key="`${index}-${oItem.id}`" class="yu-items-item" :style="{'width': `calc(${width})`, 'marginTop': `calc(${ index < cols ? 0 : marginTop})`}">
      <slot name="item" :item="oItem" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'YuItems',
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
      marginTop: `${this.spacingY || this.spacing}px`
    }
  },
  watch: { // Computed 相对耗性能点
    cols () {
      this.width = `${100 / this.cols}% - ${this.spacing / 2}px`
    },
    spacing () {
      this.width = `${100 / this.cols}% - ${this.spacing / 2}px`
      this.marginTop = `${this.spacingY || this.spacing}px`
    },
    spacingY () {
      this.marginTop = `${this.spacingY || this.spacing}px`
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
