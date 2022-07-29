<docs>
## YuSlides Docs

* 直接操作 DOM，提升拖拽响应体验
* 用于 App Store 效果
  * `yu-slides-box` 居中
  * `width: 90%`

* 无需 Loop 时，部分浏览器利用 Scroll Snap Points
  * Safari 9 开始支持
* PC 端连续点击下一张到边缘项时会卡住
* Mac Chrome 边缘项 Fix 会闪烁
</docs>

<template>
<div class="yu-slides" data-com="YuSlides">
  <div class="yu-slides-box" ref="box" :style="{paddingBottom: height}" @touchstart.passive="fnTouchStart" @touchmove="fnTouchMove" @touchend.passive="fnTouchEnd" @touchcancel.passive="fnTouchCancel">
    <div class="yu-slides-items" ref="items">
      <slot name="item" />
    </div>
  </div>
  <div v-if="(nSum > 1) && hasNav" class="yu-slides-prev" @click="fnPrev">
    <slot name="prev_icon">
      <YuIcon class="yu-slides-prev_icon" name="yu-icon-left" />
    </slot>
  </div>
  <div v-if="(nSum > 1) && hasNav" class="yu-slides-next" @click="fnNext">
    <slot name="next_icon">
      <YuIcon class="yu-slides-next_icon" name="yu-icon-right" />
    </slot>
  </div>
  <div v-if="(nSum > 1) && hasPager" class="yu-slides-pager">
    <div v-for="nRank in nSum" :key="nRank" class="yu-slides-pager_item" :class="{'i-on': nNow === nRank}" @click="fnGo(nRank)">
      <slot name="pager_icon">
        <div class="yu-slides-pager_icon"><span>{{ nRank }}</span></div>
      </slot>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'YuSlides',
  props: {
    height: {
      type: String,
      default: '100%' // % / px / vh
    },
    hasNav: {
      type: Boolean,
      default: false
    },
    hasPager: {
      type: Boolean,
      default: true
    },
    autoplay: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      hasCheck: false,
      canRun: false,
      isRun: false,
      nNow: 1,
      nSum: (this.$slots.item || []).length,
      nWidth: 0,
      nStartX: 0,
      nStartY: 0,
      nEndX: 0,
      nEndY: 0,
      nStartTimeStamp: 0,
      nTimeoutID: null,
      nAutoTick: null
    }
  },
  mounted () {
    const eItems = this.$refs.items

    if (eItems.childElementCount > 1) {
      this.nWidth = eItems.clientWidth
      // 注意先按当前子元素顺序先克隆
      const e1 = eItems.firstElementChild.cloneNode(true)
      const e2 = eItems.lastElementChild.cloneNode(true)
      eItems.insertBefore(e2, eItems.firstElementChild)
      eItems.insertBefore(e1, null)

      if (this.autoplay) {
        this.setAutoTick()
        window.setInterval(() => {
          const _nAutoTick = this.nAutoTick
          if (_nAutoTick > 0) {
            this.nAutoTick -= 1
          } else if (_nAutoTick === 0) {
            this.fnNext()
          }
        }, 1000)
      }
    }
  },
  methods: {
    fnPrev () {
      if (this.nNow < 1) {
        this.fnGo(0)
      } else {
        this.fnGo(this.nNow - 1)
      }
    },
    fnNext () {
      if (this.nNow > this.nSum) {
        this.fnGo(this.nSum + 1)
      } else {
        this.fnGo(this.nNow + 1)
      }
    },
    fnGo (nRank) {
      this.fnRun(nRank)
    },
    fnRun (nRank) {
      this.isRun = true
      this.nAutoTick = null

      this.$refs.items.style.transitionDuration = '.3s'

      if (nRank < 0) {
        this.setOffsetX((nRank * this.nWidth) || 0)
      } else {
        this.setOffsetX(-((nRank - 1) * this.nWidth) || 0)
      }

      // 不能在 setTimeout 里，防止快速左右切换出现跳图
      // 这样也支持范围内快速切换
      this.nNow = nRank

      window.clearTimeout(this.nTimeoutID)
      this.nTimeoutID = window.setTimeout(() => {
        this.fnFix()
        this.nTimeoutID = null
        this.isRun = false
        this.setAutoTick()
      }, 300)
    },
    fnAuto (evt) {
      const nMoveX = this.nEndX - this.nStartX

      // 快速滑动直接切换
      const nTime = evt.timeStamp - this.nStartTimeStamp

      const nAbsMoveX = Math.abs(nMoveX)

      if (nTime > 200) {
        if (nAbsMoveX > (this.nWidth / 2)) {
          if (nMoveX > 0) {
            this.fnPrev()
          } else {
            this.fnNext()
          }
        } else {
          this.fnGo(this.nNow)
        }
      } else if (nAbsMoveX > 5) {
        if (nMoveX > 0) {
          this.fnPrev()
        } else {
          this.fnNext()
        }
      } else {
        this.fnGo(this.nNow)
      }
    },
    fnFix () {
      const nRank = this.nNow
      // 放慢速度，可以发现边缘被拦截停止的 BUG，此处计算是修复
      const nX = this.getRectX()
      this.$refs.items.style.transitionDuration = '0s'
      if (nRank < 1) {
        this.nNow = this.nSum
        this.setOffsetX(-(((this.nSum - 1) * this.nWidth) + (this.nWidth - nX)) || 0)
      } else if (nRank > this.nSum) {
        this.nNow = 1
        this.setOffsetX((this.nSum * this.nWidth) + nX)
      }
    },
    setAutoTick () {
      if (this.autoplay) {
        this.nAutoTick = Math.ceil(this.autoplay / 1000) || null
      }
    },
    getRectX () {
      // 借助 getBoundingClientRect() 拿 transform 处理后元素的位置，offsetLeft 不行
      const nBoxLeft = this.$refs.box.getBoundingClientRect().left
      const nItemsLeft = this.$refs.items.getBoundingClientRect().left
      return (nItemsLeft - nBoxLeft) || 0
    },
    getOffsetX () {
      return window.parseInt(this.$refs.items.style.transform.replace(/(translateX\(|px\))/ig, '')) || 0
    },
    setOffsetX (nOffsetX) {
      this.$refs.items.style.transform = `translateX(${nOffsetX}px)`
    },
    fnMoveX (nMoveX) {
      this.setOffsetX(this.getOffsetX() + nMoveX)
    },
    fnTouchStart (evt) {
      if (this.nSum < 2) return

      this.hasCheck = false
      this.canRun = false
      this.nAutoTick = null
      this.nStartX = evt.changedTouches[0].pageX || 0
      this.nStartY = evt.changedTouches[0].pageY || 0
      this.nEndX = this.nStartX
      this.nEndY = this.nStartY
      this.$refs.items.style.transitionDuration = '0s'

      // 快速滑动直接切换使用
      this.nStartTimeStamp = evt.timeStamp || 0
    },
    fnTouchMove (evt) {
      if (this.nSum < 2) return

      const nNewX = evt.changedTouches[0].pageX
      const nNewY = evt.changedTouches[0].pageY

      if (this.hasCheck) {
        if (this.canRun) {
          // 需要 preventDefault，不然可以「上下同时左右」滑动
          evt.preventDefault()
          this.fnMoveX(nNewX - this.nEndX)
          this.nEndX = nNewX
          this.nEndY = nNewY
        }
      } else {
        // 第一次判断极坐标，不然可以「左右同时上下」滑动
        const nNowMoveX = Math.abs(nNewX - this.nStartX) || 0
        const nNowMoveY = Math.abs(nNewY - this.nStartY) || 0

        if (nNowMoveX > nNowMoveY) {
          this.canRun = true

          if (this.isRun) {
            window.clearTimeout(this.nTimeoutID)
            this.nTimeoutID = null
            this.isRun = false
            if (this.nNow < 1 || this.nNow > this.nSum) {
              // 非常重要，这里和 setTimeout 里都要放
              this.fnFix()
            } else {
              this.setOffsetX(this.getRectX())
            }
          }
        }

        this.hasCheck = true
      }
    },
    fnTouchEnd (evt) {
      if (this.nSum < 2) return

      this.hasCheck = false
      this.canRun = false
      this.fnAuto(evt)
    },
    fnTouchCancel (evt) {
      this.fnTouchEnd()
    }
  }
}
</script>

