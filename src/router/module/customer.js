const topName = 'customerManager';

export default {
  menuManager: {
    path: '/customerManager',
    component: () => import('../../pages/customerManager/index.vue'),
    redirect: () => { return { name: 'customerList' }; },
    meta: {
      menuName: '客户管理',
      iconClass: '',
      activePath: `${topName}`,
      isMenu: false
    },
    children: {
      // 菜单列表
      menuList: {
        path: '/customerManager/list',
        name: 'customerList',
        component: () => import('../../pages/customerManager/child/customerList.vue'),
        meta: {
          menuName: '客户列表',
          isMenu: false
        }
      }
    }
  }
};
