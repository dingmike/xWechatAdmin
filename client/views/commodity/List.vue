<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <!-- <h1 class="title">渠道列表</h1> -->
          <div class="columns">
            <div class="column">
              <p class="control has-addons">
                <input class="input" type="text" v-model="searchKW" placeholder="商品ID/名称">
                <a class="button is-info">搜索（已支持）</a>
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
                <!--<th v-for="item in thList">{{ item }}</th>-->
                <th>序号</th>
                <th>名称</th>
                <th is="ShowStatus" :statusList="goodsTypeStatusList" :statusText="'类型'" v-model="goodsTypeStatus" @input="getList(1)"></th>
                <th>原价（元）</th>
                <th>售价（元）</th>
                <th>已售</th>
                <th>库存</th>
                <th is="ShowStatus" :statusList="statusList" :statusText="'状态'" v-model="status" @input="getList(1)"></th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in list">
                <td>{{ item.id }}</td>
                <!--<td>{{ item.number }}</td>-->
                <td>{{ item.name }}</td>
                <td>{{ goodsTypeMap[item.goodsType] }}</td>
                <td>{{ item.originalPrice }}</td>
                <td>{{ item.price }}</td>
                <td>
                  <router-link v-if="(item.salesCount + item.reserveCount)>0" :to="'/commodity/record/' + item.id">
                    <a>{{ item.salesCount + item.reserveCount }}</a>
                  </router-link>
                  <span v-else>{{ item.salesCount + item.reserveCount }}</span>
                </td>
                <td>{{ item.stock }}</td>
                <td>{{ statusMap[item.status] }}</td>
                <td>
                  <router-link v-if="item.goodsType==1 || item.goodsType==3" :to="'/commodity/single_detail/' + item.courseId + '/info'"> 课程详情&nbsp;&nbsp; </router-link>
                  <router-link v-if="item.goodsType==2" :to="'/commodity/group_detail/' + item.courseId"> 课程详情&nbsp;&nbsp; </router-link>
                  <router-link :to="'/commodity/edit/' + item.id"> 编辑&nbsp;&nbsp; </router-link>
                  <a href="#" @click.prevent="createQrcode(item.id)">购买链接&nbsp;&nbsp; </a>
                  <router-link :to="'/commodity/channel/' + item.id"> 渠道&nbsp;&nbsp; </router-link>
                  <a href="#" v-if="item.status!=2" @click.prevent="action('delete', item.id)"> 删除&nbsp;&nbsp; </a>
                  <a href="#" v-if="item.status==1" @click.prevent="action('startSell', item.id)"> 上架&nbsp;&nbsp; </a>
                  <a href="#" v-if="item.status==2" @click.prevent="action('endSell', item.id)"> 下架&nbsp;&nbsp; </a>
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
    <card-modal :visible="codeModal.visible" @close="codeModal.visible=false" @cancel="codeModal.visible=false" @ok="codeModal.visible=false" :title="codeModal.title"
      :okText="codeModal.okText" :cancelText="codeModal.cancelText" transition="zoom">
      <div class="modal-wrap">
        <img :src="codeModal.imgSrc" alt=""><br>
        <a>{{ codeModal.url }}</a>
      </div>
    </card-modal>
  </div>
</template>

<script>
// import Cleave from 'vue-cleave'
import CardModal from '../../components/widget/CardModal.vue'
import ShowStatus from '../../components/widget/ShowStatus.vue'
import Pagination from 'components/Pagination'

// import 'cleave.js/dist/addons/cleave-phone.cn'

import api from 'lanmaLib/common/api'
import helper from '../../helper'
import _ from 'lodash'

