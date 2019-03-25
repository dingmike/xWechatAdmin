<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <h1 class="title">课程标签列表</h1>
          <div class="columns">
            <div class="column">
              <p class="control">
                <input class="input" v-model="search.keyword" type="text" placeholder="课程标签名称">
              </p>
            </div>
            <div class="column">
              <label-select :root="0" :selectCallback="selectCallback">
            </div>
            <div class="column">
              <p class="control">
                <a class="button is-info" @click="searchLabel">搜索</a>
                <button class="button is-link" @click="reset">取消</button>
              </p>
            </div>
            <div class="column"></div>
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
                <th>名称</th>
                <th>父标签</th>
                <th>描述</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in list">
                <td>{{ item.id }}</td>
                <td>{{ item.title }}</td>
                <td>{{ item.parent }}</td>
                <td>{{ item.description.default }}</td>
                <td>
                  <router-link :to="'/system/add_child_label/' + item.id">添加子标签</router-link>
                  <router-link :to="'/system/label_edit/' + item.id">编辑</router-link>
                  <a href="#" @click.prevent="remove(item.id)">删除</a>
                  <router-link :to="'/system/label_relate/' + item.id + '/2'" v-if="item.parent_id === 4">关联年龄</router-link>
                  <router-link :to="'/system/label_relate/' + item.id + '/1'" v-if="item.parent_id === 2">关联主题</router-link>
                </td>
              </tr>
            </tbody>
          </table>
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

import 'cleave.js/dist/addons/cleave-phone.cn'

import api from 'lanmaLib/common/api'
import helper from '../../helper'
import _ from 'lodash'
import labelModule from 'lanmaLib/modules/label'
import LabelSelect from 'components/widget/LabelSelect'

export default {
  data () {
    return {
      list: [],
      labelTree: {},
      modal: {
        visible: false,
        title: '删除确认',
        message: '删除数据后将不能恢复，确定删除吗？'
      },
      search: {
        keyword: '',
        parent_id: 0
      },
      removeId: 0
    }
  },
  components: {
    Cleave,
    CardModal,
    LabelSelect
  },
  created () {
    labelModule.getLabelList(true).then((list) => {
      this.labelTree = labelModule.getLabelTree(list)
      for (var i = 0; i < list.length; i++) {
        var label = list[i]
        label.parent = labelModule.getParentTitle(label.id)
      }
      this.list = list
    })
  },
  methods: {
    getList (param = {}) {
      var searchData = {search: param}
      api.label.getList(searchData)
        .then((data) => {
          var list = data.list
          this.labelTree = labelModule.getLabelTree(list)
          for (var i = 0; i < list.length; i++) {
            var label = list[i]
            label.parent = labelModule.getParentTitle(label.id)
          }
          this.list = list
        })
    },
    confirm () {
      if (this.removeId) {
        api.label.delete(this.removeId).then(() => {
          _.remove(this.list, (item) => {
            return item.id === this.removeId
          })
          this.close()
          this.$label.getLabelList(true)
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

    searchLabel () {
      var param = {}
      if (this.search.keyword !== '') {
        param.keyword = this.search.keyword
      }
      if (this.search.parent_id !== 0) {
        param.parent_id = this.search.parent_id
      }
      this.getList(param)
    },

    selectCallback (id) {
      this.search.parent_id = id
    },
    reset () {
      this.search.keyword = ''
      this.search.parent_id = 0
      this.getList()
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
