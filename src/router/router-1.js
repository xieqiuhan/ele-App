import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
/* eslint-disable */
import Goods from '../components/goods/goods.vue';
import Ratings from '../components/ratings/ratings.vue';
import Seller from '../components/seller/seller.vue';

const routes = [
  { path: '/goods', component: Goods },
  { path: '/ratings', component: Ratings },
  { path: '/seller', component: Seller },
  {path: '*',component:Goods}
];

const router = new VueRouter({
  mode: 'history',
  routes,
  linkActiveClass: 'is-active',
});

export default router;
