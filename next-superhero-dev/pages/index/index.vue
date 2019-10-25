<template>
	<view class="page" @touchmove="handletouchmove" @touchstart="handletouchstart" @touchend="handletouchend">
		<!-- 轮播图 -->
		<swiper class="carousel" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" style="background-color: #333333;">
			<swiper-item v-for="(item, index) in swiperList" :key="index" >
				<image 
					:src="item.swiper_img" 
					class="carousel" 
					mode="aspectFill"
					:data-movieId="item.id" 
					@click="showMovie">
				</image>
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
			<view class="poster" v-for="(item, index) in newFilmList" :key="index">
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
					热门影片
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
					<view class="praise-font">
						{{ item.prised_count }}人收藏
					</view>
				</view>
			</view>
		</scroll-view>
		
		
<!-- 		<scroll-view scroll-x="true" class="pageblock nowrap">
			<view class="hot-announce-movie">
				<video 
					v-for="(item, index) in hotFilmList" :key="index"
					:src="item.trailer" 
					:poster="item.poster[0].poster"
					class="movie"
					controls>
				</video>
			</view>
		</scroll-view> -->
		
		
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
				
				<!-- 千万注意，js中引用局部变量需要加this.xxx，但是，组件中引用局部变量直接使用xxx即可 -->
				<view v-if="item.isInterest" class="movie-oper" :data-index="index" @click="interestMe">
					<image src="/static/icos/star-gray.png" class="praise-ico"></image>
					<view class="praise-gray-txt">
						 已收藏
					</view>
				</view>		
				<view v-else class="movie-oper" :data-index="index" @click="interestMe">
					<image src="/static/icos/star-yellow.png" class="praise-ico"></image>
					<view class="praise-txt">
						收藏
					</view>
				</view>	
				
				
				
				
<!-- 			<view class="movie-oper" :data-index="index" @click="interestMe">
					<image src="/static/icos/star-yellow.png" class="praise-ico"></image>
					<view class="praise-txt">
						关注
					</view>
					<view :animation="animationList[index]" class="praise-txt animation-opacity">
						+1
					</view>
				</view> -->
				
			</view>
		</view>
		
		
	</view>
</template>

