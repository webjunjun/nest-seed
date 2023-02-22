import { wechatLogin } from './api/api'
import { versionStringCompare } from './utils/util'

App({
  globalData: {
    statusBarHeight: 0, // 状态栏高度
    navBarHeight: 0, // 顶部导航栏高度
    hasLogin: false, // 默认未登录
    userInfo: null, // 用户信息
  },
  watchLoginStatus(callback) {
    const globalObj = this.globalData;
    Object.defineProperty(globalObj, 'hasLogin', {
      configurable: true, // 对hasLogin该属性的描述不可以被修改，即enumerable等
      enumerable: true, // 允许枚举属性hasLogin
      set(value) {
        // value就是被新赋予的值，通过回调函数，把这值回调出去
        this._hasLogin = value
        callback()
      },
      get() {
        return this._hasLogin
      }
    })
  },
  onLaunch() {
    this.initPage()
  },
  initPage(cellphone) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.getSystemInfo({
      success: (res) => {
        let custom = wx.getMenuButtonBoundingClientRect()
        this.globalData.statusBarHeight = res.statusBarHeight
        this.globalData.navBarHeight = custom.height + (custom.top - res.statusBarHeight) * 2
        if (res.platform === 'windows') {
          // 不支持页面自定义顶部导航样式
          this.globalData.statusBarHeight = 0
        } else {
          if (res.platform === 'ios' || res.platform === 'android') {
            const isSupport = versionStringCompare(res.version, '7.0.0')
            if (isSupport === -1) {
              // 不支持页面自定义顶部导航样式
              this.globalData.statusBarHeight = 0
            }
          }
        }
        // 登录
        wx.login({
          success: (res) => {
            if (res.code) {
              const loginData = {
                code: res.code
              }
              if (cellphone) {
                loginData.phone = cellphone
              }
              wechatLogin(loginData)
                .then(response => {
                  wx.hideLoading()
                  wx.setStorageSync('userInfo', JSON.stringify(response.data))
                  this.globalData.userInfo = response.data
                  this.globalData.hasLogin = true
                })
                .catch(() => {
                  wx.hideLoading()
                  this.globalData.hasLogin = false
                })
            } else {
              wx.hideLoading()
              wx.showToast({
                title: res.errMsg,
                icon: 'none',
                duration: 2000,
                mask: true
              })
            }
          }
        })
      }
    })
  }
})
