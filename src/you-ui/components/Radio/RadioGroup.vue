<template>
  <!-- Radio Input 不兼容 移动端，暂时用 Click -->
  <div class="yu-radio-group" data-com="YuRadioGroup" @click="fnClick">
    <slot></slot>
  </div>
</template>
<script>
// import Emitter from '../../mixins/emitter'

export default {
  name: 'YuRadioGroup',
  // mixins: [Emitter],
  props: {
    value: {},
    size: String,
    fill: String,
    textColor: String,
    disabled: Boolean
  },
  methods: {
    fnClick (evt) {
      this.$emit('click', evt)
    }
  }
  // watch: {
  //   value (value) {
  //     this.$emit('change', value)
  //     this.dispatch('YuFormItem', 'yu.form.change', [this.value])
  //   }
  // }
}
</script>
<style>
  .yu-radio-group {
    margin: 12px 0;
    -webkit-tap-highlight-color: transparent;
  }
</style>
