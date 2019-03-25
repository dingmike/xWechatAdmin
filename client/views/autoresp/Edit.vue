<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-ancestor">
        <div class="tile is-parent cl-form">
          <article class="tile is-child box">
            <tabs type="boxed">
              <tab-pane label="基本信息">
                <div class="block">
                  
                  <SingleInput :title="'匹配类型'" value="全匹配" :isDisabled="true"></SingleInput>
                  <SingleInput :title="'链接形式'" value="<a href='链接网址'>链接文字</a>" :isDisabled="true" :inputWidth="'400px'"></SingleInput>
                  <SingleInput :title="'链接举例'" value="<a href='https://www.baidu.com'>百度</a>" :isDisabled="true" :inputWidth="'400px'"></SingleInput>
                  <SingleInput :title="'关键字'" v-model="autoresp.keyText"></SingleInput>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">文本内容</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <textarea id="autoresp-text" class="textarea" v-model="autoresp.msgText.content" type="text" placeholder="请输入自动回复内容（支持超链接文本，链接插入形式请参考上面例子）"></textarea>
                      </div>
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
              </tab-pane>
            </tabs>

          </article>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import { Tabs, TabPane } from 'vue-bulma-tabs'
  import SingleInput from '../../components/widget/SingleInput.vue'
  import TextareaInput from '../../components/widget/TextareaInput.vue'
  import TextEditor from 'components/widget/TextEditor'

  import api from 'lanmaLib/common/api'
  import helper from '../../helper'
  // import _ from 'lodash'

  export default {
    data() {
      return {
        title: '添加自动回复',
        removeIndex: 0,
        autoresp: {
          keyText: '',
          msgType: 'text',
          msgText: {
            content: ''
          }
        }
      }
    },
    created() {
      var index = this.$route.params.index
      if (!index) {
        index = ''
      }

      if (index) {
        this.title = '编辑自动回复'
        api.autoresp.getList().then((data) => {
          this.autoresp = data.list[index]
        })
      }
    },
    components: {
      Tabs,
      TabPane,
      SingleInput,
      TextareaInput,
      TextEditor
    },
    methods: {
      submit() {
        if (!this.validate()) return
        api.autoresp.edit(this.autoresp).then((res) => {
          helper.showSuccess('操作成功')
          this.$router.go(-1)
        }).catch((e) => {
          helper.showError(e.message)
        })
      },
      validate() {
        var error = {'key': '请输入关键字', 'text': '请输入文本内容'}
        if (!this.autoresp.keyText) {
          helper.showError(error.key)
          return false
        } else if (!this.autoresp.msgText.content) {
          helper.showError(error.text)
          return false
        }
        return true
      },
      cancel() {
        this.$router.push('/autoresp/list')
      },
      remove (index) {
        this.modal.visible = true
        this.removeIndex = index
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

  #autoresp-text{
    min-width: 800px;
    min-height: 200px;
  }

</style>
