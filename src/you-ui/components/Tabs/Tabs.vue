<docs>
## YuTabs Docs
</docs>

<template>
  <div class="yu-tabs" data-com="YuTabs">
    <div class="yu-tabs-nav">
      <button
        :class="[
          'yu-tabs-tab',
          {
            'i-active': nowTab === tab.name
          }
        ]"
        v-for="(tab, index) in tabs"
        :key="index"
        :name="tab.name"
        @click="onTab(tab.name)"
      >{{ tab.label }}</button>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'YuTabs',
  data () {
    return {
      tabs: [],
      nowTab: null
    }
  },
  mounted () {
    const subs = this.$slots.default

    for (const sub of subs) {
      const vm = sub.componentInstance
      if (vm && vm.name) {
        this.tabs.push({
          name: vm.name,
          label: vm.label,
          vm: vm
        })
        if (this.tabs.length > 0) {
          this.nowTab = this.tabs[0].name
          this.tabs[0].vm.active = true
        }
      }
    }
  },
  methods: {
    onTab (tabName) {
      this.nowTab = tabName
      for (const tab of this.tabs) {
        tab.vm.active = (tab.name === tabName)
      }
    }
  }
}
</script>

<style>
  .yu-tabs .yu-tabs-nav {
    display: flex;
    width: stretch;
    background-color: #fff;
    border: 0 solid #d5d5d5;
    border-width: 0 0 .5px;
  }
  .yu-tabs .yu-tabs-tab {
    display: block;
    margin: auto auto -.5px;
    padding: 0 0 2px;
    outline: none;
    border: 0 solid currentColor;
    background: none;
    line-height: 36px;
    -webkit-tap-highlight-color: transparent;
  }
  .yu-tabs .yu-tabs-tab.i-active {
    padding: 0;
    color: #48e;
    border-width: 0 0 2px
  }
</style>
