<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent cl-form">
        <article class="tile is-child box">
          <div class="block">
            <SingleInput :title="'主题'" v-model="adInfo.title" :inputWidth="'300px'" :placeholder="'请输入主题'"></SingleInput>
            <div class="control is-horizontal">
              <div class="control-label">
                <label class="label">封面</label>
              </div>
              <div class="control">
                <div class="control">
                  <img v-if="adInfo.cover" :src="adInfo.cover" class="cover" @click="showBigImg(adInfo.cover)" style="width:160px;height:60px;">
                  <img v-else class="cover" src="/static/+.png" @click="fileImg($event)" style="cursor: pointer;width:160px;height:60px;" />
                  <div class="imgUploadBox">
                    <vue-core-image-upload
                      class="btn btn-primary imgUpload"
                      crop="local"
                      cropRatio="16:6"
                      :rotate="true"
                      @imageuploaded="imageuploaded"
                      :max-file-size="5242880"
                      compress="50"
                      extensions="png,jpeg,jpg"
                      :url="uploadUrl" >
                      <div style="width:300px;">
                        <a href="#" class="button">{{!adInfo.cover?'选择文件':'重新选择'}}</a><br>
                        <span> 建议尺寸 800*300px 或 16：6，<br>只支持JPG、PNG格式，图片大小不超过5M。</span>
                      </div>
                    </vue-core-image-upload>
                    <div class="masker" @click="fileImg($event)"></div>
                  </div>
                </div>
              </div>
            </div>
            <SingleInput :title="'跳转网址'" v-model="adInfo.link" :inputWidth="'300px'" :placeholder="'请输入跳转网址'"></SingleInput>
            <div class="control is-horizontal">
              <div class="control-label">
                <label class="label">展现时间</label>
              </div>
              <div class="control">
                <div class="control">
                  <datepicker placeholder="开始时间" @focus.native="unfocus" v-model="adInfo.startTime" :config="{ locale: l10n, enableTime: true, time_24hr: true, dateFormat: 'Y-m-d H:i:S' }"></datepicker>
                </div>
                <span class="timeMid">——</span>
                <div class="control">
                  <datepicker placeholder="结束时间" @focus.native="unfocus" v-model="adInfo.endTime" :config="{ locale: l10n, enableTime: true, time_24hr: true, dateFormat: 'Y-m-d H:i:S' }"></datepicker>
                </div>
              </div>
            </div>
            <div class="control is-horizontal">
              <div class="control-label">
                <label class="label"></label>
              </div>
              <div class="control">
                <button class="button is-primary" @click="submit">提交</button>
                <button class="button is-link" @click="goto('/autoresp/courseAd')">取消</button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import SingleInput from '../../components/widget/SingleInput.vue'
import helper from '../../helper'
import VueCoreImageUpload from 'vue-core-image-upload'
import Datepicker from 'vue-bulma-datepicker'
import api from 'lanmaLib/common/api'
export default{
  components: {
    'vue-core-image-upload': VueCoreImageUpload,
    SingleInput,
    Datepicker
  },
  directives: {
  },
  data () {
    return {
      id: 0,
      adInfo: {
        title: '',
        cover: '',
        link: '',
        startTime: '',
        endTime: '',
        limit: 7
      }
    }
  },
  computed: {
    uploadUrl() {
      return window.location.protocol + '//' + window.location.hostname + '/api/user/upload'
    },
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
    }
  },
  created () {
    this.id = this.$route.params.id
    if (this.id) {
      this.getInfo()
    }
  },
  mounted () {
  },
  methods: {
    getInfo () {
      api.autoresp.getGoodsAd(this.id)
        .then((data) => {
          this.adInfo = data
        })
    },
    goto (url) {
      this.$router.push(url)
    },
    imageuploaded (res) {
      this.adInfo.cover = res.data.url
    },
    fileImg (event) {
      var el = event.path[1]
      var elFile = el.querySelectorAll('input[type=file]')[0]
      elFile.click()
    },
    showBigImg (url) {
      url && helper.showBigImg(url)
    },
    unfocus(e) {
      e.target.blur()
    },
    validate () {
      if (!this.adInfo.title) {
        helper.showError('请输入主题')
        return false
      } else if (!this.adInfo.cover) {
        helper.showError('请输入封面')
        return false
      } else if (!this.adInfo.link) {
        helper.showError('请输入跳转网址')
        return false
      } else if (!this.adInfo.startTime || !this.adInfo.endTime) {
        helper.showError('请输入展示时间')
        return false
      }
      return true
    },
    submit () {
      if (!this.validate()) {
        return
      }
      if (this.id) {
        api.autoresp.updateGoodsAd(this.adInfo)
          .then(() => {
            helper.showSuccess('更新成功')
            this.$router.push('/autoresp/courseAd')
          })
          .catch((e) => {
            helper.showError('更新失败')
          })
      } else {
        api.autoresp.addGoodsAd(this.adInfo)
          .then(() => {
            helper.showSuccess('添加成功')
            this.$router.push('/autoresp/courseAd')
          })
          .catch((e) => {
            if (e.code === 6068) {
              helper.showError('最多可设置7条广告')
            } else {
              helper.showError(e.msg)
            }
          })
      }
    }
  },
  watch: {
  }
}
</script>

<style scoped lang="scss">
  .imgUploadBox{
    vertical-align: top;
    margin-left: 10px;
    position: relative;
    display: inline-block;
    width:300px;
    .imgUpload{
      max-width:300px;
      display: inline-block;
    }
    .masker{
      width:200px;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      &:hover{
        cursor: pointer;
      }
    }
    &:hover{
      .button{
        background: #eee;
      }
    }
  }
  .timeMid{
    height:32px;
    line-height: 32px;
    display:inline-block;
    margin: 0 5px;
    color: #ccc;
  }
</style>
