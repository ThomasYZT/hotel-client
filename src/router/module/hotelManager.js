const topName = 'hotelManagerModule';

export default {
  hotelRoomManager: {
    path: '/hotelManagerModule',
    component: () => import('../../pages/routerView/index.vue'),
    meta: {
      menuName: '酒店管理',
      iconClass: 'icon-jiudian',
      activePath: `${topName}`,
      isMenu: true
    },
    children: {
      agreementManager: {
        path: '/agreementManager',
        component: () => import('../../pages/agreementManager/index.vue'),
        redirect: () => { return { name: 'agreementList' }; },
        meta: {
          menuName: '协议客户管理',
          iconClass: 'icon-xieyixiangqing',
          activePath: `${topName}.agreementManager`,
          isMenu: true
        },
        children: {
          // 菜单列表
          menuList: {
            path: '/agreementManager/list',
            name: 'agreementList',
            component: () => import('../../pages/agreementManager/child/agreementList.vue'),
            meta: {
              menuName: '协议客户列表',
              activePath: `${topName}.agreementManager`,
              isMenu: false
            }
          }
        }
      },
      customerManager: {
        path: '/customerManager',
        component: () => import('../../pages/customerManager/index.vue'),
        redirect: () => { return { name: 'customerList' }; },
        meta: {
          menuName: '客户管理',
          iconClass: 'icon-kehu',
          activePath: `${topName}.customerManager`,
          isMenu: true
        },
        children: {
          // 菜单列表
          menuList: {
            path: '/customerManager/list',
            name: 'customerList',
            component: () => import('../../pages/customerManager/child/customerList.vue'),
            meta: {
              menuName: '客户列表',
              activePath: `${topName}.customerManager`,
              isMenu: false
            }
          }
        }
      },
      hotelBlackListManager: {
        path: '/hotelBlackListManager',
        component: () => import('../../pages/hotelBlackListManager/index.vue'),
        redirect: () => { return { name: 'hotelBlackList' }; },
        meta: {
          menuName: '酒店黑名单管理',
          iconClass: 'icon-heimingdan',
          activePath: `${topName}.hotelBlackListManager`,
          isMenu: true
        },
        children: {
          menuList: {
            path: '/hotelBlackListManager/list',
            name: 'hotelBlackList',
            component: () => import('../../pages/hotelBlackListManager/child/hotelBlackList.vue'),
            meta: {
              menuName: '酒店黑名单列表',
              activePath: `${topName}.hotelBlackListManager`,
              isMenu: false
            }
          }
        }
      },
      hotelManager: {
        path: '/hotelManager',
        component: () => import('../../pages/hotelManager/index.vue'),
        redirect: () => { return { name: 'hotelList' }; },
        meta: {
          menuName: '酒店管理',
          iconClass: 'icon-jiudian',
          activePath: `${topName}.hotelManager`,
          isMenu: true
        },
        children: {
          // 菜单列表
          menuList: {
            path: '/hotelManager/list',
            name: 'hotelList',
            component: () => import('../../pages/hotelManager/child/hotelList.vue'),
            meta: {
              menuName: '酒店列表',
              activePath: `${topName}.hotelManager`,
              isMenu: false
            }
          }
        }
      },
      storageManager: {
        path: '/storageManager',
        component: () => import('../../pages/storageManager/index.vue'),
        redirect: () => { return { name: 'storageList' }; },
        meta: {
          menuName: '行李寄存管理',
          iconClass: 'icon-hanglixiang',
          activePath: `${topName}.storageManager`,
          isMenu: true
        },
        children: {
          menuList: {
            path: '/storageManager/list',
            name: 'storageList',
            component: () => import('../../pages/storageManager/child/storageList.vue'),
            meta: {
              menuName: '行李寄存列表',
              activePath: `${topName}.storageManager`,
              isMenu: false
            }
          }
        }
      },
      promotionalManager: {
        path: '/promotionalManager',
        component: () => import('../../pages/promotionalManager/index.vue'),
        redirect: () => { return { name: 'promotional' }; },
        meta: {
          menuName: '活动促销管理',
          iconClass: 'icon-jiudian',
          activePath: `${topName}.promotionalManager`,
          isMenu: true
        },
        children: {
          menuList: {
            path: '/promotionalManager/list',
            name: 'promotional',
            component: () => import('../../pages/promotionalManager/child/promotional.vue'),
            meta: {
              menuName: '活动促销管理',
              activePath: `${topName}.promotionalManager`,
              isMenu: false
            }
          }
        }
      },
      settingManagerPwd: {
        path: '/settingManagerPwd',
        component: () => import('../../pages/settingManagerPwd/index.vue'),
        redirect: () => { return { name: 'settingManagerPwd' }; },
        meta: {
          menuName: '店长口令设置',
          iconClass: 'icon-jiudian',
          activePath: `${topName}.settingManagerPwd`,
          isMenu: true
        },
        children: {
          menuList: {
            path: '/settingManagerPwd/list',
            name: 'settingManagerPwd',
            component: () => import('../../pages/settingManagerPwd/child/hotelInfoList.vue'),
            meta: {
              menuName: '店长口令设置',
              activePath: `${topName}.settingManagerPwd`,
              isMenu: false
            }
          }
        }
      }
    }
  }
};
