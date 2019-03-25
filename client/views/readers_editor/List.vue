<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <h1 class="title">共读列表</h1>
          <div class="columns">
            <div class="column">
              <p class="control has-addons">
                <!--<input class="input" type="text" v-model="search.name" placeholder="共读名称">
                <a class="button is-info" href="#" @click.prevent="getList()">搜索</a>-->
                <span class="list-status hasborder first" :class="[status==''?'selected':'']" @click="changeStatus(0)">全部</span>
                <span class="list-status hasborder" :class="[status==1?'selected':'']" @click="changeStatus(1)">待审核</span>
                <span class="list-status hasborder" :class="[status==2?'selected':'']" @click="changeStatus(2)">审核通过</span>
                <span class="list-status last" :class="[status==3?'selected':'']" @click="changeStatus(3)">审核不通过</span>
                <span class="total">共有{{ total }}篇 {{ statusMap[status] }} 共读文章</span>
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
                <th>孩子年龄</th>
                <th>主题标签</th>
                <th>点击次数</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in list">
                <td>{{ item.id }}</td>
                <td>{{ item.title }}</td>
                <td>{{ $label.getLabel(item.labels[0][0]).title }}</td>
                <td>{{ $label.getLabel(item.labels[1][item.labels[1].length-1]).title }}</td>
                <td>{{ item.click_num-item.initNum }}</td>
                <td>{{ statusMap[item.status] }}</td>
                <td>
                  <router-link :to="'/readers_editor/edit/' + item.id">编辑</router-link>
                  <a href="#" @click.prevent="remove(item.id)">删除</a>
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
import Cleave from 'vue-cleave'
import CardModal from '../../components/widget/CardModal.vue'
import Pagination from 'components/Pagination'

import 'cleave.js/dist/addons/cleave-phone.cn'
import { Tabs, TabPane } from 'vue-bulma-tabs'

import api from 'lanmaLib/common/api'
import helper from '../../helper'
import _ from 'lodash'

export default {
  data () {
    return {
      status: '',
      total: 0,
      page: 0,
      pageCount: 0,
      loading: false,
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
      statusMap: ['', '未审核', '审核通过', '审核未通过']
    }
  },
  components: {
    Cleave,
    CardModal,
    Pagination,
    Tabs,
    TabPane
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
      if (isNaN(page) || page < 0) {
        page = 1
      }
      var status = parseInt(this.$route.params.status)
      if (isNaN(status) || status < 0) {
        status = 0
      }
      this.status = status
      this.page = page
      this.$label.getLabelList()
      this.getList(page || 1)
    },
    changeStatus (status) {
      this.status = status
      this.$router.push('/readers_editor/list/' + status + '/1')
      this.getList()
    },
    getList (page = 1) {
      console.log('getList')
      var params = {}
      params.offset = (page - 1) * 20
      params.length = 20
      params.status = this.status
      if (this.search.name !== '') {
        params.key = this.search.name
      }
      this.loading = true
      api.reader.editor.getList(params)
        .then((data) => {
          this.list = data.list
          this.loading = false
          this.page = page
          this.total = data.total
          this.pageCount = Math.ceil(data.total / 20)
        })
    },
    pages (page) {
      console.log(page)
      this.$router.push('/readers_editor/list/' + this.status + '/' + page)
      this.getList(page)
    },
    confirm () {
      if (this.removeId) {
        api.reader.editor.delete(this.removeId).then(() => {
          _.remove(this.list, (item) => {
            return item.id === this.removeId
          })
          this.close()
        })
        .catch((e) => {
          this.close()
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

.list-status {
  line-height: 30px;
  font-size: 20px;
  padding: 0 25px;
  cursor: pointer;
}

.last {
  margin-right: 50px;
}

.total {
  line-height: 30px;
}

.selected {
  color: #00d1b2;
}

.hasborder {
  border-right: 1px solid #aaa;
}
</style>
