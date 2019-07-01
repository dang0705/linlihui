const app = getApp();
Component({
	behaviors: [],
	// 属性定义（详情参见下文）
	properties: {
		height: {
			type: String,
			value: '',
			observer(n, o) {
				this.setData({
					selectorHeight: n
				})
			}
		},
		mode: {
			type: String,
			value: '',
			observer(newValue, oldValue) {
				if ( newValue ) {
					this.setData({
						selector_mode: newValue
					})
				}

			}
		},

		key: {
			type: String, value: '',
			observer(newValue, oldValue) {
				this.setData({
					key_name: newValue
				})
			}
		},
		list: {
			type: Array, value: [], observer(newVal, oldVal) {
				console.log(newVal, oldVal);
				this.setData({
					selector_list: newVal
				});
				this._selectorGetIndex(newVal);
			}
		},
		value: {
			type: String,
			value: '',
			observer(newVal, oldVal) {
				console.log(newVal, oldVal);
				this.setData({
					value: newVal
				});
			}
		},
		start: {
			type: String,
			value: '',
			observer(n, o) {
				this.setData({
					timeStart: n
				})
			}
		},
		end: {
			type: String,
			value: '',
			observer(n, o) {
				this.setData({
					timeEnd: n
				})
			}
		},
		time: {
			type: String,
			value: '',
			observer(n, o) {
				this.setData({
					currentTime: n
				})
			}
		}
	},
	data: {
		selectorHeight: 100,
		selector_mode: 'selector',
		selector_list: [],
		list_index: 0,
		key_name: 'Name',
		value: '',
		currentTime: '',
		timeStart: '',
		timeEnd: ''
	}, // 私有数据，可用于模板渲染
	lifetimes: {
		// 生命周期函数，可以为函数，或一个在methods段中定义的方法名
		attached: function () {
			this.setData({
				timeStart: app.globalData.timeStart,
				timeEnd: app.globalData.timeEnd,
			});
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
		_selectorGetIndex(list) {
			if ( this.data.value ) {
				const index = list.findIndex(item => {
					return item[ this.data.key_name ] === this.data.value
				});
				this.setData({
					list_index: index
				});
				console.log(index);
			}

		},

		_bindPickerChange(e) {
			console.log(e);
			console.log(this.data.selector_list);
			let index = e.detail.value,
				id = this.data.selector_list[ index ].ID;
			console.log(id);
			this.setData({
				list_index: index,
				value: this.data.selector_list[ index ][ this.data.key_name ]
			});
			this.triggerEvent('selectorValue',
				{
					value: this.data.value,
					ID: id
				});
			console.log(this.data);
		},

		_bindTimeChange(e) {
			this.triggerEvent('time', e.detail.value)
		}
		// 内部方法建议以下划线开头

	}
})
