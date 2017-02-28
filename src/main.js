// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from "vue-router";
import VueResource from 'vue-resource'

Vue.use(VueRouter);
Vue.use(VueResource);

import login from './components/login.vue'
import register from './components/register.vue'
import profile from './components/profile.vue'
import todolist from './components/todolist.vue'
import manage from './components/manage.vue'

const router = new VueRouter({
	mode: 'history',
	base: __dirname,
	routes: [
	{
		path: '/',
		component: todolist
	},
	{
		path: '/login',
		component: login
	}, {
		path: '/register',
		component: register
	}, {
		path: '/profile',
		component: profile
	}, {
		path: '/todolist',
		component: todolist
	},
	{
		path: '/manage',
		component: manage
	}]
})
const app = new Vue({
	router: router,
	render: h => h(App)
}).$mount('#app')