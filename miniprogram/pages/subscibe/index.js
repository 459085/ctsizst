//index.js
//获取应用实例
const $vm = getApp()

const acache = Object.create(null)

const { decodeHtml } = $vm.utils


Page({
  _isLoading: false,
  data: {
    search:'',
    swiperList: [],
    articles: [],
    categoryTabs: [],
    currentTab: $vm.globalData.currentTab
  },
  onShow() {
    this.setData({
      currentTab: $vm.globalData.currentTab
    })
    if ($vm.globalData.categoryChanged) {
      $vm.utils.getCategorys().then(res => this.setData({
        categoryTabs: res
      }))
      // $vm.globalData.categoryChanged = false
    }
  },
  onReady() {
    this.getNewsList(this.data.currentTab)
  },
  onLoad: function () {

  },
  query() {
    wx.navigateTo({
      url: '/pages/search/index2?reg=' + this.data.search
    })
  },
  inputBind(e) {
    this.setData({
      search: e.detail.value
    })
  },
  // 页面相关事件处理函数--监听用户下拉动作，下拉刷新
  onPullDownRefresh() {
    // // 刷新页面，清空当前的缓存，重新获取
    // var chid = this.data.currentTab
    // // 命中缓存
    // if (acache[chid]) {
    //   acache[chid] = {news: [], page: 0, time: Date.now() }
    // }
    // this.getNewsList(chid)
  },
  // 到达底部，重新加载
  onReachBottom() {
   // this.getNewsList(this.data.currentTab, 1)
  },
  // 切换当前选择的分类
  changeCategory(event) {
    var chid = event.target.dataset.id
    // 获取ccurrentTab.没有切换分类
    if (this.data.currentTab === chid) {
      return false
    }
    this.setData({ currentTab: chid })
    $vm.globalData.currentTab = chid
    this.getNewsList(chid, 0)
  },
  getNewsList(chid = 0, page = 0) {
    if (!acache[chid]) {
      // 新内容
      acache[chid] = {  news: [], page: 0, time: Date.now() }
    }
    var infos = acache[chid]
    // 获取下一页数据
    if (page) {
      // 加载中。无法触发
      if (this._isLoading) {
        return false;
      }
      infos.page += 1
    } else {
      // 直接从缓存中取出
      if (infos.news.length) {
        this.setData({
          anliList: infos.news
        })
        return false
      }
    }
    this._isLoading = true
    const db = wx.cloud.database()
    db.collection('wlw_anli').where({
      ssmk: chid
    }).get({
      success: res => {
        this._isLoading = false
        var anliList = res.data;
        if (anliList && anliList.length) {
          // infos.news = []
          infos.news.push(...anliList)
        }
        this.setData({
          anliList: infos.news
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

  },
  manageTabs() {
    wx.navigateTo({
      url: '/pages/news/manage'
    })
  }
})
