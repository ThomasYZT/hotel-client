<template>
  <div class="menu-tree">
    <Menu  width="100%"
           :active-name="activePath"
           :accordion="false">
      <template v-for="(item) in treeData">
        <menu-com :menu-data="item" :key="item.name" ></menu-com>
      </template>
    </Menu>
  </div>
</template>

<script>
import menuCom from './menuCom';
import { mapGetters } from 'vuex';
export default {
  name: 'menuTree',
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
    treeData () {
      return this.routeInfo
        ? this.routeInfo.map(menu => {
          return {
            path: menu.path,
            ...menu.meta
          };
        })
        : [];
    }
  },
  data () {
    return {
      subMenuStatus: { name: '' }
    };
  },
  methods: {

  }
};
</script>

<style scoped lang="scss">

</style>
