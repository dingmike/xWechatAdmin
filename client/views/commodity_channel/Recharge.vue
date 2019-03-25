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
              </tr>
            </tbody>
          </table>
          <pagination :index="page" :count="pageCount" :loading="loading" @change="pages(arguments[0])"></pagination>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import CardModal from '../../components/widget/CardModal.vue'
import Pagination from 'components/Pagination'

import api from 'lanmaLib/common/api'
// import helper from '../../helper'
// import _ from 'lodash'

export default {
  data () {
    return {
      page: 0,
      pageCount: 0,
      loading: false,
      commodityId: 0,
      cancelId: 0,
      thList: ['序号', '用户微信', '用户姓名', '用户手机', '销售姓名', '充值金额', '到账金额', '订单编号', '提交时间'],
      tdList: ['id', 'wxName', 'name', 'telephone', 'salesName', 'amount', 'total', 'rechargeId', 'created_at'],
      list: []
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
  methods: {
    init () {
      var page = parseInt(this.$route.params.page)
      this.getRechargeRecordList(page || 1)
    },
    getRechargeRecordList (page = 1) {
      var params = {}
      params.page = page
      params.offset = (page - 1) * 20
      params.length = 20
      this.loading = true
      api.commodity.channel.getRechargeRecordList(params)
        .then((data) => {
          this.list = data.list.map(item => {
            item.amount = item.amount / 100
            item.giftAmount = item.giftAmount / 100
            item.total = item.amount + item.giftAmount
            return item
          })
          this.loading = false
          this.page = page
          this.pageCount = Math.ceil(data.total / 20)
        })
    },
    pages (page) {
      this.getRechargeRecordList(page)
      console.log(this.$router)
      var path = window.location.hash.replace('#', '').replace(/\/\d+$/, '/' + page)
      this.$router.push(path)
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
