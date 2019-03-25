<template>
  <div id="pageDisabled">
    <div class="tile is-ancestor">
      <div class="tile is-ancestor">
        <div class="tile is-parent cl-form">
          <article class="tile is-child box">
            <SingleInput :title="'认证机构'" v-model="teach.thirdPartyName" :inputWidth="'300px'" :placeholder="' '"></SingleInput>
            <SingleInput :title="'姓名'" v-model="teach.name" :inputWidth="'300px'" :placeholder="'请输入老师姓名'"></SingleInput>
            <RadioInput :list="radioMap" :value="teach.sex" :title="'性别'" v-model="teach.sex"></RadioInput>
            <SingleInput :title="'手机'" v-model="teach.phone" :inputWidth="'300px'" :placeholder="'请输入老师手机号码'"></SingleInput>
            <TextareaInput :title="'简介'" :placeholder="'请输入老师简介'" v-model="teach.description" :inputWidth="'300px'"></TextareaInput>
            <div class="control is-horizontal">
              <div class="control-label">
                <label class="label">绑定微信</label>
              </div>
              <div class="control">
                <template v-if="isBind">
                  <img class="wximg" :src="teach.headImg" alt="">
                  <span class="wxname">{{ teach.wxname }}</span>
                  <!--<button class="button resetwx" v-if="isBind" @click="resetwx">解除绑定</button>-->
                </template>
                <template v-if="!isBind">
                  <img class="wximg" :src="bindImg" alt="">
                  <span class="wxname" v-if="!isBind">请老师打开微信，扫描该二维码进行微信绑定</span>
                </template>
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
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Tabs, TabPane } from 'vue-bulma-tabs'
  import SingleInput from '../../components/widget/SingleInput.vue'
  import RadioInput from '../../components/widget/RadioInput.vue'
  import TextareaInput from '../../components/widget/TextareaInput.vue'
  import api from 'lanmaLib/common/api'
  import helper from '../../helper'

  export default {
    data() {
      return {
        title: '编辑销售人员信息',
        teach: {
          id: '',
          name: '',
          phone: '',
          sex: 1,
          description: '',
          wxname: '',
          headImg: ''
        },
        isBind: false,
        bindImg: '',
        thirdPartyList: {},
        radioMap: [
          {
            label: '男',
            value: 1
          }, {
            label: '女',
            value: 2
          }
        ]
      }
    },
    created() {
      var id = parseInt(this.$route.params.id)
      if (isNaN(id) || id < 0) {
        id = 0
      }
      this.teach.id = id
      this.getThirdPartyList()
    },
    components: {
      Tabs,
      TabPane,
      SingleInput,
      RadioInput,
      TextareaInput
    },
    methods: {
      getInfo () {
        api.thirdParty.getThirdPartyTeacher(this.teach.id).then((data) => {
          this.teach.id = data.id
          this.teach.name = data.name
          this.teach.phone = data.phone
          this.teach.description = data.description
          this.teach.sex = data.sex
          this.teach.thirdPartyName = this.thirdPartyList[data.thirdPartyId].name
          if (data.user_id) {
            this.isBind = true
            this.teach.wxname = data.wxName
            this.teach.headImg = data.headimgurl
          }
          this.$nextTick(() => {
            this.pageDisabled()
          })
        })
      },
      submit() {
        helper.showError('你没有权限进行修改！')
        return
//      if (!this.validate()) return
//      var params = {
//        id: this.teach.id,
//        name: this.teach.name,
//        phone: this.teach.phone,
//        sex: this.teach.sex,
//        description: this.teach.description
//      }
//      if (this.teach.id) {
//        api.agency.updateThirdPartyTeacher(params).then((res) => {
//          helper.showSuccess('编辑成功')
//          this.$router.push('/agencies/list')
//        }).catch((e) => {
//          helper.showError(e.message)
//        })
//      }
      },
      pageDisabled () {
        var el = document.getElementById('pageDisabled')
        var elInput = el.getElementsByTagName('input')
        var elArea = el.getElementsByTagName('textarea')
        for (let i = 0; i < elInput.length; i++) {
          elInput[i].disabled = true
        }
        for (let i = 0; i < elArea.length; i++) {
          elArea[i].disabled = true
        }
      },
      getThirdPartyList () {
        var params = {
          offset: 0,
          length: 0
        }
        api.thirdParty.getThirdPartyList(params)
          .then((data) => {
            var temp = {}
            for (var i = 0; i < data.list.length; i++) {
              temp[data.list[i].user_id] = data.list[i]
            }
            this.thirdPartyList = temp
            this.getInfo()
          })
      },
      validate() {
        var error = {'name': '请输入销售人员姓名', 'phone': '请输入手机号码'}
        if (!this.teach.name) {
          helper.showError(error.name)
          return false
        } else if (!this.teach.phone) {
          helper.showError(error.phone)
          return false
        }
        return true
      },
      cancel() {
        this.$router.push('/agencies/list')
      }
    }
  }

</script>

<style scoped>

  .wximg{
    height: 100px;
    border: 1px solid #ccc;
  }

  .wxname{
    line-height: 100px;
    margin-left: 20px;
  }

  .control .button.resetwx{
    margin-top: 35px;
    margin-left: 20px;
  }
</style>
