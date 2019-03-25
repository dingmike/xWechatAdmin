import lazyLoading from './lazyLoading'

export default {
  name: '胶囊管理',
  path: '/capsule',
  meta: {
    icon: 'fa-tachometer',
    expanded: false
  },
  component: lazyLoading('capsule', true),

  children: [
    {
      name: '胶囊列表',
      path: 'list',
      component: lazyLoading('capsule/List')
    },
    {
      name: '胶囊列表',
      path: 'list/:filter',
      hide: true,
      component: lazyLoading('capsule/List')
    },
    {
      name: '添加胶囊',
      path: 'add',
      component: lazyLoading('capsule/Edit')
    },
    {
      name: '计划列表',
      path: 'plan/list',
      component: lazyLoading('capsule/PlanList')
    },
    {
      name: '编辑胶囊',
      path: 'edit/:id/:tab',
      hide: true,
      component: lazyLoading('capsule/Edit')
    },
    {
      name: '旧胶囊用户',
      path: 'user/old',
      component: lazyLoading('capsule/User')
    },
    {
      name: '新胶囊用户',
      path: 'user/new',
      component: lazyLoading('capsule/User')
    },
    {
      name: '添加计划',
      path: 'plan/addPlan',
      hide: true,
      component: lazyLoading('capsule/AddPlan')
    },
    {
      name: '编辑计划',
      path: 'plan/editPlan/:id',
      hide: true,
      component: lazyLoading('capsule/AddPlan')
    }
  ]
}
