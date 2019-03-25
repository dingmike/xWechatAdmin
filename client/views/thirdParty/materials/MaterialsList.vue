<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <div class="contentTop">
            <div class="newMaterials">
              <button class="button is-primary" @click="modalAdd.visible=true;" :disabled="true">新建课件</button>
              <p>课件列表（{{total}}条）</p>
            </div>
            <div class="searchBox">
              <select v-model="search.user_id" class="select" @change="userIdChange(search.user_id)">
                <option :value="0">机构</option>
                <option :value="item.user_id" v-for="item in thirdPartyList">{{item.name}}</option>
              </select>
              <select v-model="search.type" class="select" @change="activeLinkChange(search.type)">
                <option :value="0">类型</option>
                <option :value="key" v-for="value,key in searchType">{{value}}</option>
              </select>
              <p class="control has-addons">
                <input type="text" class="input" v-model="search.value" @keydown.enter="searchList" placeholder="请输入课件名称" />
                <button class="button is-primary" @click="searchList">搜索</button>
              </p>
            </div>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>课件标题</th>
                <th>机构名称</th>
                <th>类型</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in list">
                <td>
                  <div class="title_td">
                    <div class="icon">
                      <span class="fa" :class="[item.materialType==1?'fa-graduation-cap':item.materialType==2?'fa-globe':'fa-globe']"></span>
                    </div>
                    <!--<div class="cover">-->
                      <!--<img :src="item.cover" />-->
                    <!--</div>-->
                    <div class="title">
                      <p class="info">{{ item.title }}</p>
                      <p class="createTime">上传时间：{{ editTimeList(item.created_at) }}</p>
                      <p class="createTime">课程ID：{{ item.id }}</p>
                    </div>
                  </div>
                </td>
                <td>{{ thirdPartyListHash[item.userId].name }}</td>
                <td>{{ searchType[item.materialType] }}</td>
                <td class="editItem">
                  <a href="#" @click.prevent="action('edit', item.id, item.materialType)">查看信息</a>
                  <!--<a href="#" @click.prevent="action('edit', item.id, item.materialType)">编辑</a>
                  <a @click="goto('/courses/add/' + item.id + '/' + [item.materialType == 1 ? '1' : '2'])">设置课程</a>
                  <a href="#" @click.prevent="action('delete', item.id, item.materialType)">删除</a>-->
                </td>
              </tr>
            </tbody>
          </table>
          <p style="text-align: center;font-size: 16px;color: #999;" v-if="list.length === 0">没有找到符合条件的课件</p>
          <pagination :index="page" :count="pageCount" :loading="loading" @change="pages(arguments[0])"></pagination>
        </article>
      </div>
    </div>
    <DialogModel :visible="modal.visible" @cancel="close" @close="close" @ok="confirm" :title="modal.title"  transition="zoom">
      <div style="text-align: center;">
        {{ modal.message }}
      </div>
    </DialogModel>
    <DialogModel :visible="modalAdd.visible" @cancel="modalAdd.visible=false" @close="modalAdd.visible=false" @ok="modalAdd.visible=false" :title="modalAdd.title" :showFoot="false" transition="zoom">
      <div class="modalAdd">
        <div class="modalAddItem" @click="addMaterials('/materials/add')">
          <img src="../../../../../wechat/static/img/capsule/练习.png" />
          <div>
            <p>亲子互动课</p>
            <span>2小时以内</span>
          </div>
        </div>
        <div class="modalAddItem" @click="addMaterials('/materials_tour/add')">
          <img src="../../../../../wechat/static/img/capsule/练习.png" />
          <div>
            <p>户外游学</p>
            <span>半天以上</span>
          </div>
        </div>
      </div>
    </DialogModel>
  </div>
</template>

<script>
import Cleave from 'vue-cleave'
import Pagination from 'components/Pagination'
import DialogModel from 'components/widget/DialogModal'
import 'cleave.js/dist/addons/cleave-phone.cn'

import api from 'lanmaLib/common/api'
import helper from '../../../helper'
import _ from 'lodash'
import timeModel from 'lanmaLib/time'

