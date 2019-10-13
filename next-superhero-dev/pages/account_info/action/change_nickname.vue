<template>
	<view class="body">
		
		<form @submit="formSubmit">
			<view class="input-wapper"  style="margin-top: 50upx;">
				<input name="nickname" type="text" value="" class="input" placeholder="请输入新昵称" />
			</view>
			
			<view class="line-wapper">
				<view class="line"></view>
			</view>
			
			<button type="primary" form-type="submit" style="margin-top: 60upx; width: 90%;">确定</button>
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
				var _self = this
				
				if(submited.detail.value.nickname.length > 10){
					{uni.showToast({title:"名字太长了别人记不住哦（10字以内）",icon:'none'});return ;}
				}
				
				uni.showModal({
					title:'提示',
					content:"确定要重新做人吗",
					success(res){
						console.log(res)
						if(res.confirm){
							console.log(submited.detail.value.nickname)
							
							var nickname = submited.detail.value.nickname
							uni.setStorageSync('NICKNAME', nickname + '');
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
									nickname: nickname,
								},
								success: res => {
									if(res.data.status == 403){
										_self.relogin()
									}
								},
							});
						}
					}
				})
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
	/* 输入框 start */
	.input-wapper {
		display: flex;
		flex-direction: row;
	}
	.input {
		margin-left: 40upx;
		margin-bottom: 10upx;
		color: #808080;
	}
	/* 输入框 end */
</style>
