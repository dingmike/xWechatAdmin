<template>
  <div @click.stop="showAddContent = false">
    <div class="tile is-ancestor">
      <div class="tile is-parent cl-form">
        <article class="tile is-child box">
          <div class="title">
            <p>课件：{{material.title}}</p>
            <button @click="submit">提交</button>
          </div>
          <div class="tabBox">
            <ul>
              <li class="contentInfo" style="border-bottom: 1px dashed #a8a8a8;" @click="clickContent(1, showContentIndex)" :class="{'liActive':showContentIndex == 1}">
                <img :src="[showContentIndex == 1?'/static/materials/白/01-规范_03.png':'/static/materials/黑/01-规范_03.png']" />
                <div class="info">
                  <p>
                    基本信息
                  </p>
                  <span class="title_tab">
                    {{material.title?material.title:'未填写'}}
                  </span>
                </div>
              </li>
              <li class="moveBox" @click="moveContent('up')" v-if="material.content.length > 5">
                <i class="fa  fa-angle-up"></i>
              </li>
              <div class="moveContentListBox">
                <div class="moveContentList" :style="{transform: 'translateY(' + nowMoveNum * -61 + 'px)'}">
                  <li :class="{'noWrite':countIsWrite(item),'liActive':showContentIndex == (index+3)}" v-for="item,index in material.content" @click="clickContent(index + 3, showContentIndex)">
                    <img :src="countContentImgUrl(item, showContentIndex == (index+3))" />
                    <button class="delete" @click="deleteTask(item.type,index)"></button>
                    <div class="info">
                      <p>
                        {{index + 1}}.{{item.type=='action'?'教学引导':item.type=='task'?'任务卡':'课堂笔记'}}
                      </p>
                      <span class="title_tab tabSummary" :class="{'tabSummary':item.type=='summary'}">
                        {{countSubTitle(item)}}
                      </span>
                    </div>
                    <div class="updown">
                      <span @click="contentMove('up',index)">▲</span>
                      <span @click="contentMove('down',index)">▼</span>
                    </div>
                  </li>
                </div>
              </div>
              <li class="moveBox" @click="moveContent('down')" v-if="material.content.length > 5">
                <i class="fa  fa-angle-down"></i>
              </li>
              <li class="addLi" @click.stop="showAddContent = !showAddContent">
                <span class="addLabel"><i style="font-size: 25px;font-style: normal;display: inline-block;line-height: 1">+</i>添加课堂内容</span>
                <div class="addContentBox" v-if="showAddContent">
                  <ul>
                    <li @click="createContent('action')" @mouseleave="imgMouse($event,'/static/materials/灰/01-规范_03-02.png')" @mouseenter="imgMouse($event, '/static/materials/黑/01-规范_03-02.png')">
                      <img :src="'/static/materials/灰/01-规范_03-02.png'" />
                      <div class="infoDialog">
                        <p>
                          教学引导
                        </p>
                        <span class="title_tab">
                          仅老师可见的教学提示
                        </span>
                      </div>
                    </li>
                    <li @click="createContent('task')" @mouseleave="imgMouse($event,'/static/materials/灰/01-规范_03-03.png')" @mouseenter="imgMouse($event, '/static/materials/黑/01-规范_03-03.png')">
                      <img :src="'/static/materials/灰/01-规范_03-03.png'" />
                      <div class="infoDialog">
                        <p>
                          任务卡
                        </p>
                        <span class="title_tab">
                          课堂上推送的互动任务
                        </span>
                      </div>
                    </li>
                    <li @click="createContent('summary')" @mouseleave="imgMouse($event,'/static/materials/灰/01-规范_03-04.png')" @mouseenter="imgMouse($event, '/static/materials/黑/01-规范_03-04.png')">
                      <img :src="'/static/materials/灰/01-规范_03-04.png'" />
                      <div class="infoDialog">
                        <p>
                          课堂笔记
                        </p>
                        <span class="title_tab">
                          课堂上推送的知识要点
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </li>
              <li class="contentInfo" style="border-top: 1px dashed #a8a8a8;border-bottom: 0px;" @click="clickContent(2, showContentIndex)" :class="{'liActive':showContentIndex == 2,'noWrite':!material.homework.title}">
                <img :src="countContentImgUrl(material.homework, showContentIndex == 2)" />
                <div class="info">
                  <p>
                    课后作业
                  </p>
                  <span class="title_tab">
                    {{material.homework.title?material.homework.title:'无'}}
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <div class="contentWarp">
            <div class="contentBox basicInfo " :class="{'content-active': showContentIndex==1}">
              <SingleInput :title="'课程名称'" :placeholder="'请输入课程名称'" :isRequired="true" :inputWidth="'240px'" v-model="material.title"></SingleInput>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">类型</label>
                </div>
                <div class="control">
                  <div class="control">
                    <select class="select" v-model="material.scene" :disabled="true">
                      <option :value="62">亲子互动课</option>
                      <option :value="64">户外/游学</option>
                    </select>
                  </div>
                </div>
              </div>
              <!--<div class="control is-horizontal">-->
                <!--<div class="control-label">-->
                  <!--<label class="label"><i class="isRequired">*</i> 封面</label>-->
                <!--</div>-->
                <!--<div class="control">-->
                  <!--<div class="control">-->
                    <!--<img v-if="material.cover" :src="material.cover" class="cover" @click="showBigImg(material.cover)" style="width:160px;height:90px;">-->
                    <!--<img v-else class="cover" src="/static/+.png" @click="fileImg($event)" style="cursor: pointer;width:160px;height:90px;" />-->
                    <!--<div class="imgUploadBox">-->
                      <!--<vue-core-image-upload-->
                        <!--class="btn btn-primary imgUpload"-->
                        <!--crop="local"-->
                        <!--cropRatio="16:9"-->
                        <!--:rotate="true"-->
                        <!--@imageuploaded="imageuploaded"-->
                        <!--:max-file-size="5242880"-->
                        <!--compress="50"-->
                        <!--extensions="png,jpeg,jpg"-->
                        <!--:url="uploadUrl" >-->
                        <!--<div>-->
                          <!--<a href="#" class="button">{{!material.cover?'选择文件':'重新选择'}}</a><br>-->
                          <!--<span> 建议尺寸 800*450px 或 16：9，<br>只支持JPG、PNG格式，图片大小不超过5M。</span>-->
                        <!--</div>-->
                      <!--</vue-core-image-upload>-->
                      <!--<div class="masker" @click="fileImg($event)"></div>-->
                    <!--</div>-->
                  <!--</div>-->
                <!--</div>-->
              <!--</div>-->
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label"><i class="isRequired" >*</i> 年龄</label>
                </div>
                <div class="control">
                  <div class="control">
                    <label-select :root="2" :value="defaults.age" :selectCallback="selectAgeCallback" />
                  </div>
                </div>
              </div>
              <div class="control is-horizontal" v-if="material.scene == 62">
                <div class="control-label">
                  <label class="label"><i class="isRequired">*</i> 学习目标</label>
                </div>
                <div class="control">
                  <div class="control">
                    <label-select :root="1" :value="defaults.theme" :selectCallback="selectCallback" />
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label"><i class="isRequired">*</i> 参与对象</label>
                </div>
                <div class="control">
                  <div class="control">
                    <label-select :root="3" :value="defaults.target" :selectCallback="selectTargetCallback" />
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label"><i class="isRequired">*</i> 课程内容</label>
                </div>
                <div class="control">
                  <TextEditor v-model="material.desc" style="height:250px" :footValue="'提示：内容将出现在课前预告中，帮助家长提前了解课程内容，并做相应的准备。'"></TextEditor>
                </div>
              </div>
            </div>

            <div class="contentBox task" v-for="(task, tindex) in material.content" :class="{'content-active': showContentIndex==(tindex+3)}">
              <template v-if="task.type == 'action'">
                <SingleInput :title="'标题'" :placeholder="'请输入标题'" :isRequired="true" :inputWidth="'240px'" v-model="task.title"></SingleInput>
                <div class="control is-horizontal">
                  <div class="control-label">
                    <label class="label"><i class="isRequired" >*</i> 时间</label>
                  </div>
                  <div class="control">
                    <input class="input small-input" v-model.number="task.time" type="text" placeholder="" style="width:220px">
                    <span class="minute">分钟</span>
                  </div>
                </div>
                <div class="control is-horizontal">
                  <div class="control-label">
                    <label class="label"><i class="isRequired">*</i> 内容</label>
                  </div>
                  <div class="control">
                    <TextEditor style="height:250px" v-model="task.desc"></TextEditor>
                  </div>
                </div>
              </template>
              <template v-if="task.type == 'summary'">
                <Selecter :title="'笔记类型'" :objList="contentTypeList" v-model="task.contentType"></Selecter>
                <ImgUpload :isRequired="true" :title="'封面图片'" v-model="task.content" v-if="task.contentType === 'pic'"></ImgUpload>
                <template v-if="task.contentType === 'text'">
                  <SingleInput :title="'链接形式'" value="<a href='链接网址'>链接文字</a>" :isDisabled="true" :inputWidth="'400px'"></SingleInput>
                  <SingleInput :title="'链接举例'" value="<a href='https://www.baidu.com'>百度</a>" :isDisabled="true" :inputWidth="'400px'"></SingleInput>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label"><i class="isRequired" >*</i> 笔记内容</label>
                    </div>
                    <div class="control">
                      <textarea class="textarea" v-model="task.content" type="text" placeholder="请输入笔记内容"></textarea>
                    </div>
                  </div>
                </template>
              </template>

              <template v-if="task.type == 'task'">
                <SingleInput :title="'任务名称'" :placeholder="'请输入任务名称'" :isRequired="true" :inputWidth="'240px'" v-model="task.title"></SingleInput>
                <div class="control is-horizontal">
                  <div class="control-label">
                    <label class="label"><i class="isRequired" >*</i> 时间</label>
                  </div>
                  <div class="control">
                    <input class="input small-input" v-model.number="task.time" type="text" placeholder="" style="width:220px">
                    <span class="minute">分钟</span>
                  </div>
                </div>
                <div class="control is-horizontal">
                  <div class="control-label">
                    <label class="label">任务组合</label>
                  </div>
                  <div class="control is-container">
                    <collapse :accordion="true" is-fullwidth>
                      <div class="sub-control sub-container">
                        <collapse-item :title="(aIndex+1) + '、' + questionTypeMap[ask.type]" v-for="(ask, aIndex) in task.questions">
                          <div slot="headSlot" class="headSlot">
                            <a>编辑</a>
                            <a @click.stop="deleteTask('question',tindex, aIndex)">删除</a>
                          </div>
                          <div @click.stop="" class="updown" style="top: 0;" slot="move">
                            <span @click="taskMove('up', tindex, aIndex)">▲</span>
                            <span @click="taskMove('down', tindex, aIndex)">▼</span>
                          </div>
                          <div class="control is-horizontal">
                            <div class="control-label">
                              <label class="label">题目</label>
                            </div>
                            <div class="control textareaBox">
                              <TextEditor v-model="ask.question" type="text" placeholder="问题"></TextEditor>
                            </div>
                          </div>
                          <template v-if="ask.type=='choose' || ask.type=='mulchoose'" v-for="(option, oindex) in ask.option">
                            <div class="control is-horizontal optionBox">
                              <div class="control-label">
                                <label class="label">选项 {{ optionMap[oindex] }}</label>
                              </div>
                              <div class="control">
                                <div class="control" style="width:300px">
                                  <input class="input" v-model="ask.option[oindex]" type="text" placeholder="">
                                </div>
                              </div>
                            </div>
                          </template>
                          <div class="control is-horizontal">
                            <div class="control-label">
                              <label class="label">提示</label>
                            </div>
                            <div class="control">
                              <textarea class="textarea" v-model="ask.prompt" type="text" placeholder=""></textarea>
                            </div>
                          </div>
                        </collapse-item>
                        <div class="card cardBox">
                          <button class="button is-primary" @click="createTaskQuestion('choose', tindex, $event)">✚ 单选</button>
                          <button class="button is-primary" @click="createTaskQuestion('mulchoose', tindex, $event)">✚ 多选</button>
                          <button class="button is-primary" @click="createTaskQuestion('photo', tindex, $event)">✚ 拍照</button>
                          <button class="button is-primary" @click="createTaskQuestion('sound', tindex, $event)">✚ 录音</button>
                        </div>
                      </div>
                    </collapse>
                  </div>
                </div>
              </template>
            </div>


            <div class="contentBox homework" :class="{'content-active': showContentIndex==2}">
              <div class="control-list">
                <div class="control is-horizontal">
                  <div class="control-label">
                    <label class="label"><i class="isRequired" >*</i> 作业名称</label>
                  </div>
                  <div class="control">
                    <div class="control">
                      <input class="input" v-model="material.homework.title" type="text" placeholder="名称">
                    </div>
                  </div>
                </div>
                <div class="control is-horizontal">
                  <div class="control-label">
                    <label class="label"><i class="isRequired">*</i> 参与对象</label>
                  </div>
                  <div class="control">
                    <div class="control">
                      <label-select :root="3" :value="homeworkDefaults.target" :selectCallback="selectHomeworkTarget" />
                    </div>
                  </div>
                </div>
                <div class="control is-horizontal">
                  <div class="control-label">
                    <label class="label">准备材料</label>
                  </div>
                  <div class="control">
                    <div class="control">
                      <input class="input large-input" v-model="material.homework.material" type="text" placeholder="">
                    </div>
                  </div>
                </div>
                <div class="control is-horizontal">
                  <div class="control-label">
                    <label class="label"><i class="isRequired" >*</i> 时间</label>
                  </div>
                  <div class="control">
                    <div class="control">
                      <input class="input" style="width:initial" v-model="material.homework.time" type="text" placeholder="">
                      <span class="minute">分钟</span>
                    </div>
                  </div>
                </div>

                <div class="control is-horizontal">
                  <div class="control-label">
                    <label class="label">作业内容</label>
                  </div>
                  <div class="control">
                    <TextEditor style="height:250px" v-model="material.homework.rule"></TextEditor>
                  </div>
                </div>
                <div class="control is-horizontal">
                  <div class="control-label">
                    <label class="label">要点提示</label>
                  </div>
                  <div class="control">
                    <TextEditor style="height:250px" v-model="material.homework.guide"></TextEditor>
                  </div>
                </div>
                <!--<div class="control is-horizontal">-->
                  <!--<div class="control-label">-->
                    <!--<label class="label">作业内容</label>-->
                  <!--</div>-->
                  <!--<div class="control">-->
                    <!--<div class="control">-->
                      <!--<textarea class="textarea" v-model="material.homework.rule" type="text" placeholder=""></textarea>-->
                    <!--</div>-->
                  <!--</div>-->
                <!--</div>-->
                <!--<div class="control is-horizontal">-->
                  <!--<div class="control-label">-->
                    <!--<label class="label">要点提示</label>-->
                  <!--</div>-->
                  <!--<div class="control">-->
                    <!--<div class="control">-->
                      <!--<textarea class="textarea" v-model="material.homework.guide" type="text" placeholder=""></textarea>-->
                    <!--</div>-->
                  <!--</div>-->
                <!--</div>-->
                <div class="control is-horizontal">
                  <div class="control-label">
                    <label class="label">题目组合</label>
                  </div>
                  <div class="control is-container homeworkBox">
                    <collapse accordion is-fullwidth>
                      <div class="sub-control sub-container">
                        <collapse-item :title="(aIndex+1) + '、' + questionTypeMap[ask.type]" v-for="(ask, aIndex) in material.homework.question">
                          <div slot="headSlot" class="headSlot">
                            <a>编辑</a>
                            <a @click.stop="deleteTask('homework',aIndex)">删除</a>
                          </div>
                          <div @click.stop="" class="updown" style="top: 0;" slot="move">
                            <span @click="homeworkMove('up', aIndex)">▲</span>
                            <span @click="homeworkMove('down', aIndex)">▼</span>
                          </div>
                          <div class="control is-horizontal">
                            <div class="control-label">
                              <label class="label">题目</label>
                            </div>
                            <div class="control textareaBox">
                              <TextEditor v-model="ask.question" type="text" placeholder="问题"></TextEditor>
                            </div>
                          </div>
                          <template v-if="ask.type=='choose' || ask.type=='mulchoose'" v-for="(option, oindex) in ask.option">
                            <div class="control is-horizontal optionBox">
                              <div class="control-label">
                                <label class="label">选项 {{ optionMap[oindex] }}</label>
                              </div>
                              <div class="control">
                                <div class="control" style="width:300px">
                                  <input class="input" v-model="ask.option[oindex]" type="text" placeholder="">
                                </div>
                              </div>
                            </div>
                          </template>
                          <div class="control is-horizontal">
                            <div class="control-label">
                              <label class="label">提示</label>
                            </div>
                            <div class="control">
                              <textarea class="textarea" v-model="ask.prompt" type="text" placeholder=""></textarea>
                            </div>
                          </div>
                        </collapse-item>
                        <div class="card cardBox">
                          <button class="button is-primary" @click="createHomework('choose', -1, $event)">✚ 单选</button>
                          <button class="button is-primary" @click="createHomework('mulchoose', -1, $event)">✚ 多选</button>
                          <button class="button is-primary" @click="createHomework('photo', -1, $event)">✚ 拍照</button>
                          <button class="button is-primary" @click="createHomework('sound', -1, $event)">✚ 录音</button>
                        </div>
                      </div>
                    </collapse>
                  </div>
                </div>
              </div>
            </div>
            <!--<div class="content_foot">-->
              <!--<div class="control">-->
                <!--<button class="button is-primary" @click="submit">保存</button>-->
                <!--<button class="button is-link" @click="goto('/materials/list')" style="text-decoration:none;">取消</button>-->
              <!--</div>-->
            <!--</div>-->
          </div>
          <!--<div class="footBox">-->
            <!--<button class="button is-primary" @click="submit">提交</button>-->
            <!--<button class="button is-link" @click="goto('/materials/list')" style="text-decoration:none;">取消</button>-->
          <!--</div>-->
        </article>
      </div>
    </div>
    <DialogModal :visible="modal.visible" @close="modal.visible=false" @cancel="modal.visible=false" @ok="confirm" :title="modal.title"
      :okText="modal.okText" :cancelText="modal.cancelText" transition="zoom">
      {{ modal.message }}
    </DialogModal>
  </div>
