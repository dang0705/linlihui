// pages/sq/sq.js
//获取应用实例
const app = getApp(),
	myTools = require('../../common/js/myTools');

Page({
	data: {
		iconList: [],
		sendNewsArr: [],
		scrollTop: 0,
		currentPage: 1,
		maxPages: 1,
		isDataFinished: false,
		height: ''
	},
	//事件处理函数
	iconInt() {
		const that = this;
		app.getOpenId().then().then(res => {
			this.getNotice();
			myTools.ajax('QueryWeChatMenuByRoleId', {
				RoleId: app.globalData.roleId || '3'
			})
				.then(res => {
					if ( res.status === 1 ) {
						that.setData({
							iconList: res.content
						});
						console.log(that.data.iconList);
					}
				})
				.catch(e => {
					// console.log(e);
				})
		})
	},
	getNotice(e) {
		const that = this;
		myTools.showLoading();
		myTools.pagingAjax('QueryNotice', {
			pageIndex: this.data.currentPage,
			pageSize: app.globalData.pageSize,
			EmployeeCode: app.globalData.mobile
		}, that, e, 'sendNewsArr', 'isDataFinished')
	},
	onLoad: function () {
		const that = this;
		app.getDeviceInfo().then(res => {
			console.log(app.globalData.contentHeight);
			this.iconInt();
			that.setData({
				height: app.globalData.contentHeight + 'px'
			});
		});

	},
	onReachBottom(e) {
		console.log(e);
	},
	onShow: function () {
		// this.iconInt()
		if ( typeof this.getTabBar === 'function' && this.getTabBar() ) {
			myTools.getTabBar(this,0);

		}
	},
	onReady: function () {
		// this.iconInt();

	}
});
