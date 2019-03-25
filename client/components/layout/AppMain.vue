<template>
  <section class="app-main">
    <div class="container is-fluid is-marginless app-content">
      <levelbar v-if="route.path != '/login'"></levelbar>
      <transition
        mode="out-in"
        enter-active-class="fadeIn"
        leave-active-class="fadeOut"
        appear>
        <router-view class="animated"></router-view>
      </transition>
    </div>
  </section>
</template>
<script>
import Levelbar from './Levelbar'
import { mapGetters } from 'vuex'

export default {
  components: {
    Levelbar
  },
  computed: {
    ...mapGetters({
      route: 'route'
    })
  }
}
</script>

<style lang="scss">
@import '~bulma/sass/utilities/variables';
@import '~bulma/sass/utilities/mixins';

.app-main {
  padding-top: 50px;
  margin-left: 180px;

  @include mobile() {
    margin-left: 0;
  }

}

.app-content {
  padding: 20px;
}
</style>
