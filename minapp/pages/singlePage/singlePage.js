const myApp = getApp()
import { baseImageUrl } from '../../utils/config'

Page({
  data: {
    mineBg: `${baseImageUrl}/mine/mine_bg.png`,
    avatarUrl: '../../static/default_avatar.png',
    curTitle: ''
  },
  onLoad(option) {
    // 处理标题
    let curTitle = ''
    if (option.type === 'recipe') {
      curTitle = '本周用餐菜谱'
    }
    if (option.type === 'help') {
      curTitle = '使用帮助教程'
    }
    if (option.type === 'aboutus') {
      curTitle = '关于我们'
    }
    wx.setNavigationBarTitle({
      title: curTitle
    })
    this.setData({
      curTitle
    })
    if (myApp.globalData.hasLogin) {
      // 登录完成
      this.initPage();
    } else {
      // 等待登录完成后操作
      myApp.watchLoginStatus(() => this.initPage())
    }
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../diner/index'
    })
  },
  // 初始化页面方法
  initPage() {
    console.log('ok')
  }
})
