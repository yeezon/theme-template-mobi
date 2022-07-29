<docs>
## YkLogin Docs

* redirect_back_url 要兼容本登录地址 /account/login 的情况，防止死循环
* redirect_back_url 要兼容 Popup Type 的情况
* 显示/隐藏密码
  * Input Type 的 text 与 password 直接切换，或者两个元素切换
</docs>

<template>
  <div class="yk-login" data-com="YkLogin">
    <yu-header>
      <YuNavBar title=" " class="yk-login-bar">
        <YuButton class="yk-login-back" slot="left" type="text" @click="fnBack">
          <YuIcon class="yk-login-back_icon" name="yu-icon-close" slot="icon" />
        </YuButton>
      </YuNavBar>
    </yu-header>
    <YuForm ref="form" class="yk-login-form">
      <YuField type="text" label="账号" placeholder="手机/用户名/邮箱" v-model.trim="oFormData.account" required />
      <YuField type="password" label="密码" placeholder="请输入密码" v-model.trim="oFormData.password" required />
    </YuForm>
    <YuButton class="yk-login-submit" type="primary" size="large" @click="fnSubmit">登录</YuButton>
    <div class="yk-login-links">
      <YuButton type="text" @click="fnTo('/account/forget_password')">忘记密码?</YuButton>
      <YuButton type="text" @click="fnTo('/account/register')">立即注册</YuButton>
    </div>
    <div class="yk-login-social">
      <AuthSocial />
    </div>
  </div>
</template>

<script>
import AuthSocial from './Social'

export default {
  name: 'YkLogin',
  components: {
    AuthSocial
  },
  props: {
    type: {
      type: String,
      default: 'view' // view | popup
    }
  },
  data () {
    return {
      err: '',
      oFormData: {
        account: '',
        password: ''
      }
    }
  },
  created () {
    this.oFormData.account = ''
    this.oFormData.password = ''
  },
  methods: {
    fnLogin () {
      this.err = ''
      this.$toast.loading('登录中...')

      this.$sdk.account.login({
        account: this.oFormData.account || '',
        password: this.oFormData.password || ''
      }, data => {
        if (data && data.res) {
          const nCode = data.res.code
          if (nCode === 200) {
            this.$store.dispatch('account/setAccountInfo', data.res.customer || {})

            this.$toast.off()
            this.fnLogined()
          } else if (nCode === 201) {
            this.err = data.res.message || '账号和密码不匹配'
            this.$toast.info(this.err)
          } else {
            this.err = data.res.message || '登录出错'
            this.$toast.info(this.err)
          }
        } else {
          this.err = '登录请求异常'
          this.$toast.info(this.err)
        }
      })
    },
    fnLogined () {
      if (this.type === 'view') {
        const cookieBack = this.$sdk.util.getCookie('redirect_back_url')
        const redirect = this.$route.query.redirect_url || '' // 后端用的是 redirect_back_url，后面看看修改或兼容下

        if (cookieBack) {
          this.$sdk.util.setCookie('redirect_back_url', '')
          this.$router.replace(window.decodeURIComponent(cookieBack))
        } else if (redirect) {
          this.$router.replace(window.decodeURIComponent(redirect))
        } else {
          this.$router.replace('/account')
        }
      } else {
        // 清理防备下，有问题再去掉
        this.$sdk.util.setCookie('redirect_back_url', '')

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
    fnSubmit (cb) {
      this.fnValidate(err => {
        if (err) {
          this.err = err
          this.$toast.info(this.err)
        } else {
          this.fnLogin()
        }
      })
    },
    fnTo (path) {
      this.$emit('to', path)
    }
  }
}
</script>

<style scoped>
.yk-login-bar {
  background-color: transparent;
  border: none;
}
.yk-login-back {
  padding: 0 15px;
  color: #9e9e9e;
}
.yk-login-back:active {
  color: #9e9e9e;
  opacity: .7;
}
.yk-login-back_icon {
  width: 16px;
  width: 16px;
}
.yk-login-form {
  margin: 30px 0 20px;
}
.yk-login-submit {
  display: flex;
  margin: 20px auto 15px;
  width: calc(100% - 15px - 15px);
}
.yk-login-links {
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
}
.yk-login-social {
  margin: 100px 15px 0;
}
.yk-login-social_items {
  margin: 15px 0 0;
}
</style>
