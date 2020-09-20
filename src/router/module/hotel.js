const topName = 'hotelManager';

export default {
  menuManager: {
    path: '/hotelManager',
    component: () => import('../../pages/hotelManager/index.vue'),
    redirect: () => { return { name: 'hotelList' }; },
    meta: {
      menuName: '酒店管理',
      iconClass: '',
      activePath: `${topName}`,
      isMenu: false
    },
    children: {
      // 菜单列表
      menuList: {
        path: '/hotelManager/list',
        name: 'hotelList',
        component: () => import('../../pages/hotelManager/child/hotelList.vue'),
        meta: {
          menuName: '酒店列表',
          isMenu: false
        }
      }
    }
  }
};
