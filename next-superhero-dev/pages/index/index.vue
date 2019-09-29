<template>
	<view class="page">
		<!-- 轮播图 -->
		<swiper class="carousel" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(item, index) in swiperList" :key="index">
				<image :src="item.img" class="carousel"></image>
			</swiper-item>
		</swiper>
		
		<!-- 最新上映 -->
		<view class="page-block hot-movie">
			<view class="hot-title-wapper">
				<image src="../../static/icos/hot.png" class="hot-ico"></image>
				<view class="hot-title">
					最新上映
				</view>
			</view>
		</view>
		<scroll-view scroll-x="true" class="pageblock nowrap">
			<view class="poster" v-for="(item, index) in hotFilmList" :key="index">
				<view class="poster-wapper">
					<image 
						:src="item.cover" 
						:data-movieId="item.id"
						@click="showMovie"
						class="poster-img">
					</image>
					<view class="movie-name">
						{{ item.name }}
					</view>
					<!-- 导入评分组件 -->
					<scoreComp :score="item.score"></scoreComp>
				</view>
			</view>
		</scroll-view>
		
		<!-- 热门预告 -->
		<view class="page-block hot-movie">
			<view class="hot-title-wapper">
				<image src="../../static/icos/interest.png" class="hot-ico"></image>
				<view class="hot-title">
					热门预告
				</view>
			</view>
		</view>
		<scroll-view scroll-x="true" class="pageblock nowrap">
			<view class="hot-announce-movie">
				<video 
					v-for="(item, index) in hotFilmList" :key="index"
					:src="item.trailer" 
					:poster="item.poster[0].poster"
					class="movie"
					controls>
				</video>
			</view>
		</scroll-view>
		
		
		<!-- 猜你喜欢 -->
		<view class="page-block hot-movie">
			<view class="hot-title-wapper">
				<image src="../../static/icos/guess-u-like.png" class="hot-ico"></image>
				<view class="hot-title">
					猜你喜欢
				</view>
			</view>
		</view>
		<view class="guess-u-like page-block">
			
			<view v-for="(item, index) in guessFilmList" :key="index"
				class="guess-u-like-movie">
				<image 
					:src="item.cover" 
					:data-movieId="item.id"
					@click="showMovie"
					class="like-movie">
				</image>
				<view class="movie-desc">
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
				<view class="movie-oper" :data-index="index" @click="praiseMe">
					<image src="../../static/icos/praise.png" class="praise-ico"></image>
					<view class="praise-txt">
						点赞
					</view>
					<view :animation="animationList[index]" class="praise-txt animation-opacity">
						+1
					</view>
				</view>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	import common from "../../common/common.js"
	//倒入自定义组件
	import scoreComp from "../../components/scoreComp.vue"
	
	export default {
		data() {
			return {
				swiperList: [],
				hotFilmList: [],
				filmList: [],
				guessFilmList: [],
				
				animationData: {},
				animationList: [
					{},{}
				],
				
				
			}
		},
		//生命周期函数，下拉刷新
		onPullDownRefresh() {
			this.refresh();
		},
		//生命周期函数，卸载页面
		onUnload() {
			//页面卸载的时候清除动画数据
			this.animationData = {};
		},
		//生命周期函数，加载页面
		onLoad() {
			var apiServer = common.apiServer, mediaServer = common.mediaServer;
			
			//在页面创建的时候，创建一个临时的动画对象
			this.adnimation = uni.createAnimation({
				
			})
			
			//请求轮播图数据
			uni.request({
				url: apiServer + 'api/v1/get/swiper/',
				method: 'GET',
				success: res => {
					for(var k in res.data){
						res.data[k].img = mediaServer + res.data[k].img
					}
					this.swiperList = res.data
					console.log(this.swiperList)
				},
				fail: (e) => {
					console.log(e)
				},
			});
			//请求主页影片
			uni.request({
				url: apiServer + 'api/v1/get/film/',
				method: 'GET',
				success: res => {
					for(var k in res.data){
						res.data[k].cover = mediaServer + res.data[k].cover;
						res.data[k].trailer = mediaServer + res.data[k].trailer;
						for(var j in res.data[k].poster){
							res.data[k].poster[j].poster = mediaServer + res.data[k].poster[j].poster;
						}
					}
					for(var k in res.data){
						if(res.data[k].is_hot == true){
							this.hotFilmList.push(res.data[k])
						}else{
							this.filmList.push(res.data[k])
						}
					}
					console.log(this.hotFilmList);
				},
				fail: (e) => {
					console.log(e);
				},
			});
			this.refresh();
		},
		methods: {
			// 展示电影详情页
			showMovie(e) {
				var movieId = e.currentTarget.dataset.movieid;
				uni.navigateTo({
					url:"../movie/movie?movieId=" + movieId
				})
			},
			//实现点赞动画效果
			praiseMe(e) {
				//获取praiseMe事件传入的数据index
				var index = e.currentTarget.dataset.index;
				//Y轴平移100，透明度变成100%，用时400毫秒
				this.adnimation.translateY(-60).opacity(1).step({duration: 400});
				//导出动画数据到view组件，实现组件的动画效果
				this.animationData = this.adnimation;
				this.animationList[index] = this.animationData.export();
				//还原动画
				setTimeout(function() {
					this.adnimation.translateY(0).opacity(0).step({duration: 0});
					this.animationData = this.adnimation;
					this.animationList[index] = this.animationData.export();
				}.bind(this), 500);
			},
			refresh() {
				//屏幕中央展示一个加载动画
				uni.showLoading({
					//为加载动画增加遮罩，防止用户重复操作
					mask: true,
					title: "努力加载中..."
				})
				//导航栏上展示一个加载动画
				uni.showNavigationBarLoading()
				
				var apiServer = common.apiServer, mediaServer = common.mediaServer;
				//请求猜你喜欢的影片
				uni.request({
					url: apiServer + 'api/v1/get/guessfilm/',
					method: 'GET',
					success: res => {
						for(var k in res.data){
							res.data[k].cover = mediaServer + res.data[k].cover;
							res.data[k].trailer = mediaServer + res.data[k].trailer;
							for(var j in res.data[k].poster){
								res.data[k].poster[j].poster = mediaServer + res.data[k].poster[j].poster;
							}
						}
						this.guessFilmList = res.data
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
			
		},
		
		components:{
			scoreComp
		},
	}
</script>

<style>
	@import url("index.css");
</style>
