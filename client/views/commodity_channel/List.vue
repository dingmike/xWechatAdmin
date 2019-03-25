<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <table class="table">
            <thead>
              <tr>
                <th>序号</th>
                <th>名称</th>
                <!--<th>编号</th>-->
                <th is="ShowStatus" :statusList="goodsTypeStatusList" :statusText="'类型'" v-model="goodsTypeStatus" @input="getList(1)"></th>
                <th>原价（元）</th>
                <th>售价（元）</th>
                <th>已售</th>
                <th>库存</th>
                <th is="ShowStatus" :statusList="statusList" :statusText="'状态'" v-model="status" @input="getList(1)"></th>
                <th>赠课设置</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in list">
                <td>{{ item.goods.id }}</td>
                <td>{{ item.goods.name }}</td>
                <!--<td>{{ item.goods.number }}</td>-->
                <td>{{ goodsTypeMap[item.goods.goodsType] }}</td>
                <td>{{ item.goods.originalPrice }}</td>
                <td>{{ item.channelInfo.channelPrice }}</td>
                <td>{{ item.goods.salesCount + item.goods.reserveCount }}</td>
                <td>{{ item.goods.stock }}</td>
                <td>{{ statusMap[item.goods.status] }}</td>
                <td><input type="text" class="price" v-model.number="item.channelInfo.priceDesc" @change="setPriceDesc(item)" placeholder="赠课说明"></td>
                <td>
                  <a v-if="item.goods.goodsType==1 || item.goods.goodsType==3" href="#" @click.prevent="showModal">课程详情&nbsp;&nbsp; </a>
                  <router-link v-else :to="'/commodity_channel/detail/' + item.goods.courseId"> 课程详情&nbsp;&nbsp; </router-link>
                  <router-link :to="'/commodity_channel/record/' + item.goods.id + '/1'"> 销售记录&nbsp;&nbsp; </router-link>
                </td>
              </tr>
            </tbody>
          </table>
          <pagination :index="page" :count="pageCount" :loading="loading" @change="pages(arguments[0])"></pagination>
        </article>
      </div>
    </div>
    <card-modal :visible="modal.visible" @cancel="close" @close="close" @ok="close" :title="modal.title"  transition="zoom">
      {{ modal.message }}
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
// import _ from 'lodash'

export default {
  data () {
    return {
      status: 0,
      page: 0,
      pageCount: 0,
      loading: false,
      actionType: '',
      actionId: '',
      goodsTypeMap: ['', '体验坊', '组合', '游学营'],
      statusMap: ['', '未开放', '在售', '售罄', '过期'],
      statusList: [{'text': '全部', 'value': '0'}, {'text': '未上架', 'value': '1'}, {'text': '在售', 'value': '2'}, {'text': '售罄', 'value': '3'}, {'text': '过期', 'value': '4'}],
      list: [],
      modal: {
        visible: false,
        title: '提示',
        message: '正在开发中，暂不支持查看课程内容。'
      },
      goodsTypeStatus: 0,
      goodsTypeStatusList: [{'text': '全部', 'value': '0'}, {'text': '体验坊', 'value': '1'}, {'text': '组合', 'value': '2'}, {'text': '游学营', 'value': '3'}]
    }
  },
  components: {
    // Cleave,
    CardModal,
    ShowStatus,
    Pagination
  },
  watch: {
    // 需要侦听路由变化，来加载数据
    '$route' (to, from) {
      this.init()
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      var page = parseInt(this.$route.params.page)
      this.getList(page || 1)
    },
    getList (page = 1) {
      var params = {}
      params.page = page
      params.offset = (page - 1) * 20
      params.length = 20
      params.status = this.status
      params.goodsType = this.goodsTypeStatus
      this.loading = true
      api.commodity.channel.getList(params)
        .then((data) => {
          this.list = data.list
          this.loading = false
          this.page = page
          this.pageCount = Math.ceil(data.total / 20)
        })
    },
    pages (page) {
      this.getList(page)
      this.$router.push('/commodity_channel/list/' + page)
    },
    showModal() {
      this.modal.visible = true
    },
    close () {
      this.modal.visible = false
    },
    setPriceDesc (item) {
      api.commodity.channel.setPriceDesc(item.goods.id, item.channelInfo.priceDesc).then(res => {
        helper.showSuccess('修改成功')
      }).catch(() => {
        helper.showError('修改失败')
      })
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
