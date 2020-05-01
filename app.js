//app.js
App({
  onLaunch: function () {
    // Init cloud env
    wx.cloud.init({
      env: "vegi-exchange-45j4z"
    })

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }

              const db = wx.cloud.database();
              db.collection('UsersProfile')
              .get({
                success: res => {
                  if (res.data.length > 0){
                    this.globalData.id = res.data[0]._id
                    this.globalData.gameProfile = {
                      nickname: res.data[0].nickname,
                      islandName: res.data[0].islandName,
                      fruit: res.data[0].fruit,
                      hemisphere: res.data[0].hemisphere,
                    }
                  }
                  console.log(this.globalData)
                },
                fail: res => {
                  console.log('fail: ' + res)
                }
              })
            }
          })
        }
      }
    })
  },
  globalData: {
    id: null,
    userInfo: null,
    gameProfile: {
      nickname: '',
      islandName: '',
      fruit: 'apple',
      hemisphere: 'north',
    }
  }
})