import lazyLoading from './lazyLoading'

export default {
  name: '用户管理',
  path: '/userAdmin',
  meta: {
    icon: 'fa-tachometer',
    expanded: false
  },
  component: lazyLoading('userAdmin', true),

  children: [
    {
      name: '用户列表',
      path: 'list',
      component: lazyLoading('userAdmin/List')
    },
    {
      name: '用户消费记录 (付款成功)',
      path: 'userRecord',
      component: lazyLoading('userAdmin/userRecord')
    },
    {
      name: '用户消费记录 (付款成功)',
      path: 'userItemRecord/:id',
      hide: true,
      component: lazyLoading('userAdmin/userItemRecord')
    }
  ]
}
