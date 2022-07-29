<docs>
## YuStatusTips Docs
</docs>

<template>
<div class="yu-status_tips" data-com="YuStatusTips">
  <div class="yu-status_tips-cont">
    <slot name="icon">
      <YuIcon v-if="icon" class="yu-status_tips-icon" :name="icon" />
    </slot>
    <div v-if="cont" class="yu-status_tips-text">{{ cont }}</div>
    <slot name="ext">
      <YuButton v-if="button" class="yu-status_tips-btn" type="primary" @click="fnAction">{{ button }}</YuButton>
    </slot>
  </div>
</div>
</template>

<script>
export default {
  name: 'YuStatusTips',
  props: {
    icon: {
      type: String,
      default: ''
    },
    cont: {
      type: String,
      default: ''
    },
    button: {
      type: String,
      default: ''
    }
  },
  methods: {
    fnAction () {
      this.$emit('action', true)
    }
  }
}
</script>

<style>
.yu-status_tips {
  display: flex;
  margin: 0 auto;
  padding: 25% 0 0;
  width: 100%;
  text-align: center;
  align-items: center;
  justify-content: center;
}
.yu-status_tips-cont {
  color: #9e9e9e;
  font-size: 14px;
}
.yu-status_tips-icon {
  margin: 0 0 20px;
  width: 72px;
  height: 72px;
}
.yu-status_tips-btn {
  margin: 20px 0 0;
}
</style>
