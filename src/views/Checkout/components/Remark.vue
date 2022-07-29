<docs>
## YkCheckoutRemark Docs
</docs>

<template>
<label class="yk-checkout-remark" data-com="YkCheckoutRemark">
  <div class="yk-label">留言</div>
  <input @input="fnInput" :value="value" class="yk-cont" type="text" placeholder="给我们留言" />
</label>
</template>

<script>
export default {
  componentName: 'YkCheckoutRemark',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    fnInput (evt) {
      this.$emit('input', evt.target.value)
    }
  }
}
</script>

<style scoped>
  .yk-checkout-remark {
    display: flex;
    padding: 13px 15px;
    line-height: 1;
    background-color: #fff;
  }
  .yk-checkout-remark .yk-label {
    margin: 0 15px 0 0;
    line-height: 1.6;
  }
  .yk-checkout-remark .yk-cont {
    -webkit-tap-highlight-color: transparent;
    flex: 1;
    margin: 0;
    padding: 0;
    line-height: 1.6;
    outline: none;
    border: none;
    vertical-align: middle;
  }
</style>
