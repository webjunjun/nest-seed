const myApp = getApp()
Page({
  data: {},
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
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '/pages/diner/diner'
    })
  },
  // 初始化页面方法
  initPage() {
    console.log('ok')
  }
})
