<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-ancestor">
        <div class="tile is-parent cl-form">
          <article class="tile is-child box">
            <!--<tabs type="boxed">
              <tab-pane label="基本信息">-->
                <div class="block">
                  <SingleInput :title="'姓名'" v-model="seller.name"></SingleInput>
                  <SingleInput :title="'手机'" v-model.number="seller.phone"></SingleInput>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">绑定微信</label>
                    </div>
                    <div class="control">
                      <template v-if="isBind">
                        <img class="wximg" :src="seller.headImg" alt="">
                        <span class="wxname">{{ seller.wxname }}</span>
                        <button class="button resetwx" v-if="isBind" @click="resetwx">解除绑定</button>
                      </template>
                      <template v-if="!isBind">
                        <img class="wximg" :src="bindImg" alt="">
                        <span class="wxname" v-if="!isBind">请销售人员打开微信，扫描该二维码进行微信绑定</span>
                      </template>
                    </div>
                  </div>
                </div>
              <!--</tab-pane>
            </tabs>-->

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

  import api from 'lanmaLib/common/api'
  import helper from '../../helper'

  export default {
    data() {
      return {
        title: '编辑销售人员信息',
        seller: {
          id: '',
          name: '',
          phone: '',
          wxname: '',
          headImg: ''
        },
        isBind: false,
        bindImg: ''
      }
    },
    created() {
      var id = parseInt(this.$route.params.id)
      if (isNaN(id) || id < 0) {
        id = 0
      }
      this.seller.id = id
      api.seller.getSellerInfo(id).then((data) => {
        this.seller.id = data.salesInfo.id
        this.seller.name = data.salesInfo.name
        this.seller.phone = data.salesInfo.telephone
        if (data.salesInfo.userId) {
          this.isBind = true
          this.seller.wxname = data.baseInfo.name
          this.seller.headImg = data.baseInfo.headimgurl
        } else {
          this.getBindQrcode()
        }
      })
    },
    components: {
      Tabs,
      TabPane,
      SingleInput
    },
    methods: {
      getBindQrcode() {
        api.seller.bindSellerQRcode(this.seller.id).then((data) => {
          this.isBind = false
          this.bindImg = data.qrcode
          this.startQuery(data.qrcodeId)
        })
      },
      submit() {
        var id = this.seller.id
        if (!this.validate()) return
        if (id) {
          api.seller.updateSeller(id, this.seller.name, this.seller.phone).then((res) => {
            helper.showSuccess('编辑成功')
            this.$router.push('/seller/list')
          }).catch((e) => {
            helper.showError(e.message)
          })
        }
      },
      validate() {
        var error = {'name': '请输入销售人员姓名', 'phone': '请输入手机号码'}
        if (!this.seller.name) {
          helper.showError(error.name)
          return false
        } else if (!this.seller.phone) {
          helper.showError(error.phone)
          return false
        }
        return true
      },
      startQuery(id) {
        var _this = this
        setTimeout(function() {
          api.seller.checkBind(id).then(data => {
            if (data) {
              _this.getSellerInfo()
            } else {
              _this.startQuery(id)
            }
          }).catch(() => {
            helper.showError('查询绑定结果失败')
          })
        }, 1000)
      },
      getSellerInfo () {
        api.seller.getSellerInfo(this.seller.id).then(data => {
          if (data.salesInfo.userId) {
            this.isBind = true
            this.seller.wxname = data.baseInfo.name
            this.seller.headImg = data.baseInfo.headimgurl
          }
        })
      },
      resetwx() {
        api.seller.unBindwx(this.seller.id).then(res => {
          this.getBindQrcode()
        })
      },
      cancel() {
        this.$router.push('/seller/list')
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
