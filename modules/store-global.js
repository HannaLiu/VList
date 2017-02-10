import Vue from 'vue';
import Vuex from 'vuex';

import storelast from '../src/storeuser-last'
Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		cid: storelast.fetch().id,
		isLogin: false		
	},
	mutations: {
		singout(state) {
			state.isLogin=false,
			state.cid= ""
		}
	}
})

module.exports = store