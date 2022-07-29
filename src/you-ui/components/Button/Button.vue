<docs>
## YuButton Docs

1. 注意此组件为 inline-flex，想用 block 可以使用 flex；
  * 不然上下会出现间隙，使得文章不垂直居中

* Props Left Icon
* Slot Right Icon
</docs>

<template>
  <button :disabled="disabled" class="yu-btn" data-com="YuButton"
    @click="fnClick"
    :type="nativeType"
    :class="[
      type ? 'yu-btn--' + type : '',
      size ? 'yu-btn--' + size : '',
      {
        'is-disabled': disabled,
        'is-loading': loading,
        'is-plain': plain
      }
    ]"
  ><span v-if="$slots.icon" class="yu-btn-icon"><slot name="icon">
    <!-- <i class="yu-icon-loading" v-if="loading"></i> -->
    <!-- <i :class="'yu-icon-' + icon" v-if="icon && !loading"></i> -->
  </slot></span><span v-if="$slots.default" class="yu-btn-cont"><slot></slot></span><span v-if="$slots.icon_r" class="yu-btn-icon"><slot name="icon_r"></slot></span></button>
</template>

<script>
export default {
  name: 'YuButton',

  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: String,
    icon: {
      type: String,
      default: ''
    },
    nativeType: {
      type: String,
      default: 'button'
    },
    loading: Boolean,
    disabled: Boolean,
    plain: Boolean,
    autofocus: Boolean
  },

  methods: {
    fnClick (evt) {
      this.$emit('click', evt)
    }
  }
}
</script>

<style>
  .yu-btn {
    display: inline-flex;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: var(--1px) solid #bfcbd9;
    color: #1f2d3d;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    padding: 10px 15px;
    font-size: 14px;
    line-height: 1;
    border-radius: 3px;
    -webkit-tap-highlight-color: transparent;
    vertical-align: baseline;
  }
  .yu-btn-icon,
  .yu-btn-cont {
    display: inline-block;
    margin: auto;
    vertical-align: baseline;
  }
  .yu-btn-icon {
    line-height: 1em;
  }
  .yu-btn-icon .yu-icon {
    display: inline-block;
    color: inherit;
  }
  .yu-btn:active .yu-btn-icon .yu-icon {
    color: inherit;
  }
  .yu-btn-cont {
    font-size: inherit;
    line-height: inherit;
    width: stretch;
  }

  .yu-btn+.yu-btn {
      margin-left: 10px;
  }

  .yu-btn:active {
      color: #539adf;
      border-color: #539adf;
      outline: none;
  }

/*  .yu-btn::-moz-focus-inner {
      border: 0;
  }*/

  .yu-btn [class*=yu-icon-]+span {
      margin-left: 5px;
  }

  .yu-btn.is-loading {
      position: relative;
      pointer-events: none;
  }

  .yu-btn.is-loading:before {
      pointer-events: none;
      content: "";
      position: absolute;
      left: -1px;
      top: -1px;
      right: -1px;
      bottom: -1px;
      border-radius: inherit;
      background-color: hsla(0,0%,100%,.35);
  }

  .yu-btn.is-disabled,.yu-btn.is-disabled:active {
      color: #bfcbd9;
      cursor: not-allowed;
      background-image: none;
      background-color: #eef1f6;
      border-color: #d1dbe5;
  }

  .yu-btn.is-disabled.yu-btn--text {
      background-color: transparent;
  }

  .yu-btn.is-disabled.is-plain,.yu-btn.is-disabled.is-plain:active {
      background-color: #fff;
      border-color: #d1dbe5;
      color: #bfcbd9;
  }

  .yu-btn.is-plain:active {
      background: #fff;
      border-color: #539adf;
      color: #539adf;
  }

  .yu-btn--primary {
      color: #fff;
      background-color: #539adf;
      border-color: #539adf;
  }

  .yu-btn--primary:active {
      background: #4987c4;
      border-color: #4987c4;
      color: #fff;
  }

  .yu-btn--primary.is-plain {
      background: #fff;
      border: var(--1px) solid #bfcbd9;
      color: #1f2d3d;
  }

  .yu-btn--primary.is-plain:active {
      background: #fff;
      border-color: #539adf;
      color: #539adf;
  }

  .yu-btn--success {
      color: #fff;
      background-color: #13ce66;
      border-color: #13ce66;
  }

  .yu-btn--success:active {
      background: #42d885;
      border-color: #42d885;
      color: #fff;
  }

  .yu-btn--success.is-plain {
      background: #fff;
      border: var(--1px) solid #bfcbd9;
      color: #1f2d3d;
  }

  .yu-btn--success.is-plain:active {
      background: #fff;
      border-color: #13ce66;
      color: #13ce66;
  }

  .yu-btn--warning {
      color: #fff;
      background-color: #f7ba2a;
      border-color: #f7ba2a;
  }

  .yu-btn--warning:active {
      background: #f9c855;
      border-color: #f9c855;
      color: #fff;
  }

  .yu-btn--warning.is-plain {
      background: #fff;
      border: var(--1px) solid #bfcbd9;
      color: #1f2d3d;
  }

  .yu-btn--warning.is-plain:active {
      background: #fff;
      border-color: #f7ba2a;
      color: #f7ba2a;
  }

  .yu-btn--danger {
      color: #fff;
      background-color: #f44;
      border-color: #f44;
  }

  .yu-btn--danger:active {
      background: #d93b3b;
      border-color: #d93b3b;
      color: #fff;
  }
  .yu-btn--danger.is-plain {
      background: #fff;
      border: var(--1px) solid #bfcbd9;
      color: #1f2d3d;
  }

  .yu-btn--danger.is-plain:active {
      background: #fff;
      border-color: #f44;
      color: #f44;
  }

  .yu-btn--info {
      color: #fff;
      background-color: #50bfff;
      border-color: #50bfff;
  }

  .yu-btn--info:active {
      background: #73ccff;
      border-color: #73ccff;
      color: #fff;
  }

  .yu-btn--info.is-plain {
      background: #fff;
      border: var(--1px) solid #bfcbd9;
      color: #1f2d3d;
  }

  .yu-btn--info.is-plain:active {
      background: #fff;
      border-color: #50bfff;
      color: #50bfff;
  }

  .yu-btn--large {
      padding: 11px 19px;
      font-size: 16px;
      border-radius: 3px;
  }

  .yu-btn--small {
      padding: 7px 9px;
      font-size: 12px;
      border-radius: 3px;
  }

  .yu-btn--mini {
      padding: 4px;
      font-size: 12px;
      border-radius: 3px;
  }

  .yu-btn--text {
      border: none;
      color: #4685ee;
      background: transparent;
      padding: 0;
      border-radius: 0;
  }

  .yu-btn--text:active {
      color: #4777ba;
  }
</style>
