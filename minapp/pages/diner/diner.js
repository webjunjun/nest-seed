const myApp = getApp()
import { baseImageUrl } from '../../utils/config'

Page({
  data: {
    dinerBg: `${baseImageUrl}/diner/diner_bg.png`,
    avatarUrl: '../../static/default_avatar.png',
    publishUrl: `${baseImageUrl}/publish.png`,
    statsArr: [{
      num: 18,
      type: '早餐'
    }, {
      num: 5,
      type: '中餐'
    }, {
      num: 350,
      type: '晚餐'
    }]
  },
  onLoad() {
    if (myApp.globalData.hasLogin) {
      // 登录完成
      this.initPage();
    } else {
      // 等待登录完成后操作
      myApp.watchLoginStatus(() => this.initPage())
    }
  },
  onShow() {
    // 自定义菜单选中tab
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
  },
  // 初始化页面方法
  initPage() {
    console.log('ok')
  },
  goMinePage() {
    wx.navigateTo({
      url: '/pages/personInfo/personInfo',
    })
  },
  publishDiner() {
    wx.navigateTo({
      url: '/pages/publishDiner/publishDiner?type=add',
    })
  },
  bindEdit() {
    wx.navigateTo({
      url: '/pages/publishCommute/publishCommute?type=edit',
    })
  }
})
