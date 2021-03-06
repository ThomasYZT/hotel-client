// import { userInfo } from '../persistence';
import { generateRoutes } from '../../router/routeUtils';
import { userType, storageKey, workStatusMap } from '../../assets/enums';
import { resetRouter } from '../../router';
import ajax from '../../assets/api';

const state = {
  userInfo: JSON.parse(sessionStorage.getItem(storageKey.userInfo)) || {},
  routeInfo: null,
  dictionary: {},
  workStatus: workStatusMap.workOff
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
  },
  workStatus: state => {
    return state.workStatus;
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
  },
  UPDATE_WORK_STATUS (state, data) {
    state.workStatus = data;
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
        resolve(_routes[0]);
      } catch (err) {
        reject(err);
      }
    });
  },
  getDictionaryByCode ({ commit }, { hotelId, typeCode } = {}) {
    return new Promise((resolve) => {
      ajax.get({
        apiKey: 'dicGetByTypeCode',
        params: {
          hotelId,
          typeCode
        }
      }).then(data => {
        resolve(data || []);
      }).catch(() => {
        resolve([]);
      });
    });
  },
  getDictionary ({ commit }, route) {
    return new Promise((resolve, reject) => {
      ajax.get({
        apiKey: 'dicGetAllList'
      }).then(data => {
        commit('UPDATE_DICTIONARY', data);
        resolve(route);
      }).catch(err => {
        reject(err);
      });
    });
  },
  getMenuList ({ commit, dispatch }, { tip, userInfo }) {
    dispatch('getUserWorkStatus', userInfo.id);
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
          if (data && data.length > 0) {
            resolve(dispatch('generateRouteInfo', data));
          } else {
            tip && dispatch('showMessage', { type: 'error', msg: '获取权限失败' });
            reject({ type: 'permissionError', err: { msg: '该用户没有菜单权限' } });
          }
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
  },
  logout ({ commit }) {
    return new Promise((resolve, reject) => {
      ajax.post({
        apiKey: 'userLogout'
      }).then(() => {
        commit('UPDATE_USERINFO', {});
        commit('UPDATE_ROUTEINFO', null);
        commit('UPDATE_DICTIONARY', {});
        resetRouter();
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  },
  getUserWorkStatus ({ commit, dispatch }, id) {
    ajax.post({
      apiKey: 'workStatus',
      params: {
        hotelUserId: id
      }
    }).then(data => {
      dispatch('updateWorkStatus', String(data.status));
    }).catch(() => {
      dispatch('showMessage', { type: 'error', msg: '获取上班状态失败' });
    });
  },
  updateWorkStatus ({ commit }, status) {
    commit('UPDATE_WORK_STATUS', status);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
