<template>
	<view class="page">
		<view class="search-block">
			<view class="search-ico-wapper">
				<image src="../../static/icos/search.png" class="search-ico"></image>
			</view>
			<input 
				type="text" 
				placeholder="搜索预告" 
				maxlength="10" 
				class="search-txt"
				confirm-type="search"
				@confirm="searchFilm"/>
		</view>
		<view class="movie-list page-block">
			<view 
				v-for="(item, index) in searchFilmList" :key="index"
				class="movie-wapper">
				<image 
					:src="item.cover" 
					:data-movieId="item.id"
					@click="showMovie"
					class="poster-img">
				</image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchFilmList: [],
			}
		},
		onLoad() {
			this.getAllFilm();
		},
		methods: {
			// 展示电影详情页
			showMovie(e) {
				var movieId = e.currentTarget.dataset.movieid;
				uni.navigateTo({
					url:"../movie/movie?movieId=" + movieId
				})
			},
			// 获取全部影片,首次加载的时候使用
			getAllFilm() {
				//屏幕中央展示一个加载动画
				uni.showLoading({
					//为加载动画增加遮罩，防止用户重复操作
					mask: true,
					title: "努力加载中..."
				})
				//导航栏上展示一个加载动画
				uni.showNavigationBarLoading()
				
				//请求主页影片
				uni.request({
					url: this.apiServer + 'api/v1/get/all_film/',
					method: 'GET',
					success: res => {
						for(var k in res.data){
							res.data[k].cover = this.mediaServer + res.data[k].cover;
							// res.data[k].trailer = this.mediaServer + res.data[k].trailer;
							// for(var j in res.data[k].poster){
							// 	res.data[k].poster[j].poster = this.mediaServer + res.data[k].poster[j].poster;
							// }
						}
						for(var k in res.data){
							this.searchFilmList.push(res.data[k])
						}
					},
					fail: (e) => {
						console.log(e);
					},
					complete: () => {
						uni.hideLoading();
						uni.hideNavigationBarLoading();
						uni.stopPullDownRefresh();
					}
				});
			},
			//获取查询的影片，点击confirm时触发
			searchFilm(e) {
				this.searchFilmList = [];
				// 获取搜索内容,点击confirm后,input框中的值
				var keyword = e.detail.value;
				if(!keyword){
					this.getAllFilm();
				}else{
					//屏幕中央展示一个加载动画
					uni.showLoading({
						//为加载动画增加遮罩，防止用户重复操作
						mask: true,
						title: "努力加载中..."
					})
					//导航栏上展示一个加载动画
					uni.showNavigationBarLoading()
					
					uni.request({
						url: this.apiServer + "api/v1/get/search/",
						method: 'GET',
						data: {
							keyword: keyword,
						},
						success: res => {
							for(var k in res.data){
								res.data[k].cover = this.mediaServer + res.data[k].cover;
								res.data[k].trailer = this.mediaServer + res.data[k].trailer;
								for(var j in res.data[k].poster){
									res.data[k].poster[j].poster = this.mediaServer + res.data[k].poster[j].poster;
								}
							}
							for(var k in res.data){
								this.searchFilmList.push(res.data[k])
							}
						},
						fail: (e) => {
							console.log(e)
						},
						complete: () => {
							uni.hideLoading();
							uni.hideNavigationBarLoading();
							uni.stopPullDownRefresh();
						}
					});
				}
			}
		}
	}
</script>

<style>
	@import url("search.css");
</style>
