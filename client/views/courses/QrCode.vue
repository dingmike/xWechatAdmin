<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-ancestor">
        <div class="tile is-parent cl-form">
          <article class="tile is-child box">
            <h4>{{course.title}}</h4>
            <div class="source-form" v-if="userInfo.role_id !== 2">
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">渠道id</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="channel_id" type="text" placeholder="渠道id">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label"></label>
                </div>
                <div class="control">
                  <button class="button is-primary" @click="submit">生成二维码</button>
                </div>
              </div>
            </div>
            <div>
              <img v-if="qrcode !== ''" :src="'data:image/png;base64, ' + qrcode">
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'lanmaLib/common/api'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      title: '报名入口',
      id: 0,
      channel_id: 0,
      course: {
        id: 0,
        title: '',
        display_order: 0,
        divide_rate: 1,
        total: 0
      },
      qrcode: ''
    }
  },
  created () {
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    this.id = id

    api.course.find(id)
        .then((course) => {
          this.course = course
          this.channel_id = this.course.channel_id
          this.getQC()
        })
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  methods: {
    submit () {
      this.getQC()
    },
    getQC () {
      if (this.channel_id === 0) {
        var url = 'http://wx.xinjijiaoyu.com/?#/parent/course/sign_up/' + this.id + '/' + this.channel_id
        this.getQRImg(url)
      }
      api.channel.find(this.channel_id)
          .then((channel) => {
            var uid = channel.user_id
            var url = 'http://wx.xinjijiaoyu.com/?#/parent/course/sign_up/' + this.id + '/' + this.channel_id + '?source=' + uid
            this.getQRImg(url)
          })
    },
    getQRImg (url) {
      api.course.getQrcode(url)
          .then((qrcode) => {
            this.qrcode = qrcode
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
