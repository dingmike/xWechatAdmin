<template>
  <div>
    <!-- <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <h1 class="title">渠道列表</h1>
          <div class="columns">
            <div class="column">
              <p class="control has-addons">
                <input class="input" type="text" v-model="searchKW" placeholder="商品ID/名称">
                <a class="button is-info">搜索（已支持）</a>
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
                <th v-for="item in thList">{{ item }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in list">
                <td>{{ item.id }}</td>
                <td>{{ item.amount }}</td>
                <td>{{ item.giftAmount }}</td>
                <td>{{ item.quotaDesc }}</td>
                <td>
                  <router-link :to="'/recharge/edit/' + item.id"> 编辑&nbsp;&nbsp; </router-link>
                  <a href="#" @click.prevent="action('delete', item.id)"> 删除&nbsp;&nbsp; </a>
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
import ShowStatus from '../../components/widget/ShowStatus.vue'
import Pagination from 'components/Pagination'

// import 'cleave.js/dist/addons/cleave-phone.cn'

import api from 'lanmaLib/common/api'
import helper from '../../helper'
import _ from 'lodash'

export default {
  data () {
    return {
      status: 0,
      page: 0,
      pageCount: 0,
      loading: false,
      actionType: '',
      actionId: '',
      thList: ['序号', '充值金额', '赠送金额', '赠品描述', '操作'],
      list: [],
      modal: {
        visible: false,
        title: '开售确认',
        message: '确定要开启销售吗？'
      }
    }
  },
  components: {
    CardModal,
    ShowStatus,
    Pagination
  },
  created () {
    var page = parseInt(this.$route.params.page)
    this.getList(page || 1)
  },
  methods: {
    pages (page) {
      this.$router.push('/recharge/list/' + page)
      this.getList(page || 1)
    },
    getList (page = 1) {
      var params = {}
      params.page = page
      params.status = this.status
      params.offset = (page - 1) * 20
      params.length = 20
      this.loading = true
      api.recharge.getList(params)
        .then((data) => {
          this.list = data
          this.loading = false
          this.page = page
          this.pageCount = Math.ceil(data.total / 20)
        })
    },
    action (type, id) {
      this.actionType = type
      this.actionId = id
      switch (this.actionType) {
        case 'delete':
          this.showModal('删除确认', '确认要删除该充值项？')
          break
        default:
          break
      }
    },
    showModal (title, message) {
      this.modal.title = title
      this.modal.message = message
      this.modal.visible = true
    },
    confirm() {
      this.modal.visible = false
      switch (this.actionType) {
        case 'delete':
          api.recharge.delete(this.actionId).then((data) => {
            var index = _.findIndex(this.list, {'id': this.actionId})
            this.list.splice(index, 1)
            helper.showSuccess('删除成功')
          }).catch((error) => {
            if (error.code === 6046) {
              helper.showError('该商品已有销售记录，无法删除！')
            } else {
              helper.showError('删除失败，其他异常')
            }
          })
          break
        default:
          break
      }
    },
    close () {
      this.modal.visible = false
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

.modal-wrap{
  text-align: center;
}
</style>
