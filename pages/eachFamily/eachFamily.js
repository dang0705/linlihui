const myTools = require('../../common/js/myTools'),
	app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		type: 'Update',
		birthday: "1950-01-01",
		gender: [ '男', '女' ],
		genderIndex: 0,
		isAvatarShow: true,
		familyInfo: {},
		call: '',
		canIEdit: false,
		mobile: '',
		isImgShow: false,
		imgUrl: '',
		isDisabled: false,
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
	callInput(e) {
		// var name = this.data.familyInfo.RelativesName;
		this.setData({
			call: e.detail.value
		});
		// console.log(this.data.familyInfo.RelativesName);
	},
	nameInput(e) {
		// var name = this.data.familyInfo.RelativesName;
		this.setData({
			'familyInfo.name': e.detail.value
		});
		// console.log(this.data.familyInfo.RelativesName);
	},
	mobileInput(e) {
		// var mobile = this.data.familyInfo.mobile;
		this.setData({
			'familyInfo.mobile': e.detail.value
		});
		console.log(this.data.familyInfo.mobile);

	},
	IDNumberInput(e) {
		this.setData({
			'familyInfo.IDNumber': e.detail.value
		})
	},

	/*唤起摄像头*/
	openCamera() {
		let that = this;
		myTools.uploadFile(that, this.data.mobile, '', '','relatives')
			.then(res => {
				if ( res.status === 1 ) {
					that.setData({
						photoUploaded: true,
						imgUrl:app.globalData.imgUrl+res.content,
						imgRealUrl:res.content
					});
					wx.showToast({
						title: '照片上传成功',
						icon: 'success',
						duration: 2000
					})
				}
			})
	},

	/******保存*******/
	saveMyEachFamily() {
		const that = this;
		if ( !this.data.call ) {
			wx.showToast({
				title: '请输入您亲人的称谓',
				icon: 'none'
			})
		} else if ( !this.data.familyInfo.name ) {
			wx.showToast({
				title: '请输入您亲人的姓名',
				icon: 'none'
			})
		} else if ( this.data.familyInfo.IDNumber && !myTools.ID.test(this.data.familyInfo.IDNumber) ) {
			wx.showToast({
				title: '身份证号码有误',
				icon: 'none'
			})
		} else {
			that.setData({
				isDisabled: true,
			});
			console.log(this.data.genderIndex);
			myTools.ajax('OpRelatives', {
				OpType: this.data.type,
				ID: this.data.familyInfo.ID,
				EmployeeCode: app.globalData.mobile,
				RelativesCode: this.data.familyInfo.mobile,
				RelativesName: this.data.call,
				RelativesFileUrl: this.data.familyInfo.avatar
			}).then(res => {
				console.log(res);
				if ( res.status === 1 ) {
					myTools.ajax('OpUser', {
						OpType: this.data.type,
						EmployeePhone: this.data.familyInfo.mobile,
						EmployeeCode: this.data.familyInfo.mobile,
						// EmployeeOpenId: app.globalData.openid,
						CardNo: that.data.familyInfo.IDNumber,
						RealName: that.data.familyInfo.name,
						DateOfBirth: that.data.birthday,
						Facefile:that.data.imgRealUrl,
						Sex: that.data.genderIndex == 0 ? '男' : '女'
					}).then(res => {
						console.log(res);
						wx.showToast({
							title: '保存成功',
							icon: 'success',
							duration: 2000,
							success() {
								setTimeout(function () {
									myTools.upDatePrev('update');
									wx.navigateBack({
										delta: 1
									})
									/*that.setData({
										isDisabled:false,
									});*/
								}, 2000)

							}
						})
					})

				}
			})
		}

	},

	bindGenderChange(e) {
		this.setData({
			genderIndex: e.detail.value
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
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log(options);
		if ( options.ID ) {
			this.setData({
				type: options.type,
				call: options.call,
				familyInfo: options,
				genderIndex: options.genderIndex || options.gender,
				birthday: options.birthday || this.data.birthday,
				isAvatarShow: false,
				canIEdit: true,
				imgUrl:options.face
			})
		} else {
			if ( options.call ) {
				this.setData({
					familyInfo: options,
					genderIndex: options.genderIndex || options.gender,
					birthday: options.birthday || this.data.birthday,
					type: options.type,
				});
			} else {
				this.setData({
					isAvatarShow: false,
					type: options.type,
					'familyInfo.mobile': options.mobile
				})
			}
		}
		this.setData({
			mobile: options.mobile
		})

		// this.data.familyInfo.gender==='男'?this.setData({genderIndex:1}):this.setData({genderIndex:0});
		console.log(this.data);
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
