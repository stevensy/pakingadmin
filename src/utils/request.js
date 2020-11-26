import axios from 'axios';
import {
  Message,
  MessageBox,
  Notification,
} from 'element-ui';

import store from '@/store';

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.withCredentials = true

// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_API,
  // 超时
  timeout: 50000
})
// request拦截器
service.interceptors.request.use(
  config => {
    // if (getToken()) {
    //   config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    // }
    // // 全局添加时间戳以防有缓存
    // if (config.method == 'post') {
    //   config.url += `?_t=${Date.parse(new Date()) / 1000}`
    // } else {
    //   config.params = {
    //     ...config.params,
    //     _t: Date.parse(new Date()) / 1000
    //   }
    // }
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(res => {
    const {headers, status} = res;
    const contentDisposition = headers['content-disposition'] || '';
    if (contentDisposition && contentDisposition.includes('attachment') && status === 200) {
      const fileName = contentDisposition.split(/filename=/i)[1];
      var FileSaver = require('file-saver');
      FileSaver.saveAs(res.data, fileName);
      return;
    }
    
    // 单点登陆回来是code标识，而后端接口用的是state标识状态
    const code = +res.data.status
    if (code === 402) {
      MessageBox.confirm(
        '登录状态已过期，您可以继续留在该页面，或者重新登录',
        '系统提示',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    } else if (code === 555) {
      MessageBox.confirm(
        res.data.message,
        '系统提示',
        {
          cancelButtonText: '退出登录',
          confirmButtonText: '重新登录',
          type: 'warning'
        }
      ).then(() => {
        store.dispatch('FedLogOut').then(() => {
          window.location.replace(`${envConfig.config[profile.active].loginUrl}/login?service=${location.origin}${profile.contextPath}/login`);
        })
      }).catch(err => {
        store.dispatch('FedLogOut').then(() => {
          location.replace(`${envConfig.config[profile.active].loginUrl}/logout?service=${location.origin}${profile.contextPath}/`)
        })
      })
    } else if (code === 403) {
      store.dispatch('addErrorLog', 'cookie过期')
      console.error('接口异常：cookie过期, 正在重新获取cookie')
      Notification.info({
        title: 'cookie已过期，正在重新登录...'
      })
      store.dispatch('FedLogOut').then(() => {
        location.replace(`${location.origin}${profile.contextPath}/`)
      })
    } else if (code !== 1) {
      Notification.error({
        title: res.data.message || res.data.msg
      })
      return res.data
    } else {

      return res.data
    }
  },
  error => {
    Message({
      message: error.message || error.msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
