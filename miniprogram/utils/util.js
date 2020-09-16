const Promise = require('./Promise')

const REGX_HTML_DECODE = /&\w{1,};|&#\d{1,};/g;
const HTML_DECODE = {
        "&lt;"  : "<", 
        "&gt;"  : ">", 
        "&amp;" : "&", 
        "&nbsp;": " ", 
        "&quot;": "\"", 
        "&copy;": "©"
   };


function login(){
  return new Promise((resolve,reject) => wx.login({
    success:resolve,
    fail:reject
  }))
}

function getUserInfo(){
  return login().then(res => new Promise((resolve,reject) => 
    wx.getUserInfo({
      success:resolve,
      fail:reject
    })
  ))
}

function decodeHtml(str){
  return (typeof str != "string") ? str :
    str.replace(REGX_HTML_DECODE,function($0){
      var c  = HTML_DECODE[$0]
      if(c === undefined){
          var m = $0.match(/\d{1,}/);
          if(m){
              var cc = m[0];
              cc = (cc === 0xA0) ? 0x20 : cc;
              c = String.fromCharCode(cc);
          }else{
              c = $0;
          }
      }
      return c;
    }) 
}

function makeArray(num,val){
  var arr = []
  for(var i = 0; i < num ; i++){
    arr.push(typeof val !== 'undefined' ? val : i)
  }
  return arr
}

function getCategorys(){
  return new Promise((resolve,reject) => {
    // [{id:1,order:2...}]
    var liked = wx.getStorageSync('USER_COLLECT') || [];


    var categorys ={};
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('wlw_categroys').orderBy('lanmu_order', 'asc').get({
      success: res => {
        // this.setData({
        //   queryResult: JSON.stringify(res.data, null, 2)
        // })
        console.log('[数据库] [查询记录] 成功: ', res)
        categorys = res.data;
        categorys.forEach(category => {
          if (!liked.length) {
            category.selected = true
          } else {
            category.selected = false
            liked.forEach(like =>
              category.lanmu_id === like.id && (category.selected = true)
            )
          }
        })
        resolve(categorys)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })


  })
}


function requstGet(url,data){
  return requst(url,'GET',data)
}

function requstPost(url,data){
  return requst(url,'POST',data)
}

const DOMAIN = 'http://wx.diggid.cn/coverHttps.php'

// 小程序上线需要https，这里使用服务器端脚本转发请求为https
function requst(url,method,data = {}){
  wx.showNavigationBarLoading()
  var rewriteUrl = encodeURIComponent(url)
  data.method = method
  return new Promise((resove,reject) => {
    wx.request({
      url: DOMAIN + '?url=' + rewriteUrl,
      data: data,
      header: {},
      method: method.toUpperCase(), // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function(res){
        wx.hideNavigationBarLoading()
        resove(res.data)
      },
      fail: function(msg) {
        console.log('reqest error',msg)
        wx.hideNavigationBarLoading()
        reject('fail')
      }
    })
  })
}




module.exports = {
  makeArray,getCategorys,getUserInfo,Promise,
  get:requstGet,post:requstPost,requst,decodeHtml
}
