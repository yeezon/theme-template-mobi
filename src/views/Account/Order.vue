<docs>
## YkAccountOrder Docs

* 注意「再次购买」中，最后添加的商品如果不成功的情况

## To-do List

* 加载中放到容器内，不用 Toast
* 「确认收货」逻辑，多包裹
* `<YkCheckoutSums>`用`:coupon="oCoupon"`
* 退单理由
* 优化「再次购买」的添加顺序，现在的颠倒了

</docs>

<template>
  <div class="yk-order" data-com="YkAccountOrder">
    <YuHeader :is-fixed="true">
      <YuNavBar title="订单详情" :has-home="true" />
    </YuHeader>
    <div class="yk-order-no">订单号：{{ oOrder.order_no }}</div>
    <div class="yk-order-status">
      <div class="yk-order-status_info">
        <div>订单状态：{{ oOrder.status_desc }}</div>
        <div><span>应付金额：</span><YuCurrency :val="oOrder.auto_total_amount" /></div>
      </div>
      <!-- <div class="yk-order-status_icon">
        <YkIcon name="address" :xname="'xxx_' + oOrder.status" slot="icon" />
      </div> -->
    </div>
    <div class="yk-order-address">
      <YkIcon class="yk-order-address_icon" name="address" />
      <div class="yk-order-address-info">
        <div class="yk-order-address-top">
          <span class="yk-order-address-name">{{ oAddress.name }}</span>
          <span class="yk-order-address-phone">{{ oAddress.mobile || oAddress.telephone }}</span>
        </div>
        <div class="yk-order-address-address"><span v-for="oArea in oAddress.areas" :key="oArea.post">{{ oArea.name }} </span><span>{{ oAddress.detail }}</span></div>
      </div>
    </div>
    <div class="yk-order_ship">
      <div class="yk-order_ship-item" v-for="(oShip, index) in shipments" :key="oShip.id">
        <YkCheckoutShipmentPro :carts="oShip.line_items" />
        <YuCell label="配送方式">
          <span><span>{{ oShip.ship_type_desc }}</span><span> - </span><span v-if="!oShip.amount">免邮费</span><YuCurrency v-else :val="oShip.amount" /></span>
        </YuCell>
        <YuCell :label="`包裹 ${index + 1}`" @click="fnToTracker(oShip)" :is-link="!!oShip.ship_no">
          <span v-if="oShip.ship_no" class="yk-order_ship-pack_label">{{ oShip.supplier }}</span>
          <span class="yk-order_ship-pack_status">{{ oShip.status_desc }}</span>
        </YuCell>
      </div>
    </div>
    <div class="yu-cells">
      <YuCell label="支付方式" :val="oOrder.payment_method_type_desc"/>
    </div>
    <div class="yu-cells">
      <YuCell label="留言" :val="oOrder.customer_remarks || '无'"/>
    </div>
    <div class="yu-cells">
      <YuCell label="优惠券" :val="oCoupon.coupon_code || '无'"/>
    </div>
    <YkCheckoutSums class="yu-cells" :records="oOrder.discount_records" :data="oSum" />
    <div v-if="oOrder.id" class="yk-order-fixed">
      <div class="yk-order-footer">
        <div class="yk-order-footer_desc">
          <template v-if="oOrder.status === 0">
            <div class="yk-order-footer_desc_time_box" v-if="(oOrder.payment_status === 0) && timeoutAt">
              <span>付款剩余时间</span><br><span class="yk-order-footer_desc_time">{{ timeoutAt | timer }}</span>
            </div>
            <div v-else>发货之后将不能取消订单</div>
          </template>
        </div>
        <div class="yk-order-btns">
          <YuButton v-if="oOrder.status === 0 && oOrder.shipment_status === 0" class="yk-order-btn" @click="fnCancel(null)" type="text">取消订单</YuButton>
          <YuButton v-if="oOrder.status === 0 && oOrder.payment_status === 0" class="yk-order-btn_pay" @click="fnPay(null)" type="danger">立即支付</YuButton>
          <YuButton v-if="oOrder.status !== 0 || oOrder.shipment_status !== 0" class="yk-order-btn" @click="fnBuy(oOrder)">再次购买</YuButton>
        </div>
      </div>
      <YuHomeIndicator />
    </div>
    <YkPayPopup v-if="oOrder.payment_method_type === 0" :is-pay="isPay" :is-signin="true" :order-no="orderNo" :pay-methods="oPayMethods" :sum="oSum.fix_amount" @close="fnPay" />
  </div>
</template>

<script>
import YkPayPopup from '@/components/Pay/Popup'
import YkCheckoutShipmentPro from '@/views/Checkout/components/ShipmentPro'
import YkCheckoutSums from '@/views/Checkout/components/Sums'
import YkIcon from '@/components/Icon'

