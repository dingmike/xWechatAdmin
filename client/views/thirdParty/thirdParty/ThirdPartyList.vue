<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>机构名称</th>
                <th>机构地址</th>
                <th>创建时间</th>
                <th>管理员姓名</th>
                <th>管理员手机</th>
                <th>绑定微信</th>
                <th>机构简介</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in list">
                <td>{{ item.id }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.location }}</td>
                <td>{{ item.updated_at }}</td>
                <td>{{ item.manager }}</td>
                <td>{{ item.telephone }}</td>
                <td>
                  <span><img :src="item.headimgurl" />{{item.wxName}}</span>
                </td>
                <td>{{ item.description }}</td>
              </tr>
            </tbody>
          </table>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'lanmaLib/common/api'
export default{
  components: {
  },
  directives: {
  },
  data () {
    return {
      list: []
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
    getList () {
      var params = {
        offset: 0,
        length: 0
      }
      api.superAdmin.getThirdPartyList(params)
        .then((data) => {
          this.list = data.list
        })
    }
  },
  watch: {
  }
}
</script>

<style scoped lang="scss">
</style>