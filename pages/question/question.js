// pages/qinr/qinr.js

const app = getApp(),
	myTools = require('../../common/js/myTools');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		questionArr: [],
		questionIndex: 0,
		ajaxQuestionIndex: 1,
		textAreaValue: '',
		mobile1: '021-88888888',
		mobile2: '021-66666666',
		textAreaFocus: false,
		textAreaLength: 0
	},
	getFocus() {
		this.setData({
			textAreaFocus: true
		})
	},
	textAreaBlur() {
		this.setData({
			textAreaFocus: false
		})
	},
	getQuestion() {
		const that = this;
		myTools.ajax('GetAllMetaDataByType', {
			MetaDataType: 'IssueType'
		}).then(res => {
			console.log(res);
			if ( res.status === 1 ) {
				that.setData({
					questionArr: res.content
				})
			}
		})
	},

	makePhoneCall(e) {
		console.log(e);
		wx.makePhoneCall({
			phoneNumber: e.currentTarget.dataset.mobile //仅为示例，并非真实的电话号码
		})
	},
	bindPickerChange(e) {
		// const index = e.detail.value;
		// console.log(this.data.questionArr[ index ].Value);
		this.setData({
			questionIndex: e.detail.value,
			ajaxQuestionIndex: this.data.questionArr[ this.data.questionIndex ].Value
		})
	},
	bindTextAreaBlur(e) {
		console.log(e.detail.value);
		this.setData({
			textAreaValue: e.detail.value,
			textAreaLength: parseInt(e.detail.value.length)
		});
		console.log(this.data.textAreaValue);

	},
	submit() {
		console.log(this.data.textAreaValue);
		if ( !this.data.textAreaValue ) {
			wx.showToast({
				title: '请输入问题描述',
				icon: 'none'

			})
		} else {
			myTools.ajax('OpIssue', {
				OpType: 'Add',
				EmployeePhone: app.globalData.mobile,
				IssueValue: this.data.ajaxQuestionIndex,
				IssueComments: this.data.textAreaValue
			}).then(res => {
				console.log(res);
				if ( res.status === 1 ) {
					wx.showToast({
						title: '提交成功',
						icon: 'none',
						duration: 2000,
						success() {
							setTimeout(function () {
								wx.navigateBack(
									{
										delta: 1
									}
								)
							}, 2000)

						}

					})
				}
			})
		}
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getQuestion()
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
