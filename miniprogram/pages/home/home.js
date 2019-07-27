// pages/home/home.js
const db = wx.cloud.database({ env: "crc03-nzjwz" })//初始化数据库实例对象
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchText: "",//搜索城市
    cityid: 101180101 ,//c城市id
    city: "城市" ,//c城市id
    date:"xxxx-xx-xx",//日期
    tem:35,//当前温度
    wea: '晴',//天气情况
    air:30,//空气质量
    air_level:"良",
    air_tips:"",
    humidity:'',//湿度
    sevendays:[],//7天
    liveIndex:[]//生活指数
  },
  commitSearch:function(e){
    console.log(e.detail.value)
    this.setData({
      searchText: e.detail.value
    })
    db.collection("ct").where({
      cityZh:this.data.searchText
    }).get().then(res=>{
      console.log(res)
      this.setData({
        cityid: res.data[0].id
      })
      this.loadMore()
    }).catch(err=>{
      console.log(err)
    })
  },
 

  loadMore:function(){
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:"tqapi",
      data:{
        ctid: this.data.cityid
      }
    }).then(res=>{
      var obj = JSON.parse(res.result);
      console.log(obj)
      this.setData({
        cityid: obj.cityid ,//c城市id
        city: obj.city,//c城市id
        date: obj.data[0].date,
        tem: obj.data[0].tem,//当前温度
        wea: obj.data[0].wea,//天气情况
        air: obj.data[0].air,//空气质量
        air_level: obj.data[0].air_level,
        air_tips: obj.data[0].air_tips,
        humidity: obj.data[0].humidity,
        sevendays: obj.data,
        liveIndex: obj.data[0].index
      })
      wx.hideLoading()
    }).catch(err=>{
      console.log(err)
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadMore()
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})