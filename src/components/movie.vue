<template>
	<div id="movie" class="container">
		<div class="container-fluid form-inline m_t_m">
			<div class="text-right">
				<span class="message">{{msg}}</span>
				<input type="text" class="form-control search_input" placeholder="请输入电影关键字" v-model="moviename" @focus="clearMsg" @keyup.13="searchMovie" />
				<button type="button" class="btn btn-default" value="查找电影" @click="searchMovie"><i class="fa fa-search"></i></button>
			</div>
		</div>
		<ul class="movieList">
			<li v-for="(movie,index) in movies" class="col-xs-3 col-md-2 list_li">
				<div class="img_main"><img v-bind:src="movie.images.small" class="img-thumbnail" /></div>
				<p class="title">{{movie.title}}</p>
				<input type="button" value="我要看" class="btn btn-default" @click="addtolist(index)" v-if="!movie.existlist" />
				<input type="button" value="移出" class="btn btn-default" @click="deletelist(index)" v-else="movie.existlist" />
			</li>
		</ul>
	</div>
</template>

<script>
	import storemovie from '../data/storemovie'
	import storelist from '../data/storelist'
	import store from '../store/store-global'
	import findel from '../modules/findElem'
	export default {
		name: 'movie',
		data() {
			return {
				title: "",
				msg: "",
				moviename:"",
				movies: storemovie.fetch(),
				lists: storelist.fetch(),
				items: []
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
		mounted: function() {
			console.log("电影页：当前是否已登录:" + (store.state.isLogin ? " 是 " : " 否 ") + " ,当前id为 " + store.state.cid)
			this.$http.jsonp('https://api.douban.com/v2/movie/top250?count=10').then(function(response) {
				this.movies = response.data.subjects
				storemovie.save(this.movies)
			}, function(response) {
				console.log(response)
			})
		},
		methods: {
			addtolist: function(index) {
				if(!store.state.cid) {
					alert("请先登录") //此处为显示登录框
					return
				}
				var currlist = []
				this.lists.forEach(
					(list) => {
						if(list.id == store.state.cid) {
							currlist.push(list)
						}
					}
				);
				var existlist = findel.findElem(currlist, "plan", this.movies[index].title);
				if(existlist != -1) {
					alert("已结在列表中")
					return
				}
				this.lists.push({
					id: store.state.cid,
					plan: this.movies[index].title,
					isfinished: false
				})
				alert("添加成功")
			},
			deletelist: function() {

			},
			searchMovie: function() {
				if(this.moviename.trim() == "") {
					this.msg = "请输入书名关键字"
					return;
				}
				this.$http.jsonp('https://api.douban.com/v2/movie/search', {
					params: {
						q: this.moviename,
						count: 10
					}
				}).then(function(response) {
					this.movies = response.data.subjects
					storemovie.save(this.movies)
				}, function(response) {
					console.log(response)
				})
			},
			clearMsg: function() {
				this.msg = ""
			}
		}
	}
</script>

<style scoped>
	.search_input{width: 300px;}
	.message{margin-right: 10px;}
</style>