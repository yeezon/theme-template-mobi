<docs>
## YuNavBar Docs

* 用 Header 包含 NavBar
  * 悬浮功能
* 不能用 overflow hidden
  * YkSearchButton 要展示
</docs>

<template>
  <transition>
    <div class="yu-nav_bar" :class="{'i-left': (!$slots.default && !title && $slots.left)}" data-com="YuNavBar" @touchmove.prevent.stop>
      <div class="yu-nav_bar-items">
        <div class="yu-nav_bar-left">
          <slot name="left">
            <YuButton v-if="hasBack" class="yu-nav_bar-btn" @click="fnBack" type="text"><YuIcon class="yu-nav_bar-icon" name="yu-icon-left" slot="icon" /></YuButton>
          </slot>
        </div>
        <div class="yu-nav_bar-cont">
          <div class="yu-nav_bar-title"><slot>{{ title }}</slot></div>
        </div>
        <div class="yu-nav_bar-right">
          <slot name="right">
            <YuButton v-if="hasHome" class="yu-nav_bar-btn i-home" @click="fnHome"  type="text"><YuIcon class="yu-nav_bar-icon i-home" name="t-icon-home" slot="icon" /></YuButton>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'YuNavBar',
  props: {
    title: {
      type: String,
      default: ''
    },
    hasBack: {
      type: Boolean,
      default: true
    },
    hasHome: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    fnBack () {
      this.$emit('back')

      this.$router.back()
    },
    fnHome () {
      this.$router.push('/')
    }
  }
}
</script>

<style>
  .yu-nav_bar {
    background-color: #fff;
    border: 0 solid #d5d5d5;
    border-width: 0 0 var(--1px);
  }
  .yu-nav_bar-items {
    display: flex;
    position: relative;
    height: calc(var(--navBar) - var(--1px));
  }
  .yu-nav_bar-cont {
    flex: 1;
    margin: auto;
    text-align: center;
    height: 100%;
  }
  .yu-nav_bar-title {
    position: absolute;
    top: 50%;
    left: 50%;
    max-width: 60%;
    transform: translate(-50%, -50%);
    font-size: 16px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .yu-nav_bar-left,
  .yu-nav_bar-right {
    display: flex;
  }
  .yu-nav_bar-left > *,
  .yu-nav_bar-right > * {
    margin: auto;
  }

  .yu-nav_bar.i-left .yu-nav_bar-cont {
    display: none;
  }
  .yu-nav_bar.i-left .yu-nav_bar-left {
    flex: 1;
  }

  button.yu-nav_bar-btn {
    padding: 0 21px 0 14px;
    height: 100%;
    color: #9e9e9e;
  }
  button.yu-nav_bar-btn.i-home {
    padding: 0 14px 0 21px;
  }
  button.yu-nav_bar-btn:active {
    color: #9e9e9e;
    opacity: .7;
  }
  .yu-nav_bar-icon {
    width: 18px;
    height: 18px;
  }
  .yu-nav_bar-icon.i-home {
    width: 20px;
    height: 20px;
  }
</style>
