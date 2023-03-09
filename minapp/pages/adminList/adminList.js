import { querySingleList, deleteSinglePage } from '../../api/api'

const myApp = getApp()
Page({
  data: {
    type: '',
    list: [],
    noMore: false,
    pageSize: 20,
    currentPage: 1
  },
  onLoad(option) {
    wx.setNavigationBarTitle({
      title: option.title
    })
    this.setData({
      type: option.type
    })
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
    this.getPageList()
  },
  getPageList() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let reqFuc = ''
    if (this.data.type === 'single') {
      reqFuc = querySingleList
    }
    reqFuc({
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
  publishPage() {
    wx.navigateTo({
      url: `/pages/adminPage/adminPage?type=${this.data.type}&action=add`,
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
