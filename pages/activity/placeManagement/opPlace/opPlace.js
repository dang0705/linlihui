// pages/qinr/qinr.js
const app = getApp(), myTools = require('../../../../common/js/myTools');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		mobile: '',
		isFocus: true,
		list: [],
		title: '',
		ImgUrl: '',
		type: "Update",
		selectorValue: '一楼',
		showImgUrl: '',
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
	getValue(e) {
		console.log(e);
		this.setData({
			selectorValue: e.detail.value
		})
	},
	showImg(e) {
		this.setData({
			showImgUrl: e.detail
		})
	},
	getSelectorList() {
		const that = this;
		myTools.ajax('GetAllMetaDataByType', {
			MetaDataType: 'FieldFloorType'
		}).then(res => {
			console.log(res);
			if ( res.status === 1 ) {
				that.setData({
					list: res.content
				})
			}
		})
	},
	save() {

		console.log(this.data);
		if ( !this.data.title ) {
			wx.showToast({
				title: '请正确输入场地名称',
				icon: 'none'
			})
		} else if ( !this.data.selectorValue ) {
			wx.showToast({
				title: '请选择一个场地',
				icon: 'none'
			})
		} else {
			this.setData({
				isDisabled:true
			});
			const that=this;
			console.log(this.data);
			myTools.ajax('OpField', {
				OpType: this.data.type,
				ID: this.data.type === 'Update' ? this.data.info.ID : '',
				FieldName: this.data.title,
				FieldImgUrl: this.data.ImgUrl,
				FieldFloor: this.data.selectorValue,
				EmployeeId: app.globalData.ID
			}).then(res => {
				if ( res.status === 1 ) {
					myTools.upDatePrev('placeUpdate');
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
						isDisabled:false
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
			const info = JSON.parse(options.placeInfo);
			this.setData({
				type: 'Update',
				info
			});
			this.setData({
				title: info.FieldName,
				ImgUrl: info.FieldImgUrl,
				showImgUrl: app.globalData.imgUrl + info.FieldImgUrl,
				selectorValue: info.FieldFloor,
				ID: info.ID
			});
			console.log(this.data);
		}
		this.getSelectorList()

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
