// import { userInfo } from '../persistence';
import { generateRoutes } from '../../router/routeUtils';
import { userType, storageKey } from '../../assets/enums';
import { resetRouter } from '../../router';
import ajax from '../../assets/api';

const state = {
  userInfo: JSON.parse(sessionStorage.getItem(storageKey.userInfo)) || null,
  routeInfo: null,
  dictionary: {}
};

const getters = {
  userInfo: state => {
    return state.userInfo;
  },
  routeInfo: state => {
    return state.routeInfo;
  },
  dictionary: state => {
    return state.dictionary;
  }
};

const mutations = {
  UPDATE_USERINFO (state, data) {
    state.userInfo = data;
    sessionStorage.setItem(storageKey.userInfo, JSON.stringify(data));
  },
  UPDATE_ROUTEINFO (state, data) {
    state.routeInfo = data;
  },
  UPDATE_DICTIONARY (state, data) {
    state.dictionary = data;
  }
};

const actions = {
  setUserInfo ({ commit }, data) {
    commit('UPDATE_USERINFO', data);
  },
  validUserInfo ({ commit }, data) {
    // ajax.get()
  },
  generateRouteInfo ({ commit, dispatch }, menuInfo) {
    return new Promise((resolve, reject) => {
      try {
        const _routes = generateRoutes(menuInfo);
        resetRouter(_routes);
        commit('UPDATE_ROUTEINFO', _routes);
        resolve(dispatch('getDictionary', _routes[0]));
      } catch (err) {
        reject(err);
      }
    });
  },
  getDictionary ({ commit }, route) {
    return new Promise((resolve, reject) => {
      ajax.get({
        apiKey: 'dicGetAllList'
      }).then(data => {
        commit('UPDATE_DICTIONARY', data);
        resolve(data);
      }).catch(err => {
        reject(err);
      });
    });
  },
  getMenuList ({ commit, dispatch }, { tip, userInfo }) {
    return new Promise((resolve, reject) => {
      if (userInfo.type === userType.admin) {
        // 超级管理员
        resolve(dispatch('generateRouteInfo', 'all'));
      } else {
        // 非超级管理员
        ajax.get({
          apiKey: 'userMenuList',
          params: { hotelUserId: userInfo.id }
        }).then(data => {
          resolve(dispatch('generateRouteInfo', data));
        }).catch(err => {
          tip && dispatch('showMessage', { type: 'error', msg: '获取权限失败' });
          reject({ type: 'permissionError', err });
        });
      }
    });
  },
  login ({ commit, dispatch }, params) {
    return new Promise((resolve, reject) => {
      const loginParams = {
        userName: params.userName,
        password: params.password
      };
      // 登陆
      ajax.post({
        apiKey: 'userLogin',
        params: loginParams,
        loading: false
      }).then(data => {
        dispatch('setUserInfo', data);
        params.tip && dispatch('showMessage', { type: 'success', msg: '登录成功' });
        // 获取权限
        resolve(dispatch('getMenuList', { tip: !!params.tip, userInfo: data }));
      }).catch(err => {
        params.tip && dispatch('showMessage', { type: 'error', msg: `登录失败：${err.msg || err.toString()}` });
        reject({ type: 'loginError', err });
      });
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
