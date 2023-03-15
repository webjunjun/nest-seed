import { queryUserList, deleteUser, updateUserRole } from '../../../api/api'
const myApp = getApp()

Page({
  data: {
    list: [],
    noMore: false,
    pageSize: 10,
    currentPage: 1,
    groups: [
      { text: '管理员', value: 1 },
      { text: '厨师长', value: 2 },
      { text: '普通用户', value: 3 }
    ],
    showDialog: false,
    selectedUser: {},
    pageUser: {}
  },
  onLoad() {
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
    this.setData({
      pageUser: myApp.globalData.userInfo
    })
    this.getPageList()
  },
  getPageList() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    queryUserList({
      pageSize: this.data.pageSize,
      currentPage: this.data.currentPage
    })
      .then((res) => {
        wx.hideLoading()
        const json = res.data
        if (json.list.length < this.data.pageSize) {
          // 显示到底 禁止触底加载了
          this.setData({
            list: this.data.list.concat(json.list),
            noMore: true
          })
        } else {
          this.setData({
            list: this.data.list.concat(json.list),
            currentPage: this.data.currentPage + 1,
            noMore: false
          })
        }
      })
  },
  deleteItem(e) {
    const paramsObj = e.currentTarget.dataset
    if (this.data.pageUser.id === paramsObj.id) {
      wx.showToast({
        title: '不能删除自己的账户',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return false
    }
    wx.showModal({
      title: '提示',
      content: '确认删除嘛',
      success: (res) => {
        if (res.confirm) {
          this.deleteConfirm(paramsObj)
        }
      }
    })
  },
  modifyItem(e) {
    const paramsObj = e.currentTarget.dataset
    if (this.data.pageUser.id === paramsObj.id) {
      wx.showToast({
        title: '不能修改自己的账户',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return false
    }
    this.setData({
      selectedUser: paramsObj,
      showDialog: true
    })
  },
  deleteConfirm(obj) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    deleteUser({
      id: obj.id
    })
      .then((res) => {
        wx.hideLoading()
        wx.showToast({
          title: res.data,
          icon: 'success',
          duration: 2000,
          mask: true
        })
        this.data.list.splice(obj.num, 1)
        this.setData({
          list: this.data.list
        })
      })
  },
  btnClick(e) {
    const roleId = e.detail.value
    const roleName = {
      role1: '管理员',
      role2: '厨师长',
      role3: '普通用户',
    }
    updateUserRole({
      id: this.data.selectedUser.id,
      role: roleId,
      roleName: roleName['role' + roleId],
      updateId: this.data.pageUser.id,
      updateName: this.data.pageUser.realName
    })
      .then((res) => {
        wx.hideLoading()
        wx.showToast({
          title: res.data,
          icon: 'success',
          duration: 2000,
          mask: true
        })
        const changeUser = this.data.list[this.data.selectedUser.num]
        changeUser.role = roleId
        changeUser.roleName = roleName['role' + roleId]
        this.setData({
          showDialog: false,
          list: this.data.list
        })
      })
  },
  onReachBottom() {
    if (this.data.noMore) {
      return false
    } else {
      this.getPageList()
    }
  }
})
