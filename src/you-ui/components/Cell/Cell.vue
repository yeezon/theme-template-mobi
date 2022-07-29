<docs>
## YuCell Docs

* isShowPlaceholder 加上 slot 判断
* 边改成下面，底下 1px 差距视觉明显

</docs>
<template>
<div class="yu-cell" data-com="YuCell" @click="fnClick" :class="{ 'yu-link' : isLink }">
  <div class="yu-cell-hr" :style="`margin: 0 ${paddingL};`" />
  <button v-if="isLink" class="yu-cell-inner">
    <span class="yu-cell-label_icon"><slot name="icon"><svg class="yu-icon" v-if="icon"><use :xlink:href="icon"></use></svg></slot></span>
    <slot name="label">
      <span class="yu-cell-label">{{ label }}</span>
    </slot>
    <span class="yu-cell-cont"
      :class="{
        'i-placeholder': isShowPlaceholder
      }"
    ><slot>{{ isShowPlaceholder ? placeholder : val }}</slot></span>
    <slot name="suffix">
      <svg class="yu-cell-arrow yu-icon"><use xlink:href="#yu-icon-right"></use></svg>
    </slot>
  </button>
  <div v-else class="yu-cell-inner">
    <span class="yu-cell-label_icon"><slot name="icon"><svg class="yu-icon" v-if="icon"><use :xlink:href="icon"></use></svg></slot></span>
    <slot name="label">
      <span class="yu-cell-label">{{ label }}</span>
    </slot>
    <span class="yu-cell-cont"
      :class="{
        'i-placeholder': isShowPlaceholder
      }"
    ><slot>{{ isShowPlaceholder ? placeholder : val }}</slot></span>
    <slot name="suffix" />
  </div>
</div>
</template>

<script>
export default {
  name: 'YuCell',
  props: {
    to: [String, Object],
    icon: String,
    label: String,
    isLink: {
      type: Boolean,
      default: false
    },
    val: {
      type: [String, Object, Boolean, Number],
      default: undefined
    },
    placeholder: {
      type: String,
      default: undefined
    },
    paddingL: {
      type: String,
      default: '15px'
    }
  },
  computed: {
    hasPlaceholder () {
      return this.placeholder !== undefined
    },
    isShowPlaceholder () {
      let _res = false
      if (this.hasPlaceholder) {
        if (!this.val) {
          _res = true
        }
      }
      return _res
    }
  },
  methods: {
    fnClick (evt) {
      this.$emit('click', evt)
    }
  }

  // computed: {
  //   href () {
  //     if (this.to && !this.added && this.$router) {
  //       const resolved = this.$router.match(this.to)
  //       if (!resolved.matched.length) return this.to

  //       this.$nextTick(() => {
  //         this.added = true
  //         this.$el.addEventListener('click', this.fnClick)
  //       })
  //       return resolved.path
  //     }
  //     return this.to
  //   }
  // }
}
</script>

<style>
  .yu-cells {
    margin: 0 0 15px;
    border: 0 solid #d5d5d5;
    border-width: var(--1px) 0;
    background-color: #fff;
  }
  .yu-cells > .yu-cell:first-child .yu-cell-hr {
    border: none;
  }
  .yu-cell {
    -webkit-tap-highlight-color: transparent;
  }
  .yu-cell .yu-icon {
    color: #999;
  }
  .yu-cell-inner {
    position: relative;
    display: flex;
    box-sizing: content-box;
    padding: 11px 15px;
    width: stretch;
    min-height: 22px;
    line-height: 22px;
    background: none;
    border: none;
    font-size: 14px;
    outline: none;
    -webkit-tap-highlight-color: transparent;
    text-align: left;
    vertical-align: baseline;
    align-items: center;
  }
  .yu-cell-hr {
    border: 0 solid #d5d5d5;
    border-width: 0 0 var(--1px);
    height: 0;
    line-height: 0;
    font-size: 0;
    overflow: hidden;
  }
  .yu-cell.yu-link {
    cursor: pointer;
    transition: background-color .6s ease-out;
  }
  .yu-cell.yu-link:active {
    transition: none;
    background-color: #e6e6e6;
  }
  .yu-cell-label_icon {
    display: inline-block;
    line-height: 0;
    font-size: 0;
  }
  .yu-cell-label_icon > svg {
    display: inline-block;
    margin: 0 10px 0 0;
    font-size: 22px;
  }
  .yu-cell-label {
    display: inline-block;
  }
  .yu-cell-cont {
    flex: 1;
    display: inline-block;
    text-align: right;
  }
  .yu-cell-cont.i-placeholder {
    color: #999;
  }
  .yu-cell-arrow {
    padding: 0 0 0 5px;
    width: 16px;
    height: 16px;
  }
</style>
