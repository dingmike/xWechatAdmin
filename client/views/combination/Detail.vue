<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-ancestor">
        <div class="tile is-parent cl-form">
          <article class="tile is-child box">
            <!--<tabs type="boxed">
              <tab-pane label="基本信息">-->
                <div class="block">
                  <SingleInput :title="'名称'" v-model="combination.name" :isDisabled="true"></SingleInput>
                  <!-- <TextareaInput :title="'简介'" v-model="combination.groupDesc" :isDisabled="true"></TextareaInput> -->
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">简介</label>
                    </div>
                    <div class="control">
                      <!-- <textarea :value="combination.groupDesc"> -->
                      <div class="html-wrap" v-html="combination.groupDesc"></div>
                      <!-- </textarea> -->
                    </div>
                  </div>
                  <ImgUpload :title="'封面图片'" v-model="combination.cover" :isDisabled="true"></ImgUpload>

                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">组合内课程</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <table class="table">
                          <thead>
                            <tr>
                              <th>课程ID</th>
                              <th>标题</th>
                              <th>价格（元）</th>
                              <th>上课时间</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(item, index) in combination.courseList">
                              <td>{{ item.id }}</td>
                              <td>{{ item.title }}</td>
                              <td>{{ item.price }}</td>
                              <td>{{ item.lesson_time }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <SingleInput :title="'开课时间'" v-model="combination.lesson_time" :isDisabled="true"></SingleInput>
                  
                </div>
              <!--</tab-pane>
            </tabs>-->

            <div class="control is-horizontal"  v-if="isAdmin">
              <div class="control-label">
                <label class="label"></label>
              </div>
              <div class="control">
                <button class="button is-primary" @click="edit">编辑</button>
                <button class="button is-link" @click="cancel">取消</button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
    
    <card-modal :visible="editModal.visible" @cancel="close" @close="close" @ok="confirm" :title="editModal.title"  transition="zoom">
      {{ editModal.message }}
    </card-modal>
  </div>
</template>

<script>
  import { Tabs, TabPane } from 'vue-bulma-tabs'
  import ImgUpload from '../../components/widget/ImgUpload.vue'
  import SingleInput from '../../components/widget/SingleInput.vue'
  import TextareaInput from '../../components/widget/TextareaInput.vue'
  import CardModal from '../../components/widget/CardModal.vue'

  import api from 'lanmaLib/common/api'

  export default {
    data() {
      return {
        combination: {
          id: '',
          cover: '',
          name: '',
          // price: '',
          groupDesc: '',
          courseList: []
        },
        editModal: {
          visible: false,
          title: '编辑确认',
          message: '修改已有销售记录的课程，将会影响已报名用户，请务必谨慎操作！'
        }
      }
    },
    computed: {
      isAdmin() {
        return JSON.parse(window.localStorage.getItem('userInfo')).roles === '1'
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
      ImgUpload,
      SingleInput,
      TextareaInput,
      CardModal
    },
    methods: {
      cancel() {
        this.$router.push('/combination/list')
      },
      edit() {
        this.editModal.visible = true
      },
      confirm () {
        var _this = this
        var link = '/combination/edit/' + this.combination.id
        this.close()
        setTimeout(function() {
          _this.$router.push(link)
        }, 100)
      },
      close() {
        this.editModal.visible = false
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

  .html-wrap {
    border: 1px solid #ccc;
    padding: 10px;
  }
</style>
