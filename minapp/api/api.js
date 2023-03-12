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

// 查询用户列表
export const queryUserList = (data) => {
  return request({
    url: '/user/list',
    method: 'POST',
    data
  })
}

// 删除用户
export const deleteUser = (data) => {
  return request({
    url: '/user/delete',
    method: 'POST',
    data
  })
}

// 更新用户角色
export const updateUserRole = (data) => {
  return request({
    url: '/user/role',
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
    url: '/commute/delete',
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

// 查询参与该出行的预约信息
export const getCommuteBooking = (data) => {
  return request({
    url: '/commute/item',
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

// 查询预约时间段列表
export const queryDinerList = (data) => {
  return request({
    url: '/diner/list',
    method: 'POST',
    data
  })
}

// 查询单条预约时间段
export const queryDinerOne = (data) => {
  return request({
    url: '/diner/query',
    method: 'POST',
    data
  })
}

// 删除单条预约时间段
export const deleteDinerOne = (data) => {
  return request({
    url: '/diner/delete',
    method: 'POST',
    data
  })
}

// 设置预约时间段
export const addDinerBooking = (data) => {
  return request({
    url: '/diner/booking',
    method: 'POST',
    data
  })
}

// 修改预约时间段
export const modifyDinerBooking = (data) => {
  return request({
    url: '/diner/update',
    method: 'POST',
    data
  })
}

// 查询明日最新预约时间
export const queryTomorrowBooking = (data) => {
  return request({
    url: '/diner/tomorrow',
    method: 'POST',
    data
  })
}

// 查询到就是已预约，未查询到就是未预约
export const queryMineTwoDays = (data) => {
  return request({
    url: '/dinerItem/twoDays',
    method: 'POST',
    data
  })
}

// 预约/取消明日三餐
export const bookMineTomorrow = (data) => {
  return request({
    url: '/dinerItem/booking',
    method: 'POST',
    data
  })
}

// 所有人今日三餐预约列表
export const queryTodayStatList = (data) => {
  return request({
    url: '/dinerItem/list',
    method: 'POST',
    data
  })
}

// 我的三餐统计记录
export const queryMineTodayList = (data) => {
  return request({
    url: '/dinerItem/mineList',
    method: 'POST',
    data
  })
}

// 查询单页面列表
export const querySingleList = (data) => {
  return request({
    url: '/single/list',
    method: 'POST',
    data
  })
}

// 增加单页面
export const addSinglePage = (data) => {
  return request({
    url: '/single/add',
    method: 'POST',
    data
  })
}

// 编辑单页面
export const editSinglePage = (data) => {
  return request({
    url: '/single/update',
    method: 'POST',
    data
  })
}

// 删除单页面
export const deleteSinglePage = (data) => {
  return request({
    url: '/single/delete',
    method: 'POST',
    data
  })
}

// 查询单页面记录
export const querySingleOne = (data) => {
  return request({
    url: '/single/query',
    method: 'POST',
    data
  })
}