export default {
  componentName: 'YkAccountOrder',
  components: {
    YkIcon,
    YkPayPopup,
    YkCheckoutShipmentPro,
    YkCheckoutSums
  },
  data () {
    return {
      orderNo: '',
      oOrder: {},
      oCoupon: {},
      oSum: {
        // Calc: this.$sdk.util.orderCalculator(),  // 需要隐藏，YkCheckoutSums 用作判断订单详情还是下单页
        oRes: {
          item_amount: null, // 商品总金额
          shipment_amount: null, // 运费总金额
          final_amount: null // 实付金额，null 做可否提交状态判断
        },
        fix_amount: null, // 修改后实付金额
        others: { // key 排序相对稳定，内容可以无需 index
          // [key]: {
          //   name: '礼盒',
          //   amount: null  // null 为不显示此项
          // }
        }
      },
      isPay: false,
      oPayMethods: {},
      cancelingReason: '其他',
      timeoutAt: null,
      runTimeST: null, // setTimeout() 返回的实例
      fnMarkVisibilityChange: null
    }
  },
  computed: {
    oAddress () {
      return this.oOrder.address || {}
    },
    shipments () {
      return this.oOrder.shipments || []
    }
  },
  watch: {
    oOrder () {
      this.fnRecordsInit()
      this.fnCalc()
      this.fnInitRunTime()
    }
  },
  created () {
    this.init()
    this.fnBindHandler()
  },
  beforeDestroy () {
    this.fnUnbindHandler()
  },
  methods: {
    init () {
      this.orderNo = this.$route.params.no

      this.isLoading = true
      this.$toast.loading('加载中...')
      this.getOrder(err => {
        this.isLoading = false
        this.$toast.off()
        if (err) {
          this.$toast.info(err)
        } else {
          this.getPayMethods()
        }
      })
    },
    fnToTracker (oShip) {
      if (!(oShip || {}).ship_no) return

      const _oData = {
        ship_no: oShip.ship_no,
        supplier: oShip.supplier,
        tracker_url: oShip.tracker_url
      }

      this.$router.push({
        path: `${this.$route.path}/tracker`,
        query: {
          shipment: JSON.stringify(_oData)
        }
      })
    },
    fnInitRunTime () {
      // 注意考虑支付状态没改变，oOrder 被刷新的情况，fnRunTime 可能已经在运行
      window.clearTimeout(this.runTimeST)
      this.runTimeST = null
      this.timeoutAt = null
      this.fnRunTime()
    },
    getOrder (cb) {
      this.$sdk.order.get(this.orderNo, data => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            this.oOrder = data.res.order || {}
          } else {
            err = data.res.message || '订单数据获取出错'
          }
        } else {
          err = '订单数据请求异常'
        }
        cb && cb(err)
      })
    },
    upOrder () {
      this.getOrder(err => {
        if (err) {
          this.$toast.info(err)
        }
      })
    },
    getPayMethods (cb) {
      this.$sdk.payment_method.get({}, data => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            this.oPayMethods = data.res.payment_method.online.methods || {}
          } else {
            err = data.res.message || '支付方式数据获取出错'
          }
        } else {
          err = '支付方式数据请求异常'
        }
        cb && cb(err)
      })
    },
    fnRecordsInit () {
      const _records = this.oOrder.preferential_records
      if (_records && _records.length) {
        for (const oRecord of _records) {
          if (oRecord.type === 'coupon') {
            this.oCoupon = Object.assign({}, oRecord)
          }
        }
      }
    },
    fnCalc () {
      const _oOrder = this.oOrder
      const _oSum = this.oSum
      _oSum.oRes.item_amount = _oOrder.item_amount // 商品总金额
      _oSum.oRes.shipment_amount = _oOrder.shipment_amount // 运费总金额
      _oSum.oRes.final_amount = _oOrder.auto_total_amount // 实付金额
      _oSum.fix_amount = _oOrder.total_amount // 修改后实付金额（订单详情页用）
    },
    fnCancel () {
      this.$confirm({
        title: '取消订单',
        msg: '确定要取消此订单吗？'
      }).then(() => {
        this.$sdk.order.cancel({
          order_no: this.orderNo,
          reason: this.cancelingReason
        }, data => {
          let err = null
          if (data && data.res) {
            if (data.res.code === 200) {
              this.$toast.info('成功取消订单')
              this.upOrder()
            } else {
              err = data.res.message || '取消订单失败'
            }
          } else {
            err = '取消订单请求异常'
          }
          if (err) this.$toast.info(err)
        })
      }).catch(() => {
        // console.log('close')
      })
    },
    fnPay () {
      this.isPay = !this.isPay
    },
    fnRunTime () {
      // 注意考虑支付状态没改变，oOrder 被刷新的情况，fnRunTime 可能已经在运行
      if (this.runTimeST) {
        if (this.timeoutAt) {
          this.timeoutAt -= 1000
        } else {
          window.clearTimeout(this.runTimeST)
          this.runTimeST = null
        }
      } else {
        const _oOrder = this.oOrder
        if (_oOrder.status === 0 && _oOrder.payment_status === 0 && !(this.timeoutAt || this.timeoutAt === 0)) {
          this.timeoutAt = Date.parse(_oOrder.timeout_at) - Date.parse(new Date())
          this.runTimeST = true
        }
      }
      if (this.runTimeST) {
        this.runTimeST = setTimeout(() => {
          this.fnRunTime()
        }, 1000)
      }
    },
    fnBuy (oOrder) {
      const items = []
      for (const oShip of oOrder.shipments) {
        for (const item of oShip.line_items) {
          items.push({
            variant_id: item.variant_id,
            quantity: item.quantity
          })
        }
      }
      const _length = items.length
      let nErr = 0
      const _fn = (item, index) => {
        this.$sdk.cart.add({
          variant_id: item.variant_id,
          quantity: item.quantity,
          is_check: true
        }, data => {
          let err = null
          if (data && data.res) {
            if (data.res.code === 200) {
              // this.upOrders()
              this.$store.dispatch('cart/getCartCount', { isUpdate: true })
            } else {
              err = data.res.message || '处理失败'
            }
          } else {
            err = '处理请求异常'
          }
          if (err) nErr += 1
          const nNext = index + 1
          if (nNext < _length) {
            _fn(items[nNext], nNext)
          } else {
            if (nErr) {
              this.$toast.info(err)
            }
            this.$router.push('/cart')
          }
        })
      }
      if (_length > 0) {
        _fn(items[0], 0)
      }
    },
    fnVisibilityChange (evt) {
      if (window.document.visibilityState === 'visible') {
        this.init()
      }
    },
    fnBindHandler () {
      // 先取消掉旧的
      window.document.removeEventListener('visibilitychange', this.fnMarkVisibilityChange, false)

      this.fnMarkVisibilityChange = (evt) => {
        this.fnVisibilityChange(evt)
      }

      window.document.addEventListener('visibilitychange', this.fnMarkVisibilityChange, false)
    },
    fnUnbindHandler () {
      window.document.removeEventListener('visibilitychange', this.fnMarkVisibilityChange, false)
    }
  }
}
</script>

