<docs>
## YuConfirm Docs

* 组件的 vm 不是在 $yk.vm 内的
  * 路由 和 $store 可能会有问题
  * 需要显式插入到 App
* 基于 Dialog
* Element Inner Loading 比去掉 Mask 的提示要更好
* this.$confirm 并修改参数 confirm(msg, title, oConfig)
* `v-html`写个通用安全过滤器
</docs>

<template>
  <transition name="yu-confirm-fade">
    <div v-show="on" class="yu-confirm" data-com="YuConfirm">
      <div v-if="on" class="yu-confirm-box">
        <div v-if="title" class="yu-confirm-title">{{ title }}</div>
        <div class="yu-confirm-msg" v-html="msg"></div>
        <div class="yu-confirm-btns">
          <YuButton type="primary" class="yu-confirm-btn_ok" @click="fnConfirm">确定</YuButton>
          <YuButton class="yu-confirm-btn_no" @click="fnCancel">取消</YuButton>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'YuConfirm',
  data () {
    return {
      on: false,
      type: '',
      title: '',
      msg: '',
      okText: '',
      noText: '',
      fnResolve: null,
      fnReject: null
    }
  },
  methods: {
    fn (oConfig) {
      const self = this
      this.on = true
      this.type = oConfig.type || ''
      this.title = oConfig.title || ''
      this.msg = (oConfig.msg || '').replace(/(script|style|link)/igm, '')
      return new Promise(function (resolve, reject) {
        self.fnResolve = () => {
          resolve && resolve()
        }
        self.fnReject = (oError) => {
          reject && reject(oError)
        }
      })
    },
    fnConfirm () {
      this.fnClose()
      this.fnResolve()
    },
    fnCancel () {
      this.fnClose()
      this.fnReject(new Error('取消'))
    },
    fnClose () {
      this.on = false
    }
  }
}
</script>

<style>
  .yu-confirm {
    z-index: 998;
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, .3);
    transition: .18s ease-out;
  }
  .yu-confirm.yu-confirm-fade-enter,
  .yu-confirm.yu-confirm-fade-leave-active {
    background: rgba(0, 0, 0, 0);
  }
  .yu-confirm:hover {
    will-change: transform;
  }
  .yu-confirm .yu-confirm-box {
    margin: auto;
    padding: 20px;
    width: min-content;
    border: 0 solid transform;
    border-radius: 5px;
    background-color: #fff;
    transform: translateY(-30%);
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, .3);
  }
  .yu-confirm-title {
    margin: 0 0 20px;
    font-size: 18px;
    font-weight: bold;
  }
  .yu-confirm-msg {
    margin: auto;
    min-width: 280px;
    font-size: 14px;
    line-height: 1.6em;
    text-align: left;
  }
  .yu-confirm-btns {
    display: flex;
    margin: 20px 0 0;
  }
  .yu-confirm-btn_ok,
  .yu-confirm-btn_no {
    flex: 1;
  }
</style>
