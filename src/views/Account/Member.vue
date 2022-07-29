<docs>
## YkAccountMember Docs

### To-do List

* 优化显示，levels 放父级组件里，在父级点击进入的时候加载 levels 数据
* 父级提供 getLevels Event，刷新当前页的时候也正常显示

</docs>

<template>
  <div class="yk-account_member" data-com="YkAccountMember">
    <YuHeader :is-fixed="true">
      <YuNavBar title="会员等级" />
    </YuHeader>
    <div class="yk-account_member-cont">
      <div class="yk-account_member-title">会员等级：{{ oLevel.name }}</div>
      <div class="yk-account_member-desc">您的会员经验值为 {{ account.total_credit }}{{ isHighest ? '，已达到最高等级' : '' }}</div>
      <div class="yk-account_member-levels">
        <div v-for="(levels, index) in levelsMap" class="yk-account_member-row" :key="index">
          <div v-for="(level, index) in levels" class="yk-account_member-level" :key="index" :class="{'i-now': level.id === oLevel.id}">
            <div class="yk-account_member-bar" />
            <div class="yk-account_member-sign">
              <div class="yk-account_member-sign_icon" :style="{ backgroundImage: `url(${level.avatar_url})` }"></div>
              <div class="yk-account_member-sign_desc">{{ level.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  componentName: 'YkAccountMember',
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
      levels: [],
      levelsMap: []
    }
  },
  computed: {
    isHighest () {
      const _levels = this.levels
      const _lastLevel = _levels[_levels.length - 1]
      if (_lastLevel) {
        return _lastLevel.id === this.oLevel.id
      } else {
        return false
      }
    },
    oLevel () {
      return this.account.customer_level || {}
    }
  },
  created () {
    this.getLevels(err => {
      if (err) {
        this.$toast.info(err)
      } else {
        let _mark = -1
        for (let i = 0; i < this.levels.length; i++) {
          if ((i % 4) === 0) {
            _mark += 1
          }
          if (!Array.isArray(this.levelsMap[_mark])) {
            this.levelsMap[_mark] = []
          }
          this.levelsMap[_mark].push(this.levels[i])
        }
      }
    })
  },
  methods: {
    getLevels (cb) {
      this.$sdk.shop.get('customer_level', data => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            this.levels = data.res.customer_level || []
          } else {
            err = data.res.message || '网站用户全等级数据获取出错'
          }
        } else {
          err = '网站用户全等级数据请求异常'
        }
        cb && cb(err)
      })
    }
  }
}
</script>

<style scoped>
  .yk-account_member-cont {
    padding: 20px 15px;
    border: 0 solid #d5d5d5;
    border-width: 0 0 var(--1px);
    background-color: #fff;
    overflow: hidden;
  }
  .yk-account_member-title {
    margin: 0 0 15px;
    font-size: 16px;
    line-height: 1;
  }
  .yk-account_member-desc {
    line-height: 1;
    color: #777;
  }
  .yk-account_member-levels {
    margin: 30px 0;
  }
  .yk-account_member-row {
    position: relative;
    display: flex;
    margin: 0 11px 20px;
  }
  .yk-account_member-level {
    position: relative;
    width: 30%;
    height: 50px;
  }
  .yk-account_member-bar {
    position: absolute;
    top: 9px;
    right: 0;
    width: 100%;
    height: 5px;
    line-height: 0;
    font-size: 0;
    background-color: #d5d5d5;
  }
  .yk-account_member-level:first-child {
    width: 0;
  }
  .yk-account_member-level:first-child .yk-account_member-bar {
    display: none;
  }
  .yk-account_member-sign {
    z-index: 1;
    position: absolute;
    top: 0;
    right: 0;
    transform: translateX(50%)
  }
  .yk-account_member-sign_icon {
    width: 22px;
    height: 22px;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
  }
  .yk-account_member-sign_desc {
    position: absolute;
    top: 30px;
    left: 0;
    width: max-content;
    max-width: 4em;
  }
  .yk-account_member-level.i-now .yk-account_member-sign_desc {
    color: #4685ee;
  }
  .yk-account_member-level.i-now .yk-account_member-bar {
    background-color: #4685ee;
  }
</style>
