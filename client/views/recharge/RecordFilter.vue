<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <div class="columns">
            <div class="column">
              <p class="control has-addons">
                <datepicker placeholder="请选择起始时间" @focus.native="unfocus" v-model="start_time" :config="{ locale: l10n, time_24hr: true, dateFormat: 'Y-m-d', defaultDate: defaultStartDay  }"></datepicker>
                &nbsp;&nbsp;_____&nbsp;&nbsp; <datepicker placeholder="请选择结束时间" @focus.native="unfocus" v-model="end_time" :config="{ locale: l10n, time_24hr: true, dateFormat: 'Y-m-d', defaultDate: defaultEndDay }"></datepicker>
                <!-- <select class="channel-select" v-model="status" @change="search">
                  <option v-for="(item, index) in statusMap" v-if="item !== ''" :value="index">{{ item }}</option>
                </select> -->
                <select class="channel-select" v-model="channelId" @change="search">
                  <option v-for="(item, index) in channelList" v-if="item !== ''" :value="item.user_id">{{ item.name }}</option>
                </select>
                &nbsp;&nbsp;<a class="button is-info" @click="search">搜索</a>
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
                <th>序号</th>
                <th>用户微信</th>
                <th>用户姓名</th>
                <th>用户手机</th>
                <th>销售姓名</th>
                <th>渠道</th>
                <th>充值金额</th>
                <th>到账金额</th>
                <th>订单编号</th>
                <th>提交时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in list">
                <td>{{ item.id }}</td>
                <td>{{ item.wxName }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.telephone }}</td>
                <td>{{ item.salesName }}</td>
                <td>{{ findChannelName(item.channelId) }}</td>
                <td>{{ item.amount }}</td>
                <td>{{ item.amount + item.giftAmount }}</td>
                <td>{{ item.rechargeId }}</td>
                <td>{{ item.created_at }}</td>
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
import Datepicker from 'vue-bulma-datepicker'

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
      channelId: '',
      cancelId: 0,
      channelList: [],
      list: [],
      start_time: '',
      end_time: '',
      status: 0,
      statusMap: ['全部状态', '未付款', '已付款', '已取消', '超时'],
      modal: {
        visible: false,
        title: '取消确认',
        message: '确认取消订单？'
      }
    }
  },
  components: {
    CardModal,
    Pagination,
    Datepicker
  },
  created () {
    this.getAllChannelList()
    this.getRecordList()
  },
  computed: {
    l10n () {
      return {
        firstDayOfWeek: 1,
        weekdays: {
          shorthand: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
          longhand: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        },
        months: {
          shorthand: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          longhand: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        }
      }
    },
    defaultStartDay () {
      var t = new Date((new Date() - 3600000 * 24 * 7))
      return t.toJSON().split('T')[0]
    },
    defaultEndDay () {
      var t = new Date()
      return t.toJSON().split('T')[0]
    }
  },
  methods: {
    pages (page) {
      this.getRecordList(page)
    },
    search () {
      this.getRecordList(this.page)
    },
    getRecordList (page = 1) {
      var params = {}
      params.page = page
      params.startTime = (this.start_time || this.defaultStartDay) + ' 00:00:00'
      params.endTime = (this.end_time || this.defaultEndDay) + ' 23:59:59'
      params.channelId = this.channelId
      params.status = this.status
      params.offset = (page - 1) * 20
      params.length = 20
      this.loading = true
      api.recharge.findSalesRecords(params)
        .then((data) => {
          this.list = data.list.map(item => {
            item.amount = item.amount / 100
            item.giftAmount = item.giftAmount / 100
            return item
          })
          this.loading = false
          this.page = page
          this.pageCount = Math.ceil(data.total / 20)
        })
    },
    getAllChannelList() {
      api.channel.getSellList().then(data => {
        data.list.unshift({'user_id': '', 'name': '全部渠道'})
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
    },
    unfocus(e) {
      e.target.blur()
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

.channel-select{
  margin: 0 10px;
}
</style>
