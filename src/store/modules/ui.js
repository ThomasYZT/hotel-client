import Vue from 'vue';
import debounce from 'lodash/debounce';

const state = {
  loading: false,
  windowState: 'normal',
  isMenuExpend: true
};

const getters = {
  loading: state => {
    return state.loading;
  },
  windowState: state => {
    return state.windowState;
  },
  isMenuExpend: state => {
    return state.isMenuExpend;
  }
};

const mutations = {
  UPDATE_LOADING (state, status) {
    state.loading = status;
  },
  UPDATE_WINDOW_STATE (state, val) {
    state.windowState = val;
  },
  UPDATE_MENU_STATUS (state, status) {
    state.isMenuExpend = status;
  }
};

const actions = {
  loading ({ commit }) {
    commit('UPDATE_LOADING', true);
  },
  unloading ({ commit }) {
    commit('UPDATE_LOADING', false);
  },
  updateLoadingStatus ({ commit }, status) {
    commit('UPDATE_LOADING', status);
  },
  setWindowState ({ commit }, val) {
    commit('UPDATE_WINDOW_STATE', val);
  },
  setMenuExpandStatus ({ commit }, status) {
    commit('UPDATE_MENU_STATUS', status);
  },
  showMessage: debounce((store, { type, msg }) => {
    Vue.prototype.$Message[type](msg);
  }, 500)
};

export default {
  state,
  getters,
  mutations,
  actions
};
