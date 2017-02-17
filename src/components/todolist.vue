<template>
	<div id="todolist" class="container">
		<div>
			<div>
				<div class="btn-group m_t_m" role="group" @click="tabList">
					<button type="button" class="btn btn-default">全部</button>
					<button type="button" class="btn btn-default" v-for="(typeList,index) in typeLists" @click="showCurrList">{{typeList}}</button>
				</div>				
			</div>
			<div>
				<div>
					<div class="input-group m_t_s">
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
				currType: "自定义",
				typeLists: []
			};
		},
		watch: {
			allitems: {
				handler: function(allitems) {
					storelist.save(allitems)
				},
				deep: true
			}
		},
		mounted: function() {
			//获取当前登录用户的清单列表
			this.allitems.forEach(
				(item) => {
					if(item.id == store.state.cid) {
						this.items.push(item);
					}
				}
			);
			//获取当前登录用户的清单列表中的分类
			this.items.forEach(
				(item) => {
					if(this.typeLists.indexOf(item.subtype) < 0) {
						this.typeLists.push(item.subtype)
					}
				}
			);
			console.log("清单：当前是否已登录:" + (store.state.isLogin ? " 是 " : " 否 ") + " ,当前id为 " + store.state.cid)
		},
		methods: {
			getCurrItems: function() {
				this.items=[]
				this.allitems.forEach(
					(item) => {
						if(item.id == store.state.cid) {
							this.items.push(item);
						}
					}
				);
			},
			getTypeLists: function() {
				this.typeLists=[]
				this.items.forEach(
					(item) => {
						if(this.typeLists.indexOf(item.subtype) < 0) {
							this.typeLists.push(item.subtype)
						}
					}
				);
			},
			tabList: function() {
				if(!store.state.cid) {
					alert("请先登录")
					return;
				}
			},
			showCurrList:function(){
				
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
				this.getCurrItems();
				this.getTypeLists();
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