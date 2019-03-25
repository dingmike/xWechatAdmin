<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-ancestor">
        <div class="tile is-parent cl-form">
          <article class="tile is-child box">
            <h1 class="title">添加渠道</h1>
            <div class="block">
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">名称</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="admin.name" type="text" placeholder="名称">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">登录用户名</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="admin.username" type="text" placeholder="用户名">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">登录密码</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="admin.password" type="text" placeholder="密码">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label"></label>
                </div>
                <div class="control">
                  <button class="button is-primary" @click="submit">提交</button>
                  <button class="button is-link">取消</button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cleave from 'vue-cleave'
import 'cleave.js/dist/addons/cleave-phone.cn'

import api from 'lanmaLib/common/api'
import helper from '../../helper'

export default {
  data () {
    return {
      title: '添加渠道',
      id: 0,
      admin: {
        id: 0,
        name: '',
        username: '',
        password: ''
      }
    }
  },
  created () {
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    this.id = id

    if (id) {
      this.title = '编辑管理员'
      api.user.findAdmin(id)
        .then((admin) => {
          admin.password = ''
          this.admin = admin
        })
    }
  },
  components: {
    Cleave
  },
  methods: {
    submit () {
      if (this.id) {
        api.user.editAdmin(this.id, this.admin).then((res) => {
          console.log(res)
          this.$router.push('/users/admin')
          helper.showSuccess('添加成功')
        })
        .catch((e) => {
          console.log(e)
          helper.showError(e.message)
        })
      } else {
        api.user.addAdmin(this.admin).then((res) => {
          console.log(res)
          helper.showSuccess('添加成功')
          this.$router.push('/users/admin')
        })
        .catch((e) => {
          console.log(e)
          helper.showError(e.message)
        })
      }
    }
  }
}
</script>

<style scoped>
.button {
  margin: 5px 0 0;
}

.control .button {
  margin: inherit;
}
</style>
