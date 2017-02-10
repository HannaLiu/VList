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
		<vfooter></vfooter>
	</div>
</template>

<script>
var vheader = require('components/header'); 
var vfooter = require('components/footer'); 
  
	export default {
		name: 'app',
		components:{
    	vheader,
    	vfooter
  		}
	}
</script>
<style>
	@import 'assets/css/font-awesome/font-awesome.min.css';
	@import 'assets/css/bootstrap.min.css';
	@import "assets/css/main.css";
	
</style>
