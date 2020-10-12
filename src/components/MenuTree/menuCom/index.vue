<template>

  <iMenuItem v-if="!menuData.children || menuData.children.length === 0"
             :to="menuData.path"
             :name="menuData.activePath">
    <span class="item-label" v-if="expand">
      <i class="iconfont icon-xiaoxi"></i>
      {{menuData.menuName}}
    </span>
    <i-tooltip v-else
               transfer
               :content="menuData.menuName" placement="left">
      <i  class="iconfont icon-xiaoxi"></i>
    </i-tooltip>
  </iMenuItem>
  <Submenu v-else
           :name="menuData.activePath">
    <menu-com :menu-data="menuData.children"></menu-com>
  </Submenu>
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
.item-label {
  white-space: nowrap;
}
</style>
