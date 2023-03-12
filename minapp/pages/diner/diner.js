const myApp = getApp()
import { queryVisitorList, queryTomorrowBooking, queryMineTwoDays, bookMineTomorrow } from '../../api/api'
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
    isShow: false,
    loading: true,
    pageUser: {},
    noMore: false,
    list: [],
    currentPage: 1,
    pageSize: 20,
    todayAll: null,
    tomorrowAll: null,
    todayData: {},
    tomorrowData: {}
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
    if (myApp.globalData.hasLogin) {
      this.initData()
    }
  },
  initPage() {
    this.initData()
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    Promise.all([queryTomorrowBooking(), queryMineTwoDays({
      eaterId: this.data.pageUser.id
    }), queryVisitorList({
      pageSize: this.data.pageSize,
      currentPage: this.data.currentPage
    })])
      .then((res) => {
        // 三餐可预约时间 默认当天12:00-00:00
        // 来客就餐可预约时间 默认当天12:00-第二天10:30
        const json1 = res[0].data
        if (json1.today) {
          const eatDateArr = json1.today.eatDate.split('-')
          json1.today.newEatDate = `${eatDateArr[1]}/${eatDateArr[2]}`
        }
        if (json1.meal) {
          const eatDateArr = json1.meal.eatDate.split('-')
          json1.meal.newEatDate = `${eatDateArr[1]}/${eatDateArr[2]}`
        }
        const json2 = res[1].data
        let tomorrowData = {}
        if (json2.tomorrow && json2.tomorrow.dinerId === json1.meal.id) {
          tomorrowData = {
            bookingId: json2.tomorrow.id,
            status1: json2.tomorrow.morning,
            status2: json2.tomorrow.midday,
            status3: json2.tomorrow.evening
          }
        } else {
          tomorrowData = {
            bookingId: '',
            status1: -1,
            status2: -1,
            status3: -1
          }
        }
        // todayData.status1
        // tomorrowData.status1 = true
        // tomorrowData.status2 = true
        // tomorrowData.status3 = true
        const json3 = res[2].data
        json3.list.forEach(ele => {
          ele.dinerDate = ele.dinerDate.slice(0, 16)
        });
        if (json3.list.length < this.data.pageSize) {
          // 显示到底 禁止触底加载了
          this.setData({
            list: this.data.list.concat(json3.list),
            noMore: true,
            todayAll: json1.today,
            tomorrowAll: json1.meal,
            tomorrowData
          })
        } else {
          this.setData({
            list: this.data.list.concat(json3.list),
            currentPage: this.data.currentPage + 1,
            noMore: false,
            todayAll: json1.today,
            tomorrowAll: json1.meal,
            tomorrowData
          })
        }
        wx.hideLoading()
      })
      .catch(() => {
        wx.hideLoading()
      })
  },
  initData() {
    const curUser = myApp.globalData.userInfo
    if (curUser) {
      this.setData({
        pageUser: curUser,
        realName: curUser.realName,
        cellphone: curUser.phone.replace(/(?=(\d{4})+$)/g, '-'),
        avatarUrl: publicUrl + curUser.avatar,
        loading: false
      })
    }
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
  },
  bindEdit(e) {
    wx.navigateTo({
      url: '/pages/publishDiner/publishDiner?type=edit&id=' + e.currentTarget.dataset.visitor,
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
        const json = res.data
        json.list.forEach(ele => {
          ele.dinerDate = ele.dinerDate.slice(0, 16)
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
      .catch(() => {
        wx.hideLoading()
      })
  },
  bookingMeal(e) {
    const paramsObj = e.currentTarget.dataset
    const reqData = {
      dinerId: paramsObj.id,
      dinerDate: paramsObj.date,
      [paramsObj.type]: paramsObj.diner,
      type: paramsObj.type,
      eaterId: this.data.pageUser.id,
      eater: this.data.pageUser.realName
    }
    if (paramsObj.booking) {
      reqData.id = paramsObj.booking
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    bookMineTomorrow(reqData)
    .then((res) => {
      wx.hideLoading()
      wx.showToast({
        title: paramsObj.diner == 1 ? '明日就餐预约成功' : '取消明日就餐成功',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      const json = res.data
        let tomorrowData = {}
        if (json.tomorrow && json.tomorrow.dinerId === this.data.tomorrowAll.id) {
          tomorrowData = {
            bookingId: json.tomorrow.id,
            status1: json.tomorrow.morning,
            status2: json.tomorrow.midday,
            status3: json.tomorrow.evening
          }
        } else {
          tomorrowData = {
            bookingId: '',
            status1: -1,
            status2: -1,
            status3: -1
          }
        }
        this.setData({
          tomorrowData
        })
    })
    .catch(() => {
      wx.hideLoading()
    })
  },
  onReachBottom() {
    if (this.data.noMore) {
      return false
    } else {
      this.getVisitorList()
    }
  }
})
