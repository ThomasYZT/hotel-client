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
      // 当前房态统计
      currentRoomManager: {
        path: '/currentRoomManager/currentRoom',
        name: 'currentRoom',
        component: () => import('../../pages/currentRoomManager/child/currentRoom.vue'),
        meta: {
          menuName: '当前房态统计',
          activePath: `${topName}.currentRoomManager`,
          isMenu: true
        }
      },
      // 远期房态统计
      forwardRoomManager: {
        path: '/forwardRoomManager/forwardRoom',
        name: 'forwardRoom',
        component: () => import('../../pages/forwardRoomManager/child/forwardRoom.vue'),
        meta: {
          menuName: '远期房态统计',
          activePath: `${topName}.forwardRoomManager`,
          isMenu: true
        }
      }
    }
  }
};
