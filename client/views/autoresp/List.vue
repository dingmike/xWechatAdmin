<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <div class="contentTop">
            <div class="newMaterials">
              <button class="button is-primary" @click="goto('/autoresp/add')">添加自动回复</button>
            </div>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>序号</th>
                <th>类型</th>
                <th>关键字</th>
                <th>文本内容（部分）</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in list">
                <td>{{ index+1 }}</td>
                <td>全匹配</td>
                <td>{{ item.keyText }}</td>
                <td>{{ item.msgText.content.slice(0, 20) }}...</td>
                <td>
                  <router-link :to="'/autoresp/edit/' + index">编辑</router-link>
                  <a href="#" @click.prevent="remove(item.keyText)">删除</a>
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
      api.autoresp.getList(params)
        .then((data) => {
          this.list = data.list
          this.loading = false
          this.page = page
          this.pageCount = Math.ceil(data.total / 20)
        })
    },
    pages (page) {
      this.$router.push('/autoresp/list/' + page)
      this.getList(page)
    },
    confirm () {
      if (this.removeId) {
        api.autoresp.delete(this.removeId).then(() => {
          _.remove(this.list, (item) => {
            return item.keyText === this.removeId
          })
          this.close()
          helper.showSuccess('删除成功')
        })
        .catch((e) => {
          this.close()
          helper.showError('删除失败，其他异常')
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
    goto (url) {
      this.$router.push(url)
    }
  }
}
</script>

<style scoped lang="scss">
.button {
  margin: 5px 0 0;
}

.control .button {
  margin: inherit;
}
  .contentTop{
    margin-bottom:20px;
  }
</style>
