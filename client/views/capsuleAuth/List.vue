<template>
  <div>
  	<div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <!-- <h1 class="title">渠道列表</h1> -->
          <div class="columns">
            <div class="column">
              <p class="control has-addons">
                <input class="input" type="text" v-model="searchKW" placeholder="作者/作者ID">
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
        	<div class="tile classify">
        	  <a :class="{'activeLink':activeLink === 0}" @click="activeLinkChange(0)">全部（{{amount[0]}}）</a>
        	  <template v-for="value,key in config.author.type">
        	    <span>|</span>
        	    <a :class="{'activeLink':activeLink === key}" @click="activeLinkChange(key)">{{value}}（{{amount[key]}}）</a>
        	  </template>
        	</div>
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>作者</th>
                <th>身份</th>
                <!--<th>显示顺序</th>-->
                <th>类型</th>
                <th>上传胶囊</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in capsule">
                <td>{{ item.id }}</td>
                <td>{{ item.author }}</td>
                <td>{{ item.identity }}</td>
                <td>{{ item.authorType_title }}</td>
                <td>{{ item.capsuleNum }}</td>
                <td>
                  <!--<router-link :to="'/materials/edit/' + item.id">编辑</router-link>course/isReferedByCourse-->
                  <a href="#" @click.prevent="action('edit', item.id)">编辑&nbsp;&nbsp;</a>
                  <a href="#" @click.prevent="action('delete', item.id)">删除&nbsp;&nbsp;</a>
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
import config from 'lanmaLib/config'
import api from 'lanmaLib/common/api'
import helper from '../../helper'
import _ from 'lodash'

export default {
  data () {
    return {
      page: 0,
      pageCount: 1,
      loading: false,
      list: [],
      modal: {
        visible: false,
        title: '删除确认',
        message: '删除数据后将不能恢复，确定删除吗？'
      },
      actionType: '',
      actionId: '',
      amount: {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0
      },
      activeLink: 0,    // 选择类型
      searchKW: '',
      capsule: [],
      config
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
  watch: {
    searchKW () {
      this.search()
    }
  },
  methods: {
    getList (page = 1) {
      var statusTitle = config.author.type
      var sexTitle = config.author.sex
      var params = {}
      params.page = page
      params.offset = (page - 1) * 20
      params.length = 20
      params.authorType = this.activeLink ? this.activeLink : 0
      params.authorTypeList = [0]
      for (var a in config.author.type) {
        params.authorTypeList.push(a)
      }
      this.loading = true
      api.capsule.getCertificaList(params)
        .then((data) => {
          console.log(data)
          data.list.forEach(function (item) {
            item.authorType_title = statusTitle[item.authorType]
            item.sex_title = sexTitle[item.sex]
            return item
          })
          this.capsule = data.list
          this.loading = false
          this.page = page
          this.pageCount = Math.ceil(data.total / 20)
          for (var i = 0; i < data.authorTypeNumList.length; i++) {
            this.amount[i] = data.authorTypeNumList[i]
          }
        })
    },
    pages (page) {
      this.$router.push('/capsuleAuth/list/' + page)
      this.getList(page)
    },
    showModal (title, message) {
      this.modal.title = title
      this.modal.message = message
      this.modal.visible = true
    },
    action (type, id) {
      this.actionType = type
      this.actionId = id
      switch (this.actionType) {
        case 'edit':
          this.confirm()
          break
        case 'delete':
          this.showModal('删除确认', '课程资料删除后将不可恢复，确认删除？')
          break
        default:
          break
      }
    },
    confirm() {
      this.modal.visible = false
      switch (this.actionType) {
        case 'edit':
          var _this = this
          setTimeout(function() {
            _this.$router.push('/capsuleAuth/edit/' + _this.actionId)
          }, 100)
          break
        case 'delete':
          api.capsule.deleteCertifica(this.actionId).then(() => {
            var index = _.findIndex(this.capsule, {'id': this.actionId})
            this.capsule.splice(index, 1)
            helper.showSuccess('删除成功')
            this.close()
          })
          .catch((e) => {
            helper.showError(e.message)
          })
          break
        default:
          break
      }
    },
    close () {
      this.modal.visible = false
    },
    activeLinkChange (label) {
      if (this.activeLink !== label || this.searchKW.length !== 0) {
        this.activeLink = label
        this.getList()
        this.searchKW = ''
      }
    },
    search () {
      if (this.searchKW) {
        var statusTitle = config.author.type
        var sexTitle = config.author.sex
        api.capsule.findCertifica(this.searchKW).then(data => {
          console.log(data)
          data.list.forEach(function (item) {
            item.authorType_title = statusTitle[item.authorType]
            item.sex_title = sexTitle[item.sex]
            return item
          })
          this.capsule = data.list
          this.page = 1
          this.pageCount = 1
          this.activeLink = 0
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
.classify {
  padding: 15px 0;
}
.classify a, .classify span {
  margin-right: 10px;
}
.activeLink {
	color: #999;
}
</style>
