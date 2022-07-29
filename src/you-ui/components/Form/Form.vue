<docs>
## YuForm Docs

* vm.$children 并不保证顺序，YuField 等只能用 v-show，例如 YkRegister 组件
</docs>

<template>
  <form class="yu-form" data-com="YuForm" @submit.prevent.stop :class="[
    labelAlign ? 'i-label-' + labelAlign : '',
  ]">
    <slot />
  </form>
</template>
<script>
export default {
  name: 'YuForm',
  props: {
    model: Object,
    rules: Object,
    labelAlign: String
  },
  methods: {
    reset () {
      this.$children.forEach(field => {
        field.reset()
      })
    },
    validate (fnHandle) {
      const vmChildList = this.$children || []
      let i = 0
      const length = vmChildList.length
      let tips = null
      // 赶时间不忍直视，后面再优化逻辑
      const fnRun = () => { // 支持异步 field.validator()
        if (i >= length) return
        const field = vmChildList[i]
        ++i
        if (field.validator) {
          field.validator(null, err => {
            if (err && !tips) {
              tips = String(err)
            }
            if (i === length) {
              if (tips) {
                fnHandle && fnHandle(tips)
              } else {
                fnHandle && fnHandle(false)
              }
            } else {
              fnRun()
            }
          })
        } else if (i === length) {
          if (tips) {
            fnHandle && fnHandle(tips)
          } else {
            fnHandle && fnHandle(false)
          }
        } else {
          fnRun()
        }
      }
      fnRun()
    },
    validateField (name, cb) {
      const field = this.$slots.filter(field => field.name === name)[0]
      if (!field) {
        throw new Error('Must call validateField with valid prop string!')
      } else {
        field.validate(null, cb)
      }
    }
  }
}
</script>

<style>
  .yu-form {
    background-color: #fff;
    border: 0 solid #d5d5d5;
    border-width: .5px 0;
  }
  .yu-form .yu-field:first-child .yu-field-hr {
    display: none;
  }
</style>
