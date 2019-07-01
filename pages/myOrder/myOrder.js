// pages/qinr/qinr.js
const app = getApp(),
	myTools = require("../../common/js/myTools");
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		orderList: [],
		familyList: [],
		height: '',
		familyHeight: '',
		isLogin: false
	},
	getFamily() {
		const that = this;
		myTools.ajax('QueryRelatives', {
			OpType: 'Add',
			EmployeeCode: app.globalData.mobile,
			pageIndex: 1,
			pageSize: 10
		}).then(res => {
			if ( res.status === 1 ) {
				myTools.nullToEmpty(res.content);
				that.setData({
					familyList: res.content
				})
			}
			that.getFamilyHeight()
		})
	},
	getFamilyHeight(){
		const that = this;
		wx.createSelectorQuery().selectAll('#family').boundingClientRect(rect => {
			that.setData({
				familyHeight: rect[ 0 ].height
			})
		}).exec()
	},
	login() {
		myTools.unLogin('', '', this.hasLogin);
		// this.getFamilyHeight()
	},
	hasLogin() {
		this.setData({
			isLogin: true
		});
		this.getFamily();
		this.getOrderList();
	},
	getOrderList() {
		const that = this;
		myTools.showLoading();
		myTools.ajax('GetActivityAndEmployee', {
			EmployeeId: app.globalData.ID,
			pageIndex: 1,
			pageSize: 100
		})
			.then(res => {
				console.info(JSON.stringify(res));
				if ( res.status === 1 ) {
				that.setData({
					orderList: res.content
				})
			} else {
				that.setData({
					orderList: []
				})
			}
		});


		function groupByName(data, key) {
			let map = {},
				dest = [];
			data.forEach(item => {
				if ( !map[ item[ key ] ] ) {
					dest.push({
						activityDate: item[ key ],
						activityArray: [ item ]
					});
					map[ item[ key ] ] = item;
				} else {
					for ( var i = 0; i < dest.length; i++ ) {
						var dj = dest[ i ];
						if ( dj.activityDate === item[ key ] ) {
							dj.activityArray.push(item);
							break;
						}
					}
				}
			});
			dest.sort(
				function (a, b) {
					return Date.parse(a.activityDate) - Date.parse(b.activityDate);
				}
			);

			return dest;
		}
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// this.getOrderList()
		let height = app.globalData.platform.indexOf('ios') > -1 ? parseInt(app.globalData.windowHeight) : parseInt(app.globalData.windowHeight) - 60;
		this.setData({
			height
		});
		if ( this.data.isLogin ) {
			this.getFamily();
			this.getOrderList();
		}
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
		}
		if ( app.globalData.isLogin ) {
			this.setData({
				isLogin: true
			});
		} else {
			this.setData({
				isLogin: false
			});
		}
		if ( this.data.isLogin ) {
			this.getFamily();
			this.getOrderList();
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
