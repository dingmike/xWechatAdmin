<template>
  <div class="page">
    <card-modal :visible="channelModal.visible" @close="channelModal.visible=false" @cancel="channelModal.visible=false" @ok="confirmChannel" :title="channelModal.title" :showErrorMsg="channelModal.showErrorMsg" transition="zoom">
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <article class="tile is-child box">
            <div class="columns">
              <div class="column">
                <p class="control has-addons">
                  <input class="input" type="text" v-model="channelKW" @input="filterChannel" placeholder="名称">
                  <a class="button is-info" @click="filterChannel">搜索</a>
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
                  <th>ID</th>
                  <th>名称</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in channelModal.list" @click="channelBuffer = item;channelModal.showErrorMsg = false" :class="[channelBuffer.user_id == item.user_id ? 'isActive' : '', 'modal-item']">
                  <td>{{ item.user_id }}</td>
                  <td>{{ item.name }}</td>
                </tr>
              </tbody>
            </table>
          </article>
        </div>
      </div>
    </card-modal>
  </div>
</template>

<script>
import api from 'lanmaLib/common/api'
import CardModal from '../../components/widget/CardModal.vue'
import _ from 'lodash'
export default{
  components: {
    CardModal
  },
  directives: {
  },
  data () {
    return {
      channelList: [],
      channelModal: {
        visible: false,
        title: '选择渠道',
        showErrorMsg: false,
        list: []
      },
      channelSelected: { 'user_id': '', 'name': '', 'description': '' },
      channelBuffer: { 'user_id': '', 'name': '', 'description': '' },
      channelKW: ''
    }
  },
  computed: {
  },
  created () {
    this.getChannelList()
    this.channelModal.visible = true
  },
  mounted () {
  },
  methods: {
    getChannelList () {
      api.channel.getSellList()
        .then((data) => {
          this.channelList = this.channelModal.list = data.list.map(item => {
            return _.pick(item, ['user_id', 'name', 'description'])
          })
        })
    },
    filterChannel () {
      var keword = this.channelKW
      if (keword === '') {
        this.channelModal.list = this.channelList
        return
      }
      this.channelModal.list = this.channelModal.list.filter(item => {
        return item.name.toLowerCase().match(keword.toLowerCase())
      })
    },
    confirmChannel() {
      if (!this.channelBuffer.user_id) {
        this.channelModal.showErrorMsg = true
      } else {
        this.channelModal.showErrorMsg = false
        this.channelModal.visible = false
        this.channelSelected = this.channelBuffer
        var _this = this
        api.recharge.copyQuota(this.channelSelected.user_id)
          .then((res) => {
            this.$nextTick(function () {
              _this.$router.push('/recharge/list/' + this.channelSelected.user_id)
            })
          })
      }
    }
  },
  watch: {
  }
}
</script>

<style scoped lang="scss">
.modal-item:hover {
  background-color: #ddd;
}

.isActive {
  background-color: #00d1b2;
}
</style>