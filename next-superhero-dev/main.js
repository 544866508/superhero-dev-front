import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

// Vue.prototype.mediaServer = "http://ffqbgn.natappfree.cc";
Vue.prototype.mediaServer = "https://www.zoesama.club";
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

// 检查登录是否过期（检查JWT）
Vue.prototype.checkJWT = function(){
	var user_id = uni.getStorageSync('USER_ID')
	var auth_token = uni.getStorageSync('AUTH_TOKEN')
	if(!user_id || !auth_token ) {
		uni.showToast({title:"登录后可获得更多权限",icon:'none'});
	}
	uni.request({
		url: this.apiServer + 'check_jwt/',
		method: 'POST',
		header:{
			'auth-token': auth_token,
			},
		data: {
			user_id: user_id,
		},
		success: res => {
			if(res.data.status == 200){console.log('jwt未过期')}
			if(res.data.status == 400){console.log('jwt过期,自动重新登录'); this.relogin()}
		},
		fail: () => {
			uni.setStorageSync('IS_LOGIN', false)
			uni.showToast({title:"系统错误,响应超时",icon:'none'})
		},
		complete: () => {}
	});
}

// JWT过期时调用,自动重新登录
Vue.prototype.relogin = function(page){
	var username = uni.getStorageSync('USERNAME')
	var password = uni.getStorageSync('PASSWORD')
	//如果账号密码在缓存中，但是isLogin = false，说明用户已登录，但是JWT过期
	if(username && password){				
		// //屏幕中央展示一个加载动画
		// uni.showLoading({
		// 	//为加载动画增加遮罩，防止用户重复操作
		// 	mask: true,
		// 	title: "努力加载中..."
		// })
		// //导航栏上展示一个加载动画
		// uni.showNavigationBarLoading()		
				
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
					uni.setStorageSync('INTEREST_FILM_ID', res.data.interest_film_id + '');
					// 登录状态同步
					uni.setStorageSync('IS_LOGIN', true)
					// uni.showToast({title:"登陆过期，已为您重新登录",icon:'none'});return ;
					uni.switchTab({
						url:page
					})
					
 					console.log(uni.getStorageSync('AUTH_TOKEN'))
				}else{
					uni.setStorageSync('IS_LOGIN', false)
					uni.showToast({title:"relogin失败",icon:'none'})
				}
			},
			fail: () => {
				uni.setStorageSync('IS_LOGIN', false)
				uni.showToast({title:"系统错误,响应超时",icon:'none'})
			},
			// complete: () => {
			// 	uni.hideLoading();
			// 	uni.hideNavigationBarLoading();
			// 	uni.stopPullDownRefresh();
			// }
			
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
					url: _self.apiServer + 'login_out/?user_id=' + user_id,
					method: 'DELETE',
					header:{
						'auth-token': auth_token,
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
							uni.removeStorageSync('INTEREST_FILM_ID');
							// 如果用户浏览过页面,就删除浏览记录缓存
							uni.removeStorageSync('HISTORY');
							// 删除登录状态
							uni.removeStorageSync('IS_LOGIN')
							// 转跳
							uni.switchTab({
								url:"/pages/me/me",
							})
						}
						if(res.data.status == 400){
							console.log(123123123)
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
	// //屏幕中央展示一个加载动画
	// uni.showLoading({
	// 	//为加载动画增加遮罩，防止用户重复操作
	// 	mask: true,
	// 	title: "努力加载中..."
	// })
	
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
				uni.setStorageSync('INTEREST_FILM_ID', res.data.interest_film_id + '');
				// 登录信息同步
				uni.setStorageSync('IS_LOGIN', true)
				//转跳
				uni.switchTab({
					url:"/pages/me/me",
				})
			}else if(res.data.status == 403){
				uni.setStorageSync('IS_LOGIN', false)
				uni.showToast({title:"账号或密码错误",icon:'none'})
			}else if(res.data.status == 400){
				uni.setStorageSync('IS_LOGIN', false)
				uni.showToast({title:"该用户已登录，请勿重复登录",icon:'none'})
			}else{
				uni.setStorageSync('IS_LOGIN', false)
				uni.showToast({title:"请求不存在",icon:'none'})
			}
		},
		fail: () => {
			uni.setStorageSync('IS_LOGIN', false)
			uni.showToast({title:"系统错误，响应超时",icon:'none'})
		},
		// complete: () => {
		// 	uni.hideLoading();
		// }
	});
}



App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
