<template>
  <div class="menu-tree" :class="{ 'is-rollup': !expand }">
    <Menu  ref="menu"
           width="100%"
           :open-names="openNames"
           :active-name="activePath"
           :accordion="true">
      <div class="trigger-tool"
           :class="{ 'is-rollup': !expand }"
           @click="menuTrigger">
        <div v-if="expand" class="title">uu智慧酒店</div>
        <div class="trigger-icon"><i class="iconfont" :class="expand ? 'icon-daohangshouqi-' : 'icon-daohangzhankai-'"></i></div>
      </div>
      <template v-for="(item) in treeData">
        <menu-com :expand="expand" :menu-data="item" :key="item.name" ></menu-com>
      </template>
    </Menu>
  </div>
</template>

<script>
import menuCom from './menuCom';
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'menuTree',
  props: {
    expand: {
      type: Boolean,
      default: true
    }
  },
  components: {
    menuCom
  },
  computed: {
    ...mapGetters([
      'routeInfo'
    ]),
    activePath () {
      return this.$route.meta ? this.$route.meta.activePath : '';
    },
    openNames () {
      const _arr = Array.from(
        new Set(this.$route.matched.map(item => item.meta.activePath))
      );
      const isClose = _arr.some(item => !item);
      return isClose ? [] : _arr;
    },
    treeData () {
      return this.routeInfo || [];
    }
  },
  data () {
    return {
      subMenuStatus: { name: '' }
    };
  },
  methods: {
    ...mapActions([
      'setMenuExpandStatus'
    ]),
    menuTrigger () {
      this.setMenuExpandStatus(!this.expand);
    }
  },
  watch: {
    openNames: {
      handler () {
        this.$nextTick(() => {
          this.$refs.menu.updateOpened();
        });
      },
      deep: true
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
.menu-tree {
  width: 100%;
  overflow-x: hidden;
  transition: all 0.3s;
  .trigger-tool {
    @include flex_layout(row, flex-start, center);
    padding: 5px 24px;
    width: 196px;
    height: 45px;
    text-align: left;
    background-color: $normalGreen;
    cursor: pointer;
    transition: all .3s;

    &.is-rollup {
      padding: 0 5px;
      width: 50px;
      text-align: center;

      .trigger-icon {
        @include flex_set(1 ,0, auto);
      }
    }

    .title {
      @include flex_layout(row, flex-start, center);
      @include flex_set(1, 0, auto);
      font-size: 20px;
      font-weight: bold;
    }

    .trigger-icon {
      @include flex_layout(row, center, center);
      @include flex_set(0 ,1, auto);
      .icon-daohangshouqi-, .icon-daohangzhankai- {
        line-height: 45px;
        font-size: 20px;
        color: $color_fff;
      }
    }
  }

  &.is-rollup {
    /deep/ .ivu-menu-item {
      padding-left: 0;
      padding-right: 0;
      text-align: center;
    }
  }
}

</style>
