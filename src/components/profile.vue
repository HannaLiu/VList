<template>
	<div id="profile" class="clearfix">
		<form class="form-horizontal m_t_m col-sm-8 col-sm-push-2 ">
		  <div class="form-group">
		    <label class="col-sm-2 control-label">用户名：</label>
		    <div class="col-sm-10">
		      <p class="form-control-static">{{name}}</p>
		    </div>
		  </div>
		   <div class="form-group">
		    <label class="col-sm-2 control-label">手机号：</label>
		    <div class="col-sm-10">
		      <input type="tel" class="form-control" id="inputTel" placeholder="电话号码" v-model="tel">		 
		    </div>
		  </div>
		   <div class="form-group">
		    <label class="col-sm-2 control-label">邮　箱：</label>
		    <div class="col-sm-10">
		    	 <input type="email" class="form-control" id="inputEmail" placeholder="邮箱" v-model="email">	
		    </div>
		  </div>
		  <div class="form-group">
		    <label for="inputPassword" class="col-sm-2 control-label">密　码：</label>
		    <div class="col-sm-10">
		      <input type="password" class="form-control" id="inputPassword" placeholder="确认密码">
		    </div>
		  </div>
		  <span>{{msg}}</span>
		  <div class="text-center m_t_m"><button class="btn btn-success" @click="modify">保存</button></div>
		</form>
	</div>
</template>

<script>
	import store from '../store/store-global'
	import storeuser from '../data/storeuser'
	
	export default {
		name: 'profile',
		data() {
			return {
				users: storeuser.fetch(),
				name:store.state.cname,
				tel:storeuser.tel,
				email:storeuser.email,
				msg:""
			};
		},
		watch: {
			users: {
				handler: function(users) {
					storeuser.save(users)
				},
				deep: true
			}
		},
		mounted:function(){
			console.log(this.users)
		},
		methods: {			
			modify:function(){
				if(this.tel.trim()=="" && this.email.trim()==""){
					this.msg="您没有修改"
				}
			}
		}
		
	}
</script>

<style scoped>
	
</style>