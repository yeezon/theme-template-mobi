<docs>
## TabBar Docs

* Vue Router BUG ?
  * 落地访问，`fnCheck`触发了两次，每次的`$route.path`都不同
</docs>

<template>
<div class="tab-bar" v-show="isShow">
  <div class="box">
    <div class="items">
      <router-link class="item" :class="{'i-active': path === '/'}" to="/">
        <svg-icon class="icon" name="home"></svg-icon>
        <svg-icon class="icon i-active" name="home_2"></svg-icon>
        <span class="name">推荐</span>
      </router-link>
      <router-link class="item" :class="{'i-active': path === '/find'}" to="/find">
        <svg-icon class="icon" name="find"></svg-icon>
        <svg-icon class="icon i-active" name="find_2"></svg-icon>
        <span class="name">发现</span>
      </router-link>
      <router-link class="item" :class="{'i-active': path === '/cart'}" to="/cart">
        <cart-icon class="icon i-cart" :name="path === '/cart' ? 'cart_2' : 'cart'"></cart-icon>
        <span class="name">购物车</span>
      </router-link>
      <router-link class="item" :class="{'i-active': path === '/account'}" to="/account">
        <svg-icon class="icon" name="account"></svg-icon>
        <svg-icon class="icon i-active" name="account_2"></svg-icon>
        <span class="name">我的</span>
      </router-link>
    </div>
    <yu-home-indicator></yu-home-indicator>
  </div>
</div>
</template>

<script>
import CartIcon from '@/components/Cart/Icon'

export default {
  name: 'TabBar',
  components: {
    CartIcon
  },
  data () {
    return {
      path: '',
      isShow: false
    }
  },
  computed: {
    isSigned () {
      return this.$store.state.account.isSigned
    }
  },
  watch: {
    $route () {
      // Router 初始化会触发一次
      this.fnCheck()
    }
  },
  methods: {
    fnCheck () {
      const _isShow = this.$route.path.search(/^(\/|\/cart|\/account[/]*|\/find)$/) > -1
      this.isShow = _isShow
      this.path = this.$route.path || ''

      // 避免浪费请求
      if (_isShow && this.isSigned) {
        this.getCartCount()
      }
    },
    getCartCount () {
      if (window.location.pathname !== '/cart') {
        this.$store.dispatch('cart/getCartCount')
      }
    }
  }
}
</script>

<style scoped>
.box {
  position: fixed;
  z-index: 1;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: var(--backgroundColor);
}
.items {
  box-sizing: border-box;
  display: flex;
  height: calc(var(--tabBar) - var(--1px));
  border-top: var(--1px) solid var(--borderColor);
}
.item {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
  color: var(--color);
  background-color: transparent;
  align-items: center;
  border: 0;
}
.item:active {
  /*color: #ef433e;*/
}
.item.i-active {
  color: #ef433e;
}
.item .icon.i-active {
  display: none;
}
.item.i-active .icon {
  display: none;
}
.item.i-active .icon.i-active {
  display: inline-block;
}
.item .icon.i-cart {
  display: inline-block;
}
.item.i-active .icon.i-cart {
  color: #ef433e;
}
.icon {
  margin: auto auto 2px;
  width: 23px;
  height: 23px;
}
.name {
  margin: 0 auto 6px;
  line-height: 1;
  font-size: 10px;
}
</style>
