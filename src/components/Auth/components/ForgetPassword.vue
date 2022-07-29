<docs>
## YkForgetPassword Docs

* YuForm 的 vm.$children 并不保证顺序，YuField 等只能用 v-show

* redirect_back_url 要兼容本登录地址 /account/login 的情况，防止死循环
* redirect_back_url 要兼容 Popup Type 的情况
* 显示/隐藏密码
  * Input Type 的 text 与 password 直接切换，或者两个元素切换
* 尴尬，validator 优化下
* 优化 focus YkCaptcha 内部的 yk-captcha-ipt
</docs>

<template>
  <div class="yk-forget_password" data-com="YkForgetPassword">
    <yu-header>
      <YuNavBar title=" " class="yk-forget_password-bar">
        <YuButton class="yk-forget_password-back" slot="left" type="text" @click="fnBack">
          <YuIcon class="yk-forget_password-back_icon" name="yu-icon-close" slot="icon" />
        </YuButton>
      </YuNavBar>
    </yu-header>
    <template v-if="!isSucceed">
      <YuForm ref="form" class="yk-forget_password-form">
        <YuField type="text" label="手机/邮箱" placeholder="请输入手机或邮箱账号" v-model.trim="oFormData.account" :rules="oRules.account" />
        <template v-if="accountType === 'mobile'">
          <YuField type="tel" label="手机验证" placeholder="请输入短信验证码" v-model.trim="oFormData.verify_code" :rules="oRules.verifyCode" >
            <YuButton class="yk-forget_password-get_code" type="text" @click="getCode" slot="suffix">{{ nSec ? nSec + 's后可再试' : '获取验证码' }}</YuButton>
          </YuField>
          <YuField type="password" label="设置密码" placeholder="密码不少于6位" v-model.trim="oFormData.password" :rules="oRules.password" />
          <YuField type="password" label="确认密码" placeholder="再次输入所设置的密码" v-model.trim="oFormData.password_again" :rules="oRules.password_again" />
        </template>
      </YuForm>
      <YuButton class="yk-forget_password-submit" type="primary" size="large" @click="fnSubmit">{{ accountType === 'mobile' ? '确定' : '找回密码' }}</YuButton>
      <YkCaptcha v-if="accountType === 'mobile'" type="reset" v-model="onCaptcha" :mobile="oFormData.account" @sent="fnSent" />
    </template>
    <template v-else>
      <YuStatusTips v-if="accountType === 'mobile'" cont="重置密码成功" button="去登录" @action="fnTo('/account/login')" icon="yu-icon-succeed_tips" />
      <YuStatusTips v-else cont="重置密码邮件已发送，请重置后再登录" button="去登录" @action="fnTo('/account/login')" icon="yu-icon-succeed_tips" />
    </template>
  </div>
</template>

<script>
export default {
  componentName: 'YkForgetPassword',
  props: {
    type: {
      type: String,
      default: 'view' // view | popup
    }
  },
  data () {
    // 尴尬，validator 优化下
    const self = this

    return {
      err: '',
      isSucceed: false,
      nSec: 0,
      onCaptcha: false,
      accountType: '',
      oFormData: {
        account: '',
        password: '',
        password_again: '',
        verify_code: ''
      },
      oRules: {
        account: [{
          validator (val) {
            if (val) {
              self.accountType = ''

              if (this.$sdk.util.isMobile(val)) {
                self.accountType = 'mobile'
              }
              if (this.$sdk.util.isEmail(val)) {
                self.accountType = 'email'
              }

              return !!self.accountType
            } else {
              return false
            }
          },
          err: '请输入正确的手机号或邮箱'
        }],
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
        }],
        verifyCode: [{
          validator (val) {
            if (val) {
              return (val.length > 0)
            } else {
              return false
            }
          },
          err: '请输入手机短信验证码'
        }]
      }
    }
  },
  watch: {
    'oFormData.account' (val) {
      if (window.$$shop.enable_mobile_regist && this.$sdk.util.isMobile(val)) {
        this.accountType = 'mobile'
      } else {
        this.accountType = ''
      }
    }
  },
  created () {
    this.err = ''
    this.isSucceed = false
    this.oFormData.account = ''
    this.oFormData.password = ''
    this.oFormData.password_again = ''
    this.oFormData.verify_code = ''
  },
  methods: {
    getCode (evt) {
      evt.stopPropagation()
      evt.preventDefault()
      if (!this.nSec) {
        this.onCaptcha = true
      }
    },
    fnReset () {
      if (this.accountType !== 'mobile') return

      this.err = ''

      const oParam = {}
      oParam.account = this.oFormData.account || ''
      oParam.password = this.oFormData.password || ''
      oParam.password_again = this.oFormData.password_again || ''
      oParam.verify_code = this.oFormData.verify_code || ''

      this.$toast.loading('处理中...')

      this.$sdk.account.resetPasswordWithMobile(oParam, data => {
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
    fnResetEmail () {
      if (this.accountType !== 'email') return

      this.err = ''

      const oParam = {}
      oParam.email = this.oFormData.account || ''

      this.$toast.loading('处理中...')

      this.$sdk.account.resetPasswordWithEmail(oParam, data => {
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
    },
    fnBack () {
      if (this.type === 'view') {
        this.$router.back()
      } else {
        this.$emit('close') // 没有操作
      }
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
          if (this.accountType === 'mobile') {
            this.fnReset()
          } else if (this.accountType === 'email') {
            this.fnResetEmail()
          }
        }
      })
    },
    fnTo (path) {
      this.$emit('to', path)
    },
    fnSent () {
      this.nSec = 60
      const nMark = window.setInterval(() => {
        if (this.nSec > 0) {
          this.nSec -= 1
        } else {
          window.clearInterval(nMark)
        }
      }, 1000)
    }
  }
}
</script>

<style scoped>
.yk-forget_password-bar {
  background-color: transparent;
  border: none;
}
.yk-forget_password-back {
  padding: 0 15px;
  color: #9e9e9e;
}
.yk-forget_password-back:active {
  color: #9e9e9e;
  opacity: .7;
}
.yk-forget_password-back_icon {
  width: 16px;
  width: 16px;
}
.yk-forget_password-form {
  margin: 30px 0 20px;
}
.yk-forget_password-get_code {
  position: relative;
  padding: 0 0 0 10px;
  border: 0 solid #d5d5d5;
  border-width: 0 0 0 var(--1px);
  height: 1.5em;
  text-align: right;
}
.yk-forget_password-get_code:active {
  border-color: #d5d5d5;
}
.yk-forget_password-submit {
  display: flex;
  margin: 20px auto 15px;
  width: calc(100% - 15px - 15px);
}
</style>
