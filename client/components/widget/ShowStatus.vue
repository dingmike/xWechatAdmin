<template>
  <th class="status-wrap">
    <span class="status-text" @click="clicktext">{{ statusText }}▼</span>
    <div class="status" v-if="showStatus">
      <p v-for="(item, index) in statusList" @click="select(item.value)" :class="[value == item.value ? 'selected':'']">{{ item.text }}</p>
    </div>
  </th>
</template>

<script>
export default {
  props: {
    value: '',
    statusText: {
      type: String,
      default: ''
    },
    statusList: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      showStatus: false
    }
  },
  computed: {
    localPlaceholder () {
      return this.placeholder ? this.placeholder : this.title
    }
  },
  components: {},
  methods: {
    select(val) {
      this.$emit('input', val)
      this.showStatus = false
    },
    clicktext() {
      this.showStatus = !this.showStatus
    },
    leave() {
      if (this.showStatus) {
        this.showStatus = false
      }
    }
  }
}
</script>
<style scoped lang="scss">

.status-wrap {
  position: relative;
}

.status {
  position: absolute;
  left: -5px;
  top: 37px;
  background-color: #fff;
  border: 1px solid #ddd;
  p{
    padding: 10px;
    text-align: center;
    cursor: pointer;
  }
  p:hover{
    color: #00d1b2;
  }
}

.selected {
  color: #00d1b2;
}

.status-text {
  cursor: pointer;
}
.status-text:hover {
  color: #00d1b2;
}
</style>
