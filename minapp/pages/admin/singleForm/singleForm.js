import { addSinglePage, editSinglePage } from '../../../api/api'
const myApp = getApp()

Page({
  data: {
    title: '单页面',
    action: '',
    actionObj: {
      add: '新增',
      edit: '修改'
    },
    singleArray: [{
      label: '本周食谱',
      value: 0
    }, {
      label: '帮助',
      value: 1
    }, {
      label: '关于我们',
      value: 2
    }],
    single: 0,
    pageUser: {}
  },
  onLoad(option) {
    wx.setNavigationBarTitle({
      title: `${this.data.actionObj[option.action]}${this.data.title}`
    })
    this.setData({
      action: option.action,
      title: `${this.data.actionObj[option.action]}${this.data.title}`
    })
    if (myApp.globalData.hasLogin) {
      // 登录完成
      this.initPage()
    } else {
      // 等待登录完成后操作
      myApp.watchLoginStatus(() => this.initPage())
    }
  },
  initPage() {
    this.setData({
      pageUser: myApp.globalData.userInfo
    })
  },
  bindPickerChange(e) {
    this.setData({
      single: e.detail.value
    })
  },
  goEditor() {
    wx.navigateTo({
      url: '/pages/admin/editor/editor',
    })
  },
  submitSingle(e) {
    const formData = e.detail.value
    const contents = wx.getStorageSync('editorTxt')
    let msg = ''
    if (formData.title === '') {
      msg = '请输入标题'
    }
    if (!msg && formData.description === '') {
      msg = '请输入简述'
    }
    if (!msg && !contents) {
      msg = '请输入内容'
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
    // 校验用户数据
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const reqData = {
      ...formData,
      type: this.data.singleArray[this.data.single].value,
      content: contents,
      createdId: this.data.pageUser.id,
      createdName: this.data.pageUser.realName
    }
    addSinglePage(reqData)
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
  },
  onUnload() {
    // 卸载页面清理编辑器缓存
    wx.removeStorageSync('editorTxt')
  }
})
