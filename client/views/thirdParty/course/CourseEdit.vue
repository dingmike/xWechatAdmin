<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-ancestor">
        <div class="tile is-parent cl-form">
          <article class="tile is-child box">
            <tabs type="boxed" :selectedIndex="tabIndex">
              <tab-pane label="课程信息" :selected="tab === 'info'">
                <div class="block">
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">名称</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <input class="input" v-model="course.title" :disabled="disabled" type="text" placeholder="标题">
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">类型</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <select class="select" v-model="course.labelScene" :disabled="disabled || course.id>0 || materialTypeFlag" @change="changeCourseType">
                          <option value="62">体验坊</option>
                          <option value="64">游学营</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">课程资料</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <span class="select-item" v-if="course.material_id || materialSelected.id">{{ materialSelected.id + " " + materialSelected.title }}</span>
                        <a class="select-item" @click="selectMaterial" v-show="!disabled">{{ course.material_id || materialSelected.id ? '重新选择' : '选择课程资料' }}</a>
                        <!--<input class="input" v-model="course.material_id" :disabled="disabled" type="text" placeholder="课程资料id">-->
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label"><i class="isRequired">*</i>封面</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <img v-if="course.cover" :src="course.cover" class="cover" @click="showBigImg(course.cover)" style="width:160px;height:90px;">
                        <img v-else class="cover" src="/static/+.png" style="cursor: pointer;width:160px;height:90px;" />
                        <div class="imgUploadBox">
                            <!--<div style="width:200px;">-->
                              <!--<a href="#" class="button">{{!course.cover?'选择文件':'重新选择'}}</a><br>-->
                              <!--<span> 建议尺寸 800*450px 或 16：9，<br>只支持JPG、PNG格式，图片大小不超过5M。</span>-->
                            <!--</div>-->
                          <!--<div class="masker"></div>-->
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">课程卖点</label>
                    </div>
                    <div class="control">
                      <TextEditor id="content-html"></TextEditor>
                    </div>
                  </div>

                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">上课老师</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <span class="select-item" v-if="course.agency_id || agencySelected.user_id">{{ agencySelected.user_id + " " + agencySelected.name }}</span>
                        <a class="select-item" @click="selectAgency" v-show="!disabled">{{ course.agency_id || agencySelected.user_id ? '重新选择' : '选择上课老师' }}</a>
                        <!--<input class="input" v-model="course.agency_id" :disabled="disabled" type="text" placeholder="教育机构id">-->
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal" v-if="course.labelScene == 62">
                    <div class="control-label">
                      <label class="label">渠道</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <span class="select-item" v-if="course.channel_id || channelSelected.user_id">{{ channelSelected.user_id + " " + channelSelected.name }}</span>
                        <a class="select-item" @click="selectChannel" v-show="!disabled">{{ course.channel_id || channelSelected.user_id ? '重新选择' : '选择渠道' }}</a>
                        <!--<input class="input" v-model="course.channel_id" :disabled="disabled" type="text" placeholder="渠道id">-->
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal" v-if="course.labelScene == 62">
                    <div class="control-label">
                      <label class="label">上课区域</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <china-site-select :siteDefault="siteDefault" :selectCallback="siteSelected"></china-site-select>
                      </div>
                    </div>
                  </div>

                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">上课地址</label>
                    </div>
                    <div class="control">
                      <div class="control course">
                        <input class="input" v-model="course.lesson_location" :disabled="disabled" type="text" placeholder="上课地点">
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">上课时间</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <datepicker placeholder="开始时间" @focus.native="unfocus" v-model="course.lesson_time" :config="{ locale: l10n, enableTime: true, time_24hr: true, dateFormat: 'Y-m-d H:i:S' }"></datepicker>
                      </div>
                      <template v-if="course.labelScene == 64">
                        <span class="timeMid">——</span>
                        <div class="control">
                          <datepicker placeholder="结束时间" @focus.native="unfocus" v-model="course.lesson_time_end" :config="{ locale: l10n, enableTime: true, time_24hr: true, dateFormat: 'Y-m-d H:i:S' }"></datepicker>
                        </div>
                      </template>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">课程时长</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <select class="select" v-model="course.duration" v-if="course.labelScene == 62">
                          <option value="120">2小时</option>
                          <option value="60">1小时</option>
                        </select>
                        <input class="input" v-model="countTime" type="text" placeholder="请输入时长" :disabled="true" v-else />
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">课程总人数</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <input class="input" v-model="course.total" :disabled="disabled" type="text" placeholder="课程总人数">
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">课程类型</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <select class="select" v-model="course.courseType" :disabled="disabled">
                          <option v-for="(item, index) in status.courseType" v-if="item !== ''" :value="index">{{ item }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">状态</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <select class="select" v-model="course.status" :disabled=true>
                          <option v-for="(item, index) in status.course" v-if="item !== ''" :value="index">{{ item }}</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label"></label>
                    </div>
                    <div class="control">
                      <button class="button is-primary" @click="submit">提交</button>
                      <button class="button is-link" @click="cancel">取消</button>
                    </div>
                  </div>
                </div>
              </tab-pane>
              <tab-pane label="客户列表" :disabled="action === 'add'" :selected="tab === 'user'">
                <table class="table">
                  <thead>
                    <tr>
                      <th>用户id</th>
                      <th>用户名</th>
                      <th>头像</th>
                      <th>手机号</th>
                      <th>签到</th>
                      <th>作业</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in userList">
                      <td>{{user.id}}</td>
                      <td>{{user.name}}</td>
                      <td>
                        <img width="60" :src="user.headimgurl">
                      </td>
                      <td>{{user.mobile}}</td>
                      <td>{{user.sign_in ? '是' : '否'}}</td>
                      <td>{{user.homework ? '是' : '否'}}</td>
                    </tr>
                  </tbody>
                </table>
                <div>
                  总人数：{{userList.length}}
                </div>
              </tab-pane>
              <tab-pane label="课程数据" :selected="tab === 'data'" :disabled="action === 'add'">
                <div class="block ">
                  <div class="taskList">
                    <div v-for="(item,index) in taskList" class="taskListBox">
                      <h3 class="title data_titile block has-text-centered is-5">
                        任务{{index+1}}：{{item.title}}
                      </h3>
                      <div class="itemChildList" v-for="(itemChild,indexChild) in item.questions">
                        <div class="itemChild">
                          <div class="itemChildQuestion">
                            {{indexChild+1}}.{{itemChild.type === 'essay'? '文字题':itemChild.type === 'choose'?'单选题':itemChild.type === 'mulchoose'?'多选题':itemChild.type === 'photo'?'照片题':itemChild.type === 'sound'?'录音题':'题目'}}：
                            <p v-html="itemChild.question"></p>
                          </div>
                          <div class="itemChildOption" v-if="itemChild.option||itemChild.option === ''">
                            <ul>
                              <li v-for="(itemOption,indexOption) in itemChild.option">
                                {{itemOption}}
                              </li>
                            </ul>
                          </div>
                          <div class="itemChildNum">
                            <span v-if="flag" class="itemChildNumOk">完成人数：{{finishNum(index,indexChild)}}</span><span class="itemChildNumSum">（课程总人数：{{userListData.length}}人）</span>
                          </div>
                          <div class="itemChildAnswers">
                            <ul>
                              <li class="answersLi" v-for="(itemAnswers,indexAnswers) in userListData" v-if="itemAnswers.answers[index] && itemAnswers.answers[index][indexChild] && itemAnswers.answers[index][indexChild].length != 0 && isSoundUrl(itemAnswers.answers[index][indexChild], itemChild.type)">
                                <img :src="itemAnswers.baseInfo.headimgurl" />
                                <span>{{itemAnswers.baseInfo.name}}</span>
                                <div v-if="itemChild.type === 'choose' || itemChild.type === 'mulchoose'">{{itemAnswers.answers[index][indexChild].join(',')}}</div>
                                <div v-if="itemChild.type === 'sound'" class="audioDiv">
                                  <div v-for="audioItem in itemAnswers.answers[index][indexChild]">
                                    <audio controls>
                                      <source :src="audioItem.url" type="audio/mpeg">
                                    </audio>
                                  </div>
                                </div>
                                <div v-if="itemChild.type === 'photo'" class="answersImg">
                                  <ul>
                                    <li v-for="itemImg in itemAnswers.answers[index][indexChild]">
                                      <img :src="itemImg" @click="bigImgShow(itemImg)" />
                                    </li>
                                  </ul>
                                </div>
                                <div v-if="itemChild.type === 'essay'">{{itemAnswers.answers[index][indexChild]}}</div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="homeworkList" v-show="homeworkList.question && homeworkList.question.length !=0">
                      <h3 class="title homework_titile block has-text-centered is-5">
                        作业：{{homeworkList.title}}
                      </h3>
                      <div class="itemChildList" v-for="(item,index) in homeworkList.question">
                        <div class="itemChild">
                          <div class="itemChildQuestion">
                            {{index+1}}.{{item.type === 'essay'? '文字题':item.type === 'choose'?'单选题':item.type === 'mulchoose'?'多选题':item.type === 'photo'?'照片题':item.type === 'sound'?'录音题':'题目'}}：
                            <p v-html="item.question"></p>
                         </div>
                         <div class="itemChildOption" v-if="item.option||item.option === ''">
                            <ul>
                              <li v-for="(itemOption,indexOption) in item.option">
                                {{itemOption}}
                              </li>
                            </ul>
                          </div>
                          <div class="itemChildNum">
                            <span v-if="flag" class="itemChildNumOk">完成人数：{{finishNumHomework(index)}}</span><span class="itemChildNumSum">（课程总人数：{{userListData.length}}人）</span>
                          </div>
                          <div class="itemChildAnswersHomework">
                            <ul>
                              <li class="answersLiHomework" v-for="(itemAnswers,indexAnswers) in userListData" v-if="itemAnswers.homework_answers[index] && itemAnswers.homework_answers[index].length != 0 && isSoundUrl(itemAnswers.homework_answers[index], item.type)">
                                <img :src="itemAnswers.baseInfo.headimgurl" />
                                <span>{{itemAnswers.baseInfo.name}}</span>
                                <div v-if="item.type === 'choose' || item.type === 'mulchoose'">{{itemAnswers.homework_answers[index].join(',')}}</div>
                                <div v-if="item.type === 'sound'" class="audioDiv">
                                  <div v-for="audioItem in itemAnswers.homework_answers[index]">
                                    <audio controls>
                                      <source :src="audioItem.url" type="audio/mpeg">
                                    </audio>
                                  </div>
                                </div>
                                <div v-if="item.type === 'photo'" class="answersImg">
                                  <ul>
                                    <li v-for="itemImg in itemAnswers.homework_answers[index]">
                                      <img :src="itemImg" @click="bigImgShow(itemImg)" />
                                    </li>
                                  </ul>
                                </div>
                                <div v-if="item.type === 'essay'">{{itemAnswers.homework_answers[index]}}</div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="teacherBack">
                      <h3 class="title homework_titile block has-text-centered is-5">
                        老师反馈
                      </h3>
                      <div class="itemChildList">
                        <div class="itemChild">
                          <div>
                            <div class="teacherBackTitle">老师点评：</div>
                            <span v-if="reviewAfter && reviewAfter!=''">{{reviewAfter}}</span>
                            <span class="nullTeacherBack" v-else>老师未填写老师点评</span>
                          </div>
                        </div>
                      </div>
                      <div class="itemChildList">
                        <div class="itemChild">
                          <div>
                            <div class="teacherBackTitle">现场照片：</div>
                            <span class="imgBox" v-for="item,index in reverseArray(coursePics)" v-if="coursePics && coursePics.length != 0 && JSON.stringify(coursePics) != '{}'">
                              <img :src="item" @click="bigImgShow(item)" />
                              <img :src="closeImg" class="imgClose" @click="delCoursePicsImg((reverseArray(coursePics).length-1)-index)" />
                            </span>
                            <span class="nullTeacherBack" v-if="!(coursePics && coursePics.length != 0 && JSON.stringify(coursePics) != '{}')">
                              老师未上传现场照片
                            </span>
                            <!--<div class="image-upload">
                              <vue-core-image-upload
                                class="btn btn-primary imgUpload"
                                :crop="false"
                                :rotate="false"
                                @imageuploaded="imageuploaded"
                                @imagechanged="imagechanged"
                                compress="50"
                                :multiple="true"
                                extensions="png,jpeg,jpg"
                                :url="uploadUrl"
                                :isXhr="false"
                                v-if="course.status>9">
                                <button class="uploadBtn" @click.prevent="uploadPhoto('referPic')">上传更多现场照片</button>
                              </vue-core-image-upload>
                              <div class="sendReport" v-if="course.materialType == 2 && course.courseExtra">
                                <button class="uploadBtn" @click="modalReport.visible = true" :disabled="course.courseExtra && course.courseExtra.reportPushState">发送课程报告</button>
                                <p v-if="course.courseExtra.reportPushState">报告已发送 发送时间：{{course.courseExtra.reportPushState}}</p>
                              </div>
                            </div>-->
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </tab-pane>
            </tabs>
          </article>
        </div>
      </div>
    </div>
    <card-modal :visible="materialModal.visible" @close="materialModal.visible=false" @cancel="materialModal.visible=false" @ok="confirmMaterial" :title="materialModal.title" :showErrorMsg="materialModal.showErrorMsg" transition="zoom">
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <article class="tile is-child box">
            <div class="columns">
              <div class="column">
                <p class="control has-addons">
                  <input class="input" type="text" v-model="materialKW" @input="filterMaterial" placeholder="名称">
                  <a class="button is-info" @click="filterMaterial">搜索</a>
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
                <tr v-for="item in materialModal.list" @click="materialBuffer = item;materialModal.showErrorMsg = false" :class="[item.id === materialBuffer.id ? 'isActive' : '', 'modal-item']">
                  <td>{{ item.id }}</td>
                  <td>{{ item.title }}</td>
                </tr>
              </tbody>
            </table>
          </article>
        </div>
      </div>
    </card-modal>

    <card-modal :visible="agencyModal.visible" @close="agencyModal.visible=false" @cancel="agencyModal.visible=false" @ok="confirmAgency" :title="agencyModal.title" :showErrorMsg="agencyModal.showErrorMsg" transition="zoom">
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
                <tr v-for="item in agencyModal.list" @click="agencyBuffer = item;agencyModal.showErrorMsg = false" :class="[agencyBuffer.user_id === item.user_id ? 'isActive' : '', 'modal-item']">
                  <td>{{ item.user_id }}</td>
                  <td>{{ item.name }}</td>
                </tr>
              </tbody>
            </table>
          </article>
        </div>
      </div>
    </card-modal>

    <card-modal :visible="channelModal.visible" @close="channelModal.visible=false" @cancel="channelModal.visible=false" @ok="confirmChannel" :title="channelModal.title" :showErrorMsg="channelModal.showErrorMsg" transition="zoom">
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <article class="tile is-child box">
            <div class="columns">
              <div class="column">
                <p class="control has-addons">
                  <input class="input" type="text" v-model="channelKW" @input="filterChannel" placeholder="名称">
                  <a class="button is-info" @click="filterChannel">搜索</a>
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
                <tr v-for="item in channelModal.list" @click="channelBuffer = item;channelModal.showErrorMsg = false" :class="[channelBuffer.user_id == item.user_id ? 'isActive' : '', 'modal-item']">
                  <td>{{ item.user_id }}</td>
                  <td>{{ item.name }}</td>
                </tr>
              </tbody>
            </table>
          </article>
        </div>
      </div>
    </card-modal>
    <card-modal :visible="modalDel.visible" @cancel="modalDel.visible = false;delImgIndex=''" @close="modalDel.visible = false;delImgIndex=''" @ok="delImg" :title="modalDel.title" transition="zoom">
      {{ modalDel.message }}
    </card-modal>
    <card-modal :visible="modalReport.visible" @cancel="modalReport.visible = false" @close="modalReport.visible = false" @ok="sendReport" :title="modalReport.title" transition="zoom">
      {{ modalReport.message }}
    </card-modal>
    <div class="uploadBox" v-if="uploadModal.visible">
      <div class="box">
        <article class="media">
          <div>
            <p>照片上传中，请不要刷新页面（第{{uploadModal.count}}/{{uploadModal.uploadSum}}张）</p>
          </div>
        </article>
      </div>
      <div class="mask">
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Vue from 'vue'
import _ from 'lodash'
import Cleave from 'vue-cleave'
import 'cleave.js/dist/addons/cleave-phone.cn'
import CardModal from 'components/widget/CardModal.vue'
import { Tabs, TabPane } from 'vue-bulma-tabs'
import { Modal } from 'vue-bulma-modal'
import myDatepicker from 'vue-datepicker'
import Datepicker from 'vue-bulma-datepicker'
import TextEditor from 'components/widget/TextEditor'

import api from 'lanmaLib/common/api'
import helper from '../../../helper'

import { mapGetters } from 'vuex'

import config from 'lanmaLib/config'
import ImageModal from 'components/widget/ImageModal.vue'
const ImageModalComponent = Vue.extend(ImageModal)
import chinaSiteSelect from 'components/widget/chinaSiteSelect.vue'
import VueCoreImageUpload from 'vue-core-image-upload'
export default {
  data() {
    return {
      title: '添加课程',
      id: 0,
      action: 'add',
      tab: 'info',
      tabIndex: 0,
      materialSelected: { 'id': '', 'title': '' },
      materialBuffer: { 'id': '', 'title': '' },
      agencySelected: { 'user_id': '', 'name': '' },
      agencyBuffer: { 'user_id': '', 'name': '' },
      channelSelected: { 'user_id': '', 'name': '', 'description': '', 'site': '' },
      channelBuffer: { 'user_id': '', 'name': '', 'description': '', 'site': '' },
      agencyKW: '',
      channelKW: '',
      materialModal: {
        visible: false,
        title: '选择课程资料',
        showErrorMsg: false,
        list: []
      },
      agencyModal: {
        visible: false,
        title: '选择老师',
        showErrorMsg: false,
        list: []
      },
      channelModal: {
        visible: false,
        title: '选择渠道',
        showErrorMsg: false,
        list: []
      },
      materialKW: '',
      course: {
        id: 0,
        title: '',
        content: '',
        display_order: 0,
        total: 10,
        lesson_time: '',
        summary_status: 0,
        status: 7,
        courseType: 1,
        sign_up_time: '',
        labelScene: '62',
        materialType: 1,
        lesson_site: '',
        duration: '120',
        lesson_time_end: '',
        lesson_location: ''
      },
      lesson_time_str: {
        time: ''
      },
      sign_up_time_str: {
        time: ''
      },
      status: config.status,
      userList: [],
      numberStatus: '',
      apiCourseRouter: api.course,
      taskList: [],              // 课程数据中的任务数据
      homeworkList: [],          // 课程数据中的作业数据
      userListData: [],             // 课程数据中的用户数据
      flag: false,
      coursePics: [],          // 老师反馈 现场照片
      reviewAfter: '',          // 老师反馈 老师点评
      siteDefault: '',
      closeImg: require('assets/X1.png'),
      modalDel: {
        visible: false,
        title: '删除确认',
        message: '删除数据后将不能恢复，确定删除吗？'
      },
      delImgIndex: '',
      modalReport: {
        visible: false,
        title: '发送报告确认',
        message: '确认发送课程报告？'
      },
      uploadModal: {
        visible: false,
        count: 0,
        uploadSum: 0
      },
      materialTypeFlag: false
    }
  },
  computed: {
    uploadUrl() {
      return window.location.protocol + '//' + window.location.hostname + '/api/user/upload'
//      return window.location.protocol + '//' + 'lanmatest.xinjijiaoyu.com' + '/api/user/upload'
    },
    timeOption() {
      return config.datepicker.timeOption
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
    },
    disabled() {
      return this.course.status > 7
    },
    ...mapGetters({
      userInfo: 'userInfo'
    }),
    countTime () {
      if (String(this.course.labelScene) === '64') {
        if (this.course.lesson_time !== '' && this.course.lesson_time_end !== '') {
          var sD = new Date(this.course.lesson_time)
          var eD = new Date(this.course.lesson_time_end)
          var sDMsec = sD.getTime()
          var eDMsec = eD.getTime()
          var d = eDMsec - sDMsec
          if (d <= 0) {
            console.log(d)
            this.course.duration = ''
            return ''
          } else {
            d = parseInt(d / 60000)
            this.course.duration = d
            var time = parseInt(d / 60) + '小时'
            if ((d % 60) !== 0) {
              time += (d % 60) + '分钟'
            }
            return time
          }
        }
      }
    }
  },
  watch: {
    lesson_time_str: {
      handler: function (val) {
        this.course.lesson_time = val.time
        this.course.sign_up_time = val.time
      },
      deep: true
    },
    sign_up_time_str: {
      handler: function (val) {
        this.course.sign_up_time = val.time
      },
      deep: true
    }
  },
  mounted() {
  },
  created() {
    var materialId = parseInt(this.$route.params.material_id)
    var materialType = parseInt(this.$route.params.material_type)
    if (materialId) {
      this.course.material_id = materialId
    } else {
      this.course.material_id = ''
    }
    if (materialType) {
      this.materialTypeFlag = true
      this.course.materialType = materialType
      if (materialType === 2) {
        this.course.labelScene = '64'
        this.course.courseType = 2
        this.apiCourseRouter = api.course_tour
      }
    }
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    this.id = id
    if (id) {
      var tab = this.$route.params.tab
      var tabList = ['info', 'user']
      this.tab = tab
      this.tabIndex = tabList.indexOf(tab)
      this.title = '编辑课程'
      this.action = 'edit'
      api.course.find(id)
        .then((course) => {
          this.lesson_time_str = { time: course.lesson_time }
          this.sign_up_time_str = { time: course.sign_up_time }
          this.siteDefault = course.lesson_site ? course.lesson_site : ''
          this.course = course
          this.setEditorHtml()
          this.getMaterialList()
          this.getAgencyList()
          this.getChannelList()
          this.getCompleteCourseInfo()
        })
        .catch((e) => {
          console.log(e)
          helper.showError(e.message)
        })
      api.course.signUser(id)
        .then((data) => {
          console.log(data)
          this.userList = data.list
          console.log('signUser')
          console.log(this.userList)
        })
        .catch((e) => {
          console.log(e)
          helper.showError(e.message)
        })
    } else {
      this.getMaterialList()
      this.getAgencyList()
      this.getChannelList()
    }
  },
  components: {
    Cleave,
    Tabs,
    TabPane,
    CardModal,
    'date-picker': myDatepicker,
    Datepicker,
    TextEditor,
    ImageModal,
    chinaSiteSelect,
    'vue-core-image-upload': VueCoreImageUpload,
    Modal
  },
  methods: {
    getCompleteCourseInfo () {
      var apiName = 'course'
      if (String(this.course.labelScene) === '64') {
        apiName = 'course_tour'
      }
      api[apiName].getCompleteCourseInfo(this.id)
        .then((data) => {
          console.log(data)
          var temp = data.material.content
          var taskList = []
          for (var k = 0; k < temp.length; k++) {
            if (temp[k].type === 'task') {
              taskList.push(temp[k])
            }
          }
          this.taskList = taskList
          this.homeworkList = data.material.homework
          this.userListData = data.userList
          this.siteDefault = data.lesson_site ? data.lesson_site : ''
          for (var i = 0; i < this.userListData.length; i++) {
            for (var j = 0; j < this.userListData[i].answers.length; j++) {
              this.userListData[i].answers[j] = JSON.parse(this.userListData[i].answers[j])
            }
          }
          this.coursePics = data.coursePics ? data.coursePics : []
          this.reviewAfter = data.reviewAfter ? data.reviewAfter : ''
          this.$nextTick(function() {
            this.flag = true
          })
        })
        .catch((e) => {
          console.log(e)
          this.flag = true
          // helper.showError(e.message)
        })
    },
    selectMaterial() {
      this.getMaterialList()
      this.materialModal.visible = true
      this.materialBuffer.id = this.materialSelected.id
      this.materialBuffer.title = this.materialSelected.title
    },
    getMaterialList() {
      var materialType = 2
      if (String(this.course.labelScene) === '62') {
        materialType = 1
      }
      var params = {
        'title': '',
        'materialType': materialType,
        'offset': 0,
        'length': 0,
        'userId': 0
      }
      api.superAdmin.adminGetMaterialList(params).then((data) => {
        this.filterMaterailList(data.list)
      })
    },
    filterMaterailList (dataArray) {
      this.materialList = this.materialModal.list = dataArray.map(item => {
        if (item.id === this.course.material_id) {
          this.materialSelected.id = item.id
          this.materialSelected.title = item.title
        }
        return _.pick(item, ['id', 'title'])
      })
    },
    filterMaterial() {
      var keword = this.materialKW
      if (keword === '') {
        this.materialModal.list = this.materialList
        return
      }
      this.materialModal.list = this.materialModal.list.filter(item => {
        return item.title.toLowerCase().match(keword.toLowerCase())
      })
    },
    selectAgency() {
      this.getAgencyList()
      this.agencyModal.visible = true
      this.agencyBuffer.user_id = this.agencySelected.user_id
      this.agencyBuffer.name = this.agencySelected.name
    },
    getAgencyList() {
      var params = {
        userId: 0
      }
      api.superAdmin.adminGetClassTeacherList(params).then((data) => {
        var _this = this
        this.agencyList = this.agencyModal.list = data.list.map(item => {
          if (item.user_id === _this.course.agency_id) {
            _this.agencySelected.user_id = item.user_id
            _this.agencySelected.name = item.name
          }
          return _.pick(item, ['user_id', 'name'])
        })
      })
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
    selectChannel() {
      this.getChannelList()
      this.channelModal.visible = true
      this.channelBuffer.user_id = this.channelSelected.user_id
      this.channelBuffer.name = this.channelSelected.name
    },
    getChannelList() {
      api.channel.getList()
        .then((data) => {
          var _this = this
          this.channelList = this.channelModal.list = data.list.map(item => {
            if (item.user_id === _this.course.channel_id) {
              _this.channelSelected.user_id = item.user_id
              _this.channelSelected.name = item.name
            }
            return _.pick(item, ['user_id', 'name', 'description', 'site'])
          })
        })
    },
    filterChannel() {
      var keword = this.channelKW
      if (keword === '') {
        this.channelModal.list = this.channelList
        return
      }
      this.channelModal.list = this.channelModal.list.filter(item => {
        return item.name.toLowerCase().match(keword.toLowerCase())
      })
    },
    confirmMaterial() {
      if (!this.materialBuffer.id) {
        this.materialModal.showErrorMsg = true
      } else {
        this.materialModal.visible = false
        this.materialSelected = this.materialBuffer
        this.course.material_id = this.materialSelected.id
      }
    },
    confirmAgency() {
      if (!this.agencyBuffer.user_id) {
        this.agencyModal.showErrorMsg = true
      } else {
        this.agencyModal.visible = false
        this.agencySelected = this.agencyBuffer
        this.course.agency_id = String(this.agencySelected.user_id)
      }
    },
    confirmChannel() {
      if (!this.channelBuffer.user_id) {
        this.channelModal.showErrorMsg = true
      } else {
        this.channelModal.visible = false
        this.channelSelected = this.channelBuffer
        console.log(this.channelBuffer)
        this.course.channel_id = String(this.channelSelected.user_id)
        this.course.lesson_location = this.channelSelected.description
        this.siteDefault = this.channelSelected.site ? this.channelSelected.site : 0
      }
    },
    submit() {
      helper.showError('你没有权限进行修改！')
      return
//    var id = this.course.id
//    this.getEditorHtml()
//    var type = 62
//    if (this.course.materialType === 2) {
//      this.apiCourseRouter = api.course_tour
//      type = 64
//    }
//    if (id) {
//      var data = _.clone(this.course)
//      delete data.count_data
//      delete data.material
//      this.apiCourseRouter.edit(id, data).then((res) => {
//        console.log(res)
//        this.$router.push('/courses/list/' + type)
//        helper.showSuccess('编辑成功')
//      })
//        .catch((e) => {
//          console.log(e)
//          helper.showError(e.message)
//        })
//    } else {
//      if (String(this.course.labelScene) === '62') {
//        this.endTimeCont()
//      }
//      var data = _.clone(this.course)
//      delete data.count_data
//      delete data.material
//      if (!this.validate()) return
//      this.apiCourseRouter.add(data).then((res) => {
//        console.log(res)
//        helper.showSuccess('添加成功')
//        this.$router.push('/courses/list/' + type)
//      })
//        .catch((e) => {
//          console.log(e)
//          helper.showError(e.message)
//        })
//    }
    },
    validate () {
      if (String(this.course.labelScene) === '62') {
        if (!this.course.lesson_site) {
          helper.showError('请选择地点')
          return false
        } else if (!this.course.lesson_time) {
          helper.showError('请选择上课时间')
          return false
        } else if (!this.course.title) {
          helper.showError('请填写标题')
          return false
        } else if (!this.course.material_id) {
          helper.showError('请选择课程资料')
          return false
        } else if (!this.course.content) {
          helper.showError('请选择课程卖点')
          return false
        } else if (!this.course.agency_id) {
          helper.showError('请选择上课老师')
          return false
        } else if (!this.course.channel_id) {
          helper.showError('请选择渠道')
          return false
        } else if (!this.course.channel_id) {
          helper.showError('请选择渠道')
          return false
        } else if (!this.course.lesson_location) {
          helper.showError('请选择渠道')
          return false
        }
      } else {
        if (!this.course.duration) {
          helper.showError('时间选择错误')
          return false
        } else if (!this.course.title) {
          helper.showError('请填写标题')
          return false
        } else if (!this.course.material_id) {
          helper.showError('请选择课程资料')
          return false
        } else if (!this.course.content) {
          helper.showError('请选择课程卖点')
          return false
        } else if (!this.course.agency_id) {
          helper.showError('请选择上课老师')
          return false
        } else if (!this.course.lesson_location) {
          helper.showError('请选择上课地点')
          return false
        }
      }
//    if (this.course.lesson_time === '') {
//      helper.showError('请选择上课时间')
//      return false
//    }
      return true
    },
    cancel() {
      this.$router.push('/thirdParty/courseList')
    },
    checkNumber() {
      if (this.course.number) {
        api.course.isExistCourseNumber(this.course.number).then((ret) => {
          if (ret) {
            this.numberStatus = '课程编号已经存在'
          } else {
            this.numberStatus = ''
          }
        })
      }
    },
    changeCourseType() {
      this.course.material_id = this.materialSelected.id = ''
      if (this.course.labelScene === '64') {
        this.course.duration = ''
//      this.course.courseType = '2'
        this.course.materialType = 2
        this.apiCourseRouter = api.course_tour
      } else {
        this.course.duration = '120'
//      this.course.courseType = '1'
        this.course.materialType = 1
        this.apiCourseRouter = api.course
      }
    },
    unfocus(e) {
      e.target.blur()
    },
    setEditorHtml () {
      document.querySelector('#content-html .ql-editor').innerHTML = this.course.content
    },
    getEditorHtml () {
      this.course.content = document.querySelector('#content-html .ql-editor').innerHTML
    },
    finishNum (index, indexChild) {
      var taskList = document.querySelectorAll('div.taskListBox')
      var itemTaskList = 0
      var taskListLi = 0
      if (taskList[index]) {
        itemTaskList = taskList[index].querySelectorAll('.itemChildList')
        taskListLi = itemTaskList[indexChild].querySelectorAll('.answersLi')
//      console.log('index:' + index + 'indexchild:' + index, indexChild + 'length:' + taskListLi.length)
        return taskListLi.length
      }
    },
    finishNumHomework(index) {
      var taskList = document.querySelectorAll('div.homeworkList')
      var itemTaskList = taskList[0].querySelectorAll('.itemChildList')
      if (itemTaskList[index]) {
        var itemTaskListLi = itemTaskList[index].querySelectorAll('.answersLiHomework')
        return itemTaskListLi.length
      }
    },
    bigImgShow(src) {
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
    isSoundUrl(item, type) {
      if (type === 'sound') {
        if (item[0].url && item[0].url.length !== 0) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    },
    siteSelected (site) {
      console.log(site)
      this.course.lesson_site = site
    },
    endTimeCont () {
      if (String(this.course.labelScene) === '62') {
        console.log(this.course.lesson_time)
        if (this.course.lesson_time === '') {
          return
        }
        var date = new Date(this.course.lesson_time)
        var dMS = date.getTime()
        if (this.course.duration === '120') {
          dMS += 2 * 60 * 60 * 1000
        } else {
          dMS += 1 * 60 * 60 * 1000
        }
        var endDate = new Date(dMS)
        var year = endDate.getFullYear()
        var month = endDate.getMonth() + 1
        var day = endDate.getDate()
        var h = endDate.getHours()
        var m = endDate.getMinutes()
        var s = endDate.getSeconds()
        this.course.lesson_time_end = year + '-' + month + '-' + day + ' ' + this.timeTr(h) + ':' + this.timeTr(m) + ':' + this.timeTr(s)
        console.log(this.course.lesson_time_end)
      }
    },
    timeTr (key) {
      if (parseInt(key) < 10) {
        return '0' + key
      }
      return key
    },
    imageuploaded (res) {
      if (Object.prototype.toString.call(res.data.url) === '[object Array]') {
        this.coursePics = this.coursePics.concat(res.data.url)
      } else {
        this.coursePics.push(res.data.url)
      }
      this.setAgencySummary()
    },
    imagechanged (files) {
      this.uploadModal.uploadSum = files.length ? files.length : 1
      this.uploadModal.count = 1
      this.uploadModal.visible = true
      if (files.length > 1) {
        for (let i = 0; i < files.length; i++) {
          let data = new FormData()
          data.append('file', files[i])
          api.photo.upload(data)
            .then((data) => {
              this.coursePics.push(data.url)
              this.uploadModal.count += 1
              this.isUploadOk()
            })
            .catch(e => {
              this.uploadModal.count += 1
              this.isUploadOk()
            })
        }
      } else {
        let data = new FormData()
        data.append('file', files)
        api.photo.upload(data)
          .then((data) => {
            this.coursePics.push(data.url)
            this.uploadModal.count += 1
            this.isUploadOk()
          })
          .catch(e => {
            this.uploadModal.count += 1
            this.isUploadOk()
          })
      }
    },
    isUploadOk () {
      if (this.uploadModal.count > this.uploadModal.uploadSum) {
        this.uploadModal.visible = false
        this.uploadModal.uploadSum = 0
        this.uploadModal.count = 0
        this.setAgencySummary()
      }
    },
    setAgencySummary () {
      var apiName = 'course'
      if (String(this.course.labelScene) === '64') {
        apiName = 'course_tour'
      }
      api[apiName].setAgencySummary(this.id, this.reviewAfter, this.coursePics)
        .then(() => {
          helper.showSuccess('操作成功')
        }).catch((e) => {
          helper.showError(e.msg)
        })
    },
    delCoursePicsImg (index) {
      this.delImgIndex = index
      this.modalDel.visible = true
    },
    delImg () {
      if (this.delImgIndex || this.delImgIndex === 0) {
        this.coursePics.splice(this.delImgIndex, 1)
        this.setAgencySummary()
      }
      this.modalDel.visible = false
    },
    reverseArray (arr) {
      var temp = arr.concat()
      temp.reverse()
      return temp
    },
    sendReport () {
      this.modalReport.visible = false
      api.course_tour.sendReportMessage(this.id)
        .then((res) => {
          this.course.courseExtra = res.courseExtra
        })
    },
    closeUploadModal () {
    },
    showBigImg(src) {
      helper.showBigImg(src)
    },
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

.control .select-item {
  align-items: center;
  display: inline-flex;
  height: 32px;
  padding-left: 8px;
}

.control a.select-item {
  font-size: 12px;
}

.modal-item {
  cursor: pointer;
}

.control .course {
  width: 100%;
  max-width: 600px;
}

.errorDesc {
  color:red;
  height:100%;
  display:block;
  padding-top: 7px;
  padding-left: 4px;
}

.modal-item:hover {
  background-color: #ddd;
}

.isActive {
  background-color: #00d1b2;
}
.data_titile {
  background-color: rgb(242,242,242);
  padding:20px;
  font-weight: bold;
  border-bottom: 1px solid #000;
}
.taskListBox, .homeworkList, .teacherBack, .uploadImgBox {
  border: 1px solid #000;
  margin-bottom: 40px;
}
.itemChildList{
  padding: 10px 20px;
}
.itemChild{
  margin-bottom: 20px;
  border:1px solid #999;
  padding:20px;
  color: #000;
  .imgBox{
    position: relative;
    padding: 0;
    width:80px;
    height:80px;
    display: inline-block;
    margin: 0 10px 10px 0;
    img{
      width:100%;
      height:100%;
    }
    .imgClose{
      font-style: normal;
      position: absolute;
      right:-8px;
      top:-8px;
      display: inline-block;
      width:20px;
      height:20px;
      border-radius: 50% 50%;
      background: #FFF;
    }
  }
}
.itemChildQuestion{
  margin-bottom: 10px;
}
.itemChildOption{
  margin-bottom: 10px;
}
.itemChildOption ul {
  list-style: upper-alpha;
  list-style-position:inside;
}
.itemChildNum{
  text-indent: 10px;
  padding:10px 0;
  border-bottom: 1px solid #999;
}
.itemChildNumOk{
  color:rgb(192,0,0);
}
.itemChildNumSum {
  color:#999;
}
.homework_titile{
  background: rgb(51,204,204);
  padding:20px;
  font-weight: bold;
  border-bottom: 1px solid #000;
}
.itemChildAnswers, .itemChildAnswersHomework {
  padding: 20px 0;
}
.itemChildAnswers li, .itemChildAnswersHomework li{
  margin-bottom: 10px;
}
.itemChildAnswers img, .itemChildAnswersHomework img {
  width:60px;
  vertical-align: middle;
}
.itemChildAnswers span, .itemChildAnswers div, .itemChildAnswersHomework span, .itemChildAnswersHomework div {
  display: inline-block;
  vertical-align: middle;
}
.itemChildAnswers span, .itemChildAnswersHomework span{
  text-align: center;
  margin-left: 10px;
}
.itemChildAnswers div, .itemChildAnswersHomework div {
  margin-left: 40px;
}
.itemChildAnswers audio, .itemChildAnswersHomework audio {
}
.audioDiv{
  margin-top: 20px;
}
.audioDiv div{
  display: block;
  height:30px;
  margin-top: 10px;
}
.answersImg li {
  display: inline-block;
  margin-left: 10px;
}
.teacherBack span {
  display: inline-block;
  padding: 20px 20px;
}
.teacherBackTitle {
  color: #999;
  padding: 20px 10px;
}
.nullTeacherBack{
  color: #999;
}
.timeMid{
  height:32px;
  line-height: 32px;
  display:inline-block;
  margin: 0 5px;
  color: #ccc;
}
.image-upload{
  text-align: center;
}
.uploadBtn{
  z-index: 999999;
  background: rgb(51,204,204);
  border: 0px solid #000;
  padding: 10px 20px;
  color: #fff;
  margin-top: 20px;
  vertical-align: top;
}
.uploadBtn:hover{
  cursor: pointer;
}
.uploadBtn:disabled{
  background: #ccc;
  cursor: not-allowed;
}
.imgUpload{
  vertical-align: top;
  display: inline-block;
  max-width:180px;
  margin-right: 20px;
}
.sendReport{
  text-align: left;
  display: inline-block;
  p{
    color: #999;
    margin-top: 5px;
  }
}
/*.uploadImgBox {
  .title{
    background: rgb(51,204,204);
    padding:20px;
    font-weight: bold;
    border-bottom: 1px solid #000;
  }
  .body{
    padding: 20px 20px;
    text-align: center;
    .image-upload{
      width:150px;
      margin-left: 50%;
      position: relative;
      left:-75px
    }
    .imgListBox{
      text-align: left;
      padding: 20px 30px;
      width:100%;
      span{
        display: inline-block;
        width:100px;
        height:100px;
        box-sizing: border-box;
        margin: 0 10px 10px 0;
        img{
          height:100%;
          width:100%;
        }
      }

    }
  }
}*/
.uploadBox{
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 3000;
  .mask{
    width:100%;
    height:100%;
    background: rgba(0,0,0,.8);
    position: absolute;
  }
  .box{
    position: absolute;
    width:50%;
    left:25%;
    top:40%;
    z-index: 3000;
  }
}
</style>
