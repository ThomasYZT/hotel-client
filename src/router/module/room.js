const topName = 'roomManager';

export default {
  menuManager: {
    path: '/roomManager',
    component: () => import('../../pages/roomManager/index.vue'),
    redirect: () => { return { name: 'roomList' }; },
    meta: {
      menuName: '房间管理',
      iconClass: '',
      activePath: `${topName}`,
      isMenu: false
    },
    children: {
      // 菜单列表
      menuList: {
        path: '/roomManager/list',
        name: 'roomList',
        component: () => import('../../pages/roomManager/child/roomList.vue'),
        meta: {
          menuName: '房间列表',
          isMenu: false
        }
      }
    }
  }
};
