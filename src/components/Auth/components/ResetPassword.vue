<docs>
## YkResetPassword Docs

* 等接口
</docs>

<template>
  <div class="yk-reset_password" data-com="YkResetPassword">
    <yu-header>
      <YuNavBar title=" " class="yk-reset_password-bar">
        <YuButton class="yk-reset_password-back" slot="left" type="text" @click="fnBack">
          <YuIcon class="yk-reset_password-back_icon" name="yu-icon-close" slot="icon" />
        </YuButton>
      </YuNavBar>
    </yu-header>
    <template v-if="!isSucceed">
      <YuForm ref="form" class="yk-reset_password-form">
        <YuField type="password" label="设置密码" placeholder="密码不少于6位" v-model.trim="oFormData.password" :rules="oRules.password" />
        <YuField type="password" label="确认密码" placeholder="再次输入所设置的密码" v-model.trim="oFormData.password_again" :rules="oRules.password_again" />
      </YuForm>
      <YuButton class="yk-reset_password-submit" type="primary" size="large" @click="fnSubmit">重置密码</YuButton>
    </template>
    <YuStatusTips v-else cont="重置密码成功" button="去登录" @action="fnTo('/account/login')" icon="yu-icon-succeed_tips" />
  </div>
</template>

<script>
export default {
  componentName: 'YkResetPassword',
  data () {
    // 尴尬，validator 优化下
    const self = this

    return {
      err: '',
      isSucceed: false,
      oFormData: {
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
          err: '与设置密码不匹配'
        }]
      }
    }
  },
  created () {
    this.err = ''
    this.isSucceed = false
    this.oFormData.password = ''
    this.oFormData.password_again = ''
  },
  methods: {
    fnReset () {
      this.err = ''

      const oParam = {}
      oParam.key = this.$route.params.key || ''
      oParam.password = this.oFormData.password || ''
      oParam.password_again = this.oFormData.password_again || ''

      this.$toast.loading('处理中...')

      // this.$sdk.account.resetPasswordByEmail(oParam, data => {
      //   if (data && data.res) {
      //     const nCode = data.res.code
      //     if (nCode === 200) {
      //       this.$toast.off()
      //       this.fnResetAfter()
      //     } else {
      //       this.err = data.res.message || '处理出错'
      //       this.$toast.info(this.err, 2500)
      //     }
      //   } else {
      //     this.err = '处理请求异常'
      //     this.$toast.info(this.err, 2500)
      //   }
      // })
    },
    fnResetAfter () {
      this.isSucceed = true
    },
    fnBack () {
      // type -> view
      this.$router.back()
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
.yk-reset_password-bar {
  background-color: transparent;
  border: none;
}
.yk-reset_password-back {
  padding: 0 15px;
  color: #9e9e9e;
}
.yk-reset_password-back:active {
  color: #9e9e9e;
  opacity: .7;
}
.yk-reset_password-back_icon {
  width: 16px;
  width: 16px;
}
.yk-reset_password-form {
  margin: 30px 0 20px;
}
.yk-reset_password-submit {
  display: flex;
  margin: 20px auto 15px;
  width: calc(100% - 15px - 15px);
}
</style>
