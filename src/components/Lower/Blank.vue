<docs>
## LowerBlank Docs
</docs>

<template>
<div class="lower-blank"></div>
</template>

<script>
export default {
  name: 'LowerBlank',
  data () {
    return {
      io: null
    }
  },
  mounted () {
    this.init()
  },
  beforeDestroy () {
    this.io && this.io.unobserve(this.$el) // Root 默认`window.document.documentElement`，避免影响性能
  },
  methods: {
    init () {
      if (window.IntersectionObserver) {
        const _io = new IntersectionObserver(entries => {
          entries.forEach(oEntrie => {
            if (oEntrie.intersectionRatio > 0) {
              this.$emit('lower')
            }
          })
        })

        _io.observe(this.$el)

        this.io = _io
      }
    }
  }
}
</script>

<style scoped></style>
