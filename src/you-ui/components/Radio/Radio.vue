<docs>
## YuRadio Docs

### 兼容性

* checked 状态 onChange 触发兼容性问题
  * PC 端会触发，移动端 不会触发
  * 与 移动端 一致，屏蔽 PC 端 onChange 变成 onInput 的问题
* 移动端 label 和 input 的 click 兼容修复
  * label 内的元素需要事件穿透
  * @click 要放 input
    * PC 端 label 触发后，input 还会触发一次
    * 移动端正常，只在 input 触发一次
</docs>

<template>
  <label class="yu-radio" :class="`yu-radio--${align}`" data-com="YuRadio">
    <span class="yu-radio-input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': model === val,
        'is-focus': focus
      }"
    >
      <svg v-if="model === val" class="yu-icon yu-icon-check_fill">
        <use xlink:href="#yu-icon-check_fill"/>
      </svg>
      <svg v-else class="yu-icon yu-icon-check">
        <use xlink:href="#yu-icon-check" />
      </svg>
      <input class="yu-original"
        :value="val"
        type="radio"
        v-model="model"
        @click="fnClick"
        @focus="focus = true"
        @blur="focus = false"
        :name="name"
        :disabled="isDisabled" />
    </span>
    <span class="yu-radio-label">
      <slot v-if="$slots.default" />
      <template v-else>{{val}}</template>
    </span>
  </label>
</template>

<script>
import Emitter from '../../mixins/emitter'

export default {
  name: 'YuRadio',
  mixins: [Emitter],
  props: {
    value: {},
    val: {},
    disabled: {
      type: Boolean,
      default: false
    },
    name: String,
    align: {
      type: String,
      default: 'right'
    }
  },
  data () {
    return {
      radioGroup: {},
      focus: false
    }
  },
  computed: {
    model: {
      get () {
        return this.hasGroup() ? this.radioGroup.value : this.value
      },
      set (val) {
        // 修复为与 移动端 一致，屏蔽 PC 端 onChange 变成 onInput 的问题
        if (this.model !== val) {
          if (this.hasGroup()) {
            this.dispatch('YuRadioGroup', 'input', [val])
          } else {
            this.$emit('input', val)
          }
        }
      }
    },
    isDisabled () {
      return this.hasGroup()
        ? this.radioGroup.disabled || this.disabled
        : this.disabled
    }
  },
  methods: {
    hasGroup () {
      let result = false
      let parent = this.$parent

      while (parent) {
        if (parent.$options.name === 'YuRadioGroup') {
          this.radioGroup = parent

          result = true

          break
        } else {
          parent = parent.$parent
        }
      }

      return result
    },
    fnClick (evt) {
      this.$emit('click', evt)
    }
  }
}
</script>

<style>
  .yu-radio {
    position: relative;
    display: flex;
    padding: 10px 0;
    line-height: 22px;
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
  }
  .yu-radio.yu-radio--right {
    flex-direction: row-reverse;
  }
  .yu-radio-input,
  .yu-radio-label {
    pointer-events: none;
  }
  .yu-radio-input {
    display: inline-block;
    margin: auto 6px auto 0;
    line-height: 1;
    font-size: 0;
    vertical-align: middle;
  }
  .yu-radio.yu-radio--right .yu-radio-input {
    display: flex;
    margin: 0;
  }
  .yu-radio.yu-radio--right .yu-radio-input .yu-icon {
    margin: auto;
    color: #999;
  }
  .yu-radio .yu-radio-input .yu-icon.yu-icon-check_fill,
  .yu-radio .yu-radio-input .yu-icon.yu-icon-check_has_2,
  .yu-radio .yu-radio-input .yu-icon.yu-icon-check_fill_2 {
    color: #4685ee;
  }
  .yu-radio-input.is-disabled .yu-icon > use {
    color: #ccc;
  }
  .yu-radio-input > .yu-icon {
    width: 22px;
    height: 22px;
  }
  .yu-radio-input.is-disabled + .yu-radio-label {
    color: #999;
  }
  .yu-radio .yu-radio-input .yu-original {
    display: none;
  }
  .yu-radio .yu-radio-label {
    flex: 1;
  }
</style>
