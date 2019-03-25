<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <div class="contentTop">
            <div class="newMaterials">
              <button class="button is-primary" @click="goto('/courses/add/:material_id/:material_type')">新建课程</button>
              <p>课程列表（{{total}}条）</p>
            </div>
            <div class="searchBox">
              <select v-model="search.status" class="select" @change="statusChange(search.status)">
                <option :value="0">状态</option>
                <option :value="key" v-for="value,key in statusMap" v-if="key!=9">{{value}}</option>
              </select>
              <select v-model="search.type" class="select" @change="activeLinkChange(search.type)">
                <option :value="0">类型</option>
                <option :value="key" v-for="value,key in searchType">{{value}}</option>
              </select>
              <p class="control has-addons">
                <input type="text" class="input" v-model="search.value" placeholder="请输入课程名称" />
                <button class="button is-primary">搜索</button>
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
                <th>目的地</th>
                <!--<th v-if="activeLink == 64">时长</th>-->
                <!--<th v-if="activeLink == 62" is="ShowStatus" :statusList="durationStatusList" :statusText="'时长'" v-model="durationStatus" @input="getList(1)"></th>-->
                <th>时长</th>
                <th>渠道</th>
                <th>老师</th>
                <th>上课时间</th>
                <th>课程状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in list">
                <td>{{ item.id }}</td>
                <td>{{ item.title }}</td>
                <td>{{ item.lesson_location }}</td>
                <td>{{durationCount(item.duration)}}</td>
                <td>{{ getChannelName(item.channel_id) }}</td>
                <td>{{ getAgencyName(item.agency_id) }}</td>
                <td>{{ item.lesson_time_label }}</td>
                <td>{{ item.status_title }}</td>
                <td>
                  <a href="#" @click.prevent="edit(item.id, item.courseExtra)">编辑&nbsp;&nbsp;</a>
                  <a v-if="item.status==7" href="#" @click.prevent="cancel(item.id)">取消&nbsp;&nbsp;</a>
                  <a href="#" @click.prevent="remove(item.id, item.materialType)">删除&nbsp;&nbsp;</a>

                  <router-link :to="'/courses/edit/' + item.id + '/user'">客户列表&nbsp;&nbsp;</router-link>
                  <router-link v-if="item.courseExtra && 'goodsId' in item.courseExtra" :to="'/commodity/edit/' + item.courseExtra.goodsId">查看商品&nbsp;&nbsp;</router-link>
                  <router-link v-else :to="'/commodity/add/' + item.id">创建商品&nbsp;&nbsp;</router-link>
                  <!-- <a v-if="item.courseType==1" href="#" @click.prevent="createQrcode(item.id)">购买链接&nbsp;&nbsp;</a> -->
                  <a href="#" @click.prevent="copy(item.id, item.materialType)">复制&nbsp;&nbsp;</a>
                </td>
              </tr>
            </tbody>
          </table>
          <pagination :index="page" :count="pageCount" :loading="loading" @change="pages(arguments[0])"></pagination>
        </article>
      </div>
    </div>
    <card-modal :visible="modal.visible" @cancel="close" @close="close" @ok="confirm" :title="modal.title" transition="zoom">
      {{ modal.message }}
    </card-modal>
    <card-modal :visible="editModal.visible" @cancel="editClose" @close="editClose" @ok="editConfirm" :title="editModal.title" transition="zoom">
      {{ editModal.message }}
    </card-modal>
    <card-modal :visible="cancelModal.visible" @cancel="cancelClose" @close="cancelClose" @ok="cancelConfirm" :title="cancelModal.title" transition="zoom">
      {{ cancelModal.message }}
    </card-modal>
  </div>
</template>

<script>
import Cleave from 'vue-cleave'
import CardModal from '../../components/widget/CardModal.vue'
import Pagination from 'components/Pagination'
import { mapGetters } from 'vuex'

import 'cleave.js/dist/addons/cleave-phone.cn'

import api from 'lanmaLib/common/api'
import config from 'lanmaLib/config'
import ShowStatus from '../../components/widget/ShowStatus.vue'
import helper from '../../helper'
import _ from 'lodash'

