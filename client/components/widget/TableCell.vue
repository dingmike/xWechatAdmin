<template>
  <table class="table">
    <thead>
      <tr>
        <th v-for="item in thList">{{ item }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in dataList">
        <td v-for="it in tdList">
          <template v-if="typeof it == 'string'">{{ item[it] }}</template>
          <template v-if="typeof it != 'object'">
            <template v-for="i in it">
              <router-link v-if="i.type=='link'" :to="i.data">{{ i.text }}</router-link>
              <a v-if="i.type=='click'" href="#" @click.prevent="i.action">{{ i.text }}</a>
            </template>
          </template>
        </td>
      </tr>
    </tbody>
  </table>
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
      text: { // 列表的表头文本数组
        type: Array
      },
      kw: {  // 列表的字段关键字
        type: Array
      },
      apiFunc: {
        type: Function
      }
    }
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
  computed: {},
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
      var params = {}
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
