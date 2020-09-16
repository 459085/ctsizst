//index.js
//获取应用实例
const $vm = getApp()

Page({
  _isLoading: false,
  data: {
    search: '11',
    swiperList: [],
    articles: [],
    categoryTabs: [],
  },
  onShow: function (options) {


  },
  onReady() {

  },
  onLoad: function (options) {
    console.log(options)
    this.getNewsList(options.reg)
    this.setData({
      search: options.reg
    })
  },
  // 页面相关事件处理函数--监听用户下拉动作，下拉刷新
  onPullDownRefresh() {

  },

  query() {
    this.getNewsList(this.data.search)
  },
  inputBind(e) {
    this.setData({
      search: e.detail.value
    })
  },
  getNewsList(reg) {
    this._isLoading = true
    const db = wx.cloud.database()
    db.collection('wlw_anli').where({
      alm: db.RegExp({
        regexp: reg,
        options: 'i',
      })
    }).get({
      success: res => {
        this._isLoading = false
        var anList = res.data;
        this.setData({
          anList: anList
        })
        // this.setData({
        //   queryResult: JSON.stringify(res.data, null, 2)
        // })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  }
})
