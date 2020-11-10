<template>

  <iMenuItem v-if="!menuData.children ||
               menuData.children.length === 0 ||
               (menuData.children.length > 0 && menuData.children.filter(item => item.meta.isMenu).length === 0)"
             :to="menuData.path"
             :name="menuData.meta.activePath">
    <span class="item-label" v-show="expand">
      <i class="menu-icon iconfont" :class="menuData.meta.iconClass"></i>
      {{menuData.meta.menuName}}
    </span>
    <i-tooltip v-show="!expand"
               transfer
               :content="menuData.meta.menuName" placement="left">
      <i class="menu-icon iconfont" :class="menuData.meta.iconClass"></i>
    </i-tooltip>
  </iMenuItem>
  <div v-else>
    <Submenu v-show="expand" :name="menuData.meta.activePath">
      <template slot="title">
        <i class="menu-icon iconfont" :class="menuData.meta.iconClass"></i>
        {{menuData.meta.menuName}}
      </template>
      <menu-com v-for="item in menuData.children"
                :key="item.name"
                :menu-data="item"></menu-com>
    </Submenu>
    <i-poptip v-show="!expand"
              transfer
              padding="0"
              trigger="hover"
              placement="right">
      <iMenuItem :name="menuData.meta.activePath">
        <span class="item-label">
          <i class="menu-icon iconfont" :class="menuData.meta.iconClass"></i>
        </span>
      </iMenuItem>
      <template slot="content">
        <menu-com v-for="item in menuData.children"
                  :key="item.name"
                  :menu-data="item"></menu-com>
      </template>
    </i-poptip>
  </div>
</template>

<script>
export default {
  name: 'menuCom',
  props: {
    menuData: {
      type: Object,
      default () {
        return {};
      }
    },
    expand: {
      type: Boolean,
      default: true
    }
  },
  mounted () {

  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
.item-label {
  white-space: nowrap;
}
.menu-btn {
  width: 100%;
  height: 100%;
}

/deep/ .ivu-poptip {
  width: 100%;

  .ivu-poptip-rel {
    width: 100%;
  }

}

/deep/ .ivu-poptip-body {
  padding: 0 0 !important;
}

.ivu-poptip-body-content {
  .ivu-menu-item {
    padding: 14px 0 14px 10px;
    position: relative;
    cursor: pointer;
    z-index: 1;
    transition: all 0.2s ease-in-out;
    display: block;
    outline: none;
    list-style: none;
    font-size: 14px;
    font-weight: bold;
    text-align: left;

    &:hover {
      background-color: $lightGreen;
    }
  }
}
i.menu-icon {
  font-weight: bold;
}
</style>
