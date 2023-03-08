const myApp = getApp()
import { baseImageUrl, publicUrl } from '../../utils/config'

Page({
  data: {
    mineBg: `${baseImageUrl}/mine/mine_bg.png`,
    avatarUrl: '../../static/default_avatar.png',
    mineDiner: `${baseImageUrl}/mine/diner_mine.png`,
    mineTravel: `${baseImageUrl}/mine/car_mine.png`,
    mineIcon1: `${baseImageUrl}/mine/modify_mine.png`,
    mineIcon2: `${baseImageUrl}/mine/push_mine.png`,
    mineIcon3: `${baseImageUrl}/mine/help_mine.png`,
    role: 1,
    realName: '',
    cellphone: '',
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
    // 只需执行一次的
    this.initData()
  },
  initData() {
    // 每次显示都执行的
    const pageUser = myApp.globalData.userInfo
    this.setData({
      realName: pageUser.realName,
      cellphone: pageUser.phone.replace(/(?=(\d{4})+$)/g, '-'),
      avatarUrl: publicUrl + pageUser.avatar
    })
  },
  // 事件处理函数
  bindSwitchUrl(e) {
    const { url } = e.currentTarget.dataset
    wx.navigateTo({ url })
  }
})
