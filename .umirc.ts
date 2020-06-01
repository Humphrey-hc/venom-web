import { defineConfig } from 'umi';

export default defineConfig({
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
  ],
});
