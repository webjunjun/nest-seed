const myApp = getApp()
import { baseImageUrl, publicUrl } from '../../utils/config'
import { queryTodayStatList, queryVisitorList, queryTomorrowBooking } from '../../api/api'
import { timeIsBetween } from '../../utils/util'

Page({
  data: {
    dinerBg: `${baseImageUrl}/diner/diner_bg.png`,
    avatarUrl: '../../static/default_avatar.png',
    realName: '',
    cellphone: '',
    adminArr: [{
      num: 0,
      unit: '人',
      type: '今日早餐',
      urlQuery: 'today'
    }, {
      num: 0,
      unit: '人',
      type: '今日中餐',
      urlQuery: 'today'
    }, {
      num: 0,
      unit: '人',
      type: '今日晚餐',
      urlQuery: 'today'
    }, {
      num: 0,
      unit: '人',
      type: '来客就餐',
      urlQuery: 'visit'
    }],
    curTitle: '',
    curType: '',
    pageUser: {},
    noMore: false,
    list: [],
    currentPage: 1,
    pageSize: 10,
    visitAll: null
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
  onShow() {
    const dinerStats = wx.getStorageSync('dinerStats')
    if (dinerStats) {
      const dinerObj = JSON.parse(dinerStats)
      this.setData({
        adminArr: dinerObj.fourArr
      })
    }
  },
  // 初始化页面方法
  initPage() {
    const pageUser = myApp.globalData.userInfo
    this.setData({
      pageUser,
      realName: pageUser.realName,
      cellphone: pageUser.phone.replace(/(?=(\d{4})+$)/g, '-'),
      avatarUrl: publicUrl + pageUser.avatar
    })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    queryTomorrowBooking()
      .then((res) => {
        this.setData({
          visitAll: res.data.visit
        })
        if (this.data.curType === 'today') {
          this.getInitData()
        }
        if (this.data.curType === 'visit') {
          this.getVisitorList()
        }
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
  },
  getInitData() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    queryTodayStatList({
      pageSize: this.data.pageSize,
      currentPage: this.data.currentPage
    })
      .then((res) => {
        wx.hideLoading()
        const json = res.data
        json.list.forEach(ele => {
          ele.phone = ele.phone.replace(/(?=(\d{4})+$)/g, '-')
          ele.avatar = `${publicUrl}${ele.avatar}`
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
  getVisitorList() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    queryVisitorList({
      pageSize: this.data.pageSize,
      currentPage: this.data.currentPage
    })
      .then((res) => {
        wx.hideLoading()
        const mealsTomorrow = this.data.visitAll
        let betweens = ''
        const json = res.data
        const curUserId = this.data.pageUser.id
        json.list.forEach(ele => {
          betweens = timeIsBetween(new Date(ele.created), mealsTomorrow.bookingStart, mealsTomorrow.bookingEnd)
          ele.canEdit = betweens === 'center' ? true : false
          ele.dinerDate = ele.dinerDate.slice(0, 16)
          ele.curUserId = curUserId
        });
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
      if (this.data.curType === 'today') {
        this.getInitData()
      }
      if (this.data.curType === 'visit') {
        this.getVisitorList()
      }
    }
  }
})
