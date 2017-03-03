<template>
	<div id="login" class="row">
		<div class="form">
			<div class="form-group">
				<label>请输入您的用户名</label>
				<input type="text" class="form-control" placeholder="请输入您的用户名" v-model="name" v-on:focus="clearMsg" @keyup.13="login">
			</div>
			<div class="form-group">
				<label>请输入您的密码</label>
				<input type="password" class="form-control" placeholder="请输入您的密码" v-model="pwd" v-on:focus="clearMsg" @keyup.13="login">
			</div>
			<p class="message">{{msg}}</p>
			<div class="text-center"><button type="submit" class="btn btn-success" @click="login">登录</button></div>
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
				user: storeCurr.fetch(),
				hasLogin: false
			};
		},
		watch: {},
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
				if(exist != -1 && this.users[exist]["pwd"] != md5(this.pwd)) {
					this.msg = "密码错误"
					return;
				}
				if(exist != -1 && this.users[exist]["pwd"] == md5(this.pwd)) {
					//加入session
					this.user = []
					this.user.push({
						cid: this.users[exist]["id"],
						cname: this.users[exist]["name"],
						islogin: true
					})
					storeCurr.save(this.user)
					store.commit('login');
					this.hasLogin = true
					alert("登录成功")
					window.location.href = "./"
				}
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