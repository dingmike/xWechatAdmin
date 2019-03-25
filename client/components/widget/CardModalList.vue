<template>
    <card-modal :visible="modal.visible" @close="modal.visible=false" @cancel="modal.visible=false" @ok="ok"
      :title="modal.title" :okText="modal.okText" :cancelText="modal.cancelText" transition="zoom">
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <article class="tile is-child box">
            <div class="columns">
              <div class="column">
                <p class="control has-addons">
                  <!--<input class="input" type="text" v-model="searchKW" @input="filter" placeholder="名称">-->
                  <span class="label">主题标签</span>
                  <label-select :root="1" :value="0" :selectCallback="themeCallback">
                  <a class="button is-info" @click="filter">筛选</a>
                </p>
              </div>
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
                  <th>ID</th>
                  <th>名称</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in modal.list" @click="originData = item" :class="[originData.id === item.id ? 'active' : '', 'item']">
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                </tr>
              </tbody>
            </table>
          </article>
        </div>
      </div>
    </card-modal>
</template>

<script>
import CardModal from '../../components/widget/CardModal.vue'
import LabelSelect from 'components/widget/LabelSelect'
import api from 'lanmaLib/common/api'

export default {
  props: {
    buffer: {
      type: Object,
      default: { 'id': '', 'name': '' }
    },
    modal: {
      title: {
        type: String
      },
      visible: {
        type: Boolean,
        default: false
      },
      okText: {
        type: String,
        default: '确定'
      },
      cancelText: {
        type: String,
        default: '取消'
      },
      errorMsg: {
        type: String,
        default: '必须选择一项内容'
      },
      list: {
        type: Array,
        default: []
      }
    }
  },
  data () {
    return {
      searchKW: '',
      originData: this.buffer,
      listCopy: [],
      labelId: 0
    }
  },
  components: {
    CardModal,
    LabelSelect
  },
  methods: {
    themeCallback(id) {
      this.labelId = id
      this.filter()
    },
    filter() {
      var params = {
        'sortType': '',
        'labels': [this.labelId],
        'offset': 0,
        'length': 0
      }
      api.reader.filterArticleList(params)
      .then((data) => {
        this.modal.list = data.list.map(function (item) {
          item.name = item.title
          return item
        })
      })
    },
    ok() {
      this.$emit('ok', this.originData)
      this.modal.visible = false
    }
  }
}
</script>
<style scoped>
  .item {
    cursor: pointer;
  }

  .active {
    background-color: #00d1b2;
  }

  .label{
    line-height: 30px;
  }
</style>
