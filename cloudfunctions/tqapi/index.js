  // 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
/*
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}
*/

var rp = require("request-promise");
exports.main = async (event, context) => {
  var url = `https://www.tianqiapi.com/api/?version=v1&cityid=${event.ctid}`;
  return rp(url)     
    .then(res => {    
      return res;      
    }).catch(err => {    
      return err;      
    })
}