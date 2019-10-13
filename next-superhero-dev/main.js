import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

Vue.prototype.mediaServer = "http://um5e97.natappfree.cc";
Vue.prototype.apiServer = Vue.prototype.mediaServer + "/";

// //检查用户是否登录
// Vue.prototype.checkLogin = function(){
// 	var auth_token = uni.getStorageSync('AUTH_TOKEN')
// 	var user_id = uni.getStorageSync('USER_ID')
// 	if(auth_token && user_id){
// 		return true;
// 	}
// 	return false;
// }
// //验证JWT是否过期
// Vue.prototype.checkJWT = function(){
// 	if(this.checkLogin()){
// 		
// 		uni.setStorageSync('IS_LOGIN', true)   	// 登录标志
// 	
// 		var user_id = uni.getStorageSync('USER_ID')
// 		var auth_token = uni.getStorageSync('AUTH_TOKEN')
// 		uni.request({
// 			url: this.apiServer + 'api/v1/get/user_info',
// 			method: 'GET',
// 			header:{'auth-token': auth_token},
// 			data: {
// 				user_id: user_id,
// 			},
// 			success: res => {
// 				console.log(res)
// 				if(res.data.status == 403){
// 					this.relogin()
// 				}
// 			},
// 		});
// 	}else{
// 		uni.setStorageSync('IS_LOGIN', false)// 登录标志
// 	}
// }


// JWT过期时调用,自动重新登录
Vue.prototype.relogin = function(page){
	var username = uni.getStorageSync('USERNAME')
	var password = uni.getStorageSync('PASSWORD')
	//如果账号密码在缓存中，但是isLogin = false，说明用户已登录，但是JWT过期
	if(username && password){
		//导航栏上展示一个加载动画
		uni.showNavigationBarLoading()
		
		uni.request({
			url: this.apiServer + 'login/',
			method: 'POST',
			header:{'content-type': "application/x-www-form-urlencoded"},
			data: {
				username: username,
				password: password,
			},
			success: res => {
				console.log(res)
				if(res.data.status == 200){
					console.log("重新获取并保存JWT")
					//用户信息同步
					uni.setStorageSync('AUTH_TOKEN', res.data.auth_token + '');
					uni.setStorageSync('USER_ID', res.data.id + '');
					uni.setStorageSync('USERNAME', username + '');
					uni.setStorageSync('PASSWORD', password + '');
					uni.setStorageSync('NICKNAME', res.data.nickname + '');
					uni.setStorageSync('FACE', this.mediaServer + res.data.face + '');
					uni.setStorageSync('SAYSTH', res.data.other_info.say_sth + '');
					uni.setStorageSync('BIRTHDAY', res.data.other_info.birthday + '');
					uni.setStorageSync('SEX', res.data.other_info.sex + '');
					// 登录状态同步
					uni.setStorageSync('IS_LOGIN', true)
					// 转跳
					if(page){
						uni.switchTab({
							url:page,
						})
					}
					
					
 					console.log(uni.getStorageSync('AUTH_TOKEN'))
				}else{
					uni.setStorageSync('IS_LOGIN', false)
					uni.showToast({title:"账号或密码错误",icon:'none'});return ;
				}
			},
			fail: () => {
				uni.setStorageSync('IS_LOGIN', false)
				uni.showToast({title:"系统错误,响应超时",icon:'none'});return ;
			},
			complete: () => {
				uni.hideNavigationBarLoading();
			}	
			
		})
	}
}
// 退出登录
Vue.prototype.login_out = function(){
	var _self = this
	uni.showModal({
		title:'提示',
		content:"确定要退出登录吗",
		success(res){
			if(res.confirm){
				//屏幕中央展示一个加载动画
				uni.showLoading({
					//为加载动画增加遮罩，防止用户重复操作
					mask: true,
					title: "努力加载中..."
				})
				//导航栏上展示一个加载动画
				uni.showNavigationBarLoading()
				
				var user_id = uni.getStorageSync('USER_ID')
				var auth_token = uni.getStorageSync('AUTH_TOKEN')
				uni.request({
					url: _self.apiServer + 'login_out/',
					method: 'DELETE',
					header:{
						'auth-token': auth_token,
						},
					data: {
						user_id: user_id,
					},
					success: res => {
						if(res.data.status == 200){
							//删除用户缓存信息
							uni.removeStorageSync('AUTH_TOKEN');
							uni.removeStorageSync('USER_ID');
							uni.removeStorageSync('USERNAME');
							uni.removeStorageSync('PASSWORD');
							uni.removeStorageSync('NICKNAME');
							uni.removeStorageSync('FACE');
							uni.removeStorageSync('SAYSTH');
							uni.removeStorageSync('BIRTHDAY');
							uni.removeStorageSync('SEX');
							// 删除登录状态
							uni.removeStorageSync('IS_LOGIN')
							// 转跳
							uni.switchTab({
								url:"../me/me",
							})
						}
						if(res.data.status == 403){
							_self.relogin()
						}
					},
					fail: () => {
						uni.setStorageSync('IS_LOGIN', false)
						uni.showToast({title:"系统错误,响应超时",icon:'none'});return ;
					},
					complete: () => {
						uni.hideLoading();
						uni.hideNavigationBarLoading();
						uni.stopPullDownRefresh();
					}
				});
				
				
				
				
				
			}
		}
	})
}
// 登录
Vue.prototype.login = function(submited){
	//屏幕中央展示一个加载动画
	uni.showLoading({
		//为加载动画增加遮罩，防止用户重复操作
		mask: true,
		title: "努力加载中..."
	})
	//导航栏上展示一个加载动画
	uni.showNavigationBarLoading()
	
	var username = submited.detail.value.username;
	var password = submited.detail.value.password;
	uni.request({
		url: this.apiServer + 'login/',
		method: 'POST',
		header:{'content-type': "application/x-www-form-urlencoded"},
		data: {
			username: username,
			password: password,
		},
		success: res => {
			console.log(res)
			if(res.data.status == 200){
				// 用户信息同步
				uni.setStorageSync('AUTH_TOKEN', res.data.auth_token + '');
				uni.setStorageSync('USER_ID', res.data.id + '');
				uni.setStorageSync('USERNAME', username + '');
				uni.setStorageSync('PASSWORD', password + '');
				uni.setStorageSync('NICKNAME', res.data.nickname + '');
				uni.setStorageSync('FACE', this.mediaServer + res.data.face + '');
				uni.setStorageSync('SAYSTH', res.data.other_info.say_sth + '');
				uni.setStorageSync('BIRTHDAY', res.data.other_info.birthday + '');
				uni.setStorageSync('SEX', res.data.other_info.sex + '');
				// 登录信息同步
				uni.setStorageSync('IS_LOGIN', true)
				//转跳
				uni.switchTab({
					url:"../me/me",
				})
			}else{
				uni.setStorageSync('IS_LOGIN', false)
				uni.showToast({title:"账号或密码错误",icon:'none'});return ;
			}
		},
		fail: () => {
			uni.setStorageSync('IS_LOGIN', false)
			uni.showToast({title:"系统错误，响应超时",icon:'none'});return ;
		},
		complete: () => {
			uni.hideLoading();
			uni.hideNavigationBarLoading();
			uni.stopPullDownRefresh();
		}
	});
}



App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
