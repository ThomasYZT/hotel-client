<template>
  <div class="main-frame">
    <!-- header -->
    <frameHeader v-if="header" :tool="showTool"></frameHeader>

    <div class="frame-content" :class="{ 'no-header' : !header }">
      <!-- aside -->
      <frameAside v-if="aside" :class="{ 'is-rollup': !isMenuExpend }" :expand="isMenuExpend"></frameAside>

      <div class="router-com"
           :class="{ 'no-bread': $route.meta.noBread === true }"
           v-if="routerCom">
        <div v-if="$route.meta.noBread !== true" class="bread-wrapper">
          <breadcrumb></breadcrumb>
        </div>
        <!-- main -->
        <frameMain>
          <slot name="router"></slot>
          <transition name="fade"> <Loading v-if="loading" /> </transition>
        </frameMain>
      </div>

      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
import frameHeader from './frameHeader';
import frameMain from './frameMain';
import frameAside from './frameAside';
import Loading from '../Loading';
import { mapGetters } from 'vuex';

export default {
  props: {
    header: {
      type: Boolean,
      default: true
    },
    aside: {
      type: Boolean,
      default: true
    },
    routerCom: {
      type: Boolean,
      default: true
    },
    showTool: {
      type: Boolean,
      default: true
    }
  },
  components: {
    frameHeader,
    frameMain,
    frameAside,
    Loading
  },
  computed: {
    ...mapGetters([
      'loading',
      'isMenuExpend'
    ])
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
.main-frame {
  position: relative;
  height: 100%;
  width: 100%;
  .frame-content {
    @include flex_layout(row, center, flex-start);
    position: relative;
    height: calc(100% - 30px);
    width: 100%;

    &.no-header {
      height: 100%;
    }

    .frame-aside {
      @include flex_set(0, 1, 196px);
      height: 100%;
      transition: all 0.3s;

      &.is-rollup {
        flex-basis: 50px !important;
        padding: 0;
      }
    }

    .router-com {
      position: relative;
      flex: 1 0 calc(100% - 196px);
      height: 100%;
      overflow-y: auto;

      .bread-wrapper {
        @include flex_layout(row, flex-start, center);
        padding: 0 10px;
        height: 40px;
        width: 100%;
      }

      &.no-bread {
        /deep/ .frame-main {
          height: 100%;
        }
      }

      /deep/ .frame-main {
        height: calc(100% - 40px);
      }
    }
  }

}
</style>
