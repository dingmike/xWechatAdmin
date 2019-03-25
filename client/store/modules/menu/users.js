import lazyLoading from './lazyLoading'

export default {
  name: '管理员管理',
  path: '/users',
  meta: {
    icon: 'fa-table',
    expanded: false
  },
  component: lazyLoading('users', true),

  children: [
    {
      name: '管理员列表',
      path: 'admin',
      component: lazyLoading('users/AdminList')
    },
    {
      name: '添加管理员',
      path: 'add_admin',
      component: lazyLoading('users/AdminEdit')
    },
    {
      name: '编辑管理员',
      path: 'admin_edit/:id',
      hide: true,
      component: lazyLoading('users/AdminEdit')
    }
    // {
    //   name: '用户角色',
    //   path: 'label_add',
    //   component: lazyLoading('users/LabelAdd')
    // },
    // {
    //   name: '添加用户角色',
    //   path: 'label_add',
    //   component: lazyLoading('users/LabelAdd')
    // },
    // {
    //   name: '权限管理',
    //   path: 'label_add',
    //   component: lazyLoading('users/LabelAdd')
    // },
    // {
    //   name: '家长管理',
    //   path: 'parent',
    //   component: lazyLoading('users/ParentList')
    // }
  ]
}
