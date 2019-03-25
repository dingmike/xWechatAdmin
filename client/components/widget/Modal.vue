<template>
  <modal :visible="visible" @close="close">
    <div class="box">
      <article class="media">
        <div>
          <p>照片上传中，请不要刷新页面（第{{count}}/{{uploadSum}}张）</p>
        </div>
      </article>
    </div>
  </modal>
</template>

<script>
import { Modal } from 'vue-bulma-modal'

export default {
  components: {
    Modal
  },

  props: {
    visible: Boolean,
    count: {
      type: Number,
      default: 0
    },
    uploadSum: {
      type: Number,
      default: 0
    }
  },

  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>
