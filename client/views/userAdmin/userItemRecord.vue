<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <div class="columns">
            <div class="column">
              <p class="control has-addons">
                <datepicker placeholder="请选择起始时间" @focus.native="unfocus" v-model="start_time" :config="{ locale: l10n, time_24hr: true, dateFormat: 'Y-m-d', defaultDate: defaultStartDay  }"></datepicker>
                &nbsp;&nbsp;_____&nbsp;&nbsp; <datepicker placeholder="请选择结束时间" @focus.native="unfocus" v-model="end_time" :config="{ locale: l10n, time_24hr: true, dateFormat: 'Y-m-d', defaultDate: defaultEndDay }"></datepicker>
                &nbsp;&nbsp;<a class="button is-info" @click="search">搜索</a>
                <span id="hf" @click="modal.visible = true">导出excel文档></span>
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
    
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <table class="table" id="tab">
            <thead>
              <tr>
                <th>用户微信</th>
                <th>姓名</th>
                <th>手机</th>
                <th>商品名称</th>
                <th>商品ID</th>
                <th>售价</th>
                <th>订单编号</th>
                <th>消费时间</th>
                <th>支付方式</th>
                <th>是否促销</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in list">
                <td>{{ item.wxName }}</td>
                <td>{{ item.parentName }}</td>
                <td>{{item.telephone}}</td>
                <td>{{item.goodsName}}</td>
                <td>{{item.goodsId}}</td>
                <td>{{item.price}}</td>
                <td>{{item.orderId}}</td>
                <td>{{item.created_at}}</td>
                <td>{{payTypeMap[item.payType]}}</td>
                <td>{{isDiscountMap[item.isDiscount]}}</td>
              </tr>
            </tbody>
          </table>
        </article>
      </div>
    </div>
    <card-modal :visible="modal.visible" @cancel="close" @close="close" @ok="_export" :title="modal.title"  transition="zoom">
      {{ modal.message }}
    </card-modal>
    <card-modal :visible="modal_time.visible" @cancel="modal_time.visible=false" @close="modal_time.visible=false" @ok="search_longtime" :title="modal_time.title"  transition="zoom">
      {{ modal_time.message }}
    </card-modal>
  </div>
</template>

