const myTools = require("../../../common/js/myTools");
Component({
	behaviors: [],
	// 属性定义（详情参见下文）
	properties: {},
	data: {
		imgUrls: [],
		indicatorDots: true,
		indicatorActiveColor: '#f18603',
		autoplay: false,
		interval: 5000,
		duration: 1000
	}, // 私有数据，可用于模板渲染
	lifetimes: {
		// 生命周期函数，可以为函数，或一个在methods段中定义的方法名
		attached: function () {
			this._getBanner()
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
		_getBanner() {
			const that=this;
			myTools.ajax('GetAllMetaDataByType',{
				MetaDataType:'BannerImg'
			}).then(res=>{
				console.log(res);
				if ( res.status === 1 ) {
					that.setData({
						imgUrls:res.content
					})
				}
			})
		}
	}
})
