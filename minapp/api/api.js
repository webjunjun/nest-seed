import { request } from '../utils/request'

// 登录
export const wechatLogin = (data) => {
  return request({
    url: '/user/wechat',
    method: 'POST',
    data
  })
}

export const wechatRegister = (data) => {
  return request({
    url: '/user/registerWechat',
    method: 'POST',
    data
  })
}

export const wechatUserUpdate = (data) => {
  return request({
    url: '/user/update',
    method: 'POST',
    data
  })
}