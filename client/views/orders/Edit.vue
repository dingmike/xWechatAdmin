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
                      <label class="label">名称</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <input class="input" v-model="learn.title" type="text" placeholder="名称">
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">封面</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <input class="input" v-model="learn.cover" type="text" placeholder="封面url">
                        <input type="file" id="cover-file" @change="onFileChange" style="display: none;">
                        <span class="help"><a href="#" @click="uploadPhoto">上传</a></span>
                        <br />
                        <img :src="$helper.getImageUrl(learn.cover)" v-if="learn.cover !== ''" height="50">
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">主题标签</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <label-select :root="1" :value="selectDefault" :selectCallback="selectCallback">
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">简介</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <textarea class="textarea" v-model="learn.content" type="text" placeholder=""></textarea>
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">价格</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <input class="input large-input" v-model="learn.price" type="text" placeholder="">
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">销量</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <textarea class="textarea" v-model="learn.sell_num" type="text" placeholder=""></textarea>
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">收藏数</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <input class="input" v-model="learn.favorite_num" type="text" placeholder="">
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">显示顺序</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <input class="input" v-model="learn.display_order" type="text" placeholder="显示顺序">
                        <span class="help">数字越大，显示越靠前</span>
                      </div>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">审核状态</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <select class="select" v-model="learn.status">
                          <option value="0">未审核</option>
                          <option value="1">审核通过</option>
                          <option value="2">审核未通过</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </tab-pane>
              <tab-pane label="任务" :disabled="action === 'add'">
                <div class="control-list">
                  <div class="control-item" v-for="(task, tIndex) in learn.tasks">
                    <div class="control is-horizontal">
                      <div class="control-label">
                        <label class="label">名称</label>
                      </div>
                      <div class="control">
                        <div class="control">
                          <input class="input" v-model="task.title" type="text" placeholder="名称">
                        </div>
                      </div>
                    </div>
                    <div class="control is-horizontal">
                      <div class="control-label">
                        <label class="label">任务提示</label>
                      </div>
                      <div class="control">
                        <textarea class="textarea" v-model="task.content" type="text" placeholder=""></textarea>
                      </div>
                    </div>
                    <div class="control is-horizontal">
                      <div class="control-label">
                        <label class="label">任务道具</label>
                      </div>
                      <div class="control">
                        <textarea class="textarea" v-model="task.tool" type="text" placeholder="任务道具"></textarea>
                      </div>
                    </div>
                    <div class="control is-horizontal">
                      <div class="control-label">
                        <label class="label">任务类型</label>
                      </div>
                      <div class="control">
                        <select class="select" v-model="task.type">
                          <option value="0">任务类型</option>
                          <option value="1">普通</option>
                          <option value="2">用餐</option>
                          <option value="3">住宿</option>
                        </select>
                      </div>
                    </div>
                    <div class="control is-horizontal">
                      <div class="control-label">
                        <label class="label">任务对象</label>
                      </div>
                      <div class="control">
                        <select class="select" v-model="task.target">
                          <option value="0">任务对象</option>
                          <option :value="label.id" v-for="label in tagetLabels">{{ label.title }}</option>
                        </select>
                      </div>
                    </div>
                    <div class="control is-horizontal">
                      <div class="control-label">
                        <label class="label">问题</label>
                      </div>
                      <div class="control is-container">
                        <div class="sub-control sub-container" v-for="(ask, aIndex) in task.asks">
                          <div class="control is-horizontal">
                            <div class="control-label">
                              <label class="label">问题</label>
                            </div>
                            <div class="control">
                              <textarea class="textarea" v-model="ask.ask" type="text" placeholder="问题"></textarea>
                            </div>
                          </div>
                          <div class="control is-horizontal">
                            <div class="control-label">
                              <label class="label">提示</label>
                            </div>
                            <div class="control">
                              <textarea class="textarea" v-model="ask.sug" type="text" placeholder=""></textarea>
                            </div>
                          </div>
                          <div class="control is-horizontal">
                            <div class="control-label">
                              <label class="label"></label>
                            </div>
                            <div class="control">
                              <button class="button is-primary" @click="createAsk(task)" v-if="aIndex === task.asks.length - 1">新建问题</button>
                              <button class="button delete-button" @click="deleteAsk(tIndex, aIndex, ask.id)" v-if="task.asks.length !== 1">删除问题</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="control is-horizontal">
                      <div class="control-label">
                        <label class="label">小结</label>
                      </div>
                      <div class="control is-container">
                        <div class="sub-control sub-container" v-for="(summary, sIndex) in task.summaries">
                          <div class="control is-horizontal">
                            <div class="control-label">
                              <label class="label">标题</label>
                            </div>
                            <div class="control">
                              <textarea class="textarea" v-model="summary.title" type="text" placeholder="标题"></textarea>
                            </div>
                          </div>
                          <div class="control is-horizontal">
                            <div class="control-label">
                              <label class="label">内容</label>
                            </div>
                            <div class="control">
                              <textarea class="textarea" v-model="summary.content" type="text" placeholder="内容"></textarea>
                            </div>
                          </div>
                          <div class="control is-horizontal">
                            <div class="control-label">
                              <label class="label"></label>
                            </div>
                            <div class="control">
                              <button class="button is-primary" @click="createSummary(task)" v-if="sIndex === task.summaries.length - 1">新建小结</button>
                              <button class="button delete-button" @click="deleteSummary(tIndex, sIndex, summary.id)" v-if="task.summaries.length !== 1">删除小结</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="control is-horizontal">
                      <div class="control-label">
                        <label class="label"></label>
                      </div>
                      <div class="control">
                        <button class="button is-primary" @click="createTask" v-if="tIndex === learn.tasks.length - 1">新建任务</button>
                        <button class="button delete-button" @click="deleteTask(tIndex, task.id)"  v-if="learn.tasks.length !== 1">删除任务</button>
                      </div>
                    </div>
                  </div>
                </div>
              </tab-pane>
              <tab-pane label="作业" :disabled="action === 'add'">
                <div class="control-list">
                  <div class="control-item" v-for="(homework, index) in learn.homework">
                    <div class="control is-horizontal">
                      <div class="control-label">
                        <label class="label">作业问题</label>
                      </div>
                      <div class="control">
                        <textarea class="textarea" v-model="homework.homework" type="text" placeholder="作业问题"></textarea>
                      </div>
                    </div>
                    <div class="control is-horizontal">
                      <div class="control-label">
                        <label class="label">作业提示</label>
                      </div>
                      <div class="control">
                        <textarea class="textarea" v-model="homework.sug" type="text" placeholder="作业提示"></textarea>
                      </div>
                    </div>
                    <div class="control is-horizontal">
                      <div class="control-label">
                        <label class="label"></label>
                      </div>
                      <div class="control">
                        <button class="button is-primary" @click="createHomework" v-if="index === learn.homework.length - 1">新建作业</button>
                        <button class="button delete-button" @click="deleteHomework(index, homework.id)"  v-if="learn.homework.length !== 1">删除作业</button>
                      </div>
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
                <button class="button is-link">取消</button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
    <card-modal :visible="modal.visible" @cancel="close" @ok="confirm" :title="modal.title"  transition="zoom">
      {{ modal.message }}
    </card-modal>
  </div>
