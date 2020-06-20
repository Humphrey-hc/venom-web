import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    //'SERVER_URL': 'http://119.45.35.97:8080'
    'SERVER_URL': 'http://localhost:8080'
  },
  nodeModulesTransform: {
    type: 'none',
  },
  layout: {},
  locale: { antd: true },
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/products', component: '@/pages/products' },
    { path: '/goods', component: '@/pages/goods/goodsManage' },
    { path: '/inGoods', component: '@/pages/inGoods/inGoodsManage' },
    { path: '/outGoods', component: '@/pages/outGoods/outGoodsManage' },
    { path: '/customer', component: '@/pages/customer/customerManage' },
  ]
});
