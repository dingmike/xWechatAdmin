import lazyLoading from './lazyLoading'

export default {
  name: '认证管理',
  path: '/capsuleAuth',
  meta: {
    icon: 'fa-tachometer',
    expanded: false
  },
  component: lazyLoading('capsuleAuth', true),

  children: [
    {
      name: '认证列表',
      path: 'list',
      component: lazyLoading('capsuleAuth/List')
    },
    {
      name: '认证列表',
      path: 'list/:page',
      hide: true,
      component: lazyLoading('capsuleAuth/List')
    },
    {
      name: '添加认证',
      path: 'add',
      component: lazyLoading('capsuleAuth/Edit')
    },
    {
      name: '编辑认证',
      path: 'edit/:id',
      hide: true,
      component: lazyLoading('capsuleAuth/Edit')
    }
  ]
}
