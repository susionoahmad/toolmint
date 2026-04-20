import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', component: () => import('../pages/Home.vue'), meta: { title: 'Free Business & Finance Tools' } },
  { path: '/invoice', component: () => import('../pages/Invoice.vue'), meta: { title: 'Free Invoice Generator - Create PDF Instantly' } },
  { path: '/margin', component: () => import('../pages/Margin.vue'), meta: { title: 'Profit Margin Calculator - Calculate Instantly' } },
  { path: '/discount', component: () => import('../pages/Discount.vue'), meta: { title: 'Discount Calculator - Find Savings Fast' } },
  { path: '/loan', component: () => import('../pages/Loan.vue'), meta: { title: 'Loan Calculator - Estimate Monthly Payments' } },
  { path: '/dropship', component: () => import('../pages/Dropship.vue'), meta: { title: 'Dropship Profit Calculator - Advanced Analytics' } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
