<template>
	<view>
		
		<view class="guess-u-like page-block">
			
			<view v-for="(item, index) in historyFilmList" :key="index"
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
				
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				historyFilmList: [],
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
			
			// 获取浏览记录中的电影id
			var history = uni.getStorageSync('HISTORY')
			if(!history) {
				uni.showToast({title:"还没有看过任何电影",icon:'none'});return ;
			}
			
			var user_id = uni.getStorageSync('USER_ID')
			var auth_token = uni.getStorageSync('AUTH_TOKEN')
			uni.request({
				url: this.apiServer + 'api/v1/history_movie/',
				method: 'GET',
				header:{
					'auth-token': auth_token,
					},
				data: {
					user_id: user_id,
					history: history,
				},
				success: res => {
					if(res.data[0].status == 200) {
						// 将后端返回的结果集重新排序
						// 排序的顺序是用户的浏览顺序，也就是按照缓存中HISTORY的顺序进行排列
						var historyList = history.split(',')
						for(var i in historyList){
							for(var k in res.data){
								if(historyList[i] == res.data[k].id) {
									res.data[k].cover = this.mediaServer + res.data[k].cover;
									this.historyFilmList.push(res.data[k])
								}
							}
						}
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
		}
	}
</script>
	
<style>
	@import url("me_history.css");
</style>
