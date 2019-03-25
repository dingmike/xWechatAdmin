<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-ancestor">
        <div class="tile is-parent cl-form">
          <article class="tile is-child box">
            <h1 class="title">{{title}}</h1>
            <div class="block">
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">标题</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="reader.title" type="text" placeholder="标题">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal" v-for="(item, index) in reader.labels.slice(1)">
                <div class="control-label">
                  <label class="label" v-if="index==0">主题标签</label>
                </div>
                <div class="control">
                  <div class="control">
                    <label-select :root="1" :value="item[item.length-1]" :selectCallback="themeCallback" :selectIndex="index">
                  </div>
                  <div class="control add-label" v-if="index==0" @click.prevent="addLabel">
                    ✚ 继续添加标签
                  </div>
                  <div class="control del-label" v-if="index!=0" @click.prevent="delLabel(index)">
                    ✖ 删除标签
                  </div>
                </div>
              </div>
              <div class="control is-horizontal" v-for="(item, index) in reader.labels[0]">
                <div class="control-label">
                  <label class="label" v-if="index==0">孩子年龄</label><!--此处年龄标签 固定为reader.label字段的第一项-->
                </div>
                <div class="control">
                  <div class="control">
                    <label-select :root="2" :value="item" :selectCallback="ageCallback" :selectIndex="index">
                  </div>
                  <div class="control add-label" v-if="index==0" @click.prevent="addAgeLabel">
                    ✚ 继续添加标签
                  </div>
                  <div class="control del-label" v-if="index!=0" @click.prevent="delAgeLabel(index)">
                    ✖ 删除标签
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">列表小图</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="reader.smallCover" type="text" placeholder="列表小图url">
                    <input type="file" id="small-cover-file" @change="onFileChange('small-cover-file')" style="display: none;">
                    <span class="help"><a href="#" @click.prevent="uploadPhoto('small-cover-file')">上传</a></span>
                    <br />
                    <img class="cover" :src="reader.smallCover" v-if="reader.smallCover !== ''">
                  </div>
                  <div class="control add-label">
                    &nbsp;&nbsp;&nbsp;（请上传长宽比为 4：3 的图片）
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">封面大图</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="reader.cover" type="text" placeholder="封面大图url">
                    <input type="file" id="cover-file" @change="onFileChange('cover-file')" style="display: none;">
                    <span class="help"><a href="#" @click.prevent="uploadPhoto('cover-file')">上传</a></span>
                    <br />
                    <img class="cover" :src="reader.cover" v-if="reader.cover !== ''">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">懒妈说</label>
                </div>
                <div class="control">
                  <div class="control">
                    <textarea class="textarea" v-model="reader.description"></textarea>
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">全文字数</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="reader.wordCount" type="text" placeholder="">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">阅读时间（分钟）</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="reader.readTime" type="text" placeholder="">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">导读</label>
                </div>
                <div class="control">
                  <TextEditor id="intro-html"></TextEditor>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">正文</label>
                </div>
                <div class="control">
                  <TextEditor id="content-html"></TextEditor>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">作者名</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="reader.author" type="text" placeholder="">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">作者/文章介绍</label>
                </div>
                <div class="control">
                  <div class="control">
                    <textarea class="textarea" v-model="reader.authorDesc"></textarea>
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">原文链接</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="reader.url" type="text" placeholder="url">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal" v-for="(item, index) in reader.relationList">
                <div class="control-label">
                  <label class="label" v-if="index===0">关联阅读</label>
                </div>
                <div class="control">
                  <div class="control related">
                    <span>{{ index + 1 + '、'}}{{ item.id }} {{ item.name }}</span>
                    <a href="#" @click.prevent="selectRelated(index)">{{ item.name==''?'选择关联阅读文章':'重新选择' }}</a>
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">对应星图</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="reader.starryPicUrl" type="text" placeholder="星空图url">
                    <input type="file" id="sky-img" @change="onFileChange('sky-img')" style="display: none;">
                    <span class="help"><a href="#" @click.prevent="uploadPhoto('sky-img')">上传</a></span>
                    <br />
                    <img class="cover" :src="reader.starryPicUrl" v-if="reader.starryPicUrl !== ''">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">审核状态</label>
                </div>
                <div class="control">
                  <div class="control">
                    <select class="select" v-model="reader.status">
                      <option value="1">未审核</option>
                      <option value="2">审核通过</option>
                      <option value="3">审核未通过</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="control is-horizontal" v-if="reader.status==3 || reader.reason">
                <div class="control-label">
                  <label class="label">审核未通过说明</label>
                </div>
                <div class="control">
                  <div class="control">
                    <textarea class="textarea" v-model="reader.reason"></textarea>
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label"></label>
                </div>
                <div class="control">
                  <button class="button is-primary" :class="{'is-loading':loading}" @click="submit">提交</button>
                  <button class="button is-primary preview"  :class="{'is-loading':loading}" @click="preview">保存&预览</button>
                  <router-link :to="'/readers/list/0'"><button class="button is-link">取消</button></router-link>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>

    <CardModalList :modal="relatedReadModal" @ok="changeRelated" :buffer="relatedBuffer"></CardModalList>

    <card-modal :visible="codeModal.visible" @close="codeModal.visible=false" @cancel="codeModal.visible=false" @ok="codeModal.visible=false" :title="codeModal.title"
      :okText="codeModal.okText" :cancelText="codeModal.cancelText" transition="zoom">
      <div class="modal-wrap">
        <img :src="codeModal.imgSrc" alt=""><br>
        <a>{{ codeModal.url }}</a>
      </div>
    </card-modal>

  </div>
