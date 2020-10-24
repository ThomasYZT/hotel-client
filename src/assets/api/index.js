import axios from 'axios';
import apiList from './apiList';
import qs from 'querystring';
import defautsDeep from 'lodash/defaultsDeep';
import store from '../../store';
const isProduct = process.env.NODE_ENV === 'production';
export let domain;
if (isProduct) {
  domain = 'https://uujd.com.cn';
} else {
  domain = 'http://139.155.42.50:8080';
}
// 创建自定义axios实例
const instance = axios.create({
  baseURL: '',
  timeout: 240000, // 设置4分钟超时时间
  validateStatus: function (status) {
    return status < 500;
  },
  headers: {
    // 设置发送内容格式
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    // 设置接受内容格式
    Accept: 'application/json'
  }
});

// 响应拦截器
instance.interceptors.response.use((res) => {
  // 处理响应数据
  return res.data;
}, function (err) {
  return Promise.reject(err);
});

export default {
  // post请求
  post ({ apiKey, params = {}, config = null, withRequiredParams = true, loading = true }) {
    loading && store.dispatch('loading');
    const myConfig = {
      params: {
        env: isProduct ? '' : 'test'
      }
    };

    if (config) {
      Object.assign(myConfig, config);
    }
    const needStringify = myConfig.headers ? myConfig.headers['Content-Type'] !== 'application/json;charset-UTF-8' : true;
    return instance.post(`${domain}${apiList[apiKey]}`, needStringify ? qs.stringify(params) : params, myConfig).then(res => {
      if (res.code === 1) {
        return res.data;
      } else {
        return Promise.reject(res);
      }
    }).catch(err => {
      return Promise.reject(err);
    }).finally(() => {
      loading && store.dispatch('unloading');
    });
  },
  // get请求
  get ({ apiKey, params = {}, config = null, withRequiredParams = true, loading = true }) {
    loading && store.dispatch('loading');

    let myConfig = {
      params: {
        env: isProduct ? '' : 'test'
      }
    };

    myConfig = defautsDeep({ params: params }, myConfig);

    // 自定义http配置
    if (config) {
      Object.assign(myConfig, config);
    }

    return instance.get(`${domain}${apiList[apiKey]}`, myConfig).then(res => {
      if (res.code === 1) {
        return res.data;
      } else {
        return Promise.reject(res);
      }
    }).catch(err => {
      return Promise.reject(err);
    }).finally(() => {
      loading && store.dispatch('unloading');
    });
  }
};
