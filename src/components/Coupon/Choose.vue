<docs>
## YkCouponChoose Docs

### To-do List

* 把 YkCouponInput 业务逻辑切换到 YkCouponChoose
* ticket icon 抽出成组件

</docs>

<template>
  <div class="yk-coupon_choose" data-com="YkCouponChoose">
    <YuHeader :is-fixed="true">
      <YuNavBar :title="title" :has-back="false">
        <YuButton class="yk-coupon_choose-close_btn" slot="right" type="text" @click="fnDisuse">不使用</YuButton>
      </YuNavBar>
    </YuHeader>
    <div class="yk-coupon_choose-box">
      <YkCouponInput @change="fnCouponInput" :code="coupon.id ? '' : (coupon.code || '')" />
      <YuRadioGroup v-show="!isEmpty" :value="nVal" @input="fnChoose" class="yk-coupon_choose-items">
        <template v-for="oCoupon in coupons">
          <YuRadio :key="oCoupon.id" v-if="isShow(oCoupon)" class="yk-coupon_choose-item" @click="fnClose(oCoupon.id)" :val="oCoupon.id" align="left">
            <div class="yk-coupon_choose-ticket">
              <div class="yk-coupon_choose-icon">
                <div class="yk-coupon_choose-icon_info"><YuCurrency v-if="isAmount(oCoupon)" :decimal="0" :val="getDesc(oCoupon)" /><span v-else>{{ getDesc(oCoupon) }}</span><br><span class="yk-coupon_choose-icon_desc"><span>满</span><YuCurrency :decimal="0" :val="oCoupon.active_amount" /><span v-if="isAmount(oCoupon)"><span> 减</span><YuCurrency :decimal="0" :val="getDesc(oCoupon)" /></span><span v-else> 打 {{ getDesc(oCoupon) }}</span></span></div>
              </div>
              <div class="yk-coupon_choose-info">
                <span class="yk-coupon_choose-info_title">{{ oCoupon.coupon_group_name }}</span>
                <span>{{ oCoupon.actived_at | date }} - {{ (oCoupon.expired_at || '永久') | date }}</span>
                <span>编码: {{oCoupon.code}}</span>
              </div>
            </div>
          </YuRadio>
        </template>
      </YuRadioGroup>
      <div v-if="isEmpty && !isLoading" class="yk-coupon_choose-empty">
        <svg class="yk-coupon_choose-empty_icon">
          <use xlink:href="#yk-ico-coupon" />
        </svg>
        <div class="yk-coupon_choose-empty_text">暂无可用优惠券</div>
      </div>
      <YuHomeIndicator />
    </div>
  </div>
</template>

<script>
import YkCouponInput from './Input'

