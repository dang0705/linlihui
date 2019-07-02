const app = getApp(), myTools = require('../../../common/js/myTools');
Component({
	behaviors: [],
	// 属性定义（详情参见下文）
	properties: {
		dataFromSq: {
			type: Array,
			value: [],
			observer(n, o) {
				this.setData({
					displayMultipleItems: n.length > 4 ? 4 : n.length
				})
			}
		}
	},
	data: {
		indicatorDots: false,
		duration: 200,
		displayMultipleItems: 0,
		iconList: []
	}, // 私有数据，可用于模板渲染
	/*	lifetimes: {
			// 生命周期函数，可以为函数，或一个在methods段中定义的方法名
			attached: function () {
			},
			moved: function () {
			},
			detached: function () {
			},
		},*/
	// 生命周期函数，可以为函数，或一个在methods段中定义的方法名
	attached: function () {
		// console.log(this.data.dataFromSq);
	}, // 此处attached的声明会被lifetimes字段中的声明覆盖
	ready: function (e) {
	},
	/*pageLifetimes: {
		// 组件所在页面的生命周期函数
		show: function () {
			console.log(this.dataFromSq);
		},
		hide: function () {
		},
		resize: function () {
		},
	},*/
	methods: {
		// 内部方法建议以下划线开头
		_navigateTo(e) {
			console.log(e);
			if (e.currentTarget.dataset.value === '1' ) {
				myTools.unLogin('/pages/activity/subscribeList/subscribeList', '', '')
			}
			else if( e.currentTarget.dataset.value === '5'){
				myTools.unLogin('/pages/activity/activity', '', '')
			}
			else if(e.currentTarget.dataset.value==='6'){
				myTools.unLogin('/pages/familyInfo/familyInfo', '', '')
			}
			else {
				wx.showToast({
					title: '敬请期待',
					icon: 'none'
				})
			}
		}
	}
})
