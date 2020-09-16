// 云函数入口文件-分享方案
const cloud = require('wx-server-sdk')
// 初始化 cloud
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  let { _id} = event
  try {
    return await db.collection('wlw_fangan').doc(_id).update({
      data: {
        fxl: db.command.inc(1)
      }
    })
  } catch (e) {
    console.log(e)
  }
}