<script>
	//倒入自定义组件
	import scoreComp from "../../components/scoreComp.vue"
	
	export default {
		data() {
			return {
				swiperList: [], 		//轮播图
				hotFilmList: [],		//热门电影
				newFilmList: [],		//最新电影
				// filmList: [],		
				guessFilmList: [],		//猜你喜欢
				
				
				
				//监听滑动手势
				flag: 0,
				// text: '',
				lastX: 0,
				lastY: 0
				
				// animationData: {},
				// animationList: [
				// 	{},{}
				// ],
				
				
			}
		},
		//生命周期函数，下拉刷新
		onPullDownRefresh() {
			//请求热门影片和最新影片
			this.getHotFilmAndNewFilm();
			//请求猜你喜欢影片（无序）
			this.getGuessFilm();
		},
		// 每次onshow的时候重新获取猜你喜欢，以便刷新用户的收藏信息
		onShow() {
			//请求猜你喜欢影片（无序）
			this.getGuessFilm();
		},
		//生命周期函数，卸载页面
		onUnload() {
			//页面卸载的时候清除动画数据
			this.animationData = {};
		},
		//生命周期函数，加载页面
		onLoad() {		
			//在页面创建的时候，创建一个临时的动画对象
			this.adnimation = uni.createAnimation({
				
			})
			
			//请求轮播图数据 
			uni.request({
				url: this.apiServer + 'api/v1/get/swiper/',
				method: 'GET',
				success: res => {
					for(var k in res.data){
						res.data[k].swiper_img = this.mediaServer + res.data[k].swiper_img
					}
					this.swiperList = res.data
					console.log(this.swiperList)
				},
				fail: (e) => {
					console.log(e)
				},
			});
			//请求热门影片和最新影片
			this.getHotFilmAndNewFilm();
		},
		methods: {
			//请求热门影片和最新影片
			getHotFilmAndNewFilm() {
				//屏幕中央展示一个加载动画
				uni.showLoading({
					//为加载动画增加遮罩，防止用户重复操作
					mask: true,
					title: "努力加载中..."
				})
				//导航栏上展示一个加载动画
				uni.showNavigationBarLoading()
				
				this.hotFilmList = [];
				this.newFilmList = [];
				
				// 请求热门影片
				uni.request({
					url: this.apiServer + 'api/v1/get/hot_film/',
					method: 'GET',
					success: res => {
						for(var k in res.data){
							res.data[k].cover = this.mediaServer + res.data[k].cover;
							// res.data[k].trailer = this.mediaServer + res.data[k].trailer;
							// for(var j in res.data[k].poster){
							// 	res.data[k].poster[j].poster = this.mediaServer + res.data[k].poster[j].poster;
							// }
							this.hotFilmList.push(res.data[k])
						}
						console.log(this.hotFilmList);
					},
					fail: (e) => {
						console.log(e);
					},
				});
				
				// 请求最新影片
				uni.request({
					url: this.apiServer + 'api/v1/get/new_film/',
					method: 'GET',
					success: res => {
						for(var k in res.data){
							res.data[k].cover = this.mediaServer + res.data[k].cover;
							// res.data[k].trailer = this.mediaServer + res.data[k].trailer;
							// for(var j in res.data[k].poster){
							// 	res.data[k].poster[j].poster = this.mediaServer + res.data[k].poster[j].poster;
							// }
							this.newFilmList.push(res.data[k])
						}
						console.log(this.newFilmList);
					},
					fail: (e) => {
						console.log(e);
					},
				});
				
				uni.hideLoading();
				uni.hideNavigationBarLoading();
				uni.stopPullDownRefresh();
			},
			// 展示电影详情页
			showMovie(e) {
				var movieId = e.currentTarget.dataset.movieid;
				uni.navigateTo({
					url:"../movie/movie?movieId=" + movieId
				})
			},
			// //实现点赞动画效果
			// praiseMe(e) {
			// 	//获取praiseMe事件传入的数据index
			// 	var index = e.currentTarget.dataset.index;
			// 	//Y轴平移100，透明度变成100%，用时400毫秒
			// 	this.adnimation.translateY(-60).opacity(1).step({duration: 400});
			// 	//导出动画数据到view组件，实现组件的动画效果
			// 	this.animationData = this.adnimation;
			// 	this.animationList[index] = this.animationData.export();
			// 	//还原动画
			// 	setTimeout(function() {
			// 		this.adnimation.translateY(0).opacity(0).step({duration: 0});
			// 		this.animationData = this.adnimation;
			// 		this.animationList[index] = this.animationData.export();
			// 	}.bind(this), 500);
			// },
			
			interestMe(e) {
				// 没登录的用户不能收藏电影
				if(!uni.getStorageSync('IS_LOGIN')) {
					var _self = this
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
					//获取interestMe事件传入的数据index
					var index = e.currentTarget.dataset.index;
					//点击后就对该按钮的值取反
					this.guessFilmList[index].isInterest = !this.guessFilmList[index].isInterest
					if(this.guessFilmList[index].isInterest) {
						//传入影片id进行关注
						this.myInterest(this.guessFilmList[index].id)
					}else{
						//传入影片id进行取关
						this.nomoralInterest(this.guessFilmList[index].id)
					}
				}
			},
			
			getGuessFilm() {
				
				
				//请求猜你喜欢的影片
				uni.request({
					url: this.apiServer + 'api/v1/get/guessfilm/',
					method: 'GET',
					success: res => {
						//获取用户关注过的电影id
						var filmIdString = uni.getStorageSync('INTEREST_FILM_ID')
						var filmIdList = filmIdString.split(',')
						
						for(var k in res.data){
							res.data[k].cover = this.mediaServer + res.data[k].cover;
							// res.data[k].trailer = this.mediaServer + res.data[k].trailer;
							// for(var j in res.data[k].poster){
							// 	res.data[k].poster[j].poster = this.mediaServer + res.data[k].poster[j].poster;
							// }
							
							// 为当前影片添加“是否收藏”信息
							if(filmIdList.indexOf(res.data[k].id.toString()) > -1) {
								res.data[k].isInterest = true
							}else{
								res.data[k].isInterest = false
							}
							
						}
						this.guessFilmList = res.data
						console.log("猜你喜欢对象：")
						console.log(this.guessFilmList)
						
						
					},
					fail: (e) => {
						console.log(e);
					},
					
				});
			},
			
			// 用户添加收藏电影
			myInterest(movieId) {				
				uni.showToast({title:"已收藏",icon:'none'});
				
				//获取用户收藏过的电影id
				var filmIdString = uni.getStorageSync('INTEREST_FILM_ID')
				var filmIdList = filmIdString.split(',')
				
				// 将收藏的电影同步到缓存
				filmIdList.push(movieId)
				uni.setStorageSync('INTEREST_FILM_ID', filmIdList + '');
				
				// 将收藏的电影同步到后端
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
						movie_id: movieId,
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
			//取消收藏电影
			nomoralInterest(movieId) {
				uni.showToast({title:"已取消收藏",icon:'none'});
				
				//获取用户收藏过的电影id
				var filmIdString = uni.getStorageSync('INTEREST_FILM_ID')
				var filmIdList = filmIdString.split(',')
				
				// 去掉收藏的电影id
				var filmIdList = this.deleteByValue(filmIdList, movieId)
				// 同步到缓存
				uni.setStorageSync('INTEREST_FILM_ID', filmIdList + '');
				
				// 同步到后端
				var user_id = uni.getStorageSync('USER_ID')
				var auth_token = uni.getStorageSync('AUTH_TOKEN')
				uni.request({
					url: this.apiServer + 'api/v1/interest_movie/?user_id=' + user_id + '&movie_id=' + movieId,
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
				//判断是上下移动还是左右移动
				if (Math.abs(tx) > Math.abs(ty)) {
					//判断移动距离是否大于30
					if(Math.abs(tx) > 30){
						//判断具体是左是右
						if (tx < 0) {
							// text = '向左滑动';
							this.flag = 1;
							console.log('向左滑动')
							uni.switchTab({
								url: '../search/search'
							})
						 // this.getList();  //调用列表的方法
						} else if (tx > 0) {
							// text = '向右滑动';
							this.flag = 2;
							console.log('向右滑动')
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
			
		},
		
		components:{
			scoreComp
		},
	}
</script>

<style>
	@import url("index.css");
</style>
