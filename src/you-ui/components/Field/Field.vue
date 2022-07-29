<docs>
## YuField Docs

* 尴尬，validator 优化下，看 YkRegister
</docs>

<template>
  <div class="yu-field" data-com="YuField"
    :class="[{
      'i-active': isActive,
      'i-err': err
    }]"
  >
    <div class="yu-field-hr" :style="`margin: 0 ${paddingL};`" />
    <label v-if="type !== 'area'" class="yu-field-inner" @click="fnClick">
      <div class="yu-field-label" :style="`padding-left: ${paddingL}; min-width: ${labelWidth};`" v-if="label">
        <slot><span class="yu-field-label_text">{{label}}</span></slot>
      </div>
      <input v-if="type !== 'select'" class="yu-field-input"
        :class="{'i-hide': !isInput}"
        :style="`padding-right: ${paddingL};`"
        :type="type"
        :name="name"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :minlength="minlength"
        :autocomplete="autocomplete"
        :autofocus="autofocus"
        :min="min"
        :max="max"
        :step="step"
        :form="form"
        :value="nowVal"
        @input.passive="fnInput"
        @change.passive="fnChange"
        @focus.passive="fnFocus"
        @blur.passive="fnBlur"
        @click="fnClick"
        ref="input"
      />
      <select v-else class="yu-field-input i-hide"
        :disabled="disabled"
        :value="nowVal"
        @input.passive="fnInput"
        @change.passive="fnChange"
        @focus.passive="fnFocus"
        @blur.passive="fnBlur"
        @click="fnClick"
      >
        <option v-for="(oOption, index) in options" :key="index" :value="oOption.value" :selected="oOption.value === nowVal">{{oOption.label}}</option>
      </select>
      <div class="yu-field-val" v-if="!isInput">
        <slot name="val"><span>{{nowVal}}</span></slot>
      </div>
      <div class="yu-field-suffix" v-if="!isInput || $slots.suffix" :style="`margin-right: ${paddingL};`">
        <slot name="suffix">
          <svg class="yu-cell-arrow yu-icon"><use xlink:href="#yu-icon-right"></use></svg>
        </slot>
      </div>
    </label>
    <div v-else class="yu-field-inner" @click="fnAreaOpen">
      <div class="yu-field-label" :style="`padding-left: ${paddingL}; min-width: ${labelWidth};`" v-if="label">
        <slot><span>{{label}}</span></slot>
      </div>
      <!-- required rules 无需写在此组件内，已经判断了对象为空的情况，YuAreaPicker 输出对象就好 -->
      <YuAreaPicker
        class="yu-field-area"
        :value="nowVal"
        @input="fnInput"
        :style="`padding-right: ${paddingL};`"
        :placeholder="placeholder"
        ref="AreaPicker"
      />
      <div class="yu-field-suffix" v-if="!isInput || $slots.suffix" :style="`margin-right: ${paddingL};`">
        <slot name="suffix">
          <svg class="yu-cell-arrow yu-icon"><use xlink:href="#yu-icon-right"></use></svg>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'YuField',
  props: {
    name: String,
    label: String,
    value: {
      type: [String, Number, Object, Array, Boolean], // Boolean 记得放最后，貌似新版 Vue 在输入 '' 时会默认变成 true，BUG?
      default () {
        return ''
      }
    },
    type: {
      type: String,
      default: 'text'
    },
    labelWidth: { // Add default Auto
      type: String,
      default: '5.5em'
    },
    paddingL: {
      type: String,
      default: '15px'
    },
    placeholder: String,
    required: {
      type: Boolean,
      default: false
    },
    readonly: Boolean,
    autofocus: Boolean,
    disabled: Boolean,
    autocomplete: {
      type: String,
      default: 'off'
    },
    form: String,
    maxlength: {
      type: Number,
      default: 200 // 默认 200，防止恶意输入大量数据提交
    },
    minlength: Number,
    max: {},
    min: {},
    step: {},
    autosize: {
      type: [Boolean], // Add Object
      default: false
    },
    rows: {
      type: Number,
      default: 2
    },
    suffix: String,
    rules: Array,
    options: Array
  },
  data () {
    return {
      isActive: false,
      nowVal: this.getVal(),
      defVal: this.getVal(), // 原始值
      valid: false, // 字段有效时返回 true，否则返回 false
      touched: false, // 字段获得过焦点时返回 true，否则返回 false
      modified: true, // 字段值与初始值不同时返回 true，否则返回 false
      dirty: false, // 字段值改变过至少一次时返回 true，否则返回 false
      err: null
    }
  },
  computed: {
    isInput () {
      return /^(textarea|text|number|tel|email|password)$/.test(this.type)
    }
  },
  watch: {
    value (val) {
      this.setNowVal(this.getVal(val))
    }
  },
  methods: {
    fnFocus (evt) {
      this.isActive = true
      this.touched = true
    },
    fnBlur (evt) {
      this.isActive = false
      // this.$emit('change', evt.target.value)
    },
    fnInput (evt) {
      this.$emit('input', this.getEvtVal(evt, 'input'))
    },
    fnChange (evt) {
      this.$emit('change', this.getEvtVal(evt, 'change'))
    },
    fnClick (evt) {
      if (!this.isInput) {
        this.$emit('click', evt)
      }
    },
    getEvtVal (evt, type) {
      let val = evt
      if (typeof evt === 'object' && evt.type === type) {
        val = evt.target.value
      }
      if (this.name && (typeof this.value === 'object')) {
        const _newVal = JSON.parse(JSON.stringify(this.value))
        _newVal[this.name] = val
        val = _newVal
      }
      return val
    },
    getVal () {
      let val = this.value
      if (this.name && (typeof val === 'object')) {
        val = val[this.name]
      }
      return val
    },
    setNowVal (val) {
      this.err = null
      this.nowVal = val

      if (!this.dirty && (val !== this.defVal)) {
        this.dirty = true
      }
    },
    validator (rules, cb) { // 支持异步
      rules = this.rules || rules || []
      let valid = true
      let err = null
      const _sNowVal = JSON.stringify(this.nowVal)
      if (this.required && !(this.nowVal || this.nowVal === 0 || _sNowVal === '{}' || _sNowVal === '[]')) {
        err = '请输入' + (this.label || '')
      }
      if (!err) {
        for (const rule of rules) {
          valid = rule.validator(this.nowVal)
          if (!valid) {
            err = rule.err
            break
          }
        }
      }
      this.err = err
      cb && cb(err)
    },
    reset () {
      this.$emit('input', this.defVal)
      this.valid = false
      this.touched = false
      this.modified = true
      this.dirty = false
    },
    fnAreaOpen () {
      this.$refs.AreaPicker.fnOpen()
    }
  }
}
</script>