<script>
/* eslint-disable */
import Datepicker from 'vue-bulma-datepicker'
import Pagination from 'components/Pagination'
import CardModal from '../../components/widget/CardModal.vue'
import api from 'lanmaLib/common/api'
import X from 'xlsx'
require('script-loader!file-saver')
export default{
  components: {
    Datepicker,
    Pagination,
    CardModal
  },
  directives: {
  },
  data () {
    return {
      userId: 0,
      page: 0,
      pageCount: 0,
      loading: false,
      start_time: '',
      end_time: '',
      list: [],
      exportData: [],
      modal: {
        visible: false,
        title: '导出确认',
        message: '是否确认导出Excel表格'
      },
      modal_time: {
        visible: false,
        title: '查询确认',
        message: '当前时间跨度选择过大，查询可能需要较长时间，是否确认查询! '
      },
      channelList: [],
      channelHash: {},
      payTypeMap: ['', '渠道赠送', '微信支付', '余额支付'],
      statusMap: ['全部状态', '未付款', '已付款', '已取消', '超时'],
      isDiscountMap: ['否', '是']
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
    },
    defaultStartDay () {
      var t = new Date((new Date() - 3600000 * 24 * 30))
      return t.toJSON().split('T')[0]
    },
    defaultEndDay () {
      var t = new Date()
      return t.toJSON().split('T')[0]
    }
  },
  created () {
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    this.userId = id
    this.getChannelList()
  },
  mounted () {
  },
  methods: {
    search () {
//    this.getRecordList(this.page)
      var sDate = new Date(this.start_time).getTime()
      var eDate = new Date(this.end_time).getTime()
      if ((eDate - sDate) > 60 * 24 * 60 * 60 * 1000) {
        this.modal_time.visible = true
        return
      }
      var params = {
        'startTime': this.start_time + ' 00:00:00',
        'endTime': this.end_time + ' 23:59:59',
        'userId': this.userId
      }
      this.getUserList(params)
    },
    search_longtime () {
      this.modal_time.visible = false
      var params = {
        'startTime': this.start_time + ' 00:00:00',
        'endTime': this.end_time + ' 23:59:59',
        'userId': this.userId
      }
      this.getUserList(params)
    },
    goto (url) {
      this.$router.push(url)
    },
    getExportData () {
      var temp = []
      var tHead = ['用户微信', '姓名', '手机', '商品名称', '商品ID', '售价', '订单编号', '消费时间', '支付方式', '是否促销']
      temp.push(tHead)
      for (var i = 0; i < this.list.length; i++) {
        var temp1 = [] 
        temp1.push(this.list[i].wxName)
        temp1.push(this.list[i].parentName)
        temp1.push(this.list[i].telephone)
        temp1.push(this.list[i].goodsName)
        temp1.push(this.list[i].goodsId)
        temp1.push(this.list[i].price)
        temp1.push(this.list[i].orderId)
        temp1.push(this.list[i].created_at)
        temp1.push(this.payTypeMap[this.list[i].payType])
        temp1.push(this.isDiscountMap[this.list[i].goodsInfo.isDiscount])
        temp.push(temp1)
      }
      this.exportData = temp
    },
    _export(evt) {
      /* convert state to workbook */
      this.getExportData()
      this.close()
      const ws = X.utils.aoa_to_sheet(this.exportData)
      const wb = X.utils.book_new()
      X.utils.book_append_sheet(wb, ws, 'SheetJS')
      /* generate X file */
      const wbout = X.write(wb, {type: 'binary', bookType: 'xlsx'})
      /* send to client */
      var d = new Date()
      var time = d.getFullYear() + "-" +(d.getMonth() + 1) + "-" + d.getDate()
      saveAs(new Blob([this.s2ab(wbout)], {type: 'application/octet-stream'}), '用户消费记录' + time + '.xlsx')
    },
    s2ab (s) {
      const buf = new ArrayBuffer(s.length)
      const view = new Uint8Array(buf)
      for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
      return buf
    },
    close () {
      this.modal.visible = false
    },
    getUserList (params) {
      api.userAdmin.getUserPaidOrderList(params)
        .then((data) => {
          var _this = this
          data.list.map(item => {
            item.channel_label = _this.channelHash[item.channelId]
            return item
          })
          this.list = data.list
        })
    },
    getChannelList () {
      api.channel.getSellList()
        .then((data) => {
          var _this = this
          this.channelList = data.list.map(item => {
            return _.pick(item, ['user_id', 'name', 'description'])
          })
          var temp = {}
          for (var i = 0; i < this.channelList.length; i++) {
            temp[this.channelList[i].user_id] = this.channelList[i].name
          }
          this.channelHash = temp
          var params = {
            'startTime': this.defaultStartDay + ' 00:00:00',
            'endTime': this.defaultEndDay + ' 23:59:59',
            'userId': this.userId
          }
          this.getUserList(params)
        })
    },
    unfocus(e) {
      e.target.blur()
    }
  }
}
</script>

<style scoped lang="scss">
.channel-select{
  margin: 0 10px;
}
#hf{
  display: inline-block;
  line-height: 32px;
  color: #00d1b2;
  cursor:pointer;
  text-decoration: underline;
  float: right;
  position: absolute;
  right: 0;
}
#hf:hover{
  color:#4c4c4c
}
.modal-item:hover {
  background-color: #ddd;
}

.isActive {
  background-color: #00d1b2;
}
.channelSelect{
  display: inline-block;
  margin: 0px 20px;
  line-height: 32px;
}
.wxAndNameAndTel{
  margin-left: 50px;
}
</style>