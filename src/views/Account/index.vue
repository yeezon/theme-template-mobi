<docs>
## YkAccountView Docs

* 退出成功后记得清理 Vuex 里账户相关的数据
  * 可以的话最好刷新

* 下拉刷新
* 5 分钟内点击刷新
* 优化 activated 的 this.update() 时机
</docs>

<template>
  <div class="yk-account" data-com="YkAccountView" :key="oAccount.id">
    <div class="yk-account-main_view">
      <YkAccountInfo class="yu-cells" :account="oAccount" @click="fnTo('/account/user')" />
      <YkAccountOrdersNav :wait-pay="nWaitPay" :wait-get="nWaitGet" @to="fnTo" class="yu-cells" />
      <div class="yu-cells">
        <YuCell label="会员等级" :placeholder="oLevel.name" @click="fnTo('/account/member')" :is-link="true">
          <YuIcon class="yk-account-icon" name="yk-icon-level" slot="icon" />
        </YuCell>
      </div>
      <div class="yu-cells">
        <YuCell label="优惠券" @click="fnTo('/account/coupon')" :is-link="true">
          <YuIcon class="yk-account-icon" name="yk-icon-coupon_2" slot="icon" />
        </YuCell>
        <YuCell label="积分" @click="fnTo('/account/points')" :is-link="true">
          <YuIcon class="yk-account-icon" name="yk-icon-points" slot="icon" />
        </YuCell>
      </div>
      <div class="yu-cells">
        <YuCell label="个人信息" @click="fnTo('/account/user')" :is-link="true">
          <YuIcon class="yk-account-icon" name="yk-icon-user" slot="icon" />
        </YuCell>
        <YuCell label="安全设置" @click="fnTo('/account/security')" :is-link="true">
          <YuIcon class="yk-account-icon" name="yk-icon-security" slot="icon" />
        </YuCell>
        <YuCell label="收货地址" @click="fnTo('/account/addresses')" :is-link="true">
          <YuIcon class="yk-account-icon" name="yk-icon-address_3" slot="icon" />
        </YuCell>
      </div>
      <!-- <div class="yu-cells">
        <YuCell :label="about" @click="fnTo('/pages/about')" :is-link="true" :placeholder="appVer">
          <YuIcon class="yk-account-icon" name="yk-icon-about" slot="icon" />
        </YuCell>
      </div> -->
      <div v-if="isSigned" class="yk-account-signout yu-cells">
        <YuButton class="yk-account-signout_btn" type="text" @click="fnSignOut">退出当前账号</YuButton>
      </div>
    </div>
  </div>
</template>

<script>
import YkAccountInfo from './Info'
import YkAccountOrdersNav from './OrdersNav'

export default {
  componentName: 'YkAccountView',
  components: {
    YkAccountInfo,
    YkAccountOrdersNav
  },
  data () {
    return {
      appVer: (window.$$settings || {}).app_ver || '',
      about: (window.$$settings || {}).about || '关于我们',
      nWaitPay: null,
      nWaitGet: null
    }
  },
  computed: {
    oAccount () {
      if (this.isSigned) {
        this.update()
      }

      return this.$store.state.account.oInfo || {}
    },
    isSigned () {
      return this.$store.state.account.isSigned
    },
    oLevel () {
      return this.oAccount.customer_level || {}
    }
  },
  created () {
    this.update()
  },
  methods: {
    fnTo (path) {
      this.$router.push(path)
    },
    fnSignOut () {
      this.$sdk.account.logout(data => {
        if (data && data.res) {
          if (data.res.code === 200) {
            // 清空 Vuex 用户数据
            this.$store.dispatch('account/setAccountInfo', {})

            this.nWaitPay = 0
            this.nWaitGet = 0

            // 退出成功后记得清理 Vuex 里账户相关的数据
            // 可以简单点用 window.location.href 刷新跳转，暂时没必要
            this.$toast.info('成功退出')
          } else {
            this.$toast.info(data.res.message || '退出出错')
          }
        } else {
          this.$toast.info('退出请求异常')
        }
      })
    },
    update () {
      // this.getAccount(err => {
      //   if (err) {
      //     this.$toast.info(err)
      //   }
      // })
      this.getWaitPay(err => {
        if (err) {
          this.$toast.info(err)
        }
      })
      this.getWaitSend(err => {
        if (err) {
          this.$toast.info(err)
        }
      })
    },
    // getAccount (cb) {
    //   if (!this.$store.state.account.isSigned) {
    //     this.$sdk.account.current(data => {
    //       let err = null
    //       if (data && data.res) {
    //         if (data.res.code === 200) {
    //           this.$store.dispatch('account/setAccountInfo', data.res.customer || {})
    //         } else {
    //           this.$store.dispatch('account/setAccountInfo', {})
    //           err = data.res.message || '用户数据获取出错'
    //         }
    //       } else {
    //         err = '用户数据请求异常'
    //       }
    //       cb && cb(err)
    //     })
    //   }
    // },
    getWaitPay (cb) {
      this.$sdk.order.count({ payment_status: 0, status: 0 }, data => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            this.nWaitPay = data.res.count || 0
          } else {
            this.nWaitPay = 0
            err = data.res.message || '待付款订单数量获取出错'
          }
        } else {
          err = '待付款订单数量请求异常'
        }
        cb && cb(err)
      })
    },
    getWaitSend (cb) {
      this.$sdk.order.count({ shipment_status: 1 }, data => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            this.nWaitGet = data.res.count || 0
          } else {
            this.nWaitGet = 0
            err = data.res.message || '待发货订单数量获取出错'
          }
        } else {
          err = '待发货订单数量请求异常'
        }
        cb && cb(err)
      })
    }
  }
}
</script>

<style scoped>
  .yk-account {
    overflow: hidden;  /* 防止 Margin 溢出 */
    background-color: #eeeff0;
    min-height: stretch;
  }
  .yk-account-icon.yk-icon {
    color: #999;
  }
  .yk-account-main_view {
    padding: 0 0 calc(15px + var(--tabBar) + var(--homeIndicator));
  }
  .yk-account-signout {
    margin: 0;
  }
  .yk-account-signout_btn {
    display: block;
    width: 100%;
    line-height: 41px;
    color: inherit;
    transition: background-color .6s ease-out;
  }
  .yk-account-signout_btn:active {
    color: inherit;
    transition: none;
    background-color: #e6e6e6;
  }
</style>
