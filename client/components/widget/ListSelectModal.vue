<template>
    <card-modal :visible="modal.visible" @close="modal.visible=false" @cancel="modal.visible=false" @ok="ok"
      :title="modal.title" :okText="modal.okText" :cancelText="modal.cancelText" :showErrorMsg="showError" transition="zoom">
      <div class="tile is-ancestor" v-if="searchApi">
        <div class="tile is-parent">
          <article class="tile is-child box">
            <div class="columns">
              <div class="column">
                <p class="control has-addons">
                  <input class="input" type="text" v-model="searchKeyWord" placeholder="关键字" @change="search">
                  <a class="button is-info" @click="search()">搜索</a>
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
                  <th v-for="item in modal.text">{{ item }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in list" @click="selectedItem = item" :class="[selectedItem[localActiveKw] === item[localActiveKw] ? 'active' : '', 'item']">
                  <td v-for="it in modal.kw">{{ item[it] }}</td>
                </tr>
              </tbody>
            </table>
            <pagination :index="page" :count="pageCount" :loading="loading" @change="pages(arguments[0])"></pagination>
          </article>
        </div>
      </div>
    </card-modal>
</template>

<script>
import CardModal from '../../components/widget/CardModal.vue'
import Pagination from 'components/Pagination'

export default {
  props: {
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
      activeKw: {
        type: String,
        default: 'id'
      },
      text: { // 列表的表头文本数组
        type: Array
      },
      kw: {  // 列表的字段关键字
        type: Array
      },
      apiFunc: {
        type: Function
      },
      params: {
        type: Object,
        default: {}
      },
      isInSearch: {
        type: Boolean,
        default: false
      }
    },
    searchApi: ''
  },
  data () {
    return {
      page: 0,
      pageCount: 0,
      searchKeyWord: '',
      selectedItem: '',
      showError: false,
      loading: false,
      list: []
    }
  },
  watch: {
    modal: {
      deep: true,
      handler: function(val, oldVal) {
        this.getList()
      }
    },
    searchKeyWord: function() {
      this.search()
    }
  },
  computed: {
    localActiveKw() {
      return this.modal.activeKw || 'id'
    }
  },
  components: {
    CardModal,
    Pagination
  },
  created () {
    this.getList()
  },
  methods: {
    ok() {
      if (this.selectedItem) {
        this.$emit('select', this.selectedItem)
        this.modal.visible = false
      } else {
        this.showError = true
      }
    },
    pages (page) {
      this.getList(page)
    },
    getList (page = 1) {
      var params = this.modal.params || {}
      params.search = this.searchKeyWord
      params.offset = (page - 1) * 20
      params.length = 20
      this.loading = true
      this.modal.apiFunc(params).then((data) => {
        this.loading = false
        this.list = data.list
        this.page = page
        this.pageCount = Math.ceil(data.total / 20)
      })
    },
    search () {
      if (this.searchKeyWord) {
        this.searchApi(this.searchKeyWord).then(data => {
          if (data.list) {
            this.list = data.list
          } else {
            this.list = data
          }
          this.page = 1
          this.pageCount = 0
        })
      } else {
        this.modal.params.title = ''
        this.getList(1)
      }
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
