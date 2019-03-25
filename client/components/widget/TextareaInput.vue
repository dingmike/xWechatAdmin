<template>
  <div class="control is-horizontal">
    <div class="control-label">
      <label class="label"><i v-if="isRequired" class="isRequired" >*</i> {{ title }}</label>
    </div>
    <div class="control">
      <div class="control">
        <textarea class="textarea" :value="value" @input="updateValue($event.target.value)" type="text" :placeholder="localPlaceholder" :disabled="isDisabled"></textarea>
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
    value: '',
    placeholder: {
      type: String,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isRequired: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  computed: {
    localPlaceholder () {
      return this.placeholder ? this.placeholder : this.title
    }
  },
  components: {},
  methods: {
    updateValue(val) {
      this.$emit('input', val)
    }
  }
}
</script>
<style scoped>
  .isRequired{
    display: inline-block;
    color: red;
  }
</style>
