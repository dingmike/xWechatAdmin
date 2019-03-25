<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-ancestor">
        <div class="tile is-parent cl-form">
          <article class="tile is-child box">
            <tabs type="boxed">
              <tab-pane label="基本信息">
                <div class="control is-horizontal">
                  <div class="control-label">
                    <label class="label">目标</label>
                  </div>
                  <div class="control">
                    <div class="control">
                      <label-select :isDisabled="disabled" :root="1" :value="defaults.target" :selectCallback="selectTargetCallback" />
                    </div>
                  </div>
                </div>

                <div class="control is-horizontal">
                  <div class="control-label">
                    <label class="label">适合年龄</label>
                  </div>
                  <div class="control">
                    <div class="control">
                      <!--<label-select :isDisabled="disabled" :root="2" :value="defaults.age" :selectCallback="selectAgeCallback" />-->
                      <select class="select" :disabled="disabled" style="padding-left: 5px;" v-model="info.labelAge">
                        <option :value="0">请选择</option>
                        <option :value="label.id" v-for="label in ageLabelMap">{{label.title}}</option>
                      </select>
                    </div>
                  </div>
                </div>
                <TextareaInput title="目标解读" placeholder="匹配目标自动添加" :isDisabled="true" v-model="targetDescription"></TextareaInput>
                <div class="control is-horizontal">
                  <div class="control-label">
                    <label class="label">勋章名</label>
                  </div>
                  <div class="control">
                    <div class="control course">
                      <input class="input" v-model="info.medalName" type="text" placeholder="请填写勋章名">
                    </div>
                  </div>
                </div>

                <div class="control is-horizontal">
                  <div class="control-label">
                    <label class="label">勋章图片</label>
                  </div>
                  <div class="control">
                    <div class="control">
                      <img v-if="info.medalImgUrl" :src="info.medalImgUrl" class="cover" @click="showBigImg(info.medalImgUrl)" style="width:170px;height:140px;">
                      <img v-else class="cover" src="/static/+.png" @click="fileImg($event)" style="cursor: pointer;width:170px;height:140px;" />
                      <div class="imgUploadBox">
                        <vue-core-image-upload
                          class="btn btn-primary imgUpload"
                          crop="local"
                          cropRatio="190:160"
                          :rotate="true"
                          @imageuploaded="imageuploaded"
                          :max-file-size="5242880"
                          compress="50"
                          extensions="png,jpeg,jpg"
                          :url="uploadUrl" >
                          <div>
                            <a href="#" class="button">{{!info.medalImgUrl?'选择文件':'重新选择'}}</a><br>
                            <span> 建议尺寸 190*160，<br>只支持JPG、PNG格式，图片大小不超过5M。</span>
                          </div>
                        </vue-core-image-upload>
                        <div class="masker" @click="fileImg($event)"></div>
                      </div>
                    </div>
                  </div>
                </div>

              </tab-pane>
              <tab-pane label="胶囊" :disabled="action === 'add'">
                <table class="table">
                  <thead>
                    <tr>
                      <th>第X天</th>
                      <th>胶囊</th>
                      <th>点击uv</th>
                      <th>打卡</th>
                      <th>分享</th>
                      <th>收藏</th>
                      <th>场景</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item,index in info.capsuleDetailList">
                      <td>{{index + 1}}</td>
                      <td>{{item.id ? item.topic : '请设置'}}</td>
                      <td>{{item.id ? item.clickNum : 0}}</td>
                      <td>{{item.id ? item.exerciseAnsNum : 0}}</td>
                      <td>{{item.id ? item.shareNum : 0}}</td>
                      <td>{{item.id ? item.collectNum : 0}}</td>
                      <td>{{ item.id? countSceneTitle(item.labelScene):'' }}</td>
                      <td>
                        <a v-if="!item.id" href="#" @click.prevent="addCapsule(index)">添加胶囊&nbsp;&nbsp;</a>
                        <template v-else>
                          <a href="#" @click.prevent="moveCapsule('up', index)">上移&nbsp;&nbsp;</a>
                          <a href="#" @click.prevent="moveCapsule('down', index)">下移&nbsp;&nbsp;</a>
                          <a href="#" @click.prevent="removeCapsule(index)">删除</a>
                        </template>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </tab-pane>
            </tabs>
            <div class="control is-horizontal">
              <div class="control-label">
                <label class="label"></label>
              </div>
              <div class="control">
                <button class="button is-primary" @click="submit" style="margin-right: 10px" :disabled="!disabled">提交</button>
                <button class="button" @click="draft">发布草稿</button>
                <button class="button is-link" @click="goto('/capsule/plan/list')">取消</button>
              </div>
            </div>

          </article>
        </div>
      </div>
    </div>
    <card-modal :visible="capsuleModal.visible" @close="capsuleModal.visible=false" @cancel="capsuleModal.visible=false" @ok="confirmCapsule"
                :title="capsuleModal.title" :okText="capsuleModal.okText" :cancelText="capsuleModal.cancelText" transition="zoom">
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <article class="tile is-child box">
            <div class="columns">
              <div class="column">
                <p class="control has-addons">
                  <input class="input" @keydown.enter="searchList" type="text" v-model="search.key" placeholder="名称">
                  <a class="button is-info" @click="searchList">搜索</a>
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
                <tr v-for="item in capsuleModal.list" @click="capsuleBuffer = item" :class="[capsuleBuffer.id === item.id ? 'activeAuthor' : '', 'authorItem']">
                  <td>{{ item.id }}</td>
                  <td>{{ item.topic }}</td>
                </tr>
              </tbody>
            </table>
            <pagination :index="page" :count="pageCount" :loading="loading" @change="pages(arguments[0])"></pagination>
          </article>
        </div>
      </div>
    </card-modal>
    <card-modal :visible="modal.visible" @cancel="modal.visible = false" @close="modal.visible = false" @ok="draft" :title="modal.title" :okText="'保存草稿'"  transition="zoom">
      <div style="text-align: center;">
        还有项目没有填写完成，无法发布。<br/>先保存为草稿？
      </div>
    </card-modal>
  </div>
