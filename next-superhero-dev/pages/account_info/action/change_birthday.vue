<template>
	<view class="body">		

		<view>
			<uni-calendar 
			:date="'2000-1-1'"
			:insert="true"
			:lunar="true" 
			:start-date="'1900-1-1'"
			@change="change"
			 />
		</view>
		
		<button type="primary" @click="changeBirthday" style="margin-top: 60upx; width: 90%;">确定</button>

	</view>
</template>

<script>
	import {uniCalendar} from "@/components/uni-calendar/uni-calendar"
	export default {
	    components: {
	        uniCalendar
	    },
	    data() {
	        return {
				currentDate: '',
			};
	    },
	    methods: {
	        change(res) {
	            this.currentDate = res.fulldate
				console.log(this.currentDate)
	        },
			changeBirthday() {
				uni.setStorageSync('BIRTHDAY', this.currentDate + '');
				uni.navigateBack({
					delta:1
				})
				
				var user_id = uni.getStorageSync('USER_ID')
				var auth_token = uni.getStorageSync('AUTH_TOKEN')
				uni.request({
					url: this.apiServer + 'api/v1/user_info/',
					method: 'PUT',
					header:{'auth-token': auth_token},
					data: {
						user_id: user_id,
						birthday: this.currentDate,
					},
					success: res => {
						console.log(res.data.status)
						if(res.data.status == 403){
							this.relogin()
						}
					},
				});
				
			}
			
	    }
	};
</script>

<style>
	.body {
		border-top: #DBDBDA;
		padding: 0 40upx;
	}	
</style>
