const topName = 'hotelBlackListManager';

export default {
  menuManager: {
    path: '/hotelBlackListManager',
    component: () => import('../../pages/hotelBlackListManager/index.vue'),
    redirect: () => { return { name: 'hotelBlackList' }; },
    meta: {
      menuName: '酒店黑名单管理',
      iconClass: '',
      activePath: `${topName}`,
      isMenu: false
    },
    children: {
      menuList: {
        path: '/agentManager/list',
        name: 'hotelBlackList',
        component: () => import('../../pages/hotelBlackListManager/child/hotelBlackList.vue'),
        meta: {
          menuName: '酒店黑名单列表',
          isMenu: false
        }
      }
    }
  }
};
