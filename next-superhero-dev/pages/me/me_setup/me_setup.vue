<template>
	<view class="page">
		<view class="line-wapper" style="margin-bottom: 30upx;">
			<view class="line"></view>
		</view>
		
		<view class="u-info-wapper" v-model="myAccountInfo" @click="loginOut">
			<view class="info-black">
				 退出登录
			</view>
			<view class="row-wapper">
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
				},
			}
		},
		onLoad() {

		},
		methods: {
			loginOut() {
				// 退出登录
				this.login_out();
			},
		}
	}
</script>
	
<style>
	@import url("me_setup.css");
</style>
