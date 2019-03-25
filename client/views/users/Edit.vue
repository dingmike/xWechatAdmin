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
                    <input class="input" v-model="channel.name" type="text" placeholder="名称">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">登录用户名</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="channel.user.username" type="text" placeholder="用户名">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">登录密码</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="channel.user.password" type="text" placeholder="密码">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">渠道介绍</label>
                </div>
                <div class="control">
                  <div class="control">
                    <textarea class="textarea" v-model="channel.description"></textarea>
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
      channel: {
        id: 0,
        name: '',
        description: '',
        user: {
          username: '',
          password: ''
        }
      }
    }
  },
  beforeCreate () {
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    this.id = id

    if (id) {
      this.title = '编辑渠道'
      api.channel.find(this.$route.params.id)
        .then((channel) => {
          channel.user.password = ''
          this.channel = channel
        })
    }
  },
  components: {
    Cleave
  },
  methods: {
    submit () {
      var id = this.channel.id
      var username = this.channel.user.username
      var password = this.channel.user.password
      var name = this.channel.name
      var description = this.channel.description
      var data = {
        username,
        password,
        name,
        description
      }
      if (id) {
        api.channel.edit(id, data).then((res) => {
          console.log(res)
          this.$router.push('/channels/list')
          helper.showSuccess('添加成功')
        })
        .catch((e) => {
          console.log(e)
          helper.showError(e.message)
        })
      } else {
        api.channel.add(data).then((res) => {
          console.log(res)
          helper.showSuccess('添加成功')
          this.$router.push('/channels/list')
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
