import 'nprogress/nprogress.css';

import NProgress from 'nprogress';

import {
  getToken,
  removeToken,
} from '@/utils/auth';
import { storage } from '@/utils/ruoyi';

import router from './router';

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  if (!storage.get('auth')) {
    removeToken()
  }
  if (getToken()) {
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      next()
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
