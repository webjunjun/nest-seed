const myApp = getApp()
import { queryVisitorList, queryTomorrowBooking, queryMineTwoDays } from '../../api/api'
import { baseImageUrl, publicUrl } from '../../utils/config'

Page({
  data: {
    dinerBg: `${baseImageUrl}/diner/diner_bg.png`,
    avatarUrl: '../../static/default_avatar.png',
    publishUrl: `${baseImageUrl}/publish.png`,
    dialogUrl: `${baseImageUrl}/diner/recipe_top.png`,
    realName: '',
    cellphone: '',
    statsArr: [{
      num: 18,
      type: '今日早餐',
      urlQuery: 'today'
    }, {
      num: 5,
      type: '今日中餐',
      urlQuery: 'today'
    }, {
      num: 350,
      type: '今日晚餐',
      urlQuery: 'today'
    }, {
      num: 350,
      type: '来客就餐',
      urlQuery: 'visit'
    }],
    isShow: false,
    loading: true,
    pageUser: {},
    noMore: false,
    list: [],
    currentPage: 1,
    pageSize: 20
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
        selected: 0
      })
    }
    if (myApp.globalData.hasLogin) {
      this.initData()
    }
  },
  initPage() {
    this.initData()
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    Promise.all([queryTomorrowBooking(), queryMineTwoDays({
      eaterId: this.data.pageUser.id
    }), queryVisitorList({
      pageSize: this.data.pageSize,
      currentPage: this.data.currentPage
    })])
      .then((res) => {
        // 可预约时间
        const json1 = res[0].data
        // 本人这两天的预约数据
        const json2 = res[1].data
        // 来客就餐列表
        const json3 = res[2].data
        wx.hideLoading()
        console.log(res)
      })
      .catch(() => {
        wx.hideLoading()
      })
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
  },
  goMinePage() {
    wx.navigateTo({
      url: '/pages/personInfo/personInfo',
    })
  },
  publishDiner() {
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
    this.setData({
      isShow: true
    })
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
        isShowTabBar: false
      })
    }
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
  getVisitorList() {
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
        json.list.forEach(ele => {
          ele.dinerDate = ele.dinerDate.slice(0, 16)
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
      })
      .catch(() => {
        wx.hideLoading()
      })
  },
  onReachBottom() {
    if (this.data.noMore) {
      return false
    } else {
      this.getVisitorList()
    }
  }
})
