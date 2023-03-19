import { queryHairList, deleteHairBooking, getHairCount } from '../../../api/api'
import { formatDate2, getWeekDate } from '../../../utils/util'

const myApp = getApp()
Page({
  data: {
    list: [],
    noMore: false,
    pageSize: 10,
    currentPage: 1,
    weekNum: 0,
    totalNum: 0
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
    const weekObj = getWeekDate()
    await this.getWeekHairStats({
      haircutStart: `${formatDate2(weekObj.monday)} 00:00:00`,
      haircutEnd: `${formatDate2(weekObj.friday)} 23:59:59`
    })
    await this.getTotalHairStats()
    await this.getPageList()
    wx.hideLoading()
  },
  async getWeekHairStats(val) {
    const res = await getHairCount(val).catch(() => {})
    if (!res) {
      return false
    }
    this.setData({
      weekNum: res.data
    })
  },
  async getTotalHairStats() {
    const res = await getHairCount().catch(() => {})
    if (!res) {
      return false
    }
    this.setData({
      totalNum: res.data
    })
  },
  async getPageList() {
    const res = await queryHairList({
      pageSize: this.data.pageSize,
      currentPage: this.data.currentPage
    }).catch(() => {})
    if (!res) {
      return false
    }
    const json = res.data
    json.list.forEach(ele => {
      ele.haircutStart = formatDate2(new Date(ele.haircutStart))
      ele.haircutEnd = formatDate2(new Date(ele.haircutEnd))
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
    deleteHairBooking({
      id: obj.id
    })
      .then((res) => {
        wx.hideLoading()
        wx.showToast({
          title: '删除成功',
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
