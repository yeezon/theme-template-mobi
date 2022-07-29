<docs>
## YkAuthSocial Docs

* 购物车 Redirect、创建订单页 Redirect
* 优化完 Popup 后，优化 Redirect
</docs>

<template>
  <div v-if="on" class="yk-auth_social" data-com="YkAuthSocial">
    <div class="yk-auth_social-label">社交账号登录</div>
    <div v-if="!isWeApp" class="yk-auth_social-items">
      <template v-for="item in social">
        <YuButton v-if="item.on" class="yk-auth_social-item" type="text" @click="fnTo(item.url)" :key="item.id">
          <YuIcon class="yk-auth_social-icon" :name="`yk-icon-social_${item.id}`" slot="icon" />
        </YuButton>
      </template>
    </div>
    <div v-else class="yk-auth_social-wechat">
      <YuButton class="yk-auth_social-wechat_btn" type="primary" size="large" @click="fnToWeApp()">微信登录</YuButton>
    </div>
    <div></div>
  </div>
</template>

<script>
export default {
  name: 'YkAuthSocial',
  data () {
    return {
      isWeApp: this.$env.isWeApp,
      social: [
        {
          id: 'weixin',
          name: '微信',
          on: window.$$shop.enable_weixin_login || false,
          url: window.$$shop.weixin_login_url || ''
        },
        {
          id: 'weibo',
          name: '微博',
          on: window.$$shop.enable_weibo_login || false,
          url: window.$$shop.weibo_login_url || ''
        },
        {
          id: 'qq',
          name: 'QQ',
          on: window.$$shop.enable_qq_login || false,
          url: window.$$shop.qq_login_url || ''
        },
        {
          id: 'netease',
          name: '网易通行证',
          on: window.$$shop.enable_netease_login || false,
          url: window.$$shop.netease_login_url || ''
        },
        {
          id: 'douban',
          name: '豆瓣',
          on: window.$$shop.enable_douban_login || false,
          url: window.$$shop.douban_login_url || ''
        },
        {
          id: 'renren',
          name: '人人',
          on: window.$$shop.enable_renren_login || false,
          url: window.$$shop.renren_login_url || ''
        },
        {
          id: 'facebook',
          name: 'Facebook',
          on: window.$$shop.enable_facebook_login || false,
          url: window.$$shop.facebook_login_url || ''
        }
      ]
    }
  },
  computed: {
    on () {
      let hasTrue = false
      for (const oItem of this.social) {
        if (oItem.on) {
          hasTrue = true
        }
      }
      return hasTrue
    }
  },
  methods: {
    fnToWeApp () {
      window.wx && window.wx.miniProgram.navigateTo({
        url: '/pages/login/index'
      })
    },
    fnTo (url) {
      if ((window.location.pathname || '').search(/^\/account$/) > -1) {
        this.$sdk.util.setCookie('redirect_back_url', '/account')
      }
      window.location.href = url || '#'
    }
  }
}
</script>

<style scoped>
.yk-auth_social {
  position: relative;
  border: 0 solid #d5d5d5;
  border-width: var(--1px) 0 0;
}
.yk-auth_social-label {
  position: relative;
  display: block;
  top: -.5em;
  margin: 0 auto;
  padding: 0 .7em;
  width: max-content;
  line-height: 1;
  text-align: center;
  color: #999;
  background-color: var(--backgroundColor);
}
.yk-auth_social-items {
  margin: 15px 0 0;
  text-align: center;
}
.yk-auth_social-item {
  color: #bbb;
  vertical-align: top;
}
.yk-auth_social-item + .yk-auth_social-item {
  margin: 0 0 10px 10px;
}
.yk-auth_social-item:active {
  color: #bbb;
  opacity: .7;
}
.yk-auth_social-icon {
  width: 36.5px;
  height: 36.5px;
}

.yk-auth_social-wechat_btn {
  margin: 15px 0 0;
  width: 100%;
  background-color: #1AAD19;
}
.yk-auth_social-wechat_btn:active {
  background-color: #179B16;
}
</style>
