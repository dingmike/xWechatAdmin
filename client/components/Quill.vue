<template>
  <div class="quill-editor">
    <slot></slot>
  </div>
</template>

<script>
import Quill from 'quill'
import Delta from 'quill-delta'
import FormData from 'form-data'
import api from 'lanmaLib/common/api'

export default {

  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    autofocus: Boolean
  },

  data () {
    return {
      focused: this.autofocus,
      editor: null,
      input: ''
    }
  },

  mounted () {
    var _this = this
    this.editor = new Quill(this.$el, this.options)
    this.editor.on('text-change', function(delta, oldDelta, source) {
      _this.$emit('textchange')
    })
    var toolbar = this.editor.getModule('toolbar')
    toolbar.addHandler('image', function() {
      _this.input = document.createElement('input')
      _this.input.type = 'file'
      _this.input.addEventListener('change', function() {
        var target = _this.input
        var data = new FormData()
        data.append('file', target.files[0])
        api.photo.upload(data).then((data) => {
          // _this.editor.insertEmbed(10, 'image', data.url)
          var range = _this.editor.getSelection(true)
          _this.editor.updateContents(new Delta().retain(range.index).delete(range.length).insert({image: data.url}, {width: '100%'}))
          target.value = ''
        })
      }, false)
      _this.input.click()
    })
  },

  watch: {
    focused (val) {
      this.editor[val ? 'focus' : 'blur']()
    }
  }

}
</script>

<style lang="styl">
@import '~quill/assets/core'
</style>
