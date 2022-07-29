<docs>
## YkCouponInput Docs

* 把业务逻辑切换到 YkCouponChoose
</docs>

<template>
  <div class="yk-coupon_input" data-com="YkCouponInput">
    <input v-model="val" class="yk-coupon_input-ipt" type="text" placeholder="输入优惠码">
    <YuButton class="yk-coupon_input-btn" :disabled="!val || isLock" @click="fnSend" type="primary" size="small">确定</YuButton>
  </div>
</template>

<script>
export default {
  componentName: 'YkCouponInput',
  props: {
    code: {
      type: String,
      default: ''
    }
  },
  data: function () {
    return {
      val: this.code,
      isAvail: false,
      couponName: '',
      nDiscountAmount: null,
      nDiscountPercentage: null,
      utype: '',
      isLock: false
    }
  },
  methods: {
    getData () {
      return {
        id: null, // 结合 code 判断是输入的还是选择的
        code: this.val, // 结合 id 判断是输入的还是选择的
        coupon_name: this.couponName,
        discount_amount: this.nDiscountAmount,
        discount_percentage: this.nDiscountPercentage,
        utype: this.utype
      }
    },
    setData (data) {
      this.isAvail = data.avail
      this.couponName = data.coupon_name
      this.nDiscountAmount = data.discount_amount || null
      this.nDiscountPercentage = data.discount_percentage || null
      this.utype = data.utype
    },
    fnSend () {
      if (!this.isLock) {
        this.isLock = true
        this.$toast.loading('验证中...')
        setTimeout(() => {
          this.fnCheck(this.val, err => {
            this.isLock = false
            if (err) {
              this.$toast.info(err)
            } else {
              if (this.isAvail) {
                // this.$toast.info('优惠券验证成功', 800)
                this.$toast.off()
                this.$emit('change', this.getData())
              } else {
                this.$toast.info('此优惠码不可用')
              }
            }
          })
        }, 300)
      }
    },
    fnCheck (code, cb) {
      this.$sdk.coupon.verify({ coupon_code: code }, (data) => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            this.setData(data.res)
          } else {
            err = data.res.message || '优惠券验证数据获取出错'
          }
        } else {
          err = '优惠券验证数据请求异常'
        }
        cb && cb(err)
      })
    }
  }
}
</script>

<style scoped>
  .yk-coupon_input {
    display: flex;
    margin: 15px 15px 4px;
    padding: 8px 13px 8px 14px;
    border: 0 solid var(--borderColor);
    border-width: var(--1px);
    border-radius: 4px;
  }
  .yk-coupon_input-ipt {
    flex: 1;
    -webkit-tap-highlight-color: transparent;
    outline: none;
    margin: 0 15px 0 0;
    padding: 0;
    border: none;
  }
  .yk-coupon_input-btn {
    padding-left: 1em;
    padding-right: 1em;
  }
</style>
