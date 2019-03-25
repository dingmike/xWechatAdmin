import lazyLoading from './lazyLoading'

export default {
  name: '共学管理',
  path: '/learns',
  meta: {
    icon: 'fa-table',
    expanded: false
  },
  component: lazyLoading('learns', true),

  children: [
    {
      name: '共学列表',
      path: 'list',
      component: lazyLoading('learns/List')
    },
    {
      name: '添加共学',
      path: 'add',
      // hide: true,
      component: lazyLoading('learns/Edit')
    },
    {
      name: '编辑共学',
      path: 'edit/:id',
      hide: true,
      component: lazyLoading('learns/Edit')
    }
  ]
}
