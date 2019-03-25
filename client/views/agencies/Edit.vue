<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-ancestor">
        <div class="tile is-parent cl-form">
          <article class="tile is-child box">
            <h1 class="title">添加老师</h1>
            <div class="block">
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">名称</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="agency.name" type="text" placeholder="名称">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">用户id</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="agency.user_id" type="text" placeholder="用户id">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">联系电话</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="agency.phone" type="text" placeholder="联系电话">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">身份证姓名</label>
                </div>
                <div class="control">
                  <div class="control">
                    {{ agency.idcard_name }}
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">身份证照片</label>
                </div>
                <div class="control">
                  <div class="control">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">机构介绍</label>
                </div>
                <div class="control">
                  <div class="control">
                    <textarea class="textarea" v-model="agency.description"></textarea>
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">申请状态</label>
                </div>
                <div class="control">
                  <div class="control">
                    <select class="select" v-model="agency.status">
                      <option value="0">已申请</option>
                      <option value="1">申请通过</option>
                      <option value="2">申请未通过</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">申请状态</label>
                </div>
                <div class="control">
                  <div class="control">
                    <select class="select" v-model="agency.checked">
                      <option value="0">未认证</option>
                      <option value="1">认证通过</option>
                      <option value="2">认证未通过</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">申请反馈</label>
                </div>
                <div class="control">
                  <div class="control">
                    <textarea class="textarea" v-model="agency.remark"></textarea>
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

import api from 'lanmaLib/common/api'
import helper from '../../helper'

export default {
  data () {
    return {
      title: '添加老师',
      id: 0,
      agency: {
        id: 0,
        name: '',
        user_id: 0,
        remark: ''
      }
    }
  },
  beforeCreate () {
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    this.id = id

    if (id) {
      this.title = '编辑老师信息'
      api.agency.find(this.$route.params.id)
        .then((agency) => {
          this.agency = agency
        })
    }
  },
  components: {
    Cleave
  },
  methods: {
    submit () {
      var id = this.agency.id

      if (id) {
        api.agency.edit(id, this.agency).then((res) => {
          console.log(res)
          this.$router.push('/agencies/list')
          helper.showSuccess('编辑成功')
        })
        .catch((e) => {
          console.log(e)
          helper.showError(e.message)
        })
      } else {
        api.agency.add(this.agency).then((res) => {
          console.log(res)
          helper.showSuccess('添加成功')
          this.$router.push('/agencies/list')
        })
        .catch((e) => {
          console.log(e)
          helper.showError(e.message)
        })
      }
    },
    cancel () {
      this.$router.push('/agencies/list')
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
