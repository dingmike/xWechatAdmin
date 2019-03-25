'use strict'

// import api from '../common/api'
// import config from '../config'
import helper from '../helper'
// import _ from 'lodash'
import labelModule from './label'

function formatMaterial (material) {
  material.cover = helper.getImageUrl(material.cover)
  material.ageLabel = labelModule.getLabel(material.age).title
  material.targetLabel = labelModule.getLabel(material.target).title
  material.themeLabel = labelModule.getLabel(material.theme).title
  material.sceneLabel = labelModule.getLabel(material.scene).title
  return material
}

export default {
  // getCurrentUserInfo,
  formatMaterial
}
