const myApp = getApp()
import { baseImageUrl, publicUrl } from '../../utils/config'

Page({
  data: {
    dinerBg: `${baseImageUrl}/diner/diner_bg.png`,
    avatarUrl: '../../static/default_avatar.png',
    publishUrl: `${baseImageUrl}/publish.png`,
    dialogUrl: `${baseImageUrl}/diner/recipe_top.png`,
    realName: '',
    cellphone: '',
    statsArr: [{
      num: 18,
      type: '今日早餐',
      urlQuery: 'today'
    }, {
      num: 5,
      type: '今日中餐',
      urlQuery: 'today'
    }, {
      num: 350,
      type: '今日晚餐',
      urlQuery: 'today'
    }, {
      num: 350,
      type: '来客就餐',
      urlQuery: 'visit'
    }],
    isShow: false
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
        selected: 0
      })
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
  },
  navDinerStat(e) {
    const curItem = e.currentTarget.dataset.item
    if (curItem.urlQuery === 'none') {
      return false
    }
    wx.navigateTo({
      url: '/pages/dinerStats/dinerStats?type=' + curItem.urlQuery
    })
  },
  openPopup() {
    this.setData({
      isShow: true
    })
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
        isShowTabBar: false
      })
    }
  },
  bindClosePopup() {
    this.setData({
      isShow: false
    })
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
        isShowTabBar: true
      })
    }
  }
})
