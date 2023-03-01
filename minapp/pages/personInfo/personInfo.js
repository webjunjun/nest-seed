const myApp = getApp()
import { wechatUserUpdate } from '../../api/api';
import { baseUrl, baseImageUrl, publicUrl } from '../../utils/config'
import { checkModbile, isChinese, isVehicleNumber } from '../../utils/util'

Page({
  data: {
    mineBg: `${baseImageUrl}/mine/mine_bg.png`,
    avatarUrl: '../../static/default_avatar.png',
    formAvatar: '',
    realName: '',
    cellphone: '',
    user: {}
  },
  onLoad() {
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
      avatarUrl: publicUrl + pageUser.avatar,
      formAvatar: pageUser.avatar,
      user: {
        id: pageUser.id,
        realName: pageUser.realName,
        phone: pageUser.phone,
        licensePlate: pageUser.licensePlate,
        brief: pageUser.brief
      }
    })
  },
  // 事件处理函数
  onChooseAvatar(e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const { avatarUrl } = e.detail
    wx.uploadFile({
      url: `${baseUrl}/file/upload`,
      filePath: avatarUrl,
      name: 'file',
      success: (res) => {
        const json = JSON.parse(res.data)
        this.setData({
          avatarUrl: publicUrl + json.data,
          formAvatar: json.data
        })
        wx.hideLoading()
      },
      fail: () => {
        wx.hideLoading()
      }
    })
  },
  bindSubmit(e) {
    const curUser = this.data.user
    const formData = e.detail.value
    let msg = ''
    if (!msg && !isChinese(formData.realName)) {
      msg = '真实姓名请输入中文'
    }
    if (!msg && !checkModbile(formData.phone)) {
      msg = '手机号格式错误'
    }
    if (formData.licensePlate) {
      // 车牌号存在则校验
      if (!msg && !isVehicleNumber(formData.licensePlate)) {
        msg = '车牌号格式错误'
      }
    } else {
      // 如果提交过车牌号 就不准清空了
      if (curUser.licensePlate) {
        if (!msg && !isVehicleNumber(formData.licensePlate)) {
          msg = '车牌号格式错误'
        }
      }
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
    formData.avatar = this.data.formAvatar
    formData.id = curUser.id
    formData.updateId = curUser.id
    formData.updateName = curUser.realName
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wechatUserUpdate(formData)
      .then(res => {
        wx.hideLoading()
        if (res.code === 1) {
          wx.showToast({
            title: res.data,
            icon: 'success',
            duration: 2000,
            mask: true,
            success: () => {
              const pageUser = myApp.globalData.userInfo
              Object.assign(pageUser, {
                realName: formData.realName,
                phone: formData.phone,
                licensePlate: formData.licensePlate,
                brief: formData.brief,
                avatar: formData.avatar
              })
              // 更新个人信息
              wx.setStorageSync('userInfo', JSON.stringify(pageUser))
              myApp.globalData.userInfo = pageUser
              // 更新当前页面
              this.initPage()
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
