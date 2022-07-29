<template>
<div class="sk-product_info-limit-bar" v-if="info.start_at">
  <span class="s-h" v-if="isStarted">折扣中</span>
  <span class="s-tips" v-if="isStarted">距离结束</span>
  <span class="s-tips" v-else>低至<span class="s-event_price"><span class="s-small_y"></span><yu-currency :val="price"></yu-currency></span>距优惠开抢</span>
  <count-down class="s-down" @start="fnStart" @end="fnEnd" :start-time="info.start_at" :end-time="info.end_at" time-type="entirety"></count-down>
  <div class="s-fr" v-if="moreURL">
    <span class="s-kill">
      <router-link class="more" :to="moreURL"><svg-icon class="icon" name="right_circle"></svg-icon></router-link>
    </span>
  </div>
</div>
</template>

<script>
import CountDown from '@/components/CountDown'

export default {
  props: {
    info: {
      type: Object,
      default () {
        return {}
      }
    },
    price: {
      type: Number
    }
  },
  data () {
    return {
      isStarted: false
    }
  },
  computed: {
    moreURL () {
      const _oInfo = this.info || {}

      let _url = ''

      if (_oInfo.handle) {
        _url = `/discounts/${_oInfo.handle}`
      }

      return _url
    }
  },
  methods: {
    fnStart () {
      this.isStarted = true

      this.$emit('start')
    },
    fnEnd () {
      this.isStarted = false
      this.$emit('end')
    }
  },
  components: {
    CountDown
  }
}
</script>

<style scoped>
.sk-product_info-limit-bar {
  background: #f55;
  height: 40px;
  color: #fff;
  display: flex;
  align-items: center;
}
.s-h {
  font-size: 18px;
  margin: 0 0 0 12px;
  font-weight: bold;
  line-height: 1em;
}
.s-tips {
  margin: 0 10px;
  font-size: 12px;
}
.s-down.sk-count_down{

}
.s-down.sk-count_down >>> .s-entirety{
  /* display: block */
}
.s-tips .s-event_price{
  margin: 0 5px;
}
.s-fr {
  margin-left: auto;
}
.s-fr .s-kill {
  margin-right: 10px;
  color: #fff;
  font-size: 13px;
  display: block;
}
.more {
  color: #fff;
}
.icon {
  display: inline-block;
  margin: 0 0 0 3px;
  font-size: 15px;
  vertical-align: middle;
}
</style>
