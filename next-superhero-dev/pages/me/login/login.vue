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
			
			<button type="primary" form-type="submit" style="margin-top: 60upx; width: 90%;">登录</button>
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
			formSubmit(submited) {
				this.login(submited);
			}
		},
		onLoad() {
			
		},
	}
</script>

<style>
	@import url("login.css");
</style>
