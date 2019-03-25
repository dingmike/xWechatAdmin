import Vue from 'vue'
import Resource from 'vue-resource'
import NProgress from 'vue-nprogress'
import { sync } from 'vuex-router-sync'
import App from './App.vue'
import router from './router'
import store from './store'
import * as filters from './filters'
import { TOGGLE_SIDEBAR } from 'vuex-store/mutation-types'
import axios from 'axios'

import helper from 'lanmaLib/helper'
import api from 'lanmaLib/common/api'
import config from 'lanmaLib/config'
import label from 'lanmaLib/modules/label'
import user from 'lanmaLib/modules/user'
import course from 'lanmaLib/modules/course'
import material from 'lanmaLib/modules/material'

Vue.use(Resource)
Vue.use(NProgress)
// Vue.use(LanmaLib)

Vue.prototype.$helper = helper
Vue.prototype.$api = api
Vue.prototype.$config = config
Vue.prototype.$label = label
Vue.prototype.$user = user
Vue.prototype.$course = course
Vue.prototype.$material = material
Vue.prototype.$axios = axios
// Enable devtools
Vue.config.devtools = true

sync(store, router)

const nprogress = new NProgress({ parent: '.nprogress-container' })

const { state } = store

router.beforeEach((route, redirect, next) => {
  if (state.app.device.isMobile && state.app.sidebar.opened) {
    store.commit(TOGGLE_SIDEBAR, false)
  }
  var login = user.checkLogin()
  if (!login && route.path !== '/login') {
    console.log('not login:')
    router.push('/login')
  }
  console.log(route.path)
  next()
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

window.authUser = function () {
  router.push('/login')
}
const app = new Vue({
  router,
  store,
  nprogress,
  ...App
})

export { app, router, store }
