<docs>
## YkAccountPoints Docs

* API 没有类型区分，只能先一次请求全部数据做分类

### To-do List

* 优化显示，oPoints 放父级组件里，在父级点击进入的时候加载 oPoints 数据
* 父级提供 getPoints Event，刷新当前页的时候也正常显示
* 数据获取错误提示处理

</docs>

<template>
  <div class="yk-account_points" data-com="YkAccountPoints">
    <YuHeader :is-fixed="true">
      <YuNavBar title="积分" />
    </YuHeader>
    <div class="yk-account_points-top">
      <YuButton class="yk-account_points-top_btn" type="text" @click="fnNotice">
        <YuIcon class="yk-account_points-top_icon" name="yk-icon-tips" slot="icon" />
        <span>积分说明</span>
      </YuButton>
    </div>
    <div class="yk-account_points-info">
      <div class="yk-account_points-title">可用积分</div>
      <div class="yk-account_points-point">{{ oPoints.reward_point_total || 0 }}</div>
      <div class="yk-account_points-valid"><span>{{ (new Date).getFullYear() }}-12-31 将过期 </span><span class="yk-account_points-valid_point">{{ oPoints.last_year_point || 0 }}</span><span> 积分</span></div>
    </div>
    <div class="yk-account_points-tabs yu-cells">
      <span><button class="yk-account_points-tab" :class="{ 'i-active': nShowType === 0 }" @click="fnTab(0)">积分明细</button></span>
      <span><button class="yk-account_points-tab" :class="{ 'i-active': nShowType === 1 }" @click="fnTab(1)">收入</button></span>
      <span><button class="yk-account_points-tab" :class="{ 'i-active': nShowType === 2 }" @click="fnTab(2)">支付</button></span>
    </div>
    <div class="yk-account_points-details yu-cells">
      <template v-for="oDetail in details">
        <div :key="oDetail.id" class="yk-account_points-detail" v-show="isShow(oDetail.point)">
          <div class="yk-account_points-detail_info">
            <div>{{ oDetail.reward_point_desc || '无说明' }}</div>
            <div class="yk-account_points-detail_time">{{ oDetail.created_at | date }}</div>
          </div>
          <div class="yk-account_points-detail_point" :class="{ 'i-out': oDetail.point < 0 }"><span>{{ Math.abs(oDetail.point || 0) }}</span></div>
        </div>
      </template>
      <YuLoadTips v-if="!hasShow && !isLoading" class="yk-account_points-empty" :is-empty="true" empty-text="暂无相关积分明细" empty-icon="yk-icon-points" />
    </div>
    <YuPopup v-model="isNotice" :mask="false">
      <div class="yk-account_points-notice">
        <yu-header :is-fixed="true">
          <YuNavBar title="积分说明" class="yk-account_points-notice_bar">
            <YuButton class="yk-account_points-notice_btn" slot="left" type="text" @click="fnNotice">
              <YuIcon class="yk-account_points-notice_icon" name="yu-icon-close" slot="icon" />
            </YuButton>
          </YuNavBar>
        </yu-header>
        <div class="yk-account_points-notice_cont">
          <p>1. 积分赠送会在订单完成后自动到账， 取消订单则无法获得相应积分；</p>
          <p>2. 有效积分可直接用于支付网站订单。积分可抵现金额具体以订单显示为准；</p>
          <p>3. 积分可以累积，有效期最长 2 年，最短 1 年，即从获得积分开始至次年年底，逾期自动作废。例如：2015-12-31 将清空 2014 年度获得但未使用的积分。</p>
        </div>
      </div>
    </YuPopup>
  </div>
</template>

