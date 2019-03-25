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
                  <SingleInput :title="'价格'" v-model.number="combination.price"></SingleInput>
                  <TextareaInput :title="'简介'" v-model="combination.desc"></TextareaInput>
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
                              <th>操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(item, index) in combination.courseList">
                              <td>{{ item.id }}</td>
                              <td>{{ item.title }}</td>
                              <td>{{ item.price }}</td>
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
          price: '',
          desc: '',
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
          list: []
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
      ListSelectModal
    },
    methods: {
      submit() {
        var id = this.combination.id
        if (!this.validate()) return
        if (id) {
          api.combination.update(id, this.combination).then((res) => {
            helper.showSuccess('编辑成功')
            this.$router.push('/combination/list')
          }).catch((e) => {
            helper.showError(e.message)
          })
        } else {
          api.combination.add(this.combination).then((res) => {
            helper.showSuccess('添加成功')
            this.$router.push('/combination/list')
          }).catch((e) => {
            helper.showError(e.message)
          })
        }
      },
      validate() {
        var error = {'cover': '请上传封面', 'name': '请输入课程组合名称', 'price': '请输入价格', 'desc': '请输入简介', 'courseList': '请添加课程', 'courseListLength': '课程组合必须包含不少于两个课程，请添加后保存！'}
        if (!this.combination.name) {
          helper.showError(error.name)
          return false
        } else if (!this.combination.price) {
          helper.showError(error.price)
          return false
        } else if (!this.combination.desc) {
          helper.showError(error.desc)
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
        this.combination.courseList.splice(this.index, 1)
      },
      addCourse() {
        this.courseModal.visible = true
      },
      addSuccess(item) {
        if (item) {
          this.combination.courseList.push(item)
        }
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
