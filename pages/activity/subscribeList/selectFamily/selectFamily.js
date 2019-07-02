// pages/qinr/qinr.js
const myTools = require("../../../../common/js/myTools"),
	app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		familyList: [],
		selected: '',
		selectedArr: [],
		myID: '',
		activityId: '',
		isMyChecked: true,
		isFamilyChecked: [],
		title: '',
		isDisabled: false
	},
	checkGetIndex(e) {
		console.log(e);
		const index = e.currentTarget.dataset.index;
		let arr = this.data.familyList;
		arr[ index ].checked = !arr[ index ].checked;
		this.setData({
			familyList: arr
		})
	},
	selectFamily(e) {
		console.log(e);
		this.setData({
			selectedArr: e.detail.value,
			selected: e.detail.value.toString(),
			isMyChecked: e.detail.value.indexOf(this.data.myID) > -1,
		});
		console.log(this.data);
	},

	subscribe() {
		console.log(this.data.selected);
		let selected = Array.from(new Set(this.data.selected.split(','))).join(',');
		console.log(selected);

		const
			that = this,
			sub = () => {
				this.setData({
					isDisabled: true
				});
				myTools.ajax('OpActivityEmployee', {
					OpType: 'Add',
					ActivityEmployeeID: selected,
					EmployeeId: this.data.myID,
					ActivityID: this.data.activityId
				}).then(res => {
					console.log(res);
					if ( res.status === 1 ) {
						wx.showToast({
							title: '预约成功',
							icon: 'none',
							success() {
								setTimeout(function () {
									/*wx.navigateTo({
										url: '/pages/myOrder/myOrder'
									})*/
									wx.navigateBack({
										delta:2
									})
								},2000)


							}

						})

					} else {
						that.setData({
							isDisabled: false

						})
					}
				})
			};
		if ( this.data.selected === this.data.myID ) {
			wx.showModal({
				title: '预约提示',
				content: `您确定就只为您自己预约吗?`,
				success: res => {
					if ( res.confirm ) {
						sub()
					}
				}
			})
		} else if ( !this.data.selected ) {
			wx.showToast({
				title: '您尚未选择人员哦',
				icon: 'none'
			})
		} else {
			sub()
		}
	},
	getFamilyList() {
		const that = this;
		myTools.ajax('QueryRelatives', {
			OpType: 'Add',
			EmployeeCode: wx.getStorageSync('mobile'),
			pageIndex: 1,
			pageSize: 20
		}).then(res => {
			if ( res.status === 1 ) {
				that.setData({
					familyList: res.content
				});
				that.data.familyList.forEach(item => {
					item.isChecked = false
				});
				console.log(that.data.familyList);
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log(options);
		this.getFamilyList();
		this.setData({
			myID: app.globalData.ID.toString(),
			activityId: options.ActivityID,
			selected: app.globalData.ID.toString(),
			title: options.title
		});
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
