<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-ancestor">
        <div class="tile is-parent cl-form">
          <article class="tile is-child box">
            <tabs type="boxed">
              <tab-pane label="基本信息">
                <div class="block">
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">认证类型</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <select class="select" v-model="capsule.authorType">
                          <option :value="key" v-for="(value,key) in config.author.type">{{ value }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">名字</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <input class="input" v-model="capsule.author" type="text" placeholder="名字">
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">上传头像</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <input class="input" v-model="capsule.headImgUrl" type="text" placeholder="头像url">
                        <input type="file" id="headImgUrl-file" @change="onFileChange('headImgUrl-file')" style="display: none;">
                        <span class="help">
                          <a href="#" @click.prevent="uploadPhoto('headImgUrl-file')">上传</a>
                        </span>
                        <br />
                        <img :src="capsule.headImgUrl" v-if="capsule.headImgUrl !== ''" class="cover" @click="showBigImg(capsule.headImgUrl)">
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">性别</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <select class="select" v-model="capsule.sex">
                          <option :value="key" v-for="(value,key) in config.author.sex">{{ value }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">身份认证</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <input class="input" v-model="capsule.identity" type="text" placeholder="身份认证">
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">个性签名</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <input class="input" v-model="capsule.signature" type="text" placeholder="个性签名">
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">个人简介</label>
                    </div>
                    <div class="control">
                      <TextEditor v-model="capsule.personalDesc"></TextEditor>
                    </div>
                  </div>
              </tab-pane>
            </tabs>
            <div class="control is-horizontal">
              <div class="control-label">
                <label class="label"></label>
              </div>
              <div class="control">
                <button class="button is-primary" @click="submit">提交</button>
                <button class="button is-link" @click="cancel">取消</button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Cleave from 'vue-cleave'
  import { Tabs, TabPane } from 'vue-bulma-tabs'
  import { Collapse, Item as CollapseItem } from 'vue-bulma-collapse'
  import 'cleave.js/dist/addons/cleave-phone.cn'

  import LabelSelect from 'components/widget/LabelSelect'
  import TextEditor from 'components/widget/TextEditor'
  import TextareaInput from 'components/widget/TextareaInput'
  import ImgUpload from 'components/widget/ImgUpload'
  import Selecter from 'components/widget/Selecter'
  import SingleInput from 'components/widget/SingleInput'
  import FormData from 'form-data'

  import api from 'lanmaLib/common/api'
  import helper from '../../helper'

  import config from 'lanmaLib/config'
  import ImageModal from '../../components/widget/ImageModal.vue'
  const ImageModalComponent = Vue.extend(ImageModal)

  export default {
    data() {
      return {
        title: '添加认证',
        id: 0,
        action: 'add',
        capsule: {
          id: 0,
          author: '',
          headImgUrl: '',
          identity: '',
          authorType: 1,
          capsuleNum: 0,
          sex: 1,
          signature: '',
          personalDesc: ''
        },
        config
      }
    },
    created() {
      var id = parseInt(this.$route.params.id)
      if (isNaN(id) || id < 0) {
        id = 0
      }
      this.id = id
      if (id) {
        this.title = '编辑胶囊资料'
        this.action = 'edit'
        // console.log(this.action)
        api.capsule.getCertifica(this.id)
          .then((data) => {
            this.capsule = data
          })
      }
    },
    components: {
      Cleave,
      Tabs,
      TabPane,
      LabelSelect,
      TextEditor,
      ImgUpload,
      Selecter,
      SingleInput,
      Collapse,
      CollapseItem,
      TextareaInput
    },
    methods: {
      submit() {
        if (this.isCapsuleNull()) {
          return
        }
        var id = this.capsule.id
        if (id) {
          api.capsule.updateCertifica(this.capsule).then((res) => {
            // console.log(res)
            helper.showSuccess('编辑成功')
            this.$router.push('/capsuleAuth/list')
          })
            .catch((e) => {
              // console.log(e)
              helper.showError(e.message)
            })
        } else {
          api.capsule.addCertifica(this.capsule).then((res) => {
            // console.log(res)
            helper.showSuccess('添加成功')
            this.$router.push('/capsuleAuth/list')
          })
            .catch((e) => {
              // console.log(e)
              helper.showError(e.message)
            })
        }
      },
      cancel() {
        this.$router.push('/capsuleAuth/list')
      },
      isCapsuleNull () {
        var errorLog = {
          author: '请填写名字',
          identity: '请填写身份认证',
          headImgUrl: '请上传头像',
          signature: '请填写个性签名',
          personalDesc: '请填写个人简介'
        }
        for (var key in this.capsule) {
          if (this.capsule[key].length !== 'undefined' && this.capsule[key].length === 0) {
            helper.showError(errorLog[key])
            return true
          }
        }
        return false
      },
      confirmAgency() {
        this.agencyModal.visible = false
        this.agencySelected = this.agencyBuffer
        this.material.agency_id = this.agencySelected.id
      },
      filterAgency() {
        var keword = this.agencyKW
        if (keword === '') {
          this.agencyModal.list = this.agencyList
          return
        }
        this.agencyModal.list = this.agencyModal.list.filter(item => {
          return item.name.toLowerCase().match(keword.toLowerCase())
        })
      },
      selectCallback(id) {
        this.material.theme = id
      },
      selectAgeCallback(id) {
        this.material.age = id
      },
      selectSceneCallback(id) {
        this.material.scene = id
      },
      selectTargetCallback(id) {
        this.material.target = id
      },
      selectHomeworkTarget(id) {
        this.material.homework.participant = id
      },
      participant2Num(text) {
        var map = { '未选择': 0, '家长': 57, '孩子': 58, '孩子与家长': 59 }
        return map[text]
      },
      showBigImg (src) {
        const openImageModal = (propsData = {
          visible: true,
          Url: src
        }) => {
          return new ImageModalComponent({
            el: document.createElement('div'),
            propsData
          })
        }
        const imageModal = this.imageModal = openImageModal()
        imageModal.$children[0].active()
      },
      changeBox () {
        console.log(this.checkedNames)
      },
      onFileChange(id) {
        var input = document.querySelector('#' + id)
        // console.log(input.files[0])
        var data = new FormData()
        data.append('file', input.files[0])
        api.photo.upload(data).then((data) => {
          var url = data.url
          console.log(data.url)
          this.capsule.headImgUrl = url
          input.value = ''
          helper.showSuccess('上传成功')
        }).catch((e) => {
          input.value = ''
          helper.showError('上传失败：' + e.message)
        })
      },
      uploadPhoto(id) {
        document.querySelector('#' + id).click()
        return false
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

  .sub-control {
    width: 620px;
  }

  .sub-control .control-label {
    float: left;
    width: 20%;
  }

  .sub-control .option-label {
    width: 20%;
  }

  .question-type {
    line-height: 32px;
  }

  .minute {
    margin-left: 10px;
    line-height: 32px;
  }

  .sub-control .sub-control {
    float: left;
    width: 70%;
  }

  .sub-container {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 20px;
    margin: 20px;
    margin-left: 0;
  }

  .sub-container .control .input {
    width: 260px;
  }

  .sub-container .control .small-input {
    width: 130px;
  }

  .sub-container .control .textarea {
    width: 430px;
    min-width: 260px;
  }

  .control .delete-button {
    margin-left: 20px;
  }

  .control .is-primary {
    margin-left: 20px;
  }

  .control-list {
    margin-bottom: 20px;
  }

  .course-info {
    padding: 10px 470px 0 200px;
  }

  .control-item {
    margin-bottom: 20px;
  }

  .control div.is-container {
    display: block;
  }

  .control .agency {
    align-items: center;
    display: inline-flex;
    height: 32px;
    padding-left: 8px;
  }

  .updown {
    cursor: pointer;
    visibility: hidden;
  }

  .control:hover .updown {
    visibility: visible;
  }

  .agencyItem {
    cursor: pointer;
  }

  .agencyItem:hover {
    background-color: #ddd;
  }

  .activeAgency {
    background-color: #00d1b2;
  }

  .task-item {
    margin: 10px 0px;
    height: 36px;
  }

  .cover {
    height: 50px;
    margin-right: 10px;
  }

  .min-editor {
    width: 465px;
  }
  .checkboxPack {
    display: inline-block;
    padding-top: 7px;
    margin-right: 10px;
  }
  .checkboxPack input {
    zoom: 130%;
    vertical-align: middle;
  }
</style>