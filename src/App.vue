<template>
	<div id="app">
		<vheader></vheader>	
		<welcome></welcome>
		<router-view></router-view>
		<vfooter></vfooter>
	</div>
</template>

<script>
	import vheader from './components/header'	
	import vfooter from './components/footer'	
	import welcome from './components/welcome'	
	
	import store from './store/store-global'
	import storeCurr from './data/storeusercurr'
	
	export default {
		name: 'app',
		components: {
			vheader,vfooter,welcome
		},		
		data() {
			return {
				user: storeCurr.fetch()				
			};
		},
		mounted: function() {			
			console.log("当前是否已登录:" + (store.state.isLogin ? " 是 " : " 否 ") + " ,当前id为 " + store.state.cid)
		}
	}
</script>
<style>
	@import 'assets/css/font-awesome/font-awesome.min.css';
	@import 'assets/css/bootstrap.min.css';
	@import "assets/css/main.css";	
</style>