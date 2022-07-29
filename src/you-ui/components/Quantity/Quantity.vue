<docs>
## YuQuantity Docs

* counter
* min 和 max 变化时，需要重置相关数值
</docs>

<template>
  <transition>
    <div class="yu-quantity" data-com="YuQuantity">
      <YuButton class="yu-quantity-btn yu-quantity-minus" :disabled="nVal === min" @click="fnMinus">
        <YuIcon name="yu-icon-minus" slot="icon" />
      </YuButton>
      <input :key="mark" class="yu-quantity-ipt" type="number" :value="nVal" @change="fnChange" :min="min" :max="max" />
      <YuButton class="yu-quantity-btn yu-quantity-add" :disabled="nVal >= max" @click="fnAdd">
        <YuIcon name="yu-icon-add" slot="icon" />
      </YuButton>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'YuQuantity',
  props: {
    value: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 999999
    },
    min: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      mark: true,
      nVal: this.value || 0
    }
  },
  watch: {
    value (val) {
      this.nVal = val
    }
  },
  methods: {
    setNum (val) {
      this.nVal = val
      this.$emit('input', val)
    },
    fnChange (evt) {
      const _val = parseInt(evt.target.value)
      if (_val > 0) {
        this.setNum(_val)
      } else {
        // 防止空输入不刷新视图
        this.mark = !this.mark
      }
    },
    fnAdd () {
      if (this.nVal < this.max) {
        this.setNum(this.nVal + 1)
      }
    },
    fnMinus () {
      if (this.nVal > this.min) {
        this.setNum(this.nVal - 1)
      }
    }
  }
}
</script>

<style>
  .yu-quantity {
    display: inline-flex;
  }
  .yu-quantity-ipt {
    font-family: monospace;
    display: inline-block;
    flex: 1;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    padding: 0;
    border: 0 solid #d5d5d5;
    border-width: var(--1px) 0;
    border-radius: 0;
    width: 3em;
    font-size: 12px;
    text-align: center;
    -webkit-tap-highlight-color: transparent;
    -webkit-appearance: none;
  }
  .yu-quantity-btn {
    padding: 7px 8px;
    border: 0 solid #d5d5d5;
    font-size: 12px;
    color: #999;
    transition: background-color .3s ease-out;
    transform: scale(1); /* 修复 父辈以上元素 使用 transform 导致 .5px 边框缺失问题 */
  }
  .yu-quantity-btn:active {
    color: #999;
    border-color: #d5d5d5;
    background-color: #eee;
    transition: none;
  }
  .yu-quantity-btn.is-disabled {
    color: #ddd;
    background-color: transparent;
    border-color: #d5d5d5;
  }
  .yu-quantity-btn.is-disabled:active {
    color: #ddd;
    background-color: transparent;
    border-color: #d5d5d5;
  }
  .yu-quantity-minus {
    border-width: var(--1px) 0 var(--1px) var(--1px);
    border-radius: 3px 0 0 3px;
  }
  .yu-quantity-add {
    border-width: var(--1px) var(--1px) var(--1px) 0;
    border-radius: 0 3px 3px 0;
  }
</style>
