<template>
<div v-if="(marketing || {}).id && (endTime > nowTime)" class="discounts-limit">
  <div v-if="marketing.description" class="desc">{{ marketing.description }}</div>
  <div class="times">
    <template v-if="now">
      <span class="tip">距开抢还剩</span>
      <count-down class="time" key="1" @end="fnStart()" :end-time="marketing.start_at" :timeType="timeType"></count-down>
    </template>
    <template v-else>
      <span class="tip">距结束仅剩</span>
      <count-down v-if="marketing.start_at" class="time" key="2" @end="fnEnd()" :end-time="marketing.end_at" :timeType="timeType"></count-down>
      <span v-else class="time">0天0时0分0秒</span>
    </template>
  </div>
</div>
</template>

<script>
import CountDown from '@/components/CountDown'
import { timestampToTime } from '@/utils'

export default {
  name: 'DiscountsLimit',
  components: {
    CountDown
  },
  props: {
    marketing: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      endTime: '',
      nowTime: '',
      endTimeFrom: '',
      endTimeTo: '',
      timeType: 'entirety',
      isMob: false,
      now: false
    }
  },
  watch: {
    marketing () {
      this.update()
    }
  },
  created () {
    this.update()
  },
  methods: {
    update () {
      this.initMarketing()

      if (this.endTime < this.nowTime) {
        this.fnEnd()
      }
    },
    initMarketing () {
      const _oMarketing = this.marketing || {}

      this.nowTime = new Date().getTime()

      this.endTime = new Date(_oMarketing.end_at).getTime()

      this.start = timestampToTime(new Date(_oMarketing.start_at).getTime())
      this.end = timestampToTime(new Date(_oMarketing.end_at).getTime())

      if (new Date(_oMarketing.start_at).getTime() - this.nowTime > 0) {
        this.now = true
      }
    },
    fnStart () {
      this.now = false
    },
    fnEnd () {
      this.$emit('end')
    }
  }
}
</script>

<style scoped>
.discounts-limit {
  margin: 15px;
}
.desc {
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  color: #999;
}
.times {
  margin: 10px 0 0;
  text-align: center;
  font-size: 13px;
  color: #f55;
}
.tip {
  display: inline-block;
  margin: 0 8px 0 0;
}
.time {
  display: inline-block;
}
.time >>> .entirety {
  font-size: inherit;
}
</style>
