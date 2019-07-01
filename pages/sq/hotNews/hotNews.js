Component({
	behaviors: [],
	// 属性定义（详情参见下文）
	properties: {
		dataFromSq: Array
	},
	data: {
		news: []
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
		_newsDetail(e) {
			console.log(e);
			wx.navigateTo({
				url: `/pages/newsDetail/newsDetail?item=${JSON.stringify(e.currentTarget.dataset.item)}`
			})
		}

	}
})
