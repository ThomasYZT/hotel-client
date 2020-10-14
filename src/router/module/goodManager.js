const topName = 'goodManagerModule';

export default {
  hotelRoomManager: {
    path: '/goodManagerModule',
    component: () => import('../../pages/routerView/index.vue'),
    meta: {
      menuName: '商品管理',
      iconClass: '',
      activePath: `${topName}`,
      isMenu: true
    },
    children: {
      stockManager: {
        path: '/stockManager',
        component: () => import('../../pages/stockManager/index.vue'),
        redirect: () => { return { name: 'stockList' }; },
        meta: {
          menuName: '入库管理',
          iconClass: '',
          activePath: `${topName}.stockManager`,
          isMenu: true
        },
        children: {
          // 菜单列表
          menuList: {
            path: '/stockManager/list',
            name: 'stockList',
            component: () => import('../../pages/stockManager/child/stockList.vue'),
            meta: {
              menuName: '入库列表',
              activePath: `${topName}.stockManager`,
              isMenu: false
            }
          }
        }
      },
      goodManager: {
        path: '/goodManager',
        component: () => import('../../pages/goodManager/index.vue'),
        redirect: () => { return { name: 'goodList' }; },
        meta: {
          menuName: '商品管理',
          iconClass: '',
          activePath: `${topName}.goodManager`,
          isMenu: true
        },
        children: {
          // 菜单列表
          menuList: {
            path: '/goodManager/list',
            name: 'goodList',
            component: () => import('../../pages/goodManager/child/goodList.vue'),
            meta: {
              menuName: '商品列表',
              activePath: `${topName}.goodManager`,
              isMenu: false
            }
          }
        }
      }
    }
  }
};
