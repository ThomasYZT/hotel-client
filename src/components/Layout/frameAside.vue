<template>
  <div class="frame-aside">
    <div class="menu-list">
      <menuTree :expand="expand"></menuTree>
    </div>
  </div>
</template>

<script>
import menuTree from '../MenuTree';
export default {
  props: {
    expand: {
      type: Boolean,
      default: true
    }
  },
  components: {
    menuTree
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
.frame-aside {
  position: relative;
  height: 100%;
  width: 100%;
  background-color: $normalGreen;
  overflow: hidden;
  .menu-list {
    height: 100%;
    width: 100%;
    overflow-y: auto;
  }
}
</style>
