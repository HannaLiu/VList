<template>
	<div id="app">
		<vmain></vmain>	
	</div>
</template>

<script>
	import vmain from './components/main'	
	
//	import store from './store/store-global'
//	import storeCurr from './data/storeusercurr'
	
	export default {
		name: 'app',
		components: {
			vmain
		},		
		data() {
			return {
//				user: storeCurr.fetch()
			};
		},
		mounted: function() {			
//			console.log("首页：当前是否已登录:" + (store.state.isLogin ? " 是 " : " 否 ") + " ,当前id为 " + store.state.cid)
		}
	}
</script>
<style>
	@import 'assets/css/font-awesome/font-awesome.min.css';
	@import 'assets/css/bootstrap.min.css';
	@import "assets/css/main.css";
</style>