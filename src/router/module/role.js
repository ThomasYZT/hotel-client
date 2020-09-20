const topName = 'roleManager';

export default {
  menuManager: {
    path: '/roleManager',
    component: () => import('../../pages/roleManager/index.vue'),
    redirect: () => { return { name: 'roleList' }; },
    meta: {
      menuName: '角色管理',
      iconClass: '',
      activePath: `${topName}`,
      isMenu: false
    },
    children: {
      // 菜单列表
      menuList: {
        path: '/roleManager/list',
        name: 'roleList',
        component: () => import('../../pages/roleManager/child/roleList.vue'),
        meta: {
          menuName: '角色列表',
          isMenu: false
        }
      }
    }
  }
};
