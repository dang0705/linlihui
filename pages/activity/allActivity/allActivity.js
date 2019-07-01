const app = getApp(),
	myTools = require('../../../common/js/myTools');

/*Component({
	behaviors: [],
	// 属性定义（详情参见下文）
	properties: {
		amUpdate: {
			type: Boolean,
			value: false,
			observer(n, o) {
				console.log(n, o);
				this.setData({
					isUpdate: true,
					currentPage: 1
				})
			}
		}
	},
	data: {
		activityManagementList: [],
		isAMDataFinished: false,
		isUpdate: false,
		currentPage: 1,
	}, // 私有数据，可用于模板渲染
	lifetimes: {
		// 生命周期函数，可以为函数，或一个在methods段中定义的方法名
		show: function () {
			console.log('ac');
		},
		attached: function () {
			this._getActivityManagement()
		},
		moved: function () {
		},
		detached: function () {
		},
	},
	// 生命周期函数，可以为函数，或一个在methods段中定义的方法名
	attached: function () {
		this._getActivityManagement()
	}, // 此处attached的声明会被lifetimes字段中的声明覆盖
	ready: function () {
	},

	pageLifetimes: {
		// 组件所在页面的生命周期函数

		show: function () {
			console.log('ac');
			this._getActivityManagement()
		},
		hide: function () {
		},
		resize: function () {
		},
	},
	methods: {
		// 内部方法建议以下划线开头
		_add() {
			wx.navigateTo({
				url: '/pages/activity/activityManagement/opActivity/opActivity?type=Add'
			})
		},
		/!*获得活动管理*!/
		_getActivityManagement(e) {
			console.log(e);
			const that = this;
			myTools.showLoading();
			myTools.pagingAjax('QueryActivity', {
					EmployeeId: app.globalData.ID,
					pageSize: app.globalData.pageSize,
					pageIndex: this.data.currentPage
				},
				that, e, 'activityManagementList', 'isAMDataFinished');
			that.setData({
				amUpdate: false
			})
		},
		_editActivity(e) {
			console.log(e);
			wx.navigateTo({
				url: `/pages/activity/activityManagement/opActivity/opActivity?info=${JSON.stringify(e.currentTarget.dataset.info)}`
			})
		}
	}
});*/
// pages/qinr/qinr.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		activityManagementList: [],
		isAMDataFinished: false,
		isUpdate: false,
		currentPage: 1,
		height: ''
	},
	/*获得活动管理*/
	getActivityManagement(e) {
		console.log(e);
		const that = this;
		myTools.showLoading();
		myTools.pagingAjax('QueryActivity', {
				EmployeeId: '',
				pageSize: app.globalData.pageSize,
				pageIndex: this.data.currentPage
			},
			that, e, 'activityManagementList', 'isAMDataFinished');
		/*that.setData({
			amUpdate: false
		})*/
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getActivityManagement();
		const that = this;
		app.getDeviceInfo().then(res => {
			let height;
			height = app.globalData.platform.indexOf('ios') > -1 ? parseInt(app.globalData.windowHeight) : parseInt(app.globalData.windowHeight) - 60;
			that.setData({
				height: height
			});
		});

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
		if ( typeof this.getTabBar === 'function' && this.getTabBar() ) {
			// console.log(app.globalData.roleId);
			myTools.getTabBar(this, 1);
			this.getOrderList()
		}
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
