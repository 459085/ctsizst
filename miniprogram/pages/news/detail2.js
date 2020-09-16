const $vm = getApp()

const {post} = $vm.utils

const WxParse = require('../../utils/wxParse/wxParse.js');


Page({
    data:{
        wxParseData:[],
      fanganList:[],
        article:{},
      wenzhang:{},
        style:0
    },
    onLoad:function(options){
      wx.cloud.callFunction({
        name: 'llal',
        data: {
          _id: options.id
        },
        success: res => {

        },
      })
        this.getArticleDetail(options)
    },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var _this = this;
    wx.cloud.callFunction({
      name: 'fxal',
      data: {
        _id: _this.data.wenzhang._id
      },
      success: res => {

      },
    })
    return {
      path: '/pages/news/index?id=' + _this.data.wenzhang._id + "&alh=" + _this.data.wenzhang.alh,
      title: this.data.wenzhang.alm,
      imageUrl: this.data.wenzhang.image_path,
    }

  },
    getArticleDetail(opt){
      var _this = this;
      const db = wx.cloud.database()
      db.collection('wlw_anli').where({
        _id: opt.id
      }).get({
        success: res => {
          var wenzhang = res.data[0];
          var article = wenzhang.rich_text;
          console.log(wenzhang)
          WxParse.wxParse('article', 'html', article, _this, 5);
          _this.setData({
            wenzhang: wenzhang
          })
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

      db.collection('wlw_relation').where({
        alh: opt.alh
      }).get().then(res => {
        var relation = res.data;
        var fah = [];
        res.data.forEach(v => {
          fah.push(v.fah)
        })
     
        const db2 = wx.cloud.database()
        db2.collection('wlw_fangan').where({
          fah: db2.command.in(fah)
        }).get().then(res => {
          var fanganList = res.data;
          // if (fanganList && fanganList.length) {
          //   fanganList.push(...fanganList)
          // }
          this.setData({
            fanganList: fanganList
          })
        }) 

      })
         
  
    }
})