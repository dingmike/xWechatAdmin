import lazyLoading from './lazyLoading'

export default {
  name: '商品销售管理',
  path: '/commodity_channel',
  meta: {
    icon: 'fa-building-o',
    expanded: false
  },
  component: lazyLoading('commodity_channel', true),

  children: [
    {
      name: '商品列表',
      path: 'list/1',
      component: lazyLoading('commodity_channel/List')
    },
    {
      name: '商品列表',
      path: 'list/:page',
      hide: true,
      component: lazyLoading('commodity_channel/List')
    },
    {
      name: '课程详情',
      path: 'detail/:id',
      hide: true,
      component: lazyLoading('combination/Detail')
    },
    {
      name: '销售记录列表',
      path: 'record/:commodityId/:page',
      hide: true,
      component: lazyLoading('commodity_channel/Record')
    },
    {
      name: '销售日志列表',
      path: 'saleslog/1',
      component: lazyLoading('commodity_channel/Record')
    },
    {
      name: '销售日志列表',
      path: 'saleslog/:page',
      hide: true,
      component: lazyLoading('commodity_channel/Record')
    },
    {
      name: '充值日志列表',
      path: 'rechargelog/1',
      component: lazyLoading('commodity_channel/Recharge')
    },
    {
      name: '充值日志列表',
      path: 'rechargelog/:page',
      hide: true,
      component: lazyLoading('commodity_channel/Recharge')
    }
  ]
}
