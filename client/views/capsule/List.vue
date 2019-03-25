<template>
  <div>
  	<div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <!-- <h1 class="title">渠道列表</h1> -->
          <div class="columns">
            <div class="column searchBox">
              <label-select-tour :selectText="'目标'" :root="1" :value="defaults.target" :selectCallback="selectCallbackTarget" />
              <!--<label-select-tour :selectText="'年龄'" :root="2" :value="defaults.age" :selectCallback="selectCallbackAge" />-->
              <select class="select" style="padding-left: 5px;" v-model="search.labelAge">
                <option :value="0">年龄</option>
                <option :value="label.id" v-for="label in ageLabel">{{label.title}}</option>
              </select>

              <select v-model="search.capsuleType" class="select" style="padding-left: 5px;">
                <option :value="0">胶囊库：全部</option>
                <option :value="key" v-for="value,key in searchTypeMap">{{value}}</option>
              </select>

              <select class="select" v-model="search.sceneType">
                <option :value="0">类型</option>
                <option :value="1">一起玩</option>
                <option :value="2">一起看</option>
                <option :value="3">一起聊</option>
              </select>

              <select class="select" style="padding-left: 5px;" v-model="search.labelScene">
                <option :value="0">场景</option>
                <option :value="key" v-for="value,key in capsuleScenneList">{{value}}</option>
              </select>

              <select class="select" v-model="search.status">
                <option :value="0">状态</option>
                <option :value="key" v-for="value,key in config.author.status">{{value}}</option>
              </select>

              <p class="control has-addons">
                <input class="input" type="text" v-model="search.key" placeholder="胶囊ID/标题" @keydown.enter="searchList">
                <a class="button is-info" @click="searchList">搜索</a>
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
        	  <a :class="{'activeLink':search.status === 0}" @click="activeLinkChange(0)">全部（{{amount[0]}}）</a>
        	  <template v-for="value,key in config.author.status">
        	    <span>|</span>
        	    <a :class="{'activeLink':search.status === key}" @click="activeLinkChange(key)">{{value}}（{{amount[key]}}）</a>
        	  </template>
        	</div>
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>话题</th>
                <!--<th>作者</th>-->
                <!--<th>显示顺序</th>-->
                <th>点击UV</th>
                <th>打卡</th>
                <th>分享</th>
                <th>收藏</th>
                <th>场景</th>
                <th>目标</th>
                <th>年龄</th>
                <th>上传人</th>
                <th>审核状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in capsule">
                <td>{{ item.id }}</td>
                <td>{{ item.topic }}</td>
                <!--<td v-if="item.authorId_title">{{ item.authorId_title }}</td>-->
                <td>{{ item.clickNum }}</td>
                <td>{{ item.exerciseAnsNum }}</td>
                <td>{{ item.shareNum }}</td>
                <td>{{ item.collectNum }}</td>
                <td>{{ item.labelScene_title.join('、') }}</td>
                <td>{{ item.labelTarget_title.length < 3?item.labelTarget_title.join('、'):item.labelTarget_title[0] + '、' + item.labelTarget_title[1] + '...'  }}</td>
                <td>{{countAgeTitle(item.labelAge)}}</td>
                <td>{{ item.uploader }}</td>
                <!--<td>{{ item.display_order }}</td>-->
                <td>{{ item.status_title }}</td>
                <td>
                  <!--<router-link :to="'/materials/edit/' + item.id">编辑</router-link>course/isReferedByCourse-->
                  <a href="#" @click.prevent="action('edit', item.id, 'info')">编辑&nbsp;&nbsp;</a>
                  <a href="#" @click.prevent="action('edit', item.id, 'data')">内容数据&nbsp;&nbsp;</a>
                  <a href="#" @click.prevent="action('delete', item.id)">删除</a>
                </td>
              </tr>
            </tbody>
          </table>
          <pagination :index="search.page" :count="pageCount" :loading="loading" @change="pages(arguments[0])"></pagination>
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
import labelModule from 'lanmaLib/modules/label'
import 'cleave.js/dist/addons/cleave-phone.cn'
import config from 'lanmaLib/config'
import api from 'lanmaLib/common/api'
import helper from '../../helper'
import _ from 'lodash'
import LabelSelectTour from 'components/widget/LabelSelectTour'

