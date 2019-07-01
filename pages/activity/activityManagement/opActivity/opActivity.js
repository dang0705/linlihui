// pages/qinr/qinr.js
const app = getApp(), myTools = require('../../../../common/js/myTools');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isFocus: true,
		list: [],
		title: '',
		ImgUrl: '',
		type: "Update",
		selectorValue: '一楼',
		showImgUrl: '',
		textAreaValue: '',
		textAreaFocus: false,
		ID: '',
		textAreaLength: 0,
		isDisabled:false
	},

	titleInput(e) {
		this.setData({
			title: e.detail.value
		})
	},
	getUrl(e) {
		this.setData({
			ImgUrl: e.detail
		})
	},

	getFocus() {
		this.setData({
			textAreaFocus: true
		})
	},
	bindTextAreaBlur(e) {

		this.setData({
			textAreaValue: e.detail.value,
			textAreaLength: parseInt(e.detail.value.length)

		});
		console.log(this.data.textAreaValue);

	},
	textAreaBlur() {
		this.setData({
			textAreaFocus: false
		})
	},
	showImg(e) {
		this.setData({
			showImgUrl: e.detail
		})
	},

	save() {
		console.log(this.data);
		if ( !this.data.title ) {
			wx.showToast({
				title: '请正确输入活动名称',
				icon: 'none'
			})
		} else {
			this.setData({
				isDisabled:true
			});
			const that=this
			myTools.ajax('OpActivity', {
				OpType: this.data.type,
				ID: this.data.type === 'Update' ? this.data.info.ID : '',
				ActivityName: this.data.title,
				ImgFileUrl: this.data.ImgUrl,
				EmployeeId: app.globalData.ID,
				Comments: this.data.textAreaValue,
			}).then(res => {
				if ( res.status === 1 ) {
					myTools.upDatePrev('amUpdate');
					wx.showToast({
						title: '保存成功',
						icon: 'success',
						success() {
							setTimeout(function () {
								wx.navigateBack({
									delta: 1,
								})
							}, 2000)
						}
					})
				}else {
					that.setData({
						isDisabled:true
					});
				}
			})
		}
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log(options);
		if ( options.type ) {
			this.setData({
				type: 'Add'
			})
		} else {
			const info = JSON.parse(options.info);
			this.setData({
				type: 'Update',
				info
			});
			this.setData({
				title: info.ActivityName,
				ImgUrl: info.ImgFileUrl,
				showImgUrl: app.globalData.imgUrl + info.ImgFileUrl,
				ID: info.ID,
				textAreaValue: info.Comments,
				textAreaLength:info.Comments.length

			});
			console.log(this.data);
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
