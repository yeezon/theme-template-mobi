<docs>
## YkSocialBind Docs

* 没有账号情况，需要新接口（注册并关联社交账号）
</docs>

<template>
  <div class="yk-social_bind" data-com="YkSocialBind">
    <template v-if="!isSucceed">
      <YuForm ref="form" class="yk-social_bind-form">
        <template v-if="nBindType === 3">
          <YuField type="text" label="账号绑定" placeholder="请输入已有账号" v-model.trim="oFormData.account" required />
          <YuField type="password" label="账号密码" placeholder="请输入密码" v-model.trim="oFormData.password" required />
        </template>
        <template v-else>
          <YuField v-if="nBindType === 2 || nBindType === 4" type="tel" label="手机" placeholder="请输入手机号码" v-model.trim="oFormData.notify_phone" :rules="oRules.mobi" />
          <YuField v-if="nBindType === 2 || nBindType === 5" type="email" label="邮箱" placeholder="请输入邮箱地址" v-model.trim="oFormData.notify_email" :rules="oRules.email" />
        </template>
      </YuForm>
      <YuButton class="yk-social_bind-submit" type="primary" size="large" @click="fnSubmit">确定</YuButton>
    </template>
    <YuStatusTips v-else cont="绑定成功" button="去账户中心" @action="fnTo('/account')" icon="yu-icon-succeed_tips" />
  </div>
</template>

<script>
export default {
  componentName: 'YkSocialBind',
  props: {
    type: {
      type: String,
      default: 'view' // view | popup
    }
  },
  data () {
    return {
      err: '',
      isSucceed: false,
      nBindType: 3, // 2: 绑定邮箱手机 | 3: 登录 | 4: 绑定手机 | 5: 绑定邮箱
      oFormData: {
        account: '',
        password: '',
        notify_phone: '',
        notify_email: ''
      },
      oRules: {
        mobi: [{
          validator (val) {
            return this.$sdk.util.isMobile(val)
          },
          err: '请输入正确的手机号码'
        }],
        email: [{
          validator (val) {
            return this.$sdk.util.isEmail(val)
          },
          err: '请输入正确的邮箱地址'
        }]
      }
    }
  },
  created () {
    this.err = ''
    this.isSucceed = false
    this.oFormData.account = ''
    this.oFormData.password = ''
    this.oFormData.notify_phone = ''
    this.oFormData.notify_email = ''
  },
  methods: {
    fnReset () {
      if (this.nBindType !== 'mobile') return

      this.err = ''

      const oParam = {}
      oParam.account = this.oFormData.account || ''
      oParam.password = this.oFormData.password || ''
      oParam.notify_phone = this.oFormData.notify_phone || ''
      oParam.notify_email = this.oFormData.notify_email || ''

      this.$toast.loading('处理中...')

      // this.$sdk.account.resetPasswordWithMobile(oParam, data => {
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
          if (this.nBindType === 'mobile') {
            this.fnReset()
          } else if (this.nBindType === 'email') {
            this.fnResetEmail()
          }
        }
      })
    },
    fnBack () {
      if (this.type === 'view') {
        this.$router.back()
      } else {
        this.$emit('close') // 没有操作
      }
    },
    fnTo (path) {
      this.$emit('to', path)
    }
  }
}
</script>

<style scoped>
.yk-social_bind {
  overflow: hidden;
}
.yk-social_bind-form {
  margin: 30px 0 20px;
}
.yk-social_bind-submit {
  display: flex;
  margin: 20px auto 15px;
  width: calc(100% - 15px - 15px);
}
</style>
