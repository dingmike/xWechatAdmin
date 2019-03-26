import * as types from '../../mutation-types'
// import lazyLoading from './lazyLoading'
// import charts from './charts'
// import uifeatures from './uifeatures'
// import components from './components'
// import tables from './tables'
import tag from './tag'
import courses from './courses'
import combination from './combination'
import commodity from './commodity'
import commodityChannel from './commodity_channel'
import recharge from './recharge'
import materials from './materials'
import materialsTour from './materials_tour'
import seller from './seller'
import autoresp from './autoresp'
import agencies from './agencies'
import channels from './channels'
// import wechat from './wechat'
import users from './users'
import account from './account'
import readers from './readers'
import readersEditor from './readers_editor'
// import learns from './learns'
// import orders from './orders'
// import coupons from './coupons'

import userModule from 'lanmaLib/modules/user'
import capsule from './capsule'
import capsuleAuth from './capsuleAuth'
import userAdmin from './userAdmin'
import userAdminChannel from './userAdmin_channel'
import thirdParty from './thirdParty'
var userInfo = userModule.getUserInfoFromStorage()
console.log('menu:', userInfo)
var userRole = '0'
if (userInfo) {
  userRole = userInfo.roles
}
console.log(userRole)
// show: meta.label -> name
// name: component name
// meta.label: display label

var items = getMenuItems(userRole)

const state = {
  items: items
}

const mutations = {
  [types.EXPAND_MENU] (state, menuItem) {
    if (menuItem.index > -1) {
      if (state.items[menuItem.index] && state.items[menuItem.index].meta) {
        state.items[menuItem.index].meta.expanded = menuItem.expanded
      }
    } else if (menuItem.item && 'expanded' in menuItem.item.meta) {
      menuItem.item.meta.expanded = menuItem.expanded
    }
  },
  [types.LOGIN] (state, userInfo) {
    console.log('menu commit login')
    console.log(userInfo)
    if (userInfo) {
      state.items = getMenuItems(userInfo.roles)
    } else {
      state.items = []
    }
  },
  [types.UPDATE_USER_INFO] (state, userInfo) {
    console.log('menu commit login')
    console.log(userInfo)
    if (userInfo) {
      state.items = getMenuItems(userInfo.roles)
    } else {
      state.items = []
    }
  }
}

function getMenuItems (roles) {
  var items = []
  if (!roles || roles === '') {
    return items
  }

  var roleList = roles.split(',')
  var menuList = []
  for (var i = 0; i < roleList.length; i++) {
    menuList.push(getRoleMenuItems(parseInt(roleList[i])))
  }

  var menuOrder = getMenuOrder()

  for (var j = 0; j < menuOrder.length; j++) {
    var menuItem = menuOrder[j]
    var find = false
    for (var a = 0; a < menuList.length; a++) {
      var menuItemList = menuList[a]
      for (var b = 0; b < menuItemList.length; b++) {
        if (menuItem['path'] === menuItemList[b]['path']) {
          find = true
          break
        }
      }
      if (find) {
        break
      }
    }
    if (find) {
      items.push(menuItem)
    }
  }

  return items
}

function getMenuOrder() {
  var items = []
  items.push(
    tag,
    courses,
    combination,
    commodity,
    userAdmin,
    commodityChannel,
    recharge,
    materials,
    materialsTour,
    seller,
    userAdminChannel,
    agencies,
    channels,
    readers,
    readersEditor,
    autoresp,
    users,
    account,
    capsule,
    capsuleAuth,
    thirdParty
  )
  return items
}
function getRoleMenuItems(userRole) {
  // 测试阶段
  userRole = 1
  var items = []

  var Role = {}
  Role.ADMIN = 1
  Role.CHANNEL = 2 // 推广渠道
  Role.CLASS_TEACHER = 3 // 上课老师
  Role.PARENT = 4 // 家长
  Role.TECH_TEACHER = 5 // 技能老师
  Role.EDU_TEACHER = 6 // 教育老师
  Role.OPERATION = 7 // 运营人员
  Role.READER_EDITOR = 8 // 共读编辑
  Role.READER_OPERATION = 9 // 共读运营人员
  Role.COURSE_EDITOR = 10 // 课程编辑
  Role.SALES = 11       // 销售
  Role.CAPSULE_EDITOR = 12   // 胶囊编辑
  if (userRole === Role.READER_EDITOR) {
    items.push(
      readersEditor,
      account
    )
  } else if (userRole === Role.READER_OPERATION) {
    items.push(
      readers,
      account
    )
  } else if (userRole === Role.COURSE_EDITOR) {
    items.push(
      materials,
      materialsTour,
      account
    )
  } else if (userRole === Role.CHANNEL) {
    items.push(
      commodityChannel,
      seller,
      account,
      userAdminChannel
    )
  } else if (userRole === Role.CAPSULE_EDITOR) {
    items.push(
      capsule
    )
  } else if (userRole === Role.ADMIN) {
    items.push(
      tag,
      courses,
      combination,
      commodity,
      recharge,
      // commodityChannel,
      materials,
      materialsTour,
      // learns,
      // seller,
      agencies,
      channels,
      // orders,
      // coupons,
      // wechat,
      readers,
      autoresp,
      // readersEditor,
      users,
      account,
      capsule,
      capsuleAuth,
      userAdmin,
      thirdParty
    )
  }

  return items
}
export default {
  state,
  mutations
}
