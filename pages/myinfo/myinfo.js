const app = getApp();
const myTools = require('../../common/js/myTools'),
	mobileReg = myTools.mobileReg,
	ID = myTools.ID;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		/*avatar: '',
		nickname: '',*/
		name: '',
		mygender: [ '男', '女' ],
		mygenderIndex: 0,
		birthday: '',
		idCode: '',
		mobile: '',
		verifyCode: '',

		hasUserInfo: false,
		isFocus: false,
		inputVerify: '',
		verifyText: "发送验证码",
		isSendDisabled: false,
		isImgShow: false,
		imgUrl: '',
	},
	bindGenderChange(e) {
		console.log(e);
		this.setData({
			mygenderIndex: e.detail.value
		})
	},
	bindDateChange(e) {
		console.log(e.detail.value);
		if ( e.type === 'change' ) {
			this.setData({
				birthday: e.detail.value
			})
		}
	},
	acceptVerify(e) {
		this.setData({
			inputVerify: e.detail.value
		});
	},
	acceptMobileNum(e) {
		console.log(e);
		this.setData({
			mobile: e.detail.value
		});

		if ( e.detail.value !== app.globalData.mobile ) {
			this.setData({
				isFocus: true
			})
		} else {
			const that = this;
			wx.showToast({
				title: '您输入的手机号和您当前绑定手机号的一致',
				icon: 'none',
				duration: 2000,
				success() {
					that.setData({
						isFocus: false
					})
				}
			})

		}
	},
	acceptIDInput(e) {
		this.setData({
			idCode: e.detail.value
		})
	},
	acceptNameInput(e) {
		this.setData({
			name: e.detail.value
		})
	},
	/*查询是否是会员*/
	isMemberCheck(mobile) {
		// console.log(mobile);
		const that = this;
		let addOrUpdate = (mobile, opType) => {
			myTools.ajax('OpUser', {
				OpType: opType,
				EmployeePhone: this.data.mobile,
				EmployeeCode: this.data.mobile,
				EmployeeOpenId: app.globalData.openid,
				RealName: this.data.name,
				CardNo: this.data.idCode,
				DateOfBirth: this.data.birthday,
				Sex: this.data.mygender[ this.data.mygenderIndex ]
			}).then(res => {
				console.log(res);
				if ( res.status === 1 ) {
					wx.showToast({
						title: '个人信息更新成功',
						icon: 'success',
						duration: 2000,
						success() {
							wx.setStorageSync('mobile', mobile);
							wx.setStorageSync('img',that.data.imgUrl);
							let appData = app.globalData;
							appData.name = that.data.name;
							appData.birthday = that.data.birthday;
							appData.gender = that.data.mygenderIndex == 0 ? '男' : '女';
							appData.IDCode = that.data.idCode;
							// appData.face = that.data.imgUrl;
							appData.mobile = mobile;
							console.log(appData);
							wx.navigateBack({
								delta: 1
							})
						}
					})
				}
			})
		};

		myTools.ajax('LoginCheck', {
			EmployeeCode: app.globalData.openid
		}).then(res => {
			/*是会员,更改*/
			if ( res.status === 1 ) {
				addOrUpdate(mobile, 'Update')
			}
			/*不是会员,新增*/
			else {
				addOrUpdate(mobile, 'Add')
			}

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
	/*唤起摄像头*/
	openCamera() {
		let that = this;
		myTools.uploadImg(that, '', '', app.globalData.openid,).then(res => {
			console.log(that.data);
			if ( res.status === 1 ) {
				app.globalData.face=that.data.imgUrl;
				wx.showToast({
					title: '照片上传成功',
					icon: 'success',
					duration: 2000
				})
			}
		})
	},

	/*显示图片*/
	showImg() {
		this.setData({
			isImgShow: true
		})
	},
	hideImg() {
		this.setData({
			isImgShow: false
		})
	},
	saveMyInfo() {
		const that = this;
		if ( !this.data.mobile || !mobileReg.test(this.data.mobile) ) {
			wx.showToast({
				title: '请正确输入您的手机号',
				icon: 'none',
				duration: 2000

			})
		} else if ( this.data.idCode && !ID.test(this.data.idCode) ) {
			wx.showToast({
				title: '请正确输入你的身份号码',
				icon: 'none',
				duration: 2000
			})
		} else if ( (this.data.mobile !== app.globalData.mobile) && !this.data.verifyCode || this.data.verifyCode !== this.data.inputVerify ) {
			wx.showToast({
				title: '请正确填写验证码',
				icon: 'none',
				duration: 2000
			})
		} else if ( !this.data.imgUrl ) {
			wx.showToast({
				title: '请先通过人脸识别',
				icon: 'none',
				duration: 2000
			})
		} else {
			this.isMemberCheck(this.data.mobile);
		}

	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log(app.globalData);
		if ( wx.getStorageSync('nickName') ) {
			this.setData({
				hasUserInfo: true
			})
		}
		console.log(this.data);
		this.setData({
			mobile: app.globalData.mobile,
			name: app.globalData.name,
			mygenderIndex: app.globalData.gender === '男' ? 0 : 1,
			birthday: app.globalData.birthday || "1900-01-01",
			idCode: app.globalData.IDCode || '',
			// photoUploaded: !!app.globalData.face,
			imgUrl: app.globalData.face,
		});
		let userInfo = options;
		if ( userInfo ) {
			// let userInfo = JSON.parse(options);
			this.setData({
				avatar: userInfo.userAvatar,
				nickname: userInfo.userNickname,
				gender: userInfo.gender
			})
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
