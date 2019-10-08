// pages/detail/detail.js
let datas=require("../../datas/list-data.js");
let appDatas=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailObject:{},
    index:null,
    isCollected:false,
    isMusicPlay:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let index=options.index;
   this.setData({
     detailObject:datas.list_data[index],
     index
   })
   let detailStorage=wx.getStorageSync("isCollected");
    if (!detailStorage){
      wx.setStorageSync("isCollected", {})
    }
    if (detailStorage[index]){
      this.setData({
        isCollected:true
      })
    }

    //判断音乐是否在播放
    if(appDatas.data.isPlay && appDatas.data.pageIndex===index){
      //监听音乐播放
      wx.onBackgroundAudioPlay(() => {
        this.setData({
          isMusicPlay: true
        })
        //修改appDatas的值
        appDatas.data.isPlay = true;
        appDatas.data.pageIndex = index;
      })
      //监听音乐暂停
      wx.onBackgroundAudioPause(() => {
        this.setData({
          isMusicPlay: false
        })
        appDatas.data.isPlay = false;
        appDatas.data.pageIndex = index;
      })
    }

    
  },
  handleMusicPlay(){
    let isMusicPlay=!this.data.isMusicPlay;
    this.setData({
      isMusicPlay
    })
    let { dataUrl,title}=this.data.detailObject.music;
    //控制音乐播放
    if (isMusicPlay){
      wx.playBackgroundAudio({
        dataUrl,
        title
      })
    }else{
      wx.pauseBackgroundAudio();
    }
  },
  handleCollection(){
    let isCollected=!this.data.isCollected
    this.setData({
      isCollected
    })
   let title=isCollected ? "收藏成功":"取消收藏"
    wx.showToast({
      title,
      icon: 'success',
      duration: 2000
    })
    let {index}=this.data;
    wx.getStorage({
      key: 'isCollected',
      success: (res)=> {
        let collectObject =res.data;
        collectObject[index] = isCollected;
        //缓存数据到本地
        wx.setStorage({
          key: 'isCollected',
          data: collectObject,
          success: () => {
            console.log("缓存成功")
          }
        })

      },
      fail:()=>{
        collectObject[index] = isCollected;
      }
    })
   
   
   

  },
  //用于处理点击分享
  handleShare(){
    wx.showActionSheet({
      itemList: [
        "分享到朋友圈",
        "分享到微博",
        "分享到qq空间"
      ],
    })
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