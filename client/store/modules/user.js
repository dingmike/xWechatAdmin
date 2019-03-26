import * as types from '../mutation-types'

const state = {
  loginState: true,
  // loginState: false,
  userInfo: {roles: '1'}
}

const mutations = {
  [types.LOGIN] (state, userInfo) {
    state.loginState = true
    state.userInfo = userInfo
  },

  [types.UPDATE_USER_INFO] (state, userInfo) {
    state.userInfo = userInfo
  },

  [types.UPDATE_USER_STATE] (state, login) {
    state.loginState = login
  },

  [types.LOGOUT] (state) {
    state.loginState = false
    state.userInfo = {}
  }
}

export default {
  state,
  mutations
}
