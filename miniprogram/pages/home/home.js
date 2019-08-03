// pages/home/home.js
const db = wx.cloud.database({ env: "crc03-nzjwz" })//初始化数据库实例对象
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchText: "",//搜索城市
    cityid: 0 ,//c城市id
    city: "" ,//c城市id
    date:"",//日期
    tem:0,//当前温度
    wea: '',//天气情况
    air:0,//空气质量
    air_level:"",
    air_tips:"",
    humidity:'',//湿度
    sevendays:[],//7天
    liveIndex:[],//生活指数
  },
  commitSearch:function(e){//搜索
    console.log(e.detail.value)
    this.setData({
      searchText: e.detail.value
    })
    db.collection("ct").where({//查询集合获取id
      cityZh:this.data.searchText
    }).get().then(res=>{
      console.log(res)
      this.setData({
        cityid: res.data[0].id
      })
      this.loadMore();//加载
      this.setData({
        searchText: ""
      })
    }).catch(err=>{
      console.log(err)
    })
  },


  getUserLocation: function () { //获取权限
    let cc = this;
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      cc.getuserL();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          cc.getuserL();
        }
        else {
          //调用wx.getLocation的API
          cc.getuserL();
        }
      }
    })
  },

  getuserL:function(){//获取用户经度纬度
    var cc=this
    wx.getLocation({
      type: 'gcj02',
      success: function (res) { 
        //console.log(res)
        var lat = res.latitude
        var lon = res.longitude
        cc.getcity(lat,lon)//传经纬 调用获取地址函数
      },
      fail: function (err) { 
        console.log(err)
      },
    })
  },
  
  getcity:function(lat,lon){ //获取地址
      var cc=this
      qqmapsdk.reverseGeocoder({
        location: {
          latitude:lat,
          longitude:lon
        },
        success: function (res) {//地址
          console.log(res.result.address_component)
          var district = res.result.address_component.district;//区
          district = district.substring(0, district.length - 1)//数据库不带市区字符删除最后1字
          db.collection("ct").where({//查询数据库市区id
            cityZh: district
          }).get().then(res => {
            cc.setData({
              cityid: res.data[0].id
            })
            cc.loadMore()//加载
          }).catch(err => {
            console.log(err)
          })

        },
        fail: function (res) {
          console.log(res);
        },
      });
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
      //console.log(obj)
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
    qqmapsdk = new QQMapWX({
      key: 'ETRBZ-UW53F-W22JR-N6MDO-W7CDS-W3FML'
    });
    //this.getuserL()
    this.getUserLocation()
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
    this.loadMore()
    wx.showNavigationBarLoading() //在标题栏中显示加载
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
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