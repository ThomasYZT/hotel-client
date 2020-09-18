const topName = 'MenuManager';

export default {
  menuManager: {
    path: '/menuManager',
    component: () => import('../../pages/menuManager/index.vue'),
    redirect: () => { return { name: 'menuList' }; },
    meta: {
      menuName: '菜单管理',
      iconClass: '',
      activePath: `${topName}`,
      isMenu: false
    },
    children: {
      // 菜单列表
      menuList: {
        path: '/menuManager/list',
        name: 'menuList',
        component: () => import('../../pages/menuManager/child/menuList.vue'),
        meta: {
          menuName: '菜单列表',
          isMenu: false
        }
      }
    }
  }
};
