import { request } from '../utils/request'

// 登录
export const wechatLogin = (data) => {
  return request({
    url: '/user/wechat',
    method: 'POST',
    data
  })
}

// 注册
export const wechatRegister = (data) => {
  return request({
    url: '/user/registerWechat',
    method: 'POST',
    data
  })
}

// 更新个人信息
export const wechatUserUpdate = (data) => {
  return request({
    url: '/user/update',
    method: 'POST',
    data
  })
}

// 发布出行
export const publishCommuteInfo = (data) => {
  return request({
    url: '/user/update',
    method: 'POST',
    data
  })
}
