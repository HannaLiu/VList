<template>
	<div id="management">
		<h4><center>当前为管理清单分类页，暂未完成</center></h4>
		<ul>
			<li v-for="item in items"></li>
		</ul>
	</div>
</template>

<script>
	import storeuser from '../data/storeuser'
	import findel from '../modules/findElem'
	
	export default {
		name: 'management',
		data() {
			return {
				items:[]
			};
		},
		watch: {
			
		},
		methods: {			
			
		}
		
	}
</script>

<style scoped>
	
</style>