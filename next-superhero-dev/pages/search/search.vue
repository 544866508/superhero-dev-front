<template>
	<view class="page" @touchmove="handletouchmove" @touchstart="handletouchstart" @touchend="handletouchend">
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
				
				//监听滑动手势
				flag: 0,
				// text: '',
				lastX: 0,
				lastY: 0
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
			},
			//以下函数全是监听滑动手势------------------------------------------------------------------
			handletouchmove: function(event) {
				// console.log(event)
				if (this.flag !== 0) {
					return;
				}
				let currentX = event.touches[0].pageX;
				let currentY = event.touches[0].pageY;
				let tx = currentX - this.lastX;
				let ty = currentY - this.lastY;
				// let text = '';
				this.mindex = -1;
				//左右方向滑动
				if (Math.abs(tx) > Math.abs(ty)) {
					//判断移动距离是否大于30
					if(Math.abs(tx) > 30){
						//判断具体是左是右
						if (tx < 0) {
							// text = '向左滑动';
							this.flag = 1;
							console.log('向左滑动')
							uni.switchTab({
								url: '../me/me'
							})
						 // this.getList();  //调用列表的方法
						} else if (tx > 0) {
							// text = '向右滑动';
							this.flag = 2;
							console.log('向右滑动')
							uni.switchTab({
								url: '../index/index'
							})
						}
					}
				}
				// //上下方向滑动
				// else {
				// 	if (ty < 0) {
				// 		// text = '向上滑动';
				// 		this.flag = 3;
				// 	//  this.getList();  //调用列表的方法
				// 	} else if (ty > 0) {
				// 		// text = '向下滑动';
				// 		this.flag = 4;
				// 	}
				// }

				//将当前坐标进行保存以进行下一次计算
				this.lastX = currentX;
				this.lastY = currentY;
				// this.text = text;
			},
			handletouchstart: function(event) {
				// console.log(event)
				this.lastX = event.touches[0].pageX;
				this.lastY = event.touches[0].pageY;
			},
			handletouchend: function(event) {
				this.flag = 0;
				// this.text = '没有滑动';
			},
		}
	}
</script>

<style>
	@import url("search.css");
</style>
