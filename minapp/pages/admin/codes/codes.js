import { queryCodesList, createCodes } from '../../../api/api'

const myApp = getApp()
Page({
  data: {
    list: [],
    noMore: false,
    pageSize: 10,
    currentPage: 1
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
  async initPage() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    await this.getPageList()
    wx.hideLoading()
  },
  async getPageList() {
    const res = await queryCodesList({
      pageSize: this.data.pageSize,
      currentPage: this.data.currentPage
    }).catch(() => {})
    if (!res) {
      return false
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
  },
  addItem() {
    // 
  },
  async onReachBottom() {
    if (this.data.noMore) {
      return false
    } else {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      await this.getPageList()
      wx.hideLoading()
    }
  }
})
