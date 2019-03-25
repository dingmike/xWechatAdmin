<template>
<div>
  <div class="tile is-ancestor">
    <div class="tile is-parent">
      <article class="tile is-child box">
        <div class="contentTop">
          <button class="button is-primary" :class="{'disabled': list.length >= 7}" @click="addAd('/autoresp/addAd')">添加广告</button>
          <span>最多可设置7条广告</span>
        </div>
      </article>
    </div>
  </div>

  <div class="tile is-ancestor">
    <div class="tile is-parent">
      <article class="tile is-child box">
        <table class="table">
          <thead>
          <tr>
            <th>排序</th>
            <th>广告</th>
            <th>上架时间</th>
            <th>下架时间</th>
            <th>状态</th>
            <th>展现次数</th>
            <th>点击次数</th>
            <th>点击人数</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item,index in list">
            <td>{{index + 1}}</td>
            <td>
              <div class="imgBox">
                <img :src="item.cover" @click="showBigImg(item.cover)" />
                <span>{{item.title}}</span>
              </div>
            </td>
            <td>{{editTimeList(item.startTime)}}</td>
            <td>{{editTimeList(item.endTime)}}</td>
            <td>{{countStatus(item.startTime, item.endTime)}}</td>
            <td>{{item.showCount}}</td>
            <td>{{item.pv}}</td>
            <td>{{item.uv}}</td>
            <td style="display: flex;align-items: center">
              <router-link :to="'/autoresp/editAd/' + item.id">编辑</router-link>&nbsp;&nbsp;
              <a href="#" @click.prevent="remove(item.id)">删除</a>&nbsp;&nbsp;
              <div class="updown">
                <span @click="contentMove('up',index)">▲</span>
                <span @click="contentMove('down',index)">▼</span>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </article>
    </div>
  </div>
  <card-modal :visible="modal.visible" @cancel="modal.visible = false" @close="modal.visible = false" @ok="confirm" :title="modal.title"  transition="zoom">
    {{ modal.message }}
  </card-modal>
</div>
</template>

<script>
import CardModal from '../../components/widget/CardModal.vue'
import api from 'lanmaLib/common/api'
import timeModel from 'lanmaLib/time'
import helper from '../../helper'
import _ from 'lodash'
export default{
  components: {
    CardModal
  },
  directives: {
  },
  data () {
    return {
      list: [],
      removeId: 0,
      modal: {
        visible: false,
        title: '删除确认',
        message: '删除数据后将不能恢复，确定删除吗？'
      }
    }
  },
  computed: {
  },
  created () {
    this.getList()
  },
  mounted () {
  },
  methods: {
    getList() {
      api.autoresp.getGoodsAdList()
        .then((data) => {
          this.list = data
        })
    },
    addAd(url) {
      if (this.list.length >= 7) {
        return
      }
      this.$router.push(url)
    },
    goto(url) {
      this.$router.push(url)
    },
    remove (id) {
      this.modal.visible = true
      this.removeId = id
    },
    contentMove (type, index) {
      var params = {}
      switch (type) {
        case 'up':
          if (index === 0) {
            return
          }
          params.id1 = this.list[index].id
          params.id2 = this.list[index - 1].id
          break
        case 'down':
          if (index === this.list.length - 1) {
            return
          }
          params.id1 = this.list[index].id
          params.id2 = this.list[index + 1].id
          break
        default:
          break
      }
      api.autoresp.changeDisplayOrder(params)
        .then(() => {
          if (type === 'up') {
            let temp = this.list[index - 1]
            this.list.splice(index - 1, 1, this.list[index])
            this.list.splice(index, 1, temp)
          } else {
            let temp = this.list[index + 1]
            this.list.splice(index + 1, 1, this.list[index])
            this.list.splice(index, 1, temp)
          }
        })
    },
    showBigImg (url) {
      url && helper.showBigImg(url)
    },
    close () {
      this.modal.visible = false
      this.removeId = 0
    },
    confirm () {
      if (this.removeId) {
        api.autoresp.deleteGoodsAd(this.removeId).then(() => {
          _.remove(this.list, (item) => {
            return item.id === this.removeId
          })
          this.close()
          helper.showSuccess('删除成功')
        })
          .catch((e) => {
            this.close()
            helper.showError('删除失败，其他异常')
          })
      }
    },
    countStatus (sTime, eTime) {
      var nowD = new Date()
      var sD = new Date(sTime)
      var eD = new Date(eTime)
      if (nowD.getTime() < sD.getTime()) {
        return '未展示'
      } else if (nowD.getTime() > sD.getTime() && nowD.getTime() < eD.getTime()) {
        return '展示中'
      } else {
        return '已过期'
      }
    },
    editTimeList: timeModel.editTimeList
  },
  watch: {
  }
}
</script>

<style scoped lang="scss">
  .imgBox{
    display: flex;
    align-items: center;
    img{
      width:80px;
      height:30px;
      margin-right: 10px;
    }
    span{
    }
  }
  td{
    vertical-align: middle;
  }
  .contentTop{
    display: flex;
    align-items: center;
    .disabled{
      background: #999;
      cursor: not-allowed;
    }
    span{
      display: inline-block;
      margin-left: 10px;
    }
  }
  .updown {
    display: inline-block;
    width: 30px;
    z-index: 1500;
    cursor: pointer;
    span{
      text-align: center;
      color: #666;
      display: block;
      &:hover{
        color: #333;
      }
    }
  }
</style>
