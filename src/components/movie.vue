<template>
	<div id="movie" class="container">
		<div class="input-group m_t_m">
			<input type="text" class="form-control" placeholder="请输入电影关键字" v-model="moviename" @focus="clearMsg" @keyup.13="searchMovie">
			<span class="input-group-btn">
    			<button class="btn btn-default" type="button" @click="searchMovie"><i class="fa fa-search"></i></button>
			</span>
		</div>
		<span class="message">{{msg}}</span>
		<div class="row">
			<div class="col-xs-6 col-sm-4 col-md-2" v-for="(movie,index) in movies">
				<div class="thumbnail text-center">
					<div class="list-img"><img v-bind:src="movie.images.medium" v-bind:alt="movie.title"></div>
					<div class="caption">
						<p class="title">{{movie.title}}</p>
						<p>
							<input type="button" value="我要看" class="btn btn-default" @click="addtolist(index)" />
							<!--<input type="button" value="移出" class="btn btn-default" @click="deletelist(index)" v-else/>-->
						</p>
					</div>
				</div>
			</div>
		</div>
		<!--<ul class="pagination" v-if="!hasList">
			<li v-show="current != 1" @click="current-- && goto(current)">
				<a href="#">上一页</a>
			</li>
			<li v-for="index in pages" @click="goto(index)" :class="{'active':current == index}" :key="index">
				<a href="#">{{index}}</a>
			</li>
			<li v-show="allpage != current && allpage != 0 " @click="current++ && goto(current++)">
				<a href="#">下一页</a>
			</li>
		</ul>-->
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
				moviename: "",
				movies: storemovie.fetch(),
				lists: storelist.fetch(),
				items: [],
				current: 1,
				showItem: 5,
				allpage: 13,
				hasList:false
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
		computed: {
//			pages: function() {
//				var pag = [];
//				if(this.current < this.showItem) { //如果当前的激活的项 小于要显示的条数
//					//总页数和要显示的条数那个大就显示多少条
//					var i = Math.min(this.showItem, this.allpage);
//					while(i) {
//						pag.unshift(i--);
//					}
//				} else { //当前页数大于显示页数了
//					var middle = this.current - Math.floor(this.showItem / 2), //从哪里开始
//						i = this.showItem;
//					if(middle > (this.allpage - this.showItem)) {
//						middle = (this.allpage - this.showItem) + 1
//					}
//					while(i--) {
//						pag.push(middle++);
//					}
//				}
//				return pag
//			}
		},
		mounted: function() {
			console.log("电影页：当前是否已登录:" + (store.state.isLogin ? " 是 " : " 否 ") + " ,当前id为 " + store.state.cid)
			//			this.$http.jsonp('https://api.douban.com/v2/movie/top250?count=10').then(function(response) {
			//				this.movies = response.data.subjects
			//				storemovie.save(this.movies)
			//			}, function(response) {
			//				console.log(response)
			//			})
			
			if(!this.movies){
				this.hasList=false
			}
		},
		methods: {			
//			goto: function(index) {
//				if(index == this.current) return;
//				this.current = index;
//				//这里可以发送ajax请求
//			},
			addtolist: function(index) {
				if(!store.state.cid) {
					alert("请先登录") //此处为显示登录框
					return
				}
				var currlist = [] //当前用户的清单列表
				this.lists.forEach(
					(list) => {
						if(list.id == store.state.cid) {
							currlist.push(list)
						}
					}
				);
				//判断所选是否已经在清单中
				var existlist = findel.findElem(currlist, "plan", this.movies[index].title);
				if(existlist != -1) {
					alert("已经在列表中")
					return
				}
				//将当前选中内容添加到清单列表
				this.lists.push({
					id: store.state.cid,
					plan: this.movies[index].title,
					subtype: "电影",
					isfinished: false
				})
				alert("添加成功")
			},
			deletelist: function() {
				//从清单中删除该条
			},
			getData:function(){
				this.$http.jsonp('https://api.douban.com/v2/movie/search', {
					params: {
						q: this.moviename,
						count: 12
					}
				}).then(function(response) {
					this.movies = response.data.subjects
					storemovie.save(this.movies)
				}, function(response) {
					console.log(response)
				})
			},
			searchMovie: function() {
				if(this.moviename.trim() == "") {
					this.msg = "请输入电影关键字"
					return;
				}
				this.getData()
			},
			clearMsg: function() {
				this.msg = ""
			}
		}
	}
</script>

<style scoped>

</style>