<docs>
## YuButton Docs

Delete

</docs>

<template>
  <div class="yu-input" data-com="YuInput">
    <input class="yu-input-this"
      :type="type"
      :name="name"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :minlength="minlength"
      :autocomplete="autoComplete"
      :autofocus="autofocus"
      :min="min"
      :max="max"
      :step="step"
      :form="form"
      :value="nowVal"
      @input="fnInput"
      @focus="fnFocus"
      @blur="fnBlur"
      ref="input"
    />
  </div>
</template>

<script>
export default {
  name: 'YuInput',

  props: {
    value: [String, Number],
    placeholder: String,
    size: String,
    resize: String,
    readonly: Boolean,
    autofocus: Boolean,
    icon: String,
    disabled: Boolean,
    type: {
      type: String,
      default: 'text'
    },
    name: String,
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    rows: {
      type: Number,
      default: 2
    },
    autoComplete: {
      type: String,
      default: 'off'
    },
    form: String,
    maxlength: Number,
    minlength: Number,
    max: {},
    min: {},
    step: {},
    validateEvent: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      nowVal: this.value,
      isActive: false
    }
  },

  methods: {
    fnClick (evt) {
      this.$emit('click', evt)
    }
  }
}
</script>

<style>
  .yu-button {
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      background: #fff;
      border: 1px solid #bfcbd9;
      color: #1f2d3d;
      -webkit-appearance: none;
      text-align: center;
      box-sizing: border-box;
      outline: none;
      margin: 0;
      padding: 10px 15px;
      font-size: 14px;
      border-radius: 4px;
      -webkit-tap-highlight-color: transparent;
  }
</style>
