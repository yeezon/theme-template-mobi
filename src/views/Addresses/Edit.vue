<docs>
## YkAddressEdit Docs
</docs>

<template>
<div class="yk-address-edit" data-com="YkAddressEdit">
  <yu-header>
    <YuNavBar :title="title" class="yk-address-edit-bar" @back="fnBack">
      <YuButton v-if="oFormData.id" class="yk-address-edit-del_btn" slot="right" type="text" @click="fnDel(oFormData.id)">删除</YuButton>
    </YuNavBar>
  </yu-header>
  <YuForm ref="form">
    <YuField type="text" label="收货人" placeholder="必填" v-model.trim="oFormData.name" required />
    <YuField type="tel" label="联系电话" placeholder="必填" v-model.trim="oFormData.mobile" required :rules="rules.mobile" />
    <YuField type="area" label="选择地区" placeholder="必填" v-model="oArea" required :rules="rules.area" />
    <YuField type="textarea" label="详细地址" placeholder="必填" v-model.trim="oFormData.detail" required />
    <YuField type="number" label="邮政编码" placeholder="选填" v-model.trim="oFormData.zipcode" :rules="rules.zipcode" />
    <YuField v-if="oSetting.enable_address_id_card" type="text" label="身份证" :placeholder="oSetting.enable_address_id_card_check ? '必填' : '选填'" v-model="oFormData.id_card" :rules="rules.idCard"/>
    <YuCell v-if="!oShop.enable_checkout_anonymously" label="默认地址">
      <YuSwitch slot="suffix" v-model="oFormData.is_default" />
    </YuCell>
  </YuForm>
  <div v-if="oSetting.address_edit_notice" class="s-tips">
    <span>{{ oSetting.address_edit_notice }}</span>
  </div>
  <div class="yk-address-edit-btns">
    <YuButton class="yk-address-edit-submit" type="primary" size="large" @click="fnSubmit">保存并使用</YuButton>
    <YuHomeIndicator />
  </div>
</div>
</template>

