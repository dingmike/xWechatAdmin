import lazyLoading from './lazyLoading'

export default {
  name: '渠道管理',
  path: '/channels',
  meta: {
    icon: 'fa-table',
    expanded: false
  },
  component: lazyLoading('channels', true),

  children: [
    {
      name: '渠道列表',
      path: 'list',
      component: lazyLoading('channels/List')
    },
    {
      name: '添加渠道',
      path: 'add',
      component: lazyLoading('channels/Edit')
    },
    {
      name: '编辑渠道',
      path: 'edit/:id',
      hide: true,
      component: lazyLoading('channels/Edit')
    }
  ]
}
