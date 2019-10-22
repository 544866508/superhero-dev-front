<template>
	<view class="body">
		
		<form @submit="formSubmit">
			<view class="face-wapper">
				<image src="/static/icos/dangers.jpg" class="face"></image>
			</view>
			<view class="input-wapper">
				<label class="input">账号</label>
				<input name="username" type="text" value="" class="input" placeholder="请输入用户名" />
			</view>
			
			<view class="line-wapper">
				<view class="line"></view>
			</view>
			
			<view class="input-wapper" style="margin-top: 40upx;">
				<label class="input">密码</label>
				<input name="password" type="text" value="" password="true" class="input" placeholder="请输入密码"/>
			</view>
			
			<view class="line-wapper">
				<view class="line"></view>
			</view>
			
			<button type="primary" form-type="submit" style="margin-top: 60upx; width: 90%;">注册</button>
		</form>
		

	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			formSubmit(e) {
				//屏幕中央展示一个加载动画
				uni.showLoading({
					//为加载动画增加遮罩，防止用户重复操作
					mask: true,
					title: "努力加载中..."
				})
				//导航栏上展示一个加载动画
				uni.showNavigationBarLoading()
				
				var username = e.detail.value.username;
				var password = e.detail.value.password;
				uni.request({
					url: this.apiServer + 'register/',
					method: 'POST',
					header:{'content-type': "application/x-www-form-urlencoded"},
					data: {
						username: username,
						password: password,
					},
					success: res => {
						console.log(res)
						if(res.data.status == 200){
							uni.setStorageSync('USERNAME', username + '');
							uni.setStorageSync('PASSWORD', password + '');
							var sign = this.relogin("/pages/me/me")
						}
					},
					fail: (e) => {
						console.log(e)
					},
					complete: () => {
						uni.hideLoading();
						uni.hideNavigationBarLoading();
						uni.stopPullDownRefresh();
					}
				});
			}
		},
		onLoad() {
			
		},
	}
</script>

<style>
	@import url("register.css");
</style>
