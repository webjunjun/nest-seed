const myApp = getApp()
import { baseImageUrl, publicUrl } from '../../utils/config'

Page({
  data: {
    mineBg: `${baseImageUrl}/mine/mine_bg.png`,
    avatarUrl: '../../static/default_avatar.png',
    realName: '',
    cellphone: ''
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
  // 初始化页面方法
  initPage() {
    const pageUser = myApp.globalData.userInfo
    this.setData({
      realName: pageUser.realName,
      cellphone: pageUser.phone.replace(/(?=(\d{4})+$)/g, '-'),
      avatarUrl: publicUrl + pageUser.avatar
    })
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../diner/index'
    })
  }
})
