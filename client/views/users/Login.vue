<template>
  <div class="login-form-con">
    <div class="tile is-parent is-3 login-form">
      <article class="tile is-child box">
        <h1 class="title">管理后台</h1>
        <div class="block">
          <p class="control has-icon">
            <input class="input" type="text" v-model="username" placeholder="用户名">
            <i class="fa fa-envelope"></i>
          </p>
          <p class="control has-icon">
            <input class="input" type="password" v-model="password" placeholder="密码（输完按Enter键可直接登录）" @keyup.enter="login">
            <i class="fa fa-lock"></i>
          </p>
          <p class="control">
            <button class="button is-success" @click="login">
              登录
            </button>
          </p>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import Cleave from 'vue-cleave'
import 'cleave.js/dist/addons/cleave-phone.cn'
import { mapGetters, mapActions } from 'vuex'

import api from 'lanmaLib/common/api'
import userModule from 'lanmaLib/modules/user'
import helper from '../../helper'
import md5 from 'md5'

export default {
  data: function () {
    return {
      username: '',
      password: ''
    }
  },
  components: {
    Cleave
  },
  computed: {
    ...mapGetters({
      pkginfo: 'pkg',
      sidebar: 'sidebar',
      userInfo: 'userInfo',
      loginState: 'loginState'
    })
  },
  methods: {
    login () {
      if (!this.validate()) return
      let md5Password = md5(md5(this.password))
      api.login(this.username, md5Password).then((info) => {
        api.setToken(info.username)
        this.userLogin(info)
        userModule.saveUserInfoToStorage(info)
        window.location.href = './'
      })
      .catch(() => {
        api.login(this.username, this.password).then((info) => {
          api.setToken(info.username)
          this.userLogin(info)
          userModule.saveUserInfoToStorage(info)
          window.location.href = './'
        })
        .catch((error) => {
          if (error.code === 6001) {
            helper.showTopError('用户不存在，请重新输入')
          } else if (error.code === 6002) {
            helper.showTopError('密码错误，请重新输入')
          } else {
            helper.showTopError(error)
          }
        })
      })
    },
    validate() {
      if (!this.username) {
        helper.showTopError('请输入用户名')
        return false
      } else if (!this.password) {
        helper.showTopError('请输入密码')
        return false
      }
      return true
    },
    ...mapActions([
      'userLogin'
    ])
  }
}
</script>

<style scoped>
.login-form-con{
  position: relative;
  margin-left:-180px;
}
.login-form{
  width:400px;
  height:300px;
  position: absolute;
  left:50%;
  margin-left: -200px;
}
</style>
