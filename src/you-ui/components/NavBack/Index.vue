<docs>
## YuNavBack Docs
</docs>

<template>
  <div class="yu-nav_back" :class="`i-${position}`" data-com="YuNavBack">
    <YuButton class="yu-nav_back-btn" type="text" @click="fnBack">
      <YuIcon class="yu-nav_back-icon" name="t-icon-back" slot="icon" />
    </YuButton>
  </div>
</template>

<script>
export default {
  name: 'YuNavBack',
  props: {
    position: {
      type: String,
      default: 'top'
    }
  },
  data () {
    return {
      isBackHome: false
    }
  },
  beforeRouteLeave (to, from, next) {
    this.isBackHome = false

    next()
  },
  methods: {
    fnBack () {
      this.isBackHome = true

      this.$router.back()

      window.setTimeout(() => {
        if (this.isBackHome) {
          this.$router.push('/')
        }
      }, 100)
    }
  }
}
</script>

<style scoped>
  .yu-nav_back {
    position: fixed;
  }
  .yu-nav_back.i-top {
    top: calc(14px + var(--statusBar));
    left: 14px;
  }
  .yu-nav_back.i-bottom {
    bottom: calc(14px + var(--homeIndicator));
    left: 14px;
  }
  .yu-nav_back-btn {
    border-radius: 50%;
    background-color: rgba(0, 0, 0, .35);
    width: 40px;
    height: 40px;
    color: #fff;
    text-align: center;
  }
  .yu-nav_back-btn:active {
    color: #fff;
    opacity: .8;
  }
  .yu-nav_back-icon {
    width: 30px;
    height: 30px;
  }
</style>
