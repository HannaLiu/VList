<template>
	<div class="main">
		<header>
			<nav class="container header">
				<h1 class="logo"><img src="../assets/img/logo.png" /></h1>
				<div class="nav-person">					
					<div class="nav-login" v-if="!isLogin">
						<button class="btn btn-success" href="#" role="button"><router-link to="/register">注册</router-link></button>
						<button class="btn btn-default" href="#" role="button"><router-link to="/login">登录</router-link></button>
					</div>
					<div class="nav-login" v-else>
						<div class="user-name">{{cname}}</div>
						<button class="btn btn-warning" href="#" role="button" @click="signout">退出</button>
					</div>
				</div>
				<ul class="nav-menu">
					<!--<li>
						<router-link to="/">首页</router-link>
					</li>-->
					<li>
						<router-link to="/todolist">TODO</router-link>
					</li>
					<li>
						<router-link to="/movie">电影</router-link>
					</li>
					<li>
						<router-link to="/book">书籍</router-link>
					</li>					
				</ul>
			</nav>
		</header>
		<router-view></router-view>
		<vfooter></vfooter>
	</div>
</template>

<script>
	import store from '../store/store-global'
	import storeuser from '../data/storeuser'
	import storeCurr from '../data/storeusercurr'
	import vfooter from './footer'
	export default {
		name: 'header',
		data() {
			return {
				isLogin: false,
				cname:"",
				users: storeuser.fetch(),
				user: storeCurr.fetch()
			}
		},
		components: {
			vfooter
		},
		mounted: function() {
			if(store.state.isLogin){
				this.cname=storeCurr.fetch()[0]["cname"],
				this.isLogin=true				
			}			
		},
		methods: {
			signout: function() {
				if(!confirm("确定退出吗")) {
					return
				}
				//返回主页
				window.location.href="./"
				store.commit('singout');
				this.user = []
				this.user.push({
					cid: "",
					islogin: false
				})
				storeCurr.save(this.user)

				console.log("当前是否已登录:" + (store.state.isLogin ? " 是 " : " 否 ") + " ,当前id为 " + store.state.cid)
			}
		}
	}
</script>

<style scoped>

</style>