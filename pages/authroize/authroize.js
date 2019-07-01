const app = getApp();
const myTools = require('../../common/js/myTools'),
	mobileReg = myTools.mobileReg;

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		userCancelAuthorize: false,
		mobile: '',
		verifyCode: '',
		inputVerify: '',
		verifyText: '发送验证码',
		isSendDisabled: false
	},

	/*获取手机号码*/
	getUserMobile(e) {
		console.log(app.globalData);
		const that = this;
		if ( e.detail.errMsg === 'getPhoneNumber:ok' ) {
			wx.request({
				url: 'https://xt.shi1.cn/api/PubliceApi/GetWxUserPhone',
				method: 'POST',
				data: {
					EncryptedData: e.detail.encryptedData,
					SessionKey: app.globalData.sessionKey,
					IV: e.detail.iv
				},
				success(res) {
					console.log(res);
					if ( res.data.status === 1 ) {
						const mobile = JSON.parse(res.data.content);
						wx.setStorageSync('mobile', mobile.phoneNumber);
						app.globalData.mobile = mobile.phoneNumber;
						that.isMemberCheck(mobile.phoneNumber);
						app.globalData.isMember = true;
						console.log(app.globalData);
					}
					wx.navigateBack({
						delta: 1
					})
				}
			})
		} else {
			that.setData({
				userCancelAuthorize: true
			});
		}
	},


	/*查询是否是会员*/
	isMemberCheck(mobile) {
		const that = this
		let OpUser = function (Op, isMember) {
			myTools.ajax('OpUser', {
				OpType: Op,
				EmployeeOpenId: app.globalData.openid,
				EmployeePhone: mobile,
				EmployeeCode: mobile,
			})
				.then(res => {
					if ( res.status === 1 ) {
						if ( !isMember ) {
							app.globalData.isMember = true;
						}
						wx.setStorageSync('mobile', mobile);
						app.globalData.mobile = mobile;
						app.globalData.isLogin = true;
						wx.navigateBack({
							delta: 1
						})
					} else {
						wx.showToast({
							title: res.result,
							icon: 'none'
						})
					}
				})
				.catch(e => {
					wx.showToast({
						title: `${e}`,
						icon: 'none'
					})
				})
		};
		myTools.ajax('LoginCheck', {
			EmployeeCode: mobile
		}).then(res => {
			/*是会员,更改*/
			if ( res.status === 1 ) {
				OpUser('Update')
			}
			/*不是,新建*/
			else {
				OpUser('Add', false)
			}

		});
	},
	/*绑定手机号*/
	bindMobile() {
		const that = this;
		if ( !this.data.mobile && !mobileReg.test(this.data.mobile) ) {
			wx.showToast({
				title: '请正确填写手机号',
				icon: 'none',
				duration: 2000
			})
		} else if ( !this.data.inputVerify || this.data.inputVerify !== this.data.verifyCode ) {
			wx.showToast({
				title: '请正确填写验证码',
				icon: 'none',
				duration: 2000
			})
		} else {
			that.isMemberCheck(that.data.mobile);
		}

	},

	acceptVerify(e) {
		this.setData({
			inputVerify: e.detail.value
		});
	},

	acceptMobileNum(e) {
		this.setData({
			mobile: e.detail.value
		});
	},

	/*发送验证码*/
	sendCode() {
		const that = this;
		let count = 60, contDownTimer = null;
		if ( !this.data.mobile && !mobileReg.test(this.data.mobile) ) {
			wx.showToast({
				title: '请正确填写手机号',
				icon: 'none',
				duration: 2000
			})
		} else {
			myTools.ajax('OpUser', {
				OpType: 'VerificationCode',
				EmployeePhone: this.data.mobile
			}).then(res => {
				console.log(res);
				if ( res.status === 1 ) {
					that.setData({
						isSendDisabled: true,
						verifyCode: res.content
					});
					countDown()
				} else {
					wx.showToast({
						title: res.result,
						icon: 'none',
						duration: 2000
					})
				}
			})
		}

		function countDown() {
			contDownTimer = setInterval(function () {
				count--;
				that.setData({
					verifyText: count + '秒后重新获取'
				});
				if ( count <= 0 ) {
					clearInterval(contDownTimer);
					contDownTimer = null;
					count = 60;
					that.setData({
						verifyText: '发送验证码',
						isSendDisabled: false
					});
				}
			}, 1000)
		}
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

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