export default {
  data () {
    return {
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
      actionTab: '',
      amount: {
        0: 0,
        1: 0,
        2: 0,
        3: 0
      },
      defaults: {
        target: 0,
        age: 0
      },
      search: {
        capsuleType: 0,
        status: 0,
        labelTarget: 0,
        labelAge: 0,
        sceneType: 0,
        labelScene: 0,
        key: '',
        page: 1
      },
      searchTypeMap: {1: '胶囊库：发现', 2: '胶囊库：计划'},
      capsule: [],
      capsuleScenneList: [],
      config,
      authorTable: [],
      hashTable: [],
      capsuleScenneParent: 0,
      ageLabel: []
    }
  },
  components: {
    Cleave,
    CardModal,
    Pagination,
    LabelSelectTour
  },
  created () {
    var filter = decodeURIComponent(this.$route.params.filter)
    this.setFilter(filter)
    var params = {
      offset: 0,
      length: 0,
      authorType: 0,
      authorTypeList: [0, 1, 2]
    }
    api.label.getRootLabel()
      .then((data) => {
        this.rootLabel = data.list
        for (var i = 0; i < data.list.length; i++) {
          if (data.list[i].code === 'capsuleScenne') {
            this.capsuleScenneParent = data.list[i].id
          }
        }
        api.capsule.getCertificaList(params)
          .then((data) => {
            var temp = {}
            data.list.forEach(function (item) {
              temp[item.id] = item.author
            })
            this.authorTable = temp
            labelModule.getLabelList().then((labelList) => {
              this.ageLabel = labelModule.getLabel(2).childs
              this.ageLabel = this.ageLabel.slice(0, this.ageLabel.length - 1)
              var List = labelModule.getLabel(this.capsuleScenneParent).childs
              this.hashTable = labelModule.getHashTable(labelList)
              var temp = {}
              for (var i = 0; i < List.length; i++) {
                temp[List[i].id] = List[i].title
              }
              this.capsuleScenneList = temp
              this.getList()
            })
          })
      })
  },
  computed: {
    params () {
      var params = {
        offset: (this.search.page - 1) * 20,
        length: 20,
        status: this.search.status,
        capsuleType: this.search.capsuleType,
        labelTarget: this.search.labelTarget,
        labelAge: this.search.labelAge,
        sceneType: this.search.sceneType,
        key: this.search.key,
        labelScene: this.search.labelScene
      }
      params.statusList = [0]
      for (var a in config.author.status) {
        params.statusList.push(a)
      }
      return params
    }
  },
  watch: {
    search: {
      handler: function(val) {
        var filter = val
        this.$router.push('/capsule/list/' + encodeURIComponent(JSON.stringify(filter)))
        this.capsule = []
        this.getList()
      },
      deep: true
    }
  },
  methods: {
    setFilter (filter) {
      try {
        var temp = JSON.parse(filter)
        this.search = temp
        this.defaults = {
          target: temp.labelTarget,
          age: temp.labelAge
        }
      } catch (e) {
      }
    },
    getList () {
      var statusTitle = config.author.status
      this.loading = true
      var _this = this
      api.capsule.getCapsuleList(this.params)
        .then((data) => {
          console.log(data)
          data.list.forEach(function (item) {
            item.status_title = statusTitle[item.status]
            item.labelScene_title = []
            item.labelTarget_title = []
            item.authorId_title = _this.authorTable[item.authorId]
            for (let i = 0; i < item.labelTarget.length; i++) {
              if (_this.hashTable[item.labelTarget[i]]) {
                item.labelTarget_title.push(_this.hashTable[item.labelTarget[i]].title)
              }
            }
            // item.labelTarget_title = _this.hashTable[item.labelTarget].title
            for (let i = 0; i < item.labelScene.length; i++) {
              if (_this.capsuleScenneList[item.labelScene[i]]) {
                item.labelScene_title.push(_this.capsuleScenneList[item.labelScene[i]])
              }
            }
            return item
          })
          this.capsule = data.list
          this.loading = false
          this.pageCount = Math.ceil(data.total / 20)
          for (var i = 0; i < data.statusList.length; i++) {
            this.amount[i] = data.statusList[i]
          }
        })
    },
    pages (page) {
      this.search.page = page
      this.getList()
    },
    showModal (title, message) {
      this.modal.title = title
      this.modal.message = message
      this.modal.visible = true
    },
    action (type, id, tab) {
      this.actionType = type
      this.actionId = id
      this.actionTab = tab
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
            _this.$router.push('/capsule/edit/' + _this.actionId + '/' + _this.actionTab)
          }, 100)
          break
        case 'delete':
          api.capsule.deleteCapsule(this.actionId).then(() => {
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
      this.search.status = label
      this.capsule = []
      this.getList()
    },
    searchList () {
      this.search.page = 1
      this.capsule = []
      this.getList()
      // if (this.searchKW) {
      //   var statusTitle = config.author.status
      //   var _this = this
      //   api.capsule.findCapsule(this.searchKW).then(data => {
      //     console.log(data)
      //     data.list.forEach(function (item) {
      //       item.status_title = statusTitle[item.status]
      //       item.labelScene_title = []
      //       item.authorId_title = _this.authorTable[item.authorId]
      //       for (var i = 0; i < item.labelScene.length; i++) {
      //         item.labelScene_title.push(_this.capsuleScenneList[item.labelScene[i]])
      //       }
      //       return item
      //     })
      //     this.capsule = data.list
      //     this.page = 1
      //     this.pageCount = 1
      //     this.activeLink = 0
      //   })
      // } else {
      //   this.getList()
      // }
    },
    selectCallbackTarget (id) {
      this.search.labelTarget = id
    },
    selectCallbackAge (id) {
      this.search.labelAge = id
    },
    countAgeTitle (ageList) {
      if (ageList.length === 0 || this.hashTable.length === 0) {
        return ''
      }
      var ageListTemp = []
      for (let i = 0; i < ageList.length; i++) {
        var temp = this.hashTable[ageList[i]].code.split('_')
        ageListTemp.push(parseInt(temp[0]))
        ageListTemp.push(parseInt(temp[1]))
      }
      ageListTemp.sort(function (a, b) {
        return a - b
      })
      console.log(ageListTemp)
      return ageListTemp[0] + '-' + ageListTemp[ageListTemp.length - 1] + '岁'
    }
  }
}
</script>

<style scoped lang="scss">
  .select{
    height:28px;
    margin-right: 10px;
  }
.button {
  margin: 5px 0 0;
}
.label-select-tour{
  display: inline-block;
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
  .searchBox{
    display: flex;
    align-items: center;
    p{
      display: inline-block;
      margin-bottom: 0;
      line-height: 1;
      vertical-align: top;
    }
  }
</style>
