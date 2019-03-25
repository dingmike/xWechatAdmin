<template>
  <div class="collapse is-fullwidth">
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    isFullwidth: Boolean,
    accordion: Boolean
  },
  computed: {
    $collapseItems () {
      return this.$children
    }
  },
  methods: {
    openByIndex (index) {
      console.log(this.$children)
      if (this.accordion) {
        this.$collapseItems.forEach((item, i) => {
          if (i !== index) {
            item.isActived = false
          }
        })
      }
    }
  }
}
</script>
<style>
.collapse.is-fullwidth {
  width: 100%;
}
</style>