<docs>
## CartIcon Docs
</docs>

<template>
<span class="cart-icon" :class="{'i-on': nCount}">
  <svg-icon class="icon" :name="name"></svg-icon>
  <span class="count" v-show="nCount">{{ nCount }}</span>
</span>
</template>

<script>
export default {
  name: 'CartIcon',
  props: {
    name: {
      type: String,
      default: 'cart'
    }
  },
  computed: {
    isSigned () {
      return this.$store.state.account.isSigned
    },
    nCount () {
      return this.$store.state.cart.nCount || 0
    }
  },
  watch: {
    'isSigned' (val, oldVal) {
      this.getCartCount()
    }
  },
  created () {
    if (this.isSigned) {
      this.getCartCount()
    }
  },
  methods: {
    getCartCount () {
      if (window.location.pathname !== '/cart') {
        this.$store.dispatch('cart/getCartCount')
      }
    }
  }
}
</script>

<style scoped>
.cart-icon {
  display: inline-block;
  position: relative;
  text-align: center;
}
.icon {
  font-size: inherit;
  width: inherit;
  height: inherit;
  transition: transform .3s;
  transform: translateX(-5%);
}
.cart-icon.i-on .icon {
  transform: translateX(-10%);
}
.count {
  box-sizing: border-box;
  display: inline-block;
  position: absolute;
  top: 0;
  right: 0;
  padding: 0 5px;
  min-width: 18px;
  max-width: 30px;
  height: 18px;
  line-height: 16px;
  border: 1px solid #fff;
  border-radius: 9px;
  background-color: #df3311;
  color: #fff;
  font-size: 9px;
  font-weight: bold;
  transform: translate(30%, -30%);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
