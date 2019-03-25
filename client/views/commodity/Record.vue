<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <table class="table">
            <thead>
              <tr>
                <th>序号</th>
                <th>用户微信</th>
                <th>用户姓名</th>
                <th>用户手机</th>
                <th>销售姓名</th>
                <th>渠道</th>
                <th>售价（元）</th>
                <th>订单编号</th>
                <th>提交时间</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in list">
                <td>{{ item.id }}</td>
                <td>{{ item.wxName }}</td>
                <td>{{ item.parentName }}</td>
                <td>{{ item.telephone }}</td>
                <td>{{ item.salesName }}</td>
                <td>{{ findChannelName(item.channelId) }}</td>
                <td>{{ item.price }}</td>
                <td>{{ item.orderId }}</td>
                <td>{{ item.created_at }}</td>
                <td>{{ statusMap[item.status] }}</td>
                <td v-if="item.status <= 2">
                  <a href="#" @click.prevent="cancel(item.orderId)">取消订单</a>&nbsp;&nbsp;
                </td>
                <td v-else>-</td>
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
  </div>
</template>

<script>
import CardModal from '../../components/widget/CardModal.vue'
import Pagination from 'components/Pagination'

import api from 'lanmaLib/common/api'
import helper from '../../helper'
import _ from 'lodash'

export default {
  data () {
    return {
      page: 0,
      pageCount: 0,
      loading: false,
      commodityId: 0,
      channelId: 0,
      cancelId: 0,
      channelList: [],
      list: [],
      statusMap: ['', '未付款', '已付款', '已取消', '超时'],
      modal: {
        visible: false,
        title: '取消确认',
        message: '确认取消订单？'
      }
    }
  },
  components: {
    CardModal,
    Pagination
  },
  created () {
    var commodityId = parseInt(this.$route.params.commodityId)
    if (isNaN(commodityId) || commodityId < 0) {
      commodityId = 0
    }
    var channelId = parseInt(this.$route.params.channelId)
    if (isNaN(channelId) || channelId < 0) {
      channelId = 0
    }
    this.commodityId = commodityId
    this.channelId = channelId
    this.getAllChannelList()
    this.getRecordList()
  },
  methods: {
    pages (page) {
      this.getRecordList(page)
    },
    getRecordList (page = 1) {
      var params = {}
      params.page = page
      params.goodsId = this.commodityId
      if (this.channelId > 0) {
        params.channelId = this.channelId
      }
      params.offset = (page - 1) * 20
      params.length = 20
      this.loading = true
      api.commodity.getSellRecord(params)
        .then((data) => {
          this.list = data.list
          this.loading = false
          this.page = page
          this.pageCount = Math.ceil(data.total / 20)
        })
    },
    getAllChannelList() {
      api.channel.getSellList().then(data => {
        this.channelList = data.list
      })
    },
    findChannelName (id) {
      var item = _.find(this.channelList, {user_id: id})
      if (item) {
        return item.name
      } else {
        return ''
      }
    },
    confirm () {
      if (this.cancelId) {
        api.commodity.cancelOrder(this.cancelId).then(() => {
          var index = _.findIndex(this.list, {orderId: this.cancelId})
          this.list[index].status = 3
          helper.showSuccess('取消成功')
          this.close()
        })
        .catch((e) => {
          if (e.code === 6008) {
            helper.showError('已上过此课，不能取消订单。')
          } else {
            helper.showError(e.message)
          }
          this.close()
        })
      }
    },
    cancel (id) {
      this.modal.visible = true
      this.cancelId = id
    },
    close () {
      this.modal.visible = false
      this.cancelId = 0
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

.addchannel {
  margin: -10px 0 20px 0;
  text-align: center;
}
</style>
