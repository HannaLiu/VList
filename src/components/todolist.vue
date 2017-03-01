<template>

	<div id="todolist" class="container">
		<div>
			<div class="btn-group m_t_m" role="group">
				<button type="button" class="btn btn-default" @click="showAllLists" v-bind:class="{'btn-success':isActive}">全部</button>
				<button type="button" class="btn btn-default" v-for="(typeList,index) in typeLists" v-bind:class="{'btn-success':isIndex==index?true:false}" @click="showCurrList(index)">{{typeList}}</button>
				<button type="button" class="btn btn-default" @click="showAddTypeModal"><i class="fa fa-plus"></button>
				<button type="button" class="btn btn-default" @click="manageList"><i class="fa fa-gear"></button>
			</div>
			<span class="message">{{msg}}</span>
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
							<input type="text" class="form-control" placeholder="请输入分类的名称" v-model="newType" @keyup.13="addNewType">
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-default" @click="showInListType=false">取消</button>
							<button type="button" class="btn btn-primary" @click="addNewType">确定</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div>
			<div>
				<div class="input-group m_t_s m_b_s">
					<span class="input-group-btn">
    					<button class="btn btn-default btn-lg" type="button" @click="addItem">+</button>
  					</span>
					<input type="text" class="form-control input-lg" placeholder="添加计划..." v-model="newItem" @keyup.13="addItem" @focus="checkLogin" @blur="clearMsg">
				</div>
			</div>
			<div class="task-list">
				<ul>
					<li v-for="item in items" class="plan_list" :class="{finished:item.isfinished}" v-if="!item.isfinished" @oncontextmenu="showLeft=true">
						<label><input type="checkbox" @click="toggleFinished" v-model="item.isfinished"/><span>{{item.plan}}</span></label>
					</li>
				</ul>
			</div>
			<div class="task-list">
				<button class="btn btn-success m_t_s" @click="toggleFinishedList" v-if="!showFinishedList">收起已完成任务</button>
				<button class="btn btn-success m_t_s" @click="toggleFinishedList" v-else>显示已完成任务</button>
				<transition name="fade" v-if="!showFinishedList">
					<ul>
						<li>
							<h5 v-if="showDefault()">暂无完成任务</h5>
							<h5 v-else>以下为完成任务</h5>
						</li>
						<li v-for="item in items" class="plan_list plan_list_done" :class="{finished:item.isfinished}" v-if="item.isfinished">
							<label><input type="checkbox" @click="toggleFinished" v-model="item.isfinished"/><span class="line-through">{{item.plan}}</span></label>
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
				typeLists: [],
				currIndex: "",
				isIndex: -1,
				showInListType: false,
				showLeft: false,
				newType: "",
				mainItems: []
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
			//当前页三个数组，1是直接读取缓存的全部数据，2是当前用户的所有计划，3是当前用户不为空的计划（空的是新建分类时加入的）			
			//获取当前登录用户的清单列表
			this.allitems.forEach(
				(item) => {
					if(item.id == store.state.cid) {
						//计划不为空的计划，显示在列表中的计划
						if(item.plan.trim() != "") {
							this.items.push(item);
						}
						//该用户所有的计划
						this.mainItems.push(item);						
					}
				}
			);
			//获取当前登录用户的清单列表中的分类（不管该分类是否有内容）
			this.mainItems.forEach(
				(item) => {
					if(this.typeLists.indexOf(item.subtype) < 0) {
						this.typeLists.push(item.subtype)
					}
				}
			);
			console.log("清单：当前是否已登录:" + (store.state.isLogin ? " 是 " : " 否 ") + " ,当前id为 " + store.state.cid)
		},
		methods: {
			showAddTypeModal: function() {
				if(!store.state.cid) {
					this.msg = "请先登录"
				}
				this.showInListType = true
			},
			manageList: function() {
				if(!store.state.cid) {
					this.msg = "请先登录"
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
				this.mainItems=[]
				this.allitems.forEach(
					(item) => {
						if(item.id == store.state.cid) {
							//计划不为空的计划，显示在列表中的
							if(item.plan.trim() != "") {
								this.items.push(item);
								console.log(this.items)
							}
							//所有的列表
							this.mainItems.push(item);
						}
					}
				);
			},
			//获取当前登录用户的清单列表中的分类
			getTypeLists: function() {
				this.typeLists = []
				this.mainItems.forEach(
					(item) => {
						if(this.typeLists.indexOf(item.subtype) < 0) {
							this.typeLists.push(item.subtype)
						}
					}
				);
			},
			//获取当前登录用户的清单列表中的其他分类
			getOtherLists: function() {
				this.getCurrItems()
				this.items = []
				this.mainItems.forEach(
					(item) => {
						if(item.subtype == this.currIndex && item.plan.trim() != ""){
							this.items.push(item);
						}
					}
				);
			},
			//点击全部按钮
			showAllLists: function() {
				if(!store.state.cid) {
					this.msg = "请先登录"
					return;
				}
				this.isActive = true;
				this.isIndex = -1;
				this.getCurrItems();
				this.getTypeLists();
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
					this.msg = "请先登录"
					return;
				}
				this.allitems.push({
					id: store.state.cid,
					plan: this.newItem,
					subtype: this.isActive ? "未分类" : this.currIndex,
					isfinished: false
				})
				this.getCurrItems();
				this.getTypeLists();
				this.isActive ? this.getTypeLists() : this.getOtherLists();
				this.newItem = ""
			},
			addNewType: function() {
				if(!store.state.cid) {
					this.msg = "请先登录"
					return;
				}
				if(this.newType.trim() == "") {
					return;
				}
				this.allitems.push({
					id: store.state.cid,
					plan: "",
					subtype: this.newType,
					isfinished: false
				})
				this.getCurrItems();
				this.getTypeLists();
				this.isActive ? this.getTypeLists() : this.getOtherLists();
				this.newType = ""		
				this.showInListType = false
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
	label{margin-bottom: 0;}
	
	input[type=checkbox] {
		margin-right: 10px;
		vertical-align: baseline;
	}
</style>