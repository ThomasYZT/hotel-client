const topName = 'reportManager';

export default {
  reportManager: {
    path: '/reportManager',
    component: () => import('../../pages/routerView/index.vue'),
    meta: {
      menuName: '财务报表',
      iconClass: 'icon-shangpin',
      activePath: `${topName}`,
      isMenu: true
    },
    children: {
      goodsSalesCollect: {
        path: '/reportManager/goodsSalesCollect',
        component: () => import('../../pages/financialReport/index.vue'),
        redirect: () => { return { name: 'goodsSalesCollect' }; },
        meta: {
          menuName: '商品销售汇总',
          iconClass: 'icon-ruku',
          activePath: `${topName}.goodsSalesCollect`,
          isMenu: true,
        },
        children: {
          // 菜单列表
          menuList: {
            path: '/reportManager/goodsSalesCollect/list',
            name: 'goodsSalesCollect',
            component: () => import('../../pages/financialReport/child/goodsSalesCollect.vue'),
            meta: {
              menuName: '商品销售汇总表',
              activePath: `${topName}.goodsSalesCollect`,
              isMenu: false,
              noBread: true
            }
          }
        }
      },
      memberRecharge: {
        path: '/reportManager/memberRecharge',
        component: () => import('../../pages/financialReport/index.vue'),
        redirect: () => { return { name: 'memberRecharge' }; },
        meta: {
          menuName: '会员充值消费汇总',
          iconClass: 'icon-ruku',
          activePath: `${topName}.memberRecharge`,
          isMenu: true,
        },
        children: {
          // 菜单列表
          menuList: {
            path: '/reportManager/memberRecharge/list',
            name: 'memberRecharge',
            component: () => import('../../pages/financialReport/child/memberRecharge.vue'),
            meta: {
              menuName: '会员充值消费汇总表',
              activePath: `${topName}.memberRecharge`,
              isMenu: false,
              noBread: true
            }
          }
        }
      },
      creditCollect: {
        path: '/reportManager/creditCollect',
        component: () => import('../../pages/financialReport/index.vue'),
        redirect: () => { return { name: 'creditCollect' }; },
        meta: {
          menuName: '签单挂账汇总',
          iconClass: 'icon-ruku',
          activePath: `${topName}.creditCollect`,
          isMenu: true,
        },
        children: {
          // 菜单列表
          menuList: {
            path: '/reportManager/creditCollect/list',
            name: 'creditCollect',
            component: () => import('../../pages/financialReport/child/creditCollect.vue'),
            meta: {
              menuName: '签单挂账汇总表',
              activePath: `${topName}.creditCollect`,
              isMenu: false,
              noBread: true
            }
          }
        }
      },
      refundCollect: {
        path: '/reportManager/refundCollect',
        component: () => import('../../pages/financialReport/index.vue'),
        redirect: () => { return { name: 'refundCollect' }; },
        meta: {
          menuName: '已退未结收支汇总',
          iconClass: 'icon-ruku',
          activePath: `${topName}.refundCollect`,
          isMenu: true,
        },
        children: {
          // 菜单列表
          menuList: {
            path: '/reportManager/refundCollect/list',
            name: 'refundCollect',
            component: () => import('../../pages/financialReport/child/refundCollect.vue'),
            meta: {
              menuName: '已退未结收支汇总表',
              activePath: `${topName}.refundCollect`,
              isMenu: false,
              noBread: true
            }
          }
        }
      },
      inTotal: {
        path: '/reportManager/inTotal',
        component: () => import('../../pages/financialReport/index.vue'),
        redirect: () => { return { name: 'inTotal' }; },
        meta: {
          menuName: '入账项目汇总',
          iconClass: 'icon-ruku',
          activePath: `${topName}.inTotal`,
          isMenu: true,
        },
        children: {
          // 菜单列表
          menuList: {
            path: '/reportManager/inTotal/list',
            name: 'inTotal',
            component: () => import('../../pages/financialReport/child/inTotal.vue'),
            meta: {
              menuName: '入账项目汇总表',
              activePath: `${topName}.inTotal`,
              isMenu: false,
              noBread: true
            }
          }
        }
      },
      workStat: {
        path: '/reportManager/workStat',
        component: () => import('../../pages/financialReport/index.vue'),
        redirect: () => { return { name: 'workStat' }; },
        meta: {
          menuName: '交接汇总',
          iconClass: 'icon-ruku',
          activePath: `${topName}.workStat`,
          isMenu: true,
        },
        children: {
          // 菜单列表
          menuList: {
            path: '/reportManager/workStat/list',
            name: 'workStat',
            component: () => import('../../pages/financialReport/child/workStat.vue'),
            meta: {
              menuName: '交接报表',
              activePath: `${topName}.workStat`,
              isMenu: false,
              noBread: true
            }
          }
        }
      },
      roomStat: {
        path: '/reportManager/roomStat',
        component: () => import('../../pages/financialReport/index.vue'),
        redirect: () => { return { name: 'roomStat' }; },
        meta: {
          menuName: '纯房费统计',
          iconClass: 'icon-ruku',
          activePath: `${topName}.roomStat`,
          isMenu: true,
        },
        children: {
          // 菜单列表
          menuList: {
            path: '/reportManager/roomStat/list',
            name: 'roomStat',
            component: () => import('../../pages/financialReport/child/roomStat.vue'),
            meta: {
              menuName: '纯房费报表',
              activePath: `${topName}.roomStat`,
              isMenu: false,
              noBread: true
            }
          }
        }
      }
    }
  }
};
