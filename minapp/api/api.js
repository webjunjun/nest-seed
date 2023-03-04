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
    url: '/commute/create',
    method: 'POST',
    data
  })
}

// 出行列表
export const postCommuteList = (data) => {
  return request({
    url: '/commute/list',
    method: 'POST',
    data
  })
}

// 预约出行
export const postCommuteBooking = (data) => {
  return request({
    url: '/commute/booking',
    method: 'POST',
    data
  })
}

// 查询单条出行
export const postCommuteOne = (data) => {
  return request({
    url: '/commute/one',
    method: 'POST',
    data
  })
}
