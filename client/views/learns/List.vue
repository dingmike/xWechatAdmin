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
                <th>ID</th>
                <th>名称</th>
                <th>显示顺序</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in list">
                <td>{{ item.id }}</td>
                <td>{{ item.title }}</td>
                <td>{{ item.display_order }}</td>
                <td>{{ item.status_title }}</td>
                <td>
                  <router-link :to="'/learns/edit/' + item.id">编辑</router-link>
                  <a href="#" @click.prevent="remove(item.id)">删除</a>
                </td>
              </tr>
            </tbody>
          </table>
        </article>
      </div>
    </div>
    <card-modal :visible="modal.visible" @cancel="close" @ok="confirm" :title="modal.title"  transition="zoom">
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
    var statusTitle = ['未审核', '审核通过', '审核不通过']
    api.learn.admin.getList()
      .then((data) => {
        data.list.forEach(function (item) {
          item.status_title = statusTitle[item.status]
          return item
        })
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
