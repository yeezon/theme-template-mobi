<docs>
## YkAccountEdit Docs

### To-do List

* `this.val`基于线上数据，而不是基于 Route Query
  * 基于 Query 有安全隐患

</docs>

<template>
<div class="yk-account_edit" data-com="YkAccountEdit">
  <YuHeader :is-fixed="true">
    <YuNavBar :title="item.label" :has-home="true" />
  </YuHeader>
  <YuForm class="yk-account_edit-form" ref="form">
    <YuField
      :type="item.type"
      :label="item.label"
      :placeholder="item.desc"
      v-model.trim="val"
      :required="item.required"
      :rules="oRules[key]"
    />
  </YuForm>
  <YuButton class="yk-account_edit-submit" type="primary" size="large" @click="fnSubmit">确认</YuButton>
</div>
</template>

<script>
export default {
  componentName: 'YkAccountEdit',
  data () {
    return {
      key: '',
      val: '',
      oldVal: '',
      oRules: {
        notify_email: [{
          validator (val) {
            if (val) {
              return this.$sdk.util.isEmail(val)
            } else {
              return true
            }
          },
          err: '格式不正确'
        }],
        notify_phone: [{
          validator (val) {
            if (val) {
              return this.$sdk.util.isMobile(val)
            } else {
              return true
            }
          },
          err: '格式不正确'
        }]
      }
    }
  },
  computed: {
    item () {
      const _res = {}
      switch (this.key) {
        case 'name':
          _res.type = 'text'
          _res.label = '昵称'
          _res.desc = '输入昵称'
          _res.required = true
          _res.rule = 'name'
          break
        case 'notify_email':
          _res.type = 'email'
          _res.label = '邮箱'
          _res.desc = '输入邮箱'
          _res.required = false
          _res.rule = 'email'
          break
        case 'notify_phone':
          _res.type = 'tel'
          _res.label = '手机号码'
          _res.desc = '输入手机号码'
          _res.required = false
          _res.rule = 'phone'
          break
        case 'real_name':
          _res.type = 'text'
          _res.label = '真实姓名'
          _res.desc = '输入真实姓名'
          _res.required = false
          _res.rule = 'real_name'
          break
        case 'indentity_card':
          _res.type = 'number'
          _res.label = '身份证号码'
          _res.desc = '输入身份证号码'
          _res.required = false
          _res.rule = 'indentity_card'
          break
      }
      return _res
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      for (const key in this.$route.query) {
        const _val = this.$route.query[key]

        this.key = key
        this.val = _val
        this.oldVal = _val

        // ESLint
        if (key) {
          break
        }
      }
    },
    fnSubmit () {
      if (this.val !== this.oldVal) {
        this.$toast.loading('提交修改中...')
        this.$refs.form.validate(err => {
          if (err) {
            this.$toast.info(err)
          } else {
            const oNotify = {}
            oNotify[this.key] = this.val
            this.fnAccountSave(oNotify, err => {
              if (err) {
                this.$toast.info(err)
              } else {
                this.$toast.off()
                this.$router.back()
              }
            })
          }
        })
      } else {
        this.$router.back()
      }
    },
    fnAccountSave (oNotify, cb) {
      this.$sdk.account.save(oNotify, data => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            this.fnChange(data.res.customer || {})
          } else {
            err = data.res.message || '修改用户数据获取出错'
          }
        } else {
          err = '修改用户数据请求异常'
        }
        cb && cb(err)
      })
    },
    fnChange (oAccount) {
      this.$store.dispatch('account/setAccountInfo', oAccount || {})
    }
  }
}
</script>

<style scoped>
  .yk-account_edit-form {
    margin: 30px 0 0;
  }
  .yk-account_edit-submit {
    display: block;
    margin: 20px 15px;
    width: stretch;
  }
</style>
