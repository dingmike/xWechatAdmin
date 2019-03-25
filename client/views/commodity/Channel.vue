<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <div class="info">
            销售记录：{{ commodity.name }}-{{ goodsTypeMap[commodity.goodsType] }}-{{ statusMap[commodity.status] }}（已售：
            <router-link v-if="commodity.salesCount>0" :to="'/commodity/record/' + commodity.id"><a>{{ commodity.salesCount }}</a></router-link>
            <span v-else>{{ commodity.salesCount + commodity.reserveCount }}</span>
            ，库存：{{ commodity.stock }}）
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>渠道ID</th>
                <th>渠道名称</th>
                <th>原价（元）</th>
                <th>售价（元）</th>
                <th>已售</th>
                <th>库存</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in list">
                <td>{{ item.channelId }}</td>
                <td>{{ item.channelName }}</td>
                <td>{{ commodity.originalPrice }}</td>
                <td><input type="text" class="price" v-model.number="item.channelPrice" @change="updataPrice(item)"></td>
                <td>
                  <router-link v-if="(item.salesCount + commodity.reserveCount)>0" :to="'/commodity/record/' + item.goodsId + '/' + item.channelId">
                    <a>{{ item.salesCount + commodity.reserveCount }}</a>
                  </router-link>
                  <span v-else>{{ item.salesCount + commodity.reserveCount }}</span>
                </td>
                <td>{{ commodity.stock }}</td>
                <td>{{ item.channelViewStatus == 1 ? '可售':'禁售' }}</td>
                <td>
                  <router-link v-if="(item.salesCount + commodity.reserveCount)>0" :to="'/commodity/record/' + item.goodsId + '/' + item.channelId">销售记录&nbsp;&nbsp;</router-link>
                  <a href="#" @click.prevent="action('delete', item.id)"> 删除&nbsp;&nbsp; </a>
                  <a href="#" v-if="item.channelViewStatus!=1" @click.prevent="action('startSell', item.channelId)"> 可售&nbsp;&nbsp; </a>
                  <a href="#" v-if="item.channelViewStatus==1" @click.prevent="action('endSell', item.channelId)"> 禁售&nbsp;&nbsp; </a>
                </td>
              </tr>
            </tbody>
          </table>
          <p class="addchannel">
            <button @click.prevent="addChannel" class="button is-primary">✚ 添加分销渠道</button>
          </p>
          <pagination :index="page" :count="pageCount" :loading="loading" @change="pages(arguments[0])"></pagination>
        </article>
      </div>
    </div>
    <card-modal :visible="modal.visible" @cancel="close" @close="close" @ok="confirm" :title="modal.title"  transition="zoom">
      {{ modal.message }}
    </card-modal>
    <ListSelectModal :modal="channelModal" @select="addSuccess"></ListSelectModal>
  </div>
</template>

