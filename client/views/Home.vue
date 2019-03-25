<template>
  <div class="content has-text-centered">

    <h1 class="is-title is-bold">心迹家庭成长社 管理后台</h1>

  </div>
</template>

<script>
export default {

  data () {
    return this.$store.state.pkg
  }

}
</script>

<style lang="scss" scoped>
.is-title {
  text-transform: capitalize;
}
</style>
