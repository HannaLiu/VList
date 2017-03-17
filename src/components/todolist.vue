<template>

	<div id="todolist" class="container">
		<div class="form_main">
			<div>
				<div class="btn-group m_t_m typeBtn" role="group">
					<button type="button" class="btn btn-default" @click="showAllLists" v-bind:class="{'btn-success':isActive}">全部</button>
					<button type="button" class="btn btn-default" v-for="(typeList,index) in typeLists" v-bind:class="{'btn-success':isIndex==index?true:false}" @click="showCurrList(index)">{{typeList}}</button>
					<button type="button" class="btn btn-default" @click="showAddTypeModal"><i class="fa fa-plus"></button>
					<!--<button type="button" class="btn btn-default" @click="manageList"><i class="fa fa-gear"></button>-->
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
								<button type="button" class="btn btn-success" @click="addNewType">确定</button>
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
						<li v-for="(item,index) in items" class="plan_list" :class="[{finished:item.isfinished},{'active':selectedIndex==index?true:false}]" v-if="!item.isfinished" @dblclick="showEdit(item)">
							<div class="labelforlist">
								<label class="checkboxInput"><input type="checkbox" @click="toggleFinished" v-model="item.isfinished"/></label>
								<span class="item_plan" @click="addActive(index)">{{item.plan}}</span>
							</div>
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
							<li v-for="(item,index) in items" class="plan_list plan_list_done" :class="[{finished:item.isfinished},{'active':selectedIndex==index?true:false}]" v-if="item.isfinished" @dblclick="showEdit(item)">
								<div class="labelforlist">
									<label class="checkboxInput"><input type="checkbox" class="nochecked" @click="toggleFinished" v-model="item.isfinished"/></label>
									<span class="item_plan line-through" @click="addActive(index)">{{item.plan}}</span>
								</div>
							</li>
						</ul>
					</transition>
				</div>
			</div>
			<transition name="slide-fade">
				<div class="fixedEdit" v-if="isShowEdit">
					<i class="fa fa-angle-double-right arrow" @click="hideEdit"></i>
					<i class="fa fa-trash delete" @click="showDeleteConfirm=true"></i>
					<div class="labelforlist m_t_m editMain clearfix">
						<label class="checkboxInput float_l">
						<input type="checkbox" :class="{'nochecked':item.isfinished}" v-model="item.isfinished"/>
					</label>
						<div class="col-xs-11">
							<!--此处用div模拟textarea-->
							<!--<div class="divtextarea"  contenteditable="true">
							{{item.plan}}
						</div>-->
							<textarea tabindex="0" class="form-control editText" v-model="item.plan" @blur="checkEmpty()"></textarea>
						</div>
						<!--此处修改当前清单的type-->
						<!--<p>分类：{{item.subtype}}</p>
					<select>
					  <option v-for="(type,index) in typeLists">{{typeLists[index]}}</option>
					</select>-->
					</div>
				</div>
			</transition>
			<transition name="slide-fade">
				<div class="fixedEdit" v-if="isShowEditType">
					<i class="fa fa-angle-double-right arrow" @click="hideEditType"></i>
					<div class="m_t_s" v-for="(type,index) in typeLists">
						<div class="col-xs-11">
							<input type="text" class="form-control" v-model="typeLists[index]" @blur="checkEmptyType(index)" />
						</div>
						<i class="fa fa-trash" @click="showEditTypeConfirm=true"></i>
					</div>
				</div>
			</transition>
			<div v-if="showDeleteConfirm">
				<div class="model text-center">
					<div class="modal-dialog modal-sm">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" @click="showInListType=false">&times;</span></button>
								<h4 class="modal-title">确定删除吗</h4>
							</div>
							<div class="modal-body">
								<button type="button" class="btn btn-default" @click="showDeleteConfirm=false">取消</button>
								<button type="button" class="btn btn-primary" @click="deleteList">确定</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div v-if="showEditTypeConfirm">
				<div class="model text-center">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" @click="showInListType=false">&times;</span></button>
								<h4 class="modal-title">确定删除该分类吗</h4>
							</div>
							<div class="modal-body">
								<button type="button" class="btn btn-danger" @click="deleteTypePlan">删除该类及该类下的计划</button>
								<button type="button" class="btn btn-primary" @click="deleteType">只删除该类，不删除该类下的计划</button>
								<button type="button" class="btn btn-default" @click="showEditTypeConfirm=false">取消删除</button>
							</div>
						</div>
					</div>
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
				isActive: true,
				showFinishedList: false,
				items: [],
				typeLists: [],
				currIndex: "",
				isIndex: -1,
				showInListType: false,
				isShowEdit: false,
				newType: "",
				mainItems: [],
				selectedIndex: -1,
				showDeleteConfirm: false,
				isShowEditType: false,
				showEditTypeConfirm: false
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
			//当前页三个数组，1是直接读取缓存的全部数据(allitems)，2是当前用户的所有计划(mainItems)，3是当前用户不为空的计划(items)（空的是新建分类时加入的）			
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
		},
		methods: {
			showAddTypeModal: function() {
				if(!store.state.cid) {
					this.msg = "请先登录"
					return
				}
				this.showInListType = true
			},
			manageList: function() {
				if(!store.state.cid) {
					this.msg = "请先登录"
					return;
				}
				console.log(this.typeLists.length)
				if(this.typeLists.length < 1) {
					alert("暂无分类可以管理，请先新建分类")
					return
				}
				this.isShowEditType = true
			},
			//获取当前登录用户的清单列表
			getCurrItems: function() {
				this.items = []
				this.mainItems = []
				this.allitems.forEach(
					(item) => {
						if(item.id == store.state.cid) {
							//计划不为空的计划，显示在列表中的
							if(item.plan.trim() != "") {
								this.items.push(item);
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
						if(item.subtype == this.currIndex && item.plan.trim() != "") {
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
			//点击一个计划，变为选中的样式
			addActive: function(index) {
				this.selectedIndex = index;
			},
			//双击计划列表
			showEdit: function(item) {
				this.isShowEdit = false;
				this.item = item;
				this.editItem = this.item
				this.isShowEdit = true;
			},
			hideEdit: function(item) {
				if(this.item.plan.trim() == "") {
					this.showDeleteConfirm = true
				} else {
					this.isShowEdit = false;
				}
			},
			hideEditType: function() {
				this.isShowEditType = false;
			},
			checkEmpty: function(editItem) {
				if(this.item.plan.trim() == "") {
					this.showDeleteConfirm = true
				}
			},
			checkEmptyType: function(index) {
				this.editTypeIndex = index
				if(this.typeLists[index].trim() == "") {
					this.showEditTypeConfirm = true
				}
			},
			deleteList: function() {
				this.showDeleteConfirm = false
				this.isShowEdit = false
				this.item.type = ""
				this.item.plan = ""
				this.getCurrItems()
				this.isActive ? this.getTypeLists() : this.getOtherLists();
			},
			deleteType: function() {
				this.showEditTypeConfirm = false
				this.isShowEditType = false
				//删除一个type,分两种情况，1是原type下的plan不删除，放到未分类一组；2是该type下的plan也全部删除,此处为1
			},
			deleteTypePlan: function() {
				this.showEditTypeConfirm = false
				this.isShowEditType = false
				//2.该type下的plan也全部删除
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

</style>