<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-ancestor">
        <div class="tile is-parent cl-form">
          <article class="tile is-child box">
            <tabs type="boxed">
              <tab-pane label="基本信息">
                <div class="block">
                  <SingleInput :title="'名称'" v-model="combination.name"></SingleInput>

                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">课程简介</label>
                    </div>
                    <div class="control">
                      <TextEditor id="content-html"></TextEditor>
                    </div>
                  </div>
                  <ImgUpload :title="'封面图片'" v-model="combination.cover"></ImgUpload>

                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">{{ title }}</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <table class="table">
                          <thead>
                            <tr>
                              <th>序号</th>
                              <th>名称</th>
                              <th>价格（元）</th>
                              <th>上课时间</th>
                              <th>操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(item, index) in combination.courseList">
                              <td>{{ item.id }}</td>
                              <td>{{ item.title }}</td>
                              <td>{{ item.price }}</td>
                              <td>{{ item.lesson_time }}</td>
                              <td>
                                <router-link :to="'/courses/edit/' + item.id + '/info'">详情</router-link>&nbsp;&nbsp;
                                <a href="#" @click.prevent="remove(index)">删除</a>&nbsp;&nbsp;
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <a href="#" class="addcourse" @click.prevent="addCourse">✚ 添加课程</a>
                      </div>
                    </div>
                  </div>
                  <SingleInput :title="'开课时间'" v-model="combination.lesson_time" :isDisabled="true"></SingleInput>

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
    <ListSelectModal :modal="courseModal" @select="addSuccess"></ListSelectModal>

  </div>
</template>

<script>
  import { Tabs, TabPane } from 'vue-bulma-tabs'
  import CardModal from '../../components/widget/CardModal.vue'
  import ListSelectModal from '../../components/widget/ListSelectModal.vue'
  import ImgUpload from '../../components/widget/ImgUpload.vue'
  import SingleInput from '../../components/widget/SingleInput.vue'
  import TextareaInput from '../../components/widget/TextareaInput.vue'
  import TextEditor from 'components/widget/TextEditor'

  import api from 'lanmaLib/common/api'
  import helper from '../../helper'
  import _ from 'lodash'

  export default {
    data() {
      return {
        title: '添加课程组合',
        removeIndex: 0,
        combination: {
          id: '',
          cover: '',
          name: '',
          lesson_time: '',
          groupDesc: '',
          courseList: []
        },
        modal: {
          visible: false,
          okText: '确定',
          cancelText: '取消',
          title: '删除确认',
          message: '删除数据后将不能恢复，确定删除吗？'
        },
        courseModal: {
          visible: false,
          okText: '确定',
          cancelText: '取消',
          title: '选择课程',
          text: ['课程ID', '标题', '价格（元）', '时间'],
          kw: ['id', 'title', 'price', 'lesson_time'],
          apiFunc: api.course.getList,
          params: {status: 7, title: '', materialType: 1}
        }
      }
    },
    created() {
      var id = parseInt(this.$route.params.id)
      if (isNaN(id) || id < 0) {
        id = 0
      }
      this.combination.id = id

      if (id) {
        this.title = '编辑课程组合'
        api.combination.find(id).then((combination) => {
          this.combination = combination
          this.setEditorHtml()
        })
      }
    },
    components: {
      Tabs,
      TabPane,
      CardModal,
      ImgUpload,
      SingleInput,
      TextareaInput,
      ListSelectModal,
      TextEditor
    },
    methods: {
      submit() {
        this.getEditorHtml()
        var id = this.combination.id
        if (!this.validate()) return
        this.countFistInfo()
        var data = _.cloneDeep(this.combination)
        data.courseList = data.courseList.map(item => {
          return item.id
        })
        if (id) {
          api.combination.update(data).then((res) => {
            helper.showSuccess('编辑成功')
            this.$router.go(-1)
            // this.$router.push('/combination/list')
          }).catch((e) => {
            helper.showError(e.message)
          })
        } else {
          api.combination.add(data).then((res) => {
            helper.showSuccess('添加成功')
            this.$router.push('/combination/list')
          }).catch((e) => {
            helper.showError(e.message)
          })
        }
      },
      countFistInfo () {
        var list = _.cloneDeep(this.combination.courseList)
        list = list.sort(function (a, b) {
          var aTemp = new Date(a.lesson_time)
          var bTemp = new Date(b.lesson_time)
          return aTemp.getTime() > bTemp.getTime()
        })
        this.combination.lesson_time_end = list[list.length - 1].lesson_time
        this.combination.labelAge = list[0].labelAge
        this.combination.labelTarget = list[0].labelTarget
        this.combination.labelTheme = list[0].labelTheme
        var lessonLocation = {}
        for (let i = 0; i < list.length; i++) {
          let siteMap = list[i].lesson_site.split('-')
          let city = siteMap[1].replace(/市/g, '')
          let district = siteMap[2].replace(/县|区/g, '')
          if (!lessonLocation[city]) {
            lessonLocation[city] = []
          }
          let flag = true
          for (let j = 0; j < lessonLocation[city].length; j++) {
            if (lessonLocation[city][j] === district) {
              flag = false
            }
          }
          if (flag) {
            lessonLocation[city].push(district)
          }
        }
        var temp = ''
        for (let item in lessonLocation) {
          temp += item + '-' + lessonLocation[item].join('，') + '|'
        }
        this.combination.lesson_location = temp.replace(/\|$/, '')
      },
      validate() {
        var error = {'cover': '请上传封面', 'name': '请输入课程组合名称', 'groupDesc': '请输入简介', 'courseList': '请添加课程', 'courseListLength': '课程组合必须包含不少于两个课程，请添加后保存！'}
        if (!this.combination.name) {
          helper.showError(error.name)
          return false
        } else if (!this.combination.groupDesc) {
          helper.showError(error.groupDesc)
          return false
        } else if (!this.combination.cover) {
          helper.showError(error.cover)
          return false
        } else if (this.combination.courseList.length === 0) {
          helper.showError(error.courseList)
          return false
        } else if (this.combination.courseList.length === 1) {
          helper.showError(error.courseListLength)
          return false
        }
        return true
      },
      cancel() {
        this.$router.push('/combination/list')
      },
      getSingleCourseList() {
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
      remove (index) {
        this.modal.visible = true
        this.removeIndex = index
      },
      confirm() {
        this.modal.visible = false
        this.combination.courseList.splice(this.removeIndex, 1)
        this.calLessonTime()
      },
      addCourse() {
        this.courseModal.visible = true
      },
      addSuccess(item) {
        if (item) {
          if (item.materialType === 2) {
            helper.showError('仅支持2小时类型的课程添加')
          } else if (Date.parse(item.lesson_time) < Date.now()) {
            helper.showError('该课程已过期，请重新选择')
          } else if (!_.find(this.combination.courseList, item)) {
            this.combination.courseList.push(item)
            this.calLessonTime()
          } else {
            helper.showError('请选择不同的课程')
          }
        }
      },
      calLessonTime() {
        this.combination.lesson_time = this.combination.courseList.map(item => {
          return item.lesson_time
        }).sort()[0]
      },
      setEditorHtml () {
        document.querySelector('#content-html .ql-editor').innerHTML = this.combination.groupDesc
      },
      getEditorHtml () {
        this.combination.groupDesc = document.querySelector('#content-html .ql-editor').innerHTML
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
    width: 600px;
  }

  .sub-control-large {
    width: 800px;
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

  .table {
    margin-bottom: 10px;
    border: 1px solid #ccc;
  }

  .addcourse {
    margin: 10px;
  }
</style>
