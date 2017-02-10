<template>
	<div class="header">
		<header>
			<nav class="container header">
				<h1 class="logo"><img src="../assets/img/logo.png" /></h1>
				<div class="nav-person">
					<div class="head-pic"></div>
					<div class="nav-login">
							<button class="btn btn-success" href="#" role="button"><router-link to="/register">注册</router-link></button>					
							<button class="btn btn-default" href="#" role="button"><router-link to="/login">登录</router-link></button>
							<button class="btn btn-warning" href="#" role="button" @click="signout">退出</button>
					</div>
				</div>
				<ul class="nav-menu">
					<li>
						<router-link to="/">首页</router-link>
					</li>
					<li>
						<router-link to="/movie">电影</router-link>
					</li>
					<li>
						<router-link to="/book">书籍</router-link>
					</li>
					<li>
						<router-link to="/todolist">TODO</router-link>
					</li>
				</ul>
			</nav>
		</header>
		<router-view></router-view> 
	</div>
</template>

<script>	
	import store from '../../modules/store-global'
	export default {
		name: 'header',
		data() {
			return {
 			
			}
		},
		components: {
		
		},
		methods:{
			signout:function(){
				store.commit('singout')
				console.log("当前是否已登录:"+ (store.state.isLogin?" 是 ":" 否 ") +" ,当前id为 "+store.state.cid)
			}
		}
	}
</script>


<style scoped>

</style>