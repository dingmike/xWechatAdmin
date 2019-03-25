<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <div class="columns">
            <div class="column">
              <p class="control has-addons">
                <input class="input" type="text" placeholder="名称">
                <a class="button is-info">搜索</a>
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
                <th>订单状态</th>
                <th>订单金额</th>
                <th>提交</th>
                <th>作业</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in list">
                <td>{{user.id}}</td>
                <td>{{user.nickname}}</td>
                <td><img width="60" :src="user.avatar"></td>
                <td>{{status.order[user.order_status]}}</td>
                <td>{{user.amount}}</td>
                <td>{{user.submit ? '是' : '否'}}</td>
                <td>{{user.homework ? '是' : '否'}}</td>
                <td>
                  <a v-if="user.order_status === 0" href="#" @click.prevent="orderConfirm(user)">确认</a>
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

import config from 'lanmaLib/config'

export default {
  data () {
    return {
      learn_id: 0,
      list: [],
      modal: {
        visible: false,
        title: '删除确认',
        message: '删除数据后将不能恢复，确定删除吗？'
      },
      removeId: 0,
      status: config.status
    }
  },
  components: {
    Cleave,
    CardModal
  },
  created () {
    var id = parseInt(this.$route.params.id)
    console.log(id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    this.learn_id = id

    api.admin.order.learnOrder.getList(this.learn_id)
      .then((data) => {
        this.list = data.list
      })
  },
  methods: {
    confirm () {
      if (this.removeId) {
        api.learn.admin.delete(this.removeId).then(() => {
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