</template>

<script>
import Cleave from 'vue-cleave'
import 'cleave.js/dist/addons/cleave-phone.cn'

import FormData from 'form-data'

import api from 'lanmaLib/common/api'
import helper from '../../helper'
import LabelSelect from 'components/widget/LabelSelect'
import CardModal from '../../components/widget/CardModal.vue'
import CardModalList from '../../components/widget/CardModalList.vue'
import TextEditor from 'components/widget/TextEditor'

export default {
  data () {
    return {
      title: '添加共读',
      id: 0,
      loading: false,
      reader: {
        id: 0,
        title: '',
        smallCover: '',
        labels: [[0], [0]],
        cover: '',
        url: '',
        description: '',
        introduction: '',
        wordCount: '',
        readTime: '',
        author: '',
        authorDesc: '',
        content: '',
        relationList: [{ 'id': '', 'name': '' }, { 'id': '', 'name': '' }, { 'id': '', 'name': '' }],
        starryPicUrl: '',
        status: 1
      },
      relatedIndex: 0,
      relatedBuffer: { 'id': '', 'name': '' },
      relatedReadModal: {
        visible: false,
        okText: '确定',
        cancelText: '取消',
        title: '选择关联阅读文章',
        list: []
      },
      codeModal: {
        visible: false,
        okText: '确定',
        cancelText: '取消',
        title: '预览链接',
        url: '',
        imgSrc: ''
      }
    }
  },
  created () {
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    this.id = id

    if (id) {
      this.title = '编辑共读'
      this.loading = true
      api.reader.admin.getDetail(this.$route.params.id)
        .then((reader) => {
          if (reader.labels[0].length === 0) {
            reader.labels[0] = [0]
          }
          this.reader = reader
          this.setEditorHtml()
          this.loading = false
        })
    }
    this.getList()
  },
  components: {
    Cleave,
    LabelSelect,
    TextEditor,
    CardModalList,
    CardModal
  },
  methods: {
    submit () {
      this.getEditorHtml()
      if (this.id) {
        console.log('submit:' + this.id)
        api.reader.admin.edit(this.id, this.reader).then((res) => {
          console.log(res)
          this.$router.push('/readers/list/0')
          helper.showSuccess('添加成功')
        })
        .catch((e) => {
          console.log(e)
          helper.showError(e.message)
        })
      } else {
        api.reader.admin.add(this.reader).then((res) => {
          console.log(res)
          helper.showSuccess('添加成功')
          this.$router.push('/readers/list/0')
        })
        .catch((e) => {
          console.log(e)
          helper.showError(e.message)
        })
      }
    },
    preview () {
      this.getEditorHtml()
      if (this.id) {
        api.reader.admin.edit(this.id, this.reader).then((res) => {
          this.createQrcode(this.id)
        })
        .catch((e) => {
          helper.showError(e.message)
        })
      } else {
        api.reader.admin.add(this.reader).then((res) => {
          this.id = this.reader.id = res.articleId
          this.createQrcode(res.articleId)
        })
        .catch((e) => {
          helper.showError(e.message)
        })
      }
    },
    uploadPhoto (id) {
      document.querySelector('#' + id).click()
      return false
    },
    onFileChange (id) {
      var input = document.querySelector('#' + id)

      console.log(input.files[0])
      var data = new FormData()
      data.append('file', input.files[0])

      api.photo.upload(data).then((data) => {
        var url = data.url
        if (id === 'cover-file') {
          this.reader.cover = url
        } else if (id === 'small-cover-file') {
          this.reader.smallCover = url
        } else if (id === 'sky-img') {
          this.reader.starryPicUrl = url
        }
        input.value = ''
        helper.showSuccess('上传成功')
      }).catch((e) => {
        input.value = ''
        helper.showError('上传失败：' + e.message)
      })
    },
    ageCallback (index, value) {
      this.reader.labels[0].splice(index, 1, value[0])
    },
    themeCallback (index, value) {
      this.reader.labels.splice(index + 1, 1, value)
      // this.reader.theme_label = value
      // this.themeDefaultVal.splice(index, 1, value)
    },
    addLabel () {
      this.reader.labels.push([0])
    },
    delLabel (index) {
      // this.themeDefaultVal.splice(index+1, 1)
      this.reader.labels.splice(index + 1, 1)
    },
    addAgeLabel () {
      this.reader.labels[0].push(0)
    },
    delAgeLabel (index) {
      // this.themeDefaultVal.splice(index+1, 1)
      this.reader.labels[0].splice(index, 1)
    },
    selectRelated (index) {
      this.relatedIndex = index
      this.relatedBuffer = this.reader.relationList[index]
      this.relatedReadModal.visible = true
    },
    changeRelated (item) {
      this.reader.relationList.splice(this.relatedIndex, 1, item)
    },
    getList () {
      var params = {
        'sortType': '',
        'labels': '',
        'offset': '',
        'length': ''
      }
      api.reader.filterArticleList(params)
      .then((data) => {
        this.relatedReadModal.list = data.list.map(function (item) {
          item.name = item.title
          return item
        })
      })
    },
    setEditorHtml () {
      document.querySelector('#intro-html .ql-editor').innerHTML = this.reader.introduction
      document.querySelector('#content-html .ql-editor').innerHTML = this.reader.content
    },
    getEditorHtml () {
      this.reader.introduction = document.querySelector('#intro-html .ql-editor').innerHTML
      this.reader.content = document.querySelector('#content-html .ql-editor').innerHTML
      this.reader.status = Number(this.reader.status)
      this.reader.labels.map(item => {
        if (String(item.slice(-1)[0]) === '0') {
          item.splice(item.length - 1, 1)
        }
      })
    },
    createQrcode (id) {
      this.codeModal.url = 'http://wxtest2.xinjijiaoyu.com/h/?#/parent/reader/preview/' + id
      if (window.location.host === 'lanma.xinjijiaoyu.com') {
        this.codeModal.url = 'https://wx.xinjijiaoyu.com/h/?#/parent/reader/preview/' + id
      }
      // api.course.getQrcode(this.codeModal.url).then((res) => {
      this.codeModal.imgSrc = './wxcgi/wx/createCustomQRCode?url=' + encodeURIComponent(this.codeModal.url) + '&&size=5'
      this.codeModal.visible = true
      // })
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

.add-label {
  line-height: 30px;
  color: #00d1b2;
  cursor: pointer;
}

.del-label {
  line-height: 30px;
  color: red;
  cursor: pointer;
}

.control.related {
  margin-top: 7px;
}

.button.is-primary.preview {
  margin-left: 10px;
}

.modal-wrap{
  text-align: center;
}
</style>