<style>
  .yu-slides {
    position: relative;
    -webkit-tap-highlight-color: transparent;
  }
  .yu-slides-box {
    position: relative;
    margin: auto;
    width: 100%;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
    height: 0;
  }
  .yu-slides-items {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: visible;
    will-change: transform;
    transition-property: transform;
    transition-duration: 0s;
    transition-timing-function: ease;
    transition-delay: 0s;
  }
  .yu-slides-items > * {
    box-sizing: border-box;
    position: relative;
    display: block;
    margin: 0;
    padding: 0;
    flex-shrink: 0; /* 重点，不然 width 100% 无效，只能用 min-width 100%*/
    width: 100%;
    height: 100%;
    font-size: 1rem;
    line-height: 1;
    object-fit: contain;
  }
  .yu-slides-items > *:first-child {
    /* 无需初始化，显示真正第一张图 */
    margin: 0 0 0 -100%;
  }
  .yu-slides-items > *:last-child {
    /* 无需初始化，显示真正第一张图 */
    margin: 0;
  }
  .yu-slides-prev,
  .yu-slides-next {
    position: absolute;
    left: 0;
    right: auto;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }
  .yu-slides-next {
    left: auto;
    right: 0;
  }
  .yu-slides-prev_icon,
  .yu-slides-next_icon {
    margin: 0;
    padding: 10px;
    width: 26px;
    height: 26px;
    color: #000;
    opacity: .35;
  }
  .yu-slides-pager {
    position: absolute;
    bottom: 15px;
    width: 100%;
    font-size: 0;
    line-height: 0;
    text-align: center;
  }
  .yu-slides-pager_item {
    display: inline-block;
    margin: auto 6px;
    cursor: pointer;
  }
  .yu-slides-pager_icon {
    background-color: #000;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    opacity: .25;
  }
  .yu-slides-pager_item.i-on .yu-slides-pager_icon {
    opacity: .5;
  }
</style>
