<template>
  <div id="app">
    <nprogress-container></nprogress-container>
    <navbar :show="true"></navbar>
    <sidebar v-if="route.path != '/login'" :show="sidebar.opened && !sidebar.hidden"></sidebar>
    <app-main></app-main>
    <footer-bar v-if="route.path != '/login'"></footer-bar>
  </div>
</template>

<script>
import NprogressContainer from 'vue-nprogress/src/NprogressContainer'
import { Navbar, Sidebar, AppMain, FooterBar } from 'components/layout/'
import { mapGetters, mapActions } from 'vuex'
import userModule from 'lanmaLib/modules/user'

export default {
  components: {
    Navbar,
    Sidebar,
    AppMain,
    FooterBar,
    NprogressContainer
  },

  data () {
    return {
      login: false
    }
  },

  beforeCreate () {

    // console.log('login:', this.login)
    // console.log(this.$route.path)
    // if (!this.login && this.$route.path !== '/login') {
    //   console.log('not login:')
    //   this.$router.push('/login')
    // }
  },

  created () {
    console.log('created')
    this.login = userModule.checkLogin()
    console.log(this.login)
    this.updateUserState(this.login)
    if (this.login) {
      userModule.getUserInfo()
        .then((userInfo) => {
          console.log(userInfo)
          // if (userInfo) {
          this.updateUserInfo(userInfo)
          // }
        })
    }
  },

  beforeMount () {
    const { body } = document
    const WIDTH = 768
    const RATIO = 3

    const handler = () => {
      if (!document.hidden) {
        let rect = body.getBoundingClientRect()
        let isMobile = rect.width - RATIO < WIDTH
        this.toggleDevice(isMobile ? 'mobile' : 'other')
        this.toggleSidebar(!isMobile)
      }
    }

    document.addEventListener('visibilitychange', handler)
    window.addEventListener('DOMContentLoaded', handler)
    window.addEventListener('resize', handler)
  },

  computed: {
    ...mapGetters({
      sidebar: 'sidebar',
      route: 'route'
    })
  },

  methods: {
    ...mapActions([
      'toggleDevice',
      'toggleSidebar',
      'updateUserInfo',
      'updateUserState'
    ])
  }
}
</script>

<style lang="scss">
@import '~animate.css';
.animated {
  animation-duration: .377s;
}

@import '~bulma';

@import '~wysiwyg.css/wysiwyg.sass';

$fa-font-path: '~font-awesome/fonts/';
@import '~font-awesome/scss/font-awesome';
@import './styles/main.scss';

.nprogress-container {
  position: fixed !important;
  width: 100%;
  height: 50px;
  z-index: 2048;
  pointer-events: none;

  #nprogress {
    $color: #48e79a;

    .bar {
      background: $color;
    }
    .peg {
      box-shadow: 0 0 10px $color, 0 0 5px $color;
    }

    .spinner-icon {
      border-top-color: $color;
      border-left-color: $color;
    }
  }
}
.pagination{
  .is-current{
    color: #ccc;
  }
}
.g-core-image-upload-form:hover{
  cursor: pointer;
}
.vue-bulma-tabs .tab-pane.is-active{
  transform: none !important;
}
</style>
