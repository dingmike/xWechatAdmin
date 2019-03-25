<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-ancestor">
        <div class="tile is-parent cl-form">
          <article class="tile is-child box">
            <tabs type="boxed" :selectedIndex="tabIndex">
              <tab-pane label="基本信息" :selected="tab === 'info'">
                <div class="block">
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label"><i class="isRequired" >*</i> 标题</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <input style="width:300px" class="input" v-model="capsule.topic" type="text" placeholder="名称" maxlength="20">
                        <label class="ruleLabel">建议少于10个字，不能超过20个字</label>
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label"><i class="isRequired" >*</i> 年龄</label>
                    </div>
                    <div class="control">
                      <div class="control  label-select">
                        <!--<label-select :root="2" :value="ageDefault" :selectCallback="selectAgeCallback" />-->
                        <select class="select" @change="selectAgeCallback" v-model="oneAgeLabelId">
                          <option :value="0">请选择</option>
                          <option :value="label.id" v-for="label in ageLabel">{{label.title}}</option>
                        </select>
                      </div>
                      <div class="control label-select" v-if="ageLabelShow">
                        <select class="select" @change="selectAgeChange" v-model="twoAgeLabelId">
                          <option :value="0">请选择</option>
                          <option :value="label.id" v-for="label in twoAgeLabel">{{label.title}}</option>
                        </select>
                      </div>
                      <a class="ageLabel" @click="addAgeLabel" v-else>+继续添加年龄标签</a>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label"><i class="isRequired" >*</i> 场景</label>
                    </div>
                    <div class="control">
                      <div class="control">
                      	<div class="checkboxPack" v-for="(item,index) in capsuleScenne">
                      		<input type="checkbox" :id="item.id" :value="item.id" v-model="capsule.labelScene">
  											  <label :for="item.id">{{item.title}}</label>
                      	</div>
                      </div>
                    </div>
                  </div>

                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label"><i class="isRequired" >*</i> 类型</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <select class="select" v-model="capsule.sceneType">
                          <option :value="0">请选择</option>
                          <option :value="1">一起玩</option>
                          <option :value="2">一起看</option>
                          <option :value="3">一起聊</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div v-if="showTargetMap" class="control is-horizontal" v-for="item,index in labelTargetMap">
                    <div class="control-label">
                      <label class="label" v-if="index == 0"><i class="isRequired" >*</i> 目标</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <label-select-tour :el="item" :root="1" :value="item.default" :selectCallback="selectCallback" />
                      </div>
                      <div class="control add-label" v-if="index==0" @click.prevent="addTargetLabel">
                        ✚ 继续添加标签
                      </div>
                      <div class="control del-label" v-if="index!=0" @click.prevent="delTargetLabel(index)">
                        ✖ 删除标签
                      </div>
                    </div>
                  </div>

                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label"><i class="isRequired" >*</i> 封面</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <img v-if="capsule.cover" :src="capsule.cover" class="cover" @click="showBigImg(capsule.cover)" style="width:170px;height:120px;">
                        <img v-else class="cover" src="/static/+.png" @click="fileImg($event)" style="cursor: pointer;width:170px;height:120px;" />
                        <div class="imgUploadBox">
                          <vue-core-image-upload
                            class="btn btn-primary imgUpload"
                            crop="local"
                            cropRatio="560:400"
                            :rotate="true"
                            @imageuploaded="imageuploaded"
                            :max-file-size="5242880"
                            compress="50"
                            extensions="png,jpeg,jpg"
                            :url="uploadUrl" >
                            <div>
                              <a href="#" class="button">{{!capsule.cover?'选择文件':'重新选择'}}</a><br>
                              <span> 建议尺寸 560*400或 4 : 3，<br>只支持JPG、PNG格式，图片大小不超过5M。</span>
                            </div>
                          </vue-core-image-upload>
                          <div class="masker" @click="fileImg($event)"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label"><i class="isRequired" >*</i> 详情页封面</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <img v-if="capsule.smallCover" :src="capsule.smallCover" class="cover" @click="showBigImg(capsule.smallCover)" style="width:170px;height:130px;">
                        <img v-else class="cover" src="/static/+.png" @click="fileImg($event)" style="cursor: pointer;width:170px;height:130px;" />
                        <div class="imgUploadBox">
                          <vue-core-image-upload
                            class="btn btn-primary imgUpload"
                            :crop="false"
                            cropRatio="auto"
                            :rotate="true"
                            @imageuploaded="imageuploadedSmall"
                            :max-file-size="5242880"
                            compress="50"
                            extensions="png,jpeg,jpg"
                            :url="uploadUrl" >
                            <div>
                              <a href="#" class="button">{{!capsule.smallCover?'选择文件':'重新选择'}}</a><br>
                              <span> 建议尺寸 660*380px，<br>只支持JPG、PNG格式，图片大小不超过5M。</span>
                            </div>
                          </vue-core-image-upload>
                          <div class="masker" @click="fileImg($event)"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!--<TextareaInput title="目标解读" placeholder="匹配目标自动添加" :isDisabled="true" v-model="targetDescription"></TextareaInput>-->

                  <TextareaInput :isRequired="true" :title="'简介'" v-model="capsule.capsuleDesc" :placeholder="'请输入简介'"></TextareaInput>

                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">道具/准备</label>
                    </div>
                    <div class="control">
                      <TextEditor v-model="capsule.property"></TextEditor>
                    </div>
                  </div>

                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label"><i class="isRequired" >*</i> 玩法/示范</label>
                    </div>
                    <div class="control">
                      <TextEditor v-model="capsule.sceneExample"></TextEditor>
                    </div>
                  </div>

                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">好处</label>
                    </div>
                    <div class="control">
                      <TextEditor v-model="capsule.benefit"></TextEditor>
                    </div>
                  </div>

                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">要点</label>
                    </div>
                    <div class="control">
                      <TextEditor v-model="capsule.keyPoint"></TextEditor>
                    </div>
                  </div>

                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">作者</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <span class="author" v-if="capsule.id || authorSelected.id">{{ authorSelected.id + " " + authorSelected.author }}</span>
                        <a class="author" @click="authorModal.visible = true">{{ capsule.id || authorSelected.id ? '重新选择' : '选择认证作者' }}</a>
                      </div>
                    </div>
                  </div>

                  <!--<div class="control is-horizontal">-->
                    <!--<div class="control-label">-->
                      <!--<label class="label">备注</label>-->
                    <!--</div>-->
                    <!--<div class="control">-->
                      <!--<TextEditor v-model="capsule.remarks"></TextEditor>-->
                    <!--</div>-->
                  <!--</div>-->

                  <TextareaInput :title="'备注'" v-model="capsule.remarks" :placeholder="'请输入备注'"></TextareaInput>

                  <!--<div class="control is-horizontal">-->
                    <!--<div class="control-label">-->
                      <!--<label class="label">练习</label>-->
                    <!--</div>-->
                    <!--<div class="control">-->
                      <!--<TextEditor v-model="capsule.exercise"></TextEditor>-->
                    <!--</div>-->
                  <!--</div>-->


                  <div class="control is-horizontal">
                    <div class="control is-horizontal">
                      <div class="control-label">
                        <label class="label">审核状态</label>
                      </div>
                      <div class="control">
                        <div class="control">
                          <select class="select" v-model="capsule.status">
                            <option value="1">审核不通过</option>
                            <option value="2" >待审核</option>
                            <option value="3" v-if="parseInt(userInfo.roles) === 1">审核通过</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label"></label>
                    </div>
                    <div class="control">
                      <button class="subBtn button is-primary" @click="submit">提交</button>
                      <button class="button is-link" @click="cancel">取消</button>
                    </div>
                  </div>
                </div>
              </tab-pane>
              <tab-pane label="练习数据" :disabled="action === 'add'" :selected="tab === 'data'">
              	<table class="table">
                  <thead>
                    <tr>
                      <th>序号</th>
                      <th>用户微信</th>
                      <th style="width:700px">练习内容</th>
                      <th>是否分享</th>
                      <th>提交时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item,index in exerList">
                      <td>{{index+1}}</td>
                      <td>{{item.wxname}}</td>
                      <td style="width:700px">
                        <div class="exerBox" v-if="item.exercise">
                          <span class="exerText" v-if="item.exercise.text && item.exercise.text.length !== 0">{{item.exercise.text}}</span>
                          <div class="audioBox" v-if="item.exercise.soundUrl && item.exercise.soundUrl.length !== 0">
                            <audio style="height:35px;width:50%;" controls>
                              <source :src="item.exercise.soundUrl"></source>
                            </audio>
                          </div>
                          <div class="photoBox" v-if="item.exercise.photoList && item.exercise.photoList.length !== 0">
                            <span v-for="item in item.exercise.photoList">
                              <img :src="item" @click="showBigImg(item)" />
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>{{item.exercise.hasShare ? '是' : '否'}}</td>
                      <td>{{item.updated_at}}</td>
                    </tr>
                  </tbody>
                </table>
              </tab-pane>
            </tabs>
          </article>
        </div>
      </div>
    </div>
    <card-modal :visible="authorModal.visible" @close="authorModal.visible=false" @cancel="authorModal.visible=false" @ok="confirmAuthor"
      :title="authorModal.title" :okText="authorModal.okText" :cancelText="authorModal.cancelText" transition="zoom">
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <article class="tile is-child box">
            <div class="columns">
              <div class="column">
                <p class="control has-addons">
                  <input class="input" type="text" v-model="searchKW" placeholder="名称">
                  <a class="button is-info">搜索</a>
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <article class="tile is-child box">
          	<div class="tile classify">
        	    <a :class="{'activeLink':activeLink === 0}" @click="activeLinkChange(0)">全部（{{amount[0]}}）</a>
        	    <template v-for="value,key in config.author.type">
        	      <span>|</span>
        	      <a :class="{'activeLink':activeLink === key}" @click="activeLinkChange(key)">{{value}}（{{amount[key]}}）</a>
        	    </template>
        	  </div>
            <table class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>作者</th>
                  <th>作者类型</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in authorModal.list" @click="authorBuffer = item" :class="[authorBuffer.id === item.id ? 'activeAuthor' : '', 'authorItem']">
                  <td>{{ item.id }}</td>
                  <td>{{ item.author }}</td>
                  <td>{{ item.authorType_title }}</td>
                </tr>
              </tbody>
            </table>
            <pagination :index="page" :count="pageCount" :loading="loading" @change="pages(arguments[0])"></pagination>
          </article>
        </div>
      </div>
    </card-modal>
  </div>
