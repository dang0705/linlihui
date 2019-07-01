const myTools = require("../../../common/js/myTools")
	, app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		thisWeek: [],
		nextWeek: [],
		thisWeekMonthStart: '',
		thisWeekMonthEnd: '',
		thisWeekDayStart: '',
		thisWeekDayEnd: '',
		nextWeekMonthStart: '',
		nextWeekMonthEnd: '',
		nextWeekDayStart: '',
		nextWeekDayEnd: '',
		copyThisWeekStart: '',
		copyNextWeekStart: '',
		today: '',
		todayIndex: 0,
		defaultTodayIndex: 0,
		selectedDate: '',
		currentPage: 1,
		maxPages: 1,
		activityList: [],
		dataFinished: false,
		isUpdate: false,
		isNextUpdate: false,
		canEdit: true,
		role: 0,
		height: 0,
		touchListStart: '',
		touchListEnd: '',
		showDelete: false,
		hideDelete: true,
		isThisWeek: true,
		isDisabled: true,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// console.log('activityIndex=' + this.data.activityIndex);
		this._getWeek();
		this.setData({
			currentPage: 1
		});
		this.setData({
			height: parseInt(app.globalData.windowHeight)
		});
	},
	_getActivity(e) {
		// console.log(e);
		var parseDate=this.data.selectedDate.split('-')[1];
		if ( parseDate.charAt(0) === '0' ) {
			parseDate=parseDate.substring(1);
		}
		myTools.pagingAjax('QueryActivityField', {
			ActivityDate: this.data.selectedDate.split('-')[0]+'-'+parseDate+'-'+this.data.selectedDate.split('-')[2],
			pageIndex: this.data.currentPage,
			pageSize: app.globalData.pageSize
		}, this, e, 'activityList', 'dataFinished');
		// this.triggerEvent('thisWeekUpdated')
	},
	_getWeek() {
		myTools.showLoading();
		myTools.ajax('GetDayNow').then(res => {
			if ( res.status === 1 ) {
				const today = res.result.split('/')[ 2 ],
					fullToday = res.result.split('/').join('-'),
					allToday = res.result,
					year = res.result.split('/')[ 0 ];
				res = res.content;
				let thisWeekTime = res.ThisWeekTime,
					nextWeekTime = res.NextWeekTime,
					thisWeekStart = thisWeekTime.split('-')[ 0 ],
					thisWeekEnd = thisWeekTime.split('-')[ 1 ],
					nextWeekStart = nextWeekTime.split('-')[ 0 ],
					nextWeekEnd = nextWeekTime.split('-')[ 1 ],

					thisWeekMonthStart = thisWeekStart.split('/')[ 1 ],
					thisWeekDayStart = thisWeekStart.split('/')[ 2 ],
					thisWeekMonthEnd = thisWeekEnd.split('/')[ 1 ],
					thisWeekDayEnd = thisWeekEnd.split('/')[ 2 ],

					nextWeekMonthStart = nextWeekStart.split('/')[ 1 ],
					nextWeekDayStart = nextWeekStart.split('/')[ 2 ],
					nextWeekMonthEnd = nextWeekEnd.split('/')[ 1 ],
					nextWeekDayEnd = nextWeekEnd.split('/')[ 2 ];

				let index = res.ThisWeek.findIndex(item => item.date == today);

				if ( thisWeekMonthStart != 12 ) {
					res.ThisWeek.forEach((item, index, arr) => {
						item.month = item.date < arr[ 0 ].date ? parseInt(thisWeekMonthStart) + 1 : thisWeekMonthStart;
						item.year = year
					});
					res.NextWeek.forEach((item, index, arr) => {
						item.month = item.date < arr[ 0 ].date ? parseInt(thisWeekMonthStart) + 1 : thisWeekMonthStart;
						item.year = year
					});
				} else {
					res.ThisWeek.forEach((item, index, arr) => {
						item.month = item.date < arr[ 0 ].date ? 1 : thisWeekMonthStart;
						item.year = parseInt(year) + 1
					});
					res.NextWeek.forEach((item, index, arr) => {
						item.month = item.date < arr[ 0 ].date ? 1 : thisWeekMonthStart;
						item.year = parseInt(year) + 1
					});
				}
				if ( !this.data.activityIndex ) {
					this.setData({
						selectedDate: res.ThisWeek[ index ].year + '-' + res.ThisWeek[ index ].month + '-' + res.ThisWeek[ index ].date,
						selected_date: res.ThisWeek[ index ].date
					});

				} else {
					this.setData({
						selectedDate: res.NextWeek[ 0 ].year + '-' + res.NextWeek[ 0 ].month + '-' + res.NextWeek[ 0 ].date,
						selected_date: res.NextWeek[ 0 ].date
					});
				}

				this.setData({
					thisWeek: res.ThisWeek,
					nextWeek: res.NextWeek,
					copyThisWeekStart: thisWeekTime.split('-')[ 0 ].split('/').join('-'),
					copyNextWeekStart: nextWeekTime.split('-')[ 0 ].split('/').join('-'),
					thisWeekMonthStart: thisWeekMonthStart,
					thisWeekMonthEnd: thisWeekMonthEnd,
					fullToday,
					allToday,
					parseToday: new Date(allToday),
					thisWeekDayStart: thisWeekDayStart,
					thisWeekDayEnd: thisWeekDayEnd,
					nextWeekMonthStart: nextWeekMonthStart,
					nextWeekDayStart: nextWeekDayStart,
					nextWeekMonthEnd: nextWeekMonthEnd,
					nextWeekDayEnd: nextWeekDayEnd,
					today: today,
					index,
					todayIndex: !this.data.activityIndex ? index : 0,
					defaultTodayIndex: index
				});
				this.setData({
					canEdit: this.data.parseSelectedDate > this.data.parseToday
				});
				console.log(this.data);
			}
			this._getActivity()
		});
	},
	_eachDayTouch(e) {
		console.log(e);
		console.log(this.data.today);
		let currentIndex = e.currentTarget.dataset.index;
		this.setData({
			activityList: [],
			dataFinished: false,
			todayIndex: currentIndex,
			selectedDate: e.currentTarget.dataset.date,
			selected_date: e.currentTarget.dataset.date.split('-')[ 2 ],
			parseSelectedDate: new Date(e.currentTarget.dataset.date.split('-').join('/')),
			currentPage: 1,
		});
		this.setData({
			canEdit:this.data.parseSelectedDate > this.data.parseToday,
		});
		console.log(e.currentTarget.dataset.date.split('-').join('/'), this.data.parseToday);
		this._getActivity();
	},

	_gotoNextWeek(e) {
		console.log(e);
		this.setData({
			dataFinished: false,
			selectedDate: e.currentTarget.dataset.type === 'prev' ? this.data.fullToday : this.data.copyNextWeekStart,
			todayIndex: e.currentTarget.dataset.type === 'prev' ? this.data.index : 0,
			isThisWeek: e.currentTarget.dataset.type === 'prev',
			isDisabled: e.currentTarget.dataset.type === 'prev',
		});
		this.setData({
			parseSelectedDate: new Date(this.data.selectedDate.split('-').join('/')),
		});
		this.setData({
			canEdit:this.data.parseSelectedDate > this.data.parseToday,
		});
		this._getActivity()
	},

	_subscribe(e) {
		if ( !this.data.canEdit ) {
			wx.showToast({
				title: '不能预约今天及以前的活动',
				icon: 'none'
			})
		} else {
			const info = JSON.stringify(e.currentTarget.dataset.info);
			wx.navigateTo({
				url: `/pages/activity/subscribeList/subscribe/subscribe?info=${info}`
			})
		}

	},
	_touchListStart(e) {
		console.log(e);
		this.setData({
			touchListStart: e.timeStamp
		})
	},
	_touchListEnd(e) {
		console.log(e);
		this.setData({
			touchListEnd: e.timeStamp
		})
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
		console.log('活动');
		this.setData({
			currentPage: 1
		});
		/*本周刷新*/
		if ( this.data.isUpdate || this.data.isNextUpdate ) {
			this._getActivity();
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
	onReachBottom: function (e) {
		/*console.log(e);
		this._getActivity()*/
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})

