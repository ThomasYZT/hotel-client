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
          hotelUserList: {
            path: '/hotelUserManager/list',
            name: 'hotelUserList',
            component: () => import('../../pages/hotelUserManager/child/hotelUserList.vue'),
            meta: {
              menuName: '用户列表',
              activePath: `${topName}.hotelUserManager`,
              isMenu: false
            }
          },
          // 菜单列表
          hotelUserInfo: {
            path: '/hotelUserManager/hotelUserInfo',
            name: 'hotelUserInfo',
            component: () => import('../../pages/hotelUserManager/child/hotelUserInfo.vue'),
            meta: {
              menuName: '用户信息',
              activePath: ``,
              noBread: true,
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
      },
      labelManager: {
        path: '/labelManager',
        component: () => import('../../pages/labelManager/index.vue'),
        redirect: () => { return { name: 'labelList' }; },
        meta: {
          menuName: '标签管理',
          iconClass: 'icon-caidan',
          activePath: `${topName}.labelManager`,
          isMenu: true
        },
        children: {
          // 菜单列表
          menuList: {
            path: '/labelManager/list',
            name: 'labelList',
            component: () => import('../../pages/labelManager/child/labelList.vue'),
            meta: {
              menuName: '标签列表',
              activePath: `${topName}.labelManager`,
              isMenu: false
            }
          }
        }
      },
      sysLog: {
        path: '/sysLog',
        component: () => import('../../pages/sysLog/index.vue'),
        redirect: () => { return { name: 'logList' }; },
        meta: {
          menuName: '系统日志查询',
          iconClass: 'icon-caidan',
          activePath: `${topName}.sysLog`,
          isMenu: true
        },
        children: {
          // 菜单列表
          menuList: {
            path: '/sysLog/list',
            name: 'logList',
            component: () => import('../../pages/sysLog/child/logList.vue'),
            meta: {
              menuName: '系统日志查询',
              activePath: `${topName}.sysLog`,
              isMenu: false
            }
          }
        }
      }
    }
  }
};
