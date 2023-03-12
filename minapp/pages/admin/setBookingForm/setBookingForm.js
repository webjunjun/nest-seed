import { addDinerBooking, modifyDinerBooking, queryDinerOne } from '../../../api/api'
import { formatTime, getDateStr } from '../../../utils/util'
const myApp = getApp()

Page({
  data: {
    title: '预约时间设置',
    action: '',
    id: '',
    type: '',
    actionObj: {
      add: '设置',
      edit: '修改'
    },
    pageUser: {},
    eatDate: '',
    bookingStart: '',
    bookingEnd: '',
    morningStart: '',
    morningEnd: '',
    middayStart: '',
    middayEnd: '',
    eveningStart: '',
    eveningEnd: ''
  },
  onLoad(option) {
    wx.setNavigationBarTitle({
      title: `${this.data.actionObj[option.action]}${option.type}${this.data.title}`
    })
    this.setData({
      action: option.action,
      id: option.id || '',
      type: option.type,
      title: `${this.data.actionObj[option.action]}${option.type}${this.data.title}`,
      eatDate: getDateStr(1)
    })
    if (myApp.globalData.hasLogin) {
      // 登录完成
      this.initPage()
    } else {
      // 等待登录完成后操作
      myApp.watchLoginStatus(() => this.initPage())
    }
  },
  initPage() {
    const currentDatetime = formatTime(new Date())
    this.setData({
      bookingStart: currentDatetime,
      bookingEnd: currentDatetime,
      pageUser: myApp.globalData.userInfo
    })
    if (this.data.action === 'edit') {
      this.getDetailData()
    }
  },
  getDetailData() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    queryDinerOne({
      id: this.data.id
    })
      .then((res) => {
        const json = res.data
        if (this.data.type === '三餐') {
          this.setData({
            bookingStart: json.bookingStart,
            bookingEnd: json.bookingEnd,
            morningStart: json.morningStart,
            morningEnd: json.morningEnd,
            middayStart: json.middayStart,
            middayEnd: json.middayEnd,
            eveningStart: json.eveningStart,
            eveningEnd: json.eveningEnd,
            eatDate: json.eatDate
          })
        } else {
          this.setData({
            bookingStart: json.bookingStart,
            bookingEnd: json.bookingEnd,
            eatDate: json.eatDate
          })
        }
        wx.hideLoading()
      })
  },
  submitSingle() {
    const curType = this.data.type
    let sonReqData = null
    if (curType === '三餐') {
      sonReqData = {
        morningStart: this.data.morningStart,
        morningEnd: this.data.morningEnd,
        middayStart: this.data.middayStart,
        middayEnd: this.data.middayEnd,
        eveningStart: this.data.eveningStart,
        eveningEnd: this.data.eveningEnd
      }
    } else {
      sonReqData = {
        morningStart: '-',
        morningEnd: '-',
        middayStart: '-',
        middayEnd: '-',
        eveningStart: '-',
        eveningEnd: '-'
      }
    }
    const reqData = {
      bookingStart: this.data.bookingStart,
      bookingEnd: this.data.bookingEnd,
      ...sonReqData,
      eatDate: this.data.eatDate,
      type: this.data.type
    }
    let msg = ''
    if (reqData.bookingStart === '') {
      msg = '请选择预约开始时间'
    }
    if (!msg && reqData.bookingEnd === '') {
      msg = '请选择预约结束时间'
    }
    if (this.data.type === '三餐') {
      if (!msg && reqData.morningStart === '') {
        msg = '请选择早餐开始时间'
      }
      if (!msg && reqData.morningEnd === '') {
        msg = '请选择早餐结束时间'
      }
      if (!msg && reqData.middayStart === '') {
        msg = '请选择午餐开始时间'
      }
      if (!msg && reqData.middayEnd === '') {
        msg = '请选择午餐结束时间'
      }
      if (!msg && reqData.eveningStart === '') {
        msg = '请选择晚餐开始时间'
      }
      if (!msg && reqData.eveningEnd === '') {
        msg = '请选择晚餐结束时间'
      }
    }
    if (msg) {
      wx.showToast({
        title: msg,
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return false
    }
    // 校验用户数据
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let reqFuc = addDinerBooking
    if (this.data.action === 'edit') {
      reqFuc = modifyDinerBooking
      reqData.id = this.data.id
      reqData.lastModify = formatTime(new Date())
      reqData.updateId = this.data.pageUser.id
      reqData.updateName = this.data.pageUser.realName
    } else {
      reqData.createdId = this.data.pageUser.id
      reqData.createdName = this.data.pageUser.realName
    }
    reqFuc(reqData)
      .then(res => {
        wx.hideLoading()
        if (res.code === 1) {
          wx.showToast({
            title: res.data,
            icon: 'success',
            duration: 2000,
            mask: true
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            })
          }, 1500)
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }
      })
  },
  bindEatDate(e) {
    this.setData({
      eatDate: e.detail.value
    })
  },
  bindBookingStart(e) {
    this.setData({
      bookingStart: e.detail.value || e.detail.dateString
    })
  },
  bindBookingEnd(e) {
    this.setData({
      bookingEnd: e.detail.value || e.detail.dateString
    })
  },
  bindMorningStart(e) {
    this.setData({
      morningStart: e.detail.value
    })
  },
  bindMorningEnd(e) {
    this.setData({
      morningEnd: e.detail.value
    })
  },
  bindMiddayStart(e) {
    this.setData({
      middayStart: e.detail.value
    })
  },
  bindMiddayEnd(e) {
    this.setData({
      middayEnd: e.detail.value
    })
  },
  bindEveningStart(e) {
    this.setData({
      eveningStart: e.detail.value
    })
  },
  bindEveningEnd(e) {
    this.setData({
      eveningEnd: e.detail.value
    })
  }
})