<script>
export default {
  componentName: 'YkAccountPoints',
  data () {
    return {
      isLoading: false,
      oPoints: {},
      nShowType: 0,
      hasShow: false,
      isNotice: false
    }
  },
  computed: {
    details () {
      return this.oPoints.reward_point_details || []
    }
  },
  watch: {
    oPoints () {
      this.isLoading = false
      this.hasShow = false
    }
  },
  created () {
    this.isLoading = true
    this.getPoints(err => {
      if (err) {
        this.$toast.info(err)
      }
    })
  },
  methods: {
    getPoints (cb) {
      this.$sdk.account.rewardPointDetails({ nopage: 'Y' }, data => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            this.oPoints = data.res || {}
          } else {
            err = data.res.message || '用户积分数据获取出错'
          }
        } else {
          err = '用户积分数据请求异常'
        }
        cb && cb(err)
      })
    },
    fnNotice () {
      this.isNotice = !this.isNotice
    },
    fnTab (type) {
      this.hasShow = false
      this.nShowType = type
    },
    isShow (point) {
      let _res = false
      if (this.nShowType === 1) {
        _res = point >= 0
      } else if (this.nShowType === 2) {
        _res = point < 0
      } else {
        _res = true
      }
      if (_res) {
        this.hasShow = true
      }
      return _res
    }
  }
}
</script>

<style scoped>
  .yk-account_points {
    margin: 0;
    padding: 0;
  }
  .yk-account_points-top {
    padding: 15px;
    text-align: right;
    line-height: 1;
    background-color: #fff;
  }
  .yk-account_points-top_btn {
    padding: 0;
  }
  .yk-account_points-top_btn > span {
    font-size: 12px;
  }
  .yk-account_points-top_icon {
    margin: 0 1px 0 0;
    width: 19px;
    height: 19px;
    color: inherit;
    vertical-align: middle;
  }
  .yk-account_points-info {
    padding: 0 0 20px;
    text-align: center;
    line-height: 1;
    background-color: #fff;
  }
  .yk-account_points-title {
    font-weight: bold;
  }
  .yk-account_points-point {
    margin: 12px 0 11px;
    font-size: 30px;
    font-weight: bold;
  }
  .yk-account_points-valid {
    color: #777;
    font-size: 12px;
  }
  .yk-account_points-valid > span {
    vertical-align: bottom;
  }
  .yk-account_points-valid_point {
    font-size: 14px;
    font-weight: bold;
  }
  .yk-account_points-tabs {
    display: flex;
  }
  .yk-account_points-tabs > span {
    display: block;
    flex: 1;
    text-align: center;
  }
  .yk-account_points-tab {
    position: relative;
    margin: 0;
    padding: 0;
    min-width: 4em;
    outline: none;
    line-height: 38px;
    background-color: transparent;
    border: none;
    font-size: 14px;
  }
  .yk-account_points-tab.i-active {
    color: #4685ee;
  }
  .yk-account_points-tab.i-active::after {
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
  .yk-account_points-details {
    padding: 0 15px;
    background-color: #fff;
  }
  .yk-account_points-detail {
    display: flex;
    margin: -0.5px 0 0;
    padding: 15px 0;
    border: 0 solid #d5d5d5;
    border-width: var(--1px) 0 0;
    line-height: 1;
  }
  .yk-account_points-detail_info {
    flex: 1;
  }
  .yk-account_points-detail_time {
    margin: 8px 0 0;
    font-size: 12px;
    color: #777;
  }
  .yk-account_points-detail_point {
    margin: auto;
    text-align: right;
    color: #1bb974;
    line-height: 1;
    font-size: 16px;
  }
  .yk-account_points-detail_point span {
    vertical-align: middle;
  }
  .yk-account_points-detail_point::before {
    display: inline-block;
    margin: 0 5px 2px 0;
    content: "+";
    vertical-align: middle;
  }
  .yk-account_points-detail_point.i-out {
    color: #ff7b0e;
  }
  .yk-account_points-detail_point.i-out::before {
    content: "-";
  }
  .yk-account_points-empty {
    margin: 15px 0;
    padding: 60px 0 70px;
    text-align: center;
    color: #999;
  }
  .yk-account_points-notice {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: var(--100vh);
    background-color: #fff;
  }
  .yk-account_points-notice_btn {
    display: block;
    font-size: 0;
    line-height: 1;
    color: #999;
  }
  .yk-account_points-notice_btn:active {
    color: #bbb;
  }
  .yk-account_points-notice_icon {
    padding: 0 20px;
    font-size: 12px;
  }
  .yk-account_points-notice_cont {
    flex: 1;
    box-sizing: border-box;
    padding: 10px 20px;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    line-height: 1.7;
    color: #777;
  }
</style>
