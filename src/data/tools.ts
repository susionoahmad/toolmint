import { 
  Receipt, 
  Percent, 
  Tag, 
  Landmark, 
  Calculator, 
  TrendingUp, 
  Wallet, 
  CreditCard 
} from 'lucide-vue-next';
import type { Component } from 'vue';

export interface ToolItem {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: Component;
  category: 'billing' | 'finance' | 'ecommerce';
  cta: string;
}

export const tools: ToolItem[] = [
  {
    id: 'invoice',
    title: 'Invoice Generator',
    description: 'Create professional PDF invoices instantly to bill your clients accurately.',
    route: '/invoice',
    icon: Receipt,
    category: 'billing',
    cta: 'Create Invoice →'
  },
  {
    id: 'paypal-fees',
    title: 'PayPal Fees',
    description: 'Calculate transaction fees and exact net receipts for global PayPal payments.',
    route: '/paypal-fees',
    icon: Wallet,
    category: 'billing',
    cta: 'Check Net Value →'
  },
  {
    id: 'stripe-fees',
    title: 'Stripe Fees',
    description: 'Estimate payout amounts after Stripe processing fees for e-commerce and SaaS.',
    route: '/stripe-fees',
    icon: CreditCard,
    category: 'billing',
    cta: 'Optimize Payout →'
  },
  {
    id: 'vat-calc',
    title: 'VAT Calculator',
    description: 'Easily calculate VAT added or removed for invoices and global business transactions.',
    route: '/vat',
    icon: Calculator,
    category: 'billing',
    cta: 'Analyze VAT →'
  },
  {
    id: 'margin-calc',
    title: 'Margin Calculator',
    description: 'Determine your profit and margin percentages quickly to optimize your pricing strategy.',
    route: '/margin',
    icon: Calculator,
    category: 'ecommerce',
    cta: 'Check Profit →'
  },
  {
    id: 'discount-calc',
    title: 'Discount Calculator',
    description: 'Find out exactly how much you save and the final price after applying discount percentages.',
    route: '/discount',
    icon: Tag,
    category: 'ecommerce',
    cta: 'See Savings →'
  },
  {
    id: 'dropship-calc',
    title: 'Dropship Profit Calc',
    description: 'Analyze net profit and margins by factoring in ad spend and product cost.',
    route: '/dropship',
    icon: Percent,
    category: 'ecommerce',
    cta: 'View ROI →'
  },
  {
    id: 'loan-calc',
    title: 'Loan Calculator',
    description: 'Estimate your monthly loan payments easily based on amount and interest rate.',
    route: '/loan',
    icon: Landmark,
    category: 'finance',
    cta: 'Plan Payments →'
  },
  {
    id: 'compound-interest',
    title: 'Compound Interest',
    description: 'Visualize long-term savings growth and future values with compounding frequency.',
    route: '/compound-interest',
    icon: TrendingUp,
    category: 'finance',
    cta: 'Grow Wealth →'
  }
];
