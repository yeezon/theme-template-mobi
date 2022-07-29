<docs>
## YuLoadTips Docs
</docs>

<template>
<div v-if="isLoading || isEmpty || isError" class="yu-load_tips" data-com="YuLoadTips">
  <YuLoading v-if="isLoading" :is-loading="isLoading" class="yu-load_tips-load" :icon="loadIcon" :text="loadText" />
  <template v-else>
    <div v-if="isEmpty && !isError" class="yu-load_tips-empty">
      <slot name="empty_icon">
        <YuIcon v-if="emptyIcon" class="yu-load_tips-empty_icon" :name="emptyIcon" />
      </slot>
      <div v-if="emptyText" class="yu-load_tips-empty_text">{{ emptyText }}</div>
      <slot name="empty_ext" />
    </div>
    <div v-else-if="isError" class="yu-load_tips-err">
      <slot name="err_icon">
        <YuIcon v-if="errorIcon" class="yu-load_tips-err_icon" :name="errorIcon" />
      </slot>
      <div v-if="errorText" class="yu-load_tips-err_text">{{ errorText }}</div>
      <slot name="err_ext">
        <YuButton v-if="retryText" class="yu-load_tips-err_btn" type="warning" @click="fnRetry" size="small">{{ retryText }}</YuButton>
      </slot>
    </div>
  </template>
</div>
</template>

<script>
export default {
  name: 'YuLoadTips',
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    loadIcon: {
      type: String,
      default: 'yu-icon-loading'
    },
    loadText: {
      type: String,
      default: '加载中...'
    },
    isEmpty: {
      type: Boolean,
      default: false
    },
    emptyIcon: {
      type: String,
      default: 'yu-icon-empty_icon'
    },
    emptyText: {
      type: String,
      default: '暂无内容'
    },
    isError: {
      type: Boolean,
      default: false
    },
    errorIcon: {
      type: String,
      default: 'yu-icon-err_tips'
    },
    errorText: {
      type: String,
      default: '出现异常了~'
    },
    retryText: {
      type: String,
      default: '重试'
    }
  },
  methods: {
    fnRetry () {
      this.$emit('retry', true)
    }
  }
}
</script>

<style>
.yu-load_tips {
  display: flex;
  margin: 0 auto;
  padding: 25% 0 0;
  width: 100%;
  text-align: center;
}
.yu-load_tips-load,
.yu-load_tips-empty,
.yu-load_tips-err {
  margin: auto;
  color: #9e9e9e;
  font-size: 14px;
}
.yu-load_tips-empty_icon,
.yu-load_tips-err_icon {
  margin: 0 0 15px;
  width: 72px;
  height: 72px;
}
.yu-load_tips-err_btn {
  margin: 15px 0 0;
  padding: 7px 12px;
}
</style>