<style>
  .yu-field {
    -webkit-tap-highlight-color: transparent;
    background-color: #fff;
  }
  .yu-field-hr {
    border: 0 solid #d5d5d5;
    border-width: 0 0 .5px;
    height: 0;
    line-height: 0;
    font-size: 0;
    overflow: hidden;
  }
  .yu-field .yu-field-inner {
    position: relative;
    display: flex;
    height: 44px;
    align-items: center;
  }
  .yu-field .yu-field-label {
    line-height: 1;
  }
  .yu-field-label_text {
    display: inline-block;
  }
  .yu-field.i-active .yu-field-label {
    color: #4685ee;
  }
  .yu-field.i-err .yu-field-label {
    color: #d55;
  }
  .yu-field .yu-field-input {
    padding: 0;
    display: inline-block;
    flex: 1;
    outline: none;
    border: none;
    height: 100%;
    line-height: 1.75em;
    font-size: 14px;
    min-width: 0;
  }
  .yu-field .yu-field-input.i-hide {
    opacity: 0;
    position: absolute;
    margin: 0;
    padding: 0;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
  }
/*  .yu-field .yu-field-textarea {
    width: stretch;
    border: none;
    outline: none;
    resize: none;
  }*/
  .yu-field-val {
    margin: auto 0 auto auto;
    color: #999;
  }
  .yu-field .yu-field-suffix {
    margin: auto 0;
    color: #999;
  }
</style>
