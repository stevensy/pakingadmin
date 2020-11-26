import request from '@/utils/request';

// 获取会员或管理员账号列表 0 user 1 admin
export function getListUser(params) {
  return request({
    url: '/showUserList',
    method: 'get',
    params
  })
}

// 新增 会员/管理员 
export function addUser(data) {
  return request({
    url: '/addUser',
    method: 'post',
    data
  })
}

// 删除会员/管理员 
export function delUser(data) {
  return request({
    url: '/deleteUser',
    method: 'post',
    data
  })
}

// 修改&冻结 会员/管理员 
export function editUser(data) {
  return request({
    url: '/updateUser',
    method: 'post',
    data
  })
}

// 预约列表
export function bookingList (data) {
  return request({
    url: '/showReserve',
    method: 'post',
    data
  })
}

// 微信配置 列表
export function getWxconfig() {
  return request({
    url: '/getWxconfig',
    method: 'get',
  })
}

// 修改 微信配置
export function setWxconfig(data) {
  return request({
    url: '/setWxconfig',
    method: 'post',
    data
  })
}

// 短信配置 列表
export function getSmsconfig() {
  return request({
    url: '/getSmsconfig',
    method: 'get',
  })
}

// 修改短信配置 
export function setSmsconfig(data) {
  return request({
    url: '/setSmsconfig ',
    method: 'post',
    data
  })
}

// 接口配置 
export function getE7() {
  return request({
    url: '/getE7 ',
    method: 'get'
  })
}

// 修改接口配置 
export function setE7(data) {
  return request({
    url: '/setE7  ',
    method: 'post',
    data
  })
}