//app.js
App({
	onLaunch: function () {
		// this.getOpenId();
		// this.getDeviceInfo();
		const openid = wx.getStorageSync('openid'),
			mobile = wx.getStorageSync('mobile');
		if ( openid ) {
			this.globalData.openid = openid
		}
		if ( mobile ) {
			this.globalData.isLogin = true;
		}
	},
	onPageScroll: function (e) {
		if ( e.scrollTop < 0 ) {
			wx.pageScrollTo({
				scrollTop: 0
			})
		}
	},
	getDeviceInfo() {
		return new Promise((resolve => {
			wx.getSystemInfo({
				success: res => {
					console.log(res);
					this.globalData.windowWidth = res.windowWidth;
					this.globalData.windowHeight = res.windowHeight;
					this.globalData.contentHeight = res.windowHeight - 60;
					this.globalData.platform = res.platform;
					resolve()
				}
			})
		}))
	},
	getOpenId(noAjax) {
		const that = this;
		// let temUserInfo={};
		return new Promise(resolve => {
			if ( !that.globalData.hasLoginCheck ) {
				wx.login({
					success: res => {
						wx.request({
							url: 'https://xt.shi1.cn/api/PubliceApi/GetWxOpenId',
							method: 'POST',
							data: {
								JsCode: res.code
							},
							header: {
								'content-type': 'application/json' // 默认值
							},
							success(res) {
								if ( res.data.status === 1 ) {
									var cont = JSON.parse(res.data.content);
									that.globalData.sessionKey = cont.session_key;
									that.globalData.openid = cont.openid;
									wx.setStorage({
										key: "openid",
										data: cont.openid
									});
									var myTools = require('common/js/myTools');
									myTools.ajax('LoginCheck', {
										EmployeeCode: cont.openid
										// EmployeeCode: app.globalData.openid
									})
										.then(res => {
											console.log(res);
											if ( res.status === 1 ) {
												res = res.content[ 0 ];
												that.globalData.isMember = true;
												that.globalData.roleId = res.RoleId; /*自动获取*/
												// that.globalData.roleId = '1';    /*发布者*/
												// that.globalData.roleId = '2';    /*领导*/
												// that.globalData.roleId = '3';    /*用户*/
												that.globalData.mobile = res.EmployeeCode;
												that.globalData.IDCode = res.CardNo;
												that.globalData.birthday = res.DateOfBirth;
												that.globalData.face = res.Facefile ? (that.globalData.imgUrl + res.Facefile) : '';
												that.globalData.gender = res.Sex;
												that.globalData.nickName = res.EmployeeName;
												that.globalData.name = res.RealName;
												that.globalData.avatar = res.WeChatUrl;
												that.globalData.ID = res.ID;
												that.globalData.hasLoginCheck=true
											} else {
												/*如果没注册过,并留有旧用户缓存就清空缓存*/
												if ( wx.getStorageSync('openid') ) {
													wx.clearStorage();
												}
											}
											resolve();
										}).catch(e => console.log(e))
								}

							}
						});
					},
					fail: res => {
						console.log(res);
					}
				});
			}
			else {
				resolve();
			}
		})
	},
	globalData: {
		nickName: '',
		name: '',
		avatar: '',
		IDCode: '',
		roleId: '',
		ID: '1',
		birthday: '',
		gender: '',
		openid: '',
		sessionKey: '',
		mobile: '',
		face: '',
		pageSize: 10,
		isMember: false,
		isLogin: false,
		changedRoleId: false,
		hasLoginCheck: false,
		hasDeviceInfo: false,
		windowWidth: '',
		windowHeight: '',
		contentHeight: '',
		tabHeight: '60',
		imgUrl: 'https://xt.shi1.cn',
		timeStart: '09:00',
		timeEnd: '19:00',
		platform: ''
	}
});
