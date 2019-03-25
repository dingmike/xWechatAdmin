<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-ancestor">
        <div class="tile is-parent cl-form">
          <article class="tile is-child box">
            <tabs type="boxed">
              <tab-pane label="基本信息">
                <div class="block">
                  <SingleInput :title="'充值金额'" v-model="recharge.amount"></SingleInput>
                  <SingleInput :title="'赠送金额'" v-model="recharge.giftAmount"></SingleInput>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">描述</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <textarea id="autoresp-text" class="textarea" v-model="recharge.quotaDesc" type="text" placeholder="请输入充值项描述"></textarea>
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

  </div>
</template>

<script>
  import { Tabs, TabPane } from 'vue-bulma-tabs'
  import SingleInput from '../../components/widget/SingleInput.vue'
  import Selecter from '../../components/widget/Selecter.vue'

  import api from 'lanmaLib/common/api'
  import helper from '../../helper'

  export default {
    data() {
      return {
        title: '添加商品',
        recharge: {
          id: '',
          channelId: '',
          amount: '',
          giftAmount: '',
          quotaDesc: ''
        }
      }
    },
    computed: {},
    created() {
      var id = parseInt(this.$route.params.id)
      var channelId = parseInt(this.$route.params.channelId)
      if (isNaN(id) || id < 0) {
        id = 0
      }
      this.recharge.id = id
      this.recharge.channelId = channelId
      if (id) {
        this.title = '编辑商品'
        api.recharge.find(id).then((recharge) => {
          this.recharge = recharge
        })
      }
    },
    components: {
      Tabs,
      TabPane,
      SingleInput,
      Selecter
    },
    methods: {
      submit() {
        var id = this.recharge.id
        if (!this.validate()) return
        if (id) {
          api.recharge.update(this.recharge).then((res) => {
            helper.showSuccess('编辑成功')
            this.$router.push('/recharge/list/' + this.recharge.channelId)
          }).catch((e) => {
            helper.showError(e.message)
          })
        } else {
          api.recharge.add(this.recharge).then((res) => {
            helper.showSuccess('添加成功')
            this.$router.push('/recharge/list/' + this.recharge.channelId)
          }).catch((e) => {
            helper.showError(e.message)
          })
        }
      },
      validate() {
        var error = {'amount': '请输入充值金额', 'giftAmount': '请输入赠送金额'}
        if (!this.recharge.amount) {
          helper.showError(error.amount)
          return false
        } else if (!this.recharge.giftAmount) {
          helper.showError(error.giftAmount)
          return false
        }
        return true
      },
      cancel() {
        this.$router.push('/recharge/list')
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
</style>
