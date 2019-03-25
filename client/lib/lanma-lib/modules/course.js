'use strict'

// import api from '../common/api'
// import config from '../config'
import helper from '../helper'
import labelModule from './label'
// import _ from 'lodash'

function formatCourse (course) {
  var material = course.material
  material.cover = helper.getImageUrl(material.cover)
  course.statusTitle = helper.getCourseStatus(course.status)
  course.lesson_time = course.lesson_time.substr(0, 16)
  course.sign_up_time = course.sign_up_time.substr(0, 16)
  course.ageLabel = labelModule.getLabel(material.age).title
  course.targetLabel = labelModule.getLabel(material.target).title
  course.themeLabel = labelModule.getLabel(material.theme).title
  course.sceneLabel = labelModule.getLabel(material.scene).title

  return course
}

export default {
  // getCurrentUserInfo,
  formatCourse
}
