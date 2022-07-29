<docs>
## YuSwitch Docs
</docs>

<template>
  <div class="yu-switch" data-com="YuSwitch"
    :class="{
      'i-on': nowVal
    }"
    @click="fnClick"
  />
</template>

<script>
export default {
  name: 'YuSwitch',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      nowVal: this.value
    }
  },
  watch: {
    value (val) {
      if (val !== this.nowVal) {
        this.nowVal = val
      }
    }
  },
  methods: {
    fnClick () {
      this.$emit('input', !this.nowVal)
    }
  }
}
</script>

<style>
  .yu-switch {
    position: relative;
    margin: -2px 0;
    background-color: #bbb;
    border-radius: 13px;
    width: 46px;
    height: 26px;
    line-height: 1;
    font-size: 0
  }
  .yu-switch:hover {
    will-change: transform;
  }
  .yu-switch.i-on {
    background-color: #4685ee;
  }
  .yu-switch::before {
    content: '\20';
    display: block;
    position: absolute;
    top: 50%;
    left: 2px;
    width: 23px;
    height: 23px;
    border-radius: 50%;
    background-color: #fff;
    transform: translate(0, -50%);
    transition: .2s ease-out;
  }
  .yu-switch.i-on::before {
    transform: translate(19px, -50%);
  }
</style>