export default {
  name: 'YkCouponChoose',
  components: {
    YkCouponInput
  },
  props: {
    title: {
      type: String,
      default: null
    },
    coupon: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data: function () {
    return {
      isLoading: true,
      nVal: this.coupon.id || null,
      oldVal: this.coupon.id || null,
      isLock: false,
      isEmpty: true,
      coupons: [],
      oCouponsMap: {} // 利用 isShow 做映射建立
    }
  },
  created () {
    this.isLoading = true
    this.getCoupons(err => {
      if (err) {
        this.$toast.info(err)
      }
      this.isLoading = false
    })
  },
  methods: {
    isShow (oCoupon) {
      let _isShow = false
      // Map 处理
      if (oCoupon.id) {
        this.oCouponsMap[oCoupon.id] = oCoupon
      }
      // isEmpty & isShow 处理
      if (oCoupon.cart_match && oCoupon.status === 'pending') {
        if (this.isEmpty) {
          this.isEmpty = false
        }
        _isShow = true
      }
      return _isShow
    },
    isAmount (oCoupon) {
      return oCoupon.utype === 'amount'
    },
    getDesc (oCoupon) {
      let _name
      switch (oCoupon.utype) {
        case 'amount' :
          _name = parseInt(oCoupon.discount_amount)
          break
        case 'percentage' :
          _name = ((oCoupon.discount_percentage || 0) / 10).toFixed(1).replace('.0', '') + ' 折'
          break
        default:
          _name = null
      }
      return _name
    },
    fnDisuse () {
      this.$emit('change', {})
    },
    fnChoose (nVal) {
      if (!this.isLock) {
        this.nVal = nVal
        this.isLock = true
        const oCoupon = this.getCoupon(nVal)
        this.$toast.loading('验证中...')
        this.fnCheck(oCoupon.code, (err, isAvail, nAmount) => {
          this.isLock = false
          if (err) {
            this.$toast.info(err)
            this.nVal = this.oldVal
          } else {
            if (isAvail) {
              // this.$toast.info('优惠券验证成功', 800)
              this.$toast.off()
              oCoupon.discount_amount = nAmount
              this.$emit('change', oCoupon)
            } else {
              this.$toast.info('此优惠码不可用')
              this.nVal = this.oldVal
            }
          }
        })
      }
    },
    fnCouponInput (val) {
      if (!this.isLock) {
        this.isLock = true
        window.setTimeout(() => {
          this.$emit('change', val)
          this.isLock = false
        }, 300)
      }
    },
    getCoupon (id) {
      return JSON.parse(JSON.stringify(this.oCouponsMap[id] || {}))
    },
    getCoupons (cb) {
      this.$sdk.coupon.get(data => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            this.coupons = data.res.coupons || []
          } else {
            err = data.res.message || '优惠券数据获取出错'
          }
        } else {
          err = '优惠券数据请求异常'
        }
        cb && cb(err)
      })
    },
    fnClose (id) {
      if (this.oldVal === id) {
        this.$emit('close')
      }
    },
    fnCheck (code, cb) {
      this.$sdk.coupon.verify({ coupon_code: code }, data => {
        let err = null
        let isAvail = false
        let nAmount = 0
        if (data && data.res) {
          if (data.res.code === 200) {
            isAvail = data.res.avail
            nAmount = data.res.discount_amount
          } else {
            err = data.res.message || '优惠券验证数据获取出错'
          }
        } else {
          err = '优惠券验证数据请求异常'
        }
        cb && cb(err, isAvail, nAmount)
      })
    }
  }
}
</script>

<style scoped>
  .yk-coupon_choose {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100%;
  }
  .yk-coupon_choose-close_btn {
    display: block;
    padding: 0 15px;
  }
  .yk-coupon_choose-close_icon {
    padding: 0 20px;
    width: 15px;
  }
  .yk-coupon_choose-box {
    flex: 1;
    -webkit-overflow-scrolling: touch;
    will-change: scroll-position;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .yk-coupon_choose-empty {
    margin: 15px 0;
    padding: 30px 0;
    text-align: center;
    color: #999;
  }
  .yk-coupon_choose-empty_icon {
    margin: 0 auto;
    width: 100px;
    height: 100px;
    color: currentColor;
  }
  .yk-coupon_choose-items {
    margin: 0;
    padding: 8px 0;
  }
  .yk-coupon_choose-item {
    padding: 8px 0 8px 15px;
  }
  .yk-coupon_choose-ticket {
    display: flex;
  }
  .yk-coupon_choose-icon {
    display: flex;
    position: relative;
    margin: auto 0;
    background-color: #ff5a5a;
    width: 92px;
    height: 46px;
    color: #fff;
    font-size: 15px;
    line-height: 1;
    text-align: center;
  }
  .yk-coupon_choose-icon::after {
    content: '\20';
    position: absolute;
    top: -1px;
    left: -1px;
    width: 100%;
    height: 100%;
    border-color: #ff5a5a;
    border-width: 1px;
    border-left-style: dashed;
    border-right-style: dashed;
    border-top-style: solid;
    border-bottom-style: solid;
  }
  .yk-coupon_choose-icon_info {
    margin: auto;
  }
  .yk-coupon_choose-icon_desc {
    font-size: 12px;
    word-break: break-all;
  }
  .yk-coupon_choose-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: auto 0 auto 9px;
    font-size: 12px;
    line-height: 1.3em;
  }
  .yk-coupon_choose-info_title {
    font-size: 12px;
  }
</style>
