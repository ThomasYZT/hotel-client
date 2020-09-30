const topName = 'agreementManager';

export default {
  menuManager: {
    path: '/agreementManager',
    component: () => import('../../pages/agreementManager/index.vue'),
    redirect: () => { return { name: 'agreementList' }; },
    meta: {
      menuName: '协议客户管理',
      iconClass: '',
      activePath: `${topName}`,
      isMenu: true
    },
    children: {
      // 菜单列表
      menuList: {
        path: '/agreementManager/list',
        name: 'agreementList',
        component: () => import('../../pages/agreementManager/child/agreementList.vue'),
        meta: {
          menuName: '协议客户管理',
          activePath: `${topName}`,
          isMenu: false
        }
      }
    }
  }
};
