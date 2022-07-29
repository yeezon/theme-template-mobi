<docs>
## YkCheckoutView Docs

* 利用 CSS 兄弟选择器 监测`sub_view`是否被渲染
  * `sub_view`被渲染时，隐藏`main_view`

### BUG

* 第一次进入或刷新下单页面，快速下拉时，马上点击原提交订单按钮下方位置（「使用优惠券」靠下）会触发提交订单，FaskClick 初始化定位问题？
  * 已暂时去掉 FaskClick 引入

### 异步加载

* 地址列表 - 取默认地址/第一个地址
  * 购物车数据
* 配送方式
  * 支付方式

### To-do List

* Address 优化
  * Vuex
    * `state.addresses`
    * `state.oDefault`
    * `state.oSelected`
  * 免登录下单
    * 直接弹出新建地址编辑器
      * 修改`state.oSelected`
  * 无地址
    * 直接弹出新建地址编辑器
      * 新增地址
      * 刷新`state.addresses`
        * 自动修改`state.oSelected`
        * 自动修改`state.oDefault`
  * 参考 Planck WebApp
* 无地址时显示商品列表，直接拿购物车数据显示，不用考虑地址关联的数据显示
* 满折未支持 - setCouponSum
* 免登陆下单支持 Metas
* 免登陆下单，在创建定案的时候增加 create_by 的字段（mobile, email）
* sdk.util.orderCalculator() 重写
  * 统一输出项目
  * 考虑自定义项目

</docs>

<template>
<div class="yk-checkout" :class="{'i-loading': isLoading}" data-com="YkCheckoutView">
  <yu-header :is-fixed="true">
    <YuNavBar title="创建订单" />
  </yu-header>
  <div v-if="!isSucceed" class='yk-checkout-main_view' v-show="!isLoading">
    <YkCheckoutAddress :address="oAddressData" />
    <YkCheckoutPayment class="yu-cells" :paymentMethods="oPaymentMethods" :paymentData="oPaymentData" :hasAddress="!!Object.keys(oAddressData).length" @change="fnPayChange" />
    <YkCheckoutShipmentList :shipments="shipments" @change="fnShipmentsChange"/>
    <YkCheckoutRemark class="yu-cells" v-model="remarksData" />
    <div class="yu-cells">
      <YkCheckoutCoupon :coupon='oCouponData' @change="fnCouponChange" />
      <YkCheckoutPoints v-if="isSigned" :sum="oSum" :disabled='oDiscount.reward_point_enabled' @change="fnPointChange" />
      <YkCheckoutInvoice />
    </div>
    <YkCheckoutSums class="yu-cells" :discount='oDiscount' :coupon="oCouponData" :data="oSum" />
    <YkCheckoutBar class="yk-checkout-info" :address="oAddressData" :amount="oSum.fix_amount" :point="nGivePoint" @submit="fnSubmit" />
  </div>
  <YkCheckoutSucceed v-else :order-no="orderNo" :hasPay="hasPay" @pay="fnSucceedPay" />
  <YkPayPopup v-if="oPayOnlineMethods" :is-pay="isPay" :is-signin="isSigned" :order-no="orderNo" :pay-methods="oPayOnlineMethods" :sum="oSum.fix_amount" @close="goOrder" />
</div>
</template>

<script>
import YkCheckoutAddress from './components/Address'
import YkCheckoutPayment from './components/Payment'
import YkCheckoutShipmentList from './components/ShipmentList'
import YkCheckoutRemark from './components/Remark'
import YkCheckoutCoupon from './components/Coupon'
import YkCheckoutPoints from './components/Points'
import YkCheckoutSums from './components/Sums'
import YkCheckoutBar from './components/Bar'
import YkCheckoutSucceed from './components/Succeed'
import YkCheckoutInvoice from './components/Invoice'
import YkPayPopup from '@/components/Pay/Popup'

