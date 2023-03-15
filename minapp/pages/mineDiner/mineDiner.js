const myApp = getApp()
import { baseImageUrl, publicUrl } from '../../utils/config'
import { queryMineTodayList } from '../../api/api'
import { formatDate3, getDateStr } from '../../utils/util'

Page({
  data: {
    mineBg: `${baseImageUrl}/mine/mine_bg.png`,
    avatarUrl: '../../static/default_avatar.png',
    realName: '',
    cellphone: '',
    pageUser: {},
    noMore: false,
    list: [],
    currentPage: 1,
    pageSize: 10
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
      pageUser,
      realName: pageUser.realName,
      cellphone: pageUser.phone.replace(/(?=(\d{4})+$)/g, '-'),
      avatarUrl: publicUrl + pageUser.avatar,
      todayDate: getDateStr(0)
    })
    this.getInitData()
  },
  getInitData() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    queryMineTodayList({
      eaterId: this.data.pageUser.id,
      pageSize: this.data.pageSize,
      currentPage: this.data.currentPage
    })
      .then((res) => {
        wx.hideLoading()
        const json = res.data
        json.list.forEach(ele => {
          ele.newDinerDate = formatDate3(new Date(ele.dinerDate))
        })
        if (json.list.length < this.data.pageSize) {
          // 显示到底 禁止触底加载了
          this.setData({
            list: this.data.list.concat(json.list),
            noMore: true
          })
        } else {
          this.setData({
            list: this.data.list.concat(json.list),
            currentPage: this.data.currentPage + 1,
            noMore: false
          })
        }
      })
  },
  onReachBottom() {
    if (this.data.noMore) {
      return false
    } else {
      this.getInitData()
    }
  }
})
