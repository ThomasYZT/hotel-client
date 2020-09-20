const topName = 'vipManager';

export default {
  menuManager: {
    path: '/vipManager',
    component: () => import('../../pages/vipManager/index.vue'),
    redirect: () => { return { name: 'vipList' }; },
    meta: {
      menuName: '会员管理',
      iconClass: '',
      activePath: `${topName}`,
      isMenu: false
    },
    children: {
      menuList: {
        path: '/agentManager/list',
        name: 'vipList',
        component: () => import('../../pages/vipManager/child/vipList.vue'),
        meta: {
          menuName: '会员列表',
          isMenu: false
        }
      }
    }
  }
};
