<template>
  <div @click="showMore=false;moreIndex=''">
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <div class="contentTop">
            <div class="newMaterials">
              <button class="button is-primary" @click="modalAdd.visible=true;">新建课程</button>
              <p>课程列表（{{total}}条）</p>
            </div>
            <div class="searchBox">
              <select v-model="search.user_id" class="select" @change="userIdChange(search.user_id)">
                <option :value="0">机构</option>
                <option :value="item.user_id" v-for="item in thirdPartyList">{{item.name}}</option>
              </select>
              <select v-model="search.status" class="select" @change="statusChange(search.status)">
                <option :value="0">状态</option>
                <option :value="key" v-for="value,key in statusMap" v-if="key!=9">{{value}}</option>
              </select>
              <select v-model="search.type" class="select" @change="activeLinkChange(search.type)">
                <option :value="0">类型</option>
                <option :value="key" v-for="value,key in searchType">{{value}}</option>
              </select>
              <p class="control has-addons">
                <input type="text" class="input" v-model="search.value" @keydown.enter="searchList" placeholder="请输入课程名称" />
                <button class="button is-primary" @click="searchList">搜索</button>
              </p>
            </div>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>课程名称</th>
                <th>机构名称</th>
                <th>老师</th>
                <th>类型</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item,index in list">
                <td>
                  <div class="title_td">
                    <div class="icon">
                      <span class="fa" :class="[item.labelScene==62?'fa-graduation-cap':item.labelScene==64?'fa-globe':'fa-globe']"></span>
                    </div>
                    <div class="cover">
                      <img :src="item.cover" @click="showBigImg(item.cover)" />
                    </div>
                    <div class="title">
                      <p class="info">{{ item.title }}</p>
                      <p class="createTime">开课时间：{{ editTimeList(item.lesson_time) }}</p>
                      <p class="createTime">课程ID：{{ item.id }}</p>
                    </div>
                  </div>
                </td>
                <td v-if="item.userId && thirdPartyListHash">{{ thirdPartyListHash[item.userId].name }}</td>
                <td>{{ getAgencyName(item.agency_id) }}</td>
                <td>{{ searchType[item.materialType] }}</td>
                <td>{{ statusMap[item.status] }}</td>
                <td class="editItem">
                  <a href="#" @click.prevent="edit(item.id, item.courseExtra)">查看信息</a>
                  <!--<a>课程链接</a>
                  <a href="#" @click.prevent="edit(item.id, item.courseExtra)">编辑</a>
                  <div class="moreBox">
                    <a class="more" @click.stop="showMore=!showMore;moreIndex=index">更多▼</a>
                    <div class="more_dialog" v-if="showMore && moreIndex==index">
                      <router-link :to="'/courses/applyList/' + item.id">客户列表</router-link><br>
                      <router-link :to="'/courses/data/' + item.id">课程数据</router-link><br>
                      <a href="#" @click.prevent="copy(item.id, item.materialType)">复制课程</a><br>
                      <a v-if="item.status==7" href="#" @click.prevent="cancel(item.id, item.materialType)">取消</a><br v-if="item.status==7" />
                      <a href="#" @click.prevent="remove(item.id, item.materialType)">删除</a><br>
                    </div>
                  </div>-->
                </td>
              </tr>
            </tbody>
          </table>
          <p style="text-align: center;font-size: 16px;color: #999;" v-if="list.length === 0">没有找到符合条件的课程</p>
          <pagination :index="page" :count="pageCount" :loading="loading" @change="pages(arguments[0])"></pagination>
        </article>
      </div>
    </div>
    <DialogModel :visible="modal.visible" @cancel="close" @close="close" @ok="confirm" :title="modal.title" transition="zoom">
      <div style="text-align: center;">
        {{ modal.message }}
      </div>
    </DialogModel>
    <DialogModel :visible="editModal.visible" @cancel="editClose" @close="editClose" @ok="editConfirm" :title="editModal.title" transition="zoom">
      <div style="text-align: center;">
        {{ editModal.message }}
      </div>
    </DialogModel>
    <DialogModel :visible="cancelModal.visible" @cancel="cancelClose" @close="cancelClose" @ok="cancelConfirm" :title="cancelModal.title" transition="zoom">
      <div style="text-align: center;">
        {{ cancelModal.message }}
      </div>
    </DialogModel>
    <DialogModel :visible="modalAdd.visible" @cancel="modalAdd.visible=false" @close="modalAdd.visible=false" @ok="modalAdd.visible=false" :title="modalAdd.title" :showFoot="false" transition="zoom">
      <div class="modalAdd">
        <div class="modalAddItem" @click="addCourses('/courses/add/0/1')">
          <!--<img src="../../../../../wechat/static/img/capsule/练习.png" />-->
          <div>
            <p>亲子互动课</p>
            <span>2小时以内</span>
          </div>
        </div>
        <div class="modalAddItem" @click="addCourses('/courses/add/0/2')">
          <!--<img src="../../../../../wechat/static/img/capsule/练习.png" />-->
          <div>
            <p>户外游学</p>
            <span>半天以上</span>
          </div>
        </div>
        <div class="modalAddItem" @click="addCourses('/courses/add/0/2')">
          <!--<img src="../../../../../wechat/static/img/capsule/练习.png" />-->
          <div>
            <p>培训辅导</p>
            <span>半天以上</span>
          </div>
        </div>
      </div>
    </DialogModel>
  </div>
