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
    return routes;
  } else {
    return routes.filter((routeConfig) => treeTraverse([routeConfig], (item) => {
      return !!menuInfo.find(info => info.url === item.path);
    }));
  }
};

export const goRoute = (routerInfo) => {

};
