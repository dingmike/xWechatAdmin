<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-ancestor">
        <div class="tile is-parent cl-form">
          <article class="tile is-child box">
            <progress-tracker text alignment="center">
              <step-item v-for="(item, index) in stepItems" :key="item.title" :marker="item.marker" :title="item.title" :is-complete="index < step" :is-active="index === step"></step-item>
            </progress-tracker>

            <template v-if="step==0">
              <div class="block">
                <SingleInput :title="'姓名'" v-model="seller.name" :inputWidth="'300px'" :placeholder="'请输入销售人员姓名'"></SingleInput>
                <SingleInput :title="'手机'" v-model="seller.phone" :inputWidth="'300px'" :placeholder="'请输入销售人员手机号码'"></SingleInput>
              </div>
              <div class="button-wrap">
                <button class="button is-primary" @click="nextStep">下一步</button>
              </div>
            </template>

            <template v-if="step==1">
              <div class="qrcode">
                <img class="wx-img" :src="qrcodeImg" alt="">
                <p>请销售人员打开微信，扫描该二维码进行微信绑定</p>
                <!--http://wx.qlogo.cn/mmopen/iajwydyXHMdJ7pIicBib73bC5I9iaWePFpZqLxDBicribWEcaly9vobuvvMNicBaTO2Fl8fL1Ckyfoer1AbmCAR7RHiavg/0-->
              </div>
            </template>

            <template v-if="step==2">
              <div class="complete">
                <span>{{ seller.name }} （{{ seller.phone }}）</span>
                <span>成功绑定微信</span>
                <img class="wx-img" :src="seller.headImg" alt="">
                <span>{{ seller.wxname }}</span>
              </div>
              <div class="button-wrap">
                <button class="button is-primary" @click="addMore">继续添加</button>
              </div>
            </template>

          </article>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import ProgressTracker, { StepItem } from 'vue-bulma-progress-tracker'
  import SingleInput from '../../components/widget/SingleInput.vue'

  import api from 'lanmaLib/common/api'
  import helper from '../../helper'

  export default {
    data() {
      return {
        title: '添加销售人员',
        step: 0,
        seller: {
          id: '',
          name: '',
          phone: '',
          wxname: '',
          headImg: ''
        },
        qrcodeImg: '',
        stepItems: [
          {
            title: '录入基本信息'
          },
          {
            title: '绑定微信'
          },
          {
            title: '完成'
          }
        ]
      }
    },
    created() {
      var id = parseInt(this.$route.params.id)
      if (isNaN(id) || id < 0) {
        id = 0
      }
      this.seller.id = id

      if (id) {
        this.title = '编辑销售人员信息'
        api.seller.find(id).then((seller) => {
          this.seller = seller
        })
      }
    },
    components: {
      SingleInput,
      ProgressTracker,
      StepItem
    },
    methods: {
      submit() {
        // var id = this.seller.id
        if (!this.validate()) return
        api.seller.add(this.seller).then((res) => {
          helper.showSuccess('添加成功')
          this.$router.push('/seller/list')
        }).catch((e) => {
          helper.showError(e.message)
        })
      },
      nextStep() {
        if (!this.validate()) return

        api.seller.addSeller(this.seller.name, this.seller.phone).then((data) => {
          this.seller.id = data.id
          api.seller.bindSellerQRcode(data.id).then((data) => {
            this.qrcodeImg = data.qrcode
            this.step++
            this.startQuery(data.qrcodeId)
          })
        })
      },
      startQuery(id) {
        var _this = this
        setTimeout(function() {
          api.seller.checkBind(id).then(data => {
            if (data) {
              _this.getSellerInfo()
              _this.step++
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
          console.log(data)
          this.seller.wxname = data.baseInfo.name
          this.seller.headImg = data.baseInfo.headimgurl
        })
      },
      validate() {
        var error = {'name': '请输入销售人员姓名', 'phone': '请输入销售人员手机号码', 'phoneNumber': '请输入正确的手机号码'}
        if (!this.seller.name) {
          helper.showError(error.name)
          return false
        } else if (!this.seller.phone) {
          helper.showError(error.phone)
          return false
        } else if (!this.seller.phone.match(/1[345789]\d{9}$/)) {
          helper.showError(error.phoneNumber)
          return false
        }
        return true
      },
      addMore() {
        this.seller.name = ''
        this.seller.phone = ''
        this.step = 0
      }
    }
  }

</script>

<style scoped lang="scss">
.qrcode {
  text-align: center;
  p{
    margin: 20px;
    font-size: 18px;
  }
}
.wx-img{
  width: 150px;
}
.complete{
  display:flex;
  align-items:center;
  justify-content:center;
  margin-bottom: 40px;
  img{
    margin: 0 20px;
  }
  span{
    margin: 0 20px;
  }
}
.button-wrap{
  text-align: center;
}
</style>
