import Vue from 'vue';
import Vuex from 'vuex';

import storeCurr from '../data/storeusercurr'

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		cid:storeCurr.fetch()[0].cid||"",
		cname:storeCurr.fetch()[0].cname||"",
		isLogin:storeCurr.fetch()[0].islogin||""
	},
	strict:true,
	mutations: {
		login(state) {
			state.cid = storeCurr.fetch()[0].cid,
			state.cname = storeCurr.fetch()[0].cname,
			state.isLogin = storeCurr.fetch()[0].islogin
		},
		singout(state) {
			state.cid = "",
			state.cname = "",
			state.isLogin = false
		}
	}
})

module.exports = store