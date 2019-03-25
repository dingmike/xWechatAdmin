<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <h1 class="title">家长列表</h1>
          <div class="columns">
            <div class="column">
              <p class="control has-addons">
                <input class="input" type="text" v-model="search.name" placeholder="名称">
                <a class="button is-info" href="#" @click.prevent="getList()">搜索</a>
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <table class="table">
            <thead>
              <tr>
                <th>用户id</th>
                <th>用户名</th>
                <th>头像</th>
                <th>手机号</th>
                <th>认证状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in list">
                <td>{{user.user_id}}</td>
                <td>{{user.nickname}}</td>
                <td><img width="60" :src="user.avatar"></td>
                <td></td>
                <td></td>
                <td>
                </td>
              </tr>
            </tbody>
          </table>
        </article>
      </div>
    </div>
    <card-modal :visible="modal.visible" @cancel="close" @ok="confirm" :title="modal.title" transition="zoom">
      {{ modal.message }}
    </card-modal>
  </div>
</template>

<script>
import Cleave from 'vue-cleave'
import CardModal from '../../components/widget/CardModal.vue'

import 'cleave.js/dist/addons/cleave-phone.cn'

import api from 'lanmaLib/common/api'
import helper from '../../helper'
import _ from 'lodash'

export default {
  data () {
    return {
      list: [],
      search: {
        name: ''
      },
      modal: {
        visible: false,
        title: '删除确认',
        message: '删除数据后将不能恢复，确定删除吗？'
      },
      removeId: 0
    }
  },
  components: {
    Cleave,
    CardModal
  },
  created () {
    api.user.getParentList()
      .then((data) => {
        this.list = data.list
      })
  },
  methods: {
    confirm () {
      if (this.removeId) {
        api.channel.delete(this.removeId).then(() => {
          _.remove(this.list, (item) => {
            return item.id === this.removeId
          })
          this.close()
        })
        .catch((e) => {
          helper.showSuccess(e.message)
        })
      }
    },

    remove (id) {
      this.modal.visible = true
      this.removeId = id
    },

    close () {
      this.modal.visible = false
      this.removeId = 0
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
