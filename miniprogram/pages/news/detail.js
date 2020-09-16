const $vm = getApp()

const {post} = $vm.utils

const WxParse = require('../../utils/wxParse/wxParse.js');


Page({
    data:{
        wxParseData:[],
        article:{},
      wenzhang:{},
        style:0,
      progress: 0,
    },
    onLoad:function(options){
      wx.cloud.callFunction({
        name: 'llfa',
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
    var _this =this;
    wx.cloud.callFunction({
      name: 'fxfa',
      data: {
        _id: _this.data.wenzhang._id
      },
      success: res => {

      },
    })
    return {
      title: this.data.wenzhang.fam,
      path: '/pages/news/index?id=' + _this.data.wenzhang._id + "&fah=" + _this.data.wenzhang.fah,
      imageUrl: this.data.wenzhang.image_path,
    }

  },
  cc(){
    wx.getSavedFileList({  // 获取文件列表
      success(res) {
        console.log(res)
        res.fileList.forEach((val, key) => { // 遍历文件列表里的数据
          // 删除存储的垃圾数据
          wx.removeSavedFile({
            filePath: val.filePath
          });
        })
      }
    })
    var fileName = decodeURI((/(?<=\/)((?!\/).)+\.(ppt|pptx|doc|docx|pdf)/g).exec(this.data.wenzhang.file_path)[0])
    console.log(fileName)
    this.setData({ loadingHidden: false })
    let _that = this;
    let a = wx.downloadFile({
      url: _that.data.wenzhang.file_path,
      filePath: wx.env.USER_DATA_PATH + "/" + fileName,
      success: function (res) {
        console.log(res)  
        var filePath = res.filePath;
        wx.showModal({
          title: '提示',
          content: '是否打开' + fileName,
          success(res) {
            if (res.confirm) {
              wx.openDocument({
                filePath: filePath,
                success: function (res) {
                  _that.setData({
                    loadingHidden: true
                  })
                  console.log('打开文档成功')
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
    
      },fail:function(res){
        console.log(111,res)
      }
    })
    a.onProgressUpdate((res) => {
      if (res.progress === 100) {
        this.setData({
          progress: '下载完毕'
        })
      } else {
        this.setData({
          progress: res.progress + '%'
        })
      }

    })


  },
    getArticleDetail(opt){
      var _this = this;
      const db = wx.cloud.database()
      db.collection('wlw_fangan').where({
        _id: opt.id
      }).get({
        success: res => {
          var wenzhang = res.data[0];
          var article = wenzhang.rich_text;
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
        fah: opt.fah
      }).get().then(res => {
        var relation = res.data;
        var alh = [];
        res.data.forEach(v => {
          alh.push(v.alh)
        })

        const db2 = wx.cloud.database()
        db2.collection('wlw_anli').where({
          alh: db2.command.in(alh)
        }).get().then(res => {
          var anliList = res.data;
          // if (fanganList && fanganList.length) {
          //   fanganList.push(...fanganList)
          // }
          this.setData({
            anliList: anliList
          })
        })

      })
    }
})