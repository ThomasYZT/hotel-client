const topName = 'homePage';

export default {
  menuManager: {
    path: '/homePage',
    component: () => import('../../pages/homePage/index.vue'),
    redirect: () => { return { name: 'homePage' }; },
    meta: {
      menuName: '首页',
      iconClass: 'icon-dailishang',
      activePath: `${topName}`,
      isMenu: true,
      order: 1
    },
    children: {
      // 菜单列表
      menuList: {
        path: '/',
        name: 'agentList',
        component: () => import('../../pages/homePage/child/home.vue'),
        meta: {
          menuName: '首页',
          activePath: `${topName}`,
          isMenu: false,
          noBread: true
        }
      }
    }
  }
};
