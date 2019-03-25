import lazyLoading from './lazyLoading'

export default {
  name: '用户管理',
  path: '/userAdminChannel',
  meta: {
    icon: 'fa-tachometer',
    expanded: false
  },
  component: lazyLoading('userAdmin_channel', true),

  children: [
    {
      name: '一阶用户列表',
      path: 'list',
      component: lazyLoading('userAdmin_channel/List')
    },
    {
      name: '一阶用户消费记录(付款成功)',
      path: 'userRecord',
      component: lazyLoading('userAdmin_channel/userRecord')
    },
    {
      name: '一阶用户消费记录(付款成功)',
      path: 'userItemRecord/:id',
      hide: true,
      component: lazyLoading('userAdmin_channel/userItemRecord')
    }
  ]
}
