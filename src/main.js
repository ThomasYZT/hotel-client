import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import globalUtils from './assets/plugins/globalUtils';
import './assets/styles/font/iconfont.css';
import 'normalize.css/normalize.css'; // 全局默认样式
import elementUI from './assets/plugins/elementUI';
import viewUI from './assets/plugins/viewUI';
import './assets/styles/scss/_common.scss'; // 全局自定义样式

Vue.config.productionTip = false;

Vue.use(globalUtils);
Vue.use(elementUI);
Vue.use(viewUI);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
