import lazyLoading from './lazyLoading'

export default {
  name: '游学课程资料管理',
  path: '/materials_tour',
  hide: true,
  meta: {
    icon: 'fa-table',
    expanded: false
  },
  component: lazyLoading('materials_tour', true),

  children: [
    {
      name: '游学课程资料列表',
      path: 'list',
      hide: true,
      component: lazyLoading('materials_tour/List')
    },
    {
      name: '游学课程资料列表',
      path: 'list/:page',
      hide: true,
      component: lazyLoading('materials_tour/List')
    },
    {
      name: '添加游学课程资料',
      path: 'add',
      hide: true,
      // hide: true,
      component: lazyLoading('materials_tour/Add')
    },
    {
      name: '编辑游学课程资料',
      path: 'edit/:id',
      hide: true,
      component: lazyLoading('materials_tour/Add')
    }
  ]
}