</template>

<script>
import Cleave from 'vue-cleave'
import { Tabs, TabPane } from 'vue-bulma-tabs'
import CardModal from '../../components/widget/CardModal.vue'
import 'cleave.js/dist/addons/cleave-phone.cn'

import LabelSelect from 'components/widget/LabelSelect'

import FormData from 'form-data'

import api from 'lanmaLib/common/api'
import labelModule from 'lanmaLib/modules/label'
import helper from '../../helper'
// import _ from 'lodash'

import config from 'lanmaLib/config'

export default {
  data () {
    return {
      title: '添加共学',
      id: 0,
      action: 'add',
      labelList: [],
      labelTree: {},
      labelInfo: {},
      tagetLabels: {},
      learn: {
        id: 0,
        title: '',
        content: '',
        cover: '',
        theme: 0,
        display_order: 0,
        sell_num: 0,
        favorite_num: 0,
        labels: [],
        tasks: [],
        homework: []
      },
      modal: {
        visible: false,
        title: '删除确认',
        message: '删除数据后将不能恢复，确定删除吗？'
      },
      removeId: 0,
      removeType: 'task',
      selectDefault: 0,
      taskIndex: 0,
      askIndex: 0,
      homeworkIndex: 0,
      config
    }
  },
  created () {
    var id = parseInt(this.$route.params.id)
    console.log(id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    this.id = id

    if (id) {
      this.title = '编辑共学'
      this.action = 'edit'
      console.log(this.action)
      api.learn.admin.find(this.$route.params.id)
        .then((learn) => {
          this.selectDefault = learn.theme
          if (!learn.tasks || learn.tasks.length === 0) {
            var ask = {id: 0}
            var summary = {id: 0}
            var task = {id: 0, asks: [ask], summaries: [summary]}
            learn.tasks = [task]
          }
          if (!learn.homework || learn.homework.length === 0) {
            var homework = {id: 0}
            learn.homework = [homework]
          }
          this.learn = learn
        })
      labelModule.getLabelList().then((labelList) => {
        this.labelList = labelList
        this.labelTree = labelModule.getLabelTree(labelList)
        this.tagetLabels = this.labelTree[config.label.TARGET_LABEL_ID - 1].childs
        console.log(this.labelTree)
      })
    }
  },
  components: {
    Cleave,
    Tabs,
    TabPane,
    CardModal,
    LabelSelect
  },
  methods: {
    submit () {
      var id = this.learn.id

      if (id) {
        var data = {}
        data.learn = this.learn
        // data.labelInfo = this.labelInfo
        api.learn.admin.edit(id, data).then((res) => {
          console.log(res)
          // this.$router.push('/learns/list')
          helper.showSuccess('编辑成功')
        })
        .catch((e) => {
          console.log(e)
          helper.showError(e.message)
        })
      } else {
        api.learn.admin.add(this.learn).then((res) => {
          console.log(res)
          helper.showSuccess('添加成功')
          this.$router.push('/learns/list')
        })
        .catch((e) => {
          console.log(e)
          helper.showError(e.message)
        })
      }
    },
    setLabelInfo () {
      if (this.learn.labels.length === 0 || this.labelList.length === 0) {
        return
      }
      var labelInfo = {}
      for (var i = 0; i < this.learn.labels.length; i++) {
        var label = this.learn.labels[i]
        // console.log(label)
        var parent = labelModule.getParent(label.id)
        // console.log(parent)
        if (parent) {
          labelInfo[parent.id] = label.id
        }
      }
      console.log(labelInfo)
      this.labelInfo = labelInfo
    },
    createTask () {
      var ask = {id: 0}
      var summary = {id: 0}
      var task = {id: 0, asks: [ask], summaries: [summary]}
      this.learn.tasks.push(task)
    },
    deleteTask (index, id) {
      this.modal.visible = true
      this.removeId = id
      this.taskIndex = index
      this.removeType = 'task'
    },
    createAsk (task) {
      var ask = {id: 0}
      task.asks.push(ask)
      // this.learn.tasks[tIndex].push(task)
    },
    deleteAsk (tIndex, aIndex, id) {
      this.modal.visible = true
      this.removeId = id
      this.taskIndex = tIndex
      this.askIndex = aIndex
      this.removeType = 'ask'
    },
    createSummary (task) {
      var summary = {id: 0}
      task.summaries.push(summary)
      // this.learn.tasks[tIndex].push(task)
    },
    deleteSummary (tIndex, sIndex, id) {
      this.modal.visible = true
      this.removeId = id
      this.taskIndex = tIndex
      this.summaryIndex = sIndex
      this.removeType = 'summary'
    },
    createHomework () {
      var homework = {id: 0}
      this.learn.homework.push(homework)
      // this.learn.tasks[tIndex].push(task)
    },
    deleteHomework (index, id) {
      this.modal.visible = true
      this.removeId = id
      this.homeworkIndex = index
      this.removeType = 'homework'
    },
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
        this.learn.cover = url
        input.value = ''
        helper.showError('上传成功')
      }).catch((e) => {
        input.value = ''
        helper.showError('上传失败：' + e.message)
      })
    },
    confirm () {
      this.modal.visible = false
      switch (this.removeType) {
        case 'task':
          if (this.removeId === 0) {
            this.learn.tasks.splice(this.taskIndex, 1)
          } else {
            api.learn.admin.deleteTask(this.removeId).then(() => {
              this.learn.tasks.splice(this.taskIndex, 1)
            })
          }
          break
        case 'ask':
          if (this.removeId === 0) {
            this.learn.tasks[this.taskIndex].asks.splice(this.askIndex, 1)
          } else {
            api.learn.admin.deleteAsk(this.removeId).then(() => {
              this.learn.tasks[this.taskIndex].asks.splice(this.askIndex, 1)
            })
          }
          break
        case 'summary':
          if (this.removeId === 0) {
            this.learn.tasks[this.taskIndex].summaries.splice(this.summaryIndex, 1)
          } else {
            api.learn.admin.deleteSummary(this.removeId).then(() => {
              this.learn.tasks[this.taskIndex].summaries.splice(this.summaryIndex, 1)
            })
          }
          break
        case 'homework':
          if (this.removeId === 0) {
            this.learn.homework.splice(this.homeworkIndex, 1)
          } else {
            api.learn.admin.deleteHomework(this.removeId).then(() => {
              this.learn.homework.splice(this.homeworkIndex, 1)
            })
          }
          break
        default:
          break
      }
    },
    close () {
      this.modal.visible = false
    },
    selectCallback (id) {
      this.learn.theme = id
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

.sub-control{
  width: 600px;
}
.sub-control .control-label{
  float: left;
  width: 20%;
}
.sub-control .sub-control{
  float:left;
  width: 70%;
}
.sub-container{
  border: 1px solid #ccc;
  border-radius: 5px;
  padding:20px;
  margin:20px;
  margin-left: 0;
}
.sub-container .control .input{
  width:260px;
}
.sub-container .control .textarea{
  width: 260px;
  min-width: 260px;
}
.control .delete-button{
  margin-left:20px;
}
.control-list{
  margin-bottom: 20px;
}

.control-item{
  margin-bottom: 20px;
}
.control div.is-container{
  display: block;
}
.task-item{
  margin:10px 0px;
  height:36px;
}
</style>
