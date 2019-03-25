<template>
  <div class="control is-horizontal">
    <div class="control-label">
      <label class="label"><i class="isRequired" v-if="isRequired">*</i> {{ title }}</label>
    </div>
    <div class="control">
      <div class="control">
        <input class="input" :value="value" @input="updateValue($event.target.value)" @blur="$emit('blur')" type="text" :placeholder="localPlaceholder" :style="{width:inputWidth}" :disabled="isDisabled">
        <slot></slot>
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
    inputWidth: {
      type: String,
      default: '168px'
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
