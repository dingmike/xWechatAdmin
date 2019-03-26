<template>
  <footer class="footer">
    <div class="container">
      <div class="content has-text-centered">
        <p>Copyright fcstec 2017.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {

  data () {
    return this.$store.state.pkg
  }

}
</script>

<style lang="scss">
@import '~bulma/sass/utilities/mixins';

.footer {
  margin-left: 180px;

  @include mobile() {
    margin-left: 0;
  }

  .container {
    position: static;
  }

}
</style>
