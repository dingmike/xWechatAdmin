<template>
  <div class="control is-horizontal">
    <div class="control-label">
      <label class="label"><i class="isRequired">*</i> {{ title }}</label>
    </div>
    <div class="control">
      <div class="control">
        <template v-for="item in list">
          <label class="radio radio_box">
            <input :value="item.value" type="radio" :disabled="isDisabled" v-model="radioValue" />
            {{item.label}}
          </label>
        </template>
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
    list: {
      type: Array,
      default: []
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
    return {
      radioValue: ''
    }
  },
  created () {
  },
  watch: {
    radioValue: function (val) {
      this.$emit('input', val)
    },
    value: function (val) {
      this.radioValue = val
    }
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
  .radio_box{
    line-height:32px;
  }
  .isRequired{
    color: red;
  }
</style>
