<template>
	<view class="page">
		<view class="line-wapper" style="margin-bottom: 30upx;">
			<view class="line"></view>
		</view>
		
		<view class="u-info-wapper" v-model="myAccountInfo" @click="changeFace">
			<view class="info-black" style="margin-top: 60upx;">
				 头像
			</view>
			<view class="row-wapper">
				<view class="">
					<image :src="myAccountInfo.face" mode="" class="face"></image>
				</view>
				<view class="ico-wapper" style="margin-top: 60upx;">
					<image src="/static/icos/left-gray-arrow.png" mode="" class="ico"></image>
				</view>
			</view>
		</view>
		
		<view class="line-wapper">
			<view class="line"></view>
		</view>
		
		<view class="u-info-wapper" v-model="myAccountInfo" @click="changeNickname">
			<view class="info-black">
				 昵称
			</view>
			<view class="row-wapper">
				<view class="info-darkgray">
					{{ myAccountInfo.nickname }}
				</view>
				<view class="ico-wapper">
					<image src="/static/icos/left-gray-arrow.png" mode="" class="ico"></image>
				</view>
			</view>
		</view>
		
		<view class="line-wapper">
			<view class="line"></view>
		</view>
		
		<view class="u-info-wapper" v-model="myAccountInfo">
			<view class="info-black">
				 用户名
			</view>
			<view class="row-wapper">
				<view class="info-darkgray">
					{{ myAccountInfo.username }}
				</view>
			</view>
		</view>
		
		<view class="line-wapper">
			<view class="line"></view>
		</view>
		
		<view class="u-info-wapper" v-model="myAccountInfo" @click="changeSex">
			<view class="info-black">
				 性别
			</view>
			<view class="row-wapper">
				<view class="info-darkgray">
					{{ myAccountInfo.sex }}
				</view>
				<view class="ico-wapper">
					<image src="/static/icos/left-gray-arrow.png" mode="" class="ico"></image>
				</view>
			</view>
		</view>
		
		<view class="line-wapper">
			<view class="line"></view>
		</view>
		
		<view class="u-info-wapper" v-model="myAccountInfo" @click="changeBirthday">
			<view class="info-black">
				 出生日期
			</view>
			<view class="row-wapper">
				<view class="info-darkgray">
					{{ myAccountInfo.birthday }}
				</view>
				<view class="ico-wapper">
					<image src="/static/icos/left-gray-arrow.png" mode="" class="ico"></image>
				</view>
			</view>
		</view>
		
		<view class="line-wapper">
			<view class="line"></view>
		</view>
		
		<view class="u-info-wapper" v-model="myAccountInfo" @click="changeSaySth">
			<view class="info-black" style="width: 40%;">
				 签名
			</view>
			<view class="left-wapper" style="width: 60%;">
				<view class="info-darkgray overflow-hidden">
					{{ myAccountInfo.say_sth }}
				</view>
				<view class="ico-wapper">
					<image src="/static/icos/left-gray-arrow.png" mode="" class="ico"></image>
				</view>
			</view>
		</view>
		
		<view class="line-wapper">
			<view class="line"></view>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				myAccountInfo: {
					face: "",
					nickname: "",
					username: "",
					sex:"",
					birthday:"",
					say_sth: "",
				}
			}
		},
		onLoad() {
								
		},
		onShow() {
			this.myAccountInfo.face = uni.getStorageSync('FACE');
			this.myAccountInfo.nickname = uni.getStorageSync('NICKNAME');
			this.myAccountInfo.username = uni.getStorageSync('USERNAME');
			this.myAccountInfo.birthday = uni.getStorageSync('BIRTHDAY');
			this.myAccountInfo.say_sth = uni.getStorageSync('SAYSTH');	
			var sexNum = uni.getStorageSync('SEX')
			if(sexNum == "1"){
				this.myAccountInfo.sex = "男♂"
			}else{
				if(sexNum == "2"){
					this.myAccountInfo.sex = "女♀"
				}else{
					if(sexNum == "3"){
						this.myAccountInfo.sex = "未知"
					}
				}
			}
		},
		methods: {
			//修改头像
			changeFace() {
				uni.navigateTo({
					url:"action/change_face"
				})
			},
			//修改昵称
			changeNickname() {
				uni.navigateTo({
					url:"action/change_nickname"
				})
			},
			//修改性别
			changeSex() {
				var _self = this;
				uni.showActionSheet({
				    itemList: ['男♂', '女♀', '我不知道(๑°ㅁ°๑)'],
				    success: function (res) {
						var user_id = uni.getStorageSync('USER_ID')
						var auth_token = uni.getStorageSync('AUTH_TOKEN')
						var sexNum = res.tapIndex + 1
						
						if(sexNum == "1"){
							_self.myAccountInfo.sex = "男♂"
						}else{
							if(sexNum == "2"){
								_self.myAccountInfo.sex = "女♀"
							}else{
								if(sexNum == "3"){
									_self.myAccountInfo.sex = "未知"
								}
							}
						}
						uni.setStorageSync('SEX', sexNum + '');
						
						uni.request({
							url: _self.apiServer + 'api/v1/user_info/',
							method: 'PUT',
							header:{
								'auth-token': auth_token,
								},
							data: {
								user_id: user_id,
								sex: sexNum,
							},
							success: res => {
								if(res.data.status == 403){
									_self.relogin()
								}
							},
						});
						
				    },
				});
			},
			//修改生日
			changeBirthday() {
				uni.navigateTo({
					url:"action/change_birthday"
				})
			},
			//修改签名
			changeSaySth() {
				uni.navigateTo({
					url:"action/change_saysth"
				})
			},
		}
	}
</script>
	
<style>
	@import url("account.css");
</style>
