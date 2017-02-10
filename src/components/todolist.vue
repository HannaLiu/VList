<template>
	<div id="todolist">		
		<div id="tasks">
			<p v-bind:id="id"></p>
			<div id="list-toolbar">
				<h1 class="title">待完成</h1>
			</div>
			<div id="tasks-scroll">
				<div class="addTask">
					<span><i class="fa fa-plus"></i></span><input type="text" v-model="newItem" @keyup.13="addItem" />
				</div>
				<div class="task-list">
					<ul>
						<li v-for="item in items" :class="{finished:item.isfinished}" v-if="!item.isfinished" @dbclick="">
							<label><input type="checkbox" @click="toggleFinished" v-model="item.isfinished"/></label>
							<span>{{item.plan}}</span>
						</li>
					</ul>
				</div>
				<div class="task-list inbox">
					<a @click="toggleFinishedList" class="showBtn">显示已完成任务</a>
					<transition name="fade" v-if="showFinishedList">										
						<ul>
							<li><p v-if="showDefault()">暂无完成任务</p></li>
							<li v-for="item in items" :class="{finished:item.isfinished}" v-if="item.isfinished"><label><input type="checkbox" @click="toggleFinished" v-model="item.isfinished"/></label>
								{{item.plan}}								
							</li>
						</ul>
					</transition>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import storelist from '../storelist'
	import findel from '../findElem'
	
	export default {
		name: 'todolist',
		data() {
			return {
				items: storelist.fetch(),
				newItem: "",
				name:"",
				showFinishedList: false,
				isActive: false
			};
		},
		watch: {
			items: {
				handler: function(items) {
					storelist.save(items)
				},
				deep: true
			}
		},
		props:['id'],
		methods: {
			toggleFinished:function(item){
				item.isfinished=!item.isfinished
			},
			toggleFinishedList:function(){
				this.showFinishedList=!this.showFinishedList
			},
			showDefault:function(){
				var len=findel.findElem(this.items,"isfinished",true);
				if(len<0){
					return true;
				}else{
					return false;
				}
			},
			addItem: function() {
				if(this.newItem.trim() == "") {
					return;
				}
				this.items.push({
					id:this.id,
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
</style>