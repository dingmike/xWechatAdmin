<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <div class="tile classify">
            <a :class="{'activeLink':activeLink == 1}" @click="activeLinkChange(1)">心迹认证</a>
            <!--<span>|</span>
            <a :class="{'activeLink':activeLink == 2}" @click="activeLinkChange(2)">机构老师</a>-->
          </div>
          <!--<div class="columns">
            <div class="column">
              <p class="control has-addons">
                <input class="input" type="text" placeholder="机构名称">
                <a class="button is-info">搜索</a>
              </p>
            </div>
          </div>-->
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
                <th v-if="activeLink == 2">所属机构</th>
                <th>课程资料数</th>
                <th>课程数</th>
                <th>认证</th>
                <th>申请</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in list">
                <td>{{ item.user_id }}</td>
                <td>{{ item.name }}</td>
                <td v-if="activeLink == 2">{{thirdPartyList[item.thirdPartyId].name}}</td>
                <td>{{ item.material_num }}</td>
                <td>{{ item.course_num }}</td>
                <td>{{ item.checked_title }}</td>
                <td>{{ item.status_title }}</td>
                <td>
                  <router-link :to="'/agencies/' + [activeLink == 2?'thirdPartyEdit':'edit']+'/' + [activeLink == 2?item.id:item.user_id]">编辑</router-link>
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
      modal: {
        visible: false,
        title: '删除确认',
        message: '删除数据后将不能恢复，确定删除吗？'
      },
      removeId: 0,
      activeLink: 1,
      thirdPartyList: {}
    }
  },
  components: {
    Cleave,
    CardModal
  },
  created () {
    this.getThirdPartyList()
  },
  methods: {
    getList () {
      var checkedTitle = ['未认证', '通过', '不通过']
      var statusTitle = ['已申请', '通过', '不通过']
      if (String(this.activeLink) === '1') {
        api.agency.getList()
        .then((data) => {
          data.list.forEach(function (item) {
            item.checked_title = checkedTitle[item.checked]
            item.status_title = statusTitle[item.status]
            return item
          })
          this.list = data.list
        })
      } else {
        api.superAdmin.getThirdPartyTeacherList()
          .then((data) => {
            data.list.forEach(function (item) {
              item.checked_title = checkedTitle[item.checked]
              item.status_title = statusTitle[item.status]
              return item
            })
            this.list = data.list
          })
      }
    },
    getThirdPartyList () {
      var params = {
        offset: 0,
        length: 0
      }
      api.superAdmin.getThirdPartyList(params)
        .then((data) => {
          var temp = {}
          for (var i = 0; i < data.list.length; i++) {
            temp[data.list[i].user_id] = data.list[i]
          }
          this.thirdPartyList = temp
          console.log(temp)
          this.getList()
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
</style>
