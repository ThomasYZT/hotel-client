const topName = 'storageManager';

export default {
  menuManager: {
    path: '/storageManager',
    component: () => import('../../pages/storageManager/index.vue'),
    redirect: () => { return { name: 'storageList' }; },
    meta: {
      menuName: '行李寄存管理',
      iconClass: '',
      activePath: `${topName}`,
      isMenu: true
    },
    children: {
      menuList: {
        path: '/storageManager/list',
        name: 'storageList',
        component: () => import('../../pages/storageManager/child/storageList.vue'),
        meta: {
          menuName: '行李寄存列表',
          activePath: `${topName}`,
          isMenu: false
        }
      }
    }
  }
};
