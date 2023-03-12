import { baseUrl, publicUrl } from '../../../utils/config'

Page({
  data: {
    formats: {},
    readOnly: false,
    placeholder: '开始输入...',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false,
    showFont: false,
    showAlign: false,
    content: ''
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad() {
    const contents = wx.getStorageSync('editorTxt')
    this.setData({
      content: contents
    })
    // const platform = wx.getSystemInfoSync().platform
    // const isIOS = platform === 'ios'
    // this.setData({ isIOS })
    // const that = this
    // this.updatePosition(0)
    // let keyboardHeight = 0
    // wx.onKeyboardHeightChange(res => {
    //   if (res.height === keyboardHeight) return
    //   const duration = res.height > 0 ? res.duration * 1000 : 0
    //   keyboardHeight = res.height
    //   setTimeout(() => {
    //     wx.pageScrollTo({
    //       scrollTop: 0,
    //       success() {
    //         that.updatePosition(keyboardHeight)
    //         that.editorCtx.scrollIntoView()
    //       }
    //     })
    //   }, duration)
    // })
  },
  // 更新键盘和编辑器高度
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const { windowHeight, platform } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({ editorHeight, keyboardHeight })
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const { statusBarHeight, platform } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
      const contents = wx.getStorageSync('editorTxt')
      that.editorCtx.setContents({
        html: contents
      })
    }).exec()
  },
  blur() {
    this.editorCtx.blur()
  },
  // 点击工具栏格式化编辑文本
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    this.editorCtx.format(name, value)
    this.setData({
      showFont: false,
      showAlign: false
    })
  },
  // 工具栏选项选中，图标出现选中样式
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },
  bindShowFont() {
    this.setData({
      showFont: !this.data.showFont,
      showAlign: false
    })
  },
  bindShowAlign() {
    this.setData({
      showFont: false,
      showAlign: !this.data.showAlign
    })
  },
  // 插入分割线
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  // 清空内容
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log('clear success')
      }
    })
  },
  // 清除当前选区的样式
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  // 插入日期
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  // 撤销
  bindUndo() {
    this.editorCtx.undo({
      success: function (res) {
        console.log('undo success')
      }
    })
  },
  // 恢复上一步
  bindRedo() {
    this.editorCtx.redo({
      success: function (res) {
        console.log('redo success')
      }
    })
  },
  // 插入图片
  insertImage() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        let filePath = res.tempFilePaths[0];
        wx.uploadFile({
          url: `${baseUrl}/file/upload`,
          filePath,
          name: 'file',
          success: (res) => {
            const json = JSON.parse(res.data)
            this.editorInsertImg(json.data)
            wx.hideLoading()
          },
          fail: () => {
            wx.hideLoading()
          }
        })
      }
    })
  },
  editorInsertImg(filePath) {
    this.editorCtx.insertImage({
      src: publicUrl + filePath,
      width: '100%',
      success: function () {
        console.log('insert image success')
      }
    })
  },
  saveContent() {
    this.editorCtx.getContents({
      success: (res) => {
        wx.setStorageSync('editorTxt', res.html)
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000,
          mask: true
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1,
          })
        }, 2000)
      }
    })
  }
})
