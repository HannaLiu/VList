import Vue from 'vue';
import Vuex from 'vuex';

import storeCurr from '../data/storeuser-last'

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		cid:"",
		isLogin:false
	},
	strict:true,
	mutations: {
		login(state) {
			state.cid = storeCurr.fetch()[0].cid,
			state.isLogin = storeCurr.fetch()[0].islogin
		},
		singout(state) {
			state.cid = "",
			state.isLogin = false
		}
	}
})

module.exports = store