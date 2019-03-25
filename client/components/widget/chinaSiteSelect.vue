<template>
  <div class="china-site-select">
    <select class="select" v-model="province" @change="siteChangePro">
      <option :value="0">省份</option>
      <option :value="item.name" v-for="item in chinaSite">{{item.name}}</option>
    </select>
    <select class="select" v-model="city" @change="siteChangeCity">
      <option :value="0">城市</option>
      <option :value="item.name" v-for="item in chinaSiteCity">{{item.name}}</option>
    </select>
    <select class="select" v-model="district" @change="siteChange">
      <option :value="0">区域</option>
      <option :value="item" v-for="item in chinaSiteDistrict">{{item}}</option>
    </select>
  </div>
</template>

<script>
import config from 'lanmaLib/config'
export default{
  components: {
  },
  directives: {
  },
  data () {
    return {
      config,
      chinaSite: config.chinaSite.chinaSite,
      province: 0,
      city: 0,
      district: 0,
      flag: true,
      flag2: true
    }
  },
  props: {
    siteDefault: {
      type: [String, Number]
    },
    selectCallback: {
      type: Function
    }
  },
  computed: {
    chinaSiteCity () {
      if (this.province === 0) {
        return []
      }
      for (var i = 0; i < this.chinaSite.length; i++) {
        if (this.chinaSite[i].name === this.province) {
          return this.chinaSite[i].city
        }
      }
    },
    chinaSiteDistrict () {
      if (this.city === 0) {
        return []
      }
      for (var i = 0; i < this.chinaSiteCity.length; i++) {
        if (this.chinaSiteCity[i].name === this.city) {
          return this.chinaSiteCity[i].area
        }
      }
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    siteChange () {
      if (parseInt(this.district) === 0) {
        return
      } else {
        var site = this.province + '-' + this.city + '-' + this.district
        this.selectCallback(site)
      }
    },
    siteChangePro () {
    },
    siteChangeCity () {
    }
  },
  watch: {
    province: function (newV, oldV) {
      if (oldV && newV !== oldV && this.flag) {
        this.city = 0
        this.district = 0
      }
      this.flag = true
    },
    city: function (newV, oldV) {
      if (oldV && newV !== oldV && this.flag2) {
        this.district = 0
      }
      this.flag2 = true
    },
    district: function (newV, oldV) {
      if (newV === 0) {
        this.selectCallback('')
      }
    },
    siteDefault (val) {
      if (val === 0) {
        this.province = 0
        this.city = 0
        this.district = 0
        return
      }
      if (val) {
        this.flag = false
        this.flag2 = false
        var site = val.split('-')
        this.province = site[0] ? site[0] : 0
        this.city = site[1] ? site[1] : 0
        this.district = site[2] ? site[2] : 0
        if (site.length === 3) {
          this.selectCallback(val)
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>