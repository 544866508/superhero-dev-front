<template>
	<view class="body">
		
		<form @submit="formSubmit">
			<view class="uni-textarea" style="margin-top: 50upx;">
				<textarea name="saysth" placeholder="说两句..." auto-height />
			</view>
			
			<view class="line-wapper">
				<view class="line"></view>
			</view>
			
			<button type="primary" form-type="submit" style="margin-top: 60upx; width: 90%;">确定</button>
		</form>
		
		<view>
			
		</view>

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
				var _self = this
				
				if(submited.detail.value.saysth.length > 25){
					{uni.showToast({title:"签名过长（25字以内）",icon:'none'});return ;}
				}
				
				var saysth = submited.detail.value.saysth
				uni.setStorageSync('SAYSTH', saysth + '');
				uni.navigateBack({
					delta:1
				})
				
				var user_id = uni.getStorageSync('USER_ID')
				var auth_token = uni.getStorageSync('AUTH_TOKEN')
				uni.request({
					url: _self.apiServer + 'api/v1/user_info/',
					method: 'PUT',
					header:{
						'auth-token': auth_token,
						},
					data: {
						user_id: user_id,
						saysth: saysth,
					},
					success: res => {
						if(res.data.status == 403){
							_self.relogin()
						}
					},
				});
			}
		},
		onLoad() {
			
		},
	}
</script>

<style>
	.body {
		border-top: #DBDBDA;
		padding: 0 40upx;
	}	
</style>
