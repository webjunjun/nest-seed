const myApp = getApp()
import { baseUrl, baseImageUrl, publicUrl } from '../../utils/config'
import { wechatRegister } from '../../api/api'
import { checkModbile, isChinese } from '../../utils/util'

Page({
  data: {
    statusBarHeight: 0,
    loginBg: `${baseImageUrl}/login_bg.png`,
    defaultAvatar: '../../static/avatar.png',
    avatarUrl: '',
    formAvatar: ''
  },
  // 事件处理函数
  bindUplaodPhoto(e) {
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
    const formData = e.detail.value
    let msg = ''
    if (!this.data.formAvatar) {
      msg = '请上传用户头像'
    }
    if (!msg && !isChinese(formData.realName)) {
      msg = '真实姓名请输入中文'
    }
    if (!msg && !checkModbile(formData.phone)) {
      msg = '手机号格式错误'
    }
    if (!msg && formData.registerCode === '') {
      msg = '内部注册码不能为空'
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
    // 校验用户数据
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    // 账号设置默认密码
    formData.password = '123456'
    wechatRegister(formData)
      .then(res => {
        if (res.code === 1) {
          // 调用登录接口
          this.loginSystem(formData)
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '注册失败, 请稍后再试',
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }
      })
  },
  loginSystem(obj) {
    myApp.initPage(obj.phone)
    myApp.watchLoginStatus(() => {
      wx.switchTab({
        url: '/pages/diner/diner',
        success: () => {
          wx.hideLoading()
        }
      })
    })
  },
  // 初始化页面方法
  initPage() {
    this.setData({
      statusBarHeight: myApp.globalData.statusBarHeight
    })
  }
})
