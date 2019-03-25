import lazyLoading from './lazyLoading'

export default {
  name: '运营管理',
  path: '/autoresp',
  meta: {
    icon: 'fa-building-o',
    expanded: false
  },
  component: lazyLoading('autoresp', true),

  children: [
    {
      name: '自动回复列表',
      path: 'list',
      component: lazyLoading('autoresp/List')
    },
    {
      name: '添加自动回复',
      path: 'add',
      hide: true,
      component: lazyLoading('autoresp/Edit')
    },
    {
      name: '编辑自动回复',
      path: 'edit/:index',
      hide: true,
      component: lazyLoading('autoresp/Edit')
    },
    {
      name: '选课页广告',
      path: 'courseAd',
      component: lazyLoading('autoresp/CourseAd')
    },
    {
      name: '添加广告',
      path: 'addAd',
      hide: true,
      component: lazyLoading('autoresp/AddCourseAd')
    },
    {
      name: '编辑广告',
      path: 'editAd/:id',
      hide: true,
      component: lazyLoading('autoresp/AddCourseAd')
    }
  ]
}
