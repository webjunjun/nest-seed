const myApp = getApp()
import {
  queryVisitorList, queryTomorrowBooking, queryMineTwoDays, bookMineTomorrow, querySingleOne,
  queryDinerStats
} from '../../api/api'
import { baseImageUrl, publicUrl } from '../../utils/config'
import { formatDate4, timeIsBetween, formatDate } from '../../utils/util'

Page({
  data: {
    dinerBg: `${baseImageUrl}/diner/diner_bg.png`,
    avatarUrl: '../../static/default_avatar.png',
    publishUrl: `${baseImageUrl}/publish.png`,
    dialogUrl: `${baseImageUrl}/diner/recipe_top.png`,
    realName: '',
    cellphone: '',
    adminArr: [],
    commonArr: [],
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
    tomorrowData: {},
    weekMenu: {},
    visitAll: null,
    visitCountdown: {
      formatTime: '',
      restTime: 0
    },
    tomorrowCountdown: {
      formatTime: '',
      restTime: 0
    },
    timer: null
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
    if (myApp.globalData.refreshPage) {
      myApp.globalData.refreshPage = false
      this.setData({
        noMore: false,
        list: [],
        currentPage: 1,
        pageSize: 20
      })
      this.getVisitorList()
    }
  },
  initPage() {
    this.initData()
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let statsReq = {}
    if (this.data.pageUser.role === 3) {
      statsReq = {
        eaterId: this.data.pageUser.id
      }
    }
    Promise.all([queryTomorrowBooking(), queryMineTwoDays({
      eaterId: this.data.pageUser.id
    }), queryVisitorList({
      pageSize: this.data.pageSize,
      currentPage: this.data.currentPage
    }), queryDinerStats(statsReq)])
      .then((res) => {
        // 三餐可预约时间 默认当天12:00-00:00
        // 来客就餐可预约时间 默认当天12:00-第二天10:30
        const json1 = res[0].data
        if (json1.today) {
          const eatDateArr = json1.today.eatDate.split('-')
          json1.today.newEatDate = `${eatDateArr[1]}/${eatDateArr[2]}`
        }
        let calcTime = {
          formatTime: '',
          restTime: 0
        }
        if (json1.visit) {
          // 首先算开始时间是否大于当前时间
          const betweens = timeIsBetween(new Date(), json1.visit.bookingStart, json1.visit.bookingEnd)
          if (betweens === 'left') {
            calcTime = {
              formatTime: formatDate(new Date(json1.visit.bookingStart)),
              restTime: -1
            }
          } else {
            calcTime = formatDate4(new Date(), json1.visit.bookingEnd)
          }
        }
        let calcTime2 = {
          formatTime: '',
          restTime: -1
        }
        if (json1.meal) {
          const eatDateArr = json1.meal.eatDate.split('-')
          json1.meal.newEatDate = `${eatDateArr[1]}/${eatDateArr[2]}`
          const betweens = timeIsBetween(new Date(), json1.meal.bookingStart, json1.meal.bookingEnd)
          if (betweens === 'left') {
            calcTime2 = {
              formatTime: formatDate(new Date(json1.meal.bookingStart)),
              restTime: -1
            }
          } else {
            calcTime2 = formatDate4(new Date(), json1.meal.bookingEnd)
          }
        }
        const json2 = res[1].data
        let todayData = {}
        if (json2.today) {
          todayData = {
            status1: json2.today.morning,
            status2: json2.today.midday,
            status3: json2.today.evening,
          }
          if (json1.today) {
            // 比较时间
            const totalDate = json1.today
            const dateNow = new Date()
            if (todayData.status1 !== -1) {
              const between1 = timeIsBetween(dateNow, `${totalDate.eatDate} ${totalDate.morningStart}:00`, `${totalDate.eatDate} ${totalDate.morningEnd}:00`)
              if (between1 === 'right') {
                todayData.status1 = 3
              } else if (between1 === 'left') {
                todayData.status1 = 1
              } else {
                todayData.status1 = 2
              }
            }
            if (todayData.status2 !== -1) {
              const between2 = timeIsBetween(dateNow, `${totalDate.eatDate} ${totalDate.middayStart}:00`, `${totalDate.eatDate} ${totalDate.middayEnd}:00`)
              if (between2 === 'right') {
                todayData.status2 = 3
              } else if (between2 === 'left') {
                todayData.status2 = 1
              } else {
                todayData.status2 = 2
              }
            }
            if (todayData.status3 !== -1) {
              const between3 = timeIsBetween(dateNow, `${totalDate.eatDate} ${totalDate.eveningStart}:00`, `${totalDate.eatDate} ${totalDate.eveningEnd}:00`)
              if (between3 === 'right') {
                todayData.status3 = 3
              } else if (between3 === 'left') {
                todayData.status3 = 1
              } else {
                todayData.status3 = 2
              }
            }
          }
        } else {
          todayData = {
            status1: -1,
            status2: -1,
            status3: -1
          }
        }
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
        const json3 = res[2].data
        json3.list.forEach(ele => {
          ele.dinerDate = ele.dinerDate.slice(0, 16)
        });
        const json4 = res[3].data
        let threeArr = []
        let fourArr = []
        if (this.data.pageUser.role === 3) {
          threeArr = [{
            num: json4.morning,
            unit: '次',
            type: '早餐',
            urlQuery: 'today'
          }, {
            num: json4.midday,
            unit: '次',
            type: '中餐',
            urlQuery: 'today'
          }, {
            num: json4.evening,
            unit: '次',
            type: '晚餐',
            urlQuery: 'today'
          }]
        } else {
          fourArr = [{
            num: json4.morning,
            unit: '人',
            type: '今日早餐',
            urlQuery: 'today'
          }, {
            num: json4.midday,
            unit: '人',
            type: '今日中餐',
            urlQuery: 'today'
          }, {
            num: json4.evening,
            unit: '人',
            type: '今日晚餐',
            urlQuery: 'today'
          }, {
            num: json4.visit,
            unit: '人',
            type: '来客就餐',
            urlQuery: 'visit'
          }]
        }
        wx.setStorageSync('dinerStats', JSON.stringify({
          fourArr,
          threeArr
        }))
        const sonData = {
          todayAll: json1.today,
          visitAll: json1.visit,
          tomorrowAll: json1.meal,
          tomorrowData,
          todayData,
          adminArr: fourArr,
          commonArr: threeArr,
          visitCountdown: calcTime,
          tomorrowCountdown: calcTime2,
          timer: setTimeout(() => {
            this.countdownFuc()
          }, 1000)
        }
        if (json3.list.length < this.data.pageSize) {
          // 显示到底 禁止触底加载了
          this.setData({
            list: this.data.list.concat(json3.list),
            noMore: true,
            ...sonData
          })
        } else {
          this.setData({
            list: this.data.list.concat(json3.list),
            currentPage: this.data.currentPage + 1,
            noMore: false,
            ...sonData
          })
        }
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
    clearTimeout(this.data.timer)
    this.setData({
      timer: setTimeout(() => {
        this.countdownFuc()
      }, 1000)
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
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    querySingleOne({
      type: 0
    })
      .then((res) => {
        const json = res.data
        wx.hideLoading()
        this.setData({
          weekMenu: json,
          isShow: true
        })
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
          this.getTabBar().setData({
            selected: 0,
            isShowTabBar: false
          })
        }
      })
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
        const curUserId = this.data.pageUser.id
        json.list.forEach(ele => {
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
  bookingMeal(e) {
    const paramsObj = e.currentTarget.dataset
    wx.showModal({
      title: '提示',
      content: paramsObj.diner == 1 ? '确定预约吗' : '确定取消吗',
      success: (res) => {
        if (res.confirm) {
          this.confirmBooking(e)
        }
      }
    })
  },
  confirmBooking(e) {
    const paramsObj = e.currentTarget.dataset
    const reqData = {
      dinerId: paramsObj.id,
      dinerDate: paramsObj.date,
      [paramsObj.today]: paramsObj.diner,
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
        title: paramsObj.diner == 1 ? '预约成功' : '取消成功',
        icon: 'success',
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
  },
  countdownFuc() {
    const mealsData = this.data.tomorrowAll
    const visitData = this.data.visitAll
    let calcTime2 = {
      formatTime: '',
      restTime: 0
    }
    let calcTime = {
      formatTime: '',
      restTime: 0
    }
    if (mealsData) {
      const betweens = timeIsBetween(new Date(), mealsData.bookingStart, mealsData.bookingEnd)
      if (betweens === 'left') {
        calcTime = {
          formatTime: formatDate(new Date(mealsData.bookingStart)),
          restTime: -1
        }
      } else {
        calcTime = formatDate4(new Date(), mealsData.bookingEnd)
      }
    }
    if (visitData) {
      const betweens = timeIsBetween(new Date(), visitData.bookingStart, visitData.bookingEnd)
      if (betweens === 'left') {
        calcTime2 = {
          formatTime: formatDate(new Date(visitData.bookingStart)),
          restTime: -1
        }
      } else {
        calcTime2 = formatDate4(new Date(), visitData.bookingEnd)
      }
    }
    if (calcTime.restTime <= 0 && calcTime2.restTime <= 0) {
      clearTimeout(this.data.timer)
    }
    this.setData({
      tomorrowCountdown: calcTime,
      visitCountdown: calcTime2,
      timer: setTimeout(() => {
        this.countdownFuc()
      }, 1000)
    })
  },
  onReachBottom() {
    if (this.data.noMore) {
      return false
    } else {
      this.getVisitorList()
    }
  },
  onHide() {
    clearTimeout(this.data.timer);
  },
  onUnload() {
    clearTimeout(this.data.timer);
  }
})
