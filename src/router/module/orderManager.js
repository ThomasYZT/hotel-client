const topName = 'orderManager';

export default {
  menuManager: {
    path: '/orderManager',
    component: () => import('../../pages/orderManager/index.vue'),
    redirect: () => { return { name: 'reservation' }; },
    meta: {
      menuName: '预定管理',
      iconClass: 'icon-dailishang',
      activePath: `${topName}`,
      isMenu: true
    },
    children: {
      // 菜单列表
      reservation: {
        path: '/orderManager/reservation',
        name: 'reservation',
        component: () => import('../../pages/orderManager/child/reservation.vue'),
        meta: {
          menuName: '预定管理',
          activePath: `${topName}`,
          noBread: true,
          isMenu: false
        }
      },
      // 菜单列表
      reservationList: {
        path: '/orderManager/orderList',
        name: 'orderList',
        component: () => import('../../pages/orderManager/child/orderList.vue'),
        meta: {
          menuName: '订单列表',
          activePath: ``,
          noBread: false,
          isMenu: false
        }
      }
    }
  }
};
