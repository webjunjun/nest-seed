const myApp = getApp()
import { baseImageUrl, publicUrl } from '../../utils/config'
import { publishVisitorDiner, queryVisitorDiner, modifyVisitorDiner } from '../../api/api'
import { formatTime } from '../../utils/util'

Page({
  data: {
    dinerBg: `${baseImageUrl}/diner/diner_bg.png`,
    avatarUrl: '../../static/default_avatar.png',
    realName: '',
    cellphone: '',
    adminArr: [{
      num: 0,
      unit: '人',
      type: '今日早餐',
      urlQuery: 'today'
    }, {
      num: 0,
      unit: '人',
      type: '今日中餐',
      urlQuery: 'today'
    }, {
      num: 0,
      unit: '人',
      type: '今日晚餐',
      urlQuery: 'today'
    }, {
      num: 0,
      unit: '人',
      type: '来客就餐',
      urlQuery: 'visit'
    }],
    commonArr: [{
      num: 0,
      unit: '次',
      type: '早餐',
      urlQuery: 'today'
    }, {
      num: 0,
      unit: '次',
      type: '中餐',
      urlQuery: 'today'
    }, {
      num: 0,
      unit: '次',
      type: '晚餐',
      urlQuery: 'today'
    }],
    dinerDate: '',
    curTitle: '',
    pageUser: {},
    history: {},
    visitorDinerId: null,
    actionType: ''
  },
  onLoad(option) {
    let curTitle = ''
    if (option.type === 'add') {
      curTitle = '发布来客就餐预约'
    } else {
      curTitle = '编辑来客就餐预约'
    }
    wx.setNavigationBarTitle({
      title: curTitle
    })
    const currentDatetime = formatTime(new Date())
    this.setData({
      dinerDate: currentDatetime,
      curTitle,
      visitorDinerId: option.id || null,
      actionType: option.type
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
    const pageUser = myApp.globalData.userInfo
    this.setData({
      pageUser,
      realName: pageUser.realName,
      cellphone: pageUser.phone.replace(/(?=(\d{4})+$)/g, '-'),
      avatarUrl: publicUrl + pageUser.avatar,
      history: {
        bookerId: pageUser.id,
        bookerName: pageUser.realName
      }
    })
    if (this.data.actionType === 'edit') {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      queryVisitorDiner({
        visitorId: this.data.visitorDinerId
      })
        .then((res) => {
          wx.hideLoading()
          this.setData({
            history: res.data,
            dinerDate: res.data.dinerDate
          })
        })
    }
  },
  handleChange(e) {
    this.setData({
      dinerDate: e.detail.dateString
    })
  },
  bindSubmit(e) {
    const formData = e.detail.value
    formData.dinerDate = this.data.dinerDate
    let msg = ''
    if (!formData.bookerName) {
      msg = '请输入预约人'
    }
    if (!msg && !formData.dinerNum) {
      msg = '请输入就餐人数'
    }
    if (!msg && !formData.dinerDate) {
      msg = '请选择就餐时间'
    }
    if (!msg) {
      const selectDate = new Date(formData.dinerDate).getTime()
      const curDate = Date.now() + 1000 * 60 * 5
      if (selectDate <= curDate) {
        msg = '就餐时间需大于当前时间至少5分钟'
      }
    }
    if (!msg && !formData.visitorCompany) {
      msg = '请输入来客单位'
    }
    if (!msg && !formData.visitorLevel) {
      msg = '请输入来客级别'
    }
    if (!msg && !formData.remark) {
      msg = '请输入备注'
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
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const reqData = { ...formData }
    let reqFuc = publishVisitorDiner
    // 完善其他信息
    const pageUser = this.data.pageUser
    if (this.data.actionType === 'add') {
      reqData.bookerId = this.data.history.bookerId
      reqData.created = formatTime(new Date())
      reqData.createdId = pageUser.id
      reqData.createdName = pageUser.realName
    } else {
      reqFuc = modifyVisitorDiner
      reqData.id = this.data.history.id
      reqData.bookerId = this.data.history.bookerId
      reqData.lastModify = formatTime(new Date())
      reqData.updateId = pageUser.id
      reqData.updateName = pageUser.realName
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
              wx.navigateBack({
                delta: 1,
              })
            }
          })
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
  navDinerStat(e) {
    const curItem = e.currentTarget.dataset.item
    if (curItem.urlQuery === 'none') {
      return false
    }
    wx.navigateTo({
      url: '/pages/dinerStats/dinerStats?type=' + curItem.urlQuery
    })
  }
})
