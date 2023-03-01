const myApp = getApp()
import { baseImageUrl, publicUrl } from '../../utils/config'
import { formatTime } from '../../utils/util'

Page({
  data: {
    commuteBg: `${baseImageUrl}/commute/commute_bg.png`,
    avatarUrl: '../../static/default_avatar.png',
    realName: '',
    cellphone: '',
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
    commuteDate: '',
    curTitle: '',
    hasItem: 1
  },
  onLoad(option) {
    let curTitle = ''
    if (option.type === 'add') {
      curTitle = '发布拼车出行'
    } else {
      curTitle = '编辑拼车出行'
    }
    this.setData({
      curTitle
    })
    wx.setNavigationBarTitle({
      title: curTitle
    })
    const currentDatetime = formatTime(new Date())
    this.setData({
      commuteDate: currentDatetime
    })
    if (myApp.globalData.hasLogin) {
      // 登录完成
      this.initPage();
    } else {
      // 等待登录完成后操作
      myApp.watchLoginStatus(() => this.initPage())
    }
  },
  // 初始化页面方法
  initPage() {
    const pageUser = myApp.globalData.userInfo
    this.setData({
      realName: pageUser.realName,
      cellphone: pageUser.phone.replace(/(?=(\d{4})+$)/g, '-'),
      avatarUrl: publicUrl + pageUser.avatar
    })
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
    console.log(e)
  }
})
