import { queryDinerList, deleteDinerOne } from '../../../api/api'

const myApp = getApp()
Page({
  data: {
    list: [],
    noMore: false,
    pageSize: 10,
    currentPage: 1,
    groups: [
      { text: '明日三餐预约时间设置', value: '三餐' },
      { text: '来客就餐预约时间设置', value: '来客' }
    ],
    showDialog: false,
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
    if (myApp.globalData.refreshPage) {
      this.setData({
        currentPage: 1,
        pageSize: 10
      })
      this.getPageList()
    }
  },
  // 初始化页面方法
  initPage() {
    this.getPageList()
  },
  addItem() {
    this.setData({
      showDialog: true
    })
  },
  btnClick(e) {
    const type = e.detail.value
    wx.navigateTo({
      url: `/pages/admin/setBookingForm/setBookingForm?type=${type}&action=add`,
    })
    this.setData({
      showDialog: false
    })
  },
  modifyItem(e) {
    const paramsObj = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/admin/setBookingForm/setBookingForm?type=${paramsObj.type}&action=edit&id=${paramsObj.id}`,
    })
    this.setData({
      showDialog: false
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
  deleteConfirm(obj) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    deleteDinerOne({
      id: obj.id
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
  },
  getPageList() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    queryDinerList({
      pageSize: this.data.pageSize,
      currentPage: this.data.currentPage
    })
      .then((res) => {
        wx.hideLoading()
        if (myApp.globalData.refreshPage) {
          this.setData({
            noMore: false,
            list: []
          })
          myApp.globalData.refreshPage = false
        }
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
  },
  onReachBottom() {
    if (this.data.noMore) {
      return false
    } else {
      this.getPageList()
    }
  }
})
