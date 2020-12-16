<template>
  <transition name="fade">
    <div v-if="visible" class="page-board">
      <i class="iconfont icon-close" @click="close"></i>
      <div class="board-content">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'PageBoard',
  model: {
    prop: 'visible',
    event: 'change'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {};
  },
  methods: {
    close () {
      this.$emit('change', false);
      this.$emit('close');
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
.page-board {
  @include absolute_pos(absolute, 0, 0, 0, 0);
  z-index: 100;
  padding: 30px 20px 0 20px;
  background-color: $color_fff;
  transition: all .3s linear;

  .icon-close {
    position: absolute;
    right: 20px;
    top: 0;
    font-size: 20px;
    cursor: pointer;
  }

  .board-content {
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }
}
</style>
