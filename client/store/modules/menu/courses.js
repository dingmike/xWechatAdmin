import lazyLoading from './lazyLoading'

export default {
  name: '课程管理',
  path: '/courses',
  meta: {
    icon: 'fa-building-o',
    expanded: false
  },
  component: lazyLoading('courses', true),

  children: [
    {
      name: '课程列表',
      path: 'list/:type',
      component: lazyLoading('courses/List')
    },
    {
      name: '课程列表',
      path: 'list/:type/:page',
      hide: true,
      component: lazyLoading('courses/List')
    },
    {
      name: '添加课程',
      path: 'add/:material_id/:material_type',
      // hide: true,
      component: lazyLoading('courses/Edit')
    },
    {
      name: '编辑课程',
      path: 'edit/:id/:tab',
      hide: true,
      component: lazyLoading('courses/Edit')
    },
    {
      name: '报名入口',
      path: 'qrcode/:id',
      hide: true,
      component: lazyLoading('courses/QrCode')
    },
    // {
    //   name: '订单',
    //   path: 'label',
    //   component: lazyLoading('courses/index')
    // },
    // {
    //   name: '报告列表',
    //   path: 'report_list',
    //   component: lazyLoading('courses/ReportList')
    // },
    // {
    //   name: '添加报告',
    //   path: 'report_add',
    //   // hide: true,
    //   component: lazyLoading('courses/EditReport')
    // },
    {
      name: '编辑报告',
      path: 'report_edit/:id',
      hide: true,
      component: lazyLoading('courses/EditReport')
    }
  ]
}
