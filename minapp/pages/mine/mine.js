const myApp = getApp()
import { baseImageUrl, publicUrl } from '../../utils/config'
import { queryTomorrowBooking, queryHairBooking, deleteHairBooking, hairBooking } from '../../api/api'
import { formatDate2, getWeekDate, timeIsBetween } from '../../utils/util'

Page({
  data: {
    mineBg: `${baseImageUrl}/mine/mine_bg.png`,
    avatarUrl: '../../static/default_avatar.png',
    mineDiner: `${baseImageUrl}/mine/diner_mine.png`,
    mineTravel: `${baseImageUrl}/mine/car_mine.png`,
    mineIcon1: `${baseImageUrl}/mine/modify_mine.png`,
    mineIcon2: `${baseImageUrl}/mine/push_mine.png`,
    mineIcon3: `${baseImageUrl}/mine/help_mine.png`,
    realName: '',
    cellphone: '',
    pageUser: {},
    booking: {},
    weekId: null
  },
  onLoad() {
    if (myApp.globalData.hasLogin) {
      // 登录完成
      this.initPage()
    } else {
      // 等待登录完成后操作
      myApp.watchLoginStatus(() => this.initPage())
    }
  },
  onShow() {
    // 自定义菜单选中tab
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
    if (myApp.globalData.hasLogin) {
      this.initData();
    }
  },
  // 初始化页面方法
  initPage() {
    this.initData()
    this.getDinerBookingDate()
  },
  initData() {
    const pageUser = myApp.globalData.userInfo
    this.setData({
      pageUser,
      realName: pageUser.realName,
      cellphone: pageUser.phone.replace(/(?=(\d{4})+$)/g, '-'),
      avatarUrl: publicUrl + pageUser.avatar
    })
  },
  bindSwitchUrl(e) {
    const { url } = e.currentTarget.dataset
    if (url === '/pages/publishDiner/publishDiner?type=add') {
      // 来客就餐发布校验是否到预约时间
      const datas = this.data.booking
      const posTime = timeIsBetween(new Date(),datas.bookingStart, datas.bookingEnd)
      if (posTime === 'left') {
        wx.showToast({
          title: '今日来客就餐预约未开始',
          icon: 'none',
          duration: 2000,
          mask: true
        })
        return false
      }
      if (posTime === 'right') {
        wx.showToast({
          title: '今日来客就餐预约已截止',
          icon: 'none',
          duration: 2000,
          mask: true
        })
        return false
      }
    }
    if (url === 'haircut') {
      this.bindHaircut()
      return false
    }
    wx.navigateTo({ url })
  },
  getDinerBookingDate() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    queryTomorrowBooking()
      .then((res) => {
        const json = res.data.visit; // 获取今日来客就餐预约开放的时间
        this.setData({
          booking: {
            bookingStart: json.bookingStart,
            bookingEnd: json.bookingEnd
          }
        })
        wx.hideLoading()
      })
  },
  bindHaircut() {
    // 周六周日不让预约
    const now = new Date()
    const day = now.getDay()
    if (day === 6 || day === 0) {
      wx.showToast({
        title: '周末不支持本周理发预约',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return false
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const weekObj = getWeekDate()
    queryHairBooking({
      haircutId: this.data.pageUser.id,
      haircutStart: `${formatDate2(weekObj.monday)} 00:00:00`,
      haircutEnd: `${formatDate2(weekObj.friday)} 23:59:59`
    })
      .then((response) => {
        wx.hideLoading()
        if (response.data) {
          this.setData({
            weekId: response.data.id
          })
          wx.showModal({
            title: '提示',
            content: '已预约本周理发, 是否取消预约',
            cancelText: '取消预约',
            confirmText: '保持预约',
            success: (res) => {
              if (!res.confirm) {
                this.cancelBooking()
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '确定预约本周理发嘛',
            success: (res) => {
              if (res.confirm) {
                this.confirmBooking()
              }
            }
          })
        }
      })
  },
  confirmBooking() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const weekObj = getWeekDate()
    hairBooking({
      haircutId: this.data.pageUser.id,
      haircutName: this.data.pageUser.realName,
      haircutStart: `${formatDate2(weekObj.monday)} 00:00:00`,
      haircutEnd: `${formatDate2(weekObj.friday)} 23:59:59`
    })
      .then((res) => {
        wx.hideLoading()
        if (res.data) {
          wx.showModal({
            title: '提示',
            content: '预约理发成功, 请于本周周一至周五完成理发',
            showCancel: false,
            confirmText: '确定',
            success: () => {}
          })
        }
      })
  },
  cancelBooking() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    deleteHairBooking({
      id: this.data.weekId
    })
      .then((res) => {
        wx.hideLoading()
        wx.showToast({
          title: res.data,
          icon: 'success',
          duration: 2000,
          mask: true
        })
      })
  }
})
