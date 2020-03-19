// pages/detail/detail.js
let datas = require('../../datas/list-data.js');
let appDatas = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailObj: {},
    index:null,
    isCollected:false,
    isMusicPlay:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取下标参数值
    let index = options.index;
    //更新对象中的detail的值
    this.setData({
      detailObj: datas.list_data[index],
      index:index
    });

    //根据用户本地缓存的数据判断用户是否收藏当前的文章
    let detailStorage = wx.getStorageSync('isCollected');
    //判断用户是否收藏
    if(detailStorage[index]){//收藏
      this.setData({
        isCollected:true
      })
    }

    //监听音乐播放
    wx.onBackgroundAudioPlay(()=>{
      //修改isMusicPlay的状态值
      this.setData({
        isMusicPlay:true
      });

      //修改appData中的数据
      appDatas.data.isPlay=true;
      appDatas.data.pageIndex=index;
    });

    if (appDatas.data.isPlay && appDatas.data.pageIndex === index){
      //修改isMusicPlay的状态值
      this.setData({
        isMusicPlay: true
      });
    }

    //监听音乐暂停
    wx.onBackgroundAudioPause(()=>{
      this.setData({
        isMusicPlay: false
      });
      //修改appData中的数据
      appDatas.data.isPlay = false;
    })
  },

  //处理用户收藏
  handleColleted(){
    let isCollected = !this.data.isCollected;
    //更新状态
    this.setData({
      isCollected:isCollected
    });

    //提示用户
    let title = isCollected ? '收藏成功' : '取消收藏';
    wx.showToast({
      title,
      icon: 'success',
      duration: 2000
    });

    //缓存数据到本地
    let index=this.data.index;
    wx.getStorage({
      key: 'isCollected',
      success: function(res) {
        let obj = res.data;
        obj[index] = isCollected;
        wx.setStorage({
          key: "isCollected",
          data: obj,
          // success:function(){
          // }
          success: () => {
            console.log('success')
          }
        })
      },
      //第一次，未获取进行创建
      fail:() =>{
        let obj = {};
        obj[index] = isCollected;
        wx.setStorage({
          key: "isCollected",
          data: obj,
          success: () => {
            console.log('success')
          }
        })
      }
    });
  },

  //处理音乐点播事件
  handleMusicPlay(){
    let isMusicPlay=!this.data.isMusicPlay;
    this.setData({
      isMusicPlay
    });

    //控制音乐播放
    if(isMusicPlay){
      //paly music
      let { dataUrl, title, coverImgUrl} = this.data.detailObj.music;
      wx.playBackgroundAudio({
        dataUrl,
        title,
        coverImgUrl
      })
    }else{
      //pause music
      wx.pauseBackgroundAudio()
    }
  },

  //处理点击分享
  handleShare(){
    wx.showActionSheet({
      itemList: ['分享到朋友圈', '分享到QQ空间', '分享到微博']
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