</template>

<script>
import Cleave from 'vue-cleave'
import CardModal from 'components/widget/CardModal.vue'
import Pagination from 'components/Pagination'
import { mapGetters } from 'vuex'
import DialogModel from 'components/widget/DialogModal'
import 'cleave.js/dist/addons/cleave-phone.cn'
import timeModel from 'lanmaLib/time'
import api from 'lanmaLib/common/api'
import config from 'lanmaLib/config'
import ShowStatus from 'components/widget/ShowStatus.vue'
import helper from '../../../helper'
import _ from 'lodash'

export default {
  data () {
    return {
      page: 0,
      pageCount: 0,
      loading: false,
      list: [],
      Agencylist: [],
      modal: {
        visible: false,
        title: '删除确认',
        message: '删除数据后将不能恢复，确定删除吗？'
      },
      editModal: {
        visible: false,
        title: '编辑确认',
        message: '该课程已被添加到课程组合或被添加为商品，请务必谨慎操作！'
      },
      cancelModal: {
        visible: false,
        title: '取消确认',
        message: '取消后，该课程将对家长和老师不可见，确定要取消该课程？'
      },
      modalAdd: {
        visible: false,
        title: '选择类型',
        message: '删除数据后将不能恢复，确定删除吗？'
      },
      removeId: 0,
      editId: 0,
      cancelId: 0,
      cancelType: 1,
      removeType: 1,
      apiName: 'getList',
      activeLink: 62,
      search: {
        type: 0,
        value: '',
        status: 0,
        user_id: 0
      },
      showMore: false,
      moreIndex: '',
      total: 0,
      thirdPartyList: [],
      thirdPartyListHash: {}
    }
  },
  components: {
    Cleave,
    CardModal,
    Pagination,
    ShowStatus,
    DialogModel
  },
  watch: {
    // 需要侦听路由变化，来加载数据
    '$route' (to, from) {
      this.init()
    }
  },
  created () {
    var page = parseInt(this.$route.params.page)
    this.page = page || 1
    this.init()
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    }),
    searchType () {
      return this.$config.courses.type
    },
    searchValue () {
      return this.search.value
    },
    statusMap () {
      return this.$config.courses.status
    },
    params () {
      var params = {
        'title': this.search.value,
        'materialType': this.search.type ? this.search.type : 0,
        'offset': (this.page - 1) * 20,
        'length': 20,
        'status': this.search.status ? this.search.status : 0,
        'userId': this.search.user_id ? this.search.user_id : 0
      }
      return params
    }
  },
  methods: {
    init () {
      this.$axios.all([this.getThirdPartyList(), this.getAgencyList()])
        .then(() => {
          this.getList()
        })
    },
    getList () {
      this.loading = true
      api.superAdmin.adminGetCourseList(this.params)
        .then((data) => {
          this.loading = false
          this.list = data.list
          this.total = data.total
          this.pageCount = Math.ceil(data.total / 20)
        })
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
    searchList () {
//    this.search.type = 0
//    this.search.status = 0
      this.page = 1
      this.getList()
    },
    editTimeList: timeModel.editTimeList,
    pages (page) {
      this.page = page
      this.$router.push('/courses/list/' + page)
    },
    confirm () {
      var apiRouter = api.course
      if (this.removeType === 2) {
        apiRouter = api.course_tour
      }
      if (this.removeId) {
        apiRouter.delete(this.removeId).then(() => {
          _.remove(this.list, (item) => {
            return item.id === this.removeId
          })
          helper.showSuccess('删除成功')
          this.close()
        })
        .catch((e) => {
          this.close()
          if (e.code === 6050) {
            helper.showError('该课程已被添加为商品，无法删除')
          } else {
            helper.showError('删除失败，其他异常')
          }
        })
      }
    },

    remove (id, type) {
      this.modal.visible = true
      this.removeId = id
      this.removeType = type
    },

    cancel (id, type) {
      this.cancelModal.visible = true
      this.cancelId = id
      this.cancelType = type
    },

    copy (id, type) {
      this.cancelModal.visible = false
      let apiName = 'course'
      if (String(type) === '2') {
        apiName = 'course_tour'
      }
      api[apiName].copy(id).then(res => {
        helper.showSuccess('课程复制成功')
        this.$router.push('/courses/edit/' + res.id + '/info')
      }).catch(error => {
        helper.showError(error.msg)
      })
    },

    editConfirm () {
      if (this.editId) {
        var _this = this
        this.editModal.visible = false
        setTimeout(function() {
          _this.$router.push('/thirdParty/courseEdit/' + _this.editId + '/info')
        }, 100)
      }
    },

    cancelConfirm () {
      if (this.cancelId) {
        this.cancelModal.visible = false
        let apiName = 'course'
        if (String(this.cancelType) === '2') {
          apiName = 'course_tour'
        }
        api[apiName].cancel(this.cancelId).then(res => {
          var index = _.findIndex(this.list, {id: this.cancelId})
          this.list[index].status = 11
          this.list[index].status_title = config.status.course[11]
          helper.showSuccess('取消成功')
          this.cancelClose()
        })
      }
    },

    edit (id, isGoodsOrGroup) {
      this.editId = id
      if (isGoodsOrGroup) {
        // this.editModal.visible = true
        this.$router.push('/thirdParty/courseEdit/' + id + '/info')
      } else {
        this.$router.push('/thirdParty/courseEdit/' + id + '/info')
      }
    },

    close () {
      this.modal.visible = false
      this.removeId = 0
    },

    editClose () {
      this.editModal.visible = false
      this.editId = 0
    },
    cancelClose () {
      this.cancelModal.visible = false
      this.cancelId = 0
    },
    getAgencyName (id) {
      var item = _.find(this.Agencylist, {user_id: id})
      if (item) {
        return item.name
      } else {
        return ''
      }
    },
    getAgencyList () {
      var params = {
        userId: 0
      }
      return api.superAdmin.adminGetClassTeacherList(params).then((data) => {
        this.Agencylist = data.list
      })
    },
    activeLinkChange (label) {
      this.list = []
      this.page = 1
      this.search.value = ''
      this.getList()
    },
    statusChange (label) {
      this.list = []
      this.page = 1
      this.search.value = ''
      this.getList()
    },
    goto (url) {
      this.$router.push(url)
    },
    addCourses (url) {
      this.modalAdd.visible = false
      setTimeout(() => {
        this.$router.push(url)
      }, 100)
    },
    showBigImg (url) {
      helper.showBigImg(url)
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

.modal-wrap{
  text-align: center;
}
.footerslot label{
  margin-right: 20px;
}
.footerslot{
  margin-left: 10px;
}
.code-item{
  position: absolute;
  right: 10%;
  top: 40%;
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
}
.editItem>a{
  display: inline-block;
  padding: 0 10px 0 5px;
  border-right:1px solid #999;
  &:last-child{
    border-right:0px;
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
.moreBox{
  display: inline-block;
  position: relative;
  .more{
    padding: 0 10px 0 5px;
  }
  .more_dialog{
    text-align: center;
    width:90px;
    background: #FFF;
    z-index: 999;
    border: 1px solid #ddd;
    position: absolute;
    top:20px;
    right:0;
    display: inline-block;
    padding: 10px;
    a{
      display: inline-block;
      padding: 5px 0;
    }
  }
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
