<template>
  <section class="hero is-bold app-navbar animated" :class="{ slideInDown: show, slideOutDown: !show }">
    <div class="hero-head">
      <nav class="nav">
        <div class="nav-left">
          <a class="nav-item is-hidden-tablet" @click="toggleSidebar(!sidebar.opened)">
            <i class="fa fa-bars" aria-hidden="true"></i>
          </a>
        </div>
        <div class="nav-center">
          <a class="nav-item hero-brand" href="/">
            <!-- <img src="~assets/logo.svg" :alt="pkginfo.description"> -->
            <div class="is-hidden-mobile">
              <strong class="admin">心迹家庭成长社 管理后台</strong>
            </div>
          </a>
        </div>
        <div class="nav-right is-flex">
          <div class="user-panel" v-show="loginState">
            {{ userInfo.username }}, <a href="#" @click.prevent="logout">退出</a>
          </div>
        </div>
      </nav>
    </div>
  </section>
</template>

<script>
import Tooltip from 'vue-bulma-tooltip'
import { mapGetters, mapActions } from 'vuex'

import userModule from 'lanmaLib/modules/user'

export default {

  components: {
    Tooltip
  },

  props: {
    show: Boolean
  },

  computed: mapGetters({
    pkginfo: 'pkg',
    sidebar: 'sidebar',
    userInfo: 'userInfo',
    loginState: 'loginState'
  }),

  methods: {
    logout () {
      this.userLogout()
      userModule.logout()
      window.location.reload()
    },
    ...mapActions([
      'toggleSidebar',
      'userLogout'
    ])
  }
}
</script>

<style lang="scss">
@import '~bulma/sass/utilities/variables';

.app-navbar {
  position: fixed;
  min-width: 100%;
  z-index: 1024;
  box-shadow: 0 2px 3px rgba(17, 17, 17, 0.1), 0 0 0 1px rgba(17, 17, 17, 0.1);

  .container {
    margin: auto 10px;
  }

  .nav-right {
    align-items: stretch;
    align-items: stretch;
    flex: 1;
    justify-content: flex-end;
    overflow: hidden;
    overflow-x: auto;
    white-space: nowrap;
  }
}

.hero-brand {
  .vue {
    margin-left: 10px;
    color: #36AC70;
  }
  .admin {
    color: #28374B;
  }
}

.user-panel{
  line-height:50px;
  margin-right:40px;
}
</style>
