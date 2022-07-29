<docs>
## YkCouponList Docs

* API 没有类型区分，只能先一次请求全部数据做分类

### To-do List

* 优化显示，coupons 放父级组件里，在父级点击进入的时候加载 coupons 数据
* 父级提供 getCoupons Event，刷新当前页的时候也正常显示
* ticket icon 抽出成组件
* 数据获取错误提示处理

</docs>

<template>
  <div class="yk-coupon_list" data-com="YkCouponList">
    <yu-header :is-fixed="true">
      <YuNavBar title="优惠券" />
    </yu-header>
    <div class="yk-coupon_list-tabs yu-cells">
      <span><button class="yk-coupon_list-tab" :class="{ 'i-active': nShowType === 0 }" @click="fnTab(0)">未使用</button></span>
      <span><button class="yk-coupon_list-tab" :class="{ 'i-active': nShowType === 1 }" @click="fnTab(1)">已使用</button></span>
      <span><button class="yk-coupon_list-tab" :class="{ 'i-active': nShowType === 2 }" @click="fnTab(2)">已过期</button></span>
    </div>
    <div class="yk-coupon_list-coupons">
      <div class="yk-coupon_list-coupon yu-cells" v-for="oCoupon in coupons" v-show="isShow(oCoupon.status)" :key="oCoupon.id">
        <div class="yk-coupon_list-coupon_bar"><span>{{oCoupon.coupon_group_name}}</span><span class="yk-coupon_list-coupon_bar_desc">{{fnStatusDesc(oCoupon.status)}}</span></div>
        <div class="yk-coupon_list-ticket">
          <div class="yk-coupon_list-icon">
            <div class="yk-coupon_list-icon_info"><YuCurrency v-if="isAmount(oCoupon)" :decimal="0" :val="getDesc(oCoupon)" /><span v-else>{{ getDesc(oCoupon) }}</span><br><span class="yk-coupon_list-icon_desc"><span>满</span><YuCurrency :decimal="0" :val="oCoupon.active_amount" /><span v-if="isAmount(oCoupon)"><span> 减</span><YuCurrency :decimal="0" :val="getDesc(oCoupon)" /></span><span v-else> 打 {{ getDesc(oCoupon) }}</span></span></div>
          </div>
          <div class="yk-coupon_list-info">
            <span class="yk-coupon_list-info_title">{{ oCoupon.coupon_group_name }}</span>
            <span>{{ oCoupon.actived_at | date }} - {{ (oCoupon.expired_at || '永久') | date }}</span>
            <span>编码: {{oCoupon.code}}</span>
          </div>
        </div>
      </div>
      <YuLoadTips v-if="!hasShow && !isLoading" :is-empty="true" empty-text="暂无相关优惠券" empty-icon="yk-icon-coupon" />
    </div>
  </div>
</template>

<script>
export default {
  componentName: 'YkCouponList',
  data () {
    return {
      err: '',
      isLoading: false,
      coupons: [],
      nShowType: 0,
      hasShow: false
    }
  },
  watch: {
    coupons () {
      this.isLoading = false
      this.hasShow = false
    }
  },
  created () {
    this.isLoading = true
    this.getCoupons(err => {
      if (err) {
        this.$toast.info(err)
      }
    })
  },
  methods: {
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
    fnTab (type) {
      this.hasShow = false
      this.nShowType = type
    },
    isShow (status) {
      let _res = false
      if (this.nShowType === 1) {
        _res = status === 'used'
      } else if (this.nShowType === 2) {
        _res = status === 'expired'
      } else {
        _res = status === 'pending'
      }
      if (_res) {
        this.hasShow = true
      }
      return _res
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
    fnStatusDesc (status) {
      let _res = '有效'
      if (status === 'used') {
        _res = '已使用'
      } else if (status === 'expired') {
        _res = '已过期'
      }
      return _res
    }
  }
}
</script>

<style scoped>
  .yk-coupon_list {
    margin: 0;
    padding: 0;
  }
  .yk-coupon_list-tabs {
    display: flex;
    border-top-width: 0;
  }
  .yk-coupon_list-tabs > span {
    display: block;
    flex: 1;
    text-align: center;
  }
  .yk-coupon_list-tab {
    position: relative;
    margin: 0;
    padding: 0;
    min-width: 3em;
    outline: none;
    line-height: 38px;
    background-color: transparent;
    border: none;
    font-size: 14px;
  }
  .yk-coupon_list-tab.i-active {
    color: #4685ee;
  }
  .yk-coupon_list-tab.i-active::after {
    position: absolute;
    display: block;
    content: "\20";
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    font-size: 0;
    line-height: 0;
    background-color: currentColor;
  }
  .yk-coupon_list-coupons {
    overflow: hidden;
  }
  .yk-coupon_list-coupon {
    padding: 0;
  }
  .yk-coupon_list-coupon_bar {
    padding: 13px 15px;
    overflow: hidden;
    border: 0 solid #d5d5d5;
    border-width: 0 0 var(--1px);
    line-height: 1;
  }
  .yk-coupon_list-coupon_bar_desc {
    float: right;
  }

  .yk-coupon_list-ticket {
    display: flex;
    margin: 13px 0 13px 15px;
  }
  .yk-coupon_list-icon {
    display: flex;
    position: relative;
    margin: auto 0;
    background-color: #ff5a5a;
    width: 100px;
    height: 55px;
    color: #fff;
    font-size: 16px;
    line-height: 1;
    text-align: center;
  }
  .yk-coupon_list-icon::after {
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
  .yk-coupon_list-icon_info {
    margin: auto;
  }
  .yk-coupon_list-icon_desc {
    display: inline-block;
    margin: 5px 0 0;
    font-size: 13px;
    word-break: break-all;
  }
  .yk-coupon_list-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: auto 0 auto 10px;
    font-size: 13px;
    line-height: 1.3em;
    color: #777;
  }
  .yk-coupon_list-info_title {
    margin: 0 0 5px;
    font-size: 14px;
    color: #333;
  }
</style>
