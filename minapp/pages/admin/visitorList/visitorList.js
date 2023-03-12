import { queryVisitorList, deleteVisitorDiner } from '../../../api/api'

const myApp = getApp()
Page({
  data: {
    list: [],
    noMore: false,
    pageSize: 20,
    currentPage: 1,
    pageUser: {}
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
      myApp.globalData.refreshPage = false
      this.setData({
        noMore: false,
        list: [],
        currentPage: 1,
        pageSize: 20
      })
      this.getPageList()
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
    queryVisitorList({
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
  },
  addItem() {
    wx.navigateTo({
      url: '/pages/publishDiner/publishDiner?type=add',
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
      url: '/pages/publishDiner/publishDiner?type=edit&id=' + paramsObj.id,
    })
  },
  deleteConfirm(obj) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    deleteVisitorDiner({
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
  onReachBottom() {
    if (this.data.noMore) {
      return false
    } else {
      this.getPageList()
    }
  }
})
