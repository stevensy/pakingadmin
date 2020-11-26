import { getRouters } from '@/api/menu';
import Layout from '@/layout/index';
import { constantRoutes } from '@/router';
import store from '@/store';
import { storage } from '@/utils/ruoyi';

const permission = {
  state: {
    routes: [],
    addRoutes: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    }
  },
  actions: {
    // 获取路由
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
        // 向后端请求路由数据
        getRouters({ appName: 'uam-vue' }).then(res => {
          // 一级是菜单需要处理数据
          res.forEach(item => {
            if (item.component !== 'Layout' && !item.children.length) {
              let { name, path, component, meta} = item
              item.name += '_layout'
              if (!(/^\//.test(item.path))) {
                console.warn(`${item.meta.title}: 一级路由需要以/开头，点击该路由时时会导致前端页面加载异常,前端已做了兼容处理`)
              }
              item.path += '_layout'
              item.component = 'Layout'
              delete item.meta
              item.children.push({
                name,
                path: /^\//.test(path) ? path : `/${path}`,
                component,
                meta
              })
            }
          })
          // 路由缓存
          storage.set('addRoutes', res)
          resolve(store.dispatch('FilterRouter', res))
        })
      })
    },
    // 处理生成路由
    FilterRouter({ commit }, route) {
      const accessedRoutes = filterAsyncRouter(route)
      accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
      commit('SET_ROUTES', accessedRoutes)
      return accessedRoutes
    }
  }
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
  return asyncRouterMap.filter(route => {
    // 较验路由数据
    checkRouter(route)
    if (route.component) {
      // Layout组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
}

function checkRouter(route) {
  let msg = ''
  if(!route.path) {
    msg = `${route.meta.title} 处异常捕获：路由中的path不能为空或null, 会导致前端页面加载异常`
    store.dispatch('addErrorLog', msg)
    console.error(msg)
    return false
  }
  if(!/^[http]/.test(route.path) && !route.component) {
    msg = `${route.meta.title} 处异常捕获：路由中的component为null, 会导致前端页面加载异常`
    store.dispatch('addErrorLog', msg)
    console.warn(msg)
  }
  if (!route.component && !route.path) {
    msg = `${route.meta.title} 处异常捕获：路由中的component或path不能同时为空或null, 会导致前端页面加载异常`
    store.dispatch('addErrorLog', msg)
    console.warn(msg)
  }
  if (!/^[A-Za-z]/.test(route.component) && route.component !== 'Layout') {
    msg = `${route.meta.title} 处异常捕获：路由中的component必需字母开头, 点击页面时会导致前端页面加载异常`
    store.dispatch('addErrorLog', msg)
    console.warn(msg)
  }
  if (!route.name && route.component != 'Layout') {
    msg = `${route.meta.title} 处异常捕获：路由中的name不能为空或null, 会导致前端页面中标签异常`
    store.dispatch('addErrorLog', msg)
    console.warn(msg)
  }
}


export const loadView = (view) => { // 路由懒加载
  return (resolve) => require([`@/views/${view}`], resolve)
}

export default permission
