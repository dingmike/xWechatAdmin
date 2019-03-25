const course = [
  '', // '未确认',
  '', // '已确认',
  '', // '无效',
  '', // '删除',
  '',
  '', // '未报名',
  '', // '报名中',
  '未上课',
  '上课',
  '总结',
  '结束',
  '取消'
]

const order = {
  0: '未确认',
  1: '已确认',
  2: '已取消',
  3: '无效',
  4: '退款',
  5: '已签到'
}

const defaultStatus = {
  0: '未审核',
  1: '已审核',
  2: '审核不通过',
  3: '删除'
}

const courseType = {
  1: '购买',
  2: '直接上课',
  3: '联合销售'
}
export default {
  defaultStatus,
  course,
  order,
  courseType
}
