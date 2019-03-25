<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <div class="columns">
            <div class="column">
              <p class="control has-addons">
                <input class="input" type="text" v-model="searchVal" placeholder="渠道ID/名称">
                <a class="button is-info" href="#">搜索</a>
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
                <th>所在地</th>
                <th>地址</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in list">
                <td>{{ item.user_id }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.site }}</td>
                <td>{{ item.description }}</td>
                <td>
                  <router-link :to="'/channels/edit/' + item.user_id">编辑</router-link>
                  <a href="#" @click.prevent="remove(item.user_id)">删除</a>
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
      searchVal: '',
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
  beforeCreate () {
    api.channel.getList()
      .then((data) => {
        this.list = data.list
      })
  },
  watch: {
    searchVal: function () {
      this.search()
    }
  },
  methods: {
    getList () {
      api.channel.getList().then((data) => {
        this.list = data.list
      })
    },
    confirm () {
      if (this.removeId) {
        api.channel.delete(this.removeId).then(() => {
          _.remove(this.list, (item) => {
            return item.user_id === this.removeId
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
    },
    search () {
      if (this.searchVal) {
        api.channel.search(this.searchVal).then(res => {
          this.list = res.list
          this.page = 1
          this.pageCount = 1
        })
      } else {
        this.getList()
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
