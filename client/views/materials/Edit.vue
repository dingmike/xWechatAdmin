<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-ancestor">
        <div class="tile is-parent cl-form">
          <article class="tile is-child box">
            <tabs type="boxed">
              <tab-pane label="基本信息" class="abc">
                <div class="block">
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">名称</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <input class="input" v-model="material.title" type="text" placeholder="名称">
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">类型</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <select class="select" v-model="material.scene" @change="sceneChange(material.scene)" :disabled="action != 'add'">
                          <option value="62">体验坊</option>
                          <option value="64">游学</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">封面</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <input class="input" v-model="material.cover" type="text" placeholder="封面url">
                        <vue-core-image-upload
                          class="btn btn-primary imgUpload"
                          crop="local"
                          cropRatio="16:9"
                          :rotate="true"
                          @imageuploaded="imageuploaded"
                          :max-file-size="5242880"
                          compress="50"
                          extensions="png,jpeg,jpg"
                          :url="uploadUrl" >
                          <a href="#" @click.prevent="uploadPhoto('referPic')">上传<span style="color: #ccc;">（只支持JPG、PNG，大小不超过5M）</span></a>
                        </vue-core-image-upload>
                        <!--<span class="help">
                          <a href="#" @click.prevent="uploadPhoto('cover-file')">上传</a>
                        </span>-->
                        <br />
                        <img :src="material.cover" v-if="material.cover !== ''" class="cover" @click="showBigImg(material.cover)">
                      </div>
                    </div>
                  </div>
                  <!--<div class="control is-horizontal">
                    <div class="control-label">
                        <label class="label">参考图片</label>
                      </div>
                      <div class="control">
                        <div class="control">
                          <input class="input" :value="material.referPic" @input="material.referPic=[]" type="text" placeholder="参考图片url">
                          <input type="file" id="referPic" @change="onFileChange('referPic')" style="display: none;">
                          <span class="help">
                            <a href="#" @click.prevent="uploadPhoto('referPic')">上传</a>
                          </span>
                          <br />
                          <img :src="url" v-if="url" class="cover" v-for="url in material.referPic" @click="showBigImg(url)">
                        </div>
                      </div>
                    </div>-->
                    <div class="control is-horizontal">
                      <div class="control-label">
                        <label class="label">年龄</label>
                      </div>
                      <div class="control">
                        <div class="control">
                          <label-select :root="2" :value="ageDefault" :selectCallback="selectAgeCallback" />
                        </div>
                      </div>
                  </div>
                  <div class="control is-horizontal" v-if="material.scene == 62">
                    <div class="control-label">
                      <label class="label">学习目标</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <label-select :root="1" :value="selectDefault" :selectCallback="selectCallback" />
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">参与对象</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <label-select :root="3" :value="targetDefault" :selectCallback="selectTargetCallback" />
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">课程内容</label>
                    </div>
                    <div class="control">
                      <TextEditor v-model="material.desc"></TextEditor>
                    </div>
                  </div>

                  <!--<div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">教育机构</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <span class="agency" v-if="material.agency_id || agencySelected.id">{{ agencySelected.id + " " + agencySelected.name }}</span>
                        <a class="agency" @click="agencyModal.visible = true">{{ material.agency_id || agencySelected.id ? '重新选择' : '选择教育机构' }}</a>
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control is-horizontal">
                      <div class="control-label">
                        <label class="label">审核状态</label>
                      </div>
                      <div class="control">
                        <div class="control">
                          <select class="select" v-model="material.status">
                            <option value="0">未审核</option>
                            <option value="1">审核通过</option>
                            <option value="2">审核未通过</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>-->
                </div>
              </tab-pane>
              <tab-pane label="课程内容" :disabled="action === 'add'">
                <div class="control-list course-info">
                  <!--<div class="control is-horizontal">
                      <div class="control-label">
                        <label class="label">任务组合标题</label>
                      </div>
                      <div class="control">
                        <div class="control">
                          <input class="input" v-model="task.title" type="text" placeholder="名称">
                        </div>
                      </div>
                    </div>-->

                  <!--<div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">任务组合</label>
                    </div>
                    <div class="control is-container">-->
                  <!--<template>
                    <collapse accordion is-fullwidth>
                      <collapse-item title="Components">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris. @bulmaio. #css #responsive
                      </collapse-item>
                      <collapse-item title="Elements">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris. @bulmaio. #css #responsive
                      </collapse-item>
                        <collapse-item title="Nests" selected>
                        <collapse>
                          <collapse-item title="Nest Child" selected>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris. @bulmaio. #css #responsive
                          </collapse-item>
                        </collapse>
                      </collapse-item>
                    </collapse>
                  </template>-->
                  <collapse accordion is-fullwidth>
                    <template v-for="(task, tindex) in material.content">
                      <template v-if="task.type=='action'">
                        <div class="control is-horizontal">
                          <div class="updown">
                            <span @click="taskUp(material.content, tindex)">▲</span>
                            <span @click="taskDown(material.content, tindex)">▼</span>
                          </div>
                          <collapse-item :id="'collapse-'+tindex" :title="(tindex+1) + '、教学引导：' + task.title">
                            <div class="control is-container">
                              <div class="sub-control sub-container">
                                <div class="control is-horizontal">
                                  <div class="control-label">
                                    <label class="label">标题</label>
                                  </div>
                                  <div class="control">
                                    <input class="input" v-model="task.title" type="text" placeholder="标题">
                                  </div>
                                </div>
                                <div class="control is-horizontal">
                                  <div class="control-label">
                                    <label class="label">时间</label>
                                  </div>
                                  <div class="control">
                                    <input class="input small-input" v-model.number="task.time" type="text" placeholder="">
                                    <span class="minute">分钟</span>
                                  </div>
                                </div>
                                <div class="control is-horizontal">
                                  <div class="control-label">
                                    <label class="label">描述</label>
                                  </div>
                                  <div class="control">
                                    <TextEditor class="min-editor" v-model="task.desc"></TextEditor>
                                  </div>
                                </div>
                              </div>
                              <div class="control is-horizontal">
                                <div class="control-label">
                                  <label class="label"></label>
                                </div>
                                <div class="control">
                                  <button class="button is-primary" @click="createTask(tindex)">✚ 任务卡</button>
                                  <button class="button is-primary" @click="createAction(tindex)">✚ 教学引导</button>
                                  <button class="button is-primary" @click="createNote(tindex)">✚ 课堂笔记</button>
                                  <button class="button delete-button is-danger" @click="deleteTask(tindex)" v-if="task.type=='task'">✖ 删除</button>
                                  <button class="button delete-button is-danger" @click="deleteAction(tindex)" v-if="task.type=='action'">✖ 删除</button>
                                  <button class="button delete-button is-danger" @click="deleteNote(tindex)" v-if="task.type=='summary'">✖ 删除</button>
                                </div>
                              </div>
                            </div>
                          </collapse-item>
                        </div>
                      </template>
                      <template v-if="task.type=='summary'">
                        <div class="control is-horizontal">
                          <div class="updown">
                            <span @click="taskUp(material.content, tindex)">▲</span>
                            <span @click="taskDown(material.content, tindex)">▼</span>
                          </div>
                          <collapse-item :title="(tindex+1) + '、课堂笔记'">
                            <div class="control is-container">
                              <div class="sub-control sub-container">
                                <Selecter :title="'笔记类型'" :objList="contentTypeList" v-model="task.contentType"></Selecter>
                                <ImgUpload :title="'封面图片'" v-model="task.content" v-if="task.contentType === 'pic'"></ImgUpload>
                                <template v-if="task.contentType === 'text'">
                                  <SingleInput :title="'链接形式'" value="<a href='链接网址'>链接文字</a>" :isDisabled="true" :inputWidth="'400px'"></SingleInput>
                                  <SingleInput :title="'链接举例'" value="<a href='https://www.baidu.com'>百度</a>" :isDisabled="true" :inputWidth="'400px'"></SingleInput>
                                  <div class="control is-horizontal">
                                    <div class="control-label">
                                      <label class="label">笔记内容</label>
                                    </div>
                                    <div class="control">
                                      <textarea class="textarea" v-model="task.content" type="text" placeholder="请输入笔记内容"></textarea>
                                    </div>
                                  </div>
                                </template>
                              </div>
                              <div class="control is-horizontal">
                                <div class="control-label">
                                  <label class="label"></label>
                                </div>
                                <div class="control">
                                  <button class="button is-primary" @click="createTask(tindex)">✚ 任务卡</button>
                                  <button class="button is-primary" @click="createAction(tindex)">✚ 教学引导</button>
                                  <button class="button is-primary" @click="createNote(tindex)">✚ 课堂笔记</button>
                                  <button class="button delete-button is-danger" @click="deleteTask(tindex)" v-if="task.type=='task'">✖ 删除</button>
                                  <button class="button delete-button is-danger" @click="deleteAction(tindex)" v-if="task.type=='action'">✖ 删除</button>
                                  <button class="button delete-button is-danger" @click="deleteNote(tindex)" v-if="task.type=='summary'">✖ 删除</button>
                                </div>
                              </div>
                            </div>
                          </collapse-item>
                        </div>
                      </template>
                      <template v-if="task.type=='task'">
                        <div class="control is-horizontal">
                          <div class="updown">
                            <span @click="taskUp(material.content, tindex)">▲</span>
                            <span @click="taskDown(material.content, tindex)">▼</span>
                          </div>
                          <collapse-item :title="(tindex+1) + '、任务卡：' + task.title">
                            <div class="control is-container">
                              <div class="sub-control-large sub-container">
                                <div class="control is-horizontal">
                                  <div class="control-label">
                                    <label class="label">任务名称</label>
                                  </div>
                                  <div class="control">
                                    <div class="control">
                                      <input class="input" v-model="task.title" type="text" placeholder="标题">
                                    </div>
                                  </div>
                                </div>
                                <div class="control is-horizontal">
                                  <div class="control-label">
                                    <label class="label">时间</label>
                                  </div>
                                  <div class="control">
                                    <div class="control">
                                      <input class="input small-input" v-model="task.time" type="text" placeholder="">
                                      <span class="minute">分钟</span>
                                    </div>
                                  </div>
                                </div>
                                <div class="control is-horizontal">
                                  <div class="control-label">
                                    <label class="label">任务组合</label>
                                  </div>
                                  <div class="control is-container">
                                    <collapse accordion is-fullwidth>
                                      <div class="sub-control sub-container">
                                        <collapse-item :title="(aIndex+1) + '、' + questionTypeMap[ask.type]" v-for="(ask, aIndex) in task.questions">
                                          <div class="control is-horizontal">
                                            <div class="control-label">
                                              <label class="label">题目</label>
                                            </div>
                                            <div class="control textareaBox">
                                              <TextEditor v-model="ask.question" type="text" placeholder="问题"></TextEditor>
                                            </div>
                                          </div>
                                          <template v-if="ask.type=='choose' || ask.type=='mulchoose'" v-for="(option, oindex) in ask.option">
                                            <div class="control is-horizontal">
                                              <div class="control-label">
                                                <label class="label">选项 {{ optionMap[oindex] }}</label>
                                              </div>
                                              <div class="control">
                                                <div class="control">
                                                  <input class="input large-input" v-model="ask.option[oindex]" type="text" placeholder="">
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
                                          <div class="control is-horizontal">
                                            <div class="control-label">
                                              <label class="label"></label>
                                            </div>
                                            <div class="control">
                                              <button class="button is-primary" @click="createTaskQuestion(tindex,　aIndex, 'choose')">✚ 单选</button>
                                              <button class="button is-primary" @click="createTaskQuestion(tindex,　aIndex, 'mulchoose')">✚ 多选</button>
                                              <button class="button is-primary" @click="createTaskQuestion(tindex,　aIndex, 'photo')">✚ 拍照</button>
                                              <button class="button is-primary" @click="createTaskQuestion(tindex,　aIndex, 'sound')">✚ 录音</button>
                                              <button class="button delete-button is-danger" @click="deleteTaskQuestion(tindex, aIndex)">✖ 删除</button>
                                            </div>
                                          </div>
                                        </collapse-item>
                                        <template v-if="task.questions && task.questions.length==0">
                                          <button class="button is-primary" @click="createTaskQuestion(tindex,　-1, 'choose')">✚ 单选</button>
                                          <button class="button is-primary" @click="createTaskQuestion(tindex,　-1, 'mulchoose')">✚ 多选</button>
                                          <button class="button is-primary" @click="createTaskQuestion(tindex,　-1, 'photo')">✚ 拍照</button>
                                          <button class="button is-primary" @click="createTaskQuestion(tindex,　-1, 'sound')">✚ 录音</button>
                                        </template>
                                      </div>
                                    </collapse>
                                  </div>
                                </div>
                              </div>
                              <div class="control is-horizontal">
                                <div class="control-label">
                                  <label class="label"></label>
                                </div>
                                <div class="control">
                                  <button class="button is-primary" @click="createTask(tindex)">✚ 任务卡</button>
                                  <button class="button is-primary" @click="createAction(tindex)">✚ 教学引导</button>
                                  <button class="button is-primary" @click="createNote(tindex)">✚ 课堂笔记</button>
                                  <button class="button delete-button is-danger" @click="deleteTask(tindex)" v-if="task.type=='task'">✖ 删除</button>
                                  <button class="button delete-button is-danger" @click="deleteAction(tindex)" v-if="task.type=='action'">✖ 删除</button>
                                  <button class="button delete-button is-danger" @click="deleteNote(tindex)" v-if="task.type=='summary'">✖ 删除</button>
                                </div>
                              </div>
                            </div>
                          </collapse-item>
                        </div>
                      </template>
                    </template>
                  </collapse>
                  <div class="control is-horizontal" v-if="material.content && material.content.length==0">
                    <div class="control-label">
                      <label class="label"></label>
                    </div>
                    <div class="control">
                      <button class="button is-primary" @click="createTask(-1)">✚ 任务卡</button>
                      <button class="button is-primary" @click="createAction(-1)">✚ 教学引导</button>
                      <button class="button is-primary" @click="createNote(-1)">✚ 课堂笔记</button>
                    </div>
                  </div>
                </div>
              </tab-pane>
              <tab-pane label="作业" :disabled="action === 'add'">
                <div class="control-list">
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">作业名称</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <input class="input" v-model="material.homework.title" type="text" placeholder="名称">
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">参与对象</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <label-select :root="3" :value="homeworkTarget" :selectCallback="selectHomeworkTarget" />
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
                      <label class="label">时间</label>
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
                      <label class="label">游戏规则</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <textarea class="textarea" v-model="material.homework.rule" type="text" placeholder=""></textarea>
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">游戏指引</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <textarea class="textarea" v-model="material.homework.guide" type="text" placeholder=""></textarea>
                      </div>
                    </div>
                  </div>

                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">任务组合</label>
                    </div>
                    <div class="control is-container">
                      <collapse accordion is-fullwidth>
                        <div class="sub-control sub-container">
                          <collapse-item :title="(aIndex+1) + '、' + questionTypeMap[ask.type]" v-for="(ask, aIndex) in material.homework.question">
                            <div class="control is-horizontal">
                              <div class="control-label">
                                <label class="label">题目</label>
                              </div>
                              <div class="control textareaBox">
                                <TextEditor v-model="ask.question" type="text" placeholder="问题"></TextEditor>
                              </div>
                            </div>
                            <template v-if="ask.type=='choose' || ask.type=='mulchoose'" v-for="(option, oindex) in ask.option">
                              <div class="control is-horizontal">
                                <div class="control-label">
                                  <label class="label">选项 {{ optionMap[oindex] }}</label>
                                </div>
                                <div class="control">
                                  <div class="control">
                                    <input class="input large-input" v-model="ask.option[oindex]" type="text" placeholder="">
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
                            <div class="control is-horizontal">
                              <div class="control-label">
                                <label class="label"></label>
                              </div>
                              <div class="control">
                                <button class="button is-primary" @click="createHomework('choose', aIndex)">✚ 单选</button>
                                <button class="button is-primary" @click="createHomework('mulchoose', aIndex)">✚ 多选</button>
                                <button class="button is-primary" @click="createHomework('photo', aIndex)">✚ 拍照</button>
                                <button class="button is-primary" @click="createHomework('sound', aIndex)">✚ 录音</button>
                                <button class="button delete-button  is-danger" @click="deleteHomework(aIndex)">✖ 删除</button>
                              </div>
                            </div>
                          </collapse-item>
                          <template v-if="material.homework.question && material.homework.question.length==0">
                            <button class="button is-primary" @click="createHomework('choose', -1)">✚ 单选</button>
                            <button class="button is-primary" @click="createHomework('mulchoose', -1)">✚ 多选</button>
                            <button class="button is-primary" @click="createHomework('photo', -1)">✚ 拍照</button>
                            <button class="button is-primary" @click="createHomework('sound', -1)">✚ 录音</button>
                          </template>
                        </div>
                      </collapse>
                    </div>
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
    <card-modal :visible="modal.visible" @close="modal.visible=false" @cancel="modal.visible=false" @ok="confirm" :title="modal.title"
      :okText="modal.okText" :cancelText="modal.cancelText" transition="zoom">
      {{ modal.message }}
    </card-modal>
    <card-modal :visible="agencyModal.visible" @close="agencyModal.visible=false" @cancel="agencyModal.visible=false" @ok="confirmAgency"
      :title="agencyModal.title" :okText="agencyModal.okText" :cancelText="agencyModal.cancelText" transition="zoom">
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <article class="tile is-child box">
            <div class="columns">
              <div class="column">
                <p class="control has-addons">
                  <input class="input" type="text" v-model="agencyKW" @input="filterAgency" placeholder="名称">
                  <a class="button is-info" @click="filterAgency">搜索</a>
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
                <tr v-for="item in agencyModal.list" @click="agencyBuffer = item" :class="[agencyBuffer.id === item.id ? 'activeAgency' : '', 'agencyItem']">
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                </tr>
              </tbody>
            </table>
          </article>
        </div>
      </div>
    </card-modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Cleave from 'vue-cleave'
  import { Tabs, TabPane } from 'vue-bulma-tabs'
  import { Collapse, Item as CollapseItem } from 'vue-bulma-collapse'
  import CardModal from '../../components/widget/CardModal.vue'
  import 'cleave.js/dist/addons/cleave-phone.cn'

  import LabelSelect from 'components/widget/LabelSelect'
  import TextEditor from 'components/widget/TextEditor'
  import ImgUpload from 'components/widget/ImgUpload'
  import Selecter from 'components/widget/Selecter'
  import SingleInput from 'components/widget/SingleInput'

  import FormData from 'form-data'

  import api from 'lanmaLib/common/api'
  import labelModule from 'lanmaLib/modules/label'
  import helper from '../../helper'
  import _ from 'lodash'
  import config from 'lanmaLib/config'
  import ImageModal from '../../components/widget/ImageModal.vue'
  import VueCoreImageUpload from 'vue-core-image-upload'
  const ImageModalComponent = Vue.extend(ImageModal)
  export default {
    data() {
      return {
        title: '添加课程资料',
        id: 0,
        action: 'add',
        labelList: [],
        agencyList: [],
        labelTree: {},
        labelInfo: {},
        tagetLabels: {},
        agencySelected: { 'id': '', 'name': '' },
        agencyBuffer: { 'id': '', 'name': '' },
        agencyKW: '',
        material: {
          display_order: 0,
          cover: '',
          scene: 62,
          interest: '',
          targetDesc: '',
          summary: '',
          proposal: '',
          materialType: 1,
          status: 0,
          homework: {},
          referPic: [],
          title: '',
          age: 0,
          theme: 0,
          target: 0
        },
        modal: {
          visible: false,
          okText: '确定',
          cancelText: '取消',
          title: '删除确认',
          message: '删除数据后将不能恢复，确定删除吗？'
        },
        agencyModal: {
          visible: false,
          okText: '确定',
          cancelText: '取消',
          title: '选择教育机构',
          list: []
        },
        removeId: 0,
        removeType: 'task',
        selectDefault: 0,
        ageDefault: 0,
        sceneDefault: 62,
        targetDefault: 0,
        homeworkTarget: 0,
        taskIndex: 0,
        askIndex: 0,
        homeworkIndex: 0,
        config,
        optionMap: ['A', 'B', 'C', 'D'],
        questionTypeMap: { 'sound': '录音题', 'choose': '单选题', 'mulchoose': '多选题', 'photo': '拍照题' },
        contentTypeList: [
          {'value': 'pic', 'text': '图片'},
          {'value': 'text', 'text': '文本'}
        ],
        createTIndex: 0,
        createAIndex: -1
      }
    },
    computed: {
      uploadUrl() {
        return window.location.protocol + '//' + window.location.hostname + '/api/user/upload'
//      return window.location.protocol + '//' + 'lanmatest.xinjijiaoyu.com' + '/api/user/upload'
      }
    },
    watch: {
    },
    created() {
      var id = parseInt(this.$route.params.id)
      // console.log(id)
      if (isNaN(id) || id < 0) {
        id = 0
      }
      this.id = id

      if (id) {
        this.title = '编辑课程资料'
        this.action = 'edit'
        // console.log(this.action)
        api.material.find(this.$route.params.id)
          .then((material) => {
            this.selectDefault = material.theme
            this.ageDefault = material.age
            this.sceneDefault = material.scene
            this.targetDefault = material.target
            this.homeworkTarget = this.participant2Num(material.homework.participant)
            if (!('question' in material.homework)) {
              material.homework.question = []
            }
            if (!('referPic' in material)) {
              material.referPic = []
            }
            this.material = material
          })
        this.getAgencyList()
        labelModule.getLabelList().then((labelList) => {
          this.labelList = labelList
          this.labelTree = labelModule.getLabelTree(labelList)
          this.tagetLabels = this.labelTree[config.label.TARGET_LABEL_ID - 1].childs
          // console.log(this.labelTree)
        })
      } else {
        this.getAgencyList()
      }
    },
    mounted () {
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
      'vue-core-image-upload': VueCoreImageUpload
    },
    methods: {
      submit() {
        var id = this.material.id
        if (id) {
          // data.labelInfo = this.labelInfo
          var mapObj = { 0: '请选择', 57: '家长', 58: '孩子', 59: '孩子与家长' }
          if (!_.isEmpty(mapObj[this.material.homework.participant])) {
            this.material.homework.participant = mapObj[this.material.homework.participant]
          }
          console.log(this.material.homework)
          if (this.material.homework.question && this.material.homework.question.length !== 0) {
            if (!this.material.homework.title) {
              helper.showError('作业的名称不能为空 ')
              return
            } else if (!this.material.homework.time) {
              helper.showError('作业的完成时间不能为空 ')
              return
            }
          }
          for (var i = 0; i < this.material.content.length; i++) {
            if (this.material.content[i].type === 'summary' && this.material.content[i].content === '') {
              helper.showError('' + (i + 1) + '.课堂笔记的内容不能为空 ')
              return
            }
          }
          api.material.edit(id, this.material).then((res) => {
            // console.log(res)
            helper.showSuccess('编辑成功')
            this.$router.push('/materials/list/62')
          })
            .catch((e) => {
              // console.log(e)
              helper.showError(e.message)
            })
        } else {
          if (!this.validate()) {
            return
          }
          var apiName = ''
          if (parseInt(this.material.scene) === 62) {
            apiName = 'material'
          } else {
            apiName = 'material_tour'
          }
          api[apiName].add(this.material).then((res) => {
            // console.log(res)
            helper.showSuccess('添加成功')
            this.$router.push('/materials/list/' + this.material.scene)
          })
            .catch((e) => {
              // console.log(e)
              helper.showError(e.message)
            })
        }
      },
      validate() {
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
        } else if (!this.material.cover) {
          helper.showError(error.cover)
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
        } else if (!this.material.desc) {
          helper.showError(error.desc)
          return false
        }
        return true
      },
      cancel() {
        this.$router.push('/materials/list')
      },
      getAgencyList() {
        api.agency.getList().then((data) => {
          var _this = this
          this.agencyList = this.agencyModal.list = data.list.map(item => {
            if (item.id === _this.material.agency_id) {
              _this.agencySelected = _.pick(item, ['id', 'name'])
            }
            return _.pick(item, ['id', 'name'])
          })
        })
      },
      selectAgency(item) {
        this.agencyBuffer = item
        this.agencyModal.list = this.agencyModal.list.map(item => {
          item.isActive = false
          return item
        })
        item.isActive = true
      },
      setLabelInfo() {
        if (this.material.labels.length === 0 || this.labelList.length === 0) {
          return
        }
        var labelInfo = {}
        for (var i = 0; i < this.material.labels.length; i++) {
          var label = this.material.labels[i]
          // console.log(label)
          var parent = labelModule.getParent(label.id)
          // console.log(parent)
          if (parent) {
            labelInfo[parent.id] = label.id
          }
        }
        // console.log(labelInfo)
        this.labelInfo = labelInfo
      },
      createTask(tindex) {
        var task = { 'type': 'task', 'title': '', 'target': '', 'time': '', 'desc': '', 'validationHints': '', 'questions': [] }
        this.material.content.splice(tindex + 1, 0, task)
      },
      deleteTask (tindex) {
        this.modal.visible = true
        this.taskIndex = tindex
        this.removeType = 'task'
      },
      createTaskQuestion(tindex, aIndex, type) {
        var question = { 'type': type, 'prompt': '', 'question': '' }
        if (type === 'choose' || type === 'mulchoose') {
          question.option = ['', '', '', '']
        }
        this.material.content[tindex].questions.splice(aIndex + 1, 0, question)
      },
      deleteTaskQuestion(tIndex, aIndex) {
        this.modal.visible = true
        this.taskIndex = tIndex
        this.askIndex = aIndex
        this.removeType = 'question'
      },
      createAction(tindex) {
        var action = { 'type': 'action', 'title': '', 'time': '', 'desc': '' }
        this.material.content.splice(tindex + 1, 0, action)
      },
      deleteAction(tIndex) {
        this.modal.visible = true
        this.taskIndex = tIndex
        this.removeType = 'action'
      },
      createNote(tindex) {
        var note = {'type': 'summary', 'contentType': 'pic', 'content': ''}
        this.material.content.splice(tindex + 1, 0, note)
      },
      deleteNote(tIndex) {
        this.modal.visible = true
        this.taskIndex = tIndex
        this.removeType = 'note'
      },
      createHomework(type, index) {
        var homework = { 'type': type, 'prompt': '', 'question': '' }
        if (type === 'choose' || type === 'mulchoose') {
          homework.option = ['', '', '', '']
        }
        this.material.homework.question.splice(index + 1, 0, homework)
        // this.material.tasks[tIndex].push(task)
      },
      deleteHomework(index) {
        this.modal.visible = true
        this.homeworkIndex = index
        this.removeType = 'homework'
      },
      uploadPhoto(id) {
        document.querySelector('#' + id).click()
        return false
      },
      onFileChange(id) {
        var input = document.querySelector('#' + id)
        // console.log(input.files[0])
        var data = new FormData()
        data.append('file', input.files[0])
        api.photo.upload(data).then((data) => {
          var url = data.url
          console.log(data.url)
          if (id === 'cover-file') {
            this.material.cover = url
          } else if (id === 'referPic') {
            this.material.referPic.push(url)
          }
          input.value = ''
          helper.showSuccess('上传成功')
        }).catch((e) => {
          input.value = ''
          helper.showError('上传失败：' + e.message)
        })
      },
      confirm() {
        this.modal.visible = false
        switch (this.removeType) {
          case 'task':
            this.material.content.splice(this.taskIndex, 1)
            break
          case 'question':
            this.material.content[this.taskIndex].questions.splice(this.askIndex, 1)
            break
          case 'action':
            this.material.content.splice(this.taskIndex, 1)
            break
          case 'note':
            this.material.content.splice(this.taskIndex, 1)
            break
          case 'homework':
            this.material.homework.question.splice(this.homeworkIndex, 1)
            break
          default:
            break
        }
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
      taskUp(list, index) {
        if (index > 0) {
          var previewValue = list[index - 1]
          list.splice(index - 1, 1, list[index])
          list.splice(index, 1, previewValue)
        }
      },
      taskDown(list, index) {
        if (index < list.length - 1) {
          var nextValue = list[index + 1]
          list.splice(index + 1, 1, list[index])
          list.splice(index, 1, nextValue)
        }
      },
      setEditorHtml () {
        document.querySelector('#content-html .ql-editor').innerHTML = this.material.desc
      },
      getEditorHtml () {
        this.material.desc = document.querySelector('#content-html .ql-editor').innerHTML
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
      imagechanged(res) {
      },
      imageuploading() {
      },
      imageuploaded(res) {
        this.material.cover = res.data.url
      },
      sceneChange (scene) {
        if (String(scene) === '62') {
          this.material.materialType = 1
        } else {
          this.material.materialType = 2
        }
        console.log(this.material.materialType)
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
    width: 650px;
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
  .textareaBox {
    width: 430px;
    min-width: 260px;
    max-height: 600px;
    overflow-y: auto;
  }
  .modal-content{
    width:100%;height:100%;
  }
  .abc{
    transform:none !important;
  }
</style>