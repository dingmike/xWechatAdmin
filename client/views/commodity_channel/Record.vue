<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <table class="table">
            <thead>
              <tr>
                <th v-for="item in thList">{{ item }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in list">
                <td v-for="it in tdList">{{ item[it] }}</td>
                <td>{{ payTypeMap[item.payType] }}</td>
                <td>{{ isDiscountMap[item.isDiscount] }}</td>
                <td>{{ statusMap[item.status] }}</td>
                <td v-if="item.status<=2">
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
    <card-modal :visible="modalTwo.visible" @cancel="dialogClose" @close="dialogClose" @ok="dialogClose" :title="modalTwo.title" :showCancelText="false" transition="zoom">
      {{ modalTwo.message }}
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
      cancelId: 0,
      thList: ['序号', '用户微信', '用户姓名', '用户手机', '销售姓名', '商品名称', '商品ID', '售价（元）', '订单编号', '提交时间', '支付方式', '是否促销', '状态', '操作'],
      tdList: ['id', 'wxName', 'parentName', 'telephone', 'salesName', 'goodsName', 'goodsId', 'price', 'orderId', 'created_at'],
      list: [],
      statusMap: ['', '未付款', '已付款', '已取消', '超时'],
      payTypeMap: ['', '渠道赠送', '微信支付', '余额支付'],
      isDiscountMap: ['否', '是'],
      modal: {
        visible: false,
        title: '取消确认',
        message: '取消订单将收回对应已购买的课程，是否确认取消？'
      },
      modalTwo: {
        visible: false,
        title: '订单已取消',
        message: '用户支付的课程款项，将原路退回。'
      }
    }
  },
  components: {
    CardModal,
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
  // created () {
  //   var commodityId = parseInt(this.$route.params.commodityId)
  //   if (isNaN(commodityId) || commodityId < 0) {
  //     commodityId = 0
  //   }
  //   this.commodityId = commodityId
  //   this.getRecordList()
  // },
  methods: {
    init () {
      var commodityId = parseInt(this.$route.params.commodityId)
      var page = parseInt(this.$route.params.page)
      if (isNaN(commodityId) || commodityId < 0) {
        commodityId = 0
      }
      this.commodityId = commodityId
      this.getRecordList(page || 1)
    },
    getRecordList (page = 1) {
      var params = {}
      params.page = page
      params.offset = (page - 1) * 20
      params.length = 20
      if (this.commodityId) {
        params.goodsId = this.commodityId
      }
      this.loading = true
      api.commodity.channel.getRecordList(params)
        .then((data) => {
          this.list = data.list
          this.loading = false
          this.page = page
          this.pageCount = Math.ceil(data.total / 20)
        })
    },
    pages (page) {
      this.getRecordList(page)
      console.log(this.$router)
      var path = window.location.hash.replace('#', '').replace(/\/\d+$/, '/' + page)
      this.$router.push(path)
    },
    confirm () {
      if (this.cancelId) {
        api.commodity.channel.cancelOrder(this.cancelId).then(() => {
          var index = _.findIndex(this.list, {orderId: this.cancelId})
          this.list[index].status = 3
          helper.showSuccess('取消成功')
          this.close()
          this.modalTwo.visible = true
        })
        .catch((e) => {
          if (e.code === 6008) {
            helper.showError('已上过此课，不能取消订单。')
          } else if (e.code === 6063) {
            helper.showError('账户余额不足，退款失败。')
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
    dialogClose () {
      this.modalTwo.visible = false
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
