<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-ancestor">
        <div class="tile is-parent cl-form">
          <article class="tile is-child box">
            <h1 class="title">添加优惠券</h1>
            <div class="block">
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">标题</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="coupon.title" type="text" placeholder="标题">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">类别</label>
                </div>
                <div class="control">
                  <div class="control">
                    <select class="select" v-model="coupon.type">
                      <option :value="idx" v-for="(item, idx) in $config.coupon.type">{{ item }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">使用场景</label>
                </div>
                <div class="control">
                  <div class="control">
                    <select class="select" v-model="coupon.scope">
                      <option :value="idx" v-for="(item, idx) in $config.coupon.scope">{{ item }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">简介</label>
                </div>
                <div class="control">
                  <div class="control">
                    <textarea class="textarea" v-model="coupon.description"></textarea>
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">剩余数量</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="coupon.number" type="text" placeholder="剩余数量">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">价格（积分）</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="coupon.price" type="text" placeholder="">
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">折扣（仅用于折扣券）</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="coupon.discount" type="text" placeholder="比如：8.8">
                    <span class="help">比如：8.8</span>
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">抵扣金额（仅用于抵扣券）</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="coupon.deduction" type="text" placeholder="">
                  </div>
                </div>
              </div>

              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">显示顺序</label>
                </div>
                <div class="control">
                  <div class="control">
                    <input class="input" v-model="coupon.display_order" type="text" placeholder="显示顺序">
                    <span class="help">数字越大，显示越靠前，最大不能超过8位数</span>
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">审核状态</label>
                </div>
                <div class="control">
                  <div class="control">
                    <select class="select" v-model="coupon.status">
                      <option value="0">未审核</option>
                      <option value="1">审核通过</option>
                      <option value="2">审核未通过</option>
                      <option value="3">删除</option>
                    </select>
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
  </div>
</template>

<script>
import Cleave from 'vue-cleave'
import 'cleave.js/dist/addons/cleave-phone.cn'

import api from 'lanmaLib/common/api'
import helper from '../../helper'
import LabelSelect from 'components/widget/LabelSelect'

export default {
  data () {
    return {
      title: '添加优惠券',
      id: 0,
      coupon: {
        id: 0,
        title: '',
        number: 0,
        price: 0,
        discount: 0,
        deduction: 0,
        description: '',
        display_order: 0,
        age_label: 0,
        status: 0
      },
      ageDefaultVal: 0,
      themeDefaultVal: 0
    }
  },
  created () {
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    this.id = id

    if (this.id) {
      this.title = '编辑优惠券'
      api.admin.coupon.find(this.id)
        .then((coupon) => {
          this.coupon = coupon
        })
    }
  },
  components: {
    Cleave,
    LabelSelect
  },
  methods: {
    submit () {
      if (this.id) {
        api.admin.coupon.edit(this.id, this.coupon).then((res) => {
          console.log(res)
          this.$router.push('/coupons/list')
          helper.showSuccess('添加成功')
        })
        .catch((e) => {
          console.log(e)
          helper.showError(e.message)
        })
      } else {
        api.admin.coupon.add(this.coupon).then((res) => {
          console.log(res)
          helper.showSuccess('添加成功')
          this.$router.push('/coupons/list')
        })
        .catch((e) => {
          console.log(e)
          helper.showError(e.message)
        })
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

img.cover{
  height:100px;
}
</style>
