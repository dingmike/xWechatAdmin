<template>
  <image-modal :visible="visible" @close="close" transition="zoom">
    <p class="image" style="width:100%;"><img :src="Url"></p>
  </image-modal>
</template>

<script>
import { ImageModal } from 'vue-bulma-modal'

export default {
  components: {
    ImageModal
  },

  props: {
    visible: Boolean,
    Url: String
  },
  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>
<style scoped>
	body {
	  overflow: hidden;
	}
  .image img{
    width:100%;
  }
</style>