import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', component: () => import('../pages/Home.vue'), meta: { title: 'Free Business & Finance Tools' } },
  { path: '/invoice', component: () => import('../pages/Invoice.vue'), meta: { title: 'Free Invoice Generator - Create PDF Instantly' } },
  { path: '/margin', component: () => import('../pages/Margin.vue'), meta: { title: 'Profit Margin Calculator - Calculate Instantly' } },
  { path: '/discount', component: () => import('../pages/Discount.vue'), meta: { title: 'Discount Calculator - Find Savings Fast' } },
  { path: '/loan', component: () => import('../pages/Loan.vue'), meta: { title: 'Loan Calculator - Estimate Monthly Payments' } },
  { path: '/dropship', component: () => import('../pages/Dropship.vue'), meta: { title: 'Dropship Profit Calculator - Advanced Analytics' } },
  { path: '/vat', component: () => import('../pages/VAT.vue'), meta: { title: 'VAT Calculator - Add or Remove VAT Instantly' } },
  { path: '/compound-interest', component: () => import('../pages/CompoundInterest.vue'), meta: { title: 'Compound Interest Calculator - Future Value Growth' } },
  { path: '/paypal-fees', component: () => import('../pages/PayPalFees.vue'), meta: { title: 'PayPal Fee Calculator - Net Profit Estimator' } },
  { path: '/stripe-fees', component: () => import('../pages/StripeFees.vue'), meta: { title: 'Stripe Fee Calculator - Global Payouts' } },
  { path: '/privacy', component: () => import('../pages/PrivacyPolicy.vue'), meta: { title: 'Privacy Policy - ToolMint' } },
  { path: '/terms', component: () => import('../pages/TermsOfService.vue'), meta: { title: 'Terms of Service - ToolMint' } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
