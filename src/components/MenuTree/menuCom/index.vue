<template>

  <iMenuItem v-if="!menuData.children ||
               menuData.children.length === 0 ||
               (menuData.children.length > 0 && menuData.children.filter(item => item.meta.isMenu).length === 0)"
             :to="menuData.path"
             :name="menuData.meta.activePath">
    <span class="item-label" v-if="expand">
      <i class="iconfont icon-xiaoxi"></i>
      {{menuData.meta.menuName}}
    </span>
    <i-tooltip v-else
               transfer
               :content="menuData.meta.menuName" placement="left">
      <i  class="iconfont icon-xiaoxi"></i>
    </i-tooltip>
  </iMenuItem>
  <div v-else>
    <Submenu v-if="expand" :name="menuData.meta.activePath">
      <template slot="title">
        <i  class="iconfont icon-xiaoxi"></i>
        {{menuData.meta.menuName}}
      </template>
      <menu-com v-for="item in menuData.children"
                :key="item.name"
                :menu-data="item"></menu-com>
    </Submenu>
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
.item-label {
  white-space: nowrap;
}
</style>
