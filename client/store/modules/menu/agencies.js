import lazyLoading from './lazyLoading'

export default {
  name: '老师管理',
  path: '/agencies',
  meta: {
    icon: 'fa-building-o',
    expanded: false
  },
  component: lazyLoading('agencies', true),

  children: [
    {
      name: '老师列表',
      path: 'list',
      component: lazyLoading('agencies/List')
    },
    {
      name: '添加机构',
      path: 'add',
      hide: true,
      component: lazyLoading('agencies/Edit')
    },
    {
      name: '编辑老师',
      path: 'edit/:id',
      hide: true,
      component: lazyLoading('agencies/Edit')
    },
    {
      name: '编辑老师',
      path: 'thirdPartyEdit/:id',
      hide: true,
      component: lazyLoading('agencies/thirdPartyEdit')
    }
  ]
}
