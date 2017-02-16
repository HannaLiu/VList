<template>
	<div id="todolist" class="container">
		<div>
			<div>
				<div class="btn-group m_t_m" role="group"  @click="tabList">
					<button type="button" class="btn btn-default" @click="showAllList">全部</button>
					<button type="button" class="btn btn-default" @click="showMovieList">电影</button>
					<button type="button" class="btn btn-default" @click="showBookList">书籍</button>
					<button type="button" class="btn btn-default" @click="showCustomList">自定义</button>
				</div>
				<h4>待完成</h4>
			</div>
			<div>
				<div>
					<div class="input-group">
						<span class="input-group-btn">
        					<button class="btn btn-default" type="button" @click="addItem">+</button>
      					</span>
						<input type="text" class="form-control" placeholder="请添加计划" v-model="newItem" @keyup.13="addItem" @focus="checkLogin" @blur="clearMsg">
					</div>
				</div>
				<p class="message">{{msg}}</p>
				<div class="task-list">
					<ul>
						<li v-for="item in items" :class="{finished:item.isfinished}" v-if="!item.isfinished" @dbclick="">
							<label><input type="checkbox" @click="toggleFinished" v-model="item.isfinished"/><span>{{item.plan}}</span></label>
						</li>
					</ul>
				</div>
				<div class="task-list">
					<button class="btn btn-success" @click="toggleFinishedList">显示已完成任务</button>
					<transition name="fade" v-if="showFinishedList">
						<ul>
							<li>
								<h5 v-if="showDefault()">暂无完成任务</h5>
								<h5 v-else>以下为完成任务</h5>
							</li>
							<li v-for="item in items" :class="{finished:item.isfinished}" v-if="item.isfinished">
								<label><input type="checkbox" @click="toggleFinished" v-model="item.isfinished"/>{{item.plan}}</label>
							</li>
						</ul>
					</transition>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import storelist from '../data/storelist'
	import findel from '../modules/findElem'
	import store from '../store/store-global'
	export default {
		name: 'todolist',
		data() {
			return {
				allitems: storelist.fetch(),
				newItem: "",
				name: "",
				id: "",
				msg: "",
				showFinishedList: false,
				items: [],
				allLists: [],
				movieLists: [],
				bookLists: [],
				customLists: [],
				currType:"custom"

			};
		},
		watch: {
			allitems: {
				handler: function(allitems) {
					storelist.save(allitems)
					storelist.fetch()
				},
				deep: true
			}
		},
		mounted: function() {
			this.allitems.forEach(
				(item) => {
					if(item.id == store.state.cid) {
						this.items.push(item);
					}
				}
			);
			this.allitems.forEach(
				(item) => {
					if(item.id == store.state.cid) {
						this.allLists.push(item);
					}
				}
			);
			this.items.forEach(
				(item) => {
					if(item.subtype == "movie") {
						this.movieLists.push(item);
					}
				}
			);
			this.items.forEach(
				(item) => {
					if(item.subtype == "book") {
						this.bookLists.push(item);
					}
				}
			);
			this.items.forEach(
				(item) => {
					if(item.subtype == "custom") {
						this.customLists.push(item);
					}
				}
			);
			console.log("清单：当前是否已登录:" + (store.state.isLogin ? " 是 " : " 否 ") + " ,当前id为 " + store.state.cid)
		},
		methods: {
			tabList:function(){
				if(!store.state.cid) {
					alert("请先登录")
					return;
				}
			},
			showAllList: function() {
				this.items =[]
				this.allitems=storelist.fetch()
				this.allitems.forEach(
				(item) => {
					if(item.id == store.state.cid) {
						this.items.push(item);
					}
				}
			);
				this.currType="custom"
			},
			showMovieList: function() {
				this.currType="movie"
				this.items = this.movieLists
			},
			showBookList: function() {
				this.currType="book"
				this.items = this.bookLists
			},
			showCustomList: function() {
				this.currType="custom"
				this.items = this.customLists
			},
			toggleFinished: function(item) {
				item.isfinished = !item.isfinished
			},
			toggleFinishedList: function() {
				if(!store.state.cid) {
					alert("请先登录")
					return;
				}
				this.showFinishedList = !this.showFinishedList
			},
			showDefault: function() {
				var len = findel.findElem(this.items, "isfinished", true);
				if(len < 0) {
					return true;
				} else {
					return false;
				}
			},
			checkLogin: function() {
				if(!store.state.cid) {
					this.msg = "请先登录"
				}
			},
			clearMsg: function() {
				this.msg = ""
			},
			addItem: function() {
				if(this.newItem.trim() == "") {
					return;
				}
				if(!store.state.cid) {
					alert("请先登录")
					return;
				}
				
				this.allitems.push({
					id: store.state.cid,
					plan: this.newItem,
					subtype: this.currType,
					isfinished: false
				})
				this.items.push({
					id: store.state.cid,
					plan: this.newItem,
					subtype:this.currType,
					isfinished: false
				})

				this.newItem = ""
			}
		}
	}
</script>

<style scoped>
	@import '../assets/css/font-awesome/font-awesome.min.css';
	@import '../assets/css/bootstrap.min.css';
	@import "../assets/css/main.css";
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity .5s
	}
	
	.fade-enter,
	.fade-leave-active {
		opacity: 0
	}
	
	.task-list li {
		word-break: break-all;
	}
	
	.message {
		padding-top: 0px;
		padding-left: 15px;
	}
	
	.active {
		background: green;
	}
	
	ul {
		margin: 15px;
		font-size: 16px;
	}
	
	li {
		height: 30px;
	}
	
	input[type=checkbox] {
		margin-right: 10px;
	}
</style>