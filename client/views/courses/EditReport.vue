<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-ancestor">
        <div class="tile is-parent cl-form">
          <article class="tile is-child box">
            <h1 class="title">添加报告</h1>
            <div class="block">
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">日期</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="report.dateline" type="text" placeholder="日期">
                    <span class="help">比如：201703</span>
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">标题</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="report.title" type="text" placeholder="标题">
                    <span class="help">比如：写在即将来临的四月</span>
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">图片</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="report.photo" type="text" placeholder="封面url">
                    <input type="file" id="cover-file" @change="onFileChange" style="display: none;">
                    <span class="help"><a href="#" @click="uploadPhoto">上传</a></span>
                    <br />
                    <img :src="$helper.getImageUrl(report.photo)" class="cover" v-if="report.photo !== ''">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">报告</label>
                </div>
                <div class="control">
                  <div class="control">
                    <textarea class="textarea" v-model="report.content"></textarea>
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label"></label>
                </div>
                <div class="control">
                  <button class="button is-primary" @click="submit">提交</button>
                  <button class="button is-link">取消</button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cleave from 'vue-cleave'
import 'cleave.js/dist/addons/cleave-phone.cn'

import api from 'lanmaLib/common/api'
import helper from '../../helper'
import LabelSelect from 'components/widget/LabelSelect'

import FormData from 'form-data'

export default {
  data () {
    return {
      title: '添加报告',
      id: 0,
      report: {
        dateline: '',
        title: '',
        photo: '',
        content: ''
      }
    }
  },
  created () {
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    this.id = id

    if (this.id) {
      this.title = '编辑报告'
      api.admin.monthReport.find(this.id)
        .then((report) => {
          this.report = report
        })
    }
  },
  components: {
    Cleave,
    LabelSelect
  },
  methods: {
    uploadPhoto (e) {
      e.preventDefault()
      document.querySelector('#cover-file').click()
      return false
    },
    onFileChange (e) {
      var input = document.querySelector('#cover-file')

      console.log(input.files[0])
      var data = new FormData()
      data.append('file', input.files[0])

      api.photo.upload(data).then((data) => {
        console.log(data)
        var url = data.url
        this.report.photo = url
        input.value = ''
        helper.showSuccess('上传成功')
      }).catch((e) => {
        input.value = ''
        helper.showError('上传失败：' + e.message)
      })
    },
    submit () {
      if (this.id) {
        api.admin.monthReport.edit(this.id, this.report).then((res) => {
          console.log(res)
          this.$router.push('/courses/report_list')
          helper.showSuccess('添加成功')
        })
        .catch((e) => {
          console.log(e)
          helper.showError(e.message)
        })
      } else {
        api.admin.monthReport.add(this.report).then((res) => {
          console.log(res)
          helper.showSuccess('添加成功')
          this.$router.push('/courses/report_list')
        })
        .catch((e) => {
          console.log(e)
          helper.showError(e.message)
        })
      }
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

img.cover{
  height:100px;
}
</style>
