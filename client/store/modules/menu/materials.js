import lazyLoading from './lazyLoading'

export default {
  name: '课程资料管理',
  path: '/materials',
  redirect: '/materials/list',
  meta: {
    icon: 'fa-table',
    expanded: false
  },
  chilrenHide: true,
  component: lazyLoading('materials', true),

  children: [
    {
      name: '课程资料列表',
      path: 'list',
      hide: true,
      component: lazyLoading('materials/List')
    },
    {
      name: '课程资料列表',
      path: 'list/:page',
      hide: true,
      component: lazyLoading('materials/List')
    },
    {
      name: '添加课程资料',
      path: 'add',
      hide: true,
      component: lazyLoading('materials/Add')
    },
    {
      name: '编辑课程资料',
      path: 'edit/:id',
      hide: true,
      component: lazyLoading('materials/Add')
    }
  ]
}
