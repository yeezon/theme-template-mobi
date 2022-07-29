
import NotFound from '@/views/NotFound'
import Home from '@/views/Home'
import Page from '@/views/Page'
import Product from '@/views/Product'
import Auth from '@/views/Auth'
import Account from '@/views/Account'
import AccountOrders from '@/views/Account/Orders'
import AccountOrder from '@/views/Account/Order'
import OrderShipmentTracker from '@/views/Account/OrderShipmentTracker'
import AccountMember from '@/views/Account/Member'
import AccountPoints from '@/views/Account/Points'
import AccountUser from '@/views/Account/User'
import AccountEdit from '@/views/Account/Edit'
import AccountSecurity from '@/views/Account/Security'
import AccountPassword from '@/views/Account/Password'
import Checkout from '@/views/Checkout'
import Addresses from '@/views/Addresses'
import AddressesSelect from '@/views/Addresses/Select'
import AddressEdit from '@/views/Addresses/Edit'
import Search from '@/views/Search'
import Cart from '@/views/Cart'
import Discount from '@/views/Discount'

import CouponList from '@/components/Coupon/List'

// 后续优化支持异步
const oShop = window.$$shop || {}

const routes = [
  {
    path: '/',
    name: '推荐',
    component: Home
  },
  {
    path: '/pages/:handle',
    name: '页面',
    component: Page,
    props: true
  },
  {
    path: '/products/:handle',
    name: '商品',
    component: Product,
    props: true
  },
  {
    path: '/discounts/:handle',
    name: '营销活动',
    component: Discount,
    props: true
  },
  {
    path: '/account/login',
    name: '登录',
    component: Auth
  },
  {
    path: '/account/register',
    name: '注册',
    component: Auth
  },
  {
    path: '/account/forget_password',
    name: '找回密码',
    component: Auth
  },
  {
    path: '/account',
    name: '个人中心',
    component: Account
  },
  {
    path: '/account/orders',
    name: '订单列表',
    component: AccountOrders,
    meta: {
      isAuth: true
    }
  },
  {
    path: '/account/orders/:no',
    name: '订单',
    component: AccountOrder,
    meta: {
      isAuth: !oShop.enable_checkout_anonymously
    }
  },
  {
    path: '/account/orders/:no/tracker',
    name: '配送信息',
    component: OrderShipmentTracker,
    meta: {
      isAuth: true
    }
  },
  {
    path: '/account/addresses',
    name: '地址管理',
    component: Addresses,
    meta: {
      isAuth: true
    }
  },
  {
    path: '/account/addresses/:id',
    name: 'address_edit',
    component: AddressEdit,
    props (route) {
      return {
        mode: route.query.mode || '',
        addressId: route.params.id || null
      }
    },
    meta: {
      isAuth: !oShop.enable_checkout_anonymously
    }
  },
  {
    path: '/account/member',
    name: '会员等级',
    component: AccountMember,
    meta: {
      isAuth: true
    }
  },
  {
    path: '/account/coupon',
    name: '优惠券',
    component: CouponList,
    meta: {
      isAuth: true
    }
  },
  {
    path: '/account/points',
    name: '积分',
    component: AccountPoints,
    meta: {
      isAuth: true
    }
  },
  {
    path: '/account/user',
    name: '个人信息',
    component: AccountUser,
    meta: {
      isAuth: true
    }
  },
  {
    path: '/account/user/edit',
    name: '个人信息 - 编辑',
    component: AccountEdit,
    meta: {
      isAuth: true
    }
  },
  {
    path: '/account/security',
    name: '安全设置',
    component: AccountSecurity,
    meta: {
      isAuth: true
    }
  },
  {
    path: '/account/change_password',
    name: '修改账号密码',
    component: AccountPassword,
    meta: {
      isAuth: true
    }
  },
  {
    path: '/find',
    name: '发现',
    component: Search,
    props: {
      showNavBar: false
    }
  },
  {
    path: '/products',
    name: '商品列表',
    redirect: '/find'
  },
  {
    path: '/cart',
    name: '购物车',
    component: Cart
  },
  {
    path: '/search',
    name: '搜索',
    component: Search
  },
  {
    path: '/account/create_order',
    name: '创建订单',
    component: Checkout,
    meta: {
      isAuth: !oShop.enable_checkout_anonymously
    }
  },
  {
    path: '/account/addresses_select',
    name: '地址选择',
    component: AddressesSelect,
    props (route) {
      return {
        selectId: route.query.id || null
      }
    },
    meta: {
      isAuth: !oShop.enable_checkout_anonymously
    }
  },
  {
    path: '*',
    name: 'not_found',
    component: NotFound
  }
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
  // }
]

export default routes
