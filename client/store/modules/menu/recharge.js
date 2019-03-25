import lazyLoading from './lazyLoading'

export default {
  name: '充值管理',
  path: '/recharge',
  meta: {
    icon: 'fa-building-o',
    expanded: false
  },
  component: lazyLoading('recharge', true),

  children: [
    {
      name: '充值设置',
      path: 'list',
      component: lazyLoading('recharge/ChannelList')
    },
    {
      name: '充值设置',
      path: 'list/:channelId',
      hide: true,
      component: lazyLoading('recharge/ChannelList')
    },
    {
      name: '添加渠道充值方案',
      path: 'addChannel',
      component: lazyLoading('recharge/AddChannelScheme')
    },
    {
      name: '添加渠道充值项',
      path: 'add/:channelId',
      hide: true,
      component: lazyLoading('recharge/Edit')
    },
    {
      name: '修改渠道充值项',
      path: 'edit/:channelId/:id',
      hide: true,
      component: lazyLoading('recharge/Edit')
    },
    {
      name: '充值记录',
      path: 'recordfilter',
      component: lazyLoading('recharge/RecordFilter')
    }
  ]
}
