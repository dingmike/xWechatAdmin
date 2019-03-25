<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <table class="table">
            <thead>
              <tr>
                <th>渠道ID</th>
                <th>名称</th>
                <th>销售价格</th>
                <th>销售数量</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in list">
                <td>{{ item.channelId }}</td>
                <td>{{ item.channelName }}</td>
                <td>{{ item.channelPrice }}</td>
                <td>{{ item.salesCount }}</td>
                <td>
                  <router-link :to="'/commodity/record/' + item.goodsId + '/' + item.channelId">销售记录</router-link>
                  <a href="#" @click.prevent="remove(item.channelId)">删除</a>&nbsp;&nbsp;
                </td>
              </tr>
            </tbody>
          </table>
          <p class="addchannel">
            <button @click.prevent="addChannel" class="button is-primary">✚ 添加分销渠道</button></p>
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
import ListSelectModal from '../../components/widget/ListSelectModal.vue'
// import Pagination from 'components/Pagination'

import api from 'lanmaLib/common/api'
import helper from '../../helper'
import _ from 'lodash'

export default {
  data () {
    return {
      commodityId: 0,
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
        title: '选择课程',
        text: ['渠道ID', '名称', '描述'],
        kw: ['id', 'name', 'description'],
        apiFunc: api.channel.getList
      }
    }
  },
  components: {
    CardModal,
    ListSelectModal
  },
  created () {
    var commodityId = parseInt(this.$route.params.commodityId)
    if (isNaN(commodityId) || commodityId < 0) {
      commodityId = 0
    }
    this.commodityId = commodityId
    this.getList()
  },
  methods: {
    getList () {
      api.commodity.channel.getList(this.commodityId)
        .then((data) => {
          this.list = data.list
        })
    },
    confirm () {
      if (this.removeId) {
        api.commodity.delete(this.removeId).then(() => {
          _.remove(this.list, (item) => {
            return item.id === this.removeId
          })
          this.close()
        })
        .catch((e) => {
          helper.showSuccess(e.message)
        })
      }
    },
    addChannel() {
      this.channelModal.visible = true
    },
    addSuccess(item) {
      var channelItem = {'channelId': item.id, 'channelName': item.name, 'goodsId': this.commodityId, 'channelPrice': ''}
      this.list.push(channelItem)
    },
    remove (id) {
      this.modal.visible = true
      this.removeId = id
    },
    close () {
      this.modal.visible = false
      this.removeId = 0
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
