import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useToolsStore = defineStore('tools', () => {
  // Store form state for each tool to prevent data loss on routing away
  
  // Invoice Tool State
  const invoiceState = ref({
    clientName: '',
    items: [{ id: '1', name: '', price: 0, qty: 1 }],
    taxRate: 0,
  });

  // Profit Margin State
  const marginState = ref({
    cost: 0,
    sellingPrice: 0,
  });

  // Discount Calculator State
  const discountState = ref({
    originalPrice: 0,
    discountPercentage: 0,
  });

  // Loan Calculator State
  const loanState = ref({
    amount: 0,
    interestRate: 0,
    durationMonths: 0,
  });

  // Dropship Calculator State
  const dropshipState = ref({
    productCost: 0,
    sellingPrice: 0,
    adCost: 0,
  });

  // VAT Calculator State
  const vatState = ref({
    amount: 0,
    rate: 20,
    isRemoving: false,
  });

  // Compound Interest State
  const compoundState = ref({
    principal: 0,
    rate: 5,
    years: 10,
    compounding: 12,
  });

  // PayPal Fee State
  const paypalState = ref({
    amount: 0,
    rate: 4.4,
    fixed: 0.30,
  });

  // Stripe Fee State
  const stripeState = ref({
    amount: 0,
    rate: 2.9,
    fixed: 0.30,
  });

  // Unit Converter State
  const unitState = ref({
    value: 0,
    from: 'kg',
    to: 'lb',
  });

  // Sales Tax State
  const salesTaxState = ref({
    amount: 0,
    taxRate: 6,
  });

  // Salary State
  const salaryState = ref({
    amount: 0,
    frequency: 'hourly',
  });

  // ROI State
  const roiState = ref({
    amountInvested: 0,
    amountReturned: 0,
  });

  // Percent Change State
  const percentChangeState = ref({
    oldValue: 0,
    newValue: 0,
  });

  // Marketplace Fees State
  const marketplaceState = ref({
    price: 0,
    platform: 'amazon',
  });

  return {
    invoiceState,
    marginState,
    discountState,
    loanState,
    dropshipState,
    vatState,
    compoundState,
    paypalState,
    stripeState,
    unitState,
    salesTaxState,
    salaryState,
    roiState,
    percentChangeState,
    marketplaceState
  };
});
