import lazyLoading from './lazyLoading'

export default {
  name: '商品销售管理',
  path: '/commodity',
  meta: {
    icon: 'fa-building-o',
    expanded: false
  },
  component: lazyLoading('commodity', true),

  children: [
    {
      name: '商品列表',
      path: 'list',
      component: lazyLoading('commodity/List')
    },
    {
      name: '商品列表',
      path: 'list/:page',
      hide: true,
      component: lazyLoading('commodity/List')
    },
    {
      name: '销售记录',
      path: 'recordfilter',
      component: lazyLoading('commodity/RecordFilter')
    },
    {
      name: '添加商品',
      path: 'add',
      component: lazyLoading('commodity/Edit')
    },
    {
      name: '添加商品',
      path: 'add/:courseid',
      hide: true,
      component: lazyLoading('commodity/Edit')
    },
    {
      name: '编辑商品',
      path: 'edit/:id',
      hide: true,
      component: lazyLoading('commodity/Edit')
    },
    {
      name: '组合课程详情',
      path: 'group_detail/:id',
      hide: true,
      component: lazyLoading('combination/Detail')
    },
    {
      name: '课程详情',
      path: 'single_detail/:id/:tab',
      hide: true,
      component: lazyLoading('courses/Edit')
    },
    {
      name: '分销渠道列表',
      path: 'channel/:commodityId',
      hide: true,
      component: lazyLoading('commodity/Channel')
    },
    {
      name: '商品销售记录列表',
      path: 'record/:commodityId',
      hide: true,
      component: lazyLoading('commodity/Record')
    },
    {
      name: '渠道销售记录列表',
      path: 'record/:commodityId/:channelId',
      hide: true,
      component: lazyLoading('commodity/Record')
    }
  ]
}
