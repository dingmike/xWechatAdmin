import lazyLoading from './lazyLoading'

export default {
  name: '优惠券管理',
  path: '/coupons',
  meta: {
    icon: 'fa-table',
    expanded: false
  },
  component: lazyLoading('coupons', true),

  children: [
    {
      name: '优惠券列表',
      path: 'list',
      component: lazyLoading('coupons/List')
    },
    {
      name: '添加优惠券',
      path: 'add',
      component: lazyLoading('coupons/Edit')
    },
    {
      name: '编辑优惠券',
      path: 'edit/:id',
      hide: true,
      component: lazyLoading('coupons/Edit')
    }
  ]
}
