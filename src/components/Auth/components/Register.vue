<docs>
## YkRegister Docs

* YuForm 的 vm.$children 并不保证顺序，YuField 等只能用 v-show

* 后端逻辑已经修改，注册邮箱必须通过验证。
* 恭喜 #{email} 已注册成功！
  * 注册已经发到您的邮箱，强烈建议进行邮箱验证
  * 没有收到确认信怎么办？
  * 检查一下上面Email地址是否正确，错了可以<a href="javascript:void(0);">重新注册</a>一次。检查是否在邮箱的垃圾箱里。
* redirect_back_url 要兼容本登录地址 /account/login 的情况，防止死循环
* redirect_back_url 要兼容 Popup Type 的情况
* 显示/隐藏密码
  * Input Type 的 text 与 password 直接切换，或者两个元素切换
* 尴尬，validator 优化下
* 优化 focus YkCaptcha 内部的 yk-captcha-ipt
</docs>

<template>
  <div class="yk-register" data-com="YkRegister">
    <yu-header>
      <YuNavBar title=" " class="yk-register-bar">
        <YuButton class="yk-register-back" slot="left" type="text" @click="fnBack">
          <YuIcon class="yk-register-back_icon" name="yu-icon-close" slot="icon" />
        </YuButton>
      </YuNavBar>
    </yu-header>
    <template v-if="canRegister">
      <YuForm ref="form" class="yk-register-form">
        <YuField type="text" label="登录账号" :placeholder="accountPlaceholder" v-model.trim="oFormData.account" :rules="oRules.account" />
        <YuField v-show="accountType === 'mobile'" type="tel" label="手机验证" placeholder="请输入短信验证码" v-model.trim="oFormData.verify_code" :rules="oRules.verifyCode" >
          <YuButton class="yk-register-get_code" type="text" @click="getCode" slot="suffix">{{ nSec ? nSec + 's后可再试' : '获取验证码' }}</YuButton>
        </YuField>
        <YuField type="password" label="设置密码" placeholder="密码不少于6位" v-model.trim="oFormData.password" :rules="oRules.password" />
        <YuField type="password" label="确认密码" placeholder="再次输入所设置的密码" v-model.trim="oFormData.password_again" :rules="oRules.password_again" />
      </YuForm>
      <YuButton class="yk-register-submit" type="primary" size="large" @click="fnSubmit">注册</YuButton>
      <div class="yk-register-links">
        <span class="yk-register-login_label">已有账号？请</span>
        <YuButton type="text" @click="fnTo('/account/login')">直接登录</YuButton>
      </div>
    </template>
    <div v-else>
      <YuLoadTips class="yk-register-stop" :is-empty="true" empty-text="暂不提供账号注册服务">
        <YuIcon class="yk-register-stop_icon" name="yk-icon-register_stop" slot="empty_icon" />
        <YuButton class="yk-register-go_login" type="primary" @click="fnTo('/account/login')" slot="empty_ext">去登录</YuButton>
      </YuLoadTips>
    </div>
    <div class="yk-register-social">
      <AuthSocial />
    </div>
    <Captcha v-if="accountType === 'mobile'" v-model="onCaptcha" :mobile="oFormData.account" @sent="fnSent" />
  </div>
</template>

<script>
import Captcha from '../../Captcha'
import AuthSocial from './Social'

