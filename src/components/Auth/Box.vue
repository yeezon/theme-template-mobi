<docs>
## AuthBox Docs

* 用动态模板
</docs>

<template>
  <div class="auth-box" data-com="AuthBox" @touchmove.prevent.stop>
    <Login v-if="action === 'login'" type="view" @to="fnTo" />
    <Register v-if="action === 'register'" type="view" @to="fnTo" />
    <ForgetPassword v-if="action === 'forget_password'" type="view" @to="fnTo" />
    <SocialBind v-if="action === 'social_bind'" type="view" @to="fnTo" />
  </div>
</template>

<script>
import Login from './components/Login'
import Register from './components/Register'
import ForgetPassword from './components/ForgetPassword'
import SocialBind from './components/SocialBind'

export default {
  name: 'AuthBox',
  components: {
    Login,
    Register,
    ForgetPassword,
    SocialBind
  },
  data () {
    return {
      action: '' // login | register | forget_password | reset
    }
  },
  watch: {
    $route () {
      this.setType()
    }
  },
  created () {
    this.setType()
  },
  methods: {
    setType () {
      const _path = this.$route.path || ''

      switch (true) {
        case /^\/account\/login/.test(_path):
          this.action = 'login'
          break
        case /^\/account\/register/.test(_path):
          this.action = 'register'
          break
        case /^\/account\/forget_password/.test(_path):
          this.action = 'forget_password'
          break
        case /^\/account\/social\/bind/.test(_path):
          this.action = 'social_bind'
          break
        default:
          this.action = ''
      }
    },
    fnTo (path) {
      this.$router.push(path)
    }
  }
}
</script>

<style scoped>
.auth-box {
  height: var(--100vh);
}
</style>
