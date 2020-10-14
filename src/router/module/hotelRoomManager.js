const topName = 'hotelRoomManagerModule';

export default {
  hotelRoomManager: {
    path: '/hotelRoomManagerModule',
    component: () => import('../../pages/routerView/index.vue'),
    meta: {
      menuName: '酒店房间',
      iconClass: '',
      activePath: `${topName}`,
      isMenu: true
    },
    children: {
      roomManager: {
        path: '/roomManager',
        component: () => import('../../pages/roomManager/index.vue'),
        redirect: () => { return { name: 'roomList' }; },
        meta: {
          menuName: '房间管理',
          iconClass: '',
          activePath: `${topName}.roomManager`,
          isMenu: true
        },
        children: {
          // 菜单列表
          menuList: {
            path: '/roomManager/list',
            name: 'roomList',
            component: () => import('../../pages/roomManager/child/roomList.vue'),
            meta: {
              menuName: '房间列表',
              activePath: `${topName}.roomManager`,
              isMenu: false
            }
          }
        }
      },
      roomTypeManager: {
        path: '/roomTypeManager',
        component: () => import('../../pages/roomTypeManager/index.vue'),
        redirect: () => { return { name: 'roomTypeList' }; },
        meta: {
          menuName: '房间类型管理',
          iconClass: '',
          activePath: `${topName}.roomTypeManager`,
          isMenu: true
        },
        children: {
          // 菜单列表
          menuList: {
            path: '/roomTypeManager/list',
            name: 'roomTypeList',
            component: () => import('../../pages/roomTypeManager/child/roomTypeList.vue'),
            meta: {
              menuName: '房间类型列表',
              activePath: `${topName}.roomTypeManager`,
              isMenu: false
            }
          }
        }
      }
    }
  }
};
