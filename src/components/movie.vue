<template>
	<div id="movie">
		<ul class="movieList">
			<li v-for="movie in movies">
				<img v-bind:src="movie.images.small" />
				<p class="title">{{movie.title}}</p>
				<input type="button" value="加入清单"/>
			</li>
		</ul>
	</div>
</template>

<script>
	import storemovie from '../storemovie'
	export default {
		name: 'movie',
		data() {
			return {
				movies: storemovie.fetch()
			};
		},
		mounted:function(){
			this.$http.jsonp('https://api.douban.com/v2/movie/top250?count=10',{},{
				headers:{	
				},
				emulateJSON:true
			}).then(function(response){				
				this.movies = response.data.subjects				
				storemovie.save(this.movies)
				console.log(response)
			},function(response){
				console.log(response)
			})
		}
	}
</script>


<style scoped>

	li{display: inline-block;border: 1px solid #ccc;width:100px;padding:15px 10px;text-align:center;margin: 20px;}
	.title{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
</style>