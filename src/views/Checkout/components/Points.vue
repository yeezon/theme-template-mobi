<docs>
## YkCheckoutPoints Docs
</docs>

<template>
  <div class="yk-checkout_points" data-com="YkCheckoutPoints" v-if="disabled">
    <YuCell :key="0" v-if="nCanUse" @click="fnOpen" :val="nUse" placeholder="使用积分" :is-link="true">
      <span slot="label">积分<span class="yk-checkout_points-label_desc">（<span v-if="nUse">已使用 {{ nUse }}，共可用 {{ nCanUse }}</span><span v-else>此单可用 {{ nCanUse }} 积分抵现<YuCurrency :val="fnCalc(nCanUse)" /></span>）</span></span>
      <span v-if="nUse">抵现<YuCurrency :val="fnCalc(nUse)" /></span>
    </YuCell>
    <YuCell :key="1" v-else placeholder="此单无可用积分">
      <span slot="label">积分<span class="yk-checkout_points-label_desc">（剩余积分: {{ nTotal }}）</span></span>
    </YuCell>
    <YuPopup v-model="isOpen">
      <div class="yk-checkout_points-popup">
        <YuNavBar title="使用积分" :has-back="false">
          <YuButton class="yk-checkout_points-close_btn" slot="right" type="text" @click="fnDisuse">不使用</YuButton>
        </YuNavBar>
        <div class="yk-checkout_points-box">
          <div class="yk-checkout_points-set">
            <input v-model="nowVal" class="yk-checkout_points-ipt" type="number" placeholder="输入积分数">
            <span class="yk-checkout_points-swap" v-if="parseInt(nowVal)">抵现<YuCurrency :val="fnCalc(nowVal)" /></span>
            <YuButton class="yk-checkout_points-btn" :disabled="!parseInt(nowVal)" @click="fnSend" type="primary" size="small">确定</YuButton>
          </div>
          <div class="yk-checkout_points-tips">此单可用积分不大于 {{ nCanUse }}<span v-if="nCanUse">（抵现<YuCurrency :val="fnCalc(nCanUse)" />）</span><br>剩余积分: {{ nTotal }}</div>
        </div>
      </div>
    </YuPopup>
  </div>
</template>

<script>
export default {
  componentName: 'YkCheckoutPoints',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    sum: {
      type: Object,
      default () {
        return {
          oRes: {}
        }
      }
    }
  },
  data: function () {
    return {
      isOpen: false,
      nowVal: this.sum.oRes.reward_point_use || ''
    }
  },
  computed: {
    nCanUse () {
      return this.sum.oRes.reward_point_max || 0
    },
    nTotal () {
      return this.sum.oRes.reward_point_total || 0
    },
    nUse () {
      return this.sum.oRes.reward_point_use || 0
    }
  },
  watch: {
    nCanUse (val, oldVal) {
      if (val !== oldVal && oldVal !== 0) {
        this.$toast.info('可用积分已调整，请注意', 3000)
      }
    }
  },
  methods: {
    fnOpen () {
      this.nowVal = this.sum.oRes.reward_point_use || ''
      this.isOpen = true
    },
    fnClose () {
      this.nowVal = ''
      this.isOpen = false
    },
    fnDisuse () {
      this.nowVal = ''
      this.fnChange(null)
    },
    fnChange (nVal) {
      this.$emit('change', nVal)
      this.fnClose()
    },
    fnCalc (nPoints) {
      nPoints = parseInt(nPoints)
      return (this.sum.oRes.reward_point_exchange_ratio * nPoints) || 0
    },
    fnSend () {
      const nVal = parseInt(this.nowVal) || 0
      if (!nVal) {
        this.fnDisuse()
      } else if (nVal <= this.nCanUse) {
        this.fnChange(nVal)
      } else {
        this.$toast.info('超出此单可用积分')
      }
    }
  }
}
</script>

<style scoped>
  .yk-checkout_points {
    vertical-align: middle;
    background-color: #fff;
  }
  .yk-checkout_points-popup {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 50vh;
  }
  .yk-checkout_points-close_btn {
    display: block;
    padding: 0 15px;
  }
  .yk-checkout_points-label_desc {
    font-size: 12px;
    color: #999;
  }
  .yk-checkout_points-box {
    flex: 1;
    overflow: hidden;
  }
  .yk-checkout_points-set {
    display: flex;
    margin: 15px 15px 10px;
    padding: 8px 13px 8px 14px;
    border: 0 solid var(--borderColor);
    border-width: var(--1px);
    border-radius: 4px;
  }
  .yk-checkout_points-ipt {
    flex: 2;
    -webkit-tap-highlight-color: transparent;
    outline: none;
    margin: 0 10px 0 0;
    padding: 0;
    border: none;
  }
  .yk-checkout_points-swap {
    flex: 1;
    display: inline-block;
    margin: auto;
    padding: 0 10px 0 0;
    font-size: 12px;
    color: #999;
    overflow: hidden;
    text-align: right;
  }
  .yk-checkout_points-btn {
    padding-left: 1em;
    padding-right: 1em;
  }
  .yk-checkout_points-tips {
    margin: 0 15px;
    font-size: 12px;
    line-height: 1.6;
    color: #999;
  }
</style>