export default {
  data () {
    return {
      page: 0,
      pageCount: 0,
      loading: false,
      list: [],
      total: 0,
      modal: {
        visible: false,
        title: '删除确认',
        message: '删除数据后将不能恢复，确定删除吗？'
      },
      modalAdd: {
        visible: false,
        title: '选择类型',
        message: '删除数据后将不能恢复，确定删除吗？'
      },
      actionType: '',
      actionId: '',
      activeLink: 62,
      activeApiName: 'material',
      flag: true,
      search: {
        type: 0,
        value: '',
        user_id: 0
      },
      thirdPartyList: [],
      thirdPartyListHash: {}
    }
  },
  computed: {
    searchType () {
      return this.$config.courses.type
    },
    searchValue () {
      return this.search.value
    },
    params () {
      var params = {
        'title': this.search.value,
        'materialType': this.search.type ? this.search.type : 0,
        'offset': (this.page - 1) * 20,
        'length': 20,
        'userId': this.search.user_id ? this.search.user_id : 0
      }
      return params
    }
  },
  components: {
    Cleave,
    Pagination,
    DialogModel
  },
  created () {
    var page = parseInt(this.$route.params.page)
    this.page = page || 1
//  var type = parseInt(this.$route.params.type)
//  if (type === 64) {
//    this.activeLink = 64
//    this.apiName = 'material_tour'
//  } else {
//    this.activeLink = 62
//    this.apiName = 'material'
//  }
    this.$axios.all([this.getThirdPartyList()])
      .then(() => {
        this.getList()
      })
  },
  watch: {
  },
  methods: {
    getList () {
      this.loading = true
      api.superAdmin.adminGetMaterialList(this.params)
        .then((data) => {
          this.list = data.list
          this.total = data.total
          this.loading = false
          this.pageCount = Math.ceil(data.total / 20)
        })
    },
    searchList () {
      this.page = 1
      this.getList()
    },
    getThirdPartyList () {
      var params = {
        offset: 0,
        length: 0
      }
      return api.superAdmin.getThirdPartyList(params)
        .then((data) => {
          this.thirdPartyList = data.list
          for (let i = 0; i < data.list.length; i++) {
            this.thirdPartyListHash[data.list[i].user_id] = data.list[i]
          }
        })
    },
    pages (page) {
      this.page = page
      this.$router.push('/materials/list/' + page)
      this.getList()
    },
    showModal (title, message) {
      this.modal.title = title
      this.modal.message = message
      this.modal.visible = true
    },
    action (type, id, scene) {
      this.actionType = type
      this.actionId = id
      if (String(scene) === '1') {
        this.activeApiName = 'material'
      } else {
        this.activeApiName = 'material_tour'
      }
      switch (this.actionType) {
        case 'edit':
          if (scene === 1) {
            api.material.checkRefered(this.actionId).then(res => {
              if (res) {
                this.showModal('编辑确认', '此课程资料正在使用中，请务必谨慎操作。')
              } else {
                this.confirm()
              }
            })
          } else if (scene === 2) {
            this.$router.push('/thirdParty/materialsEditTour/' + this.actionId)
          }
          break
        case 'delete':
          api.material.checkRefered(this.actionId).then(res => {
            if (res) {
              helper.showError('此课程资料正在使用中，不能删除')
            } else {
              this.showModal('删除确认', '课程资料删除后将不可恢复，确认删除？')
            }
          })
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
            _this.$router.push('/thirdParty/materialsEdit/' + _this.actionId)
          }, 100)
          break
        case 'delete':
          api[this.activeApiName].delete(this.actionId).then(() => {
            var index = _.findIndex(this.list, {'id': this.actionId})
            this.list.splice(index, 1)
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
//    label = parseInt(label)
//    if (label === 62) {
//      this.apiName = 'material'
//    } else if (label === 64) {
//      this.apiName = 'material_tour'
//    } else if (label === 0) {
//      this.apiName = 'material'
//    }
      this.list = []
      this.page = 1
      this.getList()
      this.search.value = ''
    },
    goto (url) {
      this.$router.push(url)
    },
    editTimeList: timeModel.editTimeList,
    addMaterials (url) {
      this.modalAdd.visible = false
      setTimeout(() => {
        this.$router.push(url)
      }, 100)
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
.activeLink {
  color: #999;
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

.contentTop{
  margin-bottom: 10px;
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
.editItem{
  a{
    display: inline-block;
    padding: 0 10px 0 5px;
    border-right:1px solid #999;
  }
  a:last-child{
    border-right: 1px solid #fff;
  }
}
.title_td{
  display: flex;
  align-items: center;
  .icon{
    display: inline-block;
    margin-right: 10px;
  }
  .title{
    display: inline-block;
    font-family: "microsoft yahei";
    font-weight: 400;
    font-size: 16px;
    color: #000;
    line-height: 20px;
    .createTime{
      color: #999;
    }
    .info{

    }
  }
  .cover{
    display: inline-block;
    margin-right: 10px;
    img{
      width:80px;
    }
  }
}
td{
  vertical-align: middle;
}
.modalAdd{
  display: flex;
  justify-content: space-around;
}
.modalAddItem{
  margin-top: 20px;
  text-align: center;
  &:hover{
    cursor: pointer;
  }
  img{
    width:60px;
  }
  p{
    color: #333;
    font-size: 18px;
  }
  span{
    font-size: 15px;
    color: #999;
  }
}
</style>