</template>

<script>
  import Cleave from 'vue-cleave'
  import { Tabs, TabPane } from 'vue-bulma-tabs'
  import { Collapse, Item as CollapseItem } from 'vue-bulma-collapse'
  import CardModal from '../../components/widget/CardModal.vue'
  import 'cleave.js/dist/addons/cleave-phone.cn'

  import LabelSelect from 'components/widget/LabelSelect'
  import LabelSelectTour from 'components/widget/LabelSelectTour'
  import TextEditor from 'components/widget/TextEditor'
  import TextareaInput from 'components/widget/TextareaInput'
  import ImgUpload from 'components/widget/ImgUpload'
  import Selecter from 'components/widget/Selecter'
  import SingleInput from 'components/widget/SingleInput'

  import api from 'lanmaLib/common/api'
  import labelModule from 'lanmaLib/modules/label'
  import helper from '../../helper'
  import _ from 'lodash'
  import VueCoreImageUpload from 'vue-core-image-upload'
  import config from 'lanmaLib/config'
  import userModule from 'lanmaLib/modules/user'
  import Pagination from 'components/Pagination'
  export default {
    data() {
      return {
        title: '添加胶囊',
        id: 0,
        tab: 'info',
        tabIndex: 0,
        action: 'add',
        labelList: [],
        hashTable: [],
        authorSelected: {},
        authorBuffer: {},
        searchKW: '',
        authorList: [],
        amount: {
          0: 0,
          1: 0,
          2: 0,
          3: 0,
          4: 0
        },
        activeLink: 0,
        capsule: {
          topic: '',      // 话题
          authorId: 0,     // 作者ID
          labelScene: [],       // 场景
          labelTarget: [],        // 目标ID
          labelAge: [],         // 选择年龄
          sceneExample: '',  // 场景示范
          keyPoint: '',       // 要点
          exercise: '',         // 练习
          status: 2,          // 审核状态
          cover: '',        // 封面
          smallCover: '',   // 详情封面
          sceneType: 0,     // 类型
          property: '',       // 道具/准备
          benefit: '',      // 好处
          capsuleDesc: '',    // 简介
          remarks: ''
        },
        labelTargetMapTest: [0],
        labelTargetMap: [
          {
            id: 0,
            default: 0
          }
        ],
        authorModal: {
          visible: false,
          okText: '确定',
          cancelText: '取消',
          title: '选择认证作者',
          list: []
        },
        selectDefault: 0,
        ageDefault: 0,
        config,
        ageLabel: [],
        oneAgeLabelId: 0,
        twoAgeLabel: [],
        twoAgeLabelId: 0,
        ageLabelShow: false,
        userInfo: '',
        capsuleScenne: [],
        page: 0,
        pageCount: 1,
        loading: false,
        targetDescription: '',
        rootLabel: [],
        capsuleScenneParent: 0,
        ageLabelBorder: {},
        exerList: [],
        showTargetMap: true
      }
    },
    created() {
      var id = parseInt(this.$route.params.id)
      // console.log(id)
      if (isNaN(id) || id < 0) {
        id = 0
      }
      if (id) {
        var tab = this.$route.params.tab
        var tabList = ['info', 'data']
        this.tab = tab
        this.tabIndex = tabList.indexOf(tab)
      }
      api.label.getRootLabel()
        .then((data) => {
          this.rootLabel = data.list
          for (var i = 0; i < data.list.length; i++) {
            if (data.list[i].code === 'capsuleScenne') {
              this.capsuleScenneParent = data.list[i].id
            }
          }
          labelModule.getLabelList().then((labelList) => {
            this.ageLabel = labelModule.getLabel(2).childs
            this.ageLabel = this.ageLabel.slice(0, this.ageLabel.length - 1)
            for (var i = 0; i < this.ageLabel.length; i++) {
              var temp = this.ageLabel[i].code.split(/_/)
              temp.splice(2, 1)
              this.ageLabelBorder[this.ageLabel[i].id] = temp
            }
            console.log(this.ageLabelBorder)
            this.capsuleScenne = labelModule.getLabel(this.capsuleScenneParent).childs
            this.hashTable = labelModule.getHashTable(labelList)
            if (id) {
              this.title = '编辑胶囊资料'
              this.action = 'edit'
              api.capsule.getCapsule(id)
                .then((data) => {
                  console.log(data)
                  this.id = id
                  this.selectDefault = data.labelTarget
                  this.labelTargetMap = []
                  for (let i = 0; i < data.labelTarget.length; i++) {
                    let temp = {}
                    temp.id = data.labelTarget[i]
                    temp.default = data.labelTarget[i]
                    this.labelTargetMap.push(temp)
                  }
                  // this.targetDescription = this.hashTable[data.labelTarget].description
                  data.benefit = data.benefit ? data.benefit : ''
                  data.capsuleDesc = data.capsuleDesc ? data.capsuleDesc : ''
                  data.capsuleExtra = data.capsuleExtra ? data.capsuleExtra : ''
                  data.property = data.property ? data.property : ''
                  data.remarks = data.remarks ? data.remarks : ''
                  this.capsule = data
                  if (data.labelAge[0]) {
                    this.oneAgeLabelId = data.labelAge[0]
                    this.ageDefault = data.labelAge[0]
                  }
                  if (data.labelAge[1]) {
                    this.twoAgeLabelId = data.labelAge[1]
                    this.ageLabelShow = true
                  }
                  this.getCapsuleExerciseAnsList(this.id)
                })
                .catch((e) => {
                  if (e.code === 6062) {
                    helper.showError('你没有权限进行查看')
                    this.$router.push('/capsule/list')
                  }
                })
              this.getAuthorList()
            } else {
              this.getAuthorList()
            }
          })
        })
      this.userInfo = userModule.getUserInfoFromStorage()
    },
    components: {
      Cleave,
      Tabs,
      TabPane,
      CardModal,
      LabelSelect,
      TextEditor,
      ImgUpload,
      Selecter,
      SingleInput,
      Collapse,
      CollapseItem,
      TextareaInput,
      Pagination,
      'vue-core-image-upload': VueCoreImageUpload,
      LabelSelectTour
    },
    computed: {
      uploadUrl() {
        return window.location.protocol + '//' + window.location.hostname + '/api/user/upload'
//      return window.location.protocol + '//' + 'lanmatest.xinjijiaoyu.com' + '/api/user/upload'
      }
    },
    watch: {
      searchKW () {
        this.search()
      },
      oneAgeLabelId () {
        this.twoAgeLabelChange()
      }
    },
    methods: {
      showBigImg (url) {
        url && helper.showBigImg(url)
      },
      fileImg (event) {
        var el = event.path[1]
        var elFile = el.querySelectorAll('input[type=file]')[0]
        elFile.click()
      },
      imageuploaded(res) {
        this.capsule.cover = res.data.url
      },
      imageuploadedSmall(res) {
        this.capsule.smallCover = res.data.url
      },
      twoAgeLabelChange () {
        if (!this.oneAgeLabelId || this.oneAgeLabelId === 0) {
          this.twoAgeLabel = []
          return
        } else {
          this.twoAgeLabel = []
          var ageLabelBorder = this.ageLabelBorder[this.oneAgeLabelId]
          for (var j = 0; j < this.ageLabel.length; j++) {
            if (parseInt(ageLabelBorder[0]) === parseInt(this.ageLabel[j].code.split(/_/)[1]) || parseInt(ageLabelBorder[0]) - 1 === parseInt(this.ageLabel[j].code.split(/_/)[1])) {
              this.twoAgeLabel.push(this.ageLabel[j])
            }
            if (parseInt(ageLabelBorder[1]) === parseInt(this.ageLabel[j].code.split(/_/)[0]) || parseInt(ageLabelBorder[1]) + 1 === parseInt(this.ageLabel[j].code.split(/_/)[0])) {
              this.twoAgeLabel.push(this.ageLabel[j])
            }
          }
          console.log(this.twoAgeLabel)
        }
      },
      submit() {
        this.capsule.labelAge = []
        if (this.oneAgeLabelId !== 0) {
          this.capsule.labelAge.push(this.oneAgeLabelId)
        }
        if (this.twoAgeLabelId !== 0) {
          this.capsule.labelAge.push(this.twoAgeLabelId)
        }
        this.capsule.labelTarget = []
        for (let i = 0; i < this.labelTargetMap.length; i++) {
          if (parseInt(this.labelTargetMap[i].id)) {
            this.capsule.labelTarget.push(this.labelTargetMap[i].id)
          }
        }
        this.capsule.labelTarget = _.uniq(this.capsule.labelTarget)
        if (!this.isCapsuleNull()) {
          return
        }
        var id = this.capsule.id
        if (id) {
          api.capsule.updateCapsule(this.capsule).then((res) => {
            helper.showSuccess('编辑成功')
            this.$router.push('/capsule/list')
          })
            .catch((e) => {
              // console.log(e)
              helper.showError(e.message)
            })
        } else {
          api.capsule.addCapsule(this.capsule).then((res) => {
            // console.log(res)
            console.log(this.capsule)
            helper.showSuccess('添加成功')
            this.$router.push('/capsule/list')
          })
            .catch((e) => {
              // console.log(e)
              helper.showError(e.message)
            })
        }
      },
      cancel() {
        this.$router.push('/capsule/list')
      },
      isCapsuleNull () {
        if (String(this.capsule.status) !== '3') {
          return true
        }
        var errorLog = {
          'topic': '请输入标题',      // 话题
          'authorId': '请选择作者',     // 作者ID
          'labelScene': '请选择场景',       // 场景
          'labelTarget': '请选择目标',        // 目标ID
          'labelAge': '请选择年龄',         // 选择年龄
          'sceneExample': '请填写玩法/示范',  // 场景示范
          'keyPoint': '请填写要点',       // 要点
          'exercise': '请填写练习',         // 练习
          'sceneType': '请选择类型',
          'cover': '请填写封面',
          'smallCover': '请填写详情页封面',
          'capsuleDesc': '请填写胶囊简介'
        }
        console.log(this.capsule.topic)
        if (!this.capsule.topic) {
          helper.showError(errorLog.topic)
          return false
        } else if (this.capsule.labelAge.length === 0) {
          helper.showError(errorLog.labelAge)
          return false
        } else if (this.capsule.labelScene.length === 0) {
          helper.showError(errorLog.labelScene)
          return false
        } else if (this.capsule.sceneType === 0) {
          helper.showError(errorLog.sceneType)
          return false
        } else if (this.capsule.labelTarget.length === 0) {
          helper.showError(errorLog.labelTarget)
          return false
        } else if (!this.capsule.cover) {
          helper.showError(errorLog.cover)
          return false
        } else if (!this.capsule.smallCover) {
          helper.showError(errorLog.smallCover)
          return false
        } else if (!this.capsule.capsuleDesc) {
          helper.showError(errorLog.capsuleDesc)
          return false
        } else if (!this.capsule.sceneExample || this.capsule.sceneExample === '<p><br></p>') {
          helper.showError(errorLog.sceneExample)
          return false
        }
        return true
      },
      getCapsuleExerciseAnsList (capsuleId) {
        console.log(1111)
        api.capsule.getCapsuleExerciseAnsList(capsuleId)
          .then((data) => {
            data.list.forEach(function (item) {
              item.exercise = JSON.parse(item.actionText)
              return item
            })
            this.exerList = data.list
          })
          .catch((e) => {
            this.exerList = []
          })
      },
      getAuthorList(page = 1) {
        var statusTitle = config.author.type
        var sexTitle = config.author.sex
        var params = {}
        params.page = page
        params.offset = (page - 1) * 10
        params.length = 10
        params.authorType = this.activeLink ? this.activeLink : 0
        params.authorTypeList = [0]
        for (var a in config.author.type) {
          params.authorTypeList.push(a)
        }
        api.capsule.getCertificaList(params).then((data) => {
          var _this = this
          data.list.forEach(function (item) {
            item.authorType_title = statusTitle[item.authorType]
            item.sex_title = sexTitle[item.sex]
            return item
          })
          this.loading = false
          this.page = page
          this.pageCount = Math.ceil(data.total / 10)
          for (var i = 0; i < data.authorTypeNumList.length; i++) {
            this.amount[i] = data.authorTypeNumList[i]
          }
          if (_this.capsule.authorId) {
            api.capsule.getCertifica(_this.capsule.authorId)
              .then((data) => {
                _this.authorSelected = _.pick(data, ['id', 'authorType_title', 'author'])
              })
              .catch(e => {
                console.log(e)
              })
          }
          this.authorList = this.authorModal.list = data.list.map(item => {
            if (item.id === _this.capsule.authorId) {
//            _this.authorSelected = _.pick(item, ['id', 'authorType_title', 'author'])
            }
            return _.pick(item, ['id', 'authorType_title', 'author'])
          })
        })
      },
      confirmAuthor() {
        this.authorModal.visible = false
        this.authorSelected = this.authorBuffer
        this.capsule.authorId = this.authorSelected.id
      },
      selectCallback(id, el) {
        el.id = id
        // if (typeof (id) !== 'undefined' && id !== 0) {
        //   this.targetDescription = this.hashTable[id].description
        // }
      },
      selectAgeCallback() {
        this.twoAgeLabelClear()
      },
      addAgeLabel () {
        if (!this.oneAgeLabelId || parseInt(this.oneAgeLabelId) === 0) {
          helper.showError('请先选择一个年龄段')
          return
        }
        this.ageLabelShow = true
      },
      selectAgeChange () {
        if (parseInt(this.twoAgeLabelId) === 0) {
          this.twoAgeLabelClear()
          return
        }
      },
      twoAgeLabelClear () {
        this.ageLabelShow = false
        this.twoAgeLabelId = 0
      },
      pages (page) {
        this.getAuthorList(page)
      },
      activeLinkChange (label) {
        if (this.activeLink !== label || this.searchKW.length !== 0) {
          this.activeLink = label
          this.getAuthorList()
          this.searchKW = ''
        }
      },
      search () {
        if (this.searchKW) {
          api.capsule.findCertifica(this.searchKW).then(data => {
            console.log(data)
            var statusTitle = config.author.type
            var sexTitle = config.author.sex
            data.list.forEach(function (item) {
              item.authorType_title = statusTitle[item.authorType]
              item.sex_title = sexTitle[item.sex]
              return item
            })
            this.authorList = this.authorModal.list = data.list
            this.page = 1
            this.pageCount = 1
            this.activeLink = 0
          })
        } else {
          this.getAuthorList()
        }
      },
      addTargetLabel () {
        this.labelTargetMap.push({id: 0, default: 0})
      },
      delTargetLabel (index) {
        this.showTargetMap = false
        this.labelTargetMap.splice(index, 1)
        this.labelTargetMap.forEach(function (item) {
          item.default = item.id
        })
        setTimeout(() => {
          this.showTargetMap = true
        }, 0)
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

  .control .author {
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

  .authorItem {
    cursor: pointer;
  }

  .authorItem:hover {
    background-color: #ddd;
  }

  .activeAuthor {
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
  .ageLabel {
  	padding-top: 3px;
  	margin-left: 3px;
  }
  .label-select select{
    margin:auto 10px;
    height:28px;
    margin-left: 0;
  }
  .activeLink {
	  color: #999;
  }
  .classify {
    padding-bottom: 15px;
  }
  .classify a, .classify span {
    margin-right: 10px;
  }
  .exerBox{
    .exerText{
      display: inline-block;
      margin-bottom: 5px;
    }
    .audioBox{
      audio{
      }
    }
    .photoBox{
      span{
        display: inline-block;
        width:70px;
        height:70px;
        margin-right: 10px;
        img{
          width:100%;
          height:100%;
        }
      }
    }
  }
  .subBtn{
    margin-left: 0 !important;
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
  .ruleLabel{
    color: #ccc;
    display: inline-block;
    line-height: 32px;
    margin-left: 5px;
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
  .isRequired{
    display: inline-block;
    color: red;
  }
</style>
