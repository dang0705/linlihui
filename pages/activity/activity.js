// pages/qinr/qinr.js
const app = getApp(),
	myTools = require("../../common/js/myTools");
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		menu: [
			'本周安排',
			'下周安排',
			'活动管理',
			'场地管理',
		],
		activityIndex: 0,
		swiperItems: 3,
		tabScroll: '',
		isLogin: false,
		placeList: [],
		currentPage: 1,
		maxPages: 0,
		amUpdate: false,
		isPlaceDataFinished: false,
		isThisWeekUpdate:false,
		isNextWeekUpdate:false,
		placeUpdate: false,
		roleId: 0,
		height: 0
	},

	gotoNextWeek(e) {
		this.setData({
			activityIndex: e.detail.tabIndex
		})
	},
	thisWeekUpdated(e){
		this.setData({
			isThisWeekUpdate: false
		})
	},
	nextWeekUpdated(e){
		this.setData({
			isNextWeekUpdate: false
		})
	},
	updatePlace(e) {
		if ( e.detail ) {
			this.setData({
				currentPage: 1,
			});
			console.log('重置');
			this.getPlace()
		}

	},
	/*获取场地*/
	getPlace(e) {
		const that = this;
		myTools.showLoading();
		myTools.ajax('QueryField', {
			OpType: 'Add',
			EmployeeId: app.globalData.ID,
			pageSize: 50,
			pageIndex: this.data.currentPage
		}).then(res => {
			if ( res.status === 1 ) {
				this.setData({
					placeList: res.content
				})
			}
			that.setData({
				placeUpdate: false
			})
		})
	},


	login() {
		myTools.unLogin('', '', this.hasLogin)
	},
	hasLogin() {
		this.setData({
			isLogin: true
		});
	},

	/*点击菜单*/
	switchMenu(e) {
		console.log(e);
		const targetIndex = e.currentTarget.dataset.index;
		let singleTabWidth = app.globalData.windowWidth / 3;
		this.setData({
			tabScroll: (targetIndex - 2) * singleTabWidth
		});
		if ( this.data.activityIndex === targetIndex ) {
			return false
		} else {
			this.setData({
				activityIndex: targetIndex,
			});
		}

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			roleId: app.globalData.roleId
		});
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		// console.log(app.globalData.isLogin);
		if ( typeof this.getTabBar === 'function' && this.getTabBar() ) {
			console.log(app.globalData.roleId);
			myTools.getTabBar(this, 1);
		}
		console.log(this.data.placeUpdate);
		if ( app.globalData.isLogin ) {
			this.setData({
				isLogin: true
			});
		} else {
			this.setData({
				isLogin: false
			});
		}
		if ( this.data.placeUpdate ) {
			this.setData({
				currentPage: 1,
			});
			this.getPlace()
		}

	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		this.getPlace();
		const that = this;
		app.getDeviceInfo().then(res => {

			that.setData({
				height: parseInt(app.globalData.windowHeight-60)
			});
		});
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
