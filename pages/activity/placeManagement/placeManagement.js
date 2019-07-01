const myTools = require("../../../common/js/myTools"), app = getApp();
Component({
	behaviors: [],
	// 属性定义（详情参见下文）
	properties: {
		placeList: {
			type: Array,
			value: [],
			observer(newValue, oldValue) {
				console.log('newValue', newValue);
				this.setData({
					floorData: myTools.nullToEmpty(newValue),
					floor: [],
				});
				this._getPlace();
			}
		},
		isPlaceDataFinished: {
			type: Boolean,
			value: false,
			observer(newValue, oldValue) {
				this.setData({
					finished: newValue
				})
			}
		},
		placeUpdate: {
			type: Boolean,
			value: false,
			observer(newVal, oldVal) {
				console.log(newVal, oldVal);
				this.setData({
					isUpdate: newVal
				});
				if ( newVal ) {
					this.triggerEvent('placeUpdate', true);
				} else {
					this.triggerEvent('placeUpdate', false)
				}
			}
		}
	},
	data: {
		floorData: [],
		floor: [],
		finished: false,
		isUpdate: false
		/*first_floor: [],
		second_floor: [],
		third_floor:[],
		fourth_floor: [],*/
	}, // 私有数据，可用于模板渲染
	lifetimes: {
		// 生命周期函数，可以为函数，或一个在methods段中定义的方法名
		attached: function () {
			this._getPlace()
		},
		moved: function () {
		},
		detached: function () {
		},
		created: function () {
			// this._getPlace()
		},
		ready: function () {
			// this._getPlace()
		},
		show: function () {
		},
		hide: function () {
		},
		resize: function () {
		},
		onReachBottom(e) {
		},
	},
	methods: {
		_getPlace() {
			let floor = {},
				floorArr = [];
			// let len = this.data.floorData.length;
			this.data.floorData.forEach((item, index, arr) => {
				let pushFloor = (res) => {
					if ( !floor[ res ] ) {
						floor[ res ] = [];
					}
					floor[ res ].push(item)
				};
				switch (item.FieldFloor) {
					case '一楼':
						pushFloor('floor_0');
						break;
					case '二楼':
						pushFloor('floor_1');
						break;
					case '三楼':
						pushFloor('floor_2');
						break;
					case '四楼':
						pushFloor('floor_3');
						break;

				}
			});
			for ( var key in floor ) {
				floorArr[ key.split('_')[ 1 ] ] = floor[ key ]
			}
			this.setData({
				floor: floorArr
			})
		},

		_editPlace(e) {
			const info = JSON.stringify(e.currentTarget.dataset.info);
			wx.navigateTo({
				url: `/pages/activity/placeManagement/opPlace/opPlace?placeInfo=${info}`
			})
		},
		_imgError(e){
			console.log(e);
		},
		_add(e) {
			wx.navigateTo({
				url: '/pages/activity/placeManagement/opPlace/opPlace?type=Add'
			})
		}
		// 内部方法建议以下划线开头

	}
})