</template>

<script>
import Cleave from 'vue-cleave'
import 'cleave.js/dist/addons/cleave-phone.cn'
import LabelSelect from 'components/widget/LabelSelect'

import TextEditor from 'components/widget/TextEditor'
import ImgUpload from 'components/widget/ImgUpload'
import Selecter from 'components/widget/Selecter'
import SingleInput from 'components/widget/SingleInput'
import DialogModal from '../../components/widget/DialogModal.vue'
import { Collapse, Item as CollapseItem } from 'components/widget/collapse'
// import FormData from 'form-data'
import api from 'lanmaLib/common/api'
import labelModule from 'lanmaLib/modules/label'
import helper from '../../helper'
import _ from 'lodash'
// import config from 'lanmaLib/config'
import VueCoreImageUpload from 'vue-core-image-upload'

export default{
  components: {
    Cleave,
    DialogModal,
    LabelSelect,
    TextEditor,
    ImgUpload,
    Selecter,
    SingleInput,
    'vue-core-image-upload': VueCoreImageUpload,
    Collapse,
    CollapseItem
  },
  directives: {
  },
  data () {
    return {
      id: 0,
      showAddContent: false,
      showContentIndex: 1,
      labelList: [],
      material: {
        content: [
        ],
        title: '',
        scene: 62,
        cover: '',
        age: 0,
        theme: 0,
        target: 0,
        desc: '',
        materialType: 1,
        homework: {
          title: '',
          material: '',
          time: '',
          rule: '',
          guide: '',
          participant: 0,
          question: []
        }
      },
      defaults: {
        age: 0,
        theme: 0,
        target: 0
      },
      homeworkDefaults: {
        target: 0
      },
      optionMap: ['A', 'B', 'C', 'D'],
      questionTypeMap: { 'sound': '录音题', 'choose': '单选题', 'mulchoose': '多选题', 'photo': '拍照题' },
      contentTypeList: [
        {'value': 'pic', 'text': '图片'},
        {'value': 'text', 'text': '文本'}
      ],
      modal: {
        visible: false,
        okText: '确定',
        cancelText: '取消',
        title: '删除确认',
        message: '删除数据后将不能恢复，确定删除吗？'
      },
      delAction: {
        removeType: '',
        taskIndex: '',
        askIndex: ''
      },
      nowMoveNum: 0
    }
  },
  computed: {
    uploadUrl() {
      return window.location.protocol + '//' + window.location.hostname + '/api/user/upload'
//      return window.location.protocol + '//' + 'lanmatest.xinjijiaoyu.com' + '/api/user/upload'
    }
  },
  created () {
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    this.id = id
    if (id) {
      api.material.find(this.$route.params.id)
        .then((material) => {
          this.defaults = {
            age: material.age,
            theme: material.theme,
            target: material.target
          }
//        this.homeworkDefaults.target = material.homework.participant
//        this.selectDefault = material.theme
//        this.ageDefault = material.age
//        this.sceneDefault = material.scene
//        this.targetDefault = material.target
          this.homeworkDefaults.target = this.participant2Num(material.homework.participant)
          if (!('question' in material.homework)) {
            material.homework.question = []
          }
          if (!('referPic' in material)) {
            material.referPic = []
          }
          this.material = material
        })
      labelModule.getLabelList()
        .then((labelList) => {
          this.labelList = labelList
        })
    }
  },
  mounted () {
  },
  methods: {
    imageuploaded(res) {
      this.material.cover = res.data.url
    },
    selectAgeCallback(id) {
      this.material.age = id
    },
    selectCallback(id) {
      this.material.theme = id
    },
    selectTargetCallback(id) {
      this.material.target = id
    },
    selectHomeworkTarget(id) {
      this.material.homework.participant = id
    },
    participant2Num(text) {
      var map = { '未选择': 0, '家长': 57, '孩子': 58, '孩子与家长': 59, '家长、孩子': 59 }
      return map[text]
    },
    submit () {
      var id = this.material.id
      if (!(this.validateInfo() && this.validateContent() && this.validateHomework())) {
        return
      }
      var mapObj = { 0: '请选择', 57: '家长', 58: '孩子', 59: '孩子与家长' }
      if (!_.isEmpty(mapObj[this.material.homework.participant])) {
        this.material.homework.participant = mapObj[this.material.homework.participant]
      }
      if (id) {
        api.material.edit(id, this.material)
          .then((res) => {
            helper.showSuccess('编辑成功')
            this.$router.push('/materials/list')
          })
          .catch((e) => {
            helper.showError(e.message)
          })
      } else {
        api.material.add(this.material)
          .then((res) => {
            helper.showSuccess('添加成功')
            this.$router.push('/materials/list')
          })
          .catch((e) => {
            helper.showError(e.message)
          })
      }
    },
    validateInfo () {
      console.log(this.material.desc)
      var error = {
        'title': '请输入课程名称',
        'scene': '请选择类型',
        'cover': '请上传封面',
        'age': '请选择年龄',
        'theme': '请选择学习目标',
        'target': '请选择参与对象',
        'desc': '请填写课程内容'
      }
      if (!this.material.title) {
        helper.showError(error.title)
        return false
      } else if (!this.material.scene) {
        helper.showError(error.scene)
        return false
      } else if (parseInt(this.material.age) === 0) {
        helper.showError(error.age)
        return false
      } else if (parseInt(this.material.theme) === 0 && parseInt(this.material.scene) === 62) {
        helper.showError(error.theme)
        return false
      } else if (parseInt(this.material.target) === 0) {
        helper.showError(error.target)
        return false
      } else if (!this.material.desc || this.material.desc === '<p><br></p>') {
        helper.showError(error.desc)
        return false
      }
      return true
    },
    validateContent () {
      for (var i = 0; i < this.material.content.length; i++) {
        if (this.material.content[i].type === 'summary' && this.material.content[i].content === '') {
          helper.showError('' + (i + 1) + '.课堂笔记的内容不能为空 ')
          return false
        } else if (this.material.content[i].type === 'action' && this.material.content[i].title === '') {
          helper.showError('' + (i + 1) + '.教学引导的标题不能为空 ')
          return false
        } else if (this.material.content[i].type === 'action' && (this.material.content[i].desc === '' || this.material.content[i].desc === '<p><br></p>')) {
          helper.showError('' + (i + 1) + '.教学引导的内容不能为空 ')
          return false
        } else if (this.material.content[i].type === 'action' && this.material.content[i].time === '') {
          helper.showError('' + (i + 1) + '.教学引导的时间不能为空 ')
          return false
        } else if (this.material.content[i].type === 'task' && this.material.content[i].title === '') {
          helper.showError('' + (i + 1) + '.任务卡标题不能为空')
          return false
        } else if (this.material.content[i].type === 'task' && this.material.content[i].time === '') {
          helper.showError('' + (i + 1) + '.任务卡时间不能为空')
          return false
        } else if (this.material.content[i].type === 'task' && this.material.content[i].questions.length === 0) {
          helper.showError('' + (i + 1) + '.请给任务卡设置题目')
          return false
        } else if (this.material.content[i].type === 'task' && this.material.content[i].questions.length !== 0) {
          var questions = this.material.content[i].questions
          for (let j = 0; j < questions.length; j++) {
            if (questions[j].question === '') {
              helper.showError('' + (i + 1) + '.任务卡题目' + (j + 1) + '不能为空')
              return false
            }
          }
        }
      }
      return true
    },
    validateHomework () {
      if (this.material.homework.question && this.material.homework.question.length !== 0) {
        if (!this.material.homework.title) {
          helper.showError('作业的名称不能为空 ')
          return false
        } else if (!this.material.homework.time) {
          helper.showError('作业的完成时间不能为空 ')
          return false
        } else if (!this.material.homework.participant || this.material.homework.participant === '请选择') {
          helper.showError('请选择作业参与对象 ')
          return false
        } else if (this.material.homework.question.length !== 0) {
          var question = this.material.homework.question
          for (let j = 0; j < question.length; j++) {
            if (question[j].question === '') {
              helper.showError('题目' + (j + 1) + '不能为空')
              return false
            }
          }
        }
      }
      return true
    },
    goto (url) {
      this.$router.push(url)
    },
    createHomework(type, index, event) {
      var homework = { 'type': type, 'prompt': '', 'question': '' }
      if (type === 'choose' || type === 'mulchoose') {
        homework.option = ['', '', '', '']
      }
      this.material.homework.question.push(homework)
      this.$nextTick(() => { // 新加的题目自动展开
        var pEl = event.path[3]
        var elCollItem = pEl.getElementsByClassName('collapse-item')
        elCollItem[elCollItem.length - 1].getElementsByClassName('card-header')[0].click()
      })
    },
    homeworkMove (type, index) {
      var _this = this
      var temp
      switch (type) {
        case 'up':
          if (index <= 0) {
            return
          }
          temp = _this.material.homework.question[index - 1]
          _this.material.homework.question.splice(index - 1, 1, _this.material.homework.question[index])
          _this.material.homework.question.splice(index, 1, temp)
          break
        case 'down':
          if (index >= this.material.homework.question.length - 1) {
            return
          }
          temp = _this.material.homework.question[index + 1]
          _this.material.homework.question.splice(index + 1, 1, _this.material.homework.question[index])
          _this.material.homework.question.splice(index, 1, temp)
          break
        default:
          break
      }
    },
    createTaskQuestion(type, tindex, event) {
      var question = { 'type': type, 'prompt': '', 'question': '' }
      if (type === 'choose' || type === 'mulchoose') {
        question.option = ['', '', '', '']
      }
      this.material.content[tindex].questions.push(question)
      this.$nextTick(() => { // 新加的题目自动展开
        var pEl = event.path[3]
        var elCollItem = pEl.getElementsByClassName('collapse-item')
        elCollItem[elCollItem.length - 1].getElementsByClassName('card-header')[0].click()
      })
    },
    taskMove (type, tindex, aindex) {
      var _this = this
      var temp
      switch (type) {
        case 'up':
          if (aindex <= 0) {
            return
          }
          temp = _this.material.content[tindex].questions[aindex - 1]
          _this.material.content[tindex].questions.splice(aindex - 1, 1, _this.material.content[tindex].questions[aindex])
          _this.material.content[tindex].questions.splice(aindex, 1, temp)
          break
        case 'down':
          if (aindex >= _this.material.content[tindex].questions.length - 1) {
            return
          }
          temp = _this.material.content[tindex].questions[aindex + 1]
          _this.material.content[tindex].questions.splice(aindex + 1, 1, _this.material.content[tindex].questions[aindex])
          _this.material.content[tindex].questions.splice(aindex, 1, temp)
          break
        default:
          break
      }
    },
    deleteTask (type, tindex, aindex) {
      this.delAction = {
        removeType: type,
        taskIndex: tindex,
        askIndex: aindex
      }
      this.modal.visible = true
    },
    confirm() {
      this.modal.visible = false
      switch (this.delAction.removeType) {
        case 'task':
          this.material.content.splice(this.delAction.taskIndex, 1)
          if (this.material.content.length + 2 < this.showContentIndex) {
            this.showContentIndex -= 1
          }
          if (this.material.content.length >= 5 && this.nowMoveNum > this.material.content.length - 5) {
            this.nowMoveNum = this.material.content.length - 5
          }
          break
        case 'question':
          this.material.content[this.delAction.taskIndex].questions.splice(this.delAction.askIndex, 1)
          break
        case 'action':
          this.material.content.splice(this.delAction.taskIndex, 1)
          if (this.material.content.length + 2 < this.showContentIndex) {
            this.showContentIndex -= 1
          }
          if (this.material.content.length >= 5 && this.nowMoveNum > this.material.content.length - 5) {
            this.nowMoveNum = this.material.content.length - 5
          }
          break
        case 'summary':
          this.material.content.splice(this.delAction.taskIndex, 1)
          if (this.material.content.length + 2 < this.showContentIndex) {
            this.showContentIndex -= 1
          }
          if (this.material.content.length >= 5 && this.nowMoveNum > this.material.content.length - 5) {
            this.nowMoveNum = this.material.content.length - 5
          }
          break
        case 'homework':
          this.material.homework.question.splice(this.delAction.homeworkIndex, 1)
          break
        default:
          break
      }
    },
    contentMove (type, aindex) {
      var _this = this
      var temp
      switch (type) {
        case 'up':
          if (aindex <= 0) {
            return
          }
          temp = _this.material.content[aindex - 1]
          _this.material.content.splice(aindex - 1, 1, _this.material.content[aindex])
          _this.material.content.splice(aindex, 1, temp)
          setTimeout(() => {
            _this.showContentIndex = aindex + 2
            if (this.showContentIndex - 3 >= this.nowMoveNum + 5) {
              this.nowMoveNum += 1
            } else if (this.showContentIndex - 3 < this.nowMoveNum) {
              this.nowMoveNum -= 1
            }
          }, 100)
          console.log(_this.showContentIndex)
          break
        case 'down':
          if (aindex >= _this.material.content.length - 1) {
            return
          }
          temp = _this.material.content[aindex + 1]
          _this.material.content.splice(aindex + 1, 1, _this.material.content[aindex])
          _this.material.content.splice(aindex, 1, temp)
          setTimeout(() => {
            _this.showContentIndex = aindex + 4
            if (this.showContentIndex - 3 >= this.nowMoveNum + 5) {
              this.nowMoveNum += 1
            } else if (this.showContentIndex - 3 < this.nowMoveNum) {
              this.nowMoveNum -= 1
            }
          }, 100)
          break
        default:
          break
      }
    },
    createContent (type) {
      if (!(this.validateInfo() && this.validateContent() && this.validateHomework())) {
        return
      }
      switch (type) {
        case 'task':
          var task = { 'type': 'task', 'title': '', 'target': '', 'time': '', 'desc': '', 'validationHints': '', 'questions': [] }
          this.material.content.push(task)
          break
        case 'action':
          var action = { 'type': 'action', 'title': '', 'time': '', 'desc': '' }
          this.material.content.push(action)
          break
        case 'summary':
          var note = {'type': 'summary', 'contentType': 'text', 'content': ''}
          this.material.content.push(note)
          break
        default:
          break
      }
      this.showContentIndex = this.material.content.length + 2
      if (this.material.content.length > 5) {
        this.nowMoveNum = this.material.content.length - 5
      }
    },
    countSubTitle (item) {
      switch (item.type) {
        case 'task':
          return item.title ? item.title : '未填写'
        case 'action':
          return item.title ? item.title : '未填写'
        case 'summary':
          var temp
          if (item.contentType === 'pic') {
            if (item.content) {
              temp = '图片'
            } else {
              temp = '未填写'
            }
          } else {
            if (item.content) {
              temp = item.content
            } else {
              temp = '未填写'
            }
          }
          return temp
        default:
          break
      }
    },
    countIsWrite (item) {
      var temp
      switch (item.type) {
        case 'task':
          if (item.title) {
            temp = false
          } else {
            temp = true
          }
          return temp
        case 'action':
          if (item.title) {
            temp = false
          } else {
            temp = true
          }
          return temp
        case 'summary':
          if (item.content) {
            temp = false
          } else {
            temp = true
          }
          return temp
        default:
          break
      }
    },
    showBigImg (url) {
      url && helper.showBigImg(url)
    },
    fileImg (event) {
      var el = event.path[1]
      var elFile = el.querySelectorAll('input[type=file]')[0]
      elFile.click()
    },
    countContentImgUrl (item, flag) {
      var temp = ''
      var classify = ''
      var classifyTwo = ''
      if (item.type) {
        switch (item.type) {
          case 'task':
            classify = '03'
            if (item.title) {
              temp = false
            } else {
              temp = true
            }
            break
          case 'action':
            classify = '02'
            if (item.title) {
              temp = false
            } else {
              temp = true
            }
            break
          case 'summary':
            classify = '04'
            if (item.content) {
              temp = false
            } else {
              temp = true
            }
            break
          default:
            break
        }
      } else {
        classify = '05'
        if (item.title) {
          temp = false
        } else {
          temp = true
        }
      }
      if (flag) {
        classifyTwo = '白'
      } else {
        if (temp) {
          classifyTwo = '灰'
        } else {
          classifyTwo = '黑'
        }
      }
      return '/static/materials/' + classifyTwo + '/01-规范_03-' + classify + '.png'
    },
    imgMouse (event, url) {
      var imgEl = event.path[0].getElementsByTagName('img')[0]
      imgEl.src = url
    },
    moveContent (type) {
      var el = document.getElementsByClassName('moveContentList')[0]
      var elLi = el.getElementsByTagName('li')
      var max = elLi.length
      switch (type) {
        case 'up':
          if (this.nowMoveNum > 0) {
            this.nowMoveNum -= 1
          }
          break
        case 'down':
          if (max > 5 && this.nowMoveNum < max - 5) {
            this.nowMoveNum += 1
          }
          break
        default:
          break
      }
    },
    clickContent (index, nowIndex) {
      if (parseInt(this.showContentIndex) === parseInt(index)) {
        return
      }
      nowIndex = parseInt(nowIndex)
      if (nowIndex === 1) {
        if (!this.validateInfo()) {
          return
        }
      } else if (nowIndex === 2) {
        if (!this.validateHomework()) {
          return
        }
      } else {
        if (!this.validateContent()) {
          return
        }
      }
      // if (!(this.validateInfo() && this.validateContent() && this.validateHomework())) {
      //   return
      // }
      this.showContentIndex = index
    }
  },
  watch: {
  }
}
</script>

