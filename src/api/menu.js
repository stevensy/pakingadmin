import request from '@/utils/request'

// 获取路由
export const getRouters = (data) => {
  return request({
    url: '/uam/api/menu/queryAllMenuRouter',
    method: 'post',
    data
  })
}