export default {
  data () {
    return {
      total: 0,
      durationStatus: 0,
      durationStatusList: [{'text': '全部', 'value': '0'}, {'text': '1小时', 'value': '60'}, {'text': '2小时', 'value': '120'}],
      page: 0,
      pageCount: 0,
      loading: false,
      list: [],
      Agencylist: [],
      channelList: [],
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
      removeId: 0,
      editId: 0,
      cancelId: 0,
      removeType: 1,
      activeLink: 62,
      search: {
        type: 0,
        value: '',
        status: 0
      }
    }
  },
  components: {
    Cleave,
    CardModal,
    Pagination,
    ShowStatus
  },
  watch: {
    // 需要侦听路由变化，来加载数据
    '$route' (to, from) {
      this.init()
    },
    searchValue () {
      this.searchList()
    }
  },
  created () {
    var type = parseInt(this.$route.params.type)
    if (type === 64) {
      this.activeLink = 64
      this.search.type = 2
    } else if (type === 62) {
      this.activeLink = 62
      this.search.type = 1
    }
    this.init()
  },
  computed: {
    searchType () {
      return this.$config.courses.type
    },
    statusMap () {
      return this.$config.courses.status
    },
    ...mapGetters({
      userInfo: 'userInfo'
    }),
    params () {
      var params = {
        'title': this.search.value,
        'materialType': this.search.type ? this.search.type : 0,
        'offset': (this.page - 1) * 20,
        'length': 20,
        'status': this.search.status ? this.search.status : 0
      }
      return params
    },
    searchValue () {
      return this.search.value
    }
  },
  methods: {
    init () {
      var page = parseInt(this.$route.params.page)
      this.page = page || 1
      this.getList()
      this.getAgencyList()
      this.getChannelList()
    },
    getList () {
      var _this = this
      this.loading = true
      api.course.getList(this.params)
        .then((data) => {
          this.loading = false
          data.list.forEach(function (item) {
            item.status = parseInt(item.status)
            item.status_title = config.status.course[item.status]
            item.lesson_time_label = _this.editTime(item.lesson_time)
            return item
          })
          this.total = data.total
          this.list = data.list
          this.pageCount = Math.ceil(data.total / 20)
        })
    },
    searchList () {
      this.page = 1
      this.getList()
    },
    editTime (time) {
      var d = new Date(time)
      var week = d.getDay()
      var weekMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      var temp = time.split(' ')
      return temp[0] + '（' + weekMap[week] + '）' + temp[1].substring(0, 5)
    },
    pages (page) {
//    this.getList(page)
      this.$router.push('/courses/list/' + this.activeLink + '/' + page)
    },
    confirm () {
      var apiRouter = api.course
      if (String(this.removeType) === '2') {
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

    cancel (id) {
      this.cancelModal.visible = true
      this.cancelId = id
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
          _this.$router.push('/courses/edit/' + _this.editId + '/info')
        }, 100)
      }
    },

    cancelConfirm () {
      if (this.cancelId) {
        this.cancelModal.visible = false
        let apiName = 'course'
        if (String(this.activeLink) === '64') {
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
        this.editModal.visible = true
      } else {
        this.$router.push('/courses/edit/' + id + '/info')
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
    getChannelName (id) {
      var item = _.find(this.channelList, {user_id: id})
      if (item) {
        return item.name
      } else {
        return ''
      }
    },
    getAgencyList () {
      api.agency.getList().then((data) => {
        this.Agencylist = data.list
      })
    },
    getChannelList () {
      api.channel.getList().then((data) => {
        this.channelList = data.list
      })
    },
    durationCount (time) {
      if (time) {
        var d = time
        if (d <= 0) {
          return ''
        } else {
          var timeLabel = parseInt(d / 60) + '小时'
          if ((d % 60) !== 0) {
            timeLabel += (d % 60) + '分钟'
          }
          return timeLabel
        }
      }
    },
    activeLinkChange (label) {
      if (String(label) === '1') {
        this.activeLink = 62
      } else if (String(label) === '2') {
        this.activeLink = 64
      }
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
.searchBox{
  display: inline-block;
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
</style>
