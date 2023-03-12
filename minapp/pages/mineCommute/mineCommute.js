const myApp = getApp()
import { postCommuteList } from '../../api/api'
import { baseImageUrl, publicUrl } from '../../utils/config'
import { formatDate } from '../../utils/util'

Page({
  data: {
    mineBg: `${baseImageUrl}/mine/mine_bg.png`,
    avatarUrl: '../../static/default_avatar.png',
    realName: '',
    cellphone: '',
    pageUser: {},
    pageSize: 20,
    currentPage: 1,
    list: [],
    noMore: false
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
    if (myApp.globalData.hasLogin) {
      this.initData()
    }
  },
  // 初始化页面方法
  initPage() {
    this.initData()
    // 获取出行列表
    this.getCommuteList()
  },
  initData() {
    const pageUser = myApp.globalData.userInfo
    this.setData({
      pageUser: pageUser,
      realName: pageUser.realName,
      cellphone: pageUser.phone.replace(/(?=(\d{4})+$)/g, '-'),
      avatarUrl: publicUrl + pageUser.avatar
    })
  },
  bindEdit(e) {
    wx.navigateTo({
      url: '/pages/publishCommute/publishCommute?type=edit&id=' + e.currentTarget.dataset.commute,
    })
  },
  getCommuteList() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    postCommuteList({
      createdId: this.data.pageUser.id,
      pageSize: this.data.pageSize,
      currentPage: this.data.currentPage
    })
      .then((res) => {
        wx.hideLoading()
        const json = res.data
        const curUserId = this.data.pageUser.id
        const curTime = new Date(res.timestamp).getTime()
        json.list.forEach(ele => {
          ele.canBooking = new Date(ele.commuteDate).getTime() > curTime ? true : false
          ele.newCommuteDate = formatDate(new Date(ele.commuteDate))
          ele.avatar = publicUrl + ele.avatar
          ele.curUserId = curUserId
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
            noMore: false,
            currentPage: this.data.currentPage + 1
          })
        }
      })
  },
  onReachBottom() {
    if (this.data.noMore) {
      return false
    } else {
      this.getCommuteList()
    }
  }
})
