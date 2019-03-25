<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-ancestor">
        <div class="tile is-parent cl-form">
          <article class="tile is-child box">
            <div class="block">
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">名称</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="label.title" type="text" placeholder="名称">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">Code代码</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="label.code" type="text" placeholder="Code代码">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">父标签</label>
                </div>
                <div class="control">
                  <div class="control">
                    <label-select :root="0" :value="selectDefault" :selectCallback="selectCallback" />
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">显示顺序</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="label.display_order" type="text" placeholder="显示顺序">
                    <span class="help">数字越小，显示越靠前</span>
                  </div>
                </div>
              </div>

              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">目标图片</label>
                </div>
                <div class="control">
                  <div class="control">
                    <img v-if="label.labelImg" :src="label.labelImg" class="cover" @click="showBigImg(label.labelImg)" style="width:170px;height:170px;">
                    <img v-else class="cover" src="/static/+.png" @click="fileImg($event)" style="cursor: pointer;width:170px;height:170px;" />
                    <div class="imgUploadBox">
                      <vue-core-image-upload
                        class="btn btn-primary imgUpload"
                        crop="local"
                        cropRatio="1:1"
                        :rotate="true"
                        @imageuploaded="imageuploaded"
                        :max-file-size="5242880"
                        compress="50"
                        extensions="png,jpeg,jpg"
                        :url="uploadUrl" >
                        <div>
                          <a href="#" class="button">{{!label.labelImg?'选择文件':'重新选择'}}</a><br>
                          <span> 建议尺寸 176*176px，<br>只支持JPG、PNG格式，图片大小不超过5M。</span>
                        </div>
                      </vue-core-image-upload>
                      <div class="masker" @click="fileImg($event)"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">引导</label>
                </div>
                <div class="control">
                  <div class="control">
                    <textarea class="textarea" v-model="label.guide" @keyup="change"></textarea>
                  </div>
                </div>
              </div>
              <!--<div class="control is-horizontal">-->
                <!--<div class="control-label">-->
                  <!--<label class="label">课程标签介绍:默认</label>-->
                <!--</div>-->
                <!--<div class="control">-->
                  <!--<div class="control">-->
                    <!--<textarea class="textarea" v-model="label.description" @keyup="change"></textarea>-->
                    <!--<span>{{textLength}}/{{textMaxLength}}</span>-->
                  <!--</div>-->
                <!--</div>-->
              <!--</div>-->

              <div class="control is-horizontal" v-for="value,key in label.description">
                <div class="control-label">
                  <label class="label" v-if="hashTabel[key] || key == 'default'">课程标签介绍:{{key=='default'?'默认':hashTabel[key].title}}</label>
                </div>
                <div class="control">
                  <div class="control">
                    <textarea class="textarea" v-model="label.description[key]" @keyup="change"></textarea>
                    <span>最多可输入：{{textMaxLength}}个字</span>
                  </div>
                </div>
              </div>

              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label"></label>
                </div>
                <div class="control">
                  <button class="button is-primary" @click="submit(false)">提交</button>
                  <button class="button is-primary jump-to-add-btn" @click="submit(true)">提交并添加</button>
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
import labelModule from 'lanmaLib/modules/label'
import api from 'lanmaLib/common/api'
import helper from '../../helper'
import LabelSelect from 'components/widget/LabelSelect'
import VueCoreImageUpload from 'vue-core-image-upload'
export default {
  data () {
    return {
      title: '添加课程标签',
      id: 0,
      textMaxLength: 300,
      hashTabel: {},
      label: {
        id: 0,
        title: '',
        code: '',
        parent_id: 0,
        display_order: 0,
        description: {},
        guide: '',
        labelImg: ''
      },
      selectDefault: 0,
      labels: [],
      topLabels: []
    }
  },
  computed: {
    // textLength () {
    //   return this.label.description.length
    // }
    uploadUrl() {
      return window.location.protocol + '//' + window.location.hostname + '/api/user/upload'
    }
  },
  created () {
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    if (id) {
      if (this.$route.path.indexOf('add_child_label') !== -1) {
        this.selectDefault = id
        this.label.parent_id = id
      } else {
        this.id = id
      }
    }

    if (this.id) {
      this.title = '编辑课程标签'
      api.label.find(this.id)
        .then((label) => {
          this.selectDefault = label.parent_id
          this.label = label
          labelModule.getLabelList().then((labelList) => {
            var ageLabel = labelModule.getLabel(2).childs
            this.hashTabel = labelModule.getHashTable(labelList)
            var ageDeList = {
              default: label.description.default
            }
            for (let i = 0; i < ageLabel.length; i++) {
              ageDeList[ageLabel[i].id] = label.description[ageLabel[i].id] ? label.description[ageLabel[i].id] : ''
            }
            this.label.description = ageDeList
            console.log(ageDeList)
          })
        })
    } else {
      labelModule.getLabelList().then((labelList) => {
        var ageLabel = labelModule.getLabel(2).childs
        this.hashTabel = labelModule.getHashTable(labelList)
        var ageDeList = {
          default: ''
        }
        for (let i = 0; i < ageLabel.length; i++) {
          ageDeList[ageLabel[i].id] = ''
        }
        this.label.description = ageDeList
        console.log(ageDeList)
      })
    }
  },
  components: {
    Cleave,
    LabelSelect,
    'vue-core-image-upload': VueCoreImageUpload
  },
  methods: {
    change () {
      console.log(this.label.description)
      // if (this.label.description.length > this.textMaxLength) {
      //   this.label.description = this.label.description.substr(0, this.textMaxLength)
      // }
    },
    submit (jumpToAdd = false) {
      var id = this.label.id

      if (id) {
        api.label.edit(id, this.label).then((res) => {
          console.log(res)
          this.$router.push('/system/label_list')
          helper.showSuccess('编辑成功')
          this.$label.getLabelList(true)
        })
        .catch((e) => {
          console.log(e)
          helper.showError(e.message)
        })
      } else {
        api.label.add(this.label).then((res) => {
          console.log(res)
          helper.showSuccess('添加成功')
          if (jumpToAdd) {
            this.label.title = ''
            this.label.code = ''
            this.label.parent_id = 0
          } else {
            this.$router.push('/system/label_list')
          }
          this.$label.getLabelList(true)
        })
        .catch((e) => {
          console.log(e)
          helper.showError(e.message)
        })
      }
    },
    selectCallback (id) {
      if (id !== this.label.id) {
        this.label.parent_id = id
      } else {
        if (this.label.parent_id) {
          this.selectDefault = this.label.parent_id
        } else {
          this.selectDefault = 0
        }
        helper.showError('不能添加自己作为父标签')
      }
    },
    fileImg (event) {
      var el = event.path[1]
      var elFile = el.querySelectorAll('input[type=file]')[0]
      elFile.click()
    },
    showBigImg (url) {
      url && helper.showBigImg(url)
    },
    imageuploaded(res) {
      this.label.labelImg = res.data.url
    }
  }
}
</script>

<style scoped lang="scss">
.button {
  margin: 5px 0 0;
}

.control .button {
  margin: inherit;
}

.control button.jump-to-add-btn{
  margin-left:10px;
}
.imgUploadBox{
  height:100%;
  vertical-align: top;
  margin-left: 10px;
  position: relative;
  display: inline-block;
  .imgUpload{
    height:100%;
  }
  .imgUploadText{
    height:100%;
    span{
      display: inline-block;
      font-size: 14px;
      color: #999;
      margin-top: 20px;
    }
  }
  .imgUpload{
    display: inline-block;
  }
  .masker{
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
</style>
