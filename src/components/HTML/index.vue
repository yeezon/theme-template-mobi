<docs>
## YkHTML Docs

* 运行 JS 脚本
</docs>

<template>
  <div class="yk-html" data-com="YkHTML" @click="fnClickProxy">
    <div ref="cont"></div>
  </div>
</template>

<script>
import ElementQueries from 'css-element-queries/src/ElementQueries'
import jq from 'jquery'

export default {
  componentName: 'YkHTML',
  props: {
    cont: {
      type: String,
      default: ''
    }
  },
  beforeCreate () {
    ElementQueries.listen()
  },
  mounted () {
    this.setCont()
  },
  methods: {
    fnClickProxy (evt) {
      const eNow = evt.target
      const eA = eNow.closest('a') // eNow 自身也参与筛选

      if (eA && !eA.querySelector('.yk-html')) {
        evt.preventDefault()
        evt.stopPropagation()

        const _link = (eA.href || '').replace(window.location.origin, '')

        if (_link && _link.indexOf('javascript:') < 0) {
          if (/^http/.test(_link)) {
            window.location.href = _link
          } else {
            this.$router.push(_link)
          }
        }
      }
    },
    setCont () {
      // 暂时先用 jQ
      const _eDOM = window.document.createElement('div')

      jq(_eDOM).html(this.cont)
      jq(this.$refs.cont).replaceWith(_eDOM.querySelector('.youpage-cont'))

      ElementQueries.init()
    }
  }
}
</script>

<style scoped>
.yk-html {
  -webkit-tap-highlight-color: transparent;
}
</style>

<style>
.youpage-cont .youpage-layout {
  box-sizing: border-box;
}

.youpage-cont .youpage-layout_2:after {
  content: '\20';
  display: table;
  width: 0;
  height: 0;
  line-height: 0;
  clear: both;
  overflow: hidden;
}

.youpage-cont .youpage-layout_2 > .youpage-layout_1 {
  width: 50%;
  display: block;
  box-sizing: border-box;
  overflow: hidden;
  float: left;
}

.youpage-cont .youpage-layout_2[max-width~="768px"] > .youpage-layout_1 {
  width: auto;
  float: none;
}

@media screen and (max-width: 768px) {
  .youpage-cont .youpage-layout_2 > .youpage-layout_1 {
    width: auto;
    float: none;
  }
}
</style>
