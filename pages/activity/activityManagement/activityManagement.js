const app = getApp(),
	myTools = require('../../../common/js/myTools');

Component({
	behaviors: [],
	// 属性定义（详情参见下文）
	properties: {
		amUpdate: {
			type: Boolean,
			value: false,
			observer(n, o) {
				console.log(n, o);
				this.setData({
					isUpdate: true,
					currentPage: 1
				})
			}
		}
	},
	data: {
		activityManagementList: [],
		isAMDataFinished: false,
		isUpdate: false,
		currentPage: 1,
	}, // 私有数据，可用于模板渲染
	lifetimes: {
		// 生命周期函数，可以为函数，或一个在methods段中定义的方法名
		show: function () {
			console.log('ac');
		},
		attached: function () {
			console.log('ac');
			this._getActivityManagement()
		},
		moved: function () {
		},
		detached: function () {
		},
	},
	// 生命周期函数，可以为函数，或一个在methods段中定义的方法名
	attached: function () {
		this._getActivityManagement()
	}, // 此处attached的声明会被lifetimes字段中的声明覆盖
	ready: function () {
	},

	pageLifetimes: {
		// 组件所在页面的生命周期函数

		show: function () {
			console.log('ac');
			this._getActivityManagement()
		},
		hide: function () {
		},
		resize: function () {
		},
	},
	methods: {
		// 内部方法建议以下划线开头
		_add() {
			wx.navigateTo({
				url: '/pages/activity/activityManagement/opActivity/opActivity?type=Add'
			})
		},
		/*获得活动管理*/
		_getActivityManagement(e) {
			console.log(e);
			const that = this;
			myTools.pagingAjax('QueryActivity', {
					EmployeeId: app.globalData.ID,
					pageSize: app.globalData.pageSize,
					pageIndex: this.data.currentPage
				},
				that, e, 'activityManagementList', 'isAMDataFinished');
			that.setData({
				amUpdate: false
			})
		},
		_editActivity(e) {
			console.log(e);
			wx.navigateTo({
				url: `/pages/activity/activityManagement/opActivity/opActivity?info=${JSON.stringify(e.currentTarget.dataset.info)}`
			})
		}
	}
})
