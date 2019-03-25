<template>
  <div class="editor-box">
    <Quill :options="option" @textchange="update" ref="myEditor">
      <div v-html="localValue"></div>
    </Quill>
  </div>
</template>

<script>
import Quill from '../../components/Quill.vue'

export default {
  props: {
    value: ''
  },
  components: {
    Quill
  },
  created () {},
  data () {
    return {
      isInit: false,
      localValue: this.value,
      option: {
        theme: 'snow',
        modules: {
          toolbar: [
            // [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike', 'image', 'link'],
            // ['blockquote', 'code-block'],
            // [{ 'header': 1 }, { 'header': 2 }],
            // [{'list': 'ordered'}, { 'list': 'bullet' }],
            // [{'indent': '-1'}, { 'indent': '+1' }],
            // [{ 'direction': 'rtl' }],
            [{ 'color': [] }, { 'background': [] }],
            // [{ 'font': [] }],
            [{ 'align': [] }]
            // [{'script': 'sub'}, { 'script': 'super' }],
          ]
        }
      }
    }
  },
  methods: {
    update() {
      var html = this.$refs.myEditor.$el.querySelector('.ql-editor').innerHTML
      this.$emit('input', html)
    }
  },
  watch: {
    value () {
      if (!this.value && this.value !== 0) {
        this.value = ''
      }
      if (!this.isInit) {
        if (!(this.value && this.value.length === 8 && this.value.match(new RegExp('<p>[a-z]</p>')))) {
          this.$refs.myEditor.$el.querySelector('.ql-editor').innerHTML = this.value
        }
        this.isInit = true
      }
    }
  }
}
</script>

<style lang="styl">
@import "~quill/assets/snow"

.editor-box {
  width: 542px;
  padding-bottom: 60px;
}
.ql-editor{
  max-height: 500px;
}
</style>
