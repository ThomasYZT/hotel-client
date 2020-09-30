const topName = 'dictionary';

export default {
  menuManager: {
    path: '/dictionary',
    component: () => import('../../pages/dictionaryManager/index.vue'),
    redirect: () => { return { name: 'dictionaryList' }; },
    meta: {
      menuName: '数据字典管理',
      iconClass: '',
      activePath: `${topName}`,
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
          activePath: `${topName}`,
          isMenu: false
        }
      }
    }
  }
};
