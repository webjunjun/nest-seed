const config = require('./config')

const baseUrl = config.baseUrl

export function request(option) {
  const userString = wx.getStorageSync('userInfo')
  let token = null
  if (userString) {
    token = JSON.parse(userString).token
  }
  // application/json;charset=utf-8
  const customHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  }
  if (token) {
    customHeaders.Authorization = `Bearer ${token}`
  }
  return new Promise(function(resolve, reject) {
    wx.request({
      url: baseUrl + option.url,
      data: option.data,
      header: customHeaders,
      method: option.method,
      success(res) {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve(res.data)
        } else {
          reject(res.data)
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
            mask: true,
            success() {
              if (res.statusCode === 401) {
                // 重定向到登录
                setTimeout(() => {
                  wx.reLaunch({
                    url: '/pages/login/login',
                  })
                }, 2000)
              }
            }
          })
        }
      },
      fail(err) {
        reject(err)
        wx.hideLoading()
        wx.showToast({
          title: `网络错误${err.errMsg}`,
          icon: 'none',
          duration: 2000,
          mask: true
        })
      }
    })
  })
}