export default {
  name: 'YkCheckoutView',
  components: {
    YkCheckoutAddress,
    YkCheckoutPayment,
    YkCheckoutShipmentList,
    YkCheckoutRemark,
    YkCheckoutCoupon,
    YkCheckoutPoints,
    YkCheckoutSums,
    YkCheckoutBar,
    YkCheckoutSucceed,
    YkPayPopup,
    YkCheckoutInvoice
  },
  data () {
    return {
      err: '',
      isLoading: true,
      isPay: false,
      isSucceed: false, // 免得登录下单用
      orderNo: '',
      oAccount: {},
      oCart: {},
      addresses: [],
      oAddressData: {}, // 用户选择
      oPaymentMethods: {},
      oPaymentData: {}, // 用户选择
      shipments: [],
      shipmentsData: [], // 用户选择
      oShipmentSkuMap: {},
      remarksData: '', // 用户输入
      oCouponData: {}, // 用户选择
      oDiscount: {},
      oDiscountSkuMap: {},
      nGivePoint: 0, // 可获得积分
      oSum: {
        Calc: this.$sdk.util.orderCalculator(),
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
      oMetas: {}
    }
  },
  computed: {
    isSigned () {
      return !!this.oAccount.id
    },
    oPayOnlineMethods () {
      const _oOnline = this.oPaymentMethods.online || {}
      let res = null
      if (_oOnline.avail) {
        res = {
          bank: _oOnline.methods.bank || [],
          thirdparty: _oOnline.methods.thirdparty || []
        }
      }
      return res
    },
    hasPay () {
      return this.oSum.fix_amount && this.oPaymentData.payment_method_type === 'online'
    },
    hasAddress () {
      return !!Object.keys(this.oAddressData).length
    }
  },
  watch: {
    oAddressData (oVal) {
      let _val = null

      if (JSON.stringify(oVal) !== '{}') {
        if (this.isSigned) {
          _val = oVal.id
        } else {
          _val = oVal.district_code
        }
      }

      this.getPayments(_val, (err, payType) => {
        if (err) {
          this.$toast.info(err)
        }
      })
    },
    oPaymentData (oVal) {
      if (Object.keys(oVal).length) {
        this.getShipments(err => {
          if (err) {
            this.goCart(err + '<br>将自动返回购物车')
          } else {
            this.setGivePoint() // 设置可获得积分
            this.setProSum() // 设置商品总价
          }
        })
      } else {
        this.shipments = []
      }
    },
    oDiscount () {
      if ((this.shipments || []).length) {
        this.initDiscountSkuMap() // 依赖 shipments 数据，有可能这时还没 shipments 数据
      }
    },
    shipments () {
      this.initShipmentSkuMap()
      this.initDiscountSkuMap() // 依赖 shipments 数据，有可能这时还没 shipments 数据
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.isLoading = true

      this.getAccount(err => {
        this.isLoading = false

        if (err) {
          this.goSignin(err)
        } else {
          const oSelectAddress = this.$store.state?.address?.oSelected || {}

          if (Object.keys(oSelectAddress).length) {
            this.oAddressData = oSelectAddress
          } else {
            if (this.isSigned) {
              this.isLoading = true

              this.getAddresses(() => {
                this.isLoading = false

                this.initAddress()

                // 进入界面，无地址先弹出添加地址
                if (!this.hasAddress) {
                  this.$router.push('/account/addresses_select')
                }
              })
            } else {
              if (!this.hasAddress) {
                this.$router.push('/account/addresses_select')
              }
            }
          }

          this.setAccountSum()
        }
      })
      this.getDiscount(err => {
        if (!err) {
          this.setDiscountSum()
        }
      })
      this.getCart(err => {
        if (err) {
          this.goCart(err)
        } else {
          this.fnCheckPro(err => {
            if (err) {
              // 在购物车做修正
              this.goCart(err)
            }
          })
        }
      })
    },
    goTo (path, isUp = false) {
      if (isUp) {
        window.location.href = path
      } else {
        this.$router.push(path)
      }
    },
    goSignin (err) {
      if (err) {
        this.$toast.info(err, null, () => {
          this.goTo('/account/login', true)
        })
      } else {
        this.goTo('/account/login', true)
      }
    },
    goCart (err) {
      if (err) {
        this.$toast.info(err, 3500, () => {
          this.$router.push('/cart')
        })
      } else {
        this.$router.push('/cart')
      }
    },
    goOrder () {
      const url = '/account/orders/' + (this.orderNo || '')
      // 使返回时指向订单列表
      this.$router.replace(url)
      // this.goTo(url, true)
    },
    getAccount (cb) {
      this.$sdk.account.current(data => {
        let err = ''

        if (data && data.res) {
          if (data.res.code === 200) {
            this.oAccount = data.res.customer || {}
          } else {
            err = data.res.message || '用户数据获取出错'
          }
        } else {
          err = '用户数据请求异常'
        }

        cb && cb(err)
      })
    },
    getCart (cb) {
      this.$sdk.cart.get(data => {
        let err = ''

        if (data && data.res) {
          if (data.res.code === 200) {
            this.oCart = data.res.cart || {}
          } else {
            err = data.res.message || '购物车数据获取出错'
          }
        } else {
          err = '购物车数据请求异常'
        }
        cb && cb(err)
      })
    },
    getAddresses (cb) {
      this.$sdk.address.get(data => {
        let err = ''

        if (data && data.res) {
          if (data.res.code === 200) {
            this.addresses = data.res.addresses || []
            if (this.addresses.length <= 0) {
              this.oAddressData = {}
            }
          } else {
            err = data.res.message || '地址数据获取出错'
          }
        } else {
          err = '地址数据请求异常'
        }
        cb && cb(err)
      })
    },
    getPayments (val, cb) {
      const param = {}
      if (val) {
        if (this.isSigned) {
          param.address_id = val
        } else {
          param.district_code = val
        }
      }

      // 免登录下单，不使用离线购物车的数据
      // param.items = [{"variant_id":17,"quantity":1},{"variant_id":992,"quantity":2}]

      this.$sdk.payment_method.get(param, data => {
        let err = ''

        if (data && data.res) {
          if (data.res.code === 200) {
            this.oPaymentMethods = data.res.payment_method || {}
            // 每次获取到新数据都必须要重新选择支付方式
            this.oPaymentData = {}
          } else {
            err = data.res.message || '支付方式数据获取出错'
          }
        } else {
          err = '支付方式数据请求异常'
        }
        cb && cb(err)
      })
    },
    getShipments (cb) {
      const oAdd = this.oAddressData
      const payType = this.oPaymentData.payment_method_type
      if (Object.keys(oAdd).length && payType) {
        const param = {
          payment_method_type: payType
        }
        if (this.isSigned) {
          param.address_id = oAdd.id
        } else {
          param.district_code = oAdd.district_code
        }
        this.$sdk.cart.withinShipments(param, data => {
          let err = ''

          if (data && data.res) {
            if (data.res.code === 200) {
              const ship = data.res.shipments || []
              if (ship.length) {
                this.shipments = ship
              } else {
                err = '您选择的商品暂不支持下单，请返回购物车确认'
              }
            } else {
              err = data.res.message || '购物车数据获取出错'
            }
          } else {
            err = '购物车数据请求异常'
          }
          cb && cb(err)
        })
      }
    },
    getDiscount (cb) {
      this.$sdk.discount.matchCart(data => {
        let err = ''

        if (data && data.res) {
          if (data.res.code === 200) {
            this.oDiscount = data.res || {}
          } else {
            err = data.res.message || '优惠数据获取出错'
          }
        } else {
          err = '优惠数据请求异常'
        }
        cb && cb(err)
      })
    },
    initAddress (cb) {
      let _oAddress = null

      if (this.addresses.length > 0) {
        for (const item of this.addresses) {
          if (item.is_default) {
            _oAddress = item
            break
          }
        }

        if (!_oAddress) {
          _oAddress = this.addresses[0]
        }
      }

      this.oAddressData = _oAddress || {}
    },
    initShipmentSkuMap () {
      const _oShipmentSkuMap = {}

      this.initCheckCustoms()

      for (const oShipment of this.shipments) {
        for (const oItem of oShipment.carts) {
          _oShipmentSkuMap[oItem.variant_id] = oItem

          this.fnCheckCustoms(oItem.name)
        }
      }

      this.oShipmentSkuMap = _oShipmentSkuMap
    },
    initDiscountSkuMap () {
      // 依赖 shipments 数据，有可能这时还没 shipments 数据

      const oDis = this.oDiscount || {}
      const oMarketing = oDis.marketing || {}
      const _oShipmentSkuMap = this.oShipmentSkuMap || {}
      const _oDiscountSkuMap = {}

      for (const oItem of (oMarketing.variants || [])) {
        const _oItem = JSON.parse(JSON.stringify(oItem || {})) // 深拷贝

        // 新数据
        _oItem.quantity = (_oShipmentSkuMap[oItem.variant_id] || {}).quantity || 0
        // 优化修复
        if (_oItem.origin_price === null) {
          _oItem.origin_price = _oItem.event_price
        }

        _oDiscountSkuMap[oItem.variant_id] = _oItem
      }

      this.oDiscountSkuMap = _oDiscountSkuMap

      this.fnMarketingToDiscounts()

      this.setDiscountSum()
    },
    initCheckCustoms () {
      window.$$isCheckIDCard = false
    },
    fnCheckCustoms (val) {
      window.$$isCheckIDCard = (window.$$isCheckIDCard || /(直邮|保税)/ig.test(val))
    },
    fnMarketingToDiscounts () {
      // 新活动支持
      const oDis = this.oDiscount || {}
      const oMarketing = oDis.marketing || {}
      const _oDiscountSkuMap = this.oDiscountSkuMap || {}
      const _oInfos = {}

      for (const _nSkuID in _oDiscountSkuMap) {
        const oItem = _oDiscountSkuMap[_nSkuID] || {}

        // 拼团商品直接购买，当正常商品跳过不处理
        if (oItem.c_id === 3 && !this.grouponNo) {
          continue // 跳过当次循环，循环继续
        }

        if (oItem.available) {
          let _oInfo = _oInfos[oItem.c_id] || {}
          const oMarketingInfo = (oMarketing.info || {})[oItem.c_id] || {}

          // 秒杀 1，限时 2，团购 3
          if (/^[123]$/.test(oItem.c_id)) {
            // 没有内容先创建对象
            if (!_oInfo.id) {
              _oInfo = {
                id: oMarketingInfo.id,
                name: oMarketingInfo.title || '活动',
                discount_amount: 0,
                match_item_amount: 0,
                range_products: [],
                range_variants: []
              }

              _oInfos[oItem.c_id] = _oInfo
            }

            _oInfo.discount_amount += ((oItem.origin_price - oItem.event_price) * oItem.quantity)
            _oInfo.match_item_amount += (oItem.origin_price * oItem.quantity)
            _oInfo.range_products.push(oItem.product_id)
            _oInfo.range_variants.push(oItem.variant_id)

            // 去重
            _oInfo.range_products = [...new Set(_oInfo.range_products)]
            _oInfo.range_variants = [...new Set(_oInfo.range_variants)]
          }
        }
      }

      // 去重
      const _oDiscountMap = {}

      for (const _oInfo of (oDis.discounts || [])) {
        if (_oInfo.id) {
          _oDiscountMap[_oInfo.id] = _oInfo
        }
      }

      for (const _infoKey in _oInfos) {
        const _oInfo = _oInfos[_infoKey] || {}
        if (_oInfo.id) {
          _oDiscountMap[_oInfo.id] = _oInfo
        }
      }

      const _discounts = []
      for (const _infoKey in _oDiscountMap) {
        _discounts.push(_oDiscountMap[_infoKey] || {})
      }

      oDis.discounts = _discounts
    },
    setAddressById (id) {
      this.oAddressData = {}
      if (id || id === 0) {
        for (const oAddressData of this.addresses) {
          if (oAddressData.id === id) {
            this.oAddressData = oAddressData
            break
          }
        }
      } else if (id === null) {
        this.oAddressData = this.addresses[0] || {}
      }
    },
    setGivePoint () {
      let nRes = 0
      const shipList = this.shipments || []
      if (this.oDiscount.reward_point_enabled) {
        for (const oShip of shipList) {
          for (const oItem of (oShip.carts || [])) {
            nRes += oItem.point
          }
        }
      }
      this.nGivePoint = nRes || 0
    },
    fnCheckPro (cb) {
      let err = ''

      const items = this.oCart.items || []
      for (const oItem of items) {
        if (oItem.is_check && !oItem.available) {
          err = oItem.reason || '您选择的商品已失效，请返回购物车确认'
          break
        }
      }
      cb && cb(err)
    },
    fnPayChange (oData) {
      this.oPaymentData = oData
    },
    fnShipmentsChange (shipmentsData) {
      this.shipmentsData = shipmentsData
      this.setShipSum()
    },
    fnCouponChange (oCoupon) {
      this.oCouponData = oCoupon
      this.setCouponSum()
    },
    fnPointChange (nPoint) {
      this.setPointSum(parseInt(nPoint) || 0)
    },
    upCalc (oItems) {
      const _oSum = this.oSum

      if (_oSum.Calc) {
        _oSum.Calc.update({ ...oItems })
      }

      this.setSum()
    },
    setAccountSum () {
      const oUser = this.oAccount
      const oLevel = oUser.customer_level

      this.upCalc({
        level_discount: oLevel.discount || 100, // 100%，无打折
        reward_point_total: oUser.point || 0
      })
    },
    setProSum () {
      let _sum = 0
      for (const oShip of this.shipments) {
        for (const oPro of oShip.carts) {
          _sum += oPro.line_price
        }
      }
      this.upCalc({
        item_amount: _sum
      })
    },
    setShipSum (val) {
      let _sum = 0
      for (const oShip of this.shipmentsData) {
        _sum += oShip.amount
      }
      this.upCalc({
        shipment_amount: _sum
      })
    },
    setDiscountSum () {
      const oDis = this.oDiscount
      if (Object.keys(oDis).length) {
        let _sum = 0
        const oSet = {}
        for (const oItem of oDis.discounts) {
          if (oItem.discount_amount) {
            _sum += oItem.discount_amount
          }
        }
        if (_sum) {
          oSet.discount_amount = _sum
        }
        if (oDis.reward_point_enabled) {
          oSet.reward_point_exchange_ratio = oDis.reward_point_exchange_ratio || 0
          oSet.reward_point_limit = oDis.reward_point_limit || 0
        }
        this.upCalc({ ...oSet })
      }
    },
    setCouponSum () {
      // 满折未支持，需要分类计算
      if (this.oCouponData) {
        this.upCalc({
          coupon_discount_amount: this.oCouponData.discount_amount || 0
        })
      }
    },
    setPointSum (nPoint) {
      if (nPoint || nPoint === 0) {
        this.upCalc({
          reward_point_use: nPoint
        })
      }
    },
    getOthersSum () {
      const _oSum = this.oSum
      let res = 0
      for (const key in _oSum.others) {
        const _amount = _oSum.others[key].amount
        if (_amount || _amount === 0) {
          res += _amount
        }
      }
      return res
    },
    setSumOthers (key, item, cont) {
      const oSumOthers = this.oSum.others
      if (!(key in oSumOthers)) {
        // $set 关联新数据
        this.$set(oSumOthers, key, {})
      }
      oSumOthers[key][item] = cont
      this.setSum()
    },
    setSum () {
      const _oSum = this.oSum
      // console.log(_oSum.Calc.help())  // 查看 Order Calculator Key 及其对应含义

      if (_oSum.Calc) {
        _oSum.Calc.get(res => {
          // console.log(res)
          _oSum.oRes = { ...res }
          _oSum.fix_amount = _oSum.oRes.final_amount + this.getOthersSum() // 实付金额
        })
      }
    },
    fnSucceedPay () {
      this.isPay = true
    },
    fnPreAd (oOrder) {
      let res = true
      const oAddress = this.oAddressData
      if (oAddress.id || oAddress.id === 0) {
        oOrder.address_id = oAddress.id
      } else if (oAddress.district_code || oAddress.district_code === 0) {
        // 免登录下单参数
        oOrder.district_code = oAddress.district_code
        oOrder.name = oAddress.name
        oOrder.mobile = oAddress.mobile
        oOrder.detail = oAddress.detail
      } else {
        this.$toast.info('缺少收货地址，无法提交订单')
        res = false
      }
      return res
    },
    fnPreIDCard (oOrder) {
      let res = true
      const oAddress = this.oAddressData || {}

      if (window.$$isCheckIDCard && !oAddress.id_card) {
        res = false
        this.$toast.info('收货地址缺少身份证，请先补全')
      }

      return res
    },
    fnPrePay (oOrder) {
      let res = true
      const oPay = this.oPaymentData
      if (oPay.payment_method_id || oPay.payment_method_id === 0) {
        oOrder.payment_method_id = oPay.payment_method_id
      } else {
        this.$toast.info('缺少支付方式，无法提交订单')
        res = false
      }
      return res
    },
    fnPreShip (oOrder) {
      let res = true
      const shipData = this.shipmentsData
      if (shipData.length) {
        oOrder.shipments = JSON.stringify(shipData) || '[]'
      } else {
        this.$toast.info('缺少配送方式，无法提交订单')
        res = false
      }
      return res
    },
    fnPreRemark (oOrder) {
      const res = true
      const remarks = this.remarksData
      if (remarks) {
        oOrder.remark = remarks
      }
      return res
    },
    fnPreCoupon (oOrder) {
      const res = true
      const oCoupon = this.oCouponData
      if (oCoupon.code) {
        oOrder.coupon_code = oCoupon.code
      }
      return res
    },
    fnPrePoint (oOrder) {
      const res = true
      const _oRes = this.oSum.oRes
      if (this.oDiscount.reward_point_enabled && _oRes.reward_point_use) {
        oOrder.reward_point = _oRes.reward_point_use
      }
      return res
    },
    fnPreMetas (oOrder) {
      let res = true
      const _oMetas = this.oMetas
      const oMetasDef = {
        name: 'order_attributes',
        description: '订单信息',
        fields: {}
      }
      if (Object.keys(_oMetas).length) {
        oMetasDef.fields = _oMetas
        try {
          oOrder.meta_fields = JSON.stringify(oMetasDef)
        } catch (err) {
          console.log(err)
          this.$toast.info('处理自定义数据出错')
          res = false
        }
      }
      return res
    },
    fnPreList (oOrder) {
      // 收货地址
      if (!this.fnPreAd(oOrder)) return false

      // 身份证
      if (!this.fnPreIDCard(oOrder)) return false

      // 支付方式
      if (!this.fnPrePay(oOrder)) return false

      // 配送方式
      if (!this.fnPreShip(oOrder)) return false

      // 留言
      if (!this.fnPreRemark(oOrder)) return false

      // 优惠券
      if (!this.fnPreCoupon(oOrder)) return false

      // 积分抵现
      if (!this.fnPrePoint(oOrder)) return false

      // Metas
      if (!this.fnPreMetas(oOrder)) return false

      return true
    },
    fnCreateOrder (oOrder, cb) {
      this.$sdk.order.create(oOrder, data => {
        let err = ''

        if (data && data.res) {
          if (data.res.code === 200) {
            cb && cb(null, data.res)
          } else {
            err = data.res.message || '提交订单出错'
          }
        } else {
          err = '提交订单请求异常'
        }
        if (err) {
          cb && cb(err)
        }
      })
    },
    fnCreateOrderAfter (err, data) {
      if (err) {
        this.$toast.info(err)
      } else {
        this.$toast.off()
        this.orderNo = data.order_no

        // 免登陆下单支持
        if (this.isSigned) {
          if (this.hasPay) {
            this.isPay = true
          } else {
            this.goOrder()
          }
        } else {
          this.isSucceed = true
        }
      }
    },
    fnSubmit () {
      const _oOrder = {}

      if (!this.fnPreList(_oOrder)) return

      this.$toast.loading('正在提交订单...')

      // 调试用代码
      // this.$toast.off()
      // console.log(_oOrder)
      // this.orderNo = '111111'
      // // this.isSucceed = true
      // if (this.hasPay) {
      //   this.isPay = true
      // }
      // End - 调试用代码

      // console.log(_oOrder)

      this.fnCreateOrder(_oOrder, (err, data) => {
        this.fnCreateOrderAfter(err, data)
      })
    }
  }
}
</script>

<style scoped>
  .yk-checkout {
    padding: 0 0 calc(109px + var(--homeIndicator));
    min-height: calc(100vh - 109px - var(--homeIndicator));
    overflow: hidden;  /* 防止 Margin 溢出 */
    background-color: #eeeff0;
  }
  .yk-checkout-info {
    position: fixed;
    left: 0;
    bottom: 0;
  }
</style>
