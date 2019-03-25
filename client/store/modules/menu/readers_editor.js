import lazyLoading from './lazyLoading'

export default {
  name: '共读管理',
  path: '/readers_editor',
  meta: {
    icon: 'fa-table',
    expanded: false
  },
  component: lazyLoading('readers_editor', true),

  children: [
    {
      name: '共读列表',
      path: 'list/0/1',
      component: lazyLoading('readers_editor/List')
    },
    {
      name: '共读列表',
      path: 'list/:status/:page',
      hide: true,
      component: lazyLoading('readers_editor/List')
    },
    {
      name: '添加共读',
      path: 'add',
      component: lazyLoading('readers_editor/Edit')
    },
    // {
    //   name: '文本编辑',
    //   path: 'textedit',
    //   component: lazyLoading('readers/TextEditor')
    // },
    {
      name: '编辑共读',
      path: 'edit/:id',
      hide: true,
      component: lazyLoading('readers_editor/Edit')
    }
  ]
}
