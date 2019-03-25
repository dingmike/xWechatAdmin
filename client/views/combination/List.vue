<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <table class="table">
            <thead>
              <tr>
                <th>序号</th>
                <th>名称</th>
                <th>课程数量</th>
                <th>最近开课时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in list">
                <td>{{ item.id }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.courseList.length }}</td>
                <td>{{ item.lesson_time }}</td>
                <td>
                  <router-link :to="'/combination/detail/' + item.id">详情</router-link>
                  <a href="#" @click.prevent="edit(item.id, item.extraData)">编辑</a>&nbsp;&nbsp;
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
    <card-modal :visible="editModal.visible" @cancel="close" @close="close" @ok="confirm" :title="editModal.title"  transition="zoom">
      {{ editModal.message }}
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
      loading: false,
      list: [],
      modal: {
        visible: false,
        title: '删除确认',
        message: '删除数据后将不能恢复，确定删除吗？'
      },
      editModal: {
        visible: false,
        title: '编辑确认',
        message: '该课程组合已被添加为商品，请务必谨慎操作！'
      },
      removeId: 0,
      editId: 0
    }
  },
  components: {
    // Cleave,
    CardModal,
    Pagination
  },
  created () {
    var page = parseInt(this.$route.params.page)
    this.getList(page || 1)
  },
  methods: {
    getList (page = 1) {
      var params = {}
      params.page = page
      params.offset = (page - 1) * 20
      params.length = 20
      this.loading = true
      api.combination.getList(params)
        .then((data) => {
          this.list = data.list
          this.loading = false
          this.page = page
          this.pageCount = Math.ceil(data.total / 20)
        })
    },
    pages (page) {
      this.$router.push('/combination/list/' + page)
      this.getList(page)
    },
    confirm () {
      if (this.removeId) {
        api.combination.delete(this.removeId).then(() => {
          _.remove(this.list, (item) => {
            return item.id === this.removeId
          })
          this.close()
          helper.showSuccess('删除成功')
        })
        .catch((e) => {
          this.close()
          if (e.code === 6050) {
            helper.showError('该课程组合已被添加为商品，无法删除')
          } else {
            helper.showError('删除失败，其他异常')
          }
        })
      }
      if (this.editId) {
        var _this = this
        var id = this.editId
        this.close()
        setTimeout(function() {
          _this.$router.push('/combination/edit/' + id)
        }, 100)
      }
    },
    remove (id) {
      this.modal.visible = true
      this.removeId = id
    },
    edit (id, isGoods = false) {
      this.editId = id
      if (isGoods) {
        this.editModal.visible = true
      } else {
        this.confirm()
      }
    },
    close () {
      this.modal.visible = false
      this.editModal.visible = false
      this.removeId = 0
      this.editId = 0
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
