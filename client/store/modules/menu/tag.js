import lazyLoading from './lazyLoading'

export default {
  name: '课程标签管理',
  path: '/system',
  meta: {
    icon: 'fa-laptop',
    expanded: false
  },
  component: lazyLoading('system', true),

  children: [
    // {
    //   name: '系统设置',
    //   path: 'config',
    //   component: lazyLoading('system/index')
    // },
    {
      name: '课程标签列表',
      path: 'label_list',
      component: lazyLoading('system/LabelList')
    },
    {
      name: '添加课程标签',
      path: 'label_add',
      // hide: true,
      component: lazyLoading('system/LabelEdit')
    },
    {
      name: '添加子标签',
      path: 'add_child_label/:id',
      hide: true,
      component: lazyLoading('system/LabelEdit')
    },
    {
      name: '编辑课程标签',
      path: 'label_edit/:id',
      hide: true,
      component: lazyLoading('system/LabelEdit')
    },
    {
      name: '标签关联',
      path: 'label_relate/:id/:root_id',
      hide: true,
      component: lazyLoading('system/LabelRelate')
    }
    // {
    //   name: '缓存管理',
    //   path: 'cache',
    //   component: lazyLoading('system/index')
    // }
  ]
}
