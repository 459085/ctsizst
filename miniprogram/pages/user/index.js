var $vm = getApp()
const WxParse = require('../../utils/wxParse/wxParse.js');
Page({
  data:{
    text:"Page user",
    userInfo: {},
    wxParseData: [],
    loadingHidden: true,
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.getArticleDetail()
  	//调用应用实例的方法获取全局数据

  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
      getArticleDetail(){
        const db = wx.cloud.database()
        // 查询当前用户所有的 counters
        db.collection('ctsi').where({
          
        }).get({
          success: res => {
            // this.setData({
            //   queryResult: JSON.stringify(res.data, null, 2)
            // })
            console.log('[数据库] [查询记录] 成功: ', res)
            var article = res.data[0].gywm;
            WxParse.wxParse('article', 'html', article, this, 5);
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '查询记录失败'
            })
            console.error('[数据库] [查询记录] 失败：', err)
          }
        })
          /**
           * html解析示例
           */
     
    }

})