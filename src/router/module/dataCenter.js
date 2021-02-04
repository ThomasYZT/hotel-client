const topName = 'dataCenter';

export default {
  menuManager: {
    path: '/dataCenter',
    component: () => import('../../pages/dataCenter/index.vue'),
    redirect: () => { return { name: 'dataStatistic' }; },
    meta: {
      menuName: '数据中心',
      iconClass: 'icon-dailishang',
      activePath: `${topName}`
    },
    children: {
      // 营业查询
      reservation: {
        path: '/dataCenter/dataStatistic',
        name: 'dataStatistic',
        component: () => import('../../pages/dataCenter/child/dataStatistic.vue'),
        meta: {
          menuName: '营业查询',
          activePath: `${topName}`,
          isMenu: true
        }
      },
      // 房单查询
      singleRoomManager: {
        path: '/singleRoomManager/singleRoomList',
        name: 'singleRoom',
        component: () => import('../../pages/singleRoomManager/child/singleRoomList.vue'),
        meta: {
          menuName: '房单查询',
          activePath: `${topName}.singleRoomManager`,
          isMenu: true
        }
      },
    }
  }
};
