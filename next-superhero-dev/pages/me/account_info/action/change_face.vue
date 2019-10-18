<template>
	<cropper 
		selWidth="660rpx" 
		selHeight="660rpx" 
		@upload="myUpload" 
		:avatarSrc="imgurl" 
		avatarStyle="width:100vw;height:100vw;"> 
	</cropper>
</template>

<script>
	//script部分
	import cropper from "@/components/cropper.vue";
	export default {
		components: {
		  cropper
		},
		data() {
			return {
				 imgurl:""
			}
		},
		onLoad() {
			
		},
		methods: {
			//上传返回图片
			myUpload(res) {
				console.log(res)
				
				//屏幕中央展示一个加载动画
				uni.showLoading({
					//为加载动画增加遮罩，防止用户重复操作
					mask: true,
					title: "图片上传中..."
				})
				//导航栏上展示一个加载动画
				uni.showNavigationBarLoading()
				
				var user_id = uni.getStorageSync('USER_ID')
				var auth_token = uni.getStorageSync('AUTH_TOKEN')
				var face = res.path
				uni.uploadFile({
				            url: this.apiServer + 'api/v1/user_info/',
							header:{'auth-token': auth_token},
							filePath: face,
				            name: 'file',
				            formData: {
				                user_id: user_id,
				            },
				            success: (res) => {
								// 由于uni.uploadFile方法只能返回json字符串不能返回json对象,
								// 因此需要对res.data做一次转换处理
								var data = JSON.parse(res.data)
								
								if(data.status == 200){
									uni.setStorageSync('FACE', this.mediaServer + data.face + '');
									uni.navigateBack({
										delta:1
									})
								}
								if(data.status == 403){
									this.relogin()
								}
							},
							complete: () => {
								uni.hideLoading();
								uni.hideNavigationBarLoading();
								uni.stopPullDownRefresh();
								uni.showToast({title:"OK",icon:'none'});return ;
							}	
				        });
				
			    // const self = this;
			    // self.imgurl = res.path; //更新头像方式一
				
			    // res.avatar.imgSrc = res.path; //更新头像方式二
			},

		}
	}
</script>

<style>
</style>
