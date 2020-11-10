const topName = 'workManager';

export default {
  menuManager: {
    path: '/workManager',
    component: () => import('../../pages/workManager/index.vue'),
    redirect: () => { return { name: 'workList' }; },
    meta: {
      menuName: '交班管理',
      iconClass: 'icon-dailishang',
      activePath: `${topName}`,
      isMenu: true,
      order: 4
    },
    children: {
      // 列表
      reservation: {
        path: '/workManager/workList',
        name: 'workList',
        component: () => import('../../pages/workManager/child/workList.vue'),
        meta: {
          menuName: '交班列表',
          activePath: `${topName}`,
          noBread: true,
          isMenu: false
        }
      }
    }
  }
};
