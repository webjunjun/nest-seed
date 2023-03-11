import { addDinerBooking, modifyDinerBooking, queryDinerOne } from '../../../api/api'
import { formatTime } from '../../../utils/util'
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
      title: `${this.data.actionObj[option.action]}${option.type}${this.data.title}`
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
    this.setData({
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
        this.setData({
          history: {
            title: json.title,
            description: json.description
          }
        })
        wx.hideLoading()
      })
      .catch(() => {
        wx.hideLoading()
      })
  },
  submitSingle(e) {
    const formData = e.detail.value
    const contents = wx.getStorageSync('editorTxt')
    let msg = ''
    if (formData.title === '') {
      msg = '请输入标题'
    }
    if (!msg && formData.description === '') {
      msg = '请输入简述'
    }
    if (!msg && !contents) {
      msg = '请输入内容'
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
    const reqData = {
      ...formData,
      type: this.data.singleArray[this.data.single].value,
      content: contents
    }
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
            mask: true,
            success: () => {
              
            }
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
      .catch(() => {
        wx.hideLoading()
      })
  },
  bindBookingStart(e) {
    this.setData({
      bookingStart: e.detail.value
    })
  },
  bindBookingEnd(e) {
    this.setData({
      bookingEnd: e.detail.value
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
  },
})
