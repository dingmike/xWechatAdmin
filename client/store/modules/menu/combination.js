import lazyLoading from './lazyLoading'

export default {
  name: '课程组合管理',
  path: '/combination',
  meta: {
    icon: 'fa-building-o',
    expanded: false
  },
  component: lazyLoading('combination', true),

  children: [
    {
      name: '课程组合列表',
      path: 'list',
      component: lazyLoading('combination/List')
    },
    {
      name: '课程组合列表',
      path: 'list/:page',
      hide: true,
      component: lazyLoading('combination/List')
    },
    {
      name: '添加课程组合',
      path: 'add',
      component: lazyLoading('combination/Edit')
    },
    {
      name: '编辑课程组合',
      path: 'edit/:id',
      hide: true,
      component: lazyLoading('combination/Edit')
    },
    {
      name: '课程组合详情',
      path: 'detail/:id',
      hide: true,
      component: lazyLoading('combination/Detail')
    }
  ]
}
