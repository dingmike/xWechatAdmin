import lazyLoading from './lazyLoading'

export default {
  name: '订单管理',
  path: '/orders',
  meta: {
    icon: 'fa-table',
    expanded: false
  },
  component: lazyLoading('orders', true),

  children: [
    {
      name: '共学订单',
      path: 'list',
      component: lazyLoading('orders/LearnList')
    },
    {
      name: '筛选共学订单',
      path: 'list/:id',
      hide: true,
      component: lazyLoading('orders/LearnList')
    },
    {
      name: '编辑共学订单',
      path: 'edit/:id',
      hide: true,
      component: lazyLoading('orders/Edit')
    }
  ]
}
