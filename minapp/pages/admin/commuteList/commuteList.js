import { postCommuteList, deleteCommuteOne, getCommuteBooking } from '../../../api/api'

const myApp = getApp()
Page({
  data: {
    list: [],
    noMore: false,
    pageSize: 20,
    currentPage: 1,
    pageUser: {},
    dialogShow: false,
    buttons: [{ text: '确定' }],
    bookingList: []
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
    this.setData({
      pageUser: myApp.globalData.userInfo
    })
    this.getPageList()
  },
  getPageList() {
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
  addItem() {
    wx.navigateTo({
      url: '/pages/publishCommute/publishCommute?type=add',
    })
  },
  deleteItem(e) {
    const paramsObj = e.currentTarget.dataset
    wx.showModal({
      title: '提示',
      content: '确认删除嘛',
      success: (res) => {
        if (res.confirm) {
          this.deleteConfirm(paramsObj)
        }
      }
    })
  },
  modifyItem(e) {
    const paramsObj = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/publishCommute/publishCommute?type=edit&id=' + paramsObj.id,
    })
  },
  deleteConfirm(obj) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    deleteCommuteOne({
      commuteId: obj.id
    })
      .then((res) => {
        wx.hideLoading()
        wx.showToast({
          title: res.data,
          icon: 'success',
          duration: 2000,
          mask: true
        })
        this.data.list.splice(obj.num, 1)
        this.setData({
          list: this.data.list
        })
      })
      .catch(() => {
        wx.hideLoading()
      })
  },
  viewDetail(e) {
    const paramsObj = e.currentTarget.dataset
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    getCommuteBooking({
      commuteId: paramsObj.id
    })
      .then((res) => {
        wx.hideLoading()
        this.setData({
          bookingList: res.data,
          dialogShow: true
        })
      })
      .catch(() => {
        wx.hideLoading()
      })
  },
  tapDialogButton(e) {
    this.setData({
      dialogShow: false
    })
  },
  onReachBottom() {
    if (this.data.noMore) {
      return false
    } else {
      this.getPageList()
    }
  }
})
