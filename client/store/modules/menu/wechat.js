import lazyLoading from './lazyLoading'

export default {
  name: '微信管理',
  path: '/wechat',
  meta: {
    icon: 'fa-building-o',
    expanded: false
  },
  component: lazyLoading('wechat', true),

  children: [
    {
      name: '微信菜单管理',
      path: 'config',
      component: lazyLoading('wechat/Config')
    },
    {
      name: '消息回复',
      path: 'label_add',
      component: lazyLoading('wechat/LabelAdd')
    }
  ]
}
