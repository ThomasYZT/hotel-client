const topName = 'stockManager';

export default {
  menuManager: {
    path: '/stockManager',
    component: () => import('../../pages/stockManager/index.vue'),
    redirect: () => { return { name: 'stockList' }; },
    meta: {
      menuName: '进销存管理',
      iconClass: '',
      activePath: `${topName}`,
      isMenu: true
    },
    children: {
      // 菜单列表
      menuList: {
        path: '/stockManager/list',
        name: 'stockList',
        component: () => import('../../pages/stockManager/child/stockList.vue'),
        meta: {
          menuName: '进销存列表',
          activePath: `${topName}`,
          isMenu: false
        }
      }
    }
  }
};
