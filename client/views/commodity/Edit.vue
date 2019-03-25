<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-ancestor">
        <div class="tile is-parent cl-form">
          <article class="tile is-child box">
            <tabs type="boxed">
              <tab-pane label="基本信息">
                <div class="block">
                  <Selecter :title="'课程类型'" :objList="courseTypeList" v-model="commodity.goodsType" @input="changeGoodsType" :isDisabled="commodity.id>0"></Selecter>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">对应课程</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <span class="select-item" v-if="'id' in commodity.course">{{ commodity.course.id + " " + (commodity.course.title || commodity.course.name) }}</span>
                        <a class="select-item" @click="courseModal.visible=true" v-if="commodity.id==0">{{ 'id' in commodity.course ? '重新选择' : '选择课程' }}</a>
                      </div>
                    </div>
                  </div>
                  <SingleInput :title="'商品名称'" v-model="commodity.name"></SingleInput>
                  <!--<SingleInput :title="'商品编号'" v-model="commodity.number" @blur="checkNumber"></SingleInput>-->
                  <SingleInput :title="'可售数量'" v-model.number="commodity.stock" :isDisabled="true"></SingleInput>
                  <!--<SingleInput :title="'开课时间'" v-model.number="commodity.course.lesson_time" :isDisabled="true"></SingleInput>-->
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">开课时间</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <datepicker placeholder="开始时间" :disabled="true" @focus.native="unfocus" v-model="commodity.course.lesson_time" :config="{ locale: l10n, enableTime: true, time_24hr: true, dateFormat: 'Y-m-d H:i:S' }"></datepicker>
                      </div>
                      <template v-if="commodity.course.labelScene == 64">
                        <span class="timeMid">——</span>
                        <div class="control">
                          <datepicker placeholder="结束时间" :disabled="true" @focus.native="unfocus" v-model="commodity.course.lesson_time_end" :config="{ locale: l10n, enableTime: true, time_24hr: true, dateFormat: 'Y-m-d H:i:S' }"></datepicker>
                        </div>
                      </template>
                    </div>
                  </div>
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label">下架时间</label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <p class="control">
                          <datepicker placeholder="请选择下架时间" v-model="commodity.stopSellTime"  @focus.native="unfocus" :config="{  locale: l10n, enableTime: true, time_24hr: true, dateFormat: 'Y-m-d H:i:S' }"></datepicker>
                        </p>
                      </div>
                    </div>
                  </div>
                  <!--<SingleInput :title="'原价（元）'" v-model.number="commodity.originalPrice" :placeholder="'原价'"></SingleInput>-->
                  <div class="control is-horizontal">
                    <div class="control-label">
                      <label class="label"><i>原价（元）</i></label>
                    </div>
                    <div class="control">
                      <div class="control">
                        <input class="input" v-model="commodity.originalPrice" type="text" placeholder="原价">
                      </div>
                    </div>
                  </div>
                  <SingleInput :title="'售价（元）'" v-model.number="commodity.price" :placeholder="'售价'"></SingleInput>
                  <Selecter :title="'是否促销'" :objList="isDiscountList" v-model="commodity.isDiscount"></Selecter>
                  <!--<SingleInput v-if="commodity.price=='0'" :title="'底部提示文字'" v-model.number="commodity.priceText" :placeholder="'提示文字'"></SingleInput>-->
                  <Selecter :title="'商品状态'" :objList="statusList" v-model="commodity.status"></Selecter>
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

    <ListSelectModal :modal="courseModal" @select="addSuccess" :searchApi="searchApi"></ListSelectModal>

  </div>
</template>

