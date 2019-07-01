const myTools = require("../../../common/js/myTools"), app = getApp();
Component({
	behaviors: [],
	// 属性定义（详情参见下文）
	properties: {
		roleId: {
			type: String,
			value: '0',
			observer(n, o) {
				console.log(n);
				this.setData({
					role: n
				})
			}
		},
		windowHeight: {
			type: String,
			value: '',
			observer(n, o) {
				console.log(n);
				this.setData(
					{
						height: parseInt(n)
					}
				)
			}
		},
		isThisWeekUpdate: {
			type: Boolean,
			value: false,
			observer(n, o) {
				this.setData({
					isUpdate: n
				})
			}
		},
		isNextWeekUpdate: {
			type: Boolean,
			value: false,
			observer(n, o) {
				this.setData({
					isNextUpdate: n
				})
			}
		},
		activityIndex: {
			type: String,
			value: '',
		}

	},
	data: {
		src: [],
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
		height: '',
		touchListStart: '',
		touchListEnd: '',
		showDelete: false,
		hideDelete: true
		// dayIndex:0
		// activeIndex:0
	}, // 私有数据，可用于模板渲染
	lifetimes: {
		// 生命周期函数，可以为函数，或一个在methods段中定义的方法名
		attached() {
			console.log('activityIndex=' + this.data.activityIndex);
			this._getWeek();
			this.setData({
				currentPage: 1
			});

		},
		created() {
		},
		show: function () {
		},
		ready: function () {
		},
		moved: function () {
		},
		detached: function () {
		},
	},
	attached() {
	},
	ready: function () {
	},
	created() {
	},
	pageLifetimes: {
		// 组件所在页面的生命周期函数
		show: function () {
			console.log('活动');
			this.setData({
				currentPage: 1
			});
			/*本周刷新*/
			if ( this.data.isUpdate || this.data.isNextUpdate ) {
				this._getActivity();
			}


		},
		hide: function () {

		},
		resize: function () {
		},
	},
	methods: {
		// 内部方法建议以下划线开头
		_getActivity(e) {
			var parseDate=this.data.selectedDate.split('-')[1];
			if ( parseDate.charAt(0) === '0' ) {
				parseDate=parseDate.substring(1);
			}
			myTools.pagingAjax('QueryActivityField', {
				ActivityDate: this.data.selectedDate.split('-')[0]+'-'+parseDate+'-'+this.data.selectedDate.split('-')[2],
				pageIndex: this.data.currentPage,
				pageSize: app.globalData.pageSize
			}, this, e, 'activityList', 'dataFinished', this._addImgLoadStatus);
			this.triggerEvent('thisWeekUpdated')
		},
		_addImgLoadStatus(This) {
			const length = This.data.activityList.length;
			/*每次从上一页开始遍历*/
			let i = app.globalData.pageSize * (This.data.currentPage - 1);
			for ( i; i < length; i++ ) {
				if ( !This.data.activityList[ i ].isLoaded ) {
					This.data.activityList[ i ].isLoaded = false
				}
			}
		},
		_imgLoaded(e) {
			const index = e.currentTarget.dataset.index;
			if ( !this.data.activityList[ index ].isLoaded ) {
				const item = 'activityList[' + index + '].isLoaded';
				if ( e.detail.height ) {
					this.setData({
						[ item ]: true
					})
				}
			}

		},
		_getWeek() {
			myTools.showLoading();
			myTools.ajax('GetDayNow').then(res => {
				if ( res.status === 1 ) {
					const
						allToday = res.result,
						today = res.result.split('/')[ 2 ],
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
							selectedDate: res.ThisWeek[ index ].year + '-' + zero(res.ThisWeek[ index ].month) + '-' + zero(res.ThisWeek[ index ].date),
							// selected_date: res.ThisWeek[ index ].date
						});

					} else {
						this.setData({
							selectedDate: res.NextWeek[ 0 ].year + '-' + zero(res.NextWeek[ 0 ].month) + '-' + zero(res.NextWeek[ 0 ].date),
							// selected_date: res.NextWeek[ 0 ].date
						});
					}
					this.setData({
						parseSelectedDate: new Date(this.data.selectedDate.split('-').join('/'))
					});
					function zero(n) {
						return n < 10 ? '0' + n : n;
					}
					this.setData({
						thisWeek: res.ThisWeek,
						nextWeek: res.NextWeek,
						copyThisWeekStart: thisWeekTime.split('-')[ 0 ].split('/').join('-'),
						copyNextWeekStart: nextWeekTime.split('-')[ 0 ].split('/').join('-'),
						thisWeekMonthStart: thisWeekMonthStart,
						thisWeekMonthEnd: thisWeekMonthEnd,
						thisWeekDayStart: thisWeekDayStart,
						thisWeekDayEnd: thisWeekDayEnd,
						nextWeekMonthStart: nextWeekMonthStart,
						nextWeekDayStart: nextWeekDayStart,
						nextWeekMonthEnd: nextWeekMonthEnd,
						nextWeekDayEnd: nextWeekDayEnd,
						today: today,
						allToday,
						parseToday: new Date(allToday),
						todayIndex: !this.data.activityIndex ? index : 0,
						defaultTodayIndex: index
					});
					this.setData({
						canDelete: this.data.parseSelectedDate >= this.data.parseToday,
						canEdit: this.data.parseSelectedDate >= this.data.parseToday
					});
					console.log(this.data.canDelete);
				}
				this._getActivity()
			});
		},
		_eachDayTouch(e) {
			let currentIndex = e.currentTarget.dataset.index;
			this.setData({
				activityList: [],
				dataFinished: false,
				todayIndex: currentIndex,
				selectedDate: e.currentTarget.dataset.date,
				parseSelectedDate: new Date(e.currentTarget.dataset.date.split('-').join('/')),
				currentPage: 1
			});
			this.setData({
				canDelete: this.data.parseSelectedDate >= this.data.parseToday,
				canEdit:this.data.parseSelectedDate >= this.data.parseToday,
			});
			console.log(e.currentTarget.dataset.date.split('-').join('/'), this.data.parseToday);
			this._getActivity();
		},
		_gotoNextWeek(e) {
			console.log(e);
			this.triggerEvent('gotoNextWeek', {
				tabIndex: 1
			})
		},
		_add() {
			if ( !this.data.canEdit ) {
				wx.showToast({
					title: '不能新增今天以前的活动',
					icon: 'none'
				})
			} else {
				wx.navigateTo({
					url: `/pages/activity/thisWeek/opThisWeek/opThisWeek?type=Add&date=${this.data.selectedDate}&activityIndex=${this.data.activityIndex}`
				})
			}
		},
		_edit(e) {
			console.log(e);
			if ( !this.data.canEdit ) {
				wx.showToast({
					title: '不能编辑今天及以前的活动',
					icon: 'none'
				})
			} else {
				const info = JSON.stringify(e.currentTarget.dataset.info);
				let duration = this.data.touchListEnd - this.data.touchListStart;
				console.log(duration);
				if ( duration < 350 ) {
					wx.navigateTo({
						url: `/pages/activity/thisWeek/opThisWeek/opThisWeek?info=${info}&activityIndex=${this.data.activityIndex}`
					})
				} else {
					console.log('长按');
					/*this.setData({
						showDelete: this.data.todayIndex >= this.data.defaultTodayIndex?!this.data.showDelete:false
					})*/
				}
			}
		},
		_delete(e) {
			console.log(e);
			const ID = e.currentTarget.dataset.id;
			wx.showModal({
				title: '删除活动',
				content: '确定删除本条活动吗?',
				success: res => {
					if ( res.confirm ) {
						myTools.ajax('OpActivityField', {
							OpType: 'Delete',
							ID
						}).then(res => {
							this._getActivity()

						})
					}
				}
			})

		},
		_copy() {
			wx.showModal({
				title: '提示',
				content: '是否复制上周活动安排',
				success: res => {
					if ( res.confirm ) {
						myTools.ajax('OpActivityField', {
							OpType: 'Copy',
							EmployeeId: app.globalData.ID,
							StartTime: this.data.copyThisWeekStart,
							EndTime: this.data.copyNextWeekStart
						}).then(res => {
							console.log(res);
							if ( res.status === 1 ) {
								this._getActivity();
								wx.showToast({
									title: '复制成功',
									icon: 'success'
								})
							}
						})
					}
				}
			})


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
					url: `/pages/activity/thisWeek/subscribe/subscribe?info=${info}`
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
	}
})
