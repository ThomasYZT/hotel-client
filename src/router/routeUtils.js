import store from '../store';
import routes from './module/index';

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

  }
};

export const goRoute = (routerInfo) => {

};
