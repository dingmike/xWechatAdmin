<template>
  <div class="label-select">
    <select v-for="(_list, idx) in labelList" :disabled="isDisabled" v-model="labelSelectValue[idx]" @change="change(idx)">
      <option value="0">请选择</option>
      <option :value="label.id" v-for="label in _list">{{label.title}}</option>
    </select>
  </div>
</template>
<script>
export default {
  components: {
  },

  props: {
    root: 0,
    value: 0,
    selectCallback: {
      type: Function
    },
    selectIndex: {
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      label: {},
      labelList: [],
      dataLoaded: false,
      labelSelectValue: [0]
    }
  },

  created () {
    this.$label.getLabelList().then((labelList) => {
      this.dataLoaded = true
      if (this.root === 0) {
        this.labelList.push(this.$label.getRootLabelTree())
      } else {
        this.label = this.$label.getLabel(this.root)
        this.pushLabel(this.label.childs)
      }
      this.initValue(this.value)
    })
  },

  watch: {
    value (value, oldVal) {
      // console.log('watch value')
      // console.log(value)
      // console.log(oldVal)
      if (value !== this.labelSelectValue[this.labelSelectValue.length - 1]) {
        if (this.dataLoaded) {
          this.initValue(value)
        }
      }
    }
  },

  methods: {
    pushLabel (_list) {
      var labelList = this.labelList.concat([])
      labelList.push(_list)
      this.labelList = labelList
      // console.log(this.labelList)
      var labelSelectValue = this.labelSelectValue.concat([])
      labelSelectValue.push(0)
      this.labelSelectValue = labelSelectValue
    },
    initValue (value) {
      console.log('initValue')

      console.log(value)
      if (!value) {
        return
      }
      var labelSelectValue = []
      var label = this.$label.getLabel(value)

      console.log(label)
      while (label.id !== this.root) {
        labelSelectValue.unshift(label.id)
        if (label.parent_id === 0) {
          break
        }
        label = this.$label.getLabel(label.parent_id)
      }
      console.log(labelSelectValue)

      var labelList = this.labelList.concat([])
      labelSelectValue.forEach((id) => {
        var _label = this.$label.getLabel(id)
        console.log(_label)
        if (_label.childs.length > 0) {
          labelList.push(_label.childs)
        }
      })
      labelSelectValue.push(0)
      this.labelSelectValue = labelSelectValue
      this.labelList = labelList
      console.log(labelList)
    },
    change (idx) {
      var id = this.labelSelectValue[idx]
      console.log('change:' + id)
      var label = this.$label.getLabel(id)
      this.labelList = this.labelList.splice(0, idx + 1)
      this.labelSelectValue = this.labelSelectValue.splice(0, idx + 1)
      // console.log(label)
      if (label.hasOwnProperty('childs') && label.childs.length > 0) {
        this.pushLabel(label.childs)
      }
      if (this.selectIndex !== '') {
        this.selectCallback(this.selectIndex, this.labelSelectValue)
      } else {
        this.selectCallback(label.id ? label.id : 0)
      }
    }
  }
}
</script>
<style scoped>
.label-select select{
  margin:auto 10px;
  height:28px;
  margin-left: 0;
}
</style>
