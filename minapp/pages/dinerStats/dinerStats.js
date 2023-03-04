const myApp = getApp()
import { baseImageUrl, publicUrl } from '../../utils/config'

Page({
  data: {
    dinerBg: `${baseImageUrl}/diner/diner_bg.png`,
    avatarUrl: '../../static/default_avatar.png',
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
    curTitle: '',
    curType: ''
  },
  onLoad(option) {
    let curTitle = ''
    if (option.type === 'today') {
      curTitle = '今日就餐预约'
    }
    if (option.type === 'visit') {
      curTitle = '今日来客就餐'
    }
    wx.setNavigationBarTitle({
      title: curTitle
    })
    this.setData({
      curTitle,
      curType: option.type
    })
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
  goMinePage() {
    wx.navigateTo({
      url: '/pages/personInfo/personInfo',
    })
  },
  navDinerStat(e) {
    const curItem = e.currentTarget.dataset.item
    if (this.data.curType === curItem.urlQuery) {
      return false
    }
    wx.navigateTo({
      url: '/pages/dinerStats/dinerStats?type=' + curItem.urlQuery
    })
  }
})
