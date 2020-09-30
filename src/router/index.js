import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';
import { nvllRouterAuth } from './routeUtils';
import { treeTraverse } from '../assets/share/utils';
Vue.use(Router);

const createRouter = () => new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: nvllRouterAuth
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        needPermission: false,
        noFrame: true
      },
      component: () => import('../pages/login/index')
    },
    {
      path: '/noPermission',
      name: 'noPermission',
      meta: {
        needPermission: false
      },
      component: () => import('../pages/noPermission/index')
    },
    {
      path: '/noService',
      name: 'noService',
      meta: {
        needPermission: false
      },
      component: () => import('../pages/noService/index')
    },
    {
      path: '*',
      component: () => import('../pages/404/index')
    }
  ]
});

const router = createRouter();

export const resetRouter = (routes) => {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
  router.addRoutes(routes);
};

router.beforeEach((to, from, next) => {
  if (['login', 'noPermission', 'noService'].includes(to.name)) {
    next();
  } else {
    if (store.getters.userInfo) {
      if (!store.getters.routeInfo) {
        store.dispatch('getMenuList', {
          tip: false,
          userInfo: store.getters.userInfo
        }).then(route => {
          if (treeTraverse(store.getters.routeInfo, (item) => item.path === to.path)) {
            setTimeout(() => {
              next({ ...to, replace: true });
            });
          } else {
            next({
              name: route.name
            });
          }
        }).catch(err => {
          next({ name: 'login' });
        });
      } else {
        next();
      }
    } else {
      next({ name: 'login' });
    }
  }

});

export default router;