<script>
  import { Tabs, TabPane } from 'vue-bulma-tabs'
  import Datepicker from 'vue-bulma-datepicker'
  import ListSelectModal from '../../components/widget/ListSelectModal.vue'
  import SingleInput from '../../components/widget/SingleInput.vue'
  import Selecter from '../../components/widget/Selecter.vue'

  import api from 'lanmaLib/common/api'
  import helper from '../../helper'

  export default {
    data() {
      return {
        title: '添加商品',
        isNumberExit: false,
        courseTypeList: [
          {'value': 1, 'text': '体验坊'},
          {'value': 3, 'text': '游学营'},
          {'value': 2, 'text': '课程组合'}
        ],
        statusList: [
          {'value': 0, 'text': '请选择'},
          {'value': 1, 'text': '未上架'},
          {'value': 2, 'text': '在售'},
          {'value': 3, 'text': '售罄'},
          {'value': 4, 'text': '过期'}
        ],
        isDiscountList: [
          {'value': 0, 'text': '否'},
          {'value': 1, 'text': '是'}
        ],
        commodity: {
          id: '',
          name: '',
          goodsType: '1',
          stock: '',
          price: '',
          stopSellTime: '',
          originalPrice: '',
          peopleNumber: '',
          course: {},
          status: 0,
          isDiscount: 0
        },
        courseModal: {
          visible: false,
          okText: '确定',
          cancelText: '取消',
          title: '选择课程',
          text: ['课程ID', '标题', '开课时间'],
          kw: ['id', 'title', 'lesson_time'],
          apiFunc: api.course.getList,
          params: {status: 7, title: '', materialType: 1}
        },
        searchApi: api.course.search
      }
    },
    computed: {
      l10n () {
        return {
          firstDayOfWeek: 1,
          weekdays: {
            shorthand: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            longhand: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
          },
          months: {
            shorthand: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            longhand: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
          }
        }
      }
    },
    created() {
      var id = parseInt(this.$route.params.id)
      if (isNaN(id) || id < 0) {
        id = 0
      }
      this.commodity.id = id
      var courseid = parseInt(this.$route.params.courseid)
      if (courseid) {
        api.course.find(courseid).then(course => {
          this.addSuccess(course)
        })
      }

      if (id) {
        this.title = '编辑商品'
        api.commodity.find(id).then((commodity) => {
          var courseInfoApi = commodity.goodsType === 2 ? api.combination.find : api.course.find
          this.commodity.goodsType = commodity.goodsType
          this.changeGoodsType()
          courseInfoApi(commodity.courseId).then(data => {
            commodity.course = data
            this.commodity = commodity
          })
        })
      }
    },
    components: {
      Tabs,
      TabPane,
      SingleInput,
      ListSelectModal,
      Selecter,
      Datepicker
    },
    methods: {
      submit() {
        var id = this.commodity.id
        if (!this.validate()) return
        this.commodity.courseId = this.commodity.course.id
        if (id) {
          delete this.commodity.course
          api.commodity.update(this.commodity).then((res) => {
            helper.showSuccess('编辑成功')
            this.$router.push('/commodity/list')
          }).catch((e) => {
            helper.showError(e.message)
          })
        } else {
          api.commodity.add(this.commodity).then((res) => {
            helper.showSuccess('添加成功')
            this.$router.push('/commodity/list')
          }).catch((e) => {
            helper.showError(e.message)
          })
        }
      },
      validate() {
        var error = {'name': '请输入商品名称', 'course': '请选择课程', 'price': '请输入售价', 'priceNumber': '售价必须大于0', 'originalPrice': '请输入原价', 'originalPriceNumber': '原价必须大于0', 'priceSetError': '原价不得小于售价', 'status': '请选择商品状态', 'numberExist': '商品编号已存在', 'time': '请选择下架时间', 'timeCompare': '下架时间必须早于上课时间'}
        if (!this.commodity.name) {
          helper.showError(error.name)
          return false
        } else if (!('id' in this.commodity.course)) {
          helper.showError(error.course)
          return false
        } else if (!this.commodity.stopSellTime) {
          helper.showError(error.time)
          return false
        } else if (isNaN(Number(this.commodity.originalPrice)) || this.commodity.originalPrice === '') {
          helper.showError(error.originalPrice)
          return false
        } else if (Number(this.commodity.originalPrice) === 0) {
          helper.showError(error.originalPriceNumber)
          return false
        } else if (isNaN(Number(this.commodity.price)) || this.commodity.price === '') {
          helper.showError(error.price)
          return false
        } else if (Number(this.commodity.price) === 0) {
          helper.showError(error.priceNumber)
          return false
        } else if (Number(this.commodity.price) > Number(this.commodity.originalPrice)) {
          helper.showError(error.priceSetError)
          return false
        } else if (!this.commodity.status) {
          helper.showError(error.status)
          return false
        } else if (this.isNumberExit) {
          helper.showError(error.numberExist)
          return false
        } else if (Date.parse(this.commodity.course.lesson_time) < (Date.parse(this.commodity.stopSellTime) - 7200000)) {
          helper.showError(error.timeCompare)
          return false
        }
        return true
      },
      cancel() {
        this.$router.push('/commodity/list')
      },
      addSuccess(item) {
        if (Date.parse(item.lesson_time) < Date.now()) {
          helper.showError('该课程已过期，请重新选择')
          return
        } else {
          if (this.commodity.goodsType === '2') {
            api.combination.find(item.id).then((combination) => {
              this.hasGoos(combination.courseList, item) // this.commodity.maxSalesCount
            })
          } else {
            this.hasGoos([item], item) // this.commodity.maxSalesCount
          }
        }
      },
      hasGoos (courseList, course) {
        var isHasGoods = courseList.some(item => {
          return item.courseExtra && ('goodsId' in item.courseExtra)
        })
        if (isHasGoods) {
          helper.showError((this.commodity.goodsType === '2' ? '有' : '') + '课程正在销售中，不能添加为商品同时销售')
          return
        }
        this.commodity.course = course
        this.commodity.goodsType = String(course.materialType) === '1' ? 1 : String(course.materialType) === '2' ? 3 : 2
        this.commodity.name = 'title' in course ? course.title : course.name
        this.commodity.number = 'number' in course ? course.number : course.id
        this.setMaxSalesCount(courseList)
      },
      setMaxSalesCount (course) {
        var totalList = course.map(item => {
          return Number(item.total)
        }).sort(function (a, b) {
          return a - b
        })
        this.commodity.stock = totalList[0]
      },
      changeGoodsType() {
        if (this.commodity.goodsType === '1') {
          this.courseModal.params = {
            status: 7,
            title: '',
            materialType: 1
          }
        } else if (this.commodity.goodsType === '2') {
          this.courseModal.params = {
            status: 7
          }
        } else if (this.commodity.goodsType === '3') {
          this.courseModal.params = {
            status: 7,
            title: '',
            materialType: 2
          }
        }
        this.courseModal.apiFunc = this.commodity.goodsType === '1' ? api.course.getList : this.commodity.goodsType === '2' ? api.combination.getList : api.course.getList
        this.courseModal.kw = this.commodity.goodsType === '1' ? ['id', 'title', 'lesson_time'] : this.commodity.goodsType === '2' ? ['id', 'name', 'lesson_time'] : ['id', 'title', 'lesson_time']
        this.searchApi = this.commodity.goodsType === '1' ? api.course.search : this.commodity.goodsType === '2' ? '' : api.course.searchTour
        this.commodity.course = {}
      },
      checkNumber() {
        api.commodity.checkCommodityNumber(this.commodity.number).then(res => {
          this.isNumberExit = res
        })
      },
      unfocus(e) {
        e.target.blur()
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

  .select-item {
    line-height: 32px;
  }
  .timeMid{
    height:32px;
    line-height: 32px;
    display:inline-block;
    margin: 0 5px;
    color: #ccc;
  }
</style>
