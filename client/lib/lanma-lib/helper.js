import config from './config'

function getImageUrl (url) {
  if (url && url.indexOf('http') === -1) {
    url = 'http://img.xinjijiaoyu.com' + url
  }
  return url
}

function getCourseStatus (status) {
  return config.status.course[status]
}

function getUrlParamCollection () {
  var url = window.location.href
  var theRequest = {}
  var idx = url.indexOf('?')
  if (idx !== -1) {
    var str = url.substr(idx + 1)
    var strs = str.split('&')
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
    }
  }
  return theRequest
}

function getUrlParam (key, defaultVal) {
  var params = getUrlParamCollection()
  console.log(params)
  if (params[key]) {
    return params[key]
  } else {
    return defaultVal
  }
}

export default {
  getImageUrl,
  getCourseStatus,
  getUrlParam
}
