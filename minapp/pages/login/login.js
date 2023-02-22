const myApp = getApp()
import { baseImageUrl } from '../../utils/config'
import { wechatRegister } from '../../api/api'

Page({
  data: {
    statusBarHeight: 0,
    loginBg: `${baseImageUrl}/login_bg.png`
  },
  // 事件处理函数
  bindUplaodPhoto() {
    wx.showModal({
      title: '提示',
      content: '这是一个模态弹窗',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  bindSubmit(e) {
    const formData = e.detail.value
    if (this.loading) {
      return false
    }
    formData.avatar = ''
    // 账号设置默认密码
    formData.password = '123456'
    wechatRegister(formData)
      .then(res => {
        if (res.code === 1) {
          // 调用登录接口
          this.loginSystem(formData)
        } else {
          this.setData({
            loading: false
          })
          wx.showToast({
            title: '注册失败, 请稍后再试',
            icon: 'none',
            duration: 3000,
            mask: true
          })
        }
      })
      .catch(() => {
        this.setData({
          loading: false
        })
      })
  },
  loginSystem(obj) {
    myApp.initPage(obj.phone)
    myApp.watchLoginStatus(() => {
      wx.switchTab({
        url: '/pages/diner/diner',
        success: () => {
          this.setData({
            loading: false
          })
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
