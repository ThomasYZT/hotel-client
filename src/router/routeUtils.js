import store from '../store';
import routes from './module/index';
import { treeTraverse } from '../assets/share/utils';

export const nvllRouterAuth = (to) => {
  if (store.getters.userInfo && store.getters.routeInfo) {
    return {
      name: store.getters.routeInfo[0].name
    };
  } else {
    return {
      name: 'login'
    };
  }
};

export const generateRoutes = (menuInfo) => {
  if (menuInfo === 'all') {
    return _routeRank(routes.filter(item => item.path !== '/homePage'));
  } else {
    return _routeRank(routes.filter((routeConfig) => treeTraverse([routeConfig], (item) => {
      return !!menuInfo.find(info => info.url === item.path);
    })));
  }
};

function _routeRank (routes) {
  return routes ? routes.sort((a, b) => {
    if (a.meta.order && b.meta.order) {
      if (a.meta.order > b.meta.order) {
        return 1;
      } else {
        return -1;
      }
    } else if (a.meta.order && !b.meta.order) {
      return -1;
    } else if (b.meta.order && !a.meta.order) {
      return 1;
    } else {
      return 1;
    }
  }) : [];
}

export const goRoute = (routerInfo) => {

};
