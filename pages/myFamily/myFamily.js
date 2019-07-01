const app = getApp(),
	myTools = require('../../common/js/myTools');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		family: [],
		isShowCheckInput: false,
		mobileNumber: '',
		touchStart: '',
		touchEnd: '',
		update:false
	},
	mobileInput(e) {
		// console.log(e);
		this.setData({
			mobileNumber: e.detail.value
		})
	},
	touchFamilyStart(e) {
		console.log(e);
		this.setData({
			touchStart: e.timeStamp
		})
	},
	touchFamilyEnd(e) {
		console.log(e);
		this.setData({
			touchEnd: e.timeStamp
		})
	},
	/*编辑已存在的亲戚*/
	editFamily(e) {
		let touchDuration = this.data.touchEnd - this.data.touchStart;
		if ( touchDuration < 350 ) {
			myTools.showLoading();
			console.log(e);
			const that = this,
				data = e.currentTarget.dataset,
				ID = data.id,
				mobile = data.mobile,
				avatar = data.avatar,
				call = data.call;

			let url = '',
				birthday = '',
				genderIndex = '',
				Identification = '';
			myTools.ajax('LoginCheck', {
				EmployeeCode: mobile
			}).then(res => {
				myTools.nullToEmpty(res.content);
				console.log(res);
				myTools.hideLoading();
				if ( res.status === 1 ) {
					let data = res.content[ 0 ];
					console.log(data.DateOfBirth);
					console.log(data.WeChatUrl);
					url += `/pages/eachFamily/eachFamily?
						ID=${ID}
						&mobile=${mobile}
						&call=${call}
						&name=${data.RealName}
						&IDNumber=${data.CardNo}
						&birthday=${data.DateOfBirth}
						&avatar=${data.WeChatUrl}
						&gender=${data.Sex === '男' ? 0 : 1}
						&face=${data.Facefile?app.globalData.imgUrl+data.Facefile:''}
						&type=Update`;
					url = myTools.clearSpaceAndEnter(url);
					console.log(url);
					wx.navigateTo({
						url: url
					})
				}else{

				}

			})
		} else {
			console.log('触发长按');
		}

		/*	wx.navigateTo({
				url: url
			})*/


	},


	/*查看亲戚手机是否绑定过*/
	check() {
		const that = this;
		if ( !myTools.mobileReg.test(this.data.mobileNumber) ) {
			wx.showToast({
				title: '请正确输入手机号',
				icon: 'none'
			})
		}else if(this.data.mobileNumber===app.globalData.mobile){
			wx.showToast({
				title: '不能输入您自己的手机号',
				icon: 'none'
			})
		}
		else {
			myTools.showLoading();
			myTools.ajax('LoginCheck', {
				EmployeeCode: this.data.mobileNumber
			}).then(res => {
				myTools.hideLoading();
				console.log(res);
				let url = '/pages/eachFamily/eachFamily?type=Add';
				if ( res.status === 1 ) {
					myTools.nullToEmpty(res.content[ 0 ]);
					url += `&mobile=${that.data.mobileNumber}
					&ID=${res.content[ 0 ].ID}
					&avatar=${res.content[ 0 ].WeChatUrl}
					&openid=${res.content[ 0 ].WxOpenId}
					&gender=${res.content[ 0 ].Sex}
					&genderIndex=${res.content[ 0 ].Sex === '男' ? 0 : 1}
					&birthday=${res.content[ 0 ].DateOfBirth}
					&name=${res.content[ 0 ].RealName}
					&IDNumber=${res.content[ 0 ].CardNo}`;
					url = myTools.clearSpaceAndEnter(url);
					console.log(url);
					wx.showModal({
					  title: '该手机号已绑定',
					  content: '是否完善亲人信息?',
					  success: res=>{
					    if (res.confirm) {
						    wx.navigateTo({
							    url: url,
							    success() {
								    that.setData({
									    isShowCheckInput: false,
									    mobileNumber: ''
								    });
							    }
						    })
					    }
					  }
					})
				} else {
					url += `&mobile=${that.data.mobileNumber}`;
					wx.showModal({
						title: '该手机号未绑定',
						content: '是否绑定该手机?',
						success(res) {
							if ( res.confirm ) {
								wx.navigateTo({
									url: url,
									success() {
										that.setData({
											isShowCheckInput: false,
											mobileNumber: ''
										});
									}
								})
							}
						}
					});
				}


			})
		}

	},

	checkIsMember() {
		this.setData({
			isShowCheckInput: true
		});
		console.log(1);
	},
	getFamily() {
		const that = this;
		myTools.ajax('QueryRelatives', {
			OpType: 'Add',
			EmployeeCode: app.globalData.mobile,
			pageIndex: 1,
			pageSize: 10
		}).then(res => {
			console.log(res);
			if ( res.status === 1 ) {
				myTools.nullToEmpty(res.content);
				console.log(res.content);
				that.setData({
					family: res.content
				})
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log('myFamily');
		this.getFamily();
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
		console.log(this.data.update);
		if ( this.data.update ) {
			this.getFamily()
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
