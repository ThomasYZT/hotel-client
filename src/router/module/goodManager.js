const topName = 'goodManagerModule';

export default {
  hotelRoomManager: {
    path: '/goodManagerModule',
    component: () => import('../../pages/routerView/index.vue'),
    meta: {
      menuName: '商品管理',
      iconClass: 'icon-shangpin',
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
          iconClass: 'icon-ruku',
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
          iconClass: 'icon-shangpin',
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
      },
      goodsOutStorageManager: {
        path: '/goodsOutStorageManager',
        component: () => import('../../pages/goodsOutStorageManager/index.vue'),
        redirect: () => { return { name: 'goodsOutStorageList' }; },
        meta: {
          menuName: '出库查询',
          iconClass: 'icon-shangpin',
          activePath: `${topName}.goodsOutStorageManager`,
          isMenu: true
        },
        children: {
          // 菜单列表
          menuList: {
            path: '/goodsOutStorageManager/list',
            name: 'goodsOutStorageList',
            component: () => import('../../pages/goodsOutStorageManager/child/goodsOutStorageList.vue'),
            meta: {
              menuName: '出库列表',
              activePath: `${topName}.goodsOutStorageManager`,
              isMenu: false
            }
          }
        }
      }
    }
  }
};
