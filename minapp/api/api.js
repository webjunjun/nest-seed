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

// 发布来客就餐
export const publishVisitorDiner = (data) => {
  return request({
    url: '/visitor/publish',
    method: 'POST',
    data
  })
}

// 编辑来客就餐
export const modifyVisitorDiner = (data) => {
  return request({
    url: '/visitor/modify',
    method: 'POST',
    data
  })
}

// 删除来客就餐
export const deleteVisitorDiner = (data) => {
  return request({
    url: '/visitor/delete',
    method: 'POST',
    data
  })
}

// 查询单条来客就餐
export const queryVisitorDiner = (data) => {
  return request({
    url: '/visitor/queryOne',
    method: 'POST',
    data
  })
}

// 查询来客列表
export const queryVisitorList = (data) => {
  return request({
    url: '/visitor/list',
    method: 'POST',
    data
  })
}

// 我的明日三餐状态
// 查询到就是已预约，未查询到就是未预约
export const queryMineTomorrow = (data) => {
  return request({
    url: '/visitor/list',
    method: 'POST',
    data
  })
}

// 预约明日三餐
export const bookMineTomorrow = (data) => {
  return request({
    url: '/visitor/list',
    method: 'POST',
    data
  })
}

// 取消预约明日三餐
export const cancelMineTomorrow = (data) => {
  return request({
    url: '/visitor/list',
    method: 'POST',
    data
  })
}

// 我的今日三餐状态
export const queryMineToday = (data) => {
  return request({
    url: '/visitor/list',
    method: 'POST',
    data
  })
}

// 今日三餐预约列表
export const queryTodayStatList = (data) => {
  return request({
    url: '/visitor/list',
    method: 'POST',
    data
  })
}

// 今日来客就餐人数列表
export const queryVisitorStatList = (data) => {
  return request({
    url: '/visitor/list',
    method: 'POST',
    data
  })
}

// 我的三餐统计记录
export const queryMineTodayList = (data) => {
  return request({
    url: '/visitor/list',
    method: 'POST',
    data
  })
}
