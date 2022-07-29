<docs>
## HomeView Docs
</docs>

<template>
<div class="home-view">
  <home-bar v-if="false"></home-bar>
  <page :handle="pageHandle" />
  <div class="footer_block"></div>
  <weapp-live-now></weapp-live-now>
</div>
</template>

<script>
import HomeBar from './components/Bar'

import Page from '@/components/Page'
import WeappLiveNow from '@/components/WeappLiveNow'

export default {
  name: 'HomeView',
  components: {
    HomeBar,
    Page,
    WeappLiveNow
  },
  data () {
    return {
      pageHandle: ''
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.pageHandle = (window.$$settings || {}).index_welcome_page_block || 'welcome'
    }
  }
}
</script>

<style scoped>
.home-view {
  background-color: var(--backgroundColor);
}
.footer_block {
  height: calc(var(--tabBar) + var(--homeIndicator));
  background-color: var(--backgroundColor);
}
</style>
