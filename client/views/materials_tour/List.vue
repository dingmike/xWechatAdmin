<template>
  <div>
    <!-- <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <div class="columns">
            <div class="column">
              <p class="control has-addons">
                <input class="input" type="text" placeholder="名称">
                <a class="button is-info">搜索（sorry，暂未实现）</a>
              </p>
            </div>
          </div>
        </article>
      </div>
    </div> -->

    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>名称</th>
                <th>教育机构id</th>
                <!--<th>显示顺序</th>-->
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in list">
                <td>{{ item.id }}</td>
                <td>{{ item.title }}</td>
                <td>{{ item.agency_id }}</td>
                <!--<td>{{ item.display_order }}</td>-->
                <td>{{ item.status_title }}</td>
                <td>
                  <router-link :to="'/materials_tour/edit/' + item.id">编辑</router-link>
                  <a href="#" @click.prevent="remove(item.id)">删除</a>&nbsp;&nbsp;
                  <router-link :to="'/courses/add/' + item.id + '/2'">添加课程</router-link>
                </td>
              </tr>
            </tbody>
          </table>
          <pagination :index="page" :count="pageCount" :loading="loading" @change="pages(arguments[0])"></pagination>
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
import Pagination from 'components/Pagination'

import 'cleave.js/dist/addons/cleave-phone.cn'

import api from 'lanmaLib/common/api'
import helper from '../../helper'
import _ from 'lodash'

export default {
  data () {
    return {
      page: 0,
      pageCount: 0,
      loading: false,
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
    CardModal,
    Pagination
  },
  created () {
    var page = parseInt(this.$route.params.page)
    this.getList(page || 1)
  },
  methods: {
    getList (page = 1) {
      var statusTitle = ['未审核', '审核通过', '审核不通过']

      var params = {}
      params.page = page
      params.offset = (page - 1) * 20
      params.length = 20
      this.loading = true
      api.material_tour.getList(params)
        .then((data) => {
          data.list.forEach(function (item) {
            item.status_title = statusTitle[item.status]
            return item
          })
          this.list = data.list
          this.loading = false
          this.page = page
          this.pageCount = Math.ceil(data.total / 20)
        })
    },
    pages (page) {
      console.log(page)
      this.$router.push('/materials_tour/list/' + page)
      this.getList(page)
    },
    confirm () {
      if (this.removeId) {
        api.material_tour.delete(this.removeId).then(() => {
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
