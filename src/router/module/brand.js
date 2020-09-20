const topName = 'brandManager';

export default {
  menuManager: {
    path: '/brandManager',
    component: () => import('../../pages/brandManager/index.vue'),
    redirect: () => { return { name: 'brandList' }; },
    meta: {
      menuName: '品牌管理',
      iconClass: '',
      activePath: `${topName}`,
      isMenu: false
    },
    children: {
      // 菜单列表
      menuList: {
        path: '/brandManager/list',
        name: 'brandList',
        component: () => import('../../pages/brandManager/child/brandList.vue'),
        meta: {
          menuName: '品牌列表',
          isMenu: false
        }
      }
    }
  }
};
