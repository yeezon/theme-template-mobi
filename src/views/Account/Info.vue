<docs>
## YkAccountInfo Docs
</docs>

<template>
  <div class="yk-account_info" data-com="YkAccountInfo" @click="fnClick">
    <div class="yk-account_info-avatar" :style="{ backgroundImage: `url(${account.avatar_url || ''})` }" />
    <div class="yk-account_info-cont">
      <div class="yk-account_info-name">{{ account.name || '登录/注册' }}</div>
      <div v-if="account.total_credit" class="yk-account_info-exp"><YuIcon name="yk-icon-gift" class="yk-account_info-exp_icon" /><span>经验值: {{ account.total_credit }} 分</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  componentName: 'YkAccountInfo',
  props: {
    account: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    fnClick (val) {
      this.$emit('click', val)
    }
  }
}
</script>

<style scoped>
  .yk-account_info {
    display: flex;
    padding: 15px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: background-color .6s ease-out;
    align-items: center;
  }
  .yk-account_info:active {
    transition: none;
    background-color: #e6e6e6;
  }
  .yk-account_info-avatar {
    margin: 1px;
    width: 70px;
    height: 70px;
    border: 3px solid #fff;
    border-radius: 50%;
    box-shadow: 0 0 0 1px #d5d5d5;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
  }
  .yk-account_info-cont {
    display: flex;
    flex-direction: column;
    margin: auto 10px;
    line-height: 1;
  }
  .yk-account_info-name {
    font-size: 16px;
  }
  .yk-account_info-exp {
    margin: 8px 0 0;
    font-size: 12px;
    line-height: 1;
    color: #777;
  }
  .yk-account_info-exp span {
    vertical-align: middle;
  }
  .yk-account_info-exp_icon {
    margin: 0 5px 2px 0;
    width: 14px;
    height: 14px;
    vertical-align: middle;
    color: #999;
  }
</style>
