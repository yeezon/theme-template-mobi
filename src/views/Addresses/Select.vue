<docs>
## YkAddressesSelect Docs
</docs>

<template>
  <div class="yk-addresses_select" data-com="YkAddressesSelect">
    <div v-for="oAddress in addresses" :key="oAddress.id" class="yk-addresses_select-item" @click="fnSelected(oAddress)">
      <svg class="yu-icon yk-addresses_select-icon" :class="{'i-active': nNowId === oAddress.id}">
        <use xlink:href="#yu-icon-check_fill" v-if="nNowId === oAddress.id"></use>
        <use xlink:href="#yu-icon-check" v-else></use>
      </svg>
      <div class="yk-addresses_select-info">
        <div class="yk-addresses_select-top">
          <span class="yk-addresses_select-name">{{oAddress.name}}</span>
          <span class="yk-addresses_select-phone">{{ oAddress.mobile || oAddress.telephone }}</span>
          <span v-if="oAddress.is_default" class="yk-addresses_select-def">默认</span>
        </div>
        <div class="yk-addresses_select-address">{{ (oAddress.location_full_titles || '').replace(/,/g, ' ') }}</div>
        <div class="yk-addresses_select-address_detail">{{ oAddress.detail }}</div>
      </div>
      <div class="yk-addresses_select-btns">
        <YuButton type="text" class="yk-addresses_select-btns_btn" @click.stop="fnEdit(oAddress)">
          <svg class="yu-icon">
            <use xlink:href="#yu-icon-edit" />
          </svg>
        </YuButton>
      </div>
    </div>
    <div v-if="!isEmpty" class="yk-addresses_select-empty">
      <svg class="yk-addresses_select-empty_icon">
        <use xlink:href="#yk-ico-address_2" />
      </svg>
      <div class="yk-addresses_select-empty_text">暂无可用收货地址</div>
    </div>
    <div class="yk-addresses_select-add">
      <YuButton type="primary" size="large" class="yk-addresses_select-add_btn" @click="fnEdit">新增加收货地址</YuButton>
      <YuHomeIndicator />
    </div>
  </div>
</template>

<script>
export default {
  componentName: 'YkAddressesSelect',
  props: {
    selectId: {
      type: [Number, String],
      default: null
    }
  },
  data () {
    return {
      nNowId: null,
      isLock: false,
      addresses: []
    }
  },
  computed: {
    isEmpty () {
      return this.addresses.length > 0
    }
  },
  watch: {
    selectId (val) {
      this.setNowId(val)
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.isLoading = true

      this.getAddresses(err => {
        this.isLoading = false

        if (this.addresses.length <= 0) {
          this.fnEdit()
        }

        if (err) {
          this.$toast.info(err)
        }
      })

      this.setNowId(this.$store.state.address?.oSelected?.id || this.selectId)
    },
    setNowId (val) {
      this.nNowId = window.parseInt(val) || null
    },
    getAddresses (cb) {
      this.$sdk.address.get(data => {
        let err = null

        if (data && data.res) {
          if (data.res.code === 200) {
            this.addresses = data.res.addresses || []
          } else {
            err = data.res.message || '地址数据获取出错'
          }
        } else {
          err = '地址数据请求异常'
        }
        cb && cb(err)
      })
    },
    fnSelected (val) {
      if (!this.isLock) {
        this.isLock = true

        this.$store.dispatch('address/setSelectAddress', val || {})

        this.setNowId(val?.id)

        // 延迟时间，避免选择后瞬间跳转影响体验
        setTimeout(() => {
          this.isLock = false

          this.$router.back()
        }, 150)
      }
    },
    fnEdit (val) {
      this.$store.dispatch('address/setSelectAddress', val || {})

      this.$router.push(`/account/addresses/${val?.id || 'new'}?mode=select`)
    }
  }
}
</script>

<style scoped>
  .yk-addresses_select {
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0 0 80px;
    min-height: var(--100vh);
  }
  .yk-addresses_select-empty {
    margin: 15px 0;
    padding: 80px 0;
    text-align: center;
    color: #999;
  }
  .yk-addresses_select-empty_icon {
    margin: 0 auto 10px;
    width: 100px;
    height: 100px;
    color: currentColor;
  }
  .yk-addresses_select-item {
    display: flex;
    padding: 0 0 0 15px;
    border: 0 solid #d5d5d5;
    border-width: 0 0 var(--1px);
    background-color: #fff;
    -webkit-tap-highlight-color: transparent;
    transition: background-color .3s ease-out;
  }
  .yk-addresses_select-item:active {
    transition: none;
    background-color: #e6e6e6;
  }
  .yk-addresses_select-info {
    flex: 1;
    margin: auto;
    padding: 15px 0;
    overflow: hidden;
  }
  .yk-addresses_select-icon {
    margin: auto;
    padding: 0 15px 0 0;
    font-size: 20px;
  }
  .yk-addresses_select-icon.i-active use {
    color: #4685ee;
  }
  .yk-addresses_select-top {
    display: flex;
    margin: 0 0 8px;
    font-weight: bold;
    line-height: 20px;
  }
  .yk-addresses_select-name,
  .yk-addresses_select-phone {
    margin: auto 10px auto 0;
    font-size: 16px;
  }
  .yk-addresses_select-def {
    display: inline-block;
    margin: auto 0;
    padding: 3px 4px 3px 5px;
    font-size: 12px;
    line-height: 1;
    color: #4685ee;
    border: 1px solid currentColor;
    border-radius: 3px;
  }
  .yk-addresses_select-address {
    margin: 0 0 5px;
    line-height: 1;
    font-size: 13px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .yk-addresses_select-address_detail {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .yk-addresses_select-btns {
    margin: auto;
  }
  .yk-addresses_select-btns_btn {
    padding: 15px;
    line-height: 1;
    color: #999;
  }
  .yk-addresses_select-btns_btn .yu-icon {
    width: 24px;
    height: 24px;
  }
  .yk-addresses_select-add {
    position: fixed;
    left: 0;
    bottom: 0;
    padding: 13px 15px;
    border: 0 solid #d5d5d5;
    border-width: var(--1px) 0 0;
    background-color: #fff;
    width: stretch;
  }
  .yk-addresses_select-add_btn {
    display: block;
    width: stretch;
  }
</style>
