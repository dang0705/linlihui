const app = getApp(),
	myTools = require('../../common/js/myTools');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo: {},
		mobile: '',
		hasUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo'),
		roleId:''
	},
	getUserInfo(e) {
		console.log(e);
		if ( e.detail.iv ) {
			app.globalData.userInfo = e.detail.userInfo;
			console.log(app.globalData);
			this.setData({
				userInfo: e.detail.userInfo,
				hasUserInfo: true
			});
			this.isMemberCheck(app.globalData.mobile, this.data.userInfo.nickName, this.data.userInfo.avatarUrl, this.data.userInfo.gender)
			// wx.setStorageSync('nickName', e.detail.userInfo.nickName);
		} else {
			this.setData({
				hasUserInfo: false
			})
		}
	},

	isMemberCheck(mobile, nickName, avatar, gender) {
		let addOrUpdate = OpType => {
			myTools.showLoading();
			myTools.ajax('OpUser', {
				OpType: OpType,
				EmployeeOpenId: app.globalData.openid,
				EmployeePhone: mobile,
				EmployeeName: nickName,
				WeChatUrl: avatar,
				Sex: gender === 1 ? '男' : '女'
			}).then(res => {
				app.globalData.nickName = nickName;
				app.globalData.avatar = avatar;
				wx.setStorageSync('nickName', nickName)
			}).catch(e => {
				console.log(e);
			})
		};
		myTool.ajax('LoginCheck', {
			EmployeeCode: mobile
		}).then(res => {
			/*是会员,更改*/
			if ( res.status === 1 ) {
				addOrUpdate('Update')
			}
			/*不是,新建*/
			else {
				addOrUpdate('Add')
			}

		});
	},
	getUserInfoInt() {
		const mobile = wx.getStorageSync('mobile'),
			nickName = wx.getStorageSync('nickName');
		if ( mobile ) {
			this.setData({
				mobile: this.formatMobile(app.globalData.mobile),
			})
		}
		if ( nickName ) {
			this.setData({
				hasUserInfo: true
			})
		}
	},

	clearGlobalData() {
		const that = this;
		app.globalData.isLogin = false;
		wx.showModal({
			title: '退出登录',
			content: '退出登陆后,您将无法预约活动以及查看相关信息,您仍然要退出吗?',
			success: res => {
				if ( res.confirm ) {
					wx.removeStorage({
						key: 'mobile',
						success(res) {
							console.log(res);
							// app.globalData.mobile = '';
							that.setData({
								mobile: '',
								hasUserInfo: false,
								userInfo: {}
							});
							// app.globalData.nickName = '';
							wx.removeStorageSync('nickName');
							console.log(app.globalData);
						}
					})
				}
			}
		})

	},
	gotoLogin() {
		const that = this;
		if ( app.globalData.isMember ) {
			wx.showModal({
				title: '您已经绑定过手机',
				content: '是否使用绑定的手机号进行登陆',
				success(res) {
					if ( res.confirm ) {
						that.setData({
							mobile: that.formatMobile(app.globalData.mobile)
						});
						if ( app.globalData.nickName || app.globalData.avatar ) {
							that.setData({
								hasUserInfo: true,
							});
							wx.setStorageSync('nickName', app.globalData.nickName);
						}
						app.globalData.isLogin = true;
						wx.setStorageSync('mobile', app.globalData.mobile);
					} else if ( res.cancel ) {
						console.log('用户点击取消')
					}
				}
			})
			console.log(this.data.mobile);
		} else {
			wx.navigateTo({
				url: '/pages/authroize/authroize',
				success(res) {
					console.log(res);
				}
			})
		}

	},
	formatMobile(mobile) {
		return mobile.substring(0, 3) + '****' + mobile.substring(7, mobile.length)
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		if ( app.globalData.userInfo ) {
			this.setData({
				userInfo: app.globalData.userInfo,
				hasUserInfo: true
			})
		} else if ( this.data.canIUse ) {
			// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
			// 所以此处加入 callback 以防止这种情况
			app.userInfoReadyCallback = res => {
				this.setData({
					userInfo: res.userInfo,
					hasUserInfo: true
				})
			}
		} else {
			// 在没有 open-type=getUserInfo 版本的兼容处理
			wx.getUserInfo({
				success: res => {
					app.globalData.userInfo = res.userInfo
					this.setData({
						userInfo: res.userInfo,
						hasUserInfo: true
					})
				}
			})
		}
		this.setData({
			roleId:app.globalData.roleId
		})
		// this.getUserInfoInt()
		// console.log(app.globalData.userInfo);
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
			myTools.getTabBar(this,2);
		}
		this.getUserInfoInt()
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
