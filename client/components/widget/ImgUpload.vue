<template>
  <div class="control is-horizontal">
    <div class="control-label">
      <label class="label">{{ title }}</label>
    </div>
    <div class="control">
      <div class="control">
        <input class="input long" disabled :value="localImgUrlList" type="text" :placeholder="placeholder">
        <input type="file" id="referPic" @change="onFileChange" style="display: none;">
        <span class="help" v-if="!isDisabled">
          <a href="#" class="clear" @click.prevent="clear">清空</a>
          <a href="#" class="upload" @click.prevent="uploadPhoto" v-if="localImgUrlList.length < imgLimit">上传</a>
        </span>
        <br/>
        <img :src="url" class="cover" v-for="url in localImgUrlList">
      </div>
    </div>
  </div>
</template>

<script>
import api from 'lanmaLib/common/api'
import helper from '../../helper'
import FormData from 'form-data'

export default {
  props: {
    title: {
      type: String,
      default: '图片'
    },
    value: {
      type: [String, Array]
    },
    imgLimit: {
      type: Number,
      default: 10
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  computed: {
    placeholder () {
      return this.title + 'url'
    },
    isSingle () {
      return typeof this.value === 'string'
    },
    localImgUrlList () {
      var retData = this.value
      if (this.isSingle) {
        retData = this.value ? [this.value] : []
      }
      return retData
    }
  },
  components: {},
  methods: {
    uploadPhoto(e) {
      e.target.closest('.help').previousElementSibling.click()
    },
    onFileChange(event) {
      var data = new FormData()
      data.append('file', event.target.files[0])
      api.photo.upload(data).then((data) => {
        this.addImgData(data.url)
        event.target.value = ''
        helper.showSuccess('上传成功')
      }).catch((error) => {
        event.target.value = ''
        helper.showError('上传失败：' + error.message)
      })
    },
    addImgData(singleData) {
      if (this.isSingle) {
        this.localImgUrlList.splice(0, 1, singleData)
      } else {
        this.localImgUrlList.push(singleData)
      }
      this.emitEvent()
    },
    clear() {
      if (this.isSingle) {
        this.localImgUrlList.splice(0, 1, '')
      } else {
        this.localImgUrlList = []
      }
      this.emitEvent()
    },
    emitEvent() {
      if (this.isSingle) {
        this.$emit('input', this.localImgUrlList[0])
      } else {
        this.$emit('input', this.localImgUrlList)
      }
    }
  }
}
</script>
<style scoped>
  .upload {
    margin-left: 60px;
  }
  .clear {
    color: #ccc;
  }
  .long {
    margin-bottom: 10px;
    width: 450px;
  }
</style>
