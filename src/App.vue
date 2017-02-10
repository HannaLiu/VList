<template>
	<div id="app">
		<!--<div class="header">
			<router-link to="/login">登录</router-link>
	    <router-link to="/register">注册</router-link>
	    <router-link to="/todolist">豆瓣清单</router-link>
	    <router-link to="/movie">电影</router-link>
	    <router-view></router-view>   
		</div>-->
		<vheader></vheader>
		<!--<vfooter></vfooter>-->
	</div>
</template>

<script>
	var vheader = require('components/header');
	var vfooter = require('components/footer');

	import store from '../modules/store-global'
	import storeCurr from './storeuser-last'
	export default {
		name: 'app',
		components: {
			vheader,
			vfooter
		},
		data() {
			return {
				user: storeCurr.fetch()
			};
		},
		mounted: function() {			
			console.log("首页：当前是否已登录:" + (store.state.isLogin ? " 是 " : " 否 ") + " ,当前id为 " + store.state.cid)
		}
	}
</script>
<style>
	@import 'assets/css/font-awesome/font-awesome.min.css';
	@import 'assets/css/bootstrap.min.css';
	@import "assets/css/main.css";
</style>