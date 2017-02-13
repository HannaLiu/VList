<template>
	<div id="book" class="container">
		<div class="container-fluid form-inline m_t_m">
			<div class="text-right">				
				<span class="message">{{msg}}</span>
				<input type="text" class="form-control search_input" placeholder="请输入书名关键字" v-model="bookname" @focus="clearMsg" @keyup.13="searchBook" />
				<button type="button" class="btn btn-default" value="查找图书" @click="searchBook" ><i class="fa fa-search"></i></button>	
			</div>
		</div>
		<ul>
			<li v-for="(book,index) in books" class="col-xs-3 col-md-2 list_li">
				<div class="img_main"><img v-bind:src="book.images.small" class="img-thumbnail"/></div>
				<p class="title">{{book.title}}</p>
				<input type="button" class="btn btn-default" value="我要看" @click="addtolist(index)" />
			</li>
		</ul>
	</div>
</template>

<script>
	import store from '../store/store-global'
	import storelist from '../data/storelist'
	import storebook from '../data/storebook'
	import storeCurr from '../data/storeusercurr'
	import findel from '../modules/findElem'
	export default {
		name: 'book',
		data() {
			return {
				bookname: "",
				msg: "",
				books: storebook.fetch(),
				lists: storelist.fetch()
			};
		},
		mounted: function() {
			console.log("书籍页：当前是否已登录:" + (store.state.isLogin ? " 是 " : " 否 ") + " ,当前id为 " + store.state.cid)
		},
		watch: {
			lists: {
				handler: function(lists) {
					storelist.save(lists)
				},
				deep: true
			}
		},
		methods: {
			searchBook: function() {
				if(this.bookname.trim() == "") {
					this.msg = "请输入书名关键字"
					return;
				}
				this.$http.jsonp('https://api.douban.com/v2/book/search', {
					params: {
						q: this.bookname,
						count: 10
					}
				}).then(function(response) {
					this.books = response.data.books
					storebook.save(this.books)
				}, function(response) {
					console.log(response)
				})
			},
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
				var existlist = findel.findElem(currlist, "plan", this.books[index].title);
				if(existlist != -1) {
					alert("已结在列表中")
					return
				}
				this.lists.push({
					id: store.state.cid,
					plan: this.books[index].title,
					isfinished: false
				})
				alert("添加成功")
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