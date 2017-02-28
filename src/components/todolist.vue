<template>

	<div id="todolist" class="container">
		<div>
			<div class="btn-group m_t_m" role="group">
				<button type="button" class="btn btn-default" @click="showAllLists" v-bind:class="{'btn-success':isActive}">全部</button>
				<!--<button type="button" class="btn btn-default" v-for="(typeList,index) in typeLists" v-bind:class="{'btn-success':isIndex==index?true:false}" @click="showCurrList(index)">{{typeList}}</button>-->
				<button type="button" class="btn btn-default" @click="showInListType=true"><i class="fa fa-plus"></button>
				<button type="button" class="btn btn-default" @click="manageList"><i class="fa fa-gear"></button>
			</div>
		</div>
		<div v-if="showInListType">
			<div class="model">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" @click="showInListType=false">&times;</span></button>
							<h4 class="modal-title">为新增的分类取个名字</h4>
						</div>
						<div class="modal-body">
							<input type="text" class="form-control" placeholder="请输入分类的名称" v-model="newItem" @keyup.13="addItem" @focus="checkLogin" @blur="clearMsg">
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-default" @click="showInListType=false">取消</button>
							<button type="button" class="btn btn-primary" @click="addNewType()">确定</button>
						</div>
					</div>
				</div>
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
					<li v-for="item in items" :class="{finished:item.isfinished}" v-if="!item.isfinished" @oncontextmenu="showLeft=true">
						<label><input type="checkbox" @click="toggleFinished" v-model="item.isfinished"/><span>{{item.plan}}</span></label>
					</li>
				</ul>
			</div>
			<div class="task-list">
				<button class="btn btn-success" @click="toggleFinishedList" v-if="!showFinishedList">收起已完成任务</button>
				<button class="btn btn-success" @click="toggleFinishedList" v-else>显示已完成任务</button>
				<transition name="fade" v-if="!showFinishedList">
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
		<!--<input type="button" @click="showLeft=true" />
		<aside :show.sync="showLeft" placement="left" header="Title" width="350">
			pp
		</aside>-->
	</div>
</template>

<script>
	import storelist from '../data/storelist'
	import findel from '../modules/findElem'
	import store from '../store/store-global'
	import aside from 'vue-strap'

	export default {
		name: 'todolist',
		data() {
			return {
				allitems: storelist.fetch(),
				newItem: "",
				name: "",
				id: "",
				msg: "",
				isActive: true,
				showFinishedList: false,
				items: [],
				//				currType:0,
				typeLists: [],
				currIndex: "",
				isIndex: -1,
				showInListType: false,
				showLeft:false
			};
		},
		components: {
			aside
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
			addNewType: function() {
				showInListType = false

			},
			manageList: function() {
				if(!store.state.cid) {
					alert("请先登录")
					return;
				}
				this.$router.push({
					path: '/manage',
					redirect: to => {
						manage
					}
				})
			},
			//获取当前登录用户的清单列表
			getCurrItems: function() {
				this.items = []
				this.allitems.forEach(
					(item) => {
						if(item.id == store.state.cid) {
							this.items.push(item);
						}
					}
				);
			},
			//获取当前登录用户的清单列表中的分类
			getTypeLists: function() {
				this.typeLists = []
				this.items.forEach(
					(item) => {
						if(this.typeLists.indexOf(item.subtype) < 0) {
							this.typeLists.push(item.subtype)
						}
					}
				);
			},
			//获取当前登录用户的清单列表中的所有分类
			getAllLists: function() {
				this.getCurrItems()
			},
			//获取当前登录用户的清单列表中的其他分类
			getOtherLists: function() {
				this.getCurrItems()
				this.items = []
				this.allitems.forEach(
					(item) => {
						if(item.subtype == this.currIndex) {
							this.items.push(item);
						}
					}
				);
			},
			//点击全部按钮
			showAllLists: function() {
				if(!store.state.cid) {
					alert("请先登录")
					return;
				}
				this.isActive = true;
				this.isIndex = -1;
				this.getCurrItems();
				this.getAllLists();
			},
			//点击除“全部”按钮之外的按钮，显示该类别下的清单
			showCurrList: function(index) {
				this.currIndex = this.typeLists[index];
				this.isActive = false;
				this.isIndex = index;
				this.getCurrItems();
				this.getOtherLists();
			},
			//切换清单的完成状况
			toggleFinished: function(item) {
				item.isfinished = !item.isfinished
			},
			//切换显示已完成清单
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
					//					subtype: this.isActive ? this.currType : this.currIndex,
					isfinished: false
				})
				this.getCurrItems();
				this.getTypeLists();
				//				this.isActive ? this.getAllLists() : this.getOtherLists();
				this.newItem = ""
			}
		}
	}
</script>

<style scoped>
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