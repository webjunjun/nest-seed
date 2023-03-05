const myApp = getApp()
import { postCommuteList, resultCommuteBooking, postCommuteBooking, rejectCommuteBooking } from '../../api/api'
import { baseImageUrl, publicUrl } from '../../utils/config'
import { formatDate } from '../../utils/util'

Page({
  data: {
    commuteBg: `${baseImageUrl}/commute/commute_bg.png`,
    avatarUrl: '../../static/default_avatar.png',
    publishUrl: `${baseImageUrl}/publish.png`,
    dialogUrl: `${baseImageUrl}/commute/notice_bg.png`,
    noticeUrl: `${baseImageUrl}/commute/notice.png`,
    realName: '',
    cellphone: '',
    pageUser: {},
    statsArr: [{
      num: 18,
      type: '已发布'
    }, {
      num: 5,
      type: '已拼车'
    }, {
      num: 350,
      type: '总出行'
    }],
    isShow: false,
    bookingPhone: null,
    pageSize: 20,
    currentPage: 1,
    list: []
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
        selected: 1
      })
    }
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
    // 每次显示都执行的
    const curUser = myApp.globalData.userInfo
    this.setData({
      pageUser: curUser,
      realName: curUser.realName,
      cellphone: curUser.phone.replace(/(?=(\d{4})+$)/g, '-'),
      avatarUrl: publicUrl + curUser.avatar
    })
  },
  goMinePage() {
    wx.navigateTo({
      url: '/pages/personInfo/personInfo',
    })
  },
  publishCommute() {
    wx.navigateTo({
      url: '/pages/publishCommute/publishCommute?type=add',
    })
  },
  bindEdit() {
    wx.navigateTo({
      url: '/pages/publishCommute/publishCommute?type=edit',
    })
  },
  bindBooking(e) {
    const data = e.currentTarget.dataset.info
    if (!data.canBooking) {
      return false
    }
    if (data.curUserId === data.createdId) {
      // 自己不能预约自己
      wx.showToast({
        title: '不能预约自己发布的出行',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return false
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    resultCommuteBooking({
      commuteId: data.id,
      travelerId: this.data.pageUser.id
    })
      .then((response) => {
        wx.hideLoading()
        if (response.data) {
          wx.showModal({
            title: '提示',
            content: '已预约过该拼车出行',
            cancelText: '取消拼车',
            confirmText: '电话联系车主',
            success (res) {
              if (res.confirm) {
                // 电话联系车主
                this.setData({
                  bookingPhone: data.phone
                })
                this.bindCallphone()
              } else {
                this.cancelBooking(data)
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '该出行还有空位，确定预约嘛',
            success (res) {
              if (res.confirm) {
                this.confirmBooking(data)
              }
            }
          })
        }
      })
      .catch(() => {
        wx.hideLoading()
      })
  },
  bindCallphone() {
    wx.makePhoneCall({
      phoneNumber: this.data.bookingPhone,
      success: () => {},
      fail: () => {}
    })
  },
  bindClosePopup() {
    this.setData({
      isShow: false
    })
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1,
        isShowTabBar: true
      })
    }
  },
  confirmBooking(obj) {
    const data = obj
    const pageUser = this.data.pageUser
    // 页面显示可预约，因没刷新页面，时间其实已过去
    if (data.canBooking) {
      const currentNow = new Date().getTime()
      const dataTime = new Date(data.commuteDate).getTime()
      if (dataTime < currentNow) {
        wx.showToast({
          title: '已过出行时间，不能预约，请刷新页面',
          icon: 'none',
          duration: 2000,
          mask: true
        })
      }
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    postCommuteBooking({
      commuteId: data.id,
      travelerId: pageUser.id,
      traveler: pageUser.realName,
      type: '拼车',
      commuteDate: data.commuteDate,
    })
      .then((res) => {
        wx.hideLoading()
        this.setData({
          isShow: true,
          bookingPhone: data.phone
        })
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
          this.getTabBar().setData({
            selected: 1,
            isShowTabBar: false
          })
        }
      })
      .catch(() => {
        wx.hideLoading()
      })
  },
  cancelBooking(obj) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    rejectCommuteBooking({
      commuteId: obj.id,
      travelerId: this.data.pageUser.id
    })
      .then(res => {
        wx.hideLoading()
        wx.showToast({
          title: res.data,
          icon: 'none',
          duration: 2000,
          mask: true
        })
      })
      .catch(() => {
        wx.hideLoading()
      })
  },
  getCommuteList() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    postCommuteList({
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
          ele.passAddr = ele.passAddr.split('、')
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
      .catch(() => {
        wx.hideLoading()
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