export default {
  data () {
    return {
      goodsTypeStatus: 0,
      goodsTypeStatusList: [{'text': '全部', 'value': '0'}, {'text': '体验坊', 'value': '1'}, {'text': '组合', 'value': '2'}, {'text': '游学营', 'value': '3'}],
      status: 0,
      page: 0,
      pageCount: 0,
      loading: false,
      actionType: '',
      actionId: '',
      statusList: [{'text': '全部', 'value': '0'}, {'text': '未上架', 'value': '1'}, {'text': '在售', 'value': '2'}, {'text': '售罄', 'value': '3'}, {'text': '过期', 'value': '4'}],
      statusMap: ['全部', '未上架', '在售', '售罄', '过期'],
      stopSellNmuber: '1',
      startSellNmuber: '2',
      thList: ['序号', '名称', '类型', '原价（元）', '售价（元）', '已售', '库存'],
      goodsTypeMap: ['', '体验坊', '组合', '游学营'],
      list: [],
      searchKW: '',
      modal: {
        visible: false,
        title: '开售确认',
        message: '确定要开启销售吗？'
      },
      codeModal: {
        visible: false,
        okText: '确定',
        cancelText: '取消',
        title: '购买链接',
        url: '',
        imgSrc: ''
      }
    }
  },
  components: {
    CardModal,
    ShowStatus,
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
    pages (page) {
      this.$router.push('/commodity/list/' + page)
      this.getList(page)
    },
    getList (page = 1) {
      var params = {}
      params.page = page
      params.status = this.status
      params.offset = (page - 1) * 20
      params.length = 20
      params.goodsType = this.goodsTypeStatus
      this.loading = true
      api.commodity.getList(params)
        .then((data) => {
          this.list = data.list
          this.loading = false
          this.page = page
          this.pageCount = Math.ceil(data.total / 20)
        })
    },
    action (type, id) {
      this.actionType = type
      this.actionId = id
      switch (this.actionType) {
        case 'startSell':
          this.showModal('上架确认', '确认上架销售？')
          break
        case 'endSell':
          this.showModal('下架确认', '确认下架？')
          break
        case 'delete':
          this.showModal('删除确认', '商品删除后将不可恢复，确认删除？')
          break
        default:
          break
      }
    },
    showModal (title, message) {
      this.modal.title = title
      this.modal.message = message
      this.modal.visible = true
    },
    confirm() {
      this.modal.visible = false
      switch (this.actionType) {
        case 'startSell':
          api.commodity.startSell(this.actionId).then((data) => {
            var index = _.findIndex(this.list, {'id': this.actionId})
            this.list[index].status = this.startSellNmuber
            helper.showSuccess('上架成功')
          }).catch((error) => {
            if (error.code === 6050) {
              helper.showError('包含正在销售的课程，不能重复上架销售')
            } else {
              helper.showError('上架失败，其他异常')
            }
          })
          break
        case 'endSell':
          api.commodity.endSell(this.actionId).then((data) => {
            var index = _.findIndex(this.list, {'id': this.actionId})
            this.list[index].status = this.stopSellNmuber
            helper.showSuccess('下架成功')
          }).catch(() => {
            helper.showError('下架失败')
          })
          break
        case 'delete':
          api.commodity.delete(this.actionId).then((data) => {
            var index = _.findIndex(this.list, {'id': this.actionId})
            this.list.splice(index, 1)
            helper.showSuccess('删除成功')
          }).catch((error) => {
            if (error.code === 6046) {
              helper.showError('该商品已有销售记录，无法删除！')
            } else {
              helper.showError('删除失败，其他异常')
            }
          })
          break
        default:
          break
      }
    },
    close () {
      this.modal.visible = false
    },
    getStatus (status) {
      var a = this.statusMap[status]
      return a.text
    },
    createQrcode (id) {
      this.codeModal.url = 'http://wxtest2.xinjijiaoyu.com/h/?#/parent/commodity/detail/' + id
      if (window.location.host === 'lanma.xinjijiaoyu.com') {
        this.codeModal.url = 'https://wx.xinjijiaoyu.com/h/?#/parent/commodity/detail/' + id
      }
      // api.course.getQrcode(this.codeModal.url).then((res) => {
      this.codeModal.imgSrc = './wxcgi/wx/createCustomQRCode?url=' + encodeURIComponent(this.codeModal.url) + '&&size=5'
      this.codeModal.visible = true
      // })
    },
    search () {
      if (this.searchKW) {
        api.commodity.search(this.searchKW).then(res => {
          this.list = res
          this.page = 1
          this.pageCount = 1
        })
      } else {
        this.getList()
      }
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
</style>
