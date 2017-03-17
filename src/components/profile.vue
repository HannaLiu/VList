<template>
	<div id="profile" class="container">
		<div class="form_main">
			<div class="m_t_m col-sm-8 col-sm-push-2 grout_list">
				<div class="">
					<p class="tit_form">个人信息</p>
					<div class="form-group">
						<label>ID：</label>
						<div class="info_detail">
							<p class="form-control-static">{{id}}</p>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label">用户名：</label>
						<div class="info_detail">
							<p class="form-control-static">{{name}}</p>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label">手机号：</label>
						<div class="info_detail">
							<input type="tel" class="form-control" id="inputTel" placeholder="电话号码" v-model="tel" v-on:focus="clearMsg">
						</div>
					</div>
					<div class="form-group">
						<label class="control-label">邮　箱：</label>
						<div class="info_detail">
							<input type="email" class="form-control" id="inputEmail" placeholder="邮箱" v-model="email" v-on:focus="clearMsg">
						</div>
					</div>
					<div class="form-group">
						<label class="control-label">密　码：</label>
						<div class="info_detail">
							<input type="password" class="form-control" id="inputPassword" placeholder="确认密码" v-model="pwd" v-on:focus="clearMsg">
						</div>
					</div>
					<p class="text-center message">{{msg}}</p>
					<p class="tit_form"></p>
					<div class="text-center m_t_m"><button class="btn btn-success" @click="resetprofile">保存</button></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import store from '../store/store-global'
	import storeuser from '../data/storeuser'
	import md5 from 'md5'
	import findel from '../modules/findElem'

	export default {
		name: 'profile',
		data() {
			return {
				users: storeuser.fetch(),
				id: store.state.cid,
				name: store.state.cname,
				tel: "",
				email: "",
				pwd: "",
				msg: ""
			};
		},
		watch: {
			users: {
				handler: function(users) {
					storeuser.save(users)
				},
				deep: true
			}
		},
		mounted: function() {
			var exist = findel.findElem(this.users, "name", this.name);
			this.tel = this.users[exist].tel || ""
			this.email = this.users[exist].email || ""
		},
		methods: {
			resetprofile: function() {
				var exist = findel.findElem(this.users, "name", this.name);
				var existpwd = findel.findElem(this.users, "pwd", md5(this.pwd));
				if(this.tel.trim() == this.users[exist].tel && this.email.trim() == this.users[exist].email) {
					this.msg = "您没有修改"
					return
				}
				if(this.tel.trim() != this.users[exist].tel || this.email.trim() != this.users[exist].email) {
					if(this.pwd.trim() == "") {
						this.msg = "请确认密码"
						return
					}
					if(this.users[exist]["pwd"] != md5(this.pwd)) {
						this.msg = "密码错误"
						return;
					}
					if(this.users[exist]["pwd"] == md5(this.pwd)) {
						this.users[exist].tel = this.tel,
							this.users[exist].email = this.email
						storeuser.save(this.users)
						alert("修改成功")
						window.location.href = "./"
					}
				}
			},
			clearMsg: function() {
				this.msg = ""
			}
		}
	}
</script>

<style scoped>

</style>