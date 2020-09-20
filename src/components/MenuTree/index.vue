<template>
  <div class="menu-tree">
    <Menu  width="100%"
           :accordion="false">
      <template v-for="(item) in treeData">
        <menu-com :menu-data="item" :key="item.name" ></menu-com>
      </template>
    </Menu>
  </div>
</template>

<script>
import menuCom from './menuCom';

export default {
  name: 'menuTree',
  components: {
    menuCom
  },
  data () {
    return {
      subMenuStatus: { name: '' },
      treeData: [
        {
          path: '/menuManager',
          menuName: '菜单管理',
          iconClass: 'asd',
          activePath: 'menuManager'
        },
        {
          path: '/agentManager',
          menuName: '代理商管理',
          iconClass: 'asd',
          activePath: 'agentManager'
        },
        {
          path: '/roleManager',
          menuName: '角色管理',
          iconClass: 'asd',
          activePath: 'roleManager'
        },
        {
          path: '/brandManager',
          menuName: '品牌管理',
          iconClass: 'asd',
          activePath: 'brandManager'
        },
        {
          path: '/hotelManager',
          menuName: '酒店管理',
          iconClass: 'asd',
          activePath: 'hotelManager'
        },

        {
          path: '/agreementManager',
          menuName: '协议客户管理',
          iconClass: 'asd',
          activePath: 'agreementManager'
        },
        {
          path: '/customerManager',
          menuName: '客户管理',
          iconClass: 'asd',
          activePath: 'customerManager'
        },
        {
          path: '/hotelblackListManager',
          menuName: '酒店黑名单管理',
          iconClass: 'asd',
          activePath: 'hotelblackListManager'
        },
        {
          path: '/hotelUserManager',
          menuName: '酒店用户管理',
          iconClass: 'asd',
          activePath: 'hotelUserManager'
        },
        {
          path: '/roomManager',
          menuName: '房间管理',
          iconClass: 'asd',
          activePath: 'roomManager'
        },
        {
          path: '/storageManager',
          menuName: '行李寄存管理',
          iconClass: 'asd',
          activePath: 'storageManager'
        },
        {
          path: '/vipManager',
          menuName: '会员管理',
          iconClass: 'asd',
          activePath: 'vipManager'
        }
      ]
    };
  },
  methods: {

  }
};
</script>

<style scoped lang="scss">

</style>
