<template>
	<view class="page" @touchmove="handletouchmove" @touchstart="handletouchstart" @touchend="handletouchend">
		<!-- 已登录 start -->
		<view v-if="userIsLogin">
			<view class="header">
				<!-- 头像 -->
				<view class="face-wapper">
					<image :src="userInfo.face" mode="" class="face"></image>
				</view>
				<!-- 信息 -->
				<view class="info-wapper" style="margin-top: 60upx; padding-left: 20upx;">
					<view class="name" v-model="userInfo">
						{{userInfo.nickname}}
					</view>
					<view class="info-darkgray" v-model="userInfo" style="padding-right: 20upx;">
						{{userInfo.saySth}}
					</view>
				</view>
			</view>
			
			<view class="line-wapper">
				<view class="line"></view>
			</view>
			
			<view class="u-info-wapper" @click="showMyAccountInfo">
				<view class="info-black">
					账号资料
				</view>
				<view class="ico-wapper">
					<image src="../../static/icos/left-gray-arrow.png" mode="" class="ico"></image>
				</view>
			</view>
			
			<view class="line-wapper">
				<view class="line"></view>
			</view>
			
			<view class="u-info-wapper" @click="showMyInterest">
				<view class="info-black">
					我的收藏
				</view>
				<view class="ico-wapper">
					<image src="../../static/icos/left-gray-arrow.png" mode="" class="ico"></image>
				</view>
			</view>
			
			<view class="line-wapper">
				<view class="line"></view>
			</view>
			
			<view class="u-info-wapper" @click="showMyHistory">
				<view class="info-black">
					浏览记录
				</view>
				<view class="ico-wapper">
					<image src="../../static/icos/left-gray-arrow.png" mode="" class="ico"></image>
				</view>
			</view>
			
			<view class="line-wapper" style="margin-bottom: 30upx;">
				<view class="line"></view>
			</view>
			
			<view class="u-info-wapper" @click="showSetup">
				<view class="row-wapper">
					<view class="ico-wapper">
						<image src="../../static/icos/settings.png" mode="" class="ico"></image>
					</view>
					<view class="info-black" style="margin-left: 10upx;">
						设置
					</view>
				</view>
				<view class="ico-wapper">
					<image src="../../static/icos/left-gray-arrow.png" mode="" class="ico"></image>
				</view>
			</view>
			
			<view class="line-wapper">
				<view class="line"></view>
			</view>
			
		</view>
		<!-- 已登录 end -->
		
		<!-- 未登录 start -->
		<view v-else>
			<view class="header">
				<!-- 头像 -->
				<image src="../../static/icos/default-face.png" mode="" class="face"></image>
				<!-- 信息 -->
				<view class="info-wapper">
					<view class="info" style="margin-top: 60upx;margin-left: 30upx;">
						未登录，请登录/注册
					</view>
				</view>
			</view>
			
			<view class="line-wapper">
				<view class="line"></view>
			</view>
			
			<view>
				<button type="primary" class="button" @click="toLogin">登录</button>
				<button type="primary" class="button" @click="toRegister">注册</button>
			</view>
		</view>
		<!-- 未登录 end -->

	</view>
</template>

<script>
	export default {
		data() {
			return {
				userIsLogin: false,
				userInfo: {
					nickname: "",
					username: "",
					face:"",
					saySth:"",
				},
				
				//监听滑动手势
				flag: 0,
				// text: '',
				lastX: 0,
				lastY: 0
			}
		},
		methods: {
			toLogin() {
				uni.navigateTo({
					url:"login/login"
				})
			},
			toRegister() {
				uni.navigateTo({
					url:"register/register"
				})
			},
			// 展示我的账号信息
			showMyAccountInfo() {
				uni.navigateTo({
					url:"account_info/account_info"
				})
			},
			// 展示我的收藏
			showMyInterest() {
				uni.navigateTo({
					url:"my_interest/my_interest"
				})
			},
			// 展示设置页面
			showSetup() {
				uni.navigateTo({
					url:"me_setup/me_setup"
				})
			},
			// 展示我的浏览记录
			showMyHistory() {
				uni.navigateTo({
					url:"me_history/me_history"
				})
			},
			//以下函数全是监听滑动手势------------------------------------------------------------------
			handletouchmove: function(event) {
				// console.log(event)
				if (this.flag !== 0) {
					return;
				}
				let currentX = event.touches[0].pageX;
				let currentY = event.touches[0].pageY;
				let tx = currentX - this.lastX;
				let ty = currentY - this.lastY;
				// let text = '';
				this.mindex = -1;
				//左右方向滑动
				if (Math.abs(tx) > Math.abs(ty)) {
					//判断移动距离是否大于30
					if(Math.abs(tx) > 30){
						//判断具体是左是右
						if (tx < 0) {
							// text = '向左滑动';
							this.flag = 1;
							console.log('向左滑动')
						 // this.getList();  //调用列表的方法
						} else if (tx > 0) {
							// text = '向右滑动';
							this.flag = 2;
							console.log('向右滑动')
							uni.switchTab({
								url: '../search/search'
							})
						}
					}
				}
				// //上下方向滑动
				// else {
				// 	if (ty < 0) {
				// 		// text = '向上滑动';
				// 		this.flag = 3;
				// 	//  this.getList();  //调用列表的方法
				// 	} else if (ty > 0) {
				// 		// text = '向下滑动';
				// 		this.flag = 4;
				// 	}
				// }
			
				//将当前坐标进行保存以进行下一次计算
				this.lastX = currentX;
				this.lastY = currentY;
				// this.text = text;
			},
			handletouchstart: function(event) {
				// console.log(event)
				this.lastX = event.touches[0].pageX;
				this.lastY = event.touches[0].pageY;
			},
			handletouchend: function(event) {
				this.flag = 0;
				// this.text = '没有滑动';
			},
		},
		onLoad() {	
			
		},
		onShow() {
			// 检查用户是否登录
			var isLogin = uni.getStorageSync('IS_LOGIN')// 登录标志
			if(isLogin){
				this.userIsLogin = true
				//填充数据
				this.userInfo.nickname = uni.getStorageSync('NICKNAME')
				this.userInfo.username = uni.getStorageSync('USERNAME')
				this.userInfo.face = uni.getStorageSync('FACE')
				this.userInfo.saySth = uni.getStorageSync('SAYSTH')
			}else{
				this.userIsLogin = false
			}
		}
	}
</script>

<style>
	@import url("me.css");
</style>
