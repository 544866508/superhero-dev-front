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
						{{ movieDetail.prised_count }}人收藏
					</view>
				</view>
			</view>
		</view>
		<!-- 影片基本信息 end -->
		
		<view class="line-wapper">
			<view class="line"></view>
		</view>
		
		<view class="plots-block">
			<!-- 剧情介绍 start -->
			<view class="plots-wapper">
				<view class="plots-title" style="margin-top: 10upx;">剧情介绍</view>
				<!-- 收藏 start -->
				<view v-if="movieDetail.isInterest">
					<button
						type="primary" 
						plain="true" 
						size="mini" 
						style="margin-right: 30upx;" 
						class="button" 
						@click="nomoralInterest">
						取消收藏
					</button>
				</view>
				<view v-else>
					<button
						type="primary" 
						plain="true" 
						size="mini" 
						style="margin-right: 30upx;" 
						class="button" 
						@click="interestMe">
						收藏
					</button>
				</view>
				<!-- 收藏 end -->
			</view>
			<view class="">
				<view class="plots-desc">{{ movieDetail.plot_desc }}</view>
			</view>
			<!-- 剧情介绍 end -->
		</view>
		
		
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
				movieId: 0,
			}
		},
		//生命周期函数，点击分享时触发，分享本页（仅支持在小程序端，分享到微信群或微信好友）
		onShareAppMessage(res) {
			return {
				title: this.movieDetail.name,
				path: 'pages/movie/movie?movieId=' + this.movieId
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
			this.movieId = parms.movieId;
			
			// 同步到浏览历史记录中
			var history = uni.getStorageSync("HISTORY")
			if(history) {
				// 非首次同步
				var historyList = history.split(',')
				// 判断是否重复浏览了本电影
				if(historyList.indexOf(this.movieId.toString()) > -1) {
					// 删除重复浏览的本电影id
					this.deleteByValue(historyList,this.movieId.toString())
				}
				historyList.unshift(this.movieId)
				uni.setStorageSync("HISTORY", historyList + '')
			}else{
				// 首次同步
				var historyList = []
				historyList.unshift(this.movieId)
				uni.setStorageSync("HISTORY", historyList + '')
			}
			
			//获取传入id的电影详情
			uni.request({
				url: this.apiServer + 'api/v1/get/filmdetail/',
				method: 'GET',
				data: {
					movie_id: this.movieId,
				},
				success: res => {
					//获取用户关注过的电影id
					var filmIdString = uni.getStorageSync('INTEREST_FILM_ID')
					var filmIdList = filmIdString.split(',')
					
					// 为当前影片添加“是否收藏”信息
					if(filmIdList.indexOf(res.data.id.toString()) > -1) {
						res.data.isInterest = true
					}else{
						res.data.isInterest = false
					}
					
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
				uni.previewImage({
					urls: this.cover,
				})
			},
			// 用户收藏电影前，判断是否登录
			interestMe() {
				// 没登录的用户不能收藏电影
				if(!uni.getStorageSync('IS_LOGIN')) {
					uni.showModal({
						title:'提示',
						content:"登录后才能进行收藏操作，去登录吗？",
						success(res){
							if(res.confirm){
								uni.switchTab({
									url:"/pages/me/me",
								})
							}
						}
					})
				}else{
					this.myInterest()
				}
			},
			// 用户添加收藏电影
			myInterest() {
				uni.showToast({title:"已收藏",icon:'none'});
				
				// 按钮取反
				this.movieDetail.isInterest = ! this.movieDetail.isInterest
				
				//获取用户收藏过的电影id
				var filmIdString = uni.getStorageSync('INTEREST_FILM_ID')
				var filmIdList = filmIdString.split(',')
				
				// 当前电影的id同步到缓存
				filmIdList.push(this.movieId)
				uni.setStorageSync('INTEREST_FILM_ID', filmIdList + '');
				
				// 当前电影的id同步到后端
				var user_id = uni.getStorageSync('USER_ID')
				var auth_token = uni.getStorageSync('AUTH_TOKEN')
				uni.request({
					url: this.apiServer + 'api/v1/interest_movie/',
					method: 'POST',
					header:{
						'content-type': "application/x-www-form-urlencoded",
						'auth-token': auth_token,
						},
					data: {
						user_id: user_id,
						movie_id: this.movieId,
					},
					success: res => {
						if(res.data.status == 200) {return}
						else if(res.data.status == 400) {this.relogin()}
					},
					fail: () => {
						uni.showToast({title:"系统错误,响应超时",icon:'none'});return ;
					},
					complete: () => {}
				});
			},
			//取消收藏
			nomoralInterest() {
				uni.showToast({title:"已取消收藏",icon:'none'});
				
				// 按钮取反
				this.movieDetail.isInterest = ! this.movieDetail.isInterest
				
				//获取用户收藏过的电影id
				var filmIdString = uni.getStorageSync('INTEREST_FILM_ID')
				var filmIdList = filmIdString.split(',')
				
				//从缓存中删除当前电影的id
				filmIdList = this.deleteByValue(filmIdList, this.movieId)
				
				uni.setStorageSync('INTEREST_FILM_ID', filmIdList + '');
				
				// 然后同步到后端
				var user_id = uni.getStorageSync('USER_ID')
				var auth_token = uni.getStorageSync('AUTH_TOKEN')
				uni.request({
					url: this.apiServer + 'api/v1/interest_movie/?user_id=' + user_id + '&movie_id=' + this.movieId,
					method: 'DELETE',
					header:{
						'content-type': "application/x-www-form-urlencoded",
						'auth-token': auth_token,
						},
					success: res => {
						if(res.data.status == 200) {return}
						else if(res.data.status == 400) {this.relogin()}
					},
					fail: () => {
						uni.showToast({title:"系统错误,响应超时",icon:'none'});return ;
					},
					complete: () => {}
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
		},
		components:{
			scoreComp
		},
		
	}
</script>

<style>
	@import url("movie.css");
</style>
