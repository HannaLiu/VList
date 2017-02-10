<template>
	<div id="movie">
		<ul class="movieList">
			<li v-for="(movie,index) in movies" >
				<img v-bind:src="movie.images.small" />
				<p class="title">{{movie.title}}</p>
				<input type="button" value="加入清单" @click="addtolist(index)"/>
			</li>
		</ul>
	</div>
</template>

<script>
	import storemovie from '../storemovie'
	import storelist from '../storelist'
	import store from '../../modules/store-global'
	export default {
		name: 'movie',
		data() {
			return {
				title:"",
				movies: storemovie.fetch(),
				lists:storelist.fetch()
			};
		},
		watch: {
			lists: {
				handler: function(lists) {
					storelist.save(lists)
				},
				deep: true				
			}
		},
		mounted:function(){
			console.log("当前是否已登录:"+ (store.state.isLogin?" 是 ":" 否 ") +" ,当前id为 "+store.state.cid)

			this.$http.jsonp('https://api.douban.com/v2/movie/top250?count=10',{},{
				headers:{	
				},
				emulateJSON:true
			}).then(function(response){				
				this.movies = response.data.subjects				
				storemovie.save(this.movies)
			},function(response){
				console.log(response)
			})
		},
		methods:{
			addtolist:function(index){				
				if(!store.state.cid){
					alert("请先登录")	//此处为显示登录框
					return
				}
				
				
//				var exist = findel.findElem(this.lists, "plan", this.movies[index].title);
//				
//				
				
				this.lists.push({
					id:store.state.cid,
					plan: this.movies[index].title,
					isfinished: false
				})
			}
		}
	}
</script>


<style scoped>

	li{display: inline-block;border: 1px solid #ccc;width:100px;padding:15px 10px;text-align:center;margin: 20px;}
	.title{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
</style>