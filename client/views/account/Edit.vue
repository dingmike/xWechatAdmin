<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-ancestor">
        <div class="tile is-parent cl-form">
          <article class="tile is-child box">
            <div class="block">
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">旧密码</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="oldPassword" type="password" placeholder="输入旧密码">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">新密码</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="newPassword" type="password" placeholder="输入新密码">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">密码确认</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="confirm_password" type="password" placeholder="输入密码确认">
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
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cleave from 'vue-cleave'
import 'cleave.js/dist/addons/cleave-phone.cn'

// import api from 'lanmaLib/common/api'
import helper from '../../helper'
import api from 'lanmaLib/common/api'
import md5 from 'md5'

export default {
  data () {
    return {
      title: '修改密码',
      id: 0,
      newPassword: '',
      oldPassword: '',
      confirm_password: ''
    }
  },
  components: {
    Cleave
  },
  methods: {
    submit () {
      if (!this.oldPassword) {
        helper.showError('请输入旧密码')
      } else if (!this.oldPassword) {
        helper.showError('请输入新密码')
      } else if (!this.confirm_password) {
        helper.showError('请再次输入密码')
      } else {
        // this.$router.push('/account/')
        let newMd5Password = md5(md5(this.newPassword))
        let oldMd5Password = md5(md5(this.oldPassword))
        api.changePassword(oldMd5Password, newMd5Password).then((res) => {
          helper.showSuccess('修改成功')
          console.log(res)
        }).catch((err) => {
          if (err.code === 6002) {
            api.changePassword(this.oldPassword, newMd5Password).then((res) => {
              helper.showSuccess('修改成功')
              console.log(res)
            }).catch((err) => {
              helper.showError('修改失败')
              console.log(err)
            })
          } else {
            helper.showError('修改失败')
            console.log(err)
          }
        })
      }
      // if () {
      //   api.label.edit(id, this.label).then((res) => {
      //     console.log(res)
      //     this.$router.push('/system/label_list')
      //     helper.showSuccess('编辑成功')
      //   })
      //   .catch((e) => {
      //     console.log(e)
      //     helper.showError(e.message)
      //   })
      // } else {
      //   api.label.add(this.label).then((res) => {
      //     console.log(res)
      //     helper.showSuccess('添加成功')
      //     this.$router.push('/system/label_list')
      //   })
      //   .catch((e) => {
      //     console.log(e)
      //     helper.showError(e.message)
      //   })
      // }
    },
    cancel () {
      this.$router.push('/account/')
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
</style>
