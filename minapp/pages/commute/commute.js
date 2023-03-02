const myApp = getApp()
import { baseImageUrl, publicUrl } from '../../utils/config'

Page({
  data: {
    commuteBg: `${baseImageUrl}/commute/commute_bg.png`,
    avatarUrl: '../../static/default_avatar.png',
    publishUrl: `${baseImageUrl}/publish.png`,
    dialogUrl: `${baseImageUrl}/commute/notice_bg.png`,
    noticeUrl: `${baseImageUrl}/commute/notice.png`,
    realName: '',
    cellphone: '',
    statsArr: [{
      num: 18,
      type: '已发布'
    }, {
      num: 5,
      type: '已拼车'
    }, {
      num: 350,
      type: '总出行'
    }],
    isShow: false
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
        selected: 1
      })
    }
    if (myApp.globalData.hasLogin) {
      this.initData();
    }
  },
  // 初始化页面方法
  initPage() {
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
  goMinePage() {
    wx.navigateTo({
      url: '/pages/personInfo/personInfo',
    })
  },
  publishCommute() {
    wx.navigateTo({
      url: '/pages/publishCommute/publishCommute?type=add',
    })
  },
  bindEdit() {
    wx.navigateTo({
      url: '/pages/publishCommute/publishCommute?type=edit',
    })
  },
  bindBooking() {
    this.setData({
      isShow: true
    })
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1,
        isShowTabBar: false
      })
    }
  },
  bindCallphone() {
    wx.makePhoneCall({
      phoneNumber: '13112345678',
      success: () => {},
      fail: () => {}
    })
  },
  bindClosePopup() {
    this.setData({
      isShow: false
    })
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1,
        isShowTabBar: true
      })
    }
  }
})
