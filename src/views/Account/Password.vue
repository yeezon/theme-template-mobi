<docs>
## YkAccountPassword Docs

* 重置密码后要清空 Vuex 的用户数据
</docs>

<template>
  <div class="yk-account_password" data-com="YkAccountPassword">
    <yu-header :is-fixed="true">
      <YuNavBar title="修改账号密码" />
    </yu-header>
    <template v-if="!isSucceed">
      <YuForm ref="form" class="yk-account_password-form">
        <YuField type="password" label="当前密码" placeholder="请输入当前密码" v-model.trim="oFormData.password_old" :rules="oRules.password" />
        <YuField type="password" label="修改密码" placeholder="新密码不少于6位" v-model.trim="oFormData.password" :rules="oRules.password" />
        <YuField type="password" label="确认密码" placeholder="再次输入所修改的密码" v-model.trim="oFormData.password_again" :rules="oRules.password_again" />
      </YuForm>
      <YuButton class="yk-account_password-submit" type="primary" size="large" @click="fnSubmit">修改密码</YuButton>
    </template>
    <YuStatusTips v-else cont="修改密码成功" button="去登录" @action="fnTo('/account/login')" icon="yu-icon-succeed_tips" />
  </div>
</template>

<script>
export default {
  componentName: 'YkAccountPassword',
  data () {
    // 尴尬，validator 优化下
    const self = this

    return {
      err: '',
      isSucceed: false,
      oFormData: {
        password_old: '',
        password: '',
        password_again: ''
      },
      oRules: {
        password: [{
          validator (val) {
            if (val) {
              return (val.length > 5)
            } else {
              return false
            }
          },
          err: '密码不少于6位'
        }],
        password_again: [{
          validator (val) {
            if (val) {
              return (val === self.oFormData.password)
            } else {
              return false
            }
          },
          err: '与修改密码不匹配'
        }]
      }
    }
  },
  created () {
    this.err = ''
    this.isSucceed = false
    this.oFormData.password_old = ''
    this.oFormData.password = ''
    this.oFormData.password_again = ''
  },
  methods: {
    fnReset () {
      this.err = ''

      const oParam = {}
      oParam.password_old = this.oFormData.password_old || ''
      oParam.password = this.oFormData.password || ''
      oParam.password_again = this.oFormData.password_again || ''

      this.$toast.loading('处理中...')

      this.$sdk.account.changePassword(oParam, data => {
        if (data && data.res) {
          const nCode = data.res.code
          if (nCode === 200) {
            this.$toast.off()
            this.fnResetAfter()
          } else {
            this.err = data.res.message || '处理出错'
            this.$toast.info(this.err, 2500)
          }
        } else {
          this.err = '处理请求异常'
          this.$toast.info(this.err, 2500)
        }
      })
    },
    fnResetAfter () {
      this.isSucceed = true

      // 清空 Vuex 用户数据
      this.$store.dispatch('account/setAccountInfo', {})
    },
    fnValidate (cb) {
      this.$refs.form.validate(err => {
        cb && cb(err)
      })
    },
    fnSubmit () {
      this.fnValidate(err => {
        if (err) {
          this.err = err
          this.$toast.info(this.err, 2500)
        } else {
          this.fnReset()
        }
      })
    },
    fnTo (path) {
      this.$router.push(path)
    }
  }
}
</script>

<style scoped>
.yk-account_password {
  overflow: hidden;
}
.yk-account_password-bar {
  background-color: transparent;
  border: none;
}
.yk-account_password-back {
  padding: 0 15px;
  color: #9e9e9e;
}
.yk-account_password-back:active {
  color: #9e9e9e;
  opacity: .7;
}
.yk-account_password-back_icon {
  width: 16px;
  width: 16px;
}
.yk-account_password-form {
  margin: 15px 0 20px;
}
.yk-account_password-submit {
  display: flex;
  margin: 20px auto 15px;
  width: calc(100% - 15px - 15px);
}
</style>
