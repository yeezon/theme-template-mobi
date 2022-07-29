<docs>
## YkValidateEmail Docs

* 等接口
* 已经失效提示
</docs>

<template>
  <div class="yk-validate_email" data-com="YkValidateEmail">
    <yu-header>
      <YuNavBar title=" " class="yk-validate_email-bar">
        <YuButton class="yk-validate_email-back" slot="left" type="text" @click="fnBack">
          <YuIcon class="yk-validate_email-back_icon" name="yu-icon-close" slot="icon" />
        </YuButton>
      </YuNavBar>
    </yu-header>
    <YuLoadTips v-if="isLoading || !!err" :is-loading="isLoading" :is-error="!isLoading && !!err" error-text="验证失败~" @retry="fnCheck" />
    <YuStatusTips v-else cont="验证成功" button="去登录" @action="fnTo('/account/login')" icon="yu-icon-succeed_tips" />
  </div>
</template>

<script>
export default {
  componentName: 'YkValidateEmail',
  data () {
    return {
      err: '',
      isLoading: true
    }
  },
  created () {
    this.fnCheck()
  },
  methods: {
    fnCheck () {
      this.err = ''
      this.isLoading = true

      // this.$route.params.key

      // this.$sdk.account.resetPasswordByEmail(oParam, data => {
      //   if (data && data.res) {
      //     const nCode = data.res.code
      //     if (nCode === 200) {
      //       this.$toast.off()
      //       this.fnCheckAfter()
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
    fnCheckAfter () {
      this.isLoading = true
    },
    fnBack () {
      // type -> view
      this.$router.back()
    },
    fnTo (path) {
      this.$emit('to', path)
    }
  }
}
</script>

<style scoped>
.yk-validate_email-bar {
  background-color: transparent;
  border: none;
}
.yk-validate_email-back {
  padding: 0 15px;
  color: #9e9e9e;
}
.yk-validate_email-back:active {
  color: #9e9e9e;
  opacity: .7;
}
.yk-validate_email-back_icon {
  width: 16px;
  width: 16px;
}
</style>