export default {
  name: 'YkRegister',
  components: {
    Captcha,
    AuthSocial
  },
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
              const canMobile = window.$$shop.enable_mobile_regist
              const canEmail = window.$$shop.enable_email_regist
              const canUsername = window.$$shop.enable_username_regist

              self.accountType = ''

              if (canMobile && window.yhsd.sdk.util.isMobile(val)) {
                self.accountType = 'mobile'
              } else if (canMobile && !canEmail && !canUsername) {
                this.err = '请输入正确的手机号码'
              }
              if (canEmail && window.yhsd.sdk.util.isEmail(val)) {
                self.accountType = 'email'
              } else if (!canMobile && canEmail && !canUsername) {
                this.err = '请输入正确的邮箱地址'
              }
              if (canUsername && window.yhsd.sdk.util.isUsername(val)) {
                self.accountType = 'uname'
              } else if (!canMobile && !canEmail && canUsername) {
                this.err = '4-16 个字符，以字母或汉字开头<br>允许数字、字母、汉字、下划线'
              }

              return !!self.accountType
            } else {
              return false
            }
          },
          err: '4-16 个字符，以字母或汉字开头<br>允许数字、字母、汉字、下划线'
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
            if (self.accountType === 'mobile') {
              if (val) {
                return (val.length > 0)
              } else {
                return false
              }
            } else {
              return true
            }
          },
          err: '请输入手机短信验证码'
        }]
      }
    }
  },
  computed: {
    canRegister () {
      return window.$$shop.enable_mobile_regist || window.$$shop.enable_email_regist || window.$$shop.enable_username_regist
    },
    accountPlaceholder () {
      let res = ''
      if (window.$$shop.enable_mobile_regist) {
        res += '/手机'
      }
      if (window.$$shop.enable_email_regist) {
        res += '/邮箱'
      }
      if (window.$$shop.enable_username_regist) {
        res += '/用户名'
      }
      return res.replace(/^\//, '')
    }
  },
  watch: {
    'oFormData.account' (val) {
      if (window.$$shop.enable_mobile_regist && window.yhsd.sdk.util.isMobile(val)) {
        this.accountType = 'mobile'
      } else {
        this.accountType = ''
      }
    }
  },
  created () {
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
    fnRegister () {
      this.err = ''

      const oParam = {}
      oParam.type = this.accountType || ''
      oParam.account = this.oFormData.account || ''
      oParam.password = this.oFormData.password || ''
      oParam.password_again = this.oFormData.password_again || ''

      if (oParam.type === 'mobile') {
        oParam.verify_code = this.oFormData.verify_code || ''
      }

      this.$toast.loading('注册中...')

      this.$sdk.account.register(oParam, data => {
        if (data && data.res) {
          const nCode = data.res.code
          if (nCode === 200) {
            this.$store.dispatch('account/setAccountInfo', data.res.customer || {})

            this.$toast.info('注册成功', 1000, () => {
              this.fnRegistered()
            })
          } else {
            this.err = data.res.message || '注册出错'
            this.$toast.info(this.err, 2500)
          }
        } else {
          this.err = '注册请求异常'
          this.$toast.info(this.err, 2500)
        }
      })
    },
    fnRegistered () {
      if (this.type === 'view') {
        const cookieBack = window.yhsd.sdk.util.getCookie('redirect_back_url')
        const redirect = this.$route.query.redirect_url || '' // 后端用的是 redirect_back_url，后面看看修改或兼容下
        if (cookieBack) {
          window.yhsd.sdk.util.setCookie('redirect_back_url', '')
          this.$router.replace(window.decodeURIComponent(cookieBack))
        } else if (redirect) {
          this.$router.replace(window.decodeURIComponent(redirect))
        } else {
          this.$router.replace('/account')
        }
      } else {
        // 清理防备下，有问题再去掉
        window.yhsd.sdk.util.setCookie('redirect_back_url', '')

        this.$emit('close')
      }
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
          this.fnRegister()
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
.yk-register-bar {
  background-color: transparent;
  border: none;
}
.yk-register-back {
  padding: 0 15px;
  color: #9e9e9e;
}
.yk-register-back:active {
  color: #9e9e9e;
  opacity: .7;
}
.yk-register-back_icon {
  width: 16px;
  width: 16px;
}
.yk-register-form {
  margin: 30px 0 20px;
}
.yk-register-get_code {
  position: relative;
  padding: 0 0 0 10px;
  border: 0 solid #d5d5d5;
  border-width: 0 0 0 var(--1px);
  height: 1.5em;
  text-align: right;
}
.yk-register-get_code:active {
  border-color: #d5d5d5;
}
.yk-register-submit {
  display: flex;
  margin: 20px auto 15px;
  width: calc(100% - 15px - 15px);
}
.yk-register-links {
  display: flex;
  padding: 0 15px;
}
.yk-register-login_label {
  margin: 0 .4em 0 0;
  color: #999;
}
.yk-register-social {
  margin: 100px 15px 0;
}
.yk-register-stop {
  margin: 46px 0 0;
}
.yk-register-stop_icon {
  margin: 0 0 15px;
  width: 80px;
  height: 80px;
}
.yk-register-go_login {
  margin: 16px 0 0;
}
</style>
