<template>
	<div id="todolist" class="container">
		<div id="tasks">
			<p v-bind:id="id"></p>
			<div id="list-toolbar">
				<h2>待完成</h2>
			</div>
			<div id="tasks-scroll">
				<div class="addTask">
					<div class="input-group">
						<span class="input-group-addon">+</span>
						<input type="text" class="form-control" v-model="newItem" @keyup.13="addItem">
					</div>
				</div>
				<div class="task-list">
					<ul>
						<li v-for="item in items" :class="{finished:item.isfinished}" v-if="!item.isfinished" @dbclick="">
							<label><input type="checkbox" @click="toggleFinished" v-model="item.isfinished"/><span>{{item.plan}}</span></label>
						</li>
					</ul>
				</div>
				<div class="task-list inbox">
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
				showFinishedList: false,
				isActive: false,
				items: []
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
			this.allitems.forEach(
				(item) => {
					if(item.id == store.state.cid) {
						this.items.push(item);
					}
				}
			);
			console.log("清单：当前是否已登录:" + (store.state.isLogin ? " 是 " : " 否 ") + " ,当前id为 " + store.state.cid)
		},
		methods: {
			toggleFinished: function(item) {
				item.isfinished = !item.isfinished
			},
			toggleFinishedList: function() {
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
			addItem: function() {
				if(this.newItem.trim() == "") {
					return;
				}
				if(!store.state.cid) {
					alert("请先登录")
					return
				}
				this.allitems.push({
					id: store.state.cid,
					plan: this.newItem,
					isfinished: false
				})
				this.items.push({
					id: store.state.cid,
					plan: this.newItem,
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