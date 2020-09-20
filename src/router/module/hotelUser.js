const topName = 'hotelUserManager';

export default {
  menuManager: {
    path: '/hotelUserManager',
    component: () => import('../../pages/hotelUserManager/index.vue'),
    redirect: () => { return { name: 'hotelUserList' }; },
    meta: {
      menuName: '酒店用户管理',
      iconClass: '',
      activePath: `${topName}`,
      isMenu: false
    },
    children: {
      // 菜单列表
      menuList: {
        path: '/hotelUserManager/list',
        name: 'hotelUserList',
        component: () => import('../../pages/hotelUserManager/child/hotelUserList.vue'),
        meta: {
          menuName: '酒店用户列表',
          isMenu: false
        }
      }
    }
  }
};
