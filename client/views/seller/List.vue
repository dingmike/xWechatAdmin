<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <table class="table">
            <thead>
              <tr>
                <th v-for="item in thList">{{ item }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in list">
                <td>{{ item.id }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.telephone }}</td>
                <td>{{ item.userId ? '已绑定':'未绑定' }}</td>
                <td>
                  <router-link :to="'/seller/edit/' + item.id">编辑</router-link>
                  <a href="#" @click.prevent="remove(item.id)">删除</a>&nbsp;&nbsp;
                </td>
              </tr>
            </tbody>
          </table>
          <pagination :index="page" :count="pageCount" :loading="loading" @change="pages(arguments[0])"></pagination>
        </article>
      </div>
    </div>
    <card-modal :visible="modal.visible" @cancel="close" @close="close" @ok="confirm" :title="modal.title"  transition="zoom">
      {{ modal.message }}
    </card-modal>
  </div>
</template>

<script>
// import Cleave from 'vue-cleave'
import CardModal from '../../components/widget/CardModal.vue'
import Pagination from 'components/Pagination'

// import 'cleave.js/dist/addons/cleave-phone.cn'

import api from 'lanmaLib/common/api'
import helper from '../../helper'
import _ from 'lodash'

export default {
  data () {
    return {
      page: 0,
      pageCount: 0,
      thList: ['序号', '姓名', '号码', '绑定状态', '操作'],
      loading: false,
      list: [],
      modal: {
        visible: false,
        title: '删除确认',
        message: '确认要删除该销售员？'
      },
      removeId: 0
    }
  },
  components: {
    // Cleave,
    CardModal,
    Pagination
  },
  watch: {
    // 需要侦听路由变化，来加载数据
    '$route' (to, from) {
      this.init()
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      var page = parseInt(this.$route.params.page)
      this.getList(page || 1)
    },
    getList (page = 1) {
      var params = {}
      params.page = page
      params.offset = (page - 1) * 20
      params.length = 20
      this.loading = true
      api.seller.getSellerList(params)
        .then((data) => {
          this.list = data.list
          this.loading = false
          this.page = page
          this.pageCount = Math.ceil(data.total / 20)
        })
    },
    pages (page) {
      this.getList(page)
      var path = window.location.hash.replace('#', '').replace(/\/\d+$/, '/' + page)
      this.$router.push(path)
    },
    confirm () {
      if (this.removeId) {
        api.seller.deleteSeller(this.removeId).then(() => {
          _.remove(this.list, (item) => {
            return item.id === this.removeId
          })
          this.close()
          helper.showSuccess('删除成功')
        })
        .catch((e) => {
          helper.showError(e.message)
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