<script>
import CardModal from '../../components/widget/CardModal.vue'
import Pagination from 'components/Pagination'
import ListSelectModal from '../../components/widget/ListSelectModal.vue'
import ShowStatus from '../../components/widget/ShowStatus.vue'

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
      commodity: {},
      removeId: 0,
      list: [],
      modal: {
        visible: false,
        title: '删除确认',
        message: '删除数据后将不能恢复，确定删除吗？'
      },
      channelModal: {
        visible: false,
        okText: '确定',
        cancelText: '取消',
        title: '选择销售渠道',
        activeKw: 'user_id',
        text: ['渠道ID', '名称', '描述'],
        kw: ['user_id', 'name', 'description'],
        apiFunc: api.channel.getSellList
      },
      goodsTypeMap: ['', '体验坊', '课程组合', '游学营'],
      statusMap: ['', '未上架', '在售', '售罄', '过期']
    }
  },
  components: {
    Pagination,
    CardModal,
    ListSelectModal,
    ShowStatus
  },
  created () {
    var commodityId = parseInt(this.$route.params.commodityId)
    if (isNaN(commodityId) || commodityId < 0) {
      commodityId = 0
    }
    this.commodityId = commodityId
    api.commodity.find(commodityId).then((commodity) => {
      this.commodity = commodity
    })
    this.getList()
  },
  methods: {
    pages (page) {
      this.getList(page)
    },
    getList (page = 1) {
      var params = {}
      params.goodsId = this.commodityId
      params.page = page
      params.offset = (page - 1) * 20
      params.length = 20
      this.loading = true
      api.commodity.getChannelList(params)
        .then((data) => {
          this.list = data.list
          this.loading = false
          this.page = page
          this.pageCount = Math.ceil(data.total / 20)
        })
    },
    showModal (title, message) {
      this.modal.title = title
      this.modal.message = message
      this.modal.visible = true
    },
    action (type, id) {
      this.actionType = type
      this.actionId = id
      switch (this.actionType) {
        case 'startSell':
          this.showModal('开售确认', '确认要开启商品在该渠道的销售吗？')
          break
        case 'endSell':
          this.showModal('禁售确认', '确认要禁止该渠道的商品销售吗？')
          break
        case 'delete':
          this.showModal('删除确认', '渠道删除后将不可恢复，确认删除？')
          break
        default:
          break
      }
    },
    confirm() {
      this.modal.visible = false
      switch (this.actionType) {
        case 'startSell':
          api.commodity.channel.startSell(this.commodityId, this.actionId).then((data) => {
            var index = _.findIndex(this.list, {'channelId': this.actionId})
            this.list[index].channelViewStatus = 1
            helper.showSuccess('开售成功')
          }).catch(() => {
            helper.showError('开售失败')
          })
          break
        case 'endSell':
          api.commodity.channel.endSell(this.commodityId, this.actionId).then((data) => {
            var index = _.findIndex(this.list, {'channelId': this.actionId})
            this.list[index].channelViewStatus = 2
            helper.showSuccess('禁售成功')
          }).catch(() => {
            helper.showError('禁售失败')
          })
          break
        case 'delete':
          api.commodity.delChannel(this.actionId).then((data) => {
            var index = _.findIndex(this.list, {'id': this.actionId})
            this.list.splice(index, 1)
            helper.showSuccess('删除成功')
          }).catch(() => {
            helper.showError('删除失败')
          })
          break
        default:
          break
      }
    },
    addChannel() {
      this.channelModal.visible = true
    },
    addSuccess(item) {
      if (_.findIndex(this.list, {'channelId': item.user_id}) >= 0) {
        helper.showError('该渠道已存在，请勿重复添加')
        return
      }
      var params = {
        goodsId: this.commodityId,
        channelId: item.user_id,
        channelName: item.name,
        channelPrice: this.commodity.price,
        originalPrice: this.commodity.originalPrice
      }
      api.commodity.addChannel(params).then((data) => {
        this.list.push(data)
        helper.showSuccess('添加成功')
      }).catch(() => {
        helper.showError('添加失败')
      })
    },
    close () {
      this.modal.visible = false
    },
    updataPrice (item) {
      if (Number(item.channelPrice) <= 0) {
        item.channelPrice = this.commodity.price
        helper.showError('售价不能为空，且必须大于0')
        return
      } else if (Number(item.channelPrice) > Number(this.commodity.originalPrice)) {
        item.channelPrice = this.commodity.price
        helper.showError('售价不能高于原价')
        return
      }
      var channel = {
        id: item.id,
        channelName: item.channelName,
        channelPrice: item.channelPrice,
        originalPrice: this.commodity.originalPrice
      }
      api.commodity.updateChannel(channel).then(res => {
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

.addchannel {
  margin: -10px 0 20px 0;
  text-align: center;
}

.info {
  padding: 5px 10px 10px 10px;
  font-size: 16px;
}

.price {
  text-align: center;
  cursor: pointer;
}
</style>
