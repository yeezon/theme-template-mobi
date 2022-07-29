<docs>
## YkAccountOrders Docs

* 搜索功能 API 暂时只能依据订单号，后面再加上
* 注意「再次购买」中，最后添加的商品如果不成功的情况

### To-do List

* 优化显示，orders 放父级组件里，在父级点击进入的时候加载 orders 数据
* 父级提供 getOrders Event，刷新当前页的时候也正常显示
* 增加搜索功能
* Loading 提示放到组件内，不调用全局，体验好，也避免快速后退导致提示未关闭
* 优化「再次购买」的添加顺序，现在的颠倒了

</docs>

<template>
  <div class="yk-orders" data-com="YkAccountOrders">
    <yu-header>
      <YuNavBar title="我的订单" />
    </yu-header>
    <div class="yk-orders-tabs yu-cells" @touchmove.prevent.stop>
      <span><button class="yk-orders-tab" :class="{ 'i-active': nShowType === 0 }" @click="fnTab(0)">全部</button></span>
      <span><button class="yk-orders-tab" :class="{ 'i-active': nShowType === 1 }" @click="fnTab(1)">待付款</button></span>
      <span><button class="yk-orders-tab" :class="{ 'i-active': nShowType === 2 }" @click="fnTab(2)">待收货</button></span>
      <span><button class="yk-orders-tab" :class="{ 'i-active': nShowType === 3 }" @click="fnTab(3)">已完成</button></span>
    </div>
    <YuScrollView class="yk-orders-scroll_view" @lower="fnLower">
      <div class="yk-orders-cells">
        <div class="yk-orders-cell yu-cells" v-for="oOrder in orders" :key="oOrder.id">
          <div class="yk-orders-cell_bar"><span>{{ oOrder.created_at | date }}</span><span class="yk-orders-cell_bar_status">{{oOrder.status_desc}}</span></div>
          <div class="yk-orders-pack" v-for="(oShipment, index) in oOrder.shipments" :key="oShipment.id">
            <YuCell class="yk-orders-pack_link" :placeholder="`共 ${ oShipment.line_items.length } 件商品`" @click="goOrder(oOrder.order_no)" :is-link="true">
              <div class="yk-orders-pack_imgs" slot="label"><span v-for="oPro in oShipment.line_items" :key="oPro.id" :style="{backgroundImage: `url(${ getImg(oPro.feature_image) })`}" /></div>
            </YuCell>
            <div class="yk-orders-pack_desc" v-if="oOrder.shipments.length > 1"><span>包裹 {{ index + 1 }}</span><span class="yk-orders-pack_desc_status">{{ oShipment.status_desc }}</span></div>
          </div>
          <div class="yk-orders-footer">
            <div class="yk-orders-count"><span>总额：</span><YuCurrency class="yk-orders-count_sum" :val="oOrder.total_amount" /></div>
            <div class="yk-orders-btns">
              <YuButton v-if="oOrder.status === 0 && oOrder.shipment_status === 0" class="yk-orders-btn" size="small" @click="fnCancel(oOrder.order_no)">取消订单</YuButton>
              <YuButton v-if="oOrder.status !== 0 || oOrder.shipment_status !== 0" class="yk-orders-btn" size="small" @click="fnBuy(oOrder)">再次购买</YuButton>
              <YuButton class="yk-orders-btn" size="small" @click="goOrder(oOrder.order_no)">订单详情</YuButton>
              <YuButton v-if="oOrder.status === 0 && oOrder.payment_status === 0" type="danger" size="small" @click="goOrder(oOrder.order_no)">立即支付</YuButton>
            </div>
          </div>
        </div>
        <YuLoadTips v-if="!orders.length" :is-empty="!isLoading && !err && !orders.length" :is-error="!isLoading && !!err" empty-text="暂无相关订单" empty-icon="yk-icon-order_empty" @retry="upOrders" />
      </div>
    </YuScrollView>
  </div>
</template>

<script>
const imgURL = function (img, size = 'w300h300') {
  // Base64 SVG 像素比例占位图
  if (typeof img === 'object') {
    return window.yhsd.sdk.util.getImageUrl(img.image_id, img.image_name, size, img.image_epoch)
  } else {
    return window.yhsd.sdk.util.getImageUrl(img, 's.png', size)
  }
}

