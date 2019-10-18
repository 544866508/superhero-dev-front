<template>
	<view class="page">
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
