const app = getApp();
Component({
	properties: {},
	data: {
		selected: 0,
		color: "#7A7E83",
		selectedColor: "#f18603",
		height: 60,
		list: [
			{
				pagePath: "/pages/sq/sq",
				iconPath: "/common/img/sq.png",
				selectedIconPath: "/common/img/sq_s.png",
				text: "社区"
			},
			/*{
				pagePath: "/pages/myOrder/myOrder",
				iconPath: "/common/img/qinr.png",
				selectedIconPath: "/common/img/qinr_s.png",
				text: "我的活动"
			},
*/
			{
				pagePath: "/pages/expZone/expZone",
				iconPath: "/common/img/qinr.png",
				selectedIconPath: "/common/img/qinr_s.png",
				text: "体验区"
			},
			{
				pagePath: "/pages/my/my",
				iconPath: "/common/img/my.png",
				selectedIconPath: "/common/img/my_s.png",
				text: "我的"
			},
		]
	},
	lifetimes: {
		attached() {
			const that = this;
			app.getOpenId().then(res => {
				// console.log('获取roleId' + app.globalData.roleId);
				that._editTab()
			})
		},


	},
	pageLifetimes: {
		show: function () {
			console.log('abc');
		}
	},
	methods: {
		switchTab(e) {
			const data = e.currentTarget.dataset;
			const url = data.path;
			const that = this;
			wx.switchTab({
				url,
				success() {
					console.log(data.index);

					that.setData({
						selected: data.index
					});
				}
			});
		},
		_editTab() {
			/*只针对领导*/
			if ( app.globalData.roleId === '2' ) {
				this.setData({
					[ 'list[1]' ]: {
						pagePath: "/pages/activity/allActivity/allActivity",
						iconPath: "/common/img/qinr.png",
						selectedIconPath: "/common/img/qinr_s.png",
						text: "所有活动"
					}
				});
			}else {
				this.setData({
					[ 'list[1]' ]: {
						pagePath: "/pages/expZone/expZone",
						iconPath: "/common/img/qinr.png",
						selectedIconPath: "/common/img/qinr_s.png",
						text: "体验区"
					}
				});
			}
		},


	}
})
