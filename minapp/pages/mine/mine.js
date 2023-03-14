const myApp = getApp()
import { baseImageUrl, publicUrl } from '../../utils/config'
import { queryTomorrowBooking } from '../../api/api'
import { timeIsBetween } from '../../utils/util'

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
    booking: {}
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
  }
})
