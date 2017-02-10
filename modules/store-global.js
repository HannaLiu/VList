import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		isLogin: false,
		cid: ""
	},
	mutations: {
		singout(state) {
			state.isLogin=false,
			state.cid= ""
		}
	}
})

module.exports = store