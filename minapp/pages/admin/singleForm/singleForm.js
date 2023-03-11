import { addSinglePage, editSinglePage, querySingleOne } from '../../../api/api'
import { formatTime } from '../../../utils/util'
const myApp = getApp()

Page({
  data: {
    title: '单页面',
    action: '',
    id: '',
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
    history: {},
    pageUser: {}
  },
  onLoad(option) {
    wx.setNavigationBarTitle({
      title: `${this.data.actionObj[option.action]}${this.data.title}`
    })
    this.setData({
      action: option.action,
      id: option.id || '',
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
    if (this.data.action === 'edit') {
      this.getDetailData()
    }
  },
  getDetailData() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    querySingleOne({
      id: this.data.id
    })
      .then((res) => {
        const json = res.data
        this.setData({
          single: json.type,
          history: {
            title: json.title,
            description: json.description
          }
        })
        if (json.content) {
          wx.setStorageSync('editorTxt', json.content)
        }
        wx.hideLoading()
      })
      .catch(() => {
        wx.hideLoading()
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
      content: contents
    }
    let reqFuc = addSinglePage
    if (this.data.action === 'edit') {
      reqFuc = editSinglePage
      reqData.id = this.data.id
      reqData.lastModify = formatTime(new Date())
      reqData.updateId = this.data.pageUser.id
      reqData.updateName = this.data.pageUser.realName
    } else {
      reqData.createdId = this.data.pageUser.id
      reqData.createdName = this.data.pageUser.realName
    }
    reqFuc(reqData)
      .then(res => {
        wx.hideLoading()
        if (res.code === 1) {
          wx.showToast({
            title: res.data,
            icon: 'success',
            duration: 2000,
            mask: true
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            })
          }, 1500)
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
