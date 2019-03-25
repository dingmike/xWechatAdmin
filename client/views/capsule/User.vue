<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <table class="table">
            <thead>
              <tr>
                <th>城市</th>
                <th>头像</th>
                <th>用户名</th>
                <th>微信名</th>
                <th>退订</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in list">
                <td>{{ item.city }}</td>
                <td><img :src="item.headimgurl" alt="" style="width:30px"></td>
                <td>{{ item.name }}</td>
                <td>{{ item.wxName }}</td>
                <td>{{ item.unsubscribe==1 ? '正常':'已退订' }}</td>
                <td>
                  <a href="#" @click.prevent="action('delete', item.openid)"> 删除&nbsp;&nbsp; </a>
                </td>
              </tr>
            </tbody>
          </table>
          <p class="addchannel">
            <button @click.prevent="addChannel" class="button is-primary">✚ 添加胶囊用户</button>
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
        title: '选择用户',
        activeKw: 'openid',
        text: ['城市', '用户名', '微信名'],
        kw: ['city', 'name', 'wxName'],
        apiFunc: api.userAdmin.getSubscribeUserList
      }
    }
  },
  components: {
    Pagination,
    CardModal,
    ListSelectModal,
    ShowStatus
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
    init() {
      this.type = this.$route.path === '/capsule/user/old' ? 1 : 2
      this.getList()
    },
    pages (page) {
      this.getList(page)
    },
    getList (page = 1) {
      this.loading = true
      api.capsule.getCapsuleUserList(this.type)
        .then((data) => {
          this.list = data
          this.loading = false
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
        case 'delete':
          this.showModal('删除确认', '确认删除？')
          break
        default:
          break
      }
    },
    confirm() {
      this.modal.visible = false
      switch (this.actionType) {
        case 'delete':
          api.capsule.delCapsuleUser(this.actionId).then((data) => {
            var index = _.findIndex(this.list, {'openid': this.actionId})
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
      if (_.findIndex(this.list, {'openid': item.openid}) >= 0) {
        helper.showError('该用户已存在，请勿重复添加')
        return
      }
      api.capsule.addCapsuleUser(item.openid, this.type).then((data) => {
        item.unsubscribe = 1
        this.list.push(item)
        helper.showSuccess('添加成功')
      }).catch(() => {
        helper.showError('添加失败')
      })
    },
    close () {
      this.modal.visible = false
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
