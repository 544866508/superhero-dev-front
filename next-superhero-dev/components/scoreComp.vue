<!-- 组件说明 -->
<!-- 传入一个score，展示评分和星星 -->

<template name="scoreComp">
	<view class="movie-score-wapper">
		<!-- 黄色星星数量 -->
		<image 
			v-for="(item, index) in starNum" :key="index"
			src="../static/icos/star-yellow.png" 
			class="star-ico">
		</image>
		<!-- 灰色星星数量 -->
		<image
			v-for="(item, index) in (5-starNum)" :key="index"
			src="../static/icos/star-gray.png" 
			class="star-ico">
		</image>
		<!-- 评分 -->
		<view class="movie-score">
			{{ score }}
		</view>
	</view>
</template>

<script>
	export default {
		
		//定义组件的名称scoreComp
		name: "scoreComp",
		
		data() {
			return {
				starNum: 0	//星星数量
			};
		},
		
		//定义组件内部使用的属性
		props: {
			//自定义一个变量，接受父组件传入的参数值
			score: 0,
		},
		
		//生命周期函数，组件创建完成后被调用
		created() {
			this.starNum = parseInt(this.score / 2);
		}
	}
</script>

<style>
	.movie-score-wapper {
		display: flex;
		flex-direction: row;
	}
	.star-ico {
		width: 25upx;
		height: 25upx;
		margin-left: 6upx;
		margin-top: 6upx;
	}
	.movie-score {
		font-size: 12px;
		color: grey;
		margin-left: 8upx;
	}
</style>
