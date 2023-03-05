import { request } from '../utils/request'

/**
 * common
 */

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

/**
 * 我的tab
 */

// 更新个人信息
export const wechatUserUpdate = (data) => {
  return request({
    url: '/user/update',
    method: 'POST',
    data
  })
}

/**
 * 出行tab
 */

// 发布出行
export const publishCommuteInfo = (data) => {
  return request({
    url: '/commute/create',
    method: 'POST',
    data
  })
}

// 编辑出行
export const modifyCommuteInfo = (data) => {
  return request({
    url: '/commute/update',
    method: 'POST',
    data
  })
}

// 查询出行列表
export const postCommuteList = (data) => {
  return request({
    url: '/commute/list',
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

// 删除单条出行
export const deleteCommuteOne = (data) => {
  return request({
    url: '/commute/one',
    method: 'POST',
    data
  })
}

// 查询是否预约
export const resultCommuteBooking = (data) => {
  return request({
    url: '/commute/resultBooking',
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

// 取消预约出行
export const rejectCommuteBooking = (data) => {
  return request({
    url: '/commute/cnacelBooking',
    method: 'POST',
    data
  })
}

/**
 * 就餐tab
 */
