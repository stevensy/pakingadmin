import request from '@/utils/request';

// 登录方法
export function login(data) {
  return request({
    url: '/pcLogin',
    method: 'post',
    data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: `/uam/api/user/querySessionUser`,
    method: 'post'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/sso-web/logout',
    method: 'get'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/uam/api/captchaImage',
    method: 'get'
  })
}
