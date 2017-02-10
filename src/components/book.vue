<template>
	<div id="book">
		<input type="text" v-model="bookname" @focus="clearMsg"/>
		<span>{{msg}}</span>
		<input type="button" class="btn btn-default" value="查找图书" @click="searchBook"/>
		<ul>
			<li v-for="book in books">
				<img v-bind:src="book.images.small" />
				<p class="title">{{book.title}}</p>
				<input type="button" value="加入清单"/>
			</li>
		</ul>
	</div>
</template>

<script>
	import storebook from '../storebook'
	export default {
		name: 'book',
		data() {
			return {
				bookname:"",
				msg:"",
				books:storebook.fetch()
			};
		},
		methods:{
			searchBook:function(){
				console.log(this.bookname)
				if(this.bookname.trim() == "") {
					this.msg="请输入书名关键字"
					return;
				}
				this.$http.jsonp('https://api.douban.com/v2/book/search',
					{
			        params: {
			          q:this.bookname,
			          count:10
			        }
			      }).then(function(response){				
					this.books = response.data.books	
					storebook.save(this.books)
				},function(response){
					console.log(response)
				})
			},
			clearMsg:function(){
				this.msg=""
			}
		}
	}
</script>


<style scoped>

	li{display: inline-block;border: 1px solid #ccc;width:100px;padding:15px 10px;text-align:center;margin: 20px;}
	.title{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
</style>