<docs>
## YkOrderShipmentTracker Docs
</docs>

<template>
<div class="yk-order-shipment-tracker" data-com="YkOrderShipmentTracker">
  <YuHeader :is-fixed="true">
    <YuNavBar title="配送信息" :has-home="true" />
  </YuHeader>
  <template v-if="isLoading || err">
    <div class="s-tips">{{ isLoading ? '加载中...' : (err || '加载异常，请重试') }}</div>
  </template>
  <template v-else>
    <div class="s-items">
      <div class="s-item">订单号：{{ orderNo }}</div>
      <div class="s-item">物流公司：{{ oShipment.supplier }}</div>
      <div class="s-item">运单号：{{ oShipment.ship_no }}</div>
    </div>
    <div class="s-logs">
      <template v-for="oTrace of oTracker.gtex_traces">
        <div :key="oTrace.time" class="s-log">
          <div class="s-text">{{ oTrace.content }}</div>
          <div class="s-tiem">{{ oTrace.time }}</div>
        </div>
      </template>
      <div v-if="!((oTracker || {}).gtex_traces || []).length" class="s-logs-tip">暂无物流信息</div>
    </div>
  </template>
</div>
</template>

<script>
export default {
  name: 'YkOrderShipmentTracker',
  data () {
    return {
      err: '',
      isLoading: false,
      orderNo: '',
      oShipment: {},
      oTracker: {}
    }
  },
  created () {
    this.oShipment = JSON.parse(this.$route.query.shipment || {})
    this.orderNo = this.$route.params.no

    this.getItem()
  },
  methods: {
    getItem () {
      const _oShipment = this.oShipment || {}

      if (!_oShipment.tracker_url) return

      this.isLoading = true

      window.fetch(_oShipment.tracker_url, {
        method: 'GET'
        // credentials: 'include' // 无需鉴权
      }).then(oRes => {
        return oRes.text()
      }).then(resText => {
        this.isLoading = false

        this.err = ''
        this.oTracker = JSON.parse(resText || '{}')
      }).catch(oError => {
        this.isLoading = false

        this.err = '获取信息失败，请重试'
        this.oTracker = {}
      })

      // window.$.ajax({
      //   type: 'get',
      //   url: _oShipment.tracker_url,
      //   success: res => {
      //     try {
      //       this.oTracker = JSON.parse(res || {})

      //       this.isLoading = false
      //       this.err = ''
      //     } catch (e) {
      //       this.oTracker = {}
      //       this.isLoading = false
      //       this.err = '获取信息失败，请重试'
      //     }
      //   },
      //   fail: () => {
      //     this.isLoading = false
      //     this.err = '获取信息失败，请重试'
      //   }
      // })
    }
  }
}
</script>

<style scoped>
.s-tips {
  margin: 100px 0;
  text-align: center;
  color: #777;
}
.s-items {
  margin: 15px 0;
  padding: 15px;
  background-color: #fff;
  border: 0 solid #d5d5d5;
  border-width: var(--1px) 0;
}
.s-item {
  user-select: all;
  font-size: 14px;
  line-height: 1.7em;
}
.s-logs {
  margin: 15px 0;
  padding: 15px;
  background-color: #fff;
  border: 0 solid #d5d5d5;
  border-width: var(--1px) 0;
}
.s-log {
  margin: 10px 0 0;
  font-size: 13px;
  line-height: 1.7em;
}
.s-log:first-child {
  margin: 0;
}
.s-tiem {
  color: #777;
}
.s-logs-tip {
  text-align: center;
}
</style>
