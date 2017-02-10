<template>
	<div id="login">
		<div>
			<input type="text" name="" id="" value="" placeholder="请输入您的名字" v-model="name" v-on:focus="clearMsg" @keyup.13="login"/>
			<input type="password" name="" id="" value="" placeholder="请输入您的密码" v-model="pwd" v-on:focus="clearMsg" @keyup.13="login"/>
			<span class="message">{{msg}}</span>
			<input type="button" name="" id="" value="登录" @click="login"/>			
		</div>
	</div>
</template>

<script>
	import storeuser from '../storeuser'
	import md5 from 'md5'
	import findel from '../findElem'

	export default {
		name: 'todolist',
		data() {
			return {
				name:"",
				pwd:"",
				msg:"",
				cid:"",
				users: storeuser.fetch()				
			};
		},
		methods:{			
			login:function(){
				if(this.name.trim() == "") {
					this.msg="请输入用户名"
					return;
				}
				if(this.pwd.trim() == "") {
					this.msg="请输入密码"
					return;
				}
				var exist=findel.findElem(this.users,"name",this.name);
				var existpwd=findel.findElem(this.users,"pwd",md5(this.pwd));
				if(exist == -1 || existpwd == -1){
					this.msg="用户名或密码错误"
					return;
				}
				if(exist!=-1 && existpwd!=-1){
					alert("登录成功")
				}
				this.cid=this.users[exist]["id"];
				console.log(this.cid)				
				this.name="";
				this.pwd="";	
			},
			clearMsg:function(){
				this.msg=""
			}
		}
	}
</script>

<style scoped>

</style>
