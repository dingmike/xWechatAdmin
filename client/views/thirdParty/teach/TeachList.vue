<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <div class="contentTop">
            <div class="newMaterials">
              <!--<button class="button is-primary" @click="modalAdd.visible=true;"></button>-->
              <p>老师列表（{{total}}条）</p>
            </div>
            <div class="searchBox">
              <select v-model="search.user_id" class="select" @change="userIdChange(search.user_id)">
                <option :value="0">机构</option>
                <option :value="item.user_id" v-for="item in thirdPartyList">{{item.name}}</option>
              </select>
              <p class="control has-addons">
                <input type="text" class="input" v-model="search.value" placeholder="请输入老师名称(暂不支持搜索)" />
                <button class="button is-primary" :disabled="true">搜索</button>
              </p>
            </div>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>名称</th>
                <th>所属机构</th>
                <th>联系电话</th>
                <th>课程资料数</th>
                <th>课程数</th>
                <th>认证</th>
                <th>申请</th>
                <!--<th>操作</th>-->
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in list">
                <td>{{ item.user_id }}</td>
                <td>{{ item.name }}</td>
                <td>{{thirdPartyList[item.thirdPartyId].name}}</td>
                <td>{{item.phone}}</td>
                <td>{{ item.material_num }}</td>
                <td>{{ item.course_num }}</td>
                <td>{{ item.checked_title }}</td>
                <td>{{ item.status_title }}</td>
                <!--<td>
                  <router-link :to="'/agencies/' + [activeLink == 2?'thirdPartyEdit':'edit']+'/' + [activeLink == 2?item.id:item.user_id]">编辑</router-link>
                  <a href="#" @click.prevent="remove(item.user_id)">删除</a>
                </td>-->
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
import CardModal from 'components/widget/CardModal.vue'

import 'cleave.js/dist/addons/cleave-phone.cn'

import api from 'lanmaLib/common/api'
import helper from '../../../helper'
import _ from 'lodash'

export default {
  data () {
    return {
      total: 0,
      list: [],
      modal: {
        visible: false,
        title: '删除确认',
        message: '删除数据后将不能恢复，确定删除吗？'
      },
      removeId: 0,
      activeLink: 1,
      thirdPartyList: {},
      search: {
        user_id: 0,
        value: ''
      }
    }
  },
  computed: {
    params () {
      var params = {
        'userId': this.search.user_id ? this.search.user_id : 0
      }
      return params
    }
  },
  components: {
    Cleave,
    CardModal
  },
  created () {
    this.$axios.all([this.getThirdPartyList()])
      .then(() => {
        this.getList()
      })
  },
  methods: {
    getList () {
      var checkedTitle = ['未认证', '通过', '不通过']
      var statusTitle = ['已申请', '通过', '不通过']
      api.superAdmin.adminGetClassTeacherList(this.params)
        .then((data) => {
          data.list.forEach(function (item) {
            item.checked_title = checkedTitle[item.checked]
            item.status_title = statusTitle[item.status]
            return item
          })
          this.total = data.total
          this.list = data.list
        })
    },
    getThirdPartyList () {
      var params = {
        offset: 0,
        length: 0
      }
      return api.superAdmin.getThirdPartyList(params)
        .then((data) => {
          var temp = {}
          for (var i = 0; i < data.list.length; i++) {
            temp[data.list[i].user_id] = data.list[i]
          }
          this.thirdPartyList = temp
        })
    },
    confirm () {
      if (String(this.activeLink) === '2') {
        this.close()
        helper.showError('你没有权限进行该操作！')
        return
      }
      if (this.removeId) {
        api.agency.delete(this.removeId).then(() => {
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
    activeLinkChange (active) {
      this.activeLink = active
      this.list = []
      this.getList()
    },
    userIdChange (id) {
      this.list = []
      this.page = 1
      this.search.value = ''
      this.getList()
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
.classify{
  display: inline-block;
  margin-right: 30px;
  a{
    font-size: 18px;
  }
  span{
    font-size: 18px;
    display: inline-block;
    margin: 0 10px;
  }
}
.activeLink {
  color: #999;
}
.contentTop{
  margin-bottom: 30px;
  position: relative;
  .newMaterials{
    display: inline-block;
    button{
      font-size: 16px;
      padding: 1px 20px;
      margin-top: 0;
      margin-bottom: 10px;
    }
    p{
      color: #999;
    }
  }
  .searchBox{
    position: absolute;
    top: 0;
    right: 30px;
    display: inline-block;
    select{
      margin-right: 10px;
    }
    p{
      display: inline-flex;
    }
    input[type='text']{
      width:300px;
      margin-right: 10px;
    }
  }
}
</style>
