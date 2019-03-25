import lazyLoading from './lazyLoading'

export default {
  name: '机构管理',
  path: '/thirdParty',
  meta: {
    icon: 'fa-building-o',
    expanded: false
  },
  component: lazyLoading('agencies', true),

  children: [
    {
      name: '机构列表',
      path: 'thirdPartyList',
      component: lazyLoading('thirdParty/thirdParty/ThirdPartyList')
    },
    {
      name: '机构课件',
      path: 'materialsList',
      component: lazyLoading('thirdParty/materials/MaterialsList')
    },
    {
      name: '课件编辑',
      path: 'materialsEdit/:id',
      hide: true,
      component: lazyLoading('thirdParty/materials/Edit')
    },
    {
      name: '课件编辑',
      path: 'materialsEditTour/:id',
      hide: true,
      component: lazyLoading('thirdParty/materials/TourEdit')
    },
    {
      name: '机构课程',
      path: 'courseList',
      component: lazyLoading('thirdParty/course/CourseList')
    },
    {
      name: '编辑课程',
      path: 'courseEdit/:id/:tab',
      hide: true,
      component: lazyLoading('thirdParty/course/CourseEdit')
    },
    {
      name: '老师列表',
      path: 'teachList',
      component: lazyLoading('thirdParty/teach/TeachList')
    }
  ]
}
