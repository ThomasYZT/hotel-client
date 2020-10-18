const topName = 'systemSettingModule';

export default {
  hotelRoomManager: {
    path: '/systemSettingModule',
    component: () => import('../../pages/routerView/index.vue'),
    meta: {
      menuName: '系统设置',
      iconClass: 'icon-iconset0177',
      activePath: `${topName}`,
      isMenu: true
    },
    children: {
      dictionary: {
        path: '/dictionary',
        component: () => import('../../pages/dictionaryManager/index.vue'),
        redirect: () => { return { name: 'dictionaryList' }; },
        meta: {
          menuName: '数据字典管理',
          iconClass: 'icon-zidianguanli5',
          activePath: `${topName}.dictionary`,
          isMenu: true
        },
        children: {
          // 菜单列表
          menuList: {
            path: '/dictionary/list',
            name: 'dictionaryList',
            component: () => import('../../pages/dictionaryManager/child/dictionaryList.vue'),
            meta: {
              menuName: '数据字典列表',
              activePath: `${topName}.dictionary`,
              isMenu: false
            }
          }
        }
      },
      hotelUserManager: {
        path: '/hotelUserManager',
        component: () => import('../../pages/hotelUserManager/index.vue'),
        redirect: () => { return { name: 'hotelUserList' }; },
        meta: {
          menuName: '用户管理',
          iconClass: 'icon-yonghu',
          activePath: `${topName}.hotelUserManager`,
          isMenu: true
        },
        children: {
          // 菜单列表
          menuList: {
            path: '/hotelUserManager/list',
            name: 'hotelUserList',
            component: () => import('../../pages/hotelUserManager/child/hotelUserList.vue'),
            meta: {
              menuName: '用户列表',
              activePath: `${topName}.hotelUserManager`,
              isMenu: false
            }
          }
        }
      },
      roleManager: {
        path: '/roleManager',
        component: () => import('../../pages/roleManager/index.vue'),
        redirect: () => { return { name: 'roleList' }; },
        meta: {
          menuName: '角色管理',
          iconClass: 'icon-jiaose1',
          activePath: `${topName}.roleManager`,
          isMenu: true
        },
        children: {
          // 菜单列表
          menuList: {
            path: '/roleManager/list',
            name: 'roleList',
            component: () => import('../../pages/roleManager/child/roleList.vue'),
            meta: {
              menuName: '角色列表',
              activePath: `${topName}.roleManager`,
              isMenu: false
            }
          }
        }
      },
      menuManager: {
        path: '/menuManager',
        component: () => import('../../pages/menuManager/index.vue'),
        redirect: () => { return { name: 'menuList' }; },
        meta: {
          menuName: '菜单管理',
          iconClass: 'icon-caidan',
          activePath: `${topName}`,
          isMenu: true
        },
        children: {
          // 菜单列表
          menuList: {
            path: '/menuManager/list',
            name: 'menuList',
            component: () => import('../../pages/menuManager/child/menuList.vue'),
            meta: {
              menuName: '菜单列表',
              activePath: `${topName}`,
              isMenu: false
            }
          }
        }
      }
    }
  }
};
