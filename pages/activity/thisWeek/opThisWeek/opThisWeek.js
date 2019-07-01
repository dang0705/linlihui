// pages/qinr/qinr.js
const myTools = require("../../../../common/js/myTools"), app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		type: 'Update',
		selectDateStartTime: '',
		selectDateEndTime: '',
		isAllDay: false,
		startTime: '',
		endTime: '',
		activitySelected: '',
		activityID: '',
		placeSelected: '',
		placeID: '',
		currentPage: 1,
		activityList: [],
		placeList: [],
		isDisabled:false,
		date: '',
		editFlag: true,
		ID: '',
		thisWeekActivityIndex: ''
	},
	getActivity() {
		const that = this;
		myTools.ajax('QueryActivity', {
			EmployeeId: app.globalData.ID,
			pageIndex: this.data.currentPage,
			pageSize: 100
		}).then(res => {
			if ( res.status === 1 ) {
				that.setData({
					activityList: res.content
				})
			}
		})
	},
	getPlace() {
		const that = this;
		myTools.ajax('QueryField', {
			EmployeeId: app.globalData.ID,
			pageIndex: this.data.currentPage,
			pageSize: 100
		}).then(res => {
			if ( res.status === 1 ) {
				that.setData({
					placeList: res.content
				})
			}
		})
	},
	getActivityVal(e) {
		console.log(e);
		this.setData({
			activityID: e.detail.ID,
			activitySelected: e.detail.value
		})
	},
	getPlaceVal(e) {
		console.log(e);
		this.setData({
			placeID: e.detail.ID,
			placeSelected: e.detail.value
		})
	},
	switchStatus(e) {
		this.setData({
			isAllDay: e.detail
		})

	},
	getStartTime(e) {
		console.log(e);
		this.setData({
			startTime: e.detail,
		});
	},
	getEndTime(e) {
		this.setData({
			endTime: e.detail
		});
		console.log(this.data);
	},
	save() {
		const that = this;
		if ( !this.data.activityID ) {
			wx.showToast({
				title: '请选择活动',
				icon: 'none'

			})
		} else if ( !this.data.placeID ) {
			wx.showToast({
				title: '请选择场地',
				icon: 'none'
			})
		} else {
			var parseDate=this.data.date.split('-')[1];
			if ( parseDate.charAt(0) === '0' ) {
				parseDate=parseDate.substring(1);
			}
			this.setData({
				isDisabled:true,
			});
			myTools.ajax('OpActivityField', {
				OpType: this.data.type,
				ID: this.data.type === 'Update' ? this.data.ID : '',
				ActivityID: this.data.activityID,
				ActivityName: this.data.activitySelected,
				FieldName: this.data.placeSelected,
				FieldID: this.data.placeID,
				ActivityDate: this.data.date.split('-')[0]+'-'+parseDate+'-'+this.data.date.split('-')[2],
				StartTime: this.data.startTime,
				EndTime: this.data.endTime,
				AllDayTimeStatus: this.data.isAllDay ? 1 : 0,
				EmployeeId: app.globalData.ID
			})
				.then(res => {
					console.log(res);
					if ( res.status === 1 ) {
						wx.showToast({
							title: '活动发布成功',
							icon: 'success',
							success() {
								let sendIndex = '';
								myTools.upDatePrev('isThisWeekUpdate');
								setTimeout(function () {
									wx.navigateBack({
										delta: 1,
									})
								}, 2000)
							}
						})
					}else {
						that.setData({
							isDisabled:false,
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
		this.setData({
			selectDateStartTime: app.globalData.timeStart,
			selectDateEndTime: app.globalData.timeEnd
		});
		if ( options.type ) {
			this.setData({
				date: options.date,
				type: options.type,
				startTime: app.globalData.timeStart,
				endTime: app.globalData.timeEnd,
				thisWeekActivityIndex: options.activityIndex
			})
		} else {
			const info = JSON.parse(options.info);
			this.setData({
				activitySelected: info.ActivityName,
				placeSelected: info.FieldName,
				isAllDay: info.AllDayTimeStatus === '1',
				startTime: info.StartTime,
				endTime: info.EndTime,
				ID: info.ID,
				date: info.ActivityDate,
				thisWeekActivityIndex: options.activityIndex
			})
		}

		this.getActivity();
		this.getPlace();
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
