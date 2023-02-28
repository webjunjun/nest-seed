const myApp = getApp()
import { baseImageUrl } from '../../utils/config'
import { formatTime } from '../../utils/util'

Page({
  data: {
    dinerBg: `${baseImageUrl}/diner/diner_bg.png`,
    avatarUrl: '../../static/default_avatar.png',
    statsArr: [{
      num: 18,
      type: '早餐'
    }, {
      num: 5,
      type: '中餐'
    }, {
      num: 350,
      type: '晚餐'
    }],
    dinerDate: '',
    curTitle: ''
  },
  onLoad(option) {
    let curTitle = ''
    if (option.type === 'add') {
      curTitle = '发布来客就餐预约'
    } else {
      curTitle = '编辑来客就餐预约'
    }
    this.setData({
      curTitle
    })
    wx.setNavigationBarTitle({
      title: curTitle
    })
    const currentDatetime = formatTime(new Date())
    this.setData({
      dinerDate: currentDatetime
    })
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
  handleChange(e) {
    this.setData({
      commuteDate: e.detail.dateString
    })
  },
  bindSubmit(e) {
    console.log(e)
  }
})
