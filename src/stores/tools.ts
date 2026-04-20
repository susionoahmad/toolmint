import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useToolsStore = defineStore('tools', () => {
  // Store form state for each tool to prevent data loss on routing away
  
  // Invoice Tool State
  const invoiceState = ref({
    clientName: '',
    items: [{ id: '1', name: '', price: 0, qty: 1 }],
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

  return {
    invoiceState,
    marginState,
    discountState,
    loanState,
    dropshipState
  };
});
