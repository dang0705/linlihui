const
	app = getApp(),
	/*手机和身份证格式正则*/
	mobileReg = /^1[3|4|5|7|8][0-9]{9}$/,
	ID = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,

	/*通用post*/
	ajax = function (url, data) {
		function isHttpSuccess(status) {
			return status >= 200 && status < 300 || status === 304;
		}

		// showLoading();
		return new Promise((resolve, reject) => {
			wx.request({
				url: 'https://xt.shi1.cn/api/PubliceApi/' + url,
				method: 'POST',
				data: data,
				success(r) {
					const isSuccess = isHttpSuccess(r.statusCode);
					if ( isSuccess ) {
						resolve(r.data);
						hideLoading();
					} else {
						reject({
							msg: `网络错误:${r.statusCode}`,
							detail: r
						})
					}
				},
				fail: reject
			})
		})
	},

	/*显示loading*/
	showLoading = function () {
		return new Promise((resolve, reject) => {
			wx.showLoading({
				title: '数据加载中',
				duration: 2000,
				success() {
					resolve()
				},
				fail: reject
			})
		})
	},

	/*隐藏loading*/
	hideLoading = function () {
		return new Promise((resolve, reject) => {
			wx.hideLoading({
				success() {
					resolve()
				}
			})
		})
	},

	/*返回跳转起始页前,刷新起始页数据*/
	upDatePrev = function (data) {
		const currentPages = getCurrentPages();
		let prevPages = currentPages[ currentPages.length - 2 ];
		return prevPages.setData({
			[ data ]: true
		});
	},

	/*把null的数据转换成''*/
	nullToEmpty = obj => {
		if ( obj instanceof Array ) {
			let length = obj.length;
			for ( var i = 0; i < length; i++ ) {
				for ( var Key in obj[ i ] ) {
					obj[ i ][ Key ] = obj[ i ][ Key ] === null ? "" : obj[ i ][ Key ]
				}
			}
		} else if ( obj instanceof Object ) {
			for ( var key in obj ) {
				obj[ key ] = obj[ key ] === null ? "" : obj[ key ]
			}
		}
		return obj
	},

	/*去除拼接字符串中的空格和换行*/
	clearSpaceAndEnter = str => {
		return str.replace(/\s*/g, "")
	},

	/*上传人脸识别图片*/
	uploadImg = function (that, mobile, url, openid) {
		return new Promise((resolve, reject) => {
			wx.chooseImage({
				count: 1,
				sizeType: [ 'original', 'compressed' ],
				sourceType: [ 'camera', 'album' ],
				success(res) {
					console.log(res);
					that.setData({
						[ 'imgUrl' ]: res.tempFilePaths[ 0 ]
					});
					const tempFilePaths = res.tempFilePaths;
					showLoading();
					wx.uploadFile({
						url: url || 'https://xt.shi1.cn/api/PubliceApi/FacePostFiles',
						filePath: tempFilePaths[ 0 ],
						name: 'file',
						formData: {
							EmployeePhone: mobile || app.globalData.mobile,
							EmployeeCode: mobile,
							EmployeeOpenId: openid || ''
						},
						header: {
							'content-type': 'multipart/form-data'
						},
						success(res) {
							app.globalData.face = true;
							hideLoading();
							res = JSON.parse(res.data);
							console.log(res);
							resolve(res);
						}
					})
				}
			})
		})
	},

	/*分页ajax代码*/
	pagingAjax = function (url, data, that, event, listName, isDataFinished, success) {
		const This = that;
		if ( event ) {
			data[ 'pageIndex' ] += 1;
		}
		showLoading();
		ajax(url, data)
			.then(res => {
				if ( res.status === 1 ) {
					const maxPages = Math.ceil(parseInt(res.result) / app.globalData.pageSize);
					/*如果就只有一页就直接赋值数据并显示数据加载完毕*/
					if ( maxPages === 1 ) {
						that.setData({
							[ isDataFinished ]: true,
							[ listName ]: nullToEmpty(res.content),
						});
						return;
					}
					if ( event ) {
						/*如果分页大于2页,提前一页显示数据已经加载完.否则还是根据页数*/
						if ( data[ 'pageIndex' ] <= (maxPages > 2 ? (maxPages - 1) : maxPages) ) {
							// data[ 'pageIndex' ]++;
							This.setData({
								[ 'currentPage' ]: data[ 'pageIndex' ]
								// [ isDataFinished ]: false
							});
							paging(that, res, listName, success);
						} else {
							This.setData({
								[ isDataFinished ]: true
							});
						}
					} else {
						that.setData({
							[ listName ]: nullToEmpty(res.content),
						});
					}
				} else if ( data[ 'pageIndex' ] === 1 && res.status === 4 ) {
					that.setData({
						[ listName ]: [],
						[ isDataFinished ]: true
					});
				} else {
					that.setData({
						[ isDataFinished ]: true
					});
				}
			})
	},

	/*分页核心代码*/
	/*
	* that=this实例
	* res=ajax返回值
	* list=渲染列表的数组名字(字符串)
	* */
	paging = function (that, res, listName, success) {
		let oldData = that.data[ listName ],
			newData = oldData.concat(nullToEmpty(res.content));
		that.setData({
			[ listName ]: newData
		});
		if ( success && typeof success === 'function' ) {
			success(that)
		}
	},

	/*用户如果未登录/未注册的处理*/
	unLogin = function (url, navigatorMode, callback) {
		if ( !app.globalData.isMember ) {
			wx.showModal({
				title: '您尚未注册',
				content: '暂无法使用该功能,即将跳转至注册页',
				success(res) {
					if ( res.confirm ) {
						wx.navigateTo({
							url: '/pages/authroize/authroize'
						})
					} else if ( res.cancel ) {
						console.log('用户点击取消')
					}
				}
			})
		} else if ( app.globalData.isMember && !wx.getStorageSync('mobile') ) {
			wx.showModal({
				title: '您已经绑定过手机',
				content: '是否使用绑定的手机号进行登陆',
				success(res) {
					if ( res.confirm ) {
						wx.setStorageSync('mobile', app.globalData.mobile);
						wx.setStorageSync('nickName', app.globalData.nickName);
						if ( url ) {
							if ( navigatorMode === 'tab' ) {
								wx.switchTab({
									url: url,

								})
							} else if ( navigatorMode === 'reLaunch' ) {
								wx.reLaunch({
									url: url,
									success() {
										wx.hideTabBar()
									}
								})
							} else {
								wx.navigateTo({
									url: url,
								})
							}
						}
						if ( callback ) {
							callback();
						}
						app.globalData.isLogin = true;
					}
				}
			})
		} else {
			if ( url ) {
				if ( navigatorMode === 'tab' ) {
					wx.switchTab({
						url: url,
					})
				} else if ( navigatorMode === 'reLaunch' ) {
					wx.reLaunch({
						url: url,
						success() {
							wx.hideTabBar()
						}
					})
				} else {
					wx.navigateTo({
						url: url
					})
				}
			} else {
				if ( callback ) {
					callback();
				}
				app.globalData.isLogin = true;
			}


		}
	},

	/*自定义tabBar*/
	getTabBar = function (that, tabIndex) {
		let activity = {};

		// 判断是否领导,不是就是用户和发布者
		if ( app.globalData.roleId !== '2' ) {
			activity = {
				pagePath: "/pages/myOrder/myOrder",
				iconPath: "/common/img/qinr.png",
				selectedIconPath: "/common/img/qinr_s.png",
				text: "我的活动"
			}
		} else {
			activity = {
				pagePath: "/pages/activity/allActivity/allActivity",
				iconPath: "/common/img/qinr.png",
				selectedIconPath: "/common/img/qinr_s.png",
				text: "所有活动"
			}

		}
		that.getTabBar().setData({
			selected: tabIndex,
			[ 'list[1]' ]: activity
		});
	};
module.exports = {
	ajax: ajax,
	mobileReg: mobileReg,
	ID: ID,
	showLoading: showLoading,
	hideLoading: hideLoading,
	upDatePrev: upDatePrev,
	nullToEmpty: nullToEmpty,
	clearSpaceAndEnter: clearSpaceAndEnter,
	uploadImg: uploadImg,
	pagingAjax: pagingAjax,
	unLogin: unLogin,
	getTabBar: getTabBar
};
