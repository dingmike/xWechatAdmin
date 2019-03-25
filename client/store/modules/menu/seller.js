import lazyLoading from './lazyLoading'

export default {
  name: '销售人员管理',
  path: '/seller',
  meta: {
    icon: 'fa-building-o',
    expanded: false
  },
  component: lazyLoading('seller', true),

  children: [
    {
      name: '销售人员列表',
      path: 'list/1',
      component: lazyLoading('seller/List')
    },
    {
      name: '销售人员列表',
      path: 'list/:page',
      hide: true,
      component: lazyLoading('seller/List')
    },
    {
      name: '添加销售人员',
      path: 'add',
      component: lazyLoading('seller/Add')
    },
    {
      name: '编辑销售人员信息',
      path: 'edit/:id',
      hide: true,
      component: lazyLoading('seller/Edit')
    }
  ]
}
