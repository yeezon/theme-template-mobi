<docs>
## YkAccountSecurity Docs

* API 没有类型区分，只能先一次请求全部数据做分类

### To-do List

* 优化显示，oShop 放父级组件里，在父级点击进入的时候加载 oShop 数据
* 父级提供 getShop Event，刷新当前页的时候也正常显示

</docs>

<template>
  <div class="yk-account_security" data-com="YkAccountSecurity">
    <yu-header :is-fixed="true">
      <YuNavBar class="yk-account_security-nav" title="安全设置" />
    </yu-header>
    <div class="yu-cells">
      <YuCell label="账号密码" placeholder="修改账号密码" @click="fnGo('/account/change_password')" :is-link="true">
      </YuCell>
    </div>
    <div v-if="!oUser.social_type" class="yk-account_security-social yu-cells">
      <div class="yk-account_security-social_title">社交账号绑定</div>
      <template v-for="(oSocial, index) in socials">
        <div :key="index" v-if="isShow(oSocial.type, oSocial.binded)" class="yk-account_security-social_cell">
          <YuIcon class="yk-account_security-social_icon" :name="'yk-icon-social_' + oSocial.type" slot="icon" />
          <div class="yk-account_security-social_info">
            <div>{{ nameMap[oSocial.type] || 'Null' }}</div>
            <div class="yk-account_security-social_name">{{ oSocial.name || '未绑定' }}</div>
          </div>
          <YuButton class="yk-account_security-social_btn" :disabled="oSocial.binded" type="primary" size="small" @click="fnBind(oSocial.bind_url)">绑定</YuButton>
        </div>
      </template>
      <div v-if="!hasShow && !isLoading" class="yk-account_security-social_cell">
        <YuIcon class="yk-account_security-social_icon i-empty" name="yk-icon-tips" />
        <div class="yk-account_security-social_info">暂未对接社交平台</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  componentName: 'YkAccountSecurity',
  props: {
    account: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      oUser: {},
      oShop: {},
      nameMap: {
        douban: '豆瓣',
        weibo: '微博',
        qq: 'QQ',
        renren: '人人网',
        netease: '网易通行证',
        weixin: '微信',
        facebook: 'Facebook'
      },
      isLoading: false,
      hasShow: false
    }
  },
  computed: {
    socials () {
      return this.oUser.social_accounts || []
    }
  },
  watch: {
    oShop () {
      this.hasShow = false
    }
  },
  created () {
    this.oUser = this.$store.state.account.user || {}
    this.getShop(err => {
      if (err) {
        this.$toast.info(err)
      }
    })
  },
  methods: {
    getShop (cb) {
      this.isLoading = true
      this.$sdk.shop.get('shop', data => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            this.oShop = data.res.shop || {}
          } else {
            err = data.res.message || '网站数据获取出错'
          }
        } else {
          err = '网站数据请求异常'
        }

        this.isLoading = false

        cb && cb(err)
      })
    },
    fnGo (path) {
      this.$router.push(path)
    },
    fnBind (bindURL) {
      window.location.href = bindURL
    },
    isShow (type, binded) {
      if (this.oShop[`enable_${type}_login`] || binded) {
        this.hasShow = true
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style scoped>
  .yk-account_security-nav {
    margin: 0 0 15px;
  }
  .yk-account_security-social {
    padding: 0 15px;
  }
  .yk-account_security-social_title {
    height: 44px;
    line-height: 44px;
  }
  .yk-account_security-social_cell {
    display: flex;
    padding: 10px 0;
    border: 0 solid #d5d5d5;
    border-width: var(--1px) 0 0;
    background-color: #fff;
  }
  .yk-account_security-social_icon {
    margin: 0 10px 0 0;
    width: 32px;
    height: 32px;
    color: #999;
  }
  .yk-account_security-social_icon.i-empty {
    width: 26px;
    height: 26px;
  }
  .yk-account_security-social_info {
    flex: 1;
    margin: auto;
    line-height: 1;
  }
  .yk-account_security-social_name {
    margin: 6px 0 0;
    font-size: 12px;
    color: #777;
  }
  .yk-account_security-social_btn {
    margin: auto;
    padding: 0 12px;
    line-height: 26px;
  }
</style>
