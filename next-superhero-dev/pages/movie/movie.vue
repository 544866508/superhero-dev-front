<template>
	<view class="page">
		<!-- 视频播放，start -->
		<view class="player">
			<video 
			:src="movieDetail.trailer" 
			:poster="movieDetail.poster[0].poster"
			class="movie"
			controls>
			
			</video>
		</view>
		<!-- 视频播放，end -->	
		
		<!-- 影片基本信息 start -->
		<view class="movie-info">
			<image 
				:src="movieDetail.cover" 
				class="cover"
				@click="lookCover"
				mode="aspectFit">
			</image>
			<view class="movie-desc">
				<view class="title">{{ movieDetail.name }}</view>
				<view class="basic-info">{{ movieDetail.basic_info }}</view>
				<view class="basic-info">原名:{{ movieDetail.original_name }}</view>
				<view class="basic-info">时长:{{ movieDetail.total_time }}分钟</view>
				<view class="basic-info">上映时间:{{ movieDetail.release_date }}({{ movieDetail.release_place }})</view>
				
				<view class="score-block">
					
					<view class="">
						<view class="big-score">
							<view class="score-words">综合评分</view>
						</view>
						<!-- 导入评分组件 -->
						<block v-if="movieDetail.score >= 0">
							<scoreComp :score="movieDetail.score"></scoreComp>
						</block>
					</view>
					<view class="score-words">
						{{ movieDetail.prised_count }}人点赞
					</view>
				</view>
			</view>
		</view>
		<!-- 影片基本信息 end -->
		
		<view class="line-wapper">
			<view class="line"></view>
		</view>
		
		<!-- 剧情介绍 start -->
		<view class="plots-block">
			<view class="plots-title">剧情介绍</view>
			<view class="plots-desc">{{ movieDetail.plot_desc }}</view>
		</view>
		<!-- 剧情介绍 end -->
		
		<view class="line-wapper">
			<view class="line"></view>
		</view>
		
		<!-- 演职人员 start -->
		<view class="plots-block">
			<view class="plots-title">演职人员</view>
			<scroll-view scroll-x="true" class="page-block nowrap">
				<view v-for="(item, index) in movieDetail.actor" :key="index" class="actor">
					<view class="actor-wapper">
						<image :src="item.photo" class="actor-photo"></image>
						<view class="actor-name">{{ item.name }}</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 演职人员 end -->
		
		<view class="line-wapper">
			<view class="line"></view>
		</view>
		
		<!-- 剧照 start -->
		<view class="plots-block">
			<view class="plots-title">剧照</view>
			<scroll-view scroll-x="true" class="page-block nowrap">
				<view v-for="(item, index) in movieDetail.poster" :key="index" class="actor">
					<view class="actor-wapper">
						<image 
						:src="item.poster" 
						class="actor-photo" 
						@click="lookMe"
						:data-imgIndex = "index"
						mode="aspectFill"></image>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 剧照 end -->
		
	</view>
</template>

<script>
	//倒入自定义组件
	import scoreComp from "../../components/scoreComp.vue"
	
	export default {
		data() {
			return {
				movieDetail: {},
				posterArray: [],
				cover: [],				
			}
		},
		//生命周期函数，点击分享时触发，分享本页（仅支持在小程序端，分享到微信群或微信好友）
		onShareAppMessage(res) {
			return {
				title: this.movieDetail.name,
				path: 'pages/movie/movie?movieId=' + this.movieDetail.id
			}
		},
		onLoad(parms) {
			//屏幕中央展示一个加载动画
			uni.showLoading({
				//为加载动画增加遮罩，防止用户重复操作
				mask: true,
				title: "努力加载中..."
			})
			//导航栏上展示一个加载动画
			uni.showNavigationBarLoading()
			
			//获取上一页面的传参
			var movieId = parms.movieId;
			
			//获取传入id的电影详情
			uni.request({
				url: this.apiServer + 'api/v1/get/filmdetail/',
				method: 'GET',
				data: {
					movie_id: movieId,
				},
				success: res => {
					res.data.cover = this.mediaServer + res.data.cover;
					res.data.trailer = this.mediaServer + res.data.trailer;
					for(var k in res.data.poster){
						res.data.poster[k].poster = this.mediaServer + res.data.poster[k].poster;
						this.posterArray.push(res.data.poster[k].poster);
					}
					for(var k in res.data.actor){
						res.data.actor[k].photo = this.mediaServer + res.data.actor[k].photo;
					}
					this.movieDetail = res.data;
					this.cover.push(this.movieDetail.cover)
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
		methods: {
			//剧照图片预览
			lookMe(e) {
				var imgIndex = e.currentTarget.dataset.imgindex;
				uni.previewImage({
					current:this.posterArray[imgIndex],
					urls: this.posterArray,
				})
			},
			lookCover() {
				debugger;
				uni.previewImage({
					urls: this.cover,
				})
			},
		},
		components:{
			scoreComp
		},
	}
</script>

<style>
	@import url("movie.css");
</style>