export default {
  componentName: 'YkAccountOrders',
  data () {
    return {
      err: '',
      isLoading: false,
      orders: [],
      nShowType: 0,
      cancelingReason: '其他',
      oStatus: {
        status: null,
        payment_status: null,
        shipment_status: null
      },
      oPaging: {
        items: 0,
        pages: 1,
        size: 6,
        view: 1
      }
    }
  },
  watch: {
    orders () {
      this.isLoading = false
      this.$toast.off()
    }
  },
  created () {
    this.hashInit()
  },
  methods: {
    hashInit () {
      const _hash = this.$route.hash
      if (_hash === '#wait_pay') {
        this.fnTab(1)
      } else if (_hash === '#wait_get') {
        this.fnTab(2)
      } else if (_hash === '#completed') {
        this.fnTab(3)
      } else {
        this.fnTab(0)
      }
    },
    goOrder (orderNo) {
      this.$router.push('/account/orders/' + orderNo)
    },
    getOrders (isAdd = false, cb) {
      const _oConfig = {}
      const _oStatus = this.oStatus
      const _oPaging = this.oPaging
      for (const key in _oStatus) {
        const _val = _oStatus[key]
        if (_val || _val === 0) {
          _oConfig[key] = _val
        }
      }
      _oConfig.size = _oPaging.size || 6
      _oConfig.page = _oPaging.view || 1
      this.$sdk.order.get(_oConfig, data => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            if (isAdd) {
              this.orders = this.orders.concat(data.res.orders || [])
            } else {
              this.orders = data.res.orders || []
            }
            this.oPaging = data.res.paging
          } else {
            err = data.res.message || '订单数据获取出错'
          }
        } else {
          err = '订单数据请求异常'
        }
        cb && cb(err)
      })
    },
    upOrders (isAdd = false) {
      this.isLoading = true
      this.$toast.loading('加载中...')
      this.getOrders(isAdd, err => {
        if (err) {
          this.$toast.info(err)
        }
      })
    },
    getImg (oImg) {
      let url = ''
      if (oImg.image_id) {
        url = imgURL(oImg.image_id, '180x180')
      }
      return url
    },
    fnNextPage () {
      if (!this.isLoading && (this.oPaging.view < this.oPaging.pages)) {
        this.oPaging.view += 1
        this.upOrders(true)
      }
    },
    fnTab (type) {
      this.nShowType = type
      const _oStatus = this.oStatus
      _oStatus.page = 1
      if (type === 1) {
        _oStatus.status = 0
        _oStatus.payment_status = 0
        _oStatus.shipment_status = null
        this.$router.replace('#wait_pay')
      } else if (type === 2) {
        _oStatus.status = 0
        _oStatus.payment_status = 2
        _oStatus.shipment_status = null
        this.$router.replace('#wait_get')
      } else if (type === 3) {
        _oStatus.status = 4
        _oStatus.payment_status = null
        _oStatus.shipment_status = null
        this.$router.replace('#completed')
      } else {
        this.nShowType = 0
        _oStatus.status = null
        _oStatus.payment_status = null
        _oStatus.shipment_status = null
        this.$router.replace('')
      }
      this.initPaging()
      this.upOrders()
    },
    initPaging () {
      this.oPaging.items = 0
      this.oPaging.pages = 1
      this.oPaging.size = 6
      this.oPaging.view = 1
    },
    fnCancel (no) {
      this.$confirm({
        title: '取消订单',
        msg: '确定要取消此订单吗？'
      }).then(() => {
        this.$sdk.order.cancel({
          order_no: no,
          reason: this.cancelingReason
        }, data => {
          let err = null
          if (data && data.res) {
            if (data.res.code === 200) {
              this.upOrders()
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
    fnLower () {
      if (!this.isLoading) {
        this.fnNextPage()
      }
    }
  }
}
</script>

<style scoped>
  .yk-orders {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    background-color: #eeeff0;
    height: var(--100vh);
    overflow: hidden;
  }
  .yk-orders-tabs {
    display: flex;
    margin: 0;
    border-top-width: 0;
  }
  .yk-orders-tabs > span {
    display: block;
    flex: 1;
    text-align: center;
  }
  .yk-orders-tab {
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
  .yk-orders-tab.i-active {
    color: #4685ee;
  }
  .yk-orders-tab.i-active::after {
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
  .yk-orders-scroll_view {
    flex: 1;
  }
  .yk-orders-cells {
    padding: 15px 0 0;
  }
  .yk-orders-cell {
    padding: 0;
  }
  .yk-orders-cell .yu-cell-hr {
    display: none;
  }
  .yk-orders-cell_bar {
    padding: 13px 15px;
    overflow: hidden;
    line-height: 1;
  }
  .yk-orders-cell_bar_status {
    float: right;
    font-weight: bold;
  }
  .yk-orders-pack {
    border: 0 solid #d5d5d5;
    border-width: var(--1px) 0 0;
  }
  .yk-orders-pack_link .yu-cell-cont.i-placeholder {
    margin: auto 0;
    font-size: 13px;
    flex: none;
    width: max-content;
  }
  .yk-orders-pack_link .yu-cell-arrow.yu-icon {
    margin: auto 0;
  }
  .yk-orders-pack_imgs {
    flex: 1;
    font-size: 0;
    line-height: 0;
    text-align: left;
  }
  .yk-orders-pack_imgs > span {
    display: inline-block;
    margin: 4px 8px 4px 0;
    width: 60px;
    height: 60px;
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
  }
  .yk-orders-pack_desc {
    padding: 10px 15px;
    border: 0 solid #d5d5d5;
    border-width: var(--1px) 0 0;
    text-align: right;
    font-size: 12px;
    color: #777;
    line-height: 20px;
  }
  .yk-orders-pack_desc > span {
    vertical-align: baseline;
  }
  .yk-orders-pack_desc_status {
    display: inline-block;
    margin: 0 0 0 10px;
    font-size: 13px;
    font-weight: bold;
  }
  .yk-orders-footer {
    padding: 10px 15px;
    border: 0 solid #d5d5d5;
    border-width: var(--1px) 0 0;
  }
  .yk-orders-count {
    text-align: right;
    line-height: 1;
    font-size: 12px;
  }
  .yk-orders-count > span {
    vertical-align: baseline;
  }
  .yk-orders-count_sum {
    font-weight: bold;
    font-size: 14px;
  }
  .yk-orders-btns {
    margin: 10px 0 0;
    text-align: right;
    font-size: 0;
    line-height: 0;
  }
  .yk-orders-btn {
    color: #777;
    border-color: currentColor;
  }
  .yk-orders-btns .yu-btn-cont {
    font-size: 13px;
  }
</style>
