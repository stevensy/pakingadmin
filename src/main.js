//import 'default-passive-events' //这是为了解决警告[Violation] Added non-passive event listener to a scroll-blocking ‘mousewheel’ event. Consider marking event handler as ‘passive’ to make the page more responsive。 引用之后在显示地图之后，鼠标在地图上滑动控制台会报错
import './assets/icons'; // icon
import './assets/styles/element-variables.scss';
import './permission'; // permission control
import '@/assets/styles/index.scss'; // global css
import '@/assets/styles/ruoyi.scss'; // ruoyi css
import '@/utils/errorLog';
import 'normalize.css/normalize.css'; // a modern alternative to CSS resets

import Vue from 'vue';

import Element from 'element-ui';
import Cookies from 'js-cookie';

import Pagination from '@/components/Pagination';
import {
  addDateRange,
  download,
  handleTree,
  limitStr,
  parseTime,
  resetForm,
  storage,
  strToUpcase,
} from '@/utils/ruoyi';

import App from './App';
import permission from './directive/permission';
import router from './router';
import store from './store';

// 全局方法挂载
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.strToUpcase = strToUpcase
Vue.prototype.limitStr = limitStr
Vue.prototype.storage = storage
Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
}

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
}

// 全局组件挂载
Vue.component('Pagination', Pagination)

Vue.use(permission)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false

Vue.config.errorHandler = (err, vm, info) => {
  console.error('通过vue errorHandler捕获的错误')
  console.error(err)

  // 在这个方法内可以将捕获到的错误进行上报到后台或者发送错误信息到 node 中间层
  // 上报到后台之后，在请错误请求到页面中进行可视化
}

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
