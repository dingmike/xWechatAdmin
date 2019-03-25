<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <h1 class="title">优惠券列表</h1>
          <div class="columns">
            <div class="column">
              <p class="control has-addons">
                <input class="input" type="text" v-model="search.name" placeholder="优惠券名称">
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
                <th>ID</th>
                <th>标题</th>
                <th>数量</th>
                <th>价格</th>
                <th>折扣</th>
                <th>抵扣</th>
                <th>排序</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in list">
                <td>{{ item.id }}</td>
                <td>{{ item.title }}</td>
                <td>{{ item.number }}</td>
                <td>{{ item.price }}</td>
                <td>{{ item.discount }}</td>
                <td>{{ item.deduction }}</td>
                <td>{{ item.display_order }}</td>
                <td>{{ statusList[item.status] }}</td>
                <td>
                  <router-link :to="'/coupons/edit/' + item.id">编辑</router-link>
                  <a href="#" @click.prevent="remove(item.id)">删除</a>
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
      list: [],
      search: {
        name: ''
      },
      modal: {
        visible: false,
        title: '删除确认',
        message: '删除数据后将不能恢复，确定删除吗？'
      },
      removeId: 0,
      statusList: config.status.defaultStatus
    }
  },
  components: {
    Cleave,
    CardModal
  },
  beforeCreate () {
    api.admin.coupon.getList()
      .then((data) => {
        this.list = data.list
      })
  },
  methods: {
    getList () {
      console.log('getList')
      api.admin.coupon.getList(this.search).then((data) => {
        console.log(data)
        this.list = data.list
      })
    },
    confirm () {
      if (this.removeId) {
        api.admin.monthReport.delete(this.removeId).then(() => {
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
