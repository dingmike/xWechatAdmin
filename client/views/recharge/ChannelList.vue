<template>
  <div class="page">
    <template v-for="(item,index) in list">
      <h2 :id="'channel-'+item.channelId" class="title">{{ item.channelId == 0 ? '标准方案' : channelHash[item.channelId] }}</h2>
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <article class="tile is-child box">
            <button @click="action('deleteChannel', item.channelId, index)" class="delete closeBtn" v-if="item.channelId != 0"></button>
            <table class="table">
              <thead>
                <tr>  
                  <th>序号</th>
                  <th>充值金额</th>
                  <th>赠送金额</th>
                  <th>赠品描述</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="itemChild,indexChild in item.list">
                  <td>{{ indexChild + 1 }}</td>
                  <td>{{ itemChild.amount }}</td>
                  <td>{{ itemChild.giftAmount }}</td>
                  <td>{{ itemChild.quotaDesc }}</td>
                  <td>
                    <router-link :to="'/recharge/edit/' + item.channelId + '/' + itemChild.id"> 编辑&nbsp;&nbsp; </router-link>
                    <a href="#" @click.prevent="action('delete', itemChild.id, index)"> 删除&nbsp;&nbsp; </a>
                  </td>
                </tr>
              </tbody>
            </table>
<!--            <pagination :index="page" :count="pageCount" :loading="loading" @change="pages(arguments[0])"></pagination>-->
            <div class="has-text-centered">
              <button @click="goto('/recharge/add/' + item.channelId)" class="addBtn button is-primary">添加充值项</button>
            </div>
          </article>
        </div>
      </div>
    </template>
    <card-modal :visible="modal.visible" @cancel="close" @close="close" @ok="confirm" :title="modal.title"  transition="zoom">
      {{ modal.message }}
    </card-modal>
  </div>
</template>

<script>
import api from 'lanmaLib/common/api'
import Pagination from 'components/Pagination'
import CardModal from '../../components/widget/CardModal.vue'
import _ from 'lodash'
import helper from '../../helper'
export default{
  components: {
    Pagination,
    CardModal
  },
  directives: {
  },
  data () {
    return {
      status: 0,
      page: 0,
      pageCount: 0,
      list: [],
      loading: false,
      modal: {
        visible: false,
        title: '删除渠道充值',
        message: '确定要删除该渠道充值吗？'
      },
      channelId: 0,
      channelList: [],
      channelHash: {},
      actionType: '',
      actionId: '',
      actionIndex: ''
    }
  },
  computed: {
  },
  created () {
    var channelId = parseInt(this.$route.params.channelId)
    if (isNaN(channelId)) {
      channelId = 0
    }
    this.channelId = channelId
    this.getChannel()
  },
  mounted () {
  },
  methods: {
    pages (page) {
      this.$router.push('/recharge/list/' + page)
      this.getList(page || 1)
    },
    goAnchor() {
      if (this.channelId === 0) {
        return
      }
      var selector = '#channel-' + this.channelId
      var anchor = this.$el.querySelector(selector)
      window.scrollTo(0, anchor.offsetTop - 20)
    },
    getChannel () {
      api.channel.getSellList()
        .then((data) => {
          this.channelList = data.list.map(item => {
            return _.pick(item, ['user_id', 'name', 'description'])
          })
          var temp = {}
          for (var i = 0; i < this.channelList.length; i++) {
            temp[this.channelList[i].user_id] = this.channelList[i].name
          }
          this.channelHash = temp
          this.getList()
        })
    },
    getList (page = 1) {
      var params = {}
      var _this = this
      params.page = page
      params.status = this.status
      params.offset = (page - 1) * 20
      params.length = 20
      this.loading = true
      api.recharge.getList(params)
        .then((data) => {
          var temp
          for (var i = 0; i < data.length; i++) {
            if (data[i].channelId === -1) {
              temp = data.splice(i, 1)[0]
              break
            }
          }
          if (temp) {
            data.splice(1, 0, temp)
          }
          console.log(data)
          this.list = data
          this.loading = false
          this.page = page
          this.pageCount = Math.ceil(data.total / 20)
          this.$nextTick(function () {
            _this.goAnchor()
          })
        })
    },
    confirm () {
      this.modal.visible = false
      switch (this.actionType) {
        case 'delete':
          api.recharge.delete(this.actionId).then((data) => {
            var index = _.findIndex(this.list[this.actionIndex].list, {'id': this.actionId})
            this.list[this.actionIndex].list.splice(index, 1)
            helper.showSuccess('删除成功')
          }).catch((error) => {
            if (error.code === 6046) {
              helper.showError('该商品已有销售记录，无法删除！')
            } else {
              helper.showError('删除失败，其他异常')
            }
          })
          break
        case 'deleteChannel':
          api.recharge.deleteChannelQuota(this.actionId).then((data) => {
            var index = _.findIndex(this.list, {'channelId': this.actionId})
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
    action (type, id, index) {
      this.actionType = type
      this.actionId = id
      this.actionIndex = index
      switch (this.actionType) {
        case 'delete':
          this.showModal('删除确认', '确认要删除该充值项？')
          break
        case 'deleteChannel':
          this.showModal('删除确认', '确认要删除该渠道充值方案？')
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
    goto (url) {
      this.$router.push(url)
    },
    delChannel (id) {
      this.showModal('删除确认', '确认要删除该渠道充值方案？')
      this.delChannelId = id
    },
    close () {
      this.modal.visible = false
      this.delChannelId = ''
    }
  },
  watch: {
  }
}
</script>

<style scoped lang="scss">
.page{
}
.title{
  margin-left: 20px;
  font-size: 24px;
  font-weight: 500;
}
.addBtn{
  padding: 5px 10px;
}
.box{
  position: relative;
}
.closeBtn{
  position: absolute;
  right:0;
  top:0;
  background: red;
}
</style>