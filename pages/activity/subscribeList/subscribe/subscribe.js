// pages/qinr/qinr.js
const myTools = require("../../../../common/js/myTools"),
	app = getApp();
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		familyList: [],
		isShowFamily: false,
		showText: '选择亲人',
		selected: '',
		myID: '',
		myAvatar: '',
		ActivityID: '',
		activityTitle: '',
		activityComments: '',
		activityImg: '',
		imgUrl: '',
	},
	subscribe() {
		wx.navigateTo({
			url: `/pages/activity/subscribeList/selectFamily/selectFamily?ActivityID=${this.data.ActivityID}&title=${this.data.activityTitle}`
		})
	},
	showFamily(e) {
		console.log(e);
		this.setData({
			isShowFamily: !this.data.isShowFamily,
			showText: this.data.isShowFamily ? '选择亲人' : '收起列表'
		})
	},
	touchBlank(e) {
		this.setData({
			isShowFamily: false,
			showText: '选择亲人'
		})
	},
	selectFamily(e) {
		console.log(e);
		this.setData({
			selected: e.detail.value.toString()
		});
		console.log(this.data.selected);
	},
	getFamilyList() {
		const that = this;
		myTools.ajax('QueryRelatives', {
			OpType: 'Add',
			EmployeeCode: wx.getStorageSync('mobile'),
			pageIndex: 1,
			pageSize: 20
		}).then(res => {
			if ( res.status === 1 ) {
				that.setData({
					familyList: res.content
				})
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let parm = JSON.parse(options.info);

		console.log(parm);
		this.getFamilyList();
		this.setData({
			myID: app.globalData.ID,
			myAvatar: app.globalData.avatar,
			selected: [ app.globalData.ID ].toString(),
			ActivityID: parm.ID,
			activityTitle: parm.ActivityName,
			activityComments: parm.Comments,
			activityImg: parm.ImgFileUrl,
			activityDate: parm.ActivityDate + ' ' + parm.StartTime,
			imgUrl: app.globalData.imgUrl
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
		console.log('hide');
	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {
		console.log('unLoad');
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
