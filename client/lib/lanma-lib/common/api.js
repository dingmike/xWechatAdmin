import _ from 'lodash'
import axios from 'axios'
import 'whatwg-fetch'

const http = axios
const USER_AGENT = ''
http.interceptors.response.use(checkStatus)
http.interceptors.response.use(checkCode)

function checkStatus (response) {
  if (response.status >= 200 && response.status < 300) {
    return response.data
  } else {
    if (response.status === 401 && window && window.authUser) {
      window.authUser()
    }
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function checkCode (data) {
  if (data.code === 0) {
    return data.data
  } else if (data.code === 6004 && window && window.authUser) {
    window.authUser()
  } else if (data.code === 6005 && window && window.authUser) {
    window.authUser()
  } else {
    var error = new Error(data.msg)
    error.code = data.code
    throw error
  }
}

function checkStatus2 (response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    if (response.status === 401 && window && window.authUser) {
      window.authUser()
    }
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function checkCode2 (data) {
  if (data.code === 0) {
    return data.data
  } else if (data.code === 6004 && window && window.authUser) {
    window.authUser()
  } else if (data.code === 6005 && window && window.authUser) {
    window.authUser()
  } else {
    var error = new Error(data.msg)
    error.code = data.code
    throw error
  }
}
function parseJSON (response) {
  return response.json()
}

function getUrl (url, param) {
  if (!param) {
    return url
  }
  url += '?'
  var list = []
  for (var key in param) {
    if (param.hasOwnProperty(key)) {
      var val = param[key]
      if (typeof val === 'object') {
        val = JSON.stringify(val)
      }
      val = encodeURIComponent(val)
      list.push(key + '=' + val)
    }
  }
  url += list.join('&')
  return url
}

function apiRequest (path, method = 'GET', data = null) {
  const url = '/api' + path
  if (method === 'GET') {
    return http.get(url)
  } else {
    return http.post(url, data)
  }
}
// function apiRequest (path, method = 'GET', data = null, opts = null) {
//   var token = getToken()

//   const options = {
//     headers: {
//       // 'Accept': 'application/json',
//       'Content-Type': 'application/json',
//       'User-Agent': USER_AGENT,
//       'Authorization': 'Bearer ' + token
//     },
//     credentials: 'include'
//     // mode: 'no-cors',
//     // strictSSL: false
//   }

//   if (data) {
//     options.body = JSON.stringify(data)
//   }

//   if (opts) {
//     _.merge(options, opts)
//   }

//   const url = '/api' + path

//   options.method = method
//   console.log(opts)

//   return window.fetch(url, options)
//     .then(checkStatus)
//     .then(parseJSON)
//     .then(checkCode)
// }

function mockRequest (path, method = 'GET', data = null, opts = null) {
  var token = getToken()

  const options = {
    headers: {
      // 'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': USER_AGENT,
      'Authorization': 'Bearer ' + token
    },
    credentials: 'include'
    // mode: 'no-cors',
    // strictSSL: false
  }

  if (data) {
    options.body = JSON.stringify(data)
  }

  if (opts) {
    _.merge(options, opts)
  }

  const url = '/mock' + path

  options.method = method
  console.log(opts)

  return window.fetch(url, options)
    .then(checkStatus)
    // .then(parseJSON)
    .then(checkCode)
}

// function wxRequest (path, method = 'GET', data = null, opts = null) {
//   var token = getToken()

//   const options = {
//     headers: {
//       // 'Accept': 'application/json',
//       'Content-Type': 'application/json',
//       'User-Agent': USER_AGENT,
//       'Authorization': 'Bearer ' + token
//     },
//     credentials: 'include'
//     // mode: 'no-cors',
//     // strictSSL: false
//   }

//   if (data) {
//     options.body = JSON.stringify(data)
//   }

//   if (opts) {
//     _.merge(options, opts)
//   }

//   const url = '/wxcgi' + path

//   options.method = method
//   console.log(opts)

//   return window.fetch(url, options)
//     .then(checkStatus)
//     .then(parseJSON)
//     .then(checkCode)
// }

function getToken () {
  var token = ''
  if (window.localStorage && (token = window.localStorage.getItem('token'))) {
    return token
  } else {
    return ''
  }
}

export default {
  setToken: function (token) {
    window.localStorage.setItem('token', token)
  },

  getToken,

  login: function (username, password) {
    const data = {
      userName: username,
      password: password
    }
    var path = `/user/login`
    var method = 'POST'

    return apiRequest(path, method, data)
  },

  changePassword: function(oldPassword, newPassword) {
    const data = {
      oldPassword: oldPassword,
      newPassword: newPassword
    }
    return apiRequest('/user/changePassword', 'POST', data)
  },

  getCurrentUserInfo: function () {
    var path = `/user/getUserInfo`

    return apiRequest(path)
  },
  admin: {
    order: {
      learnOrder: {
        getList (learnId) {
          var param = {learn_id: learnId}
          var url = getUrl('/admin/orders/learn_orders', param)
          return apiRequest(url)
        }
      }
    },
    coupon: {
      add (data) {
        return apiRequest('/admin/coupons', 'post', data)
      },

      edit (id, data) {
        return apiRequest('/admin/coupons/' + id, 'put', data)
      },

      find (id) {
        return apiRequest('/admin/coupons/' + id)
      },

      getList (param = {}) {
        var url = getUrl('/admin/coupons', param)
        return apiRequest(url)
      },

      delete (id) {
        return apiRequest('/admin/coupons/' + id, 'delete')
      }
    },

    monthReport: {
      add (data) {
        return apiRequest('/admin/month_reports', 'post', data)
      },

      edit (id, data) {
        return apiRequest('/admin/month_reports/' + id, 'put', data)
      },

      find (id) {
        return apiRequest('/admin/month_reports/' + id)
      },

      getList (param = {}) {
        var url = getUrl('/admin/month_reports', param)
        return apiRequest(url)
      },

      delete (id) {
        return apiRequest('/admin/month_reports/' + id, 'delete')
      }
    }
  },

  channel: {
    add (channel) {
      return apiRequest('/user/adminAddChannel', 'post', channel)
    },

    edit (id, channel) {
      channel['userId'] = id
      return apiRequest('/user/adminUpdateChannel', 'post', channel)
    },

    find (id) {
      return apiRequest('/user/getChannel', 'post', {userId: id})
    },

    getList (param = {}) {
      var url = getUrl('/user/getChannelList', param)
      return apiRequest(url)
    },

    getSellList (params) {
      return apiRequest('/goods/getAllChannelList', 'post', params)
    },

    delete (id) {
      return apiRequest('/user/adminDeleteChannel', 'post', {userId: id})
    },
    search (key) {
      return apiRequest('/user/findChannel', 'post', {'key': key})
    },
    editPassword (params) {
      return apiRequest('/user/adminSetChannelPwd', 'post', params)
    }
  },

  label: {
    admin: {
      getRelation (id) {
        return apiRequest('/label/getLabelRelation', 'POST', {labelId: id})
      },
      updateRelation (id, list) {
        var data = {labelId: id, list: list}
        return apiRequest('/label/saveLabelRelation', 'POST', data)
      }
    },
    add (label) {
      return apiRequest('/label/addLabel', 'post', label)
    },

    edit (id, label) {
      return apiRequest('/label/updateLabel', 'post', label)
    },

    find (id) {
      return apiRequest('/label/getLabel', 'post', {labelId: id})
    },

    getList (params) {
      var url = getUrl('/label/getLabelList', params)
      return apiRequest(url)
    },

    delete (id) {
      return apiRequest('/label/deleteLabel', 'post', {labelId: id})
    },

    play_count () {
      return apiRequest('/label/play_count')
    },

    reader_count () {
      return apiRequest('/label/reader_count')
    },

    learn_count () {
      return apiRequest('/label/learn_count')
    },

    age_relation () {
      return apiRequest('/label/age_relation')
    },
    getRootLabel () {
      return apiRequest('/label/getRootLabel')
    }
  },

  agency: {
    add (agency) {
      return apiRequest('/agencies', 'post', agency)
    },

    edit (id, agency) {
      agency['id'] = id
      return apiRequest('/user/updateClassTeacher', 'post', agency)
    },

    find (id) {
      return apiRequest('/user/getClassTeacher', 'post', {teacherId: id})
    },

    getList (params) {
      var url = getUrl('/user/getClassTeacherList', params)
      return apiRequest(url)
    },

    delete (id) {
      return apiRequest('/user/deleteClassTeacher', 'post', {userId: id})
    },

    apply (data) {
      return apiRequest('/user/applyForClassTeacher', 'post', data)
    },

    check (data) {
      return apiRequest('/agency/check', 'post', data)
    },

    mine () {
      return apiRequest('/agency/mine')
    }
  },

  material: {
    add (material) {
      return apiRequest('/material/addMaterial', 'post', material)
    },

    edit (id, material) {
      material['id'] = id
      return apiRequest('/material/updateMaterial', 'post', material)
    },

    find (id) {
      return apiRequest('/material/getMaterial?id=' + id)
    },

    checkRefered (materialId) {
      var params = {
        materialId
      }
      return apiRequest('/course/isReferedByCourse', 'post', params)
    },

    getAgencyMaterial (params) {
      var url = getUrl('/materials/agency_materials', params)
      return apiRequest(url)
    },

    addFromAgency (material) {
      return apiRequest('/materials/add_from_agency', 'post', material)
    },

    getList (params) {
      var url = getUrl('/material/getMaterialList', params)
      return apiRequest(url)
    },

    delete (id) {
      return apiRequest('/material/deleteMaterial?id=' + id)
    },
    search (key) {
      return apiRequest('/material/findMaterial', 'post', {'key': key})
    }
  },

  material_tour: {
    add (material) {
      return apiRequest('/stMaterial/addMaterial', 'post', material)
    },

    edit (id, material) {
      material['id'] = id
      return apiRequest('/stMaterial/updateMaterial', 'post', material)
    },

    find (id) {
      return apiRequest('/stMaterial/getMaterial?id=' + id)
    },

    getAgencyMaterial (params) {
      var url = getUrl('/materials/agency_materials', params)
      return apiRequest(url)
    },

    getList (params) {
      var url = getUrl('/stMaterial/getMaterialList', params)
      return apiRequest(url)
    },

    delete (id) {
      return apiRequest('/stMaterial/deleteMaterial?id=' + id)
    },
    search (key) {
      return apiRequest('/stMaterial/findMaterial', 'post', {'key': key})
    }
  },

  learn: {
    admin: {
      add (learn) {
        return apiRequest('/admin/learns', 'post', learn)
      },

      edit (id, learn) {
        return apiRequest('/admin/learns/' + id, 'put', learn)
      },

      find (id) {
        return apiRequest('/admin/learns/' + id)
      },

      getAgencylearn (params) {
        var url = getUrl('/admin/learns/agency_learns', params)
        return apiRequest(url)
      },

      addFromAgency (learn) {
        return apiRequest('/admin/learns/add_from_agency', 'post', learn)
      },

      getList (params) {
        var url = getUrl('/admin/learns', params)
        return apiRequest(url)
      },

      delete (id) {
        return apiRequest('/admin/learns/' + id, 'delete')
      },

      deleteTask (id) {
        return apiRequest('/admin/learn_tasks/' + id, 'delete')
      },

      deleteAsk (id) {
        return apiRequest('/admin/learn_asks/' + id, 'delete')
      },

      deleteSummary (id) {
        return apiRequest('/admin/learn_summaries/' + id, 'delete')
      },

      deleteHomework (id) {
        return apiRequest('/admin/learn_homework/' + id, 'delete')
      }
    },
    find (id) {
      return apiRequest('/learns/' + id)
    },
    filter (params) {
      var url = getUrl('/learns/filter', params)
      return apiRequest(url)
    },
    addFavorite (id) {
      return apiRequest('/learns/add_favorite/' + id)
    },
    deleteFavorite (id) {
      return apiRequest('/learns/delete_favorite/' + id)
    },
    favoriteList () {
      return apiRequest('/learn/favorite')
    },
    userLearnCourse () {
      return apiRequest('/learn/user_learn_course')
    },
    click (id) {
      return apiRequest('/learns/click/' + id)
    },
    getUserAnswer (id) {
      return apiRequest('/learn/user_answer/' + id)
    },

    getCourseAnswer (id) {
      return apiRequest('/learn/course_answer/' + id)
    },

    saveUserAnswer (answer) {
      return apiRequest('/learn/add_answer', 'post', answer)
    },

    submitAnswer (data) {
      return apiRequest('/learn/submit_answer', 'post', data)
    },

    getUserHomework (id) {
      return apiRequest('/learn/user_homework/' + id)
    },

    saveUserHomework (answer) {
      return apiRequest('/learn/add_homework', 'post', answer)
    },

    submitHomework (data) {
      return apiRequest('/learn/submit_homework', 'post', data)
    }
  },

  course: {
    add (course) {
      return apiRequest('/course/addCourse', 'post', course)
    },
    edit (id, course) {
      course['id'] = id
      return apiRequest('/course/udpateCourse', 'post', course)
    },

    confirm (id) {
      return apiRequest('/courses/confirm/' + id)
    },

    find (id) {
      return apiRequest('/course/getCourse', 'post', {id: id})
    },

    cancel (id) {
      return apiRequest('/course/classCancel', 'post', {id: id})
    },

    search (key) {
      var params = {
        'title': key,
        'materialType': 1,
        'status': 7,
        'offset': 0,
        'length': 0
      }
      return apiRequest('/course/getCourseList', 'post', params)
    },
    searchTour (key) {
      var params = {
        'title': key,
        'materialType': 2,
        'status': 7,
        'offset': 0,
        'length': 0
      }
      return apiRequest('/course/getCourseList', 'post', params)
    },
    copy (id) {
      return apiRequest('/course/copyCourse', 'post', {courseId: id})
    },

    getList (params) {
      var url = getUrl('/course/getCourseList', params)
      console.log(url)
      return apiRequest(url)
    },
    getStList (params) {
      return apiRequest('/stCourse/getCourseList', 'post', params)
    },
    filter (params) {
      var url = getUrl('/courses/filter', params)
      return apiRequest(url)
    },

    signInfo (id) {
      return apiRequest('/courses/sign_info/' + id)
    },

    sign (id, phone) {
      var signData = {
        id,
        phone
      }
      return apiRequest('/courses/sign', 'post', signData)
    },

    userCourse (type) {
      return apiRequest('/courses/user_course/' + type)
    },

    courseUserList (id) {
      return apiRequest('/courses/user_list/' + id)
    },

    signUser (id) {
      return apiRequest('/course/getCourseUser/', 'post', {'course_id': id})
    },

    signIn (id) {
      var data = {course_id: id}
      return apiRequest('/courses/sign_in', 'post', data)
    },

    orderConfirm (id) {
      return apiRequest('/courses/order_confirm/' + id)
    },

    getOnceQrcode (id) {
      var data = {
        courseId: id
      }
      return apiRequest('/courseCouponCode/createCouponCode', 'post', data)
    },

    delete (id) {
      return apiRequest('/course/deleteCourse', 'post', {courseId: id})
    },

    getUserAnswer (id) {
      return apiRequest('/courses/user_answer/' + id)
    },

    getCourseAnswer (id) {
      return apiRequest('/courses/course_answer/' + id)
    },

    saveUserAnswer (answer) {
      return apiRequest('/courses/add_answer', 'post', answer)
    },

    submitAnswer (data) {
      return apiRequest('/courses/submit_answer', 'post', data)
    },

    getUserHomework (id) {
      return apiRequest('/courses/user_homework/' + id)
    },

    saveUserHomework (answer) {
      return apiRequest('/courses/add_homework', 'post', answer)
    },

    submitHomework (data) {
      return apiRequest('/courses/submit_homework', 'post', data)
    },

    editSummary (id, data) {
      return apiRequest('/courses/edit_summary/' + id, 'post', data)
    },

    deletePhoto (id) {
      return apiRequest('/courses/delete_photo/' + id)
    },

    reportClick (id) {
      return apiRequest('/courses/report_click/' + id)
    },

    dismiss (id) {
      return apiRequest('/courses/dismiss/' + id)
    },

    isExistCourseNumber(number) {
      return apiRequest('/course/isExistCourseNumber', 'POST', {number})
    },
    getCompleteCourseInfo (id) {
      return apiRequest('/course/getCompleteCourseInfo', 'post', {'courseId': id})
    },
    setAgencySummary (courseId, reviewAfter, coursePics) {
      var params = {
        courseId,
        reviewAfter,
        coursePics
      }
      return apiRequest('/course/setClassAfterInfo', 'post', params)
    },
    getAllThirdPartyCourseList (id) {
      return apiRequest('/course/getAllThirdPartyCourseList', 'post', {id})
    }
  },

  course_tour: {
    add (course) {
      return apiRequest('/stCourse/addCourse', 'post', course)
    },

    edit (id, course) {
      course['id'] = id
      return apiRequest('/stCourse/udpateCourse', 'post', course)
    },

    delete (id) {
      return apiRequest('/stCourse/deleteCourse', 'post', {courseId: id})
    },
    getCompleteCourseInfo (id) {
      return apiRequest('/stCourse/getCompleteCourseInfo', 'post', {'courseId': id})
    },
    setAgencySummary (courseId, reviewAfter, coursePics) {
      var params = {
        courseId,
        reviewAfter,
        coursePics
      }
      return apiRequest('/stCourse/setClassAfterInfo', 'post', params)
    },
    copy (id) {
      return apiRequest('/stCourse/copyCourse', 'post', {courseId: id})
    },
    cancel (id) {
      return apiRequest('/stCourse/classCancel', 'post', {id: id})
    },
    sendReportMessage (courseId) {
      return apiRequest('/stCourse/sendReportMessage', 'post', {courseId: courseId})
    },
    getAllThirdPartyCourseList (id) {
      return apiRequest('/stCourse/getAllThirdPartyCourseList', 'post', {id})
    }
  },

  reader: {
    filterArticleList (params) {
      return apiRequest('/reader2/getArticleList', 'post', params)
    },
    admin: {
      add (data) {
        return apiRequest('/reader2/adminAddArticle', 'post', data)
      },

      edit (id, data) {
        data['id'] = id
        return apiRequest('/reader2/adminUpdateArticle', 'post', data)
      },

      getDetail (id) {
        return apiRequest('/reader2/adminGetArticle', 'post', {articleId: id})
      },

      getList (params) {
        var url = getUrl('/reader2/adminGetArticleList', params)
        return apiRequest(url)
      },

      delete (id) {
        return apiRequest('/reader2/adminDeleteArticle', 'post', {articleId: id})
      }
    },
    editor: {
      add (data) {
        return apiRequest('/reader2/editorAddArticle', 'post', data)
      },

      edit (id, data) {
        data['id'] = id
        return apiRequest('/reader2/editorUpdateArticle', 'post', data)
      },

      getDetail (id) {
        return apiRequest('/reader2/editorGetArticle', 'post', {articleId: id})
      },

      getList (params) {
        var url = getUrl('/reader2/editorGetArticleList', params)
        return apiRequest(url)
      },

      delete (id) {
        return apiRequest('/reader2/editorDeleteArticle', 'post', {articleId: id})
      }
    }
  },

  coupon: {
    getList () {
      return apiRequest('/coupons')
    },
    userCoupon () {
      return apiRequest('/coupons/user_coupon')
    },
    convert (id) {
      return apiRequest('/coupons/convert/' + id)
    }
  },

  credit: {
    getList () {
      return apiRequest('/credit/log')
    }
  },

  user: {
    getParentList (params) {
      var url = getUrl('/parents', params)
      return apiRequest(url)
    },
    dayLoginLog () {
      return apiRequest('/user/day_login_log')
    },
    getAdminList (params) {
      var url = getUrl('/user/getAdminList', params)
      return apiRequest(url)
    },
    findAdmin (id) {
      return apiRequest('/admins/' + id)
    },
    addAdmin (admin) {
      return apiRequest('/admins', 'post', admin)
    },
    editAdmin (id, admin) {
      return apiRequest('/admins/' + id, 'put', admin)
    },
    getMonthReportList () {
      return apiRequest('/month_reports')
    },
    getMonthReport (dateline) {
      return apiRequest('/month_reports/get_report/' + dateline)
    },
    monthExperience (dateline) {
      return apiRequest('/month_reports/month_experience/' + dateline)
    }
  },

  photo: {
    upload (data) {
      return window.fetch('/api/user/upload', {
        method: 'POST',
        body: data,
        credentials: 'include'
      }).then(checkStatus2)
      .then(parseJSON)
      .then(checkCode2)
    },
    downloadMedia (mediaId) {
      return apiRequest('/user/uploadWXRes?mediaId=' + mediaId)
    }
  },

  order: {
    orderDetail (id) {
      return apiRequest('/order/order_detail/' + id)
    },
    paySuccess (id) {
      return apiRequest('/order/pay_success/' + id)
    },
    giveUp (id) {
      return apiRequest('/order/give_up/' + id)
    },
    buyLearnCourse (id) {
      return apiRequest('/order/buy_learn_course/' + id)
    }
  },

  studyTour: {
    getDetail () {
      return mockRequest()
    }
  },

  combination: {
    getList (params) {
      return apiRequest('/courseGroup/getCourseGroupList', 'post', params)
    },
    add (data) {
      return apiRequest('/courseGroup/addCourseGroup', 'post', data)
    },
    update (data) {
      return apiRequest('/courseGroup/updateCourseGroup', 'post', data)
    },
    find (id) {
      var params = {
        groupId: id
      }
      return apiRequest('/courseGroup/getCourseGroup', 'post', params)
    },
    delete (id) {
      var params = {
        groupId: id
      }
      return apiRequest('/courseGroup/deleteCourseGroup', 'post', params)
    }
  },

  commodity: {
    getList (params) {
      return apiRequest('/goods/getGoodsList', 'post', params)
    },
    add (data) {
      return apiRequest('/goods/addGoods', 'post', data)
    },
    checkCommodityNumber (number) {
      var params = {
        number
      }
      return apiRequest('/goods/isNumberExist', 'post', params)
    },
    update (data) {
      return apiRequest('/goods/updateGoods', 'post', data)
    },
    find (id) {
      var params = {
        goodsId: id
      }
      return apiRequest('/goods/getGoods', 'post', params)
    },
    search (key) {
      var params = {
        key
      }
      return apiRequest('/goods/findGoods', 'post', params)
    },
    delete (id) {
      var params = {
        goodsId: id
      }
      return apiRequest('/goods/deleteGoods', 'post', params)
    },
    cancelOrder (orderId) {
      var params = {
        orderId
      }
      return apiRequest('/goods/cancelOrder', 'post', params)
    },
    startSell (goodsId) {
      var params = {
        goodsId
      }
      return apiRequest('/goods/startSelling', 'post', params)
    },
    endSell (goodsId) {
      var params = {
        goodsId
      }
      return apiRequest('/goods/stopSelling', 'post', params)
    },
    getChannelList (params) {
      return apiRequest('/goods/getChannelList', 'post', params)
    },
    addChannel (params) {
      return apiRequest('/goods/addChannel', 'post', params)
    },
    delChannel (uniChannelId) {
      var params = {
        id: uniChannelId
      }
      return apiRequest('/goods/deleteChannel', 'post', params)
    },
    updateChannel (channel) {
      return apiRequest('/goods/updateChannel', 'post', channel)
    },
    getSellRecord (params) {
      return apiRequest('/goods/getSalesRecordList', 'post', params)
    },
    findSalesRecords (params) {
      return apiRequest('/goods/findSalesRecords', 'post', params)
    },
    channel: {
      getList (params) {
        return apiRequest('/channel/getGoodsList', 'post', params)
      },
      getRecordList (params) {
        return apiRequest('/channel/getSaleRecordList', 'post', params)
      },
      getRechargeRecordList (params) {
        return apiRequest('/channel/getRechargeRecordList', 'post', params)
      },
      cancelOrder (orderId) {
        var params = {
          orderId
        }
        return apiRequest('/channel/cancelOrder', 'post', params)
      },
      setPriceDesc (goodsId, priceDesc) {
        var params = {
          goodsId,
          priceDesc
        }
        return apiRequest('/channel/setPriceDesc', 'post', params)
      },
      startSell (goodsId, channelId) {
        var params = {
          goodsId,
          channelId
        }
        return apiRequest('/goods/startChannel', 'post', params)
      },
      endSell (goodsId, channelId) {
        var params = {
          goodsId,
          channelId
        }
        return apiRequest('/goods/stopChannel', 'post', params)
      }
    }
  },

  recharge: {
    getList (params) {
      return apiRequest('/recharge/getQuotalist', 'post', params)
    },
    add (data) {
      return apiRequest('/recharge/addQuota', 'post', data)
    },
    update (data) {
      return apiRequest('/recharge/updateQuota', 'post', data)
    },
    find (id) {
      var params = {
        id
      }
      return apiRequest('/recharge/getQuota', 'post', params)
    },
    delete (id) {
      var params = {
        id
      }
      return apiRequest('/recharge/deleteQuota', 'post', params)
    },
    // getSellRecord (params) {
    //   return apiRequest('/goods/getSalesRecordList', 'post', params)
    // },
    findSalesRecords (params) {
      return apiRequest('/recharge/getRechargeRecordList', 'post', params)
    },
    copyQuota (channelId) {
      var params = {
        channelId
      }
      return apiRequest('/recharge/copyQuota', 'post', params)
    },
    deleteChannelQuota (channelId) {
      var params = {
        channelId
      }
      return apiRequest('/recharge/deleteChannelQuota', 'post', params)
    }
  },

  autoresp: {
    getList () {
      return apiRequest('/wxmsg/getMsgList')
    },
    getDetail (keyText) {
      var params = {
        keyText
      }
      return apiRequest('/wxmsg/test', 'post', params)
    },
    delete (keyText) {
      var params = {
        keyText
      }
      return apiRequest('/wxmsg/deleteKeyMsg', 'post', params)
    },
    edit (params) {
      return apiRequest('/wxmsg/addOrUpdateKeyMsg', 'post', params)
    },
    addGoodsAd (params) {
      return apiRequest('/online/addGoodsAd', 'post', params)
    },
    updateGoodsAd (params) {
      return apiRequest('/online/updateGoodsAd', 'post', params)
    },
    getGoodsAd (id) {
      return apiRequest('/online/getGoodsAd', 'post', {id})
    },
    deleteGoodsAd (id) {
      return apiRequest('/online/deleteGoodsAd', 'post', {id})
    },
    changeDisplayOrder (params) {
      return apiRequest('/online/changeDisplayOrder', 'post', params)
    },
    getGoodsAdList () {
      var params = {
        offset: 0,
        length: 0
      }
      return apiRequest('/online/getAllGoodsAdList', 'post', params)
    }
  },

  seller: {
    getSellerList (params) {
      return apiRequest('/channel/getSalesList', 'post', params)
    },
    bindSellerQRcode (id) {
      var params = {
        id
      }
      return apiRequest('/channel/createBindQRCode', 'post', params)
    },
    unBindwx (id) {
      var params = {
        id
      }
      return apiRequest('/channel/unbindWX', 'post', params)
    },
    checkBind (qrcodeId) {
      var params = {
        qrcodeId
      }
      return apiRequest('/channel/isBindQRCodeScaned', 'post', params)
    },
    getSellerInfo (id) {
      var params = {
        id
      }
      return apiRequest('/channel/getSales', 'post', params)
    },
    addSeller (salesName, salesTelephone) {
      var params = {
        salesName,
        salesTelephone
      }
      return apiRequest('/channel/addSales', 'post', params)
    },
    deleteSeller (id) {
      var params = {
        id
      }
      return apiRequest('/channel/deleteSales', 'post', params)
    },
    updateSeller (id, salesName, salesTelephone) {
      var params = {
        id,
        salesName,
        salesTelephone
      }
      return apiRequest('/channel/updateSales', 'post', params)
    }
  },

  wechat: {
    getPayConfig (id) {
      return apiRequest('/wechat/pay_config/' + id)
    }
  },
  capsule: {
    addCapsule (data) {
      return apiRequest('/capsule/addCapsule', 'post', data)
    },
    updateCapsule (data) {
      return apiRequest('/capsule/updateCapsule', 'post', data)
    },
    getCapsule (id) {
      var params = {
        id
      }
      return apiRequest('/capsule/getCapsule', 'post', params)
    },
    deleteCapsule (id) {
      var params = {
        id
      }
      return apiRequest('/capsule/deleteCapsule', 'post', params)
    },
    getCapsuleList (data) {
      return apiRequest('/capsule/getCapsuleList', 'post', data)
    },
    findCapsule (key) {
      var params = {
        key
      }
      return apiRequest('/capsule/findCapsule', 'post', params)
    },
    getCapsuleExerciseAnsList (capsuleId) {
      var params = {
        capsuleId
      }
      return apiRequest('/capsule/getCapsuleExerciseAnsList', 'post', params)
    },
    addCertifica (data) {
      return apiRequest('/capsule/addCertifica', 'post', data)
    },
    updateCertifica (data) {
      return apiRequest('/capsule/updateCertifica', 'post', data)
    },
    getCertifica (id) {
      var params = {
        id
      }
      return apiRequest('/capsule/getCertifica', 'post', params)
    },
    deleteCertifica (id) {
      var params = {
        id
      }
      return apiRequest('/capsule/deleteCertifica', 'post', params)
    },
    getCertificaList (data) {
      return apiRequest('/capsule/getCertificaList', 'post', data)
    },
    findCertifica (key) {
      var params = {
        key
      }
      return apiRequest('/capsule/findCertifica', 'post', params)
    },
    getCapsuleUserList (capsuleType) {
      var params = {
        capsuleType
      }
      return apiRequest('/capsule/getCapsuleUserList', 'post', params)
    },
    addCapsuleUser (openids, capsuleType) {
      var params = {
        capsuleType,
        openids
      }
      return apiRequest('/capsule/addCapsuleUser', 'post', params)
    },
    delCapsuleUser (ids) {
      var params = {
        ids
      }
      return apiRequest('/capsule/delCapsuleUser', 'post', params)
    },
    getTargetList (data) {
      return apiRequest('/capsule/getTargetList', 'post', data)
    },
    changeTargetOrder(id1, id2) {
      return apiRequest('/capsule/changeTargetOrder', 'post', {id1, id2})
    },
    addTarget (data) {
      return apiRequest('/capsule/addTarget', 'post', data)
    },
    updateTarget (data) {
      return apiRequest('/capsule/updateTarget', 'post', data)
    },
    getTarget (id) {
      return apiRequest('/capsule/getTarget', 'post', {id})
    },
    deleteTarget (id) {
      return apiRequest('/capsule/deleteTarget', 'post', {id})
    }
  },
  userAdmin: {
    getUserList (params) {
      return apiRequest('/user/getUserList/', 'post', params)
    },
    getUserPaidOrderList (params) {
      return apiRequest('/goodsPayment/getUserPaidOrderList', 'post', params)
    },
    getConsumerPaidOrderList (params) {
      return apiRequest('/goodsPayment/getConsumerPaidOrderList', 'post', params)
    },
    getSubscribeUserList() {
      return apiRequest('/user/getSubscribeUserList/')
    }
  },
  userAdminChannel: {
    channelGetUserList (params) {
      return apiRequest('/user/channelGetUserList', 'post', params)
    },
    getUserPaidOrderList (params) {
      return apiRequest('/goodsPayment/channelGetUserPaidOrderList', 'post', params)
    },
    channelGetConsumerPaidOrderList (params) {
      return apiRequest('/goodsPayment/channelGetConsumerPaidOrderList', 'post', params)
    }
  },
  superAdmin: {
    getThirdPartyList (params) {
      return apiRequest('/thirdParty/getThirdPartyList', 'post', params)
    },
    getThirdPartyTeacher (id) {
      return apiRequest('/user/getThirdPartyTeacher', 'post', {id})
    },
    adminGetMaterialList (params) {
      return apiRequest('/material/adminGetMaterialList', 'post', params)
    },
    adminGetCourseList (params) {
      return apiRequest('/course/adminGetCourseList', 'post', params)
    },
    adminGetClassTeacherList (params) {
      return apiRequest('/user/adminGetClassTeacherList', 'post', params)
    }
  },
  post: function (command, data) {
    return apiRequest(command, data, 'post')
  },

  get: function (command, data, cb) {
    return apiRequest(command, data, 'get')
  }
}
