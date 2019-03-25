<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <div class="pageTop">
            <button class="button is-primary" @click="goto('/capsule/plan/addPlan')">新建计划</button>
            <div class="tab">
              <template v-for="item,index in ageLabelMap">
                <a :class="[labelAge == item.id?'active': '']" @click="changeTabIndex(item.id)">{{item.title}}</a>
                <span v-if="index !== ageLabelMap.length - 1">|</span>
              </template>
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
              <th>第X周</th>
              <th>目标</th>
              <th>胶囊数</th>
              <th>已完成</th>
              <th>完成中</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item,index in list">
              <td>{{index + 1}}</td>
              <td>{{hashTable[item.labelTarget].title}}</td>
              <td>{{capsuleListExtent(item.capsuleList)}}</td>
              <td>{{item.completeNum}}</td>
              <td>{{item.receiveNum}}</td>
              <td>{{item.status == 1? '已发布': '草稿'}}</td>
              <td>
                <a href="#" @click.prevent="goto('/capsule/plan/editPlan/' + item.id)">编辑&nbsp;&nbsp;</a>
                <a href="#" @click.prevent="changeTargetOrder('up', index)">上移&nbsp;&nbsp;</a>
                <a href="#" @click.prevent="changeTargetOrder('down', index)">下移&nbsp;&nbsp;</a>
                <a href="#" @click.prevent="removeTarget(item.id, index)">删除</a>
              </td>
            </tr>
            </tbody>
          </table>
          <pagination :index="page" :count="pageCount" :loading="loading" @change="pages(arguments[0])"></pagination>
        </article>
      </div>
    </div>
    <card-modal :visible="modal.visible" @cancel="modal.visible = false" @close="modal.visible = false" @ok="confirm" :title="modal.title"  transition="zoom">
      {{ modal.message }}
    </card-modal>
  </div>
</template>

<script>
import api from 'lanmaLib/common/api'
// import helper from '../../helper'
import _ from 'lodash'
import Pagination from 'components/Pagination'
import labelModule from 'lanmaLib/modules/label'
import CardModal from '../../components/widget/CardModal.vue'
export default{
  components: {
    Pagination,
    CardModal
  },
  directives: {
  },
  data () {
    return {
      page: 1,
      pageCount: 1,
      loading: false,
      modal: {
        visible: false,
        title: '删除确认',
        message: '删除数据后将不能恢复，确定删除吗？'
      },
      list: [],
      hashTable: {},
      ageLabelMap: [],
      labelAge: 55,
      action: {
        id: 0,
        index: 0,
        type: ''
      }
    }
  },
  computed: {
  },
  created () {
    this.$axios.all([this.getLabelList()])
      .then(() => {
        this.getList()
      })
  },
  mounted () {
  },
  methods: {
    capsuleListExtent (list) {
      return _.compact(list).length
    },
    goto (url) {
      this.$router.push(url)
    },
    getLabelList () {
      return labelModule.getLabelList().then((labelList) => {
        this.hashTable = labelModule.getHashTable(labelList)
        this.ageLabelMap = labelModule.getLabel(2).childs
        this.ageLabelMap = this.ageLabelMap.slice(0, this.ageLabelMap.length - 1)
      })
    },
    getRootLabel () {
      return api.label.getRootLabel()
        .then((data) => {
          for (let i = 0; i < data.list.length; i++) {
            if (data.list[i].code === 'capsuleScenne') {
              this.capsuleScenneParent = data.list[i].id
            }
          }
          var List = labelModule.getLabel(this.capsuleScenneParent).childs
          var temp = {}
          for (let i = 0; i < List.length; i++) {
            temp[List[i].id] = List[i].title
          }
          this.capsuleScenneList = temp
        })
    },
    getList () {
      var params = {
        labelAge: this.labelAge,
        offset: (this.page - 1) * 20,
        length: 20
      }
      this.loading = true
      api.capsule.getTargetList(params)
        .then((data) => {
          this.list = data
          this.pageCount = Math.ceil(data.total / 20)
          this.loading = false
        })
    },
    pages (page) {
      this.page = page
      this.getList
    },
    changeTabIndex (index) {
      this.list = []
      this.labelAge = index
      this.page = 1
      this.getList()
    },
    removeTarget (id, index) {
      this.action.id = id
      this.action.index = index
      this.action.type = 'remove'
      this.modal.visible = true
    },
    changeTargetOrder (type, index) {
      switch (type) {
        case 'up':
          if (index <= 0) {
            return
          }
          api.capsule.changeTargetOrder(this.list[index].id, this.list[index - 1].id)
          let temp = this.list[index - 1]
          this.list.splice(index - 1, 1, this.list[index])
          this.list.splice(index, 1, temp)
          break
        case 'down':
          if (index >= this.list.length - 1) {
            return
          }
          api.capsule.changeTargetOrder(this.list[index].id, this.list[index + 1].id)
          let temp1 = this.list[index + 1]
          this.list.splice(index + 1, 1, this.list[index])
          this.list.splice(index, 1, temp1)
          break
        default:
          break
      }
    },
    confirm () {
      api.capsule.deleteTarget(this.action.id)
        .then((data) => {
          this.modal.visible = false
          this.list.splice(this.action.index, 1)
        })
    }
  },
  watch: {
  }
}
</script>

<style scoped lang="scss">
  .pageTop{
    display: flex;
    align-items: center;
  }
.tab{
  margin-left: 30px;
  display: inline-block;
  font-size: 16px;
  a{
    margin-right: 10px;
  }
  span{
    margin-right: 10px;
    color: #999;
  }
  .active{
    color: #999;
  }
}
</style>
