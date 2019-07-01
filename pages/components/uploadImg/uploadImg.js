const myTools = require('../../../common/js/myTools'), app = getApp();
Component({
	behaviors: [],
	// 属性定义（详情参见下文）
	properties: {
		fileName: {
			type: String,
			value: '',
			observer(newValue, oldValue) {
				this.setData({
					url: newValue
				})
			}
		},
		width: {
			type: String,
			value: '0',
			observer(newValue, oldValue) {
				this.setData({
					size: newValue
				})
			}
		}
	},
	data: {
		url: '',
		size: '200'
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
		_uploadImg() {
			const path = this.data.url, that = this;
			wx.chooseImage({
				count: 1,
				sizeType: [ 'original', 'compressed' ],
				sourceType: [ 'camera', 'album' ],
				success(res) {
					console.log(res);
					let tempFilePaths;
					if ( res.errMsg === 'chooseImage:ok' && res.tempFilePaths.length ) {
						tempFilePaths = res.tempFilePaths;
						that.triggerEvent("showImg", tempFilePaths[ 0 ])
					} else {
						wx.showToast({
							title: '图片选择失败,请重新选择',
							icon: 'none'
						})
					}
					myTools.showLoading();
					wx.uploadFile({
						url: 'https://xt.shi1.cn/api/PubliceApi/PublicePostFiles',
						filePath: tempFilePaths[ 0 ],
						name: 'file',
						formData: {
							FolderName: path,
							EmployeeCode: app.globalData.mobile,
						},
						header: {
							'content-type': 'multipart/form-data'
						},
						success(res) {
							console.log(res);
							myTools.hideLoading();
							res = JSON.parse(res.data);
							if ( res.status === 1 ) {
								that.triggerEvent("url", res.content)
							} else {
								wx.showToast({
									title: '图片上传失败,请重新上传',
									icon: 'none'
								})
							}
						}
					})
				}
			})
		}
	}
})
