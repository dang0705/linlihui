const myTools = require("../../../common/js/myTools"),
	app = getApp();
Component({
	behaviors: [],
	// 属性定义（详情参见下文）
	properties: {
		list: {
			type: Array,
			value: [],
			observer(n, o) {
				this.setData({
					paginationList: n
				})
			}
		},
		imgDefault:{
			type:String,
			value:'',
		},
		postData:{
			type:Object,
			value:{},
			observer(n, o) {
				for ( var key in n ) {
					if ( n[ key ] ) {
						let data = {
								pageIndex: 1,
								pageSize: app.globalData.pageSize
							},
							newObj = {};
						Object.assign(newObj, data, n);
						this.setData({
							data:newObj
						});
						this._getPagination();
						console.log(n);
					}
				}
			}
		},
		postUrl: {
			type: String,
			value: '',

		},
		imgKey: {
			type: String,
			value: '',
		},
		MessageTitle: {
			type: String,
			value: '',
		},
		MessageTag: {
			type: String,
			value: '',
		},
		DateCreated: {
			type: String,
			value: '',
		},
		url: {
			type: String,
			value: '',
		},
		isScroll:{
			type:Boolean,
			value:true
		}
	},
	data: {
		paginationList: [],
		data:{},
		currentPage: 1,
	}, // 私有数据，可用于模板渲染
	lifetimes: {
		// 生命周期函数，可以为函数，或一个在methods段中定义的方法名
		attached: function () {
		},
		moved: function () {
		},
		detached: function () {
		},
	},

	// 生命周期函数，可以为函数，或一个在methods段中定义的方法名
	attached: function () {

	}, // 此处attached的声明会被lifetimes字段中的声明覆盖
	ready: function () {
	},

	pageLifetimes: {
		// 组件所在页面的生命周期函数
		show: function () {
		},
		hide: function () {
		},
		resize: function () {
		},
	},
	methods: {
		// 内部方法建议以下划线开头
		/*分页滑动或者初始化数据*/
		_getPagination(e) {
			myTools.pagingAjax(this.data.postUrl, this.data.data, this, e, 'paginationList', 'dataFinished');
		},
		/*循环的每一项item的点击事件*/
		_itemTap(e) {
			wx.navigateTo({
				url: `this.data.url`
			})
		}
	}
})
