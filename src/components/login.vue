<template>
	<div id="login">
		<div class="model">
			<div class="form-group">
				<label>请输入您的用户名</label>
				<input type="text" class="form-control" placeholder="请输入您的用户名" v-model="name" v-on:focus="clearMsg" @keyup.13="login">
			</div>
			<div class="form-group">
				<label>请输入您的密码</label>
				<input type="password" class="form-control" placeholder="请输入您的密码" v-model="pwd" v-on:focus="clearMsg" @keyup.13="login">
			</div>
			<p class="message">{{msg}}</p>
			<div class="text-center"><button type="submit" class="btn btn-default" @click="login">登录</button></div>
		</div>
	</div>
</template>

<script>
	import storeuser from '../data/storeuser'
	import md5 from 'md5'
	import findel from '../modules/findElem'
	import store from '../store/store-global'
	import storeCurr from '../data/storeusercurr'

	export default {
		name: 'todolist',
		data() {
			return {
				name: "",
				pwd: "",
				msg: "",
				cid: "",
				users: storeuser.fetch(),
				user: storeCurr.fetch()
			};
		},

		methods: {
			login: function() {
				if(this.name.trim() == "") {
					this.msg = "请输入用户名"
					return;
				}
				if(this.pwd.trim() == "") {
					this.msg = "请输入密码"
					return;
				}
				var exist = findel.findElem(this.users, "name", this.name);
				var existpwd = findel.findElem(this.users, "pwd", md5(this.pwd));
				if(exist == -1) {
					this.msg = "该用户名未注册"
					return;
				}
				if(existpwd == -1) {
					this.msg = "密码错误"
					return;
				}				
				if(exist != -1 && this.users[exist]["pwd"]==md5(this.pwd)) {
					alert("登录成功")
					window.location.href="./index"					
				}
				
				//关闭登录框
				this.user = []
				this.user.push({
					cid: this.users[exist]["id"],
					cname: this.users[exist]["name"],
					islogin: true
				})
				storeCurr.save(this.user)
				store.commit('login');
				console.log("当前是否已登录:" + (store.state.isLogin ? " 是 " : " 否 ") + " ,当前id为 " + store.state.cid)
				this.name = "";
				this.pwd = "";
			},
			clearMsg: function() {
				this.msg = ""
			}
		}
	}
</script>

<style scoped>

</style>