const myApp = getApp()
import {
  queryVisitorList, queryTomorrowBooking, queryMineTwoDays, bookMineTomorrow, querySingleOne,
  queryDinerStats
} from '../../api/api'
import { baseImageUrl, publicUrl } from '../../utils/config'
import { formatDate4, timeIsBetween, formatDate, getDateStr } from '../../utils/util'

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
    pageSize: 10,
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
  async onShow() {
    // 自定义菜单选中tab
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    if (myApp.globalData.hasLogin) {
      this.initData()
      if (myApp.globalData.refreshPage) {
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        this.setData({
          currentPage: 1,
          pageSize: 10
        })
        await this.getVisitorList()
        wx.hideLoading()
      }
    }
  },
  async initPage() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.initData()
    await this.getStatsInfo()
    await this.bookingInfo()
    await this.mineTwosInfo()
    await this.getVisitorList()
    wx.hideLoading()
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
    const mealsTomorrow = this.data.visitAll
    const betweens = timeIsBetween(new Date(), mealsTomorrow.bookingStart, mealsTomorrow.bookingEnd)
    if (betweens === 'right') {
      wx.showToast({
        title: '来客就餐预约已截止',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return false
    } else if (betweens === 'left') {
      wx.showToast({
        title: '来客就餐预约未开始',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return false
    }
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
  async mineTwosInfo() {
    const res = await queryMineTwoDays({
      eaterId: this.data.pageUser.id
    }).catch(() => {})
    if (!res) {
      return false
    }
    const json = res.data
    let todayData = {}
    if (json.today) {
      // 存在时 1预约/-1未预约
      todayData = {
        status1: json.today.morning,
        status2: json.today.midday,
        status3: json.today.evening,
      }
      // 判断今日三餐在今日的状态变化
      if (this.data.todayAll) {
        const totalDate = this.data.todayAll
        const dateNow = new Date()
        const between1 = timeIsBetween(dateNow, `${totalDate.eatDate} ${totalDate.morningStart}:00`, `${totalDate.eatDate} ${totalDate.morningEnd}:00`)
        const between2 = timeIsBetween(dateNow, `${totalDate.eatDate} ${totalDate.middayStart}:00`, `${totalDate.eatDate} ${totalDate.middayEnd}:00`)
        const between3 = timeIsBetween(dateNow, `${totalDate.eatDate} ${totalDate.eveningStart}:00`, `${totalDate.eatDate} ${totalDate.eveningEnd}:00`)
        const betweenArr = [between1, between2, between3]
        betweenArr.forEach((ele, index) => {
          if (todayData['status' + index] !== -1) {
            if (ele === 'right') {
              todayData['status' + index] = 3
            } else if (ele === 'left') {
              todayData['status' + index] = 1
            } else {
              todayData['status' + index] = 2
            }
          }
        })
      }
    } else {
      todayData = { status1: -1, status2: -1, status3: -1 }
    }
    let tomorrowData = {}
    if (json.tomorrow) {
      tomorrowData = {
        bookingId: json.tomorrow.id || 'system',
        status1: json.tomorrow.morning,
        status2: json.tomorrow.midday,
        status3: json.tomorrow.evening
      }
    } else {
      tomorrowData = { bookingId: '', status1: -1, status2: -1, status3: -1 }
    }
    this.setData({
      tomorrowData,
      todayData,
      timer: setTimeout(() => {
        this.countdownFuc()
      }, 1000)
    })
  },
  async bookingInfo() {
    // 查询今日三餐、明日三餐、来客预约时间等数据
    // 三餐可预约时间 默认当天12:00-00:00
    // 来客就餐可预约时间 默认当天12:00-第二天10:30
    const res = await queryTomorrowBooking().catch(() => {})
    if (!res) {
      return false
    }
    const json = res.data
    if (json.today) {
      // 转换成今日三餐需要的日期格式
      const eatDateArr = json.today.eatDate.split('-')
      json.today.newEatDate = `${eatDateArr[1]}/${eatDateArr[2]}`
    }
    let calcMorrowTime = {
      formatTime: '',
      restTime: -1
    }
    if (json.meal) {
      // 转换成明日三餐需要的日期格式
      const eatDateArr = json.meal.eatDate.split('-')
      json.meal.newEatDate = `${eatDateArr[1]}/${eatDateArr[2]}`
      // 明日三餐预约的开启时间/结束时间格式化
      const betweens = timeIsBetween(new Date(), json.meal.bookingStart, json.meal.bookingEnd)
      if (betweens === 'left') {
        calcMorrowTime = {
          formatTime: formatDate(new Date(json.meal.bookingStart)),
          restTime: -1
        }
      } else {
        calcMorrowTime = formatDate4(new Date(), json.meal.bookingEnd)
      }
    }
    let calcVisitTime = {
      formatTime: '',
      restTime: 0
    }
    if (json.visit) {
      // 来客就餐预约的开启时间/结束时间格式化
      const betweens = timeIsBetween(new Date(), json.visit.bookingStart, json.visit.bookingEnd)
      if (betweens === 'left') {
        calcVisitTime = {
          formatTime: formatDate(new Date(json.visit.bookingStart)),
          restTime: -1
        }
      } else {
        calcVisitTime = formatDate4(new Date(), json.visit.bookingEnd)
      }
    }
    this.setData({
      todayAll: json.today,
      visitAll: json.visit,
      tomorrowAll: json.meal,
      visitCountdown: calcVisitTime,
      tomorrowCountdown: calcMorrowTime
    })
  },
  async getStatsInfo() {
    const res = await queryDinerStats({
      id: this.data.pageUser.id
    }).catch(() => {})
    if (!res) {
      return false
    }
    const json = res.data
    let threeArr = []
    let fourArr = []
    if (this.data.pageUser.role === 3) {
      threeArr = [
        { num: json.morning, unit: '次', type: '早餐', urlQuery: 'today' },
        { num: json.midday, unit: '次', type: '中餐', urlQuery: 'today' },
        { num: json.evening, unit: '次', type: '晚餐', urlQuery: 'today'}
      ]
    } else {
      fourArr = [
        { num: json.morning, unit: '人', type: '今日早餐', urlQuery: 'today' },
        { num: json.midday, unit: '人', type: '今日中餐', urlQuery: 'today' },
        { num: json.evening, unit: '人', type: '今日晚餐', urlQuery: 'today'},
        { num: json.visit, unit: '人', type: '来客就餐', urlQuery: 'visit'}
      ]
    }
    this.setData({
      adminArr: fourArr,
      commonArr: threeArr
    })
    wx.setStorageSync('dinerStats', JSON.stringify({ fourArr, threeArr }))
  },
  async getVisitorList() {
    const res = await queryVisitorList({
      dinerDateStart: getDateStr(0),
      dinerDateEnd: getDateStr(6),
      pageSize: this.data.pageSize,
      currentPage: this.data.currentPage
    }).catch(() => {})
    if (!res) {
      return false
    }
    if (myApp.globalData.refreshPage) {
      this.setData({
        noMore: false,
        list: []
      })
      myApp.globalData.refreshPage = false
    }
    const mealsTomorrow = this.data.visitAll
    let betweens = ''
    const json = res.data
    const curUserId = this.data.pageUser.id
    json.list.forEach(ele => {
      // betweens = timeIsBetween(new Date(ele.created), mealsTomorrow.bookingStart, mealsTomorrow.bookingEnd)
      betweens = new Date(ele.dinerDate).getTime() - new Date().getTime()
      // ele.canEdit = betweens === 'center' ? true : false
      ele.canEdit = betweens > 0 ? true : false
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
  },
  bookingMeal(e) {
    // 判断是否到预约时间
    const mealsTomorrow = this.data.tomorrowAll
    const betweens = timeIsBetween(new Date(), mealsTomorrow.bookingStart, mealsTomorrow.bookingEnd)
    if (betweens === 'right') {
      wx.showToast({
        title: '预约已截止, 请等待下次',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return false
    } else if (betweens === 'left') {
      wx.showToast({
        title: '预约未开始, 请稍后再来',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return false
    }
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
      // dinerId: paramsObj.id,
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
        if (json.tomorrow) {
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
  async onPullDownRefresh() {
    this.setData({
      currentPage: 1,
      pageSize: 10
    })
    myApp.globalData.refreshPage = true
    await this.initPage()
    wx.stopPullDownRefresh()
  },
  async onReachBottom() {
    if (this.data.noMore) {
      return false
    } else {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      await this.getVisitorList()
      wx.hideLoading()
    }
  },
  onHide() {
    clearTimeout(this.data.timer);
  },
  onUnload() {
    clearTimeout(this.data.timer);
  }
})
