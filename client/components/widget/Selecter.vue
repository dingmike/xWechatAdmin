<template>
  <div class="control is-horizontal">
    <div class="control-label">
      <label class="label">{{ title }}</label>
    </div>
    <div class="control">
      <div class="control">
        <select class="select" :value="value" @input="updateValue($event.target.value)" :disabled="isDisabled">
          <option :value="item.value" v-for="item in objList">{{ item.text }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    objList: {
      type: Array,
      default: []
    },
    value: '',
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  computed: {},
  components: {},
  methods: {
    updateValue(val) {
      this.$emit('input', val)
    }
  }
}
</script>
<style scoped>
</style>
