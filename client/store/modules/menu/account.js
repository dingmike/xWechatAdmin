import lazyLoading from './lazyLoading'

export default {
  name: '账号管理',
  path: '/account',
  meta: {
    icon: 'fa-tachometer',
    expanded: false
  },
  component: lazyLoading('account', true),

  children: [
    {
      name: '修改密码',
      path: 'edit',
      component: lazyLoading('account/Edit')
    }
  ]
}
