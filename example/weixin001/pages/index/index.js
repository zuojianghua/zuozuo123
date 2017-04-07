//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '早晨面对太阳，左手的一边',
    userInfo: {},
    direction: 0,
    acc:1
  },
  //事件处理函数
  bindViewTap: function() {
    //wx.navigateTo({
    //  url: '../logs/logs'
    //})
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })

    //wx.startCompass()
    wx.onCompassChange(function (res) {
      //console.log(res.direction)
      that.setData({
        direction:360-res.direction
      });
    })

    wx.onAccelerometerChange(function(res) {
      //console.log('x:'+res.x)
      //console.log('y:'+res.y)
      //console.log('z:'+res.z)
      var acc = Math.abs(res.x) + Math.abs(res.y) + Math.abs(res.z);
      acc = acc>1.3?1.3:acc;
      that.setData({
        acc:parseFloat(acc).toFixed(1)
      });
    })
  }
})
