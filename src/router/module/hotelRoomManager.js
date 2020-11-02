const topName = 'hotelRoomManagerModule';

export default {
  hotelRoomManager: {
    path: '/hotelRoomManagerModule',
    component: () => import('../../pages/routerView/index.vue'),
    meta: {
      menuName: '酒店房间',
      iconClass: 'icon-Door-Hanger',
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
          iconClass: 'icon-fangjianguanli',
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
          iconClass: 'icon-fangjianweihu',
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
      },
      roomRuleManager: {
        path: '/roomRuleManager',
        component: () => import('../../pages/roomRuleManager/index.vue'),
        redirect: () => { return { name: 'roomRuleList' }; },
        meta: {
          menuName: '普通房规则管理',
          iconClass: 'icon-fangjianweihu',
          activePath: `${topName}.roomRuleManager`,
          isMenu: true
        },
        children: {
          // 普通房规则列表
          roomRuleList: {
            path: '/roomRuleManager/list',
            name: 'roomRuleList',
            component: () => import('../../pages/roomRuleManager/child/roomRuleList.vue'),
            meta: {
              menuName: '普通房规则列表',
              activePath: `${topName}.roomRuleManager`,
              isMenu: false
            }
          }
        }
      },
      hourRoomRuleManager: {
        path: '/hourRoomRuleManager',
        component: () => import('../../pages/hourRoomRuleManager/index.vue'),
        redirect: () => { return { name: 'hourRoomRuleList' }; },
        meta: {
          menuName: '钟点房规则管理',
          iconClass: 'icon-fangjianweihu',
          activePath: `${topName}.hourRoomRuleManager`,
          isMenu: true
        },
        children: {
          // 普通房规则列表
          roomRuleList: {
            path: '/hourRoomRuleManager/list',
            name: 'hourRoomRuleList',
            component: () => import('../../pages/hourRoomRuleManager/child/hourRoomRuleList.vue'),
            meta: {
              menuName: '钟点房规则列表',
              activePath: `${topName}.hourRoomRuleManager`,
              isMenu: false
            }
          }
        }
      }
    }
  }
};
