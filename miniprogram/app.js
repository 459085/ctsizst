//app.js
const utils = require('./utils/util.js')

App({
    onLaunch: function() {
      if (!wx.cloud) {
        console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      } else {
        wx.cloud.init({
          traceUser: true,
        })
      }
    },

    getUserInfo(){
      return new utils.Promise((resolve,reject) => {
        if(this.globalData.userInfo){
          resolve(this.globalData.userInfo)
        }
        return utils.getUserInfo().then(res => {
          resolve(this.globalData.userInfo = res.userInfo)
        })
      })
    },
  globalData:{
    userInfo:null,
    categoryChanged:true,
    currentTab :0 
  },

  cacheSubscibe:[],

  utils
})