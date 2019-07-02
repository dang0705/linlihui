// pages/qinr/qinr.js
import * as echarts from '../components/ec-canvas/echarts';

const myTools = require("../../common/js/myTools"),
	app = getApp();
let chart = null;

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		ec: {
			lazyLoad: true
		},
		EID: '',
		placeList:[],
		echartList: [],
		familyList: [],
		today: '',

		height: app.globalData.windowHeight
	},
	initChart(canvas, width, height) {
		this.echartsComponnet.init((canvas, width, height) => {
			chart = echarts.init(canvas, null, {
				width: width,
				height: height
			});
			this.setOption(chart);
			// this.setChart(chart);
			return chart;
		});

		// chart.setOption(this.getOption());

	},
	getFamily() {
		const that = this;
		myTools.ajax('QueryRelatives', {
			OpType: 'Add',
			EmployeeCode: wx.getStorageSync('mobile'),
			pageIndex: 1,
			pageSize: 20
		}).then(res => {
			if ( res.status === 1 ) {
				that.setData({
					familyList: res.content
				});
			}
		})
	},
	getOption() {
		return {
			title: {},
			color: [ '#ffaf17' ],
			/*tooltip: {
				trigger: 'axis',
				axisPointer: {            // 坐标轴指示器，坐标轴触发有效
					type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				},
				confine: true
			},*/
			legend: {
				show: false,
			},
			grid: {
				left: 0,
				right: 15,
				bottom: 20,
				top: 0,
				containLabel: true
			},
			animation: false,
			xAxis: [
				{
					type: 'value',
					splitLine: {     //网格线
						"show": false
					},
					axisTick: {
						inside: true,
						lineStyle: {
							color: '#ffaf17' //设置此处的颜色值即可
						}
					},
					axisLine: {
						lineStyle: {
							color: '#999'
						}
					},
					axisLabel: {
						color: '#666',
						textStyle: {
							fontSize: 12
						}
					}
				}
			],
			yAxis: [
				{
					type: 'category',
					axisTick: {
						show: false,
						lineStyle: {
							color: '#f18603' //设置此处的颜色值即可
						}
					},
					data: this.data.placeList||[],
					axisLine: {
						lineStyle: {
							color: '#999'
						}
					},
					axisLabel: {
						color: '#666',
						textStyle: {
							fontSize: 12
						}
					}
				}
			],

			series: [
				{
					name: '点位时长',
					type: 'bar',
					label: {
						normal: {
							show: false,
							fontSize: 12,
							rich: {},
							position: 'outside'
						}
					},
					barGap: '20%',
					data: this.data.echartList || [],
					itemStyle: {
						emphasis: {
							barBorderRadius: 30,
						},
						normal: {
							barBorderRadius: 30,
							barBorderWidth: 6

						}
					}
				}
			]
		};
	},
	getData() {
		const that=this;
		myTools.ajax("ResidenceTimeReport", {
			EmployeeId: this.data.EID,
			ActivityDate:this.data.today
		})
			.then(res => {
				if ( res.status === 1 ) {
					var placeList=[],echartList=[];
					res.content.forEach(item=>{
						placeList.push(item.cameraname);
						echartList.push(item.residenceTime)
					});
					console.log(placeList);
					console.log(echartList);
					that.setData({
						placeList:placeList,
						echartList: echartList,
					})
				}
				if ( !chart ) {
					this.initChart()
				} else {
					this.setOption(chart)
				}
			})

	},
	setOption: function (Chart) {
		Chart.clear();  // 清除
		Chart.setOption(this.getOption());  //获取新数据
	},
	getFamilyEID(e) {
		console.log(e);
		this.setData({
			EID: e.detail.EID
		});
		this.getData();

		/*	if ( !chart ) {
				this.initChart()
			} else {
				this.setOption(chart)
			}*/
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.echartsComponnet = this.selectComponent('#mychart-dom-bar');
		this.getFamily();
		const that=this;
		myTools.ajax('GetDayNow').then(res => {
			if ( res.status === 1 ) {
				var data = res.result.split('/')[ 0 ] + '-' + zero(res.result.split('/')[ 1 ]) + '-' + zero(res.result.split('/')[ 2 ]);
				console.log(data);
				that.setData({
					today:data
				})
			}
		});

		function zero(n) {
			return  n < 10 ? '0' + n : n
		}
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {
		chart = null;
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})