</template>

<script>
// import _ from 'lodash'
import { Tabs, TabPane } from 'vue-bulma-tabs'
import LabelSelect from 'components/widget/LabelSelect'
import TextareaInput from 'components/widget/TextareaInput'
import VueCoreImageUpload from 'vue-core-image-upload'
import CardModal from '../../components/widget/CardModal.vue'
import api from 'lanmaLib/common/api'
import config from 'lanmaLib/config'
import labelModule from 'lanmaLib/modules/label'
import helper from '../../helper'
import Pagination from 'components/Pagination'
export default{
  components: {
    Tabs,
    TabPane,
    LabelSelect,
    TextareaInput,
    'vue-core-image-upload': VueCoreImageUpload,
    CardModal,
    Pagination
  },
  directives: {
  },
  data () {
    return {
      id: 0,
      defaults: {
        target: 0,
        age: 0
      },
      modal: {
        visible: false,
        title: '提示',
        message: ''
      },
      action: 'add',
      config,
      capsuleModal: {
        visible: false,
        okText: '确定',
        cancelText: '取消',
        title: '选择胶囊',
        list: []
      },
      capsuleBuffer: {},
      addIndex: 0,
      page: 0,
      pageCount: 1,
      loading: false,
      info: {
        labelTarget: 0,
        labelAge: 0,
        recommendReason: '',
        medalName: '',
        medalImgUrl: '',
        capsuleList: [],
        status: 0,
        capsuleDetailList: [{}, {}, {}, {}, {}, {}, {}]
      },
      targetDescription: '',
      search: {
        capsuleType: 0,
        status: 3,
        labelTarget: 0,
        labelAge: 0,
        sceneType: 0,
        key: ''
      },
      hashTable: {},
      disabled: false,
      capsuleScenneParent: 0,
      capsuleScenneList: {},
      ageLabelMap: []
    }
  },
  computed: {
    uploadUrl() {
      return window.location.protocol + '//' + window.location.hostname + '/api/user/upload'
    },
    params () {
      var params = {
        offset: (this.page - 1) * 20,
        length: 20,
        status: this.search.status,
        capsuleType: this.search.capsuleType,
        labelTarget: this.search.labelTarget,
        labelAge: this.search.labelAge,
        sceneType: this.search.sceneType,
        key: this.search.key
      }
      params.statusList = [0]
      for (var a in config.author.status) {
        params.statusList.push(a)
      }
      return params
    },
    labenAge () {
      return this.info.labelAge
    }
  },
  watch: {
    labenAge (val) {
      var id = this.info.labelTarget
      if (!this.hashTable[id]) {
        return
      }
      if (this.hashTable[id].description[val]) {
        this.targetDescription = this.hashTable[id].description[val]
      } else {
        this.targetDescription = this.hashTable[id].description.default
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
      this.action = 'edit'
      this.disabled = true
      this.$axios.all([this.getLabelList()])
        .then(() => {
          this.getRootLabel()
          this.getTargetInfo()
        })
    } else {
      this.getLabelList()
    }
  },
  mounted () {
  },
  methods: {
    getRootLabel () {
      return api.label.getRootLabel()
        .then((data) => {
          for (let i = 0; i < data.list.length; i++) {
            if (data.list[i].code === 'capsuleScenne') {
              this.capsuleScenneParent = data.list[i].id
            }
          }
          var List = labelModule.getLabel(this.capsuleScenneParent).childs
          var temp = {}
          for (let i = 0; i < List.length; i++) {
            temp[List[i].id] = List[i].title
          }
          this.capsuleScenneList = temp
        })
    },
    getLabelList () {
      return labelModule.getLabelList().then((labelList) => {
        this.hashTable = labelModule.getHashTable(labelList)
        this.ageLabelMap = labelModule.getLabel(2).childs
        this.ageLabelMap = this.ageLabelMap.slice(0, this.ageLabelMap.length - 1)
        console.log(this.ageLabelMap)
      })
    },
    countSceneTitle (list) {
      var temp = []
      try {
        for (let i = 0; i < list.length; i++) {
          if (this.capsuleScenneList[list[i]]) {
            temp.push(this.capsuleScenneList[list[i]])
          }
        }
      } catch (e) {
        console.log(e)
      }

      return temp.join('、')
    },
    getTargetInfo () {
      api.capsule.getTarget(this.id)
        .then((data) => {
          this.defaults = {
            target: data.labelTarget,
            age: data.labelAge
          }
          this.search.labelTarget = data.labelTarget
          this.search.labelAge = data.labelAge
          this.targetDescription = this.hashTable[data.labelTarget].description
          this.info = data
        })
    },
    getCapsuleList () {
      this.loading = true
      api.capsule.getCapsuleList(this.params)
        .then((data) => {
          this.capsuleModal.list = data.list
          this.loading = false
          this.pageCount = Math.ceil(data.total / 20)
        })
    },
    goto (url) {
      this.$router.push(url)
    },
    selectTargetCallback (id) {
      if (this.hashTable[id].description[this.info.labelAge]) {
        this.targetDescription = this.hashTable[id].description[this.info.labelAge]
      } else {
        this.targetDescription = this.hashTable[id].description.default
      }
      this.info.labelTarget = parseInt(id)
    },
    selectAgeCallback (id) {
      this.info.labelAge = parseInt(id)
    },
    fileImg (event) {
      var el = event.path[1]
      var elFile = el.querySelectorAll('input[type=file]')[0]
      elFile.click()
    },
    imageuploaded (res) {
      this.info.medalImgUrl = res.data.url
    },
    submit () {
      if (this.id) {
        if (!this.validate()) {
          return
        }
        this.info.capsuleList = []
        var temp = 0
        for (let i = 0; i < this.info.capsuleDetailList.length; i++) {
          if (this.info.capsuleDetailList[i].id) {
            this.info.capsuleList.push(this.info.capsuleDetailList[i].id)
            temp++
          } else {
            this.info.capsuleList.push(0)
          }
        }
        if (temp >= 7) {
          this.info.status = 1
          api.capsule.updateTarget(this.info)
            .then((data) => {
              this.$router.push('/capsule/plan/list')
            })
        } else {
          if (!this.validate()) {
            return
          }
          this.modal.visible = true
        }
      }
    },
    draft () {
      if (!this.validate()) {
        return
      }
      this.info.status = 2
      this.info.capsuleList = []
      for (let i = 0; i < this.info.capsuleDetailList.length; i++) {
        if (this.info.capsuleDetailList[i].id) {
          this.info.capsuleList.push(this.info.capsuleDetailList[i].id)
        } else {
          this.info.capsuleList.push(0)
        }
      }
      var apiName = 'addTarget'
      if (this.id) {
        apiName = 'updateTarget'
      }
      api.capsule[apiName](this.info)
        .then((data) => {
          this.modal.visible = false
          setTimeout(() => {
            this.$router.push('/capsule/plan/list')
          }, 100)
        })
    },
    validate () {
      if (!this.info.labelTarget) {
        helper.showError('请选择目标')
        return false
      } else if (!this.info.labelAge) {
        helper.showError('请选择年龄')
        return false
      } else if (!this.info.medalName) {
        helper.showError('请填写勋章名称')
        return false
      } else if (!this.info.medalImgUrl) {
        helper.showError('请上传勋章图片')
        return false
      }
      return true
    },
    pages (page) {
      this.page = page
      this.getCapsuleList()
    },
    confirmCapsule () {
      // this.capsuleBuffer.labelScene_title = []
      // for (let i = 0; i < this.capsuleBuffer.labelScene.length; i++) {
      //   if (this.capsuleScenneList[this.capsuleBuffer.labelScene[i]]) {
      //     this.capsuleBuffer.labelScene_title.push(this.capsuleScenneList[this.capsuleBuffer.labelScene[i]])
      //   }
      // }
      for (let i = 0; i < this.info.capsuleDetailList.length; i++) {
        if (this.info.capsuleDetailList[i].id === this.capsuleBuffer.id) {
          this.capsuleModal.visible = false
          helper.showError('已经添加过这个胶囊了')
          return
        }
      }
      this.info.capsuleDetailList.splice(this.addIndex, 1, this.capsuleBuffer)
      console.log(this.info.capsuleDetailList)
      this.capsuleModal.visible = false
    },
    showBigImg (url) {
      url && helper.showBigImg(url)
    },
    addCapsule (index) {
      this.addIndex = index
      this.page = 1
      this.getCapsuleList()
      this.capsuleModal.visible = true
    },
    // confirm () {
    //   this.info.capsuleList = []
    //   for (let i = 0; i < this.info.capsuleDetailList.length; i++) {
    //     if (this.info.capsuleDetailList[i].id) {
    //       this.info.capsuleList.push(this.info.capsuleDetailList[i].id)
    //     } else {
    //       this.info.capsuleList.push(0)
    //     }
    //   }
    //   this.info.status = 2
    //   api.capsule.updateTarget(this.info)
    //     .then((data) => {
    //       this.modal.visible = false
    //       setTimeout(() => {
    //         this.$router.push('/capsule/plan/list')
    //       }, 100)
    //     })
    // },
    searchList () {
      this.page = 1
      this.capsuleModal.list = []
      this.getCapsuleList()
    },
    moveCapsule (type, index) {
      switch (type) {
        case 'up':
          if (index <= 0) {
            return
          }
          let temp = this.info.capsuleDetailList[index - 1]
          this.info.capsuleDetailList.splice(index - 1, 1, this.info.capsuleDetailList[index])
          this.info.capsuleDetailList.splice(index, 1, temp)
          break
        case 'down':
          if (index >= this.info.capsuleDetailList.length - 1) {
            return
          }
          let temp1 = this.info.capsuleDetailList[index + 1]
          this.info.capsuleDetailList.splice(index + 1, 1, this.info.capsuleDetailList[index])
          this.info.capsuleDetailList.splice(index, 1, temp1)
          break
        default:
          break
      }
    },
    removeCapsule (index) {
      this.info.capsuleDetailList.splice(index, 1, {})
    }
  }
}
</script>

<style scoped lang="scss">
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
  .authorItem {
    cursor: pointer;
  }

  .authorItem:hover {
    background-color: #ddd;
  }
  .activeAuthor {
    background-color: #00d1b2;
  }
</style>
