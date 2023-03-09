import { addSinglePage, editSinglePage } from '../../api/api'
const myApp = getApp()

Page({
  data: {
    title: '',
    type: '',
    action: '',
    titleObj: {
      single: '单页面',
      user: '用户',
      commute: '出行',
      visit: '来客就餐预约',
      booking: '预约时间段'
    },
    actionObj: {
      add: '新增',
      edit: '修改',
      set: '设置'
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
    editContent: ''
  },
  onLoad(option) {
    wx.setNavigationBarTitle({
      title: `${this.data.actionObj[option.action]}${this.data.titleObj[option.type]}`
    })
    this.setData({
      type: option.type,
      action: option.action,
      title: `${this.data.actionObj[option.action]}${this.data.titleObj[option.type]}`
    })
  },
  bindPickerChange(e) {
    this.setData({
      single: e.detail.value
    })
  },
  goEditor() {
    wx.navigateTo({
      url: '/pages/editor/editor',
    })
  },
  submitSingle(e) {
    const formData = e.detail.value
    let msg = ''
    if (formData.title === '') {
      msg = '请输入标题'
    }
    if (!msg && formData.desc === '') {
      msg = '请输入简述'
    }
    if (!msg && this.data.editContent === '') {
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
      content: this.data.editContent
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
  }
})
