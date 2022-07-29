<docs>
## YkCaptcha Docs

* 不用移入 Dialog
* 有 isLock，$sdk.captcha.fetch 需要支持错误返回
* fixed 换 absolute，避免 focus 兼容问题

* 输入验证码，确定后，返回手机已经注册，继续同一个验证码，不同 captcha_id ID，能直接通过，再次返回手机已经注册
</docs>

<template>
  <transition name="yk-captcha-fade">
    <div v-show="value" class="yk-captcha" data-com="YkCaptcha">
      <div v-if="value" class="yk-captcha-box">
        <div class="yk-captcha-head">
          <div class="yk-captcha-title">获取手机短信验证码</div>
          <YuButton class="yk-captcha-reset_img" type="text" @click="getImg">看不清？</YuButton>
        </div>
        <div class="yk-captcha-cont">
          <input class="yk-captcha-code" type="tel" v-model="code" placeholder="请输入右边验证码" />
          <img class="yk-captcha-img" v-if="src" :src="src" />
          <span class="yk-captcha-img" v-else><span>码图读取中..</span></span>
        </div>
        <div class="yk-captcha-btns">
          <YuButton type="primary" class="yk-captcha-btn_ok" @click="fnSubmit">确认</YuButton>
          <YuButton class="yk-captcha-btn_no" @click="fnCancel">取消</YuButton>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  componentName: 'YkCaptcha',
  props: {
    type: {
      type: String,
      default: 'register' // register / reset
    },
    value: {
      type: Boolean,
      default: false
    },
    mobile: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      on: false,
      isLock: false,
      nTimeout: null,
      code: '',
      id: '',
      src: ''
    }
  },
  watch: {
    value (val) {
      this.setEmpty()
      if (val) {
        this.getImg()
      }
    }
  },
  methods: {
    getImg () {
      if (!this.isLock) {
        this.isLock = true
        this.$sdk.captcha.fetch(data => {
          if (data.id && data.src) {
            this.id = data.id
            this.src = data.src
          } else {
            this.$toast.info('获取数据异常<br>稍后请点「看不清」重试', 2500)
          }
          // 防止无聊用户，减轻服务器压力
          // fnClose 记得 clearTimeout
          this.nTimeout = window.setTimeout(() => {
            this.isLock = false
          }, 1000)
        })
      }
    },
    getSMS () {
      if (!this.isLock && this.code && this.mobile && this.id) {
        const fnAPI = this.type === 'reset' ? this.$sdk.account.sendResetValidateSms : this.$sdk.account.sendRegistValidateSms
        this.$toast.loading('验证中...')
        fnAPI({
          mobile: this.mobile,
          captcha_id: this.id,
          captcha_value: this.code
        }, data => {
          if (data && data.res) {
            if (data.res.code === 200) {
              this.$toast.off()
              this.$emit('sent')
              this.fnClose()
            } else if (data.res.code === 201) {
              this.$toast.info(data.res.message || '短信获取失败', 2000)
              this.getImg()
            } else {
              this.$toast.info(data.res.message || '短信获取出错', 2000)
              this.getImg()
            }
          } else {
            this.$toast.info('短信请求异常', 2000)
            this.getImg()
          }
        })
      } else if (!this.code) {
        this.$toast.info('请输入验证码')
      }
    },
    setEmpty () {
      this.code = ''
      this.id = ''
      this.src = ''
    },
    fnSubmit () {
      this.getSMS()
    },
    fnCancel () {
      this.fnClose()
    },
    fnClose () {
      // 记得 clearTimeout
      window.clearTimeout(this.nTimeout)
      this.isLock = false

      this.$emit('input', false)
    }
  }
}
</script>

<style scoped>
  .yk-captcha {
    z-index: 999;
    display: flex;
    /* position: fixed; */
    position: absolute; /* 避免 WebView Input 输入导致的 View 错位问题 */
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, .3);
    transition: .18s ease-out;
  }
  .yk-captcha.yk-captcha-fade-enter,
  .yk-captcha.yk-captcha-fade-leave-active {
    background: rgba(0, 0, 0, 0);
  }
  .yk-captcha:hover {
    will-change: transform;
  }
  .yk-captcha .yk-captcha-box {
    margin: auto;
    padding: 20px;
    width: min-content;
    border: 0 solid transform;
    border-radius: 5px;
    background-color: #fff;
    transform: translateY(-30%);
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, .3);
  }
  .yk-captcha-head {
    display: flex;
    justify-content: space-between;
    margin: 0 0 20px;
  }
  .yk-captcha-title {
    font-size: 18px;
    font-weight: bold;
  }
  .yk-captcha-cont {
    display: flex;
    align-items: center;
  }
  .yk-captcha-code {
    box-sizing: border-box;
    flex: 1;
    display: block;
    padding: 15px;
    width: 150px;
    height: 50px;
    line-height: 20px;
    border: var(--1px) solid #d5d5d5;
    border-radius: 3px;
    font-size: 14px;
  }
  .yk-captcha-img {
    display: flex;
    margin: 0 0 0 10px;
    width: 150px;
    border-radius: 3px;
  }
  .yk-captcha-img > span {
    display: block;
    margin: auto;
  }
  .yk-captcha-btns {
    display: flex;
    justify-content: center;
    margin: 20px 0 0;
  }
  .yk-captcha-btn_ok,
  .yk-captcha-btn_no {
    flex: 1;
  }
  @media screen and (max-width: 360px) {
    .yk-captcha-code,
    .yk-captcha-img {
      width: 132px;
    }
    .yk-captcha-code {
      padding: 10px;
      height: 44px;
      line-height: 24px;
    }
  }
</style>
