const myApp = getApp()
import { baseImageUrl } from '../../utils/config'

Page({
  data: {
    mineBg: `${baseImageUrl}/mine/mine_bg.png`,
    avatarUrl: '../../static/default_avatar.png'
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
  // 初始化页面方法
  initPage() {
    console.log('ok')
  },
  // 事件处理函数
  onChooseAvatar(e) {
    // e.detail 是临时路径，需要调用上传接口
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
  },
  bindSubmit(e) {
    const formData = e.detail.value
  }
})