<script>
export default {
  name: 'YkAddressEdit',
  props: {
    mode: {
      type: String,
      default: '' // '' | select
    },
    addressId: { // 暂时用不到，目前使用 Store 里的
      type: [Number, String],
      default: null
    }
  },
  data () {
    return {
      title: '编辑地址',
      oFormData: {
        id: null,
        name: '',
        mobile: '',
        district_code: '',
        detail: '',
        zipcode: '',
        id_card: '',
        is_default: false
        // meta_fields: ''
      },
      oMetas: {},
      oArea: {
        country: '',
        country_code: '',
        district_code: '',
        location_full_titles: '',
        location_full_codes: '',
        metas: {}
      },
      rules: {
        mobile: [{
          validator (val) {
            return window.$$app.$sdk.util.isMobile(val)
          },
          err: '联系电话格式不正确'
        }],
        area: [{
          validator (val) {
            if (!(val.district_code || val.district_code === 0)) {
              // this.err ?
              return false
            } else {
              return true
            }
          },
          err: '请填写选择地区'
        }],
        zipcode: [{
          validator (val) {
            if ((val.length > 0) && (val.length < 3)) {
              // this.err ?
              return false
            } else {
              return true
            }
          },
          err: '邮政编码格式不正确'
        }],
        idCard: [{
          validator: val => {
            if (val.length > 0) {
              return /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(val)
            } else if (this.oSetting.enable_address_id_card_check) {
              return false
            } else {
              return true
            }
          },
          err: '请填写正确的身份证号码'
        }]
      }
    }
  },
  computed: {
    isSigned () {
      return !!this.$store.state?.account?.isSigned
    },
    oShop () {
      return window.$$shop || {}
    },
    oSetting () {
      return window.$$settings || {}
    },
    oAddress () {
      return Object.assign({
        id: null,
        name: '',
        country: '',
        country_code: '',
        district_code: '',
        location_full_titles: '',
        location_full_codes: '',
        detail: '',
        zipcode: '',
        id_card: '',
        mobile: '',
        telephone: '',
        email: '',
        is_default: false
      }, this.oFormData, this.oArea, {
        metas: {
          information: this.oMetas
        }
      })
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.initFormData(this.$store.state?.address?.oSelected || {})
    },
    initFormData (val) {
      // 支持免登陆下单地址
      if (val?.id || (val?.id === null)) {
        const oAddress = val

        this.oFormData.id = oAddress.id
        this.oFormData.name = oAddress.name
        this.oFormData.mobile = oAddress.mobile || oAddress.telephone
        this.oFormData.district_code = oAddress.district_code
        this.oFormData.detail = oAddress.detail
        this.oFormData.zipcode = oAddress.zipcode
        this.oFormData.id_card = oAddress.id_card
        this.oFormData.is_default = oAddress.is_default

        this.oArea.country_code = oAddress.country_code
        this.oArea.district_code = oAddress.district_code

        this.oMetas = oAddress?.metas?.information || {}
      }
    },
    fnReset () {
      this.$refs.form.reset()
    },
    fnBack () {
      if (this.mode === 'select') {
        this.$store.dispatch('address/clearSelectAddress')
      }
    },
    fnDel (val) {
      this.$confirm({
        title: '删除收货地址',
        msg: '确定要删除此收货地址吗？'
      }).then(() => {
        this.$sdk.address.remove({ id: val }, data => {
          let err = ''

          if (data && data.res) {
            if (data.res.code === 200) {
              if (this.mode === 'select') {
                this.$store.dispatch('address/clearSelectAddress')
              }

              this.$router.back()
            } else {
              err = data.res.message || '删除收货地址失败'
            }
          } else {
            err = '删除收货地址请求失败'
          }

          if (err) this.$toast.info(err)
        })
      }).catch(error => {
        console.log('fnDel =>', error)
      })
    },
    fnValidate (cb) {
      this.$refs.form.validate(err => {
        cb && cb(err)
      })
    },
    fnSentDataHandle (cb) {
      // Metas 处理
      if ((typeof this.oMetas === 'object') && Object.keys(this.oMetas).length) {
        this.oFormData.meta_fields = JSON.stringify({
          name: 'information',
          description: '自定义信息',
          fields: this.oMetas
        })
      }
      // oArea 处理
      this.oFormData.district_code = this.oArea.district_code

      cb && cb()
    },
    fnSent (cb) {
      let err = ''
      const _oFormData = this.oFormData || {}

      if (_oFormData.id && this.isSigned) {
        // 修改地址
        this.$sdk.address.save(_oFormData, data => {
          let _oResAddress = {}

          if (data && data.res) {
            if (data.res.code === 200) {
              _oResAddress = ((data || {}).res || {}).address || {}
            } else {
              err = data.res.message || '地址操作不成功'
            }
          } else {
            err = '地址操作请求异常'
          }

          cb && cb(err, _oResAddress)
        })
      } else if (this.isSigned) {
        // 新增地址
        this.$sdk.address.create(_oFormData, data => {
          let _oResAddress = {}

          if (data && data.res) {
            if (data.res.code === 200) {
              _oResAddress = {
                ..._oFormData
              }

              // 补上 ID 信息
              _oResAddress.id = ((data || {}).res || {}).address_id || null
            } else {
              err = data.res.message || '地址操作不成功'
            }
          } else {
            err = '地址操作请求异常'
          }

          cb && cb(err, _oResAddress)
        })
      } else {
        // 免登陆下单地址
        cb && cb(err, this.oAddress || {})
      }
    },
    fnSubmit () {
      this.fnValidate(err => {
        if (err) {
          this.$toast.info(err)
        } else {
          this.fnSentDataHandle()

          this.fnSent((err, oVal) => {
            // 后面会有 oVal.id
            if (err) {
              this.$toast.info(err)
            } else {
              if (this.mode === 'select') {
                const _oAddress = {
                  ...(this.oFormData || {})
                }

                _oAddress.id = _oAddress.id || oVal.id // 新创建的地址无 ID 信息，补上

                this.$store.dispatch('address/setSelectAddress', _oAddress)

                this.$router.go(-2)
              } else {
                this.$router.back()
              }
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
  .yk-address-edit {
    width: 100vw;
    /* height: var(--100vh); */
    height: 100%; /* 避免 WebView Input 输入导致的 View 错位问题 */
    background-color: #eeeff0;
  }
  .yk-address-edit-bar {
    border-width: 0;
  }
  .s-tips {
    padding: 30px;
    font-size: 14px;
    line-height: 1.7em;
    color: #f44;
  }
  .yk-address-edit-del_btn {
    padding: 0 20px;
    font-size: 14px;
    color: inherit;
  }
  .yk-address-edit-del_btn:active {
    color: #f44;
  }
  .yk-address-edit-btns {
    position: fixed;
    left: 0;
    bottom: 0;
    padding: 13px 15px;
    border: 0 solid #d5d5d5;
    border-width: var(--1px) 0 0;
    background-color: #fff;
    width: stretch;
  }
  .yk-address-edit-submit {
    display: block;
    width: stretch;
  }
</style>
