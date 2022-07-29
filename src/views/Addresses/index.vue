<docs>
## YkAddressList Docs

### To-do List

* 优化显示，addresses 放父级组件里，在父级点击进入的时候加载 addresses 数据
* 父级提供 getAddresses Event，刷新当前页的时候也正常显示
* 数据获取错误提示处理

</docs>

<template>
  <div class="yk-address_list" data-com="YkAddressList">
    <yu-header :is-fixed="true">
      <YuNavBar class="yk-address_list-nav" title="收货地址" />
    </yu-header>
    <div v-for="oAddress in addresses" :key="oAddress.id" class="yk-address_list-item yu-cells">
      <div class="yk-address_list-info">
        <div class="yk-address_list-top">
          <span class="yk-address_list-name">{{oAddress.name}}</span>
          <span class="yk-address_list-phone">{{ oAddress.mobile || oAddress.telephone }}</span>
        </div>
        <div class="yk-address_list-address">{{ (oAddress.location_full_titles || '').replace(/,/g, ' ') }} {{ oAddress.detail }}</div>
      </div>
      <div class="yk-address_list-btns">
        <YuButton type="text" class="yk-address_list-btns_def" @click="setDef(oAddress)">
          <svg class="yk-address_list-icon yu-icon" slot="icon" :class="{'i-active': isDef(oAddress.id, oAddress.is_default)}">
            <use xlink:href="#yu-icon-check_fill" v-if="isDef(oAddress.id, oAddress.is_default)"></use>
            <use xlink:href="#yu-icon-check" v-else></use>
          </svg>
          <span>默认地址</span></YuButton>
        <YuButton type="text" class="yk-address_list-btns_btn" @click="fnDel(oAddress.id)">删除</YuButton>
        <YuButton type="text" class="yk-address_list-btns_btn" @click="fnEdit(oAddress)">编辑</YuButton>
      </div>
    </div>
    <YuLoadTips v-if="!addresses.length && !isLoading" :is-empty="true" empty-text="暂无可用收货地址" empty-icon="yk-icon-address_2" />
    <div class="yk-address_list-add">
      <YuButton type="primary" size="large" class="yk-address_list-add_btn" @click="fnEdit">新增加收货地址</YuButton>
      <YuHomeIndicator />
    </div>
  </div>
</template>

<script>
export default {
  componentName: 'YkAddressList',
  data () {
    return {
      isLoading: false,
      addresses: [],
      nDefID: null
    }
  },
  created () {
    this.isLoading = true
    this.getAddresses(err => {
      this.isLoading = false
      if (err) {
        this.$toast.info(err)
      }
    })
  },
  methods: {
    isDef (id, isDef) {
      if (this.nDefID === null && isDef) {
        this.nDefID = id
      }
      return this.nDefID === id
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
    upAddressesList () {
      this.getAddresses(err => {
        if (err) {
          this.$toast.info(err)
        } else {
          this.nDefID = null
        }
      })
    },
    setDef (oAddress) {
      if (oAddress) {
        const _oldID = this.nDefID
        this.nDefID = oAddress.id
        oAddress.is_default = true
        this.$sdk.address.save(oAddress, data => {
          let err = null
          if (data && data.res) {
            if (data.res.code === 200) {
              this.upAddressesList()
            } else {
              err = data.res.message || '设置默认操作不成功'
            }
          } else {
            err = '设置默认操作请求异常'
          }
          if (err) {
            this.nDefID = _oldID
            oAddress.is_default = false
            this.$toast.info(err)
          }
        })
      }
    },
    fnEdit (val) {
      this.$store.dispatch('address/setSelectAddress', val || {})

      this.$router.push(`/account/addresses/${val?.id || 'new'}`)
    },
    fnDel (id) {
      this.$confirm({
        title: '删除收货地址',
        msg: '确定要删除此收货地址吗？'
      }).then(() => {
        this.$sdk.address.remove({ id: id }, data => {
          let err = null
          if (data && data.res) {
            if (data.res.code === 200) {
              this.upAddressesList()
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
    }
  }
}
</script>

<style scoped>
  .yk-address_list {
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0 0 80px;
    min-height: var(--100vh);
  }
  .yk-address_list-nav {
    margin: 0 0 15px;
  }
  .yk-address_list-item {
    padding: 0 15px;
    background-color: #fff;
  }
  .yk-address_list-info {
    flex: 1;
    margin: auto;
    padding: 11px 0 9px;
    overflow: hidden;
  }
  .yk-address_list-icon {
    padding: 0 5px 0 0;
    width: 22px;
    height: 22px;
    vertical-align: middle;
  }
  .yk-address_list-icon.i-active use {
    color: #fb544e;
  }
  .yk-address_list-top {
    display: flex;
    margin: 0 0 6px;
    font-weight: bold;
    line-height: 20px;
    font-size: 18px;
  }
  .yk-address_list-name,
  .yk-address_list-phone {
    margin: auto 10px auto 0;
  }
  .yk-address_list-address {
    margin: 0;
    line-height: 1.5;
    font-size: 13px;
    color: #777;
  }
  .yk-address_list-btns {
    padding: 8px 0 10px;
    border: 0 solid #d5d5d5;
    border-width: var(--1px) 0 0;
    line-height: 22px;
    overflow: hidden;
  }
  .yk-address_list-btns_def {
    padding: 0;
    line-height: inherit;
    font-size: 14px;
    color: #777;
  }
  .yk-address_list-btns_def:active {
    color: #777;
  }
  .yk-address_list-btns_btn.yu-btn {
    float: right;
    margin: 0 0 0 30px;
    padding: 0;
    line-height: inherit;
    font-size: 14px;
    color: inherit;
  }
  .yk-address_list-add {
    position: fixed;
    left: 0;
    bottom: 0;
    padding: 13px 15px;
    border: 0 solid #d5d5d5;
    border-width: var(--1px) 0 0;
    background-color: #fff;
    width: stretch;
  }
  .yk-address_list-add_btn {
    display: block;
    width: stretch;
  }
</style>
