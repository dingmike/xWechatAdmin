<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-ancestor">
        <div class="tile is-parent cl-form">
          <article class="tile is-child box">
            <h1 class="title">添加渠道</h1>
            <div class="block">
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">名称</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="channel.name" type="text" placeholder="名称">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">登录用户名</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="channel.username" type="text" placeholder="用户名">
                  </div>
                </div>
              </div>
              <template v-if="id">
                <div class="control is-horizontal">
                  <div class="control-label">
                    <label class="label">修改密码</label>
                  </div>
                  <div class="control">
                    <div class="control">
                      <a class="editPassword" @click="passwordModal.visible = true">修改密码</a>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="control is-horizontal">
                  <div class="control-label">
                    <label class="label">登录密码</label>
                  </div>
                  <div class="control">
                    <div class="control">
                      <input class="input" v-model="channel.password" type="text" placeholder="密码">
                    </div>
                  </div>
                </div>
                <div class="control is-horizontal">
                  <div class="control-label">
                    <label class="label">确认密码</label>
                  </div>
                  <div class="control">
                    <div class="control">
                      <input class="input" v-model="passwordTwo" type="text" placeholder="确认密码">
                    </div>
                  </div>
                </div>
              </template>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">渠道编号</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="channel.serviceId" type="text" placeholder="渠道ID">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">所在地</label>
                </div>
                <div class="control">
                  <div class="control">
                    <china-site-select :siteDefault="siteDefault" :selectCallback="siteSelected"></china-site-select>
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">地址</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="channel.description" type="text" placeholder="渠道地址" style="width:400px">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">负责人</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="channel.manager" type="text" placeholder="姓名">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">联系电话</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="channel.telephone" type="text" placeholder="电话">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label"></label>
                </div>
                <div class="control">
                  <button class="button is-primary" @click="submit">提交</button>
                  <button class="button is-link">取消</button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
    <card-modal :visible="passwordModal.visible" @close="passwordModelClose" @cancel="passwordModelClose" @ok="confirmPassword" :title="passwordModal.title" :showErrorMsg="passwordModal.showErrorMsg" :errorMsg="passwordModal.errorMsg" transition="zoom">
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <article class="tile is-child box">
            <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">请输入新密码</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="channel.password" type="text" placeholder="密码">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">请确认新密码</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="passwordTwo" type="text" placeholder="确认密码">
                  </div>
                </div>
              </div>
          </article>
        </div>
      </div>
    </card-modal>
  </div>
</template>

<script>
  import Cleave from 'vue-cleave'
  import 'cleave.js/dist/addons/cleave-phone.cn'
  import CardModal from '../../components/widget/CardModal.vue'
  import api from 'lanmaLib/common/api'
  import helper from '../../helper'
  import chinaSiteSelect from '../../components/widget/chinaSiteSelect.vue'
  export default {
    data () {
      return {
        title: '添加渠道',
        id: 0,
        passwordModal: {
          visible: false,
          title: '修改密码',
          showErrorMsg: false,
          errorMsg: '两次输入密码不同，请重新输入！'
        },
        channel: {
          id: 0,
          name: '',
          description: '',
          username: '',
          password: '',
          serviceId: '',
          manager: '',
          telephone: '',
          site: ''
        },
        passwordTwo: '',
        siteDefault: ''
      }
    },
    computed: {
    },
    created () {
      var id = parseInt(this.$route.params.id)
      if (isNaN(id) || id < 0) {
        id = 0
      }
      this.id = id
      if (id) {
        this.title = '编辑渠道'
        api.channel.find(this.$route.params.id)
          .then((channel) => {
            channel.password = ''
            this.siteDefault = channel.site ? channel.site : ''
            this.channel = channel
          })
      }
    },
    components: {
      Cleave,
      chinaSiteSelect,
      CardModal
    },
    mounted () {
    },
    methods: {
      submit () {
        var id = this.channel.id
        var username = this.channel.username
        var name = this.channel.name
        var description = this.channel.description
        var serviceId = this.channel.serviceId
        var site = this.channel.site
        var telephone = this.channel.telephone
        var manager = this.channel.manager
        var password = this.channel.password
        var passwordTwo = this.passwordTwo
        var data = {
          username,
          name,
          description,
          serviceId,
          site,
          manager,
          telephone
        }
        if (id) {
          api.channel.edit(id, data).then((res) => {
            console.log(res)
            this.$router.push('/channels/list')
            helper.showSuccess('修改成功')
          })
            .catch((e) => {
              console.log(e)
              helper.showError(e.message)
            })
        } else {
          if (password !== passwordTwo) {
            helper.showError('两次输入密码不同，请重新输入！')
            return
          } else if (password === '') {
            helper.showError('密码不能为空')
            return
          }
          if (password !== '') {
            data['password'] = password
          }
          api.channel.add(data).then((res) => {
            console.log(res)
            helper.showSuccess('添加成功')
            this.$router.push('/channels/list')
          })
            .catch((e) => {
              console.log(e)
              helper.showError(e.message)
            })
        }
      },
      siteSelected (site) {
        this.channel.site = site
      },
      confirmPassword () {
        var password = this.channel.password
        var passwordTwo = this.passwordTwo
        if (password !== passwordTwo) {
          this.passwordModal.errorMsg = '两次输入密码不同，请重新输入！'
          this.passwordModal.showErrorMsg = true
          return
        } else if (password === '') {
          this.passwordModal.errorMsg = '密码不能为空'
          this.passwordModal.showErrorMsg = true
          return
        }
        var params = {
          'userId': this.id,
          'password': password
        }
        api.channel.editPassword(params)
          .then((res) => {
            this.passwordModelClose()
            helper.showSuccess('修改密码成功')
          })
          .catch((e) => {
            this.passwordModelClose()
            helper.showError(e.message)
          })
      },
      passwordModelClose () {
        this.passwordModal.visible = false
        this.passwordModal.showErrorMsg = false
        this.channel.password = ''
        this.passwordTwo = ''
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
  .editPassword{
    height:32px;
    line-height: 32px;
  }
</style>