<style scoped>
  .yk-order {
    padding: 0 0 120px;
    min-height: calc(100vh - 120px);
    overflow: hidden;  /* 防止 Margin 溢出 */
    background-color: #eeeff0;
  }
  .yk-order .yu-cell .yu-cell-label {
    color: #777;
  }
  .yk-order-fixed {
    position: fixed;
    left: 0;
    bottom: 0;
    width: stretch;
    background-color: #fff;
  }
  .yk-order-footer {
    display: flex;
    padding: 10px 15px;
    border: 0 solid #d5d5d5;
    border-width: var(--1px) 0 0;
    align-items: center;
  }
  .yk-order-footer_desc {
    flex: 1;
    padding: 0 10px 0 0;
    font-size: 12px;
    color: #777;
    line-height: 1.3em;
  }
  .yk-order-footer_desc_time_box {
    display: inline-block;
    text-align: center;
  }
  .yk-order-footer_desc_time {
    color: #333;
  }
  .yk-order-btns {
    text-align: right;
    font-size: 0;
  }
  .yk-order-btn {
    color: #777;
    border-color: currentColor;
  }
  .yk-order-btn_pay.yu-btn {
    margin-left: 20px;
    padding: 10px 25px;
  }
  .yk-order-btn_pay .yu-btn-cont {
    font-size: 16px;
  }

  .yk-order-no {
    padding: 10px 15px;
    background-color: #fff;
    line-height: 1;
  }

  .yk-order-status {
    display: flex;
    padding: 0 15px;
    min-height: 100px;
    background-color: #bbb;
    color: #fff;
    line-height: 1;
    align-items: center;
  }
  .yk-order-status_info {
    flex: 1;
    font-size: 16px;
    font-weight: bold;
    line-height: 1.5;
  }
  .yk-order-status_icon {
    width: 20px;
    height: 20px;
  }

  .yk-order-address {
    display: flex;
    margin: 0 0 15px;
    padding: 0 15px;
    border: 0 solid #d5d5d5;
    border-width: 0 0 var(--1px);
    background-color: #fff;
    align-items: center;
  }
  .yk-order-address-info {
    flex: 1;
    padding: 12px 0;
    overflow: hidden;
  }
  .yk-order-address_icon {
    padding: 0 10px 0 0;
    width: 23px;
    height: 23px;
  }
  .yk-order-address-top {
    display: flex;
    margin: 0 0 5px;
    line-height: 1;
  }
  .yk-order-address-name,
  .yk-order-address-phone {
    margin: auto 15px auto 0;
    font-size: 16px;
  }
  .yk-order-address-address {
    font-size: 13px;
    line-height: 1.5em;
  }

  .yk-order_ship-item {
    margin: 15px 0;
    background-color: #fff;
    border: 0 solid #d5d5d5;
    border-width: var(--1px) 0;
  }
  .yk-order_ship-pack_label {
    margin: 0 8px 0 0;
    font-size: 12px;
    color: #777;
  }
  .yk-order_ship-pack_status {
    font-size: 13px;
    font-weight: bold;
  }
</style>
