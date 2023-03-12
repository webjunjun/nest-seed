const myApp = getApp()
import { publishCommuteInfo, postCommuteOne, modifyCommuteInfo } from '../../api/api'
import { baseImageUrl, publicUrl } from '../../utils/config'
import { formatTime } from '../../utils/util'

Page({
  data: {
    commuteBg: `${baseImageUrl}/commute/commute_bg.png`,
    avatarUrl: '../../static/default_avatar.png',
    realName: '',
    cellphone: '',
    pageUser: {},
    statsArr: [{
      num: 0,
      type: '已发布'
    }, {
      num: 0,
      type: '已拼车'
    }, {
      num: 0,
      type: '总出行'
    }],
    isShow: false,
    commuteDate: '',
    commuteId: null,
    curTitle: '',
    actionType: '',
    hasItem: 1,
    history: {}
  },
  onLoad(option) {
    let curTitle = ''
    if (option.type === 'add') {
      curTitle = '发布拼车出行'
    } else {
      curTitle = '编辑拼车出行'
    }
    wx.setNavigationBarTitle({
      title: curTitle
    })
    const currentDatetime = formatTime(new Date())
    this.setData({
      curTitle,
      actionType: option.type,
      commuteDate: currentDatetime,
      commuteId: option.id || null
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
    this.initData()
    if (this.data.actionType === 'edit') {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      postCommuteOne({
        commuteId: this.data.commuteId
      })
        .then((res) => {
          wx.hideLoading()
          res.data.passAddr = res.data.passAddr.split('、')
          for (let i = 0; i < res.data.passAddr.length; i++) {
            res.data['passAddr' + i] = res.data.passAddr[i]
          }
          this.setData({
            history: res.data,
            commuteDate: res.data.commuteDate,
            hasItem: res.data.passAddr.length
          })
        })
        .catch(() => {
          wx.hideLoading()
        })
    }
  },
  initData() {
    // 每次显示都执行的
    const curUser = myApp.globalData.userInfo
    if (curUser) {
      this.setData({
        pageUser: curUser,
        realName: curUser.realName,
        cellphone: curUser.phone.replace(/(?=(\d{4})+$)/g, '-'),
        avatarUrl: publicUrl + curUser.avatar,
        history: {
          licensePlate: curUser.licensePlate
        }
      })
    }
  },
  handleChange(e) {
    this.setData({
      commuteDate: e.detail.dateString
    })
  },
  bindPassAddr(e) {
    const curType = e.currentTarget.dataset.type
    if (curType === 'add') {
      if (this.data.hasItem >= 5) {
        wx.showToast({
          title: '途径地最多5个',
          icon: 'none',
          duration: 2000,
          mask: true
        })
        return false
      }
    }
    this.setData({
      hasItem: curType === 'add' ? this.data.hasItem + 1 : this.data.hasItem - 1
    })
  },
  bindSubmit(e) {
    const formData = e.detail.value
    formData.commuteDate = this.data.commuteDate
    const tempPassAddr = []
    let msg = ''
    if (!formData.licensePlate) {
      msg = '请输入车牌号'
    }
    if (!msg && !formData.commuteDate) {
      msg = '请选择出行时间'
    }
    if (!msg) {
      const selectDate = new Date(formData.commuteDate).getTime()
      const curDate = Date.now() + 1000 * 60 * 5
      if (selectDate <= curDate) {
        msg = '出行时间需大于当前时间至少5分钟'
      }
    }
    if (!msg && !formData.startAddr) {
      msg = '请输入出发地'
    }
    if (!msg && !formData.endAddr) {
      msg = '请输入目的地'
    }
    if (!msg) {
      for (let i = 0; i < this.data.hasItem; i++) {
        if (formData['passAddr' + i] === '') {
          msg = '请输入途径地'
          break;
        } else {
          tempPassAddr.push(formData['passAddr' + i])
        }
      }
    }
    if (!msg && !formData.seat) {
      msg = '请输入空座位数'
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
    let reqFuc = publishCommuteInfo
    formData.passAddr = tempPassAddr.join('、')
    const reqData = { ...formData }
    for (let i = 0; i < this.data.hasItem; i++) {
      delete reqData['passAddr' + i]
    }
    // 完善其他信息
    const pageUser = this.data.pageUser
    if (this.data.actionType === 'add') {
      reqData.restSeat = reqData.seat
      reqData.created = formatTime(new Date())
      reqData.createdId = pageUser.id
      reqData.createdName = pageUser.realName
      if (this.data.history.licensePlate) {
        reqData.modifyUserInfo = false
      } else {
        reqData.modifyUserInfo = true
      }
    } else {
      const usedSeat = Number(this.data.history.seat) - Number(this.data.history.restSeat)
      if (Number(reqData.seat) < usedSeat) {
        wx.showToast({
          title: '空座位数不能小于已使用座位数',
          icon: 'none',
          duration: 2000,
          mask: true
        })
        return false
      }
      reqFuc = modifyCommuteInfo
      reqData.id = this.data.history.id
      reqData.lastModify = formatTime(new Date())
      reqData.updateId = pageUser.id
      reqData.updateName = pageUser.realName
      reqData.restSeat = Number(reqData.seat) - usedSeat
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
      .catch(() => {
        wx.hideLoading()
      })
  }
})
