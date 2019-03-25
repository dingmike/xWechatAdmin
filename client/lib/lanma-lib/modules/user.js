'use strict'

import api from '../common/api'
import _ from 'lodash'

function getCurrentUserInfo () {
  return api.getCurrentUserInfo().then((userInfo) => {
    saveUserInfoToStorage(userInfo)
    return userInfo
  })
}

function dayLoginLog () {
  return api.user.dayLoginLog()
}

function getUserInfoFromStorage () {
  var content = window.localStorage.getItem('userInfo')
  console.log('userInfo:' + content)
  if (content) {
    return JSON.parse(content)
  }
  return null
}

function saveUserInfoToStorage (userInfo) {
  console.log('saveUserInfoToStorage:' + JSON.stringify(userInfo))
  window.localStorage.setItem('userInfo', JSON.stringify(userInfo))
}

function getUserInfo () {
  return new Promise(function (resolve, reject) {
    var userInfo = getUserInfoFromStorage()
    if (userInfo) {
      resolve(userInfo)
    } else {
      getCurrentUserInfo().then((userInfo) => {
        saveUserInfoToStorage(userInfo)
        resolve(userInfo)
      })
      .catch((e) => {
        resolve(null)
      })
    }
  })
}

function checkLogin () {
  var token = window.localStorage.getItem('token')
  // console.log('checkLogin:' + token)
  return !_.isEmpty(token)
}

function logout () {
  api.setToken('')
  saveUserInfoToStorage('')
}

export default {
  getCurrentUserInfo,
  logout,
  getUserInfo,
  checkLogin,
  getUserInfoFromStorage,
  saveUserInfoToStorage,
  dayLoginLog
}