<style scoped lang="scss">
.isRequired{
  display: inline-block;
  color: red;
}
.title{
  border-bottom: 1px solid #dedfdf;
  padding-bottom: 20px;
  p{
    font-size: 16px;
    font-weight: bold;
    border-left: #44D4BF solid 5px;
    display: inline-block;
    padding-left: 10px;
    width:70%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  button{
    border: 0px;
    background: #44D4BF;
    color: #fff;
    padding: 5px 10px;
    float: right;
    margin-right:20px;
    margin-top: 5px;
  }
}
.tabBox{
  width:18%;
  display: inline-block;
  ul{
    .contentInfo:first-child{
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      &:after{
        content: '';
        position: absolute;
        width:14px;
        height:14px;
        background: #fff;
        border-radius: 50% 50%;
        bottom: -7px;
        left: -7px;
        z-index: 1001;
      }
      &:before{
        content: '';
        position: absolute;
        width:14px;
        height:14px;
        background: #fff;
        border-radius: 50% 50%;
        bottom: -7px;
        right: -7px;
        z-index: 1001;
      }
    }
    .contentInfo:last-child{
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      &:after{
        content: '';
        position: absolute;
        width:14px;
        height:14px;
        background: #fff;
        border-radius: 50% 50%;
        top: -7px;
        left: -7px;
        z-index: 1001;
      }
      &:before{
        content: '';
        position: absolute;
        width:14px;
        height:14px;
        background: #fff;
        border-radius: 50% 50%;
        top: -7px;
        right: -7px;
        z-index: 1001;
      }
    }
    li{
      width:85%;
      border-bottom: 1px solid #e3e3e3;
      box-sizing: border-box;
      display: flex;
      align-items:center;
      position: relative;
      background: #ebebeb;
      padding: 10px 15px;
      padding-left: 20px;
      img{
        width:30px;
        margin-right: 5px;
      }
      .info{
        display: inline-block;
        width:80%;
        p{
         font-weight: bold;
         line-height: 20px;
         width:100%;
        }
        span{
          display: inline-block;
          color: #666;
          width:100%;
        }
      }
    }
    .addLi{
      font-family: "微软雅黑";
      padding: 0;
      width:85%;
      height:60px;
      color: #999;
      font-size:14px;
      text-align: center;
      .addLabel{
        display: flex;
        align-items: center;
        i{
          margin-top: -4px;
        }
      }
      &>span{
        margin: 0 auto;
        line-height: 60px;
        display: inline-block;
      }
      &:hover{
        background: #ebebeb;
        .addLabel{
          color: #333;
        }
      }
    }
    .noWrite{
      color: #999;
      .title_tab{
        color: #999;
      }
    }
    .updown {
      width: 30px;
      position: absolute;
      right: -30px;
      top: 50%;
      z-index: 1500;
      transform: translateY(-50%);
      cursor: pointer;
      visibility: hidden;
      span{
        text-align: center;
        color: #666;
        display: block;
        &:hover{
          color: #333;
        }
      }
      &:hover{
        visibility: visible;
        span{
          color: #666 !important;
        }
      }
    }
    li:hover{
      background: #44D4BF;
      cursor: pointer;
      .delete{
        display: inline-block;
      }
      .updown{
        visibility: visible;
      }
    }
    .liActive{
      background: #44D4BF;
      color: #fff;
      .delete{
        display: inline-block;
      }
      span{
        color: #fff !important;
      }
      .updown{
        span{
          color: #666 !important;
        }
      }
    }
  }
}
.tabBox>ul>li:nth-last-child(2){
  border-bottom: 0px solid #dedede;
}
.contentWarp{
  display: inline-block;
  width:80%;
  max-height:70vh;
  padding-bottom: 5px;
  overflow: auto;
  vertical-align: top;
  padding-top: 10px;
  position: relative;
  .contentBox{
    z-index: 100;
    display: none;
  }
  .content-active{
    display: block;
  }
  .textarea{
/*    min-width:800px;*/
    min-width: 540px !important;
    max-width: 540px !important;
    resize: none;
  }
  .collapse-item{
    width: 750px;
  }
}
.delete{
  display: none;
  background-color: rgba(0,0,0,0);
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
}
.delete:hover::before, .delete:hover::after{
  background-color: #333;
}
.delete:after, .delete:before{
  background-color: #999;
  width:70%;
}
.content_foot{
  padding-left: 30%;
  padding-top: 30px;
}
.cardBox{
  width:750px;
  text-align: center;
  padding: 20px 30px;
  button{
    margin-right: 20px;
    background: #fff;
    color: #44D4BF;
    border: 1px solid #dcdcdc;
    font-weight: bold;
  }
}
.headSlot{
  display: inline-block;
  position: absolute;
  right: 40px;
  height:40px;
  a{
    line-height: 40px;
    margin-right: 20px;
  }
}
 .minute {
    margin-left: 10px;
    line-height: 32px;
  }
  .addContentBox{
    z-index: 200;
    position: absolute;
    right: -110%;
    width:100%;
    &:after{
      content: '';
      position: absolute;
      width:0;
      height:0;
      left:-30px;
      top:50%;
      margin-top: -15px;
      border-style: dashed solid dashed dashed ;
      border-color:transparent #ebebeb transparent transparent;
      border-width:15px;
    }
    ul{
      li{
        width:100%;
        border-bottom: 1px solid #e3e3e3;
        &:last-child{
          border-bottom: 0px solid #dedede;
        }
        &:hover{
          background: #ebebeb;
          color: #333;
          span{
            color: #666 !important;
          }
        }
        .infoDialog{
          text-align: left;
          line-height:1;
          font-size: 14px;
          p{
            font-size: 14px;
            font-weight: bold;
            line-height: 20px;
          }
          span{
            font-size: 14px;
            color: #999;
          }
        }
      }
    }
  }
  .imgUploadBox{
    vertical-align: top;
    margin-left: 10px;
    position: relative;
    display: inline-block;
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
  .tabSummary{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: bottom;
  }
  .footBox{
    width:100%;
    text-align: left;
    margin-top: 20px;
  }
  .moveBox{
    text-align: center;
    .fa{
      font-size: 20px;
      color: #666;
      display: block;
      width:100%;
    }
    &:hover{
      background: #ebebeb !important;
      .fa{
        color: #bbb;
      }
    }
  }
  .moveContentListBox{
    max-height: 305px;
    overflow-y: hidden;
    overflow-x: visible;
  }
  .moveContentList{
    transform: translateY(0);
    transition: 0.3s all;
  }
</style>
