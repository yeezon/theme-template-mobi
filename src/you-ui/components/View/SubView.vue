<template>
  <div class="yu-sub-view" data-com="YuSubView">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'YuSubView'
}
</script>

<style>
  .yu-sub-view {
    z-index: 999;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  /*.yu-sub-view {*/
    /* Transition 组件自动嗅探目标元素是否应用了 CSS 过渡或动画，如果是，在恰当的时机添加/删除 CSS 类名 */
/*    transition: .18s ease-out;
    top: 50%;
    left: auto;
    right: 0;
    bottom: auto;
    transform: translate3d(0, -50%, 0);
    backface-visibility: hidden;
  }

  .yu-sub-view-enter,
  .yu-sub-view-leave-active {
    transform: translate3d(100%, -50%, 0);
  }*/
</style>
