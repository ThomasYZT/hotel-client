const topName = 'agentManager';

export default {
  menuManager: {
    path: '/agentManager',
    component: () => import('../../pages/agentManager/index.vue'),
    redirect: () => { return { name: 'agentList' }; },
    meta: {
      menuName: '代理商管理',
      iconClass: 'icon-dailishang',
      activePath: `${topName}`,
      isMenu: true
    },
    children: {
      // 菜单列表
      menuList: {
        path: '/agentManager/list',
        name: 'agentList',
        component: () => import('../../pages/agentManager/child/agentList.vue'),
        meta: {
          menuName: '代理商列表',
          activePath: `${topName}`,
          isMenu: false
        }
      }
    }
  }
};
