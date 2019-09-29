<template>
	<view class="page">
		<!-- 已登录 -->
		<view v-if="userIsLogin" class="header">
			<!-- 头像 -->
			<image src="../../static/icos/108x108.png" mode="" class="face"></image>
			<!-- 信息 -->
			<view class="info-wapper">
				<view class="name">
					昵称
				</view>
				<view class="info">
					ID：121434213
				</view>
			</view>
			<!-- 设置 -->
			<view class="ico-wapper">
				<image src="../../static/icos/settings.png" mode="" class="ico"></image>
			</view>
		</view>
		<!-- 未登录 -->
		<view v-else class="header">
			<!-- 头像 -->
			<image src="../../static/icos/default-face.png" mode="" class="face"></image>
			<!-- 信息 -->
			<view class="info-wapper">
				<view class="name">
					未登录，请点击登录按钮
				</view>
			</view>
		</view>
		
		<view class="line-wapper">
			<view class="line"></view>
		</view>
		<view class="info">
			登录功能待开发，正在施工...
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userIsLogin: false,
			}
		},
		methods: {
			
		},
		onLoad() {
			if(!this.userIsLogin){
				uni.navigateTo({
					url:"../login/login"
				})
			}
		}
	}
</script>

<style>
	@import url("me.css");
</style>
