<template>
	<view>
		
		<view class="guess-u-like page-block">
			
			<view v-for="(item, index) in interestFilmList" :key="index"
				class="guess-u-like-movie">
				
				<image 
					:src="item.cover" 
					:data-movieId="item.id"
					@click="showMovie"
					class="like-movie">
				</image>
				
				<view class="movie-desc" @click="showMovie" :data-movieId="item.id">
					<view class="movie-title">
						{{ item.name }}
					</view>
					
					<!-- 导入评分组件 -->
					<scoreComp :score="item.score"></scoreComp>
					
					<view class="movie-info">
						{{ item.basic_info }}
					</view>
					<view class="movie-info">
						{{ item.release_date }}({{ item.release_place }})
					</view>
				</view>
				
				
				<view class="movie-oper" :data-movieId="item.id" @click="setting">
					<image src="/static/icos/settings.png" class="praise-ico"></image>
				</view>		
				
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				interestFilmList: [],
			}
		},
		onLoad() {
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
				url: this.apiServer + 'api/v1/my_interest_movie/',
				method: 'GET',
				header:{
					'auth-token': auth_token,
					},
				data: {
					user_id: user_id,
				},
				success: res => {
					console.log(res)
					if(res.data == "") {
						uni.showToast({title:"还没有收藏过任何电影",icon:'none'});return ;
					}
					if(res.data[0].status == 200) {
						console.log(res)
						for(var k in res.data){
							res.data[k].cover = this.mediaServer + res.data[k].cover;
						}
						this.interestFilmList = res.data
					}
					else if(res.data[0].status == 400) {this.relogin()}
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
			
		},
		methods: {
			// 展示电影详情页
			showMovie(e) {
				var movieId = e.currentTarget.dataset.movieid;
				uni.navigateTo({
					url:"/pages/movie/movie?movieId=" + movieId
				})
			},
			setting(e) {
				var _self = this;
				var movieId = e.currentTarget.dataset.movieid;
				uni.showActionSheet({
				    itemList: ['取消收藏',],
				    success: function (res) {
						uni.showToast({title:"已取消收藏",icon:'none'});
						
						//获取用户收藏过的电影id
						var filmIdString = uni.getStorageSync('INTEREST_FILM_ID')
						var filmIdList = filmIdString.split(',')
						
						// 去掉收藏的电影id
						var filmIdList = _self.deleteByValue(filmIdList, movieId)
						// 同步到缓存
						uni.setStorageSync('INTEREST_FILM_ID', filmIdList + '');
						
						// 同步到后端
						var user_id = uni.getStorageSync('USER_ID')
						var auth_token = uni.getStorageSync('AUTH_TOKEN')
						uni.request({
							url: _self.apiServer + 'api/v1/interest_movie/',
							method: 'DELETE',
							header:{
								'content-type': "application/x-www-form-urlencoded",
								'auth-token': auth_token,
								},
							data: {
								user_id: user_id,
								movie_id: movieId,
							},
							success: res => {
								if(res.data.status == 200) {
									uni.redirectTo({
										url:"my_interest"
									})
								}
								else if(res.data.status == 400) {_self.relogin()}
							},
							fail: () => {
								uni.showToast({title:"系统错误,响应超时",icon:'none'});return ;
							},
							complete: () => {}
						}); 
						
				    },
				});
			},
			deleteByValue(list, value) {
				
				for(var i=0; i<list.length; i++){
					if(value == list[i]){
						list.splice(i,1)
					}
				}
				return list;
			},
		}
	}
</script>
	
<style>
	@import url("my_interest.css");
</